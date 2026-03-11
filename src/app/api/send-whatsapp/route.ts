import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';

function isAdmin(req: NextRequest): boolean {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    return !!token && verifyToken(token);
}

const WA_API_URL = `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

export type WaSendPayload =
    | { type: 'text'; phone: string; message: string; lead_id?: string }
    | { type: 'template'; phone: string; template_name: string; language?: string; components?: object[]; lead_id?: string };

// ─── POST: Send a WhatsApp message ────────────────────────────────────────────
export async function POST(req: NextRequest) {
    if (!isAdmin(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!token || !phoneNumberId) {
        return NextResponse.json({ error: 'WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID not set in env' }, { status: 500 });
    }

    try {
        const body: WaSendPayload = await req.json();
        const { phone, lead_id } = body as any;

        if (!phone) return NextResponse.json({ error: 'phone is required' }, { status: 400 });

        // Clean phone — ensure E.164 format without +
        const cleanPhone = phone.replace(/\D/g, '');

        let waBody: object;
        if (body.type === 'template') {
            waBody = {
                messaging_product: 'whatsapp',
                to: cleanPhone,
                type: 'template',
                template: {
                    name: body.template_name,
                    language: { code: body.language ?? 'en_US' },
                    ...(body.components ? { components: body.components } : {}),
                },
            };
        } else {
            if (!(body as any).message) return NextResponse.json({ error: 'message is required for text type' }, { status: 400 });
            waBody = {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: cleanPhone,
                type: 'text',
                text: { body: (body as any).message, preview_url: false },
            };
        }

        const waRes = await fetch(WA_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(waBody),
        });

        const waData = await waRes.json();
        const waMsgId = waData?.messages?.[0]?.id ?? null;

        // Store message record in Supabase
        const { data: record } = await supabaseAdmin.from('whatsapp_messages').insert({
            lead_id: lead_id ?? null,
            phone: cleanPhone,
            direction: 'outbound',
            type: body.type,
            content: body.type === 'text' ? (body as any).message : JSON.stringify(waBody),
            template_name: body.type === 'template' ? body.template_name : null,
            wa_message_id: waMsgId,
            status: waRes.ok ? 'sent' : 'failed',
            error_data: waRes.ok ? null : JSON.stringify(waData),
            sent_at: new Date().toISOString(),
        }).select().single();

        if (!waRes.ok) {
            return NextResponse.json({ error: 'WhatsApp API error', details: waData }, { status: 500 });
        }

        return NextResponse.json({ success: true, waMsgId, record });
    } catch (err) {
        console.error('[WA Send] Error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// ─── GET: Load message history for a lead ─────────────────────────────────────
export async function GET(req: NextRequest) {
    if (!isAdmin(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const lead_id = new URL(req.url).searchParams.get('lead_id');
    const query = supabaseAdmin
        .from('whatsapp_messages')
        .select('*')
        .order('sent_at', { ascending: false });

    if (lead_id) query.eq('lead_id', lead_id);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ messages: data });
}
