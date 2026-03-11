import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';

function isAdmin(req: NextRequest): boolean {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    return !!token && verifyToken(token);
}

// ─── GET: List all follow-up sequences ───────────────────────────────────────
export async function GET(req: NextRequest) {
    if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { data, error } = await supabaseAdmin
        .from('whatsapp_sequences')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ sequences: data });
}

// ─── POST: Create a new follow-up sequence ───────────────────────────────────
export async function POST(req: NextRequest) {
    if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const { name, description, steps, is_active, trigger } = await req.json();
        if (!name || !steps?.length) {
            return NextResponse.json({ error: 'name and steps are required' }, { status: 400 });
        }
        const { data, error } = await supabaseAdmin
            .from('whatsapp_sequences')
            .insert({ name, description, steps, is_active: is_active ?? true, trigger: trigger ?? 'manual' })
            .select()
            .single();
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ success: true, sequence: data });
    } catch {
        return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }
}

// ─── PATCH: Update sequence (toggle active, edit steps) ──────────────────────
export async function PATCH(req: NextRequest) {
    if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const { id, ...updates } = await req.json();
        if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
        const { data, error } = await supabaseAdmin
            .from('whatsapp_sequences')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ success: true, sequence: data });
    } catch {
        return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }
}

// ─── DELETE: Remove a sequence ───────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
    if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    const { error } = await supabaseAdmin.from('whatsapp_sequences').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
