import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';
import { notifyProjectUpdate, notifyPaymentUpdate } from '@/lib/notify';

function isAdmin(req: NextRequest): boolean {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    return !!token && verifyToken(token);
}

// ─── GET: list all projects ───────────────────────────────────────────────────
export async function GET(req: NextRequest) {
    if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const status = new URL(req.url).searchParams.get('status');
    let q = supabaseAdmin.from('projects').select('*').order('created_at', { ascending: false });
    if (status) q = q.eq('status', status) as any;
    const { data, error } = await q;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ projects: data });
}

// ─── POST: create project ─────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const body = await req.json();
        if (!body.name) return NextResponse.json({ error: 'name is required' }, { status: 400 });
        const { data, error } = await supabaseAdmin.from('projects').insert({
            name: body.name,
            client_name: body.client_name ?? null,
            client_email: body.client_email ?? null,
            client_phone: body.client_phone ?? null,
            description: body.description ?? null,
            status: body.status ?? 'discovery',
            priority: body.priority ?? 'medium',
            start_date: body.start_date ?? null,
            due_date: body.due_date ?? null,
            budget: body.budget ?? 0,
            amount_paid: body.amount_paid ?? 0,
            tags: body.tags ?? [],
            notes: body.notes ?? null,
            lead_id: body.lead_id ?? null,
        }).select().single();
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ success: true, project: data });
    } catch {
        return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }
}

// ─── PATCH: update project ────────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
    if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const { id, ...rest } = await req.json();
        if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
        // Fetch existing project for comparison
        const { data: prev } = await supabaseAdmin.from('projects').select('status,budget,amount_paid,name,client_name,client_phone').eq('id', id).single();

        const { data, error } = await supabaseAdmin
            .from('projects').update({ ...rest, updated_at: new Date().toISOString() })
            .eq('id', id).select().single();
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        // 🔔 Notifications (non-blocking)
        if (prev && data) {
            if (rest.status && rest.status !== prev.status) {
                notifyProjectUpdate(
                    { name: data.name, client: data.client_name, stage: rest.status },
                    data.client_phone ?? undefined,
                ).catch(() => { });
            }
            if (rest.amount_paid !== undefined && Number(rest.amount_paid) !== Number(prev.amount_paid)) {
                notifyPaymentUpdate(
                    { name: data.name, client: data.client_name, stage: data.status },
                    Number(rest.amount_paid) - Number(prev.amount_paid),
                    (Number(data.budget) || 0) - Number(rest.amount_paid),
                ).catch(() => { });
            }
        }

        return NextResponse.json({ success: true, project: data });
    } catch {
        return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }
}

// ─── DELETE: remove project ───────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
    if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    const { error } = await supabaseAdmin.from('projects').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
