import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';

// Auth guard helper
function isAdmin(req: NextRequest): boolean {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    return !!token && verifyToken(token);
}

// ─── GET: List all FB leads (newest first) ────────────────────────────────────
export async function GET(req: NextRequest) {
    if (!isAdmin(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
        .from('fb_leads')
        .select('*')
        .order('received_at', { ascending: false });

    if (error) {
        console.error('[Admin FB Leads] Fetch error:', error.message);
        return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }

    return NextResponse.json({ leads: data });
}

// ─── PATCH: Update lead status / notes ────────────────────────────────────────
export async function PATCH(req: NextRequest) {
    if (!isAdmin(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { leadgen_id, status, notes } = await req.json();
        if (!leadgen_id) {
            return NextResponse.json({ error: 'leadgen_id is required' }, { status: 400 });
        }

        const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
        if (status !== undefined) updates.status = status;
        if (notes !== undefined) updates.notes = notes;

        const { data, error } = await supabaseAdmin
            .from('fb_leads')
            .update(updates)
            .eq('leadgen_id', leadgen_id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, lead: data });
    } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}

// ─── DELETE: Remove a single lead ─────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
    if (!isAdmin(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const leadgen_id = searchParams.get('leadgen_id');

    if (!leadgen_id) {
        return NextResponse.json({ error: 'leadgen_id query param required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
        .from('fb_leads')
        .delete()
        .eq('leadgen_id', leadgen_id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}

// ─── POST: Create a manual lead ───────────────────────────────────────────────
export async function POST(req: NextRequest) {
    if (!isAdmin(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const { name, email, phone, status, notes } = await req.json();
        if (!name) return NextResponse.json({ error: 'name is required' }, { status: 400 });

        const leadgen_id = `manual_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const field_data = [
            { name: 'full_name', values: [name] },
            ...(email ? [{ name: 'email', values: [email] }] : []),
            ...(phone ? [{ name: 'phone_number', values: [phone] }] : []),
        ];

        const { data, error } = await supabaseAdmin.from('fb_leads').insert({
            leadgen_id,
            field_data,
            status: status ?? 'new',
            notes: notes ?? null,
            received_at: new Date().toISOString(),
        }).select().single();

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ success: true, lead: data });
    } catch {
        return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }
}
