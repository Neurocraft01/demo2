import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { notifyNewLead } from '@/lib/notify';
// ─── Fetch Full Lead Data from Facebook Graph API ─────────────────────────────
async function fetchLeadFromFacebook(leadgenId: string) {
    const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
    if (!accessToken) {
        console.error('[FB Webhook] FACEBOOK_PAGE_ACCESS_TOKEN not set');
        return null;
    }
    try {
        const res = await fetch(
            `https://graph.facebook.com/v25.0/${leadgenId}?access_token=${accessToken}`
        );
        if (!res.ok) {
            const errText = await res.text();
            console.error('[FB Webhook] Graph API error:', errText);
            return null;
        }
        return res.json();
    } catch (err) {
        console.error('[FB Webhook] Failed to fetch from Graph API:', err);
        return null;
    }
}

// ─── GET: Facebook Webhook Verification Challenge ─────────────────────────────
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    const verifyToken = process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN;

    if (mode === 'subscribe' && token === verifyToken) {
        console.log('[FB Webhook] Verification successful');
        return new NextResponse(challenge, { status: 200 });
    }

    console.warn('[FB Webhook] Verification failed — token mismatch or wrong mode');
    return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

// ─── POST: Receive Lead Webhook Events ───────────────────────────────────────
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log('[FB Webhook] Payload received:', JSON.stringify(body));

        if (body.object !== 'page') {
            return NextResponse.json({ status: 'ignored' });
        }

        for (const entry of body.entry ?? []) {
            for (const change of entry.changes ?? []) {
                if (change.field !== 'leadgen') continue;

                const {
                    leadgen_id,
                    page_id,
                    form_id,
                    adgroup_id,
                    ad_id,
                    created_time,
                } = change.value;

                // Idempotency: skip if already saved
                const { data: existing } = await supabaseAdmin
                    .from('fb_leads')
                    .select('leadgen_id')
                    .eq('leadgen_id', leadgen_id)
                    .single();

                if (existing) {
                    console.log(`[FB Webhook] Lead ${leadgen_id} already exists — skipping`);
                    continue;
                }

                // Fetch full lead data from Facebook Graph API
                const leadData = await fetchLeadFromFacebook(leadgen_id);

                const { error } = await supabaseAdmin.from('fb_leads').insert({
                    leadgen_id,
                    page_id,
                    form_id,
                    adgroup_id,
                    ad_id,
                    created_time,
                    field_data: leadData?.field_data ?? [],
                    raw_response: leadData ?? null,
                    status: 'new',
                    notes: null,
                    received_at: new Date().toISOString(),
                });

                if (error) {
                    console.error('[FB Webhook] Supabase insert error:', error.message);
                } else {
                    console.log(`[FB Webhook] Lead ${leadgen_id} saved to Supabase`);
                    // 🔔 Fire admin notifications (non-blocking)
                    const fd = leadData?.field_data ?? [];
                    const gf = (name: string) => fd.find((f: any) => f.name === name)?.values?.[0] ?? '';
                    notifyNewLead({
                        name: gf('full_name') || gf('name'),
                        email: gf('email'),
                        phone: gf('phone_number') || gf('phone'),
                        form: form_id,
                    }).catch(() => {/* silent — don't block webhook response */ });
                }
            }
        }

        return NextResponse.json({ status: 'ok' });
    } catch (err) {
        console.error('[FB Webhook] Unhandled error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
