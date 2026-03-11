import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Status icon map for logging
const STATUS_ICONS: Record<string, string> = {
    sent: '📤', delivered: '✅', read: '👁️', failed: '❌', replied: '↩️',
};

// ─── GET: Webhook verification challenge ──────────────────────────────────────
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
        console.log('[WA Webhook] Verification OK');
        return new NextResponse(challenge, { status: 200 });
    }
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

// ─── POST: Receive status updates & inbound messages ──────────────────────────
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        for (const entry of body.entry ?? []) {
            for (const change of entry.changes ?? []) {
                if (change.field !== 'messages') continue;

                const value = change.value;

                // ── Status updates ─────────────────────────────────────────────
                for (const status of value.statuses ?? []) {
                    const { id: waId, status: waStatus, timestamp, errors } = status;
                    console.log(`[WA Webhook] ${STATUS_ICONS[waStatus] ?? '?'} ${waStatus} → ${waId}`);

                    await supabaseAdmin
                        .from('whatsapp_messages')
                        .update({
                            status: waStatus,
                            error_data: errors ? JSON.stringify(errors) : null,
                            updated_at: new Date(Number(timestamp) * 1000).toISOString(),
                        })
                        .eq('wa_message_id', waId);
                }

                // ── Inbound messages / replies ─────────────────────────────────
                for (const msg of value.messages ?? []) {
                    const from = msg.from;
                    const content = msg.type === 'text' ? msg.text?.body : `[${msg.type}]`;

                    console.log(`[WA Webhook] Inbound from ${from}: ${content}`);

                    // Try to match to an existing lead by phone
                    const { data: lead } = await supabaseAdmin
                        .from('fb_leads')
                        .select('leadgen_id')
                        .contains('field_data', JSON.stringify([{ name: 'phone_number', values: [from] }]))
                        .maybeSingle();

                    await supabaseAdmin.from('whatsapp_messages').insert({
                        lead_id: lead?.leadgen_id ?? null,
                        phone: from,
                        direction: 'inbound',
                        type: msg.type,
                        content: content ?? '',
                        wa_message_id: msg.id,
                        status: 'received',
                        sent_at: new Date(Number(msg.timestamp) * 1000).toISOString(),
                    });
                }
            }
        }

        return NextResponse.json({ status: 'ok' });
    } catch (err) {
        console.error('[WA Webhook] Error:', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
