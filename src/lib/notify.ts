import { supabaseAdmin } from './supabase';

// Event types for notification filtering
export type NotifyEvent = 'new_lead' | 'project_update' | 'payment_update';

interface LeadInfo { name?: string; email?: string; phone?: string; form?: string; }
interface ProjectInfo { name: string; client?: string; stage: string; }

// ─── Send WhatsApp to a single number ────────────────────────────────────────
async function sendWA(to: string, message: string): Promise<boolean> {
    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    if (!token || !phoneId) return false;

    try {
        const r = await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: to.replace(/\D/g, ''),
                type: 'text',
                text: { body: message },
            }),
        });
        return r.ok;
    } catch {
        return false;
    }
}

// ─── Get notification contacts for a given event ──────────────────────────────
async function getContacts(event: NotifyEvent) {
    const { data } = await supabaseAdmin
        .from('notification_contacts')
        .select('phone, name')
        .eq('is_active', true)
        .or(`notify_on.cs.{"all"},notify_on.cs.{"${event}"}`);
    return data ?? [];
}

// ─── Public: Notify on new lead ───────────────────────────────────────────────
export async function notifyNewLead(lead: LeadInfo) {
    const contacts = await getContacts('new_lead');
    if (!contacts.length) return;

    const msg = [
        `🔔 *New Lead Alert!*`,
        ``,
        `👤 Name: ${lead.name || 'Unknown'}`,
        lead.email ? `📧 Email: ${lead.email}` : '',
        lead.phone ? `📞 Phone: ${lead.phone}` : '',
        lead.form ? `📋 Form: ${lead.form}` : '',
        ``,
        `_Received via Facebook Lead Ads_`,
        `_AKS Automations Admin_`,
    ].filter(Boolean).join('\n');

    await Promise.allSettled(contacts.map(c => sendWA(c.phone, msg)));
}

// ─── Public: Notify on project stage change ───────────────────────────────────
export async function notifyProjectUpdate(project: ProjectInfo, clientPhone?: string) {
    const contacts = await getContacts('project_update');

    const adminMsg = [
        `📦 *Project Status Update*`,
        ``,
        `🗂 Project: ${project.name}`,
        project.client ? `👤 Client: ${project.client}` : '',
        `📍 New Stage: *${project.stage.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}*`,
        ``,
        `_Updated via AKS Admin Panel_`,
    ].filter(Boolean).join('\n');

    await Promise.allSettled(contacts.map(c => sendWA(c.phone, adminMsg)));

    // Also notify the client if they have a phone and opted in
    if (clientPhone) {
        const clientMsg = [
            `Hi! 👋`,
            ``,
            `Your project *${project.name}* has been updated.`,
            ``,
            `📍 Current Stage: *${project.stage.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}*`,
            ``,
            `We'll keep you posted on progress. Feel free to reach out anytime!`,
            ``,
            `— *AKS Automations Team*`,
        ].join('\n');
        await sendWA(clientPhone, clientMsg);
    }
}

// ─── Public: Notify on payment update ────────────────────────────────────────
export async function notifyPaymentUpdate(project: ProjectInfo, amount: number, remaining: number) {
    const contacts = await getContacts('payment_update');
    if (!contacts.length) return;

    const msg = [
        `💳 *Payment Received*`,
        ``,
        `🗂 Project: ${project.name}`,
        project.client ? `👤 Client: ${project.client}` : '',
        `✅ Amount: ₹${Number(amount).toLocaleString('en-IN')}`,
        remaining > 0 ? `⏳ Remaining: ₹${Number(remaining).toLocaleString('en-IN')}` : `🎉 Fully Paid!`,
        ``,
        `_AKS Automations Admin_`,
    ].filter(Boolean).join('\n');

    await Promise.allSettled(contacts.map(c => sendWA(c.phone, msg)));
}
