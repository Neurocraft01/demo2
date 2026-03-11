import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Cron endpoint — processes due follow-up messages from the queue.
 * Call this every 15-30 minutes via:
 *   - Vercel Cron (vercel.json)
 *   - External cron (cron-job.org, GitHub Actions, etc.)
 *
 * Protect with CRON_SECRET header.
 */
export async function POST(req: NextRequest) {
    const secret = req.headers.get('x-cron-secret');
    if (secret !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const now = new Date().toISOString();
    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!token || !phoneNumberId) {
        return NextResponse.json({ error: 'WhatsApp credentials not configured' }, { status: 500 });
    }

    // Fetch all pending queue items that are due
    const { data: dueItems, error: fetchError } = await supabaseAdmin
        .from('whatsapp_followup_queue')
        .select('*, whatsapp_sequences(steps)')
        .eq('status', 'pending')
        .lte('scheduled_at', now)
        .order('scheduled_at', { ascending: true })
        .limit(50);

    if (fetchError) {
        return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    let processed = 0;
    let failed = 0;

    for (const item of dueItems ?? []) {
        const steps: any[] = item.whatsapp_sequences?.steps ?? [];
        const step = steps[item.step_index];
        if (!step) {
            // No more steps — mark complete
            await supabaseAdmin.from('whatsapp_followup_queue').update({ status: 'completed' }).eq('id', item.id);
            continue;
        }

        try {
            // Build WhatsApp message body
            const waBody = step.type === 'template'
                ? {
                    messaging_product: 'whatsapp', to: item.phone, type: 'template',
                    template: { name: step.template_name, language: { code: step.language ?? 'en_US' }, components: step.components ?? [] },
                }
                : {
                    messaging_product: 'whatsapp', to: item.phone, type: 'text',
                    text: { body: step.message ?? '' },
                };

            const waRes = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(waBody),
            });
            const waData = await waRes.json();
            const waMsgId = waData?.messages?.[0]?.id ?? null;

            // Store sent message
            await supabaseAdmin.from('whatsapp_messages').insert({
                lead_id: item.lead_id,
                phone: item.phone,
                direction: 'outbound',
                type: step.type ?? 'text',
                content: step.message ?? step.template_name,
                template_name: step.template_name ?? null,
                wa_message_id: waMsgId,
                status: waRes.ok ? 'sent' : 'failed',
                error_data: waRes.ok ? null : JSON.stringify(waData),
                sent_at: new Date().toISOString(),
            });

            // Schedule next step OR mark queue entry done
            const nextStepIndex = item.step_index + 1;
            const nextStep = steps[nextStepIndex];
            if (nextStep && waRes.ok) {
                const nextScheduledAt = new Date(Date.now() + (nextStep.delay_hours ?? 24) * 3600 * 1000).toISOString();
                await supabaseAdmin.from('whatsapp_followup_queue').update({
                    step_index: nextStepIndex,
                    scheduled_at: nextScheduledAt,
                    status: 'pending',
                    updated_at: new Date().toISOString(),
                }).eq('id', item.id);
            } else {
                await supabaseAdmin.from('whatsapp_followup_queue').update({
                    status: waRes.ok ? 'completed' : 'failed',
                    updated_at: new Date().toISOString(),
                }).eq('id', item.id);
            }

            processed++;
        } catch (err) {
            console.error('[Cron] Failed to process item', item.id, err);
            await supabaseAdmin.from('whatsapp_followup_queue').update({ status: 'failed', updated_at: new Date().toISOString() }).eq('id', item.id);
            failed++;
        }
    }

    return NextResponse.json({ processed, failed, total: dueItems?.length ?? 0 });
}
