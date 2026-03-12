import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { notifyNewLead } from '@/lib/notify';

// ─── Google Sheets → Supabase Lead Sync via Apps Script ──────────────────────
// Receives a POST webhook from a Google Sheet Apps Script whenever a new row 
// is added (e.g. Meta Ads lead appended via integration).

function isAuthorized(req: NextRequest, secret: string): boolean {
    const querySecret = new URL(req.url).searchParams.get('secret');
    if (querySecret && querySecret === process.env.CRON_SECRET) return true;
    if (secret && secret === process.env.CRON_SECRET) return true;

    // Allow admin cookie for manual testing via admin dashboard
    const { verifyToken, COOKIE_NAME } = require('@/lib/admin-auth');
    const token = req.cookies.get(COOKIE_NAME)?.value;
    return !!token && verifyToken(token);
}

// Generate a deterministic ID from sheet row to prevent duplicates
function generateLeadId(row: Record<string, any>): string {
    if (row.id && String(row.id).trim()) {
        return `gsheet_${String(row.id).trim()}`;
    }
    const parts = [
        row.full_name || row.name || '',
        row.email || row.email_address || '',
        row.phone_number || row.phone || '',
        row.created_time || '',
    ].map(v => String(v).trim().toLowerCase()).join('|');

    let hash = 0;
    for (let i = 0; i < parts.length; i++) {
        const char = parts.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return `gsheet_${Math.abs(hash).toString(36)}_${parts.length}`;
}

export function sheetRowToFieldData(row: Record<string, any>) {
    const FIELD_MAP: Record<string, string> = {
        full_name: 'full_name',
        name: 'full_name',
        first_name: 'first_name',
        last_name: 'last_name',
        email: 'email',
        email_address: 'email',
        phone_number: 'phone_number',
        phone: 'phone_number',
        mobile: 'phone_number',
        mobile_number: 'phone_number',
    };

    const fieldData: { name: string; values: string[] }[] = [];
    const seen = new Set<string>();

    for (const [rawKey, value] of Object.entries(row)) {
        if (!value || typeof value !== 'string') continue;

        const mapped = FIELD_MAP[rawKey.toLowerCase()] || rawKey.toLowerCase();
        if (seen.has(mapped)) continue;
        seen.add(mapped);

        if (['id', 'created_time', 'ad_id', 'ad_name', 'adset_id', 'adset_name',
            'campaign_id', 'campaign_name', 'form_id', 'form_name', 'platform',
            'is_organic', '_row_index'].includes(rawKey.toLowerCase())) continue;

        if (value.toString().trim()) {
            fieldData.push({ name: mapped, values: [value.toString().trim()] });
        }
    }

    return fieldData;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        
        if (!isAuthorized(req, body.secret)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const rows = body.rows;
        if (!Array.isArray(rows) || rows.length === 0) {
            return NextResponse.json({ error: 'Invalid or empty rows array' }, { status: 400 });
        }

        let synced = 0;
        let skipped = 0;
        let errors = 0;
        const newLeads: any[] = [];

        for (const row of rows) {
            try {
                // Skip empty rows
                if (!row.email && !row.phone && !row.full_name) continue;

                const leadgenId = generateLeadId(row);

                // Check idempotency
                const { data: existing } = await supabaseAdmin
                    .from('fb_leads')
                    .select('leadgen_id')
                    .eq('leadgen_id', leadgenId)
                    .single();

                if (existing) {
                    skipped++;
                    continue;
                }

                const fieldData = sheetRowToFieldData(row);

                const insertData: Record<string, any> = {
                    leadgen_id: leadgenId,
                    form_id: row.form_id || row.form_name || null,
                    ad_id: row.ad_id || null,
                    page_id: row.campaign_id || null,
                    adgroup_id: row.adset_id || null,
                    created_time: row.created_time
                        ? Math.floor(new Date(String(row.created_time)).getTime() / 1000) || null
                        : null,
                    field_data: fieldData,
                    raw_response: { source: 'google_sheets_webhook', original_row: row },
                    status: 'new',
                    notes: null,
                    received_at: row.created_time
                        ? new Date(String(row.created_time)).toISOString()
                        : new Date().toISOString(),
                };

                const { error } = await supabaseAdmin.from('fb_leads').insert(insertData);

                if (error) {
                    console.error(`[Webhook Sync] Insert error:`, error.message);
                    errors++;
                } else {
                    synced++;
                    newLeads.push({ fieldData, form_id: insertData.form_id });
                }
            } catch (err) {
                console.error(`[Webhook Sync] Error processing row:`, err);
                errors++;
            }
        }

        // Notify admins for true new leads only
        for (const lead of newLeads) {
            const gf = (name: string) => lead.fieldData.find((f: any) => f.name === name)?.values?.[0] ?? '';
            notifyNewLead({
                name: gf('full_name') || gf('first_name'),
                email: gf('email'),
                phone: gf('phone_number'),
                form: lead.form_id,
            }).catch(() => { /* silent */ });
        }

        try {
            await supabaseAdmin.from('gsheet_sync_log').insert({
                total: rows.length,
                synced,
                skipped,
                errors,
                triggered_by: 'webhook',
            });
        } catch (e) {
            // fire and forget failure
        }

        return NextResponse.json({ 
            success: true, 
            total: rows.length, 
            synced, 
            skipped, 
            errors,
            timestamp: new Date().toISOString()
        });

    } catch (err: any) {
        console.error('[Webhook Sync] Failed:', err);
        return NextResponse.json(
            { error: err.message || 'Sync failed' },
            { status: 500 }
        );
    }
}
