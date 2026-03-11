import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';

function isAdmin(req: NextRequest) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    return !!token && verifyToken(token);
}

// ─── GET: list all contacts ───────────────────────────────────────────────────
export async function GET(req: NextRequest) {
    if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { data, error } = await supabaseAdmin
        .from('notification_contacts')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ contacts: data });
}

// ─── POST: add contact ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const body = await req.json();

        // Special action: "test" — send a test WA message
        if (body.action === 'test') {
            const phone = body.phone?.replace(/\D/g, '');
            if (!phone) return NextResponse.json({ error: 'phone required' }, { status: 400 });
            const token = process.env.WHATSAPP_ACCESS_TOKEN;
            const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
            if (!token || !phoneId) return NextResponse.json({ error: 'WhatsApp env vars not configured' }, { status: 500 });
            const r = await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messaging_product: 'whatsapp', to: phone, type: 'text',
                    text: { body: `✅ Test notification from AKS Admin Panel.\n\nYour number is set up correctly for alerts! 🎉` },
                }),
            });
            return NextResponse.json({ success: r.ok });
        }

        if (!body.name || !body.phone) return NextResponse.json({ error: 'name and phone required' }, { status: 400 });
        const { data, error } = await supabaseAdmin.from('notification_contacts').insert({
            name: body.name,
            phone: body.phone.replace(/\D/g, ''),
            label: body.label ?? null,
            notify_on: body.notify_on ?? ['new_lead', 'project_update'],
            is_active: true,
        }).select().single();
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ success: true, contact: data });
    } catch {
        return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }
}

// ─── PATCH: update contact ────────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
    if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const { id, ...rest } = await req.json();
        if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
        const { data, error } = await supabaseAdmin
            .from('notification_contacts')
            .update({ ...rest, updated_at: new Date().toISOString() })
            .eq('id', id).select().single();
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ success: true, contact: data });
    } catch {
        return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }
}

// ─── DELETE: remove contact ───────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
    if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    const { error } = await supabaseAdmin.from('notification_contacts').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
