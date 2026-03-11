'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// Recursive JSON Form Editor Component
function JsonEditor({ data, onChange }: { data: any, onChange: (newData: any) => void }) {
    if (typeof data !== 'object' || data === null) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {Object.entries(data).map(([key, value]) => {
                if (key.startsWith('_')) return null;

                return (
                    <div key={key} style={{ background: 'var(--admin-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
                        <label style={{ display: 'block', color: 'var(--admin-primary)', textTransform: 'uppercase', fontSize: '12px', marginBottom: '12px', fontWeight: '800', letterSpacing: '0.5px' }}>
                            {key}
                        </label>

                        {typeof value === 'string' ? (
                            <textarea
                                value={value}
                                onChange={(e) => onChange({ ...data, [key]: e.target.value })}
                                className="admin-input"
                                style={{ width: '100%', minHeight: value.length > 60 ? '120px' : '48px', resize: 'vertical' }}
                            />
                        ) : typeof value === 'number' ? (
                            <input
                                type="number"
                                value={value}
                                onChange={(e) => onChange({ ...data, [key]: Number(e.target.value) })}
                                className="admin-input"
                            />
                        ) : typeof value === 'boolean' ? (
                            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={value}
                                    onChange={(e) => onChange({ ...data, [key]: e.target.checked })}
                                    style={{ width: '20px', height: '20px', accentColor: 'var(--admin-primary)' }}
                                />
                                <span style={{ fontWeight: '600' }}>Enable</span>
                            </label>
                        ) : Array.isArray(value) ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {value.map((item, idx) => (
                                    <div key={idx} style={{ padding: '16px', borderLeft: '3px solid var(--admin-primary)', background: 'var(--admin-card)', position: 'relative', borderRadius: '0 8px 8px 0', borderTop: '1px solid var(--admin-border)', borderRight: '1px solid var(--admin-border)', borderBottom: '1px solid var(--admin-border)' }}>
                                        <div style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '11px', color: 'var(--admin-text-muted)', fontWeight: 'bold' }}>Item {idx + 1}</div>
                                        {typeof item === 'string' ? (
                                            <textarea
                                                value={item}
                                                onChange={e => {
                                                    const newArr = [...value];
                                                    newArr[idx] = e.target.value;
                                                    onChange({ ...data, [key]: newArr });
                                                }}
                                                className="admin-input"
                                                style={{ width: '100%', minHeight: '48px', marginTop: '16px' }}
                                            />
                                        ) : (
                                            <div style={{ marginTop: '16px' }}>
                                                <JsonEditor
                                                    data={item}
                                                    onChange={newItem => {
                                                        const newArr = [...value];
                                                        newArr[idx] = newItem;
                                                        onChange({ ...data, [key]: newArr });
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : typeof value === 'object' ? (
                            <div style={{ paddingLeft: '20px', borderLeft: '2px solid var(--admin-border)' }}>
                                <JsonEditor
                                    data={value}
                                    onChange={newObj => onChange({ ...data, [key]: newObj })}
                                />
                            </div>
                        ) : (
                            <div style={{ color: 'red' }}>Unsupported type ({typeof value})</div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// Deep merge helper
function deepMerge(target: any, source: any): any {
    if (source === null || source === undefined) return target;
    if (Array.isArray(target) && Array.isArray(source)) {
        return source.length > 0 ? source : target;
    }
    if (typeof target === 'object' && typeof source === 'object') {
        const merged = { ...target };
        Object.keys(source).forEach(key => {
            merged[key] = deepMerge(target[key], source[key]);
        });
        return merged;
    }
    return source;
}

// ─── Notification Contacts Component ─────────────────────────────────────────
const NOTIF_EVENTS = [
    { key: 'new_lead', label: '🔔 New Lead', desc: 'When a Facebook lead arrives' },
    { key: 'project_update', label: '📦 Project Stage', desc: 'When project stage changes' },
    { key: 'payment_update', label: '💳 Payment', desc: 'When payment is recorded' },
];

function NotificationContacts() {
    const [contacts, setContacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [testing, setTesting] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', phone: '', label: '', notify_on: ['new_lead', 'project_update'] });
    const [toast, setToast] = useState('');
    const fv = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));
    const notify = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000); };

    const load = useCallback(async () => {
        setLoading(true);
        const r = await fetch('/api/admin/notifications');
        if (r.ok) { const d = await r.json(); setContacts(d.contacts || []); }
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const toggleEvent = (ev: string) => {
        fv('notify_on', form.notify_on.includes(ev)
            ? form.notify_on.filter((x: string) => x !== ev)
            : [...form.notify_on, ev]);
    };

    const addContact = async () => {
        if (!form.name || !form.phone) return;
        setSaving(true);
        const r = await fetch('/api/admin/notifications', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        if (r.ok) { await load(); setShowForm(false); setForm({ name: '', phone: '', label: '', notify_on: ['new_lead', 'project_update'] }); notify('Contact added ✅'); }
        setSaving(false);
    };

    const toggleActive = async (id: number, is_active: boolean) => {
        await fetch('/api/admin/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, is_active }) });
        setContacts(p => p.map(c => c.id === id ? { ...c, is_active } : c));
    };

    const deleteContact = async (id: number) => {
        if (!confirm('Remove this notification contact?')) return;
        await fetch(`/api/admin/notifications?id=${id}`, { method: 'DELETE' });
        setContacts(p => p.filter(c => c.id !== id));
        notify('Contact removed');
    };

    const testContact = async (id: number, phone: string) => {
        setTesting(id);
        const r = await fetch('/api/admin/notifications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'test', phone }) });
        const d = await r.json();
        notify(d.success ? '✅ Test message sent!' : '❌ Send failed — check WA credentials');
        setTesting(null);
    };

    return (
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(79,70,229,0.3)', marginTop: '4px' }}>
            {toast && <div style={{ position: 'fixed', bottom: '28px', left: '50%', transform: 'translateX(-50%)', background: '#0F172A', color: '#fff', padding: '12px 24px', borderRadius: '30px', fontSize: '14px', fontWeight: 600, zIndex: 2000, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>{toast}</div>}

            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(79,70,229,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--admin-primary-grad)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'white' }}>notifications_active</span>
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '15px' }}>🔔 Notification Contacts</div>
                        <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>Phone numbers that instantly receive WhatsApp alerts</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={load} className="admin-btn-outline" style={{ padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>refresh</span>
                    </button>
                    <button onClick={() => setShowForm(f => !f)} className="admin-btn" style={{ padding: '8px 16px', fontSize: '13px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span> Add Number
                    </button>
                </div>
            </div>

            {/* Add form */}
            {showForm && (
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--admin-border)', background: 'var(--admin-hover)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                        <div>
                            <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--admin-text-muted)', display: 'block', marginBottom: '5px' }}>Name *</label>
                            <input value={form.name} onChange={e => fv('name', e.target.value)} placeholder="e.g. Akshay (Owner)" className="admin-input" />
                        </div>
                        <div>
                            <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--admin-text-muted)', display: 'block', marginBottom: '5px' }}>WhatsApp Number * (with country code)</label>
                            <input value={form.phone} onChange={e => fv('phone', e.target.value)} placeholder="919876543210" className="admin-input" />
                        </div>
                        <div>
                            <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--admin-text-muted)', display: 'block', marginBottom: '5px' }}>Label (optional)</label>
                            <input value={form.label} onChange={e => fv('label', e.target.value)} placeholder="e.g. Sales Team" className="admin-input" />
                        </div>
                    </div>
                    <div style={{ marginBottom: '14px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--admin-text-muted)', display: 'block', marginBottom: '8px' }}>Notify When</label>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {NOTIF_EVENTS.map(ev => (
                                <button key={ev.key} type="button" onClick={() => toggleEvent(ev.key)} style={{ padding: '6px 14px', borderRadius: '20px', border: '1.5px solid', borderColor: form.notify_on.includes(ev.key) ? 'var(--admin-primary)' : 'var(--admin-border)', background: form.notify_on.includes(ev.key) ? 'var(--admin-primary-light)' : 'transparent', color: form.notify_on.includes(ev.key) ? 'var(--admin-primary)' : 'var(--admin-text-muted)', fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s' }}>
                                    {ev.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => setShowForm(false)} className="admin-btn-outline" style={{ padding: '8px 18px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700 }}>Cancel</button>
                        <button onClick={addContact} disabled={saving || !form.name || !form.phone} className="admin-btn" style={{ padding: '8px 20px' }}>{saving ? 'Saving…' : 'Save Contact'}</button>
                    </div>
                </div>
            )}

            {/* Event legend */}
            <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--admin-border)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {NOTIF_EVENTS.map(ev => (
                    <div key={ev.key} style={{ fontSize: '11px', color: 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ fontWeight: 700 }}>{ev.label}</span> — {ev.desc}
                    </div>
                ))}
            </div>

            {/* Contact list */}
            {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: '13px' }}>Loading…</div>
            ) : contacts.length === 0 ? (
                <div style={{ padding: '48px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '40px', display: 'block', marginBottom: '12px', opacity: .3 }}>notifications_off</span>
                    No notification numbers yet. Add one above to start receiving alerts.
                </div>
            ) : contacts.map((c: any) => (
                <div key={c.id} style={{ padding: '16px 24px', borderBottom: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: c.is_active ? 'rgba(37,211,102,0.12)' : 'var(--admin-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '16px', flexShrink: 0, color: c.is_active ? '#25D366' : 'var(--admin-text-muted)' }}>
                        {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {c.name}
                            {c.label && <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: 'var(--admin-hover)', color: 'var(--admin-text-muted)', fontWeight: 600 }}>{c.label}</span>}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <span>📱 +{c.phone}</span>
                            <span style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
                                {(c.notify_on || []).map((ev: string) => {
                                    const meta = NOTIF_EVENTS.find(x => x.key === ev);
                                    return meta ? <span key={ev} style={{ padding: '2px 7px', borderRadius: '20px', background: 'var(--admin-primary-light)', color: 'var(--admin-primary)', fontSize: '10px', fontWeight: 700 }}>{meta.label}</span> : null;
                                })}
                            </span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                        <button onClick={() => testContact(c.id, c.phone)} disabled={testing === c.id} title="Send test message" style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(37,211,102,0.1)', color: '#25D366', border: '1px solid rgba(37,211,102,0.3)', fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {testing === c.id ? '…' : '💬 Test'}
                        </button>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: 700, color: c.is_active ? '#25D366' : 'var(--admin-text-muted)' }}>
                            <input type="checkbox" checked={c.is_active} onChange={e => toggleActive(c.id, e.target.checked)} style={{ accentColor: '#25D366', width: '16px', height: '16px' }} />
                            {c.is_active ? 'On' : 'Off'}
                        </label>
                        <button onClick={() => deleteContact(c.id)} style={{ padding: '6px 10px', borderRadius: '8px', background: 'var(--admin-danger-light)', color: 'var(--admin-danger)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', fontSize: '14px' }}>🗑</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function AdminDashboard() {
    const [authChecked, setAuthChecked] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Routing State
    const [activeTab, setActiveTab] = useState<'dashboard' | 'cms' | 'leads' | 'visitors' | 'campaigns' | 'settings'>('dashboard');

    // Editor states
    const [cmsData, setCmsData] = useState<any>(null);
    const [activeSection, setActiveSection] = useState<string>('site');
    const [editorData, setEditorData] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    // ─── Facebook Leads State ─────────────────────────────────────────────────
    const [fbLeads, setFbLeads] = useState<any[]>([]);
    const [fbLeadsLoading, setFbLeadsLoading] = useState(false);
    const [fbLeadsError, setFbLeadsError] = useState('');
    const [expandedLead, setExpandedLead] = useState<string | null>(null);
    const [leadStatusUpdating, setLeadStatusUpdating] = useState<string | null>(null);
    const [fbSearchQuery, setFbSearchQuery] = useState('');
    const [fbStatusFilter, setFbStatusFilter] = useState<string>('all');
    const [fbLeadNotes, setFbLeadNotes] = useState<Record<string, string>>({});

    // ─── WhatsApp State ─────────────────────────────────────────────────────
    const [waMessages, setWaMessages] = useState<Record<string, any[]>>({}); // keyed by lead_id
    const [waCompose, setWaCompose] = useState<Record<string, string>>({}); // draft per lead
    const [waSending, setWaSending] = useState<string | null>(null);
    const [waSequences, setWaSequences] = useState<any[]>([]);
    const [waSeqLoading, setWaSeqLoading] = useState(false);
    const [showSeqBuilder, setShowSeqBuilder] = useState(false);
    const [seqDraft, setSeqDraft] = useState<{ name: string; description: string; trigger: string; steps: any[] }>({
        name: '', description: '', trigger: 'manual', steps: []
    });
    const [seqSaving, setSeqSaving] = useState(false);

    const loadWaMessages = useCallback(async (lead_id: string) => {
        const res = await fetch(`/api/send-whatsapp?lead_id=${lead_id}`);
        if (res.ok) {
            const data = await res.json();
            setWaMessages(prev => ({ ...prev, [lead_id]: data.messages || [] }));
        }
    }, []);

    const sendWhatsApp = async (phone: string, lead_id: string) => {
        const msg = (waCompose[lead_id] ?? '').trim();
        if (!msg || !phone) return;
        setWaSending(lead_id);
        try {
            const res = await fetch('/api/send-whatsapp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'text', phone, message: msg, lead_id }),
            });
            if (res.ok) {
                setWaCompose(prev => ({ ...prev, [lead_id]: '' }));
                await loadWaMessages(lead_id);
                setMessage('WhatsApp message sent ✅');
                setTimeout(() => setMessage(''), 3000);
            } else {
                const err = await res.json();
                setMessage('WA Error: ' + (err.error ?? 'Unknown'));
            }
        } finally {
            setWaSending(null);
        }
    };

    const loadWaSequences = useCallback(async () => {
        setWaSeqLoading(true);
        const res = await fetch('/api/admin/whatsapp-sequences');
        if (res.ok) { const d = await res.json(); setWaSequences(d.sequences || []); }
        setWaSeqLoading(false);
    }, []);

    const saveSequence = async () => {
        if (!seqDraft.name || !seqDraft.steps.length) return;
        setSeqSaving(true);
        const res = await fetch('/api/admin/whatsapp-sequences', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(seqDraft),
        });
        if (res.ok) {
            await loadWaSequences();
            setShowSeqBuilder(false);
            setSeqDraft({ name: '', description: '', trigger: 'manual', steps: [] });
            setMessage('Sequence created ✅');
            setTimeout(() => setMessage(''), 3000);
        }
        setSeqSaving(false);
    };

    const toggleSequence = async (id: number, is_active: boolean) => {
        await fetch('/api/admin/whatsapp-sequences', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, is_active }),
        });
        setWaSequences(prev => prev.map(s => s.id === id ? { ...s, is_active } : s));
    };

    const deleteSequence = async (id: number) => {
        if (!confirm('Delete this sequence?')) return;
        await fetch(`/api/admin/whatsapp-sequences?id=${id}`, { method: 'DELETE' });
        setWaSequences(prev => prev.filter(s => s.id !== id));
    };

    const addSeqStep = () => setSeqDraft(prev => ({
        ...prev,
        steps: [...prev.steps, { delay_hours: prev.steps.length === 0 ? 0 : 24, type: 'text', message: '' }]
    }));

    const updateSeqStep = (idx: number, field: string, value: any) => setSeqDraft(prev => ({
        ...prev,
        steps: prev.steps.map((s, i) => i === idx ? { ...s, [field]: value } : s)
    }));

    const removeSeqStep = (idx: number) => setSeqDraft(prev => ({
        ...prev, steps: prev.steps.filter((_, i) => i !== idx)
    }));

    const loadFbLeads = useCallback(async () => {
        setFbLeadsLoading(true);
        setFbLeadsError('');
        try {
            const res = await fetch('/api/admin/fb-leads');
            if (res.ok) {
                const data = await res.json();
                setFbLeads(data.leads || []);
            } else {
                setFbLeadsError('Failed to load Facebook leads.');
            }
        } catch {
            setFbLeadsError('Network error loading leads.');
        } finally {
            setFbLeadsLoading(false);
        }
    }, []);

    const updateLeadStatus = async (leadgen_id: string, status: string) => {
        setLeadStatusUpdating(leadgen_id);
        try {
            const res = await fetch('/api/admin/fb-leads', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadgen_id, status }),
            });
            if (res.ok) {
                setFbLeads(prev => prev.map(l => l.leadgen_id === leadgen_id ? { ...l, status } : l));
            }
        } finally {
            setLeadStatusUpdating(null);
        }
    };

    const saveLeadNotes = async (leadgen_id: string) => {
        const notes = fbLeadNotes[leadgen_id] ?? '';
        await fetch('/api/admin/fb-leads', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ leadgen_id, notes }),
        });
        setFbLeads(prev => prev.map(l => l.leadgen_id === leadgen_id ? { ...l, notes } : l));
        setMessage('Notes saved.');
        setTimeout(() => setMessage(''), 3000);
    };

    const deleteLead = async (leadgen_id: string) => {
        if (!confirm('Delete this lead permanently?')) return;
        const res = await fetch(`/api/admin/fb-leads?leadgen_id=${leadgen_id}`, { method: 'DELETE' });
        if (res.ok) setFbLeads(prev => prev.filter(l => l.leadgen_id !== leadgen_id));
    };

    const exportLeadsCSV = () => {
        if (!fbLeads.length) return;
        // Collect all unique field names
        const fieldNames = Array.from(new Set(fbLeads.flatMap(l =>
            (l.field_data || []).map((f: any) => f.name)
        )));
        const headers = ['Lead ID', 'Form ID', 'Ad ID', 'Status', 'Received At', ...fieldNames, 'Notes'];
        const rows = fbLeads.map(l => {
            const fields: Record<string, string> = {};
            (l.field_data || []).forEach((f: any) => { fields[f.name] = (f.values || []).join(', '); });
            return [
                l.leadgen_id,
                l.form_id,
                l.ad_id,
                l.status,
                l.received_at,
                ...fieldNames.map(n => fields[n] || ''),
                l.notes || ''
            ];
        });
        const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fb-leads-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        checkAuth();

        // Auto color-scheme detection if no initial theme exists
        if (!localStorage.getItem('admin-theme')) {
            document.documentElement.setAttribute('data-admin-theme', 'light');
        } else {
            document.documentElement.setAttribute('data-admin-theme', localStorage.getItem('admin-theme')!);
        }
    }, []);

    useEffect(() => {
        if (activeTab === 'leads' && isAuthenticated) {
            loadFbLeads();
        }
        if (activeTab === 'campaigns' && isAuthenticated) {
            loadWaSequences();
        }
    }, [activeTab, isAuthenticated, loadFbLeads, loadWaSequences]);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/admin/login');
            if (res.ok) {
                setIsAuthenticated(true);
                loadContent();
            }
        } finally {
            setAuthChecked(true);
        }
    };

    const loadContent = async () => {
        try {
            const res = await fetch('/api/admin/content');
            if (res.ok) {
                const data = await res.json();
                setCmsData(data);
                syncEditor(data, activeSection);
            }
        } catch (err) {
            console.error('Error loading CMS data', err);
        }
    };

    const syncEditor = (data: any, section: string) => {
        if (section && data?.sections[section]) {
            const base = data.sections[section].base;
            const override = data.sections[section].override || {};
            const merged = deepMerge(base, override);
            setEditorData(merged);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                setIsAuthenticated(true);
                loadContent();
            } else {
                const data = await res.json();
                setError(data.error || 'Invalid password');
            }
        } catch (err) {
            setError('Connection refused.');
        }
    };

    const handleLogout = async () => {
        await fetch('/api/admin/login', { method: 'DELETE' });
        setIsAuthenticated(false);
    };

    const selectSection = (section: string) => {
        setActiveSection(section);
        syncEditor(cmsData, section);
    };

    const handleSaveCMS = async () => {
        setIsSaving(true);
        setMessage('');
        try {
            const res = await fetch('/api/admin/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    section: activeSection,
                    data: editorData,
                }),
            });

            if (res.ok) {
                setMessage('Changes published directly to the Next.js static files.');
                loadContent();
            } else {
                setMessage('Database Error while saving content.');
            }
        } catch (err) {
            setMessage('Failed to reach Node.js server.');
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage(''), 4000);
        }
    };

    const toggleTheme = () => {
        const current = document.documentElement.getAttribute('data-admin-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-admin-theme', next);
        localStorage.setItem('admin-theme', next);
    };

    // Rendering States
    if (!authChecked) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100%' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Initializing Secure Session...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="admin-auth-wrapper">
                <form onSubmit={handleLogin} className="admin-auth-box">
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{ width: '56px', height: '56px', background: 'var(--admin-primary)', borderRadius: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px', fontWeight: '900', marginBottom: '16px' }}>
                            AKS
                        </div>
                        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '900', letterSpacing: '-0.5px' }}>Admin Login</h1>
                        <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px', marginTop: '8px' }}>Enter the secure vault password.</p>
                    </div>

                    {error && <div style={{ background: 'var(--admin-danger-light)', color: 'var(--admin-danger)', padding: '16px', borderRadius: '12px', fontSize: '14px', textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>{error}</div>}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                        <label style={{ fontSize: '12px', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Admin Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="admin-input"
                            placeholder="••••••••••••"
                        />
                    </div>
                    <button type="submit" className="admin-btn" style={{ width: '100%', fontSize: '16px', padding: '16px' }}>
                        Access Dashboard
                    </button>
                </form>
            </div>
        );
    }

    return (
        <>
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <div className="admin-sidebar-logo">A</div>
                    <div className="admin-sidebar-title">
                        AKS <span style={{ color: 'var(--admin-primary)' }}>CMS</span>
                    </div>
                </div>
                <nav className="admin-nav">
                    <button onClick={() => setActiveTab('dashboard')} className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
                        <span className="admin-nav-icon">dashboard</span> Overview
                    </button>
                    <button onClick={() => setActiveTab('cms')} className={`admin-nav-item ${activeTab === 'cms' ? 'active' : ''}`}>
                        <span className="admin-nav-icon">article</span> Content & SEO
                    </button>
                    <button onClick={() => setActiveTab('visitors')} className={`admin-nav-item ${activeTab === 'visitors' ? 'active' : ''}`}>
                        <span className="admin-nav-icon">monitoring</span> User Traffic
                    </button>
                    <button onClick={() => setActiveTab('leads')} className={`admin-nav-item ${activeTab === 'leads' ? 'active' : ''}`}>
                        <span className="admin-nav-icon">chat_bubble</span> Leads Hub
                    </button>
                    <button onClick={() => setActiveTab('campaigns')} className={`admin-nav-item ${activeTab === 'campaigns' ? 'active' : ''}`}>
                        <span className="admin-nav-icon">campaign</span> Campaigns
                    </button>
                    <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--admin-border)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <button onClick={toggleTheme} className="admin-nav-item">
                            <span className="admin-nav-icon">contrast</span> Toggle Theme
                        </button>
                        <button onClick={handleLogout} className="admin-nav-item" style={{ color: 'var(--admin-danger)' }}>
                            <span className="admin-nav-icon">logout</span> Secure Logout
                        </button>
                    </div>
                </nav>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <div>
                        <h2 className="admin-header-title">
                            {activeTab === 'dashboard' && 'Admin Hub Overview'}
                            {activeTab === 'cms' && 'Dynamic Page Editor'}
                            {activeTab === 'visitors' && 'Real-Time Traffic Insights'}
                            {activeTab === 'leads' && 'Communications & Leads'}
                            {activeTab === 'campaigns' && 'Promotions Manager'}
                        </h2>
                        <p className="admin-header-subtitle">
                            {activeTab === 'dashboard' && 'Welcome back, Super Admin.'}
                            {activeTab === 'cms' && 'Directly override and build static site objects.'}
                            {activeTab === 'visitors' && 'Track unique visitors, active sessions, and referrals.'}
                            {activeTab === 'leads' && 'Manage inbound website form requests.'}
                            {activeTab === 'campaigns' && 'Deploy pop-ups and live banners.'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ padding: '8px 16px', borderRadius: '50px', background: 'var(--admin-success-light)', color: 'var(--admin-success)', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--admin-success)', display: 'block', animation: 'pulse 2s infinite' }}></span> System 100% Online
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Admin User</div>
                            <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>AKS Agency</div>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--admin-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
                    </div>
                </header>

                <div className="admin-content">
                    {message && (
                        <div style={{ background: 'var(--admin-success-light)', color: 'var(--admin-success)', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
                            <span>{message}</span>
                            <button onClick={() => setMessage('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '20px' }}>×</button>
                        </div>
                    )}

                    {/* TAB: DASHBOARD VIEW */}
                    {activeTab === 'dashboard' && (
                        <>
                            <div className="admin-grid-4">
                                <div className="admin-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <div style={{ color: 'var(--admin-text-muted)', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase' }}>Live Visitors</div>
                                            <div style={{ fontSize: '36px', fontWeight: '900', marginTop: '12px', color: 'var(--admin-primary)' }}>1,402</div>
                                        </div>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--admin-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-primary)' }}>
                                            <span className="material-symbols-outlined">group</span>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '16px', fontSize: '13px', color: 'var(--admin-success)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>trending_up</span> +14.2% since yesterday
                                    </div>
                                </div>
                                <div className="admin-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <div style={{ color: 'var(--admin-text-muted)', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase' }}>Avg. Page Speed</div>
                                            <div style={{ fontSize: '36px', fontWeight: '900', marginTop: '12px', color: 'var(--admin-success)' }}>100%</div>
                                        </div>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--admin-success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-success)' }}>
                                            <span className="material-symbols-outlined">bolt</span>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '16px', fontSize: '13px', color: 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        Lighthouse Core Vitals passed
                                    </div>
                                </div>
                                <div className="admin-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <div style={{ color: 'var(--admin-text-muted)', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase' }}>Total Leads</div>
                                            <div style={{ fontSize: '36px', fontWeight: '900', marginTop: '12px', color: '#8B5CF6' }}>89</div>
                                        </div>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
                                            <span className="material-symbols-outlined">email</span>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '16px', fontSize: '13px', color: 'var(--admin-success)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>trending_up</span> +3 today
                                    </div>
                                </div>
                                <div className="admin-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <div style={{ color: 'var(--admin-text-muted)', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase' }}>Conversion Rate</div>
                                            <div style={{ fontSize: '36px', fontWeight: '900', marginTop: '12px', color: '#ec4899' }}>6.4%</div>
                                        </div>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ec4899' }}>
                                            <span className="material-symbols-outlined">pie_chart</span>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '16px', fontSize: '13px', color: 'var(--admin-warning)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_right_alt</span> Steady
                                    </div>
                                </div>
                            </div>

                            <div className="admin-grid-2">
                                <div className="admin-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h3 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>Website Traffic Over Time</h3>
                                        <button className="admin-btn-outline" style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}>Last 7 Days</button>
                                    </div>
                                    <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px', marginBottom: '20px' }}>A simulation of your server visit volume and peak active hours.</p>

                                    <div className="chart-bar-wrap">
                                        {[40, 65, 30, 85, 50, 95, 75].map((val, i) => (
                                            <div key={i} className="chart-bar" style={{ height: `${val}%` }}>
                                                <div className="chart-bar-tooltip">{val}k Visits</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', color: 'var(--admin-text-muted)', fontSize: '12px', fontWeight: 'bold' }}>
                                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                                    </div>
                                </div>

                                <div className="admin-card">
                                    <h3 style={{ margin: '0 0 24px 0', fontSize: '20px' }}>Recent Hot Leads</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {[
                                            { name: 'Michael C.', request: 'New E-commerce build', time: '10 min ago', status: 'New', color: 'var(--admin-success)' },
                                            { name: 'Sarah L.', request: 'SEO Optimization', time: '2 hrs ago', status: 'Emailed', color: 'var(--admin-primary)' },
                                            { name: 'David R.', request: 'Custom CMS logic', time: 'Yesterday', status: 'Scheduled', color: 'var(--admin-warning)' },
                                        ].map((lead, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '12px', border: '1px solid var(--admin-border)', background: 'var(--admin-hover)' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--admin-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: `2px solid ${lead.color}` }}>
                                                    {lead.name.charAt(0)}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{lead.name}</div>
                                                    <div style={{ fontSize: '13px', color: 'var(--admin-text-muted)', marginTop: '2px' }}>{lead.request}</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: lead.color, background: `${lead.color}22`, padding: '4px 8px', borderRadius: '6px' }}>{lead.status}</div>
                                                    <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '6px' }}>{lead.time}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Quick Access Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '16px', marginTop: '8px' }}>
                                {[
                                    { href: '/admin/projects', icon: 'folder_kanban', label: 'Project Status Board', desc: 'Track design → development → deployed → payment', color: '#6366F1', grad: 'linear-gradient(135deg,#6366F1,#A855F7)' },
                                    { href: '/admin/leads', icon: 'view_kanban', label: 'Leads Pipeline', desc: 'Manage leads from new → interested → closed', color: '#3B82F6', grad: 'linear-gradient(135deg,#3B82F6,#06B6D4)' },
                                ].map(c => (
                                    <Link key={c.href} href={c.href} style={{ textDecoration: 'none' }}>
                                        <div className="admin-card" style={{ padding: '20px 22px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'all .25s', border: '1px solid var(--admin-border)' }}
                                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = c.color; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--admin-border)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: c.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '24px' }}>{c.icon}</span>
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--admin-text)' }}>{c.label}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '3px' }}>{c.desc}</div>
                                            </div>
                                            <span className="material-symbols-outlined" style={{ marginLeft: 'auto', color: 'var(--admin-text-muted)', fontSize: '20px' }}>arrow_forward</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                        </>
                    )}

                    {/* TAB: CMS */}
                    {activeTab === 'cms' && (
                        <div className="admin-cms-layout">
                            <div className="admin-cms-sidebar">
                                <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--admin-text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px' }}>Static Endpoints</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {cmsData?.sections && ['site', 'home', 'about', 'services', 'projects', 'contact'].map(section => {
                                        const hasOverrides = !!cmsData.sections[section]?.override;
                                        return (
                                            <button
                                                key={section}
                                                onClick={() => selectSection(section)}
                                                className={`admin-nav-item ${activeSection === section ? 'active' : ''}`}
                                                style={{ border: '1px solid var(--admin-border)', background: activeSection === section ? 'var(--admin-primary-light)' : 'var(--admin-card)' }}
                                            >
                                                <span style={{ textTransform: 'capitalize' }}>{section} {section === 'site' ? '(SEO)' : 'Page'}</span>
                                                {hasOverrides && <div style={{ marginLeft: 'auto', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--admin-primary)' }} />}
                                            </button>
                                        )
                                    })}
                                </div>

                                <div style={{ marginTop: '32px', padding: '16px', background: 'var(--admin-card)', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Pro Tip</div>
                                    <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', lineHeight: '1.6' }}>Clicking "Publish" writes your code directly to Next.js data constants in the filesystem for a true headless architecture.</div>
                                </div>
                            </div>

                            <div className="admin-cms-editor">
                                {activeSection && editorData ? (
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                            <div>
                                                <h2 style={{ fontSize: '24px', margin: '0 0 8px 0', textTransform: 'capitalize' }}>Editing {activeSection}</h2>
                                                <p style={{ margin: 0, color: 'var(--admin-text-muted)', fontSize: '14px' }}>Make sure to verify your string lengths for SEO.</p>
                                            </div>
                                            <button onClick={handleSaveCMS} disabled={isSaving} className="admin-btn">
                                                {isSaving ? 'Compiling...' : 'Publish Static Site'}
                                            </button>
                                        </div>

                                        <JsonEditor data={editorData} onChange={setEditorData} />

                                    </div>
                                ) : (
                                    <div>Loading Editor...</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* TAB: VISITORS */}
                    {activeTab === 'visitors' && (
                        <div className="admin-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '24px' }}>Site Traffic & Logs</h3>
                                    <p style={{ color: 'var(--admin-text-muted)', marginTop: '8px' }}>Monitor live visitors across all endpoints.</p>
                                </div>
                                <button className="admin-btn"><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>refresh</span> Sync Analytics</button>
                            </div>

                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>IP Address (Hashed)</th>
                                        <th>Location</th>
                                        <th>Device / OS</th>
                                        <th>Entry Page</th>
                                        <th>Time</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>192.168.***.***</strong></td>
                                        <td><span className="material-symbols-outlined" style={{ fontSize: '16px', verticalAlign: 'middle', color: '#3b82f6' }}>public</span> New York, US</td>
                                        <td>Chrome / Mac OS</td>
                                        <td><code>/projects</code></td>
                                        <td>Just Now</td>
                                        <td><span className="badge-success">Active</span></td>
                                    </tr>
                                    <tr>
                                        <td><strong>203.111.***.***</strong></td>
                                        <td><span className="material-symbols-outlined" style={{ fontSize: '16px', verticalAlign: 'middle', color: '#10b981' }}>public</span> London, UK</td>
                                        <td>Safari / iOS</td>
                                        <td><code>/about</code></td>
                                        <td>4m ago</td>
                                        <td><span className="badge-warning">Idle</span></td>
                                    </tr>
                                    <tr>
                                        <td><strong>14.22.***.***</strong></td>
                                        <td><span className="material-symbols-outlined" style={{ fontSize: '16px', verticalAlign: 'middle', color: '#f59e0b' }}>public</span> Mumbai, IN</td>
                                        <td>Edge / Windows</td>
                                        <td><code>/</code></td>
                                        <td>23m ago</td>
                                        <td><span className="badge-danger">Left</span></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div style={{ textAlign: 'center', marginTop: '32px' }}>
                                <button className="admin-btn-outline" style={{ padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Load More Logs</button>
                            </div>
                        </div>
                    )}

                    {/* TAB: LEADS */}
                    {activeTab === 'leads' && (() => {
                        const statusColors: Record<string, string> = {
                            new: 'var(--admin-primary)',
                            contacted: 'var(--admin-warning)',
                            qualified: 'var(--admin-success)',
                            closed: '#10b981',
                            lost: 'var(--admin-danger)',
                        };
                        const filteredLeads = fbLeads.filter(l => {
                            const matchStatus = fbStatusFilter === 'all' || l.status === fbStatusFilter;
                            const query = fbSearchQuery.toLowerCase();
                            const matchQuery = !query || [
                                l.leadgen_id,
                                l.form_id,
                                l.ad_id,
                                l.status,
                                ...(l.field_data || []).flatMap((f: any) => [f.name, ...(f.values || [])])
                            ].join(' ').toLowerCase().includes(query);
                            return matchStatus && matchQuery;
                        });

                        return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

                                {/* Facebook Lead Ads Section */}
                                <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                                    {/* Header */}
                                    <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg,#1877F2,#42A5F5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                            </div>
                                            <div>
                                                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Facebook Lead Ads</h3>
                                                <p style={{ margin: 0, fontSize: '13px', color: 'var(--admin-text-muted)' }}>Webhook-powered real-time leads from Meta campaigns</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                            <Link href="/admin/leads" style={{ padding: '8px 16px', borderRadius: '10px', background: 'var(--admin-primary-grad)', color: 'white', fontWeight: 700, fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>view_kanban</span> Pipeline
                                            </Link>
                                            <button onClick={loadFbLeads} className="admin-btn-outline" style={{ padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>refresh</span> Refresh
                                            </button>
                                            <button onClick={exportLeadsCSV} className="admin-btn" style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '13px' }} disabled={!fbLeads.length}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span> Export CSV
                                            </button>
                                        </div>
                                    </div>

                                    {/* Stats Row */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', borderBottom: '1px solid var(--admin-border)' }}>
                                        {[
                                            { label: 'Total', count: fbLeads.length, color: 'var(--admin-primary)' },
                                            { label: 'New', count: fbLeads.filter(l => l.status === 'new').length, color: 'var(--admin-primary)' },
                                            { label: 'Contacted', count: fbLeads.filter(l => l.status === 'contacted').length, color: 'var(--admin-warning)' },
                                            { label: 'Qualified', count: fbLeads.filter(l => l.status === 'qualified').length, color: 'var(--admin-success)' },
                                            { label: 'Closed', count: fbLeads.filter(l => l.status === 'closed').length, color: '#10b981' },
                                        ].map((s, i) => (
                                            <div key={i} style={{ padding: '16px 20px', borderRight: i < 4 ? '1px solid var(--admin-border)' : 'none', textAlign: 'center', cursor: 'pointer', background: fbStatusFilter === (i === 0 ? 'all' : s.label.toLowerCase()) ? 'var(--admin-hover)' : 'transparent' }}
                                                onClick={() => setFbStatusFilter(i === 0 ? 'all' : s.label.toLowerCase())}>
                                                <div style={{ fontSize: '24px', fontWeight: 900, color: s.color }}>{s.count}</div>
                                                <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', fontWeight: 700, textTransform: 'uppercase', marginTop: '4px' }}>{s.label}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Search & Filter Bar */}
                                    <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--admin-border)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <div style={{ flex: 1, position: 'relative' }}>
                                            <span className="material-symbols-outlined" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: 'var(--admin-text-muted)' }}>search</span>
                                            <input
                                                value={fbSearchQuery}
                                                onChange={e => setFbSearchQuery(e.target.value)}
                                                placeholder="Search by name, email, phone, lead ID..."
                                                className="admin-input"
                                                style={{ paddingLeft: '42px' }}
                                            />
                                        </div>
                                        <select
                                            value={fbStatusFilter}
                                            onChange={e => setFbStatusFilter(e.target.value)}
                                            className="admin-input"
                                            style={{ width: 'auto', minWidth: '140px' }}
                                        >
                                            <option value="all">All Status</option>
                                            <option value="new">New</option>
                                            <option value="contacted">Contacted</option>
                                            <option value="qualified">Qualified</option>
                                            <option value="closed">Closed</option>
                                            <option value="lost">Lost</option>
                                        </select>
                                    </div>

                                    {/* Body */}
                                    <div style={{ padding: '0' }}>
                                        {fbLeadsLoading ? (
                                            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '48px', animation: 'spin 1s linear infinite', display: 'block', marginBottom: '16px' }}>autorenew</span>
                                                Loading leads from Facebook...
                                            </div>
                                        ) : fbLeadsError ? (
                                            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-danger)' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}>error</span>
                                                {fbLeadsError}
                                            </div>
                                        ) : filteredLeads.length === 0 ? (
                                            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                                                <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'linear-gradient(135deg,#1877F2,#42A5F5)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                                </div>
                                                <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>No Facebook leads yet</div>
                                                <p style={{ maxWidth: '400px', margin: '0 auto', fontSize: '14px', lineHeight: 1.6 }}>Once you set up the Facebook Webhook and connect your Lead Ad forms, new leads will appear here in real time.</p>
                                                <div style={{ marginTop: '24px', padding: '16px 20px', background: 'var(--admin-hover)', borderRadius: '12px', maxWidth: '500px', margin: '24px auto 0', textAlign: 'left' }}>
                                                    <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '10px', color: 'var(--admin-primary)' }}>📋 Webhook Setup Checklist</div>
                                                    {[
                                                        'Set FACEBOOK_WEBHOOK_VERIFY_TOKEN in .env.local',
                                                        'Set FACEBOOK_PAGE_ACCESS_TOKEN (long-lived) in .env.local',
                                                        'Register webhook URL in Meta App Dashboard → Webhooks',
                                                        'Subscribe to the "leadgen" field on your Page',
                                                        'Webhook URL: https://your-domain.com/api/facebook-leads',
                                                    ].map((step, i) => (
                                                        <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '6px', fontSize: '13px' }}>
                                                            <span style={{ color: 'var(--admin-success)', fontWeight: 700, minWidth: '18px' }}>✓</span>
                                                            <span style={{ color: 'var(--admin-text-muted)' }}>{step}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                {filteredLeads.map((lead: any) => {
                                                    const isExpanded = expandedLead === lead.leadgen_id;
                                                    const name = (lead.field_data || []).find((f: any) => f.name === 'full_name' || f.name === 'name')?.values?.[0] || 'Unknown';
                                                    const email = (lead.field_data || []).find((f: any) => f.name === 'email')?.values?.[0] || '';
                                                    const phone = (lead.field_data || []).find((f: any) => f.name === 'phone_number' || f.name === 'phone')?.values?.[0] || '';
                                                    const statusColor = statusColors[lead.status] || 'var(--admin-text-muted)';
                                                    return (
                                                        <div key={lead.leadgen_id} style={{ borderBottom: '1px solid var(--admin-border)' }}>
                                                            <div
                                                                style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'background 0.2s' }}
                                                                onMouseEnter={e => (e.currentTarget.style.background = 'var(--admin-hover)')}
                                                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                                                onClick={() => setExpandedLead(isExpanded ? null : lead.leadgen_id)}
                                                            >
                                                                {/* Avatar */}
                                                                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg,#1877F2,#42A5F5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '16px', flexShrink: 0 }}>
                                                                    {name.charAt(0).toUpperCase()}
                                                                </div>
                                                                {/* Info */}
                                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                                    <div style={{ fontWeight: 700, fontSize: '15px' }}>{name}</div>
                                                                    <div style={{ fontSize: '13px', color: 'var(--admin-text-muted)', display: 'flex', gap: '12px', marginTop: '3px', flexWrap: 'wrap' }}>
                                                                        {email && <span>✉ {email}</span>}
                                                                        {phone && <span>📞 {phone}</span>}
                                                                        <span style={{ fontSize: '11px' }}>ID: {lead.leadgen_id}</span>
                                                                    </div>
                                                                </div>
                                                                {/* Status + Time */}
                                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                                                                    <span style={{ fontSize: '12px', fontWeight: 700, color: statusColor, background: `${statusColor}22`, padding: '4px 10px', borderRadius: '20px', textTransform: 'capitalize' }}>
                                                                        {lead.status || 'new'}
                                                                    </span>
                                                                    <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                                                                        {lead.received_at ? new Date(lead.received_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                                                                    </span>
                                                                </div>
                                                                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--admin-text-muted)', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>expand_more</span>
                                                            </div>

                                                            {/* Expanded Detail Panel */}
                                                            {isExpanded && (
                                                                <div style={{ padding: '20px 24px 24px', background: 'var(--admin-hover)', borderTop: '1px solid var(--admin-border)', animation: 'fadeIn 0.3s ease' }}>
                                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                                                        {/* Field Data */}
                                                                        <div>
                                                                            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Lead Fields</div>
                                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                                                {(lead.field_data || []).length > 0 ? (
                                                                                    lead.field_data.map((field: any, idx: number) => (
                                                                                        <div key={idx} style={{ display: 'flex', gap: '12px', padding: '10px 14px', background: 'var(--admin-card)', borderRadius: '10px', border: '1px solid var(--admin-border)' }}>
                                                                                            <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)', fontWeight: 700, minWidth: '100px', textTransform: 'capitalize' }}>{field.name.replace(/_/g, ' ')}</span>
                                                                                            <span style={{ fontSize: '13px', fontWeight: 600 }}>{(field.values || []).join(', ')}</span>
                                                                                        </div>
                                                                                    ))
                                                                                ) : (
                                                                                    <div style={{ fontSize: '13px', color: 'var(--admin-text-muted)', padding: '10px 0' }}>Field data will appear after lead is fetched from Graph API.</div>
                                                                                )}
                                                                            </div>
                                                                            {/* Meta Info */}
                                                                            <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                                                {[['Form ID', lead.form_id], ['Ad ID', lead.ad_id], ['Adgroup ID', lead.adgroup_id], ['Page ID', lead.page_id]].map(([k, v]) => v ? (
                                                                                    <span key={k} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '20px', background: 'var(--admin-card)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-muted)' }}>{k}: {v}</span>
                                                                                ) : null)}
                                                                            </div>
                                                                        </div>
                                                                        {/* Actions: Right Panel */}
                                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                                            {/* Status */}
                                                                            <div>
                                                                                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Update Status</div>
                                                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                                                    {['new', 'contacted', 'qualified', 'closed', 'lost'].map(s => (
                                                                                        <button
                                                                                            key={s}
                                                                                            onClick={e => { e.stopPropagation(); updateLeadStatus(lead.leadgen_id, s); }}
                                                                                            disabled={leadStatusUpdating === lead.leadgen_id}
                                                                                            style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid', borderColor: lead.status === s ? statusColors[s] : 'var(--admin-border)', background: lead.status === s ? `${statusColors[s]}22` : 'var(--admin-card)', color: lead.status === s ? statusColors[s] : 'var(--admin-text-muted)', fontWeight: 700, fontSize: '12px', cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'inherit', transition: 'all 0.2s' }}
                                                                                        >
                                                                                            {s}
                                                                                        </button>
                                                                                    ))}
                                                                                </div>
                                                                            </div>

                                                                            {/* Notes */}
                                                                            <div>
                                                                                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Internal Notes</div>
                                                                                <textarea
                                                                                    value={fbLeadNotes[lead.leadgen_id] ?? lead.notes ?? ''}
                                                                                    onChange={e => setFbLeadNotes(prev => ({ ...prev, [lead.leadgen_id]: e.target.value }))}
                                                                                    placeholder="Add private notes..."
                                                                                    className="admin-input"
                                                                                    style={{ minHeight: '64px', resize: 'vertical' }}
                                                                                    onClick={e => e.stopPropagation()}
                                                                                />
                                                                                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                                                                    <button onClick={e => { e.stopPropagation(); saveLeadNotes(lead.leadgen_id); }} className="admin-btn" style={{ padding: '7px 14px', fontSize: '12px' }}>Save Notes</button>
                                                                                    {email && <a href={`mailto:${email}`} style={{ padding: '7px 14px', borderRadius: '10px', background: 'var(--admin-success-light)', color: 'var(--admin-success)', fontWeight: 700, fontSize: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }} onClick={e => e.stopPropagation()}><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>mail</span>Email</a>}
                                                                                    <button onClick={e => { e.stopPropagation(); deleteLead(lead.leadgen_id); }} style={{ padding: '7px 12px', borderRadius: '10px', background: 'var(--admin-danger-light)', color: 'var(--admin-danger)', border: 'none', fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', marginLeft: 'auto' }}><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>delete</span></button>
                                                                                </div>
                                                                            </div>

                                                                            {/* WhatsApp Messenger */}
                                                                            {phone && (
                                                                                <div style={{ background: 'var(--admin-card)', borderRadius: '14px', border: '1px solid var(--admin-border)', overflow: 'hidden' }} onClick={e => { e.stopPropagation(); if (!waMessages[lead.leadgen_id]) loadWaMessages(lead.leadgen_id); }}>
                                                                                    {/* WA Header */}
                                                                                    <div style={{ padding: '12px 16px', background: 'linear-gradient(135deg,#25D366,#128C7E)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                                                                        <span style={{ color: 'white', fontWeight: 700, fontSize: '13px' }}>WhatsApp — {phone}</span>
                                                                                    </div>

                                                                                    {/* Message History */}
                                                                                    <div style={{ maxHeight: '180px', overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px', background: '#ECE5DD11' }}>
                                                                                        {(waMessages[lead.leadgen_id] ?? []).length === 0 ? (
                                                                                            <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', textAlign: 'center', padding: '12px 0' }}>No messages yet. Send the first one below.</div>
                                                                                        ) : (
                                                                                            (waMessages[lead.leadgen_id] ?? []).slice().reverse().map((m: any, i: number) => {
                                                                                                const isOut = m.direction === 'outbound';
                                                                                                const statusIcon: Record<string, string> = { sent: '✓', delivered: '✓✓', read: '✓✓', failed: '✗', received: '' };
                                                                                                return (
                                                                                                    <div key={i} style={{ display: 'flex', justifyContent: isOut ? 'flex-end' : 'flex-start' }}>
                                                                                                        <div style={{ maxWidth: '80%', padding: '8px 12px', borderRadius: isOut ? '12px 12px 0 12px' : '12px 12px 12px 0', background: isOut ? '#DCF8C6' : 'var(--admin-card)', fontSize: '12px', color: '#111', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                                                                                            <div>{m.content}</div>
                                                                                                            <div style={{ fontSize: '10px', color: '#666', marginTop: '4px', textAlign: 'right' }}>
                                                                                                                {m.sent_at ? new Date(m.sent_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
                                                                                                                {isOut && <span style={{ marginLeft: '4px', color: m.status === 'read' ? '#53bdeb' : '#999' }}>{statusIcon[m.status] ?? '?'}</span>}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                );
                                                                                            })
                                                                                        )}
                                                                                    </div>

                                                                                    {/* Compose */}
                                                                                    <div style={{ padding: '10px 12px', borderTop: '1px solid var(--admin-border)', display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                                                                                        <textarea
                                                                                            value={waCompose[lead.leadgen_id] ?? ''}
                                                                                            onChange={e => setWaCompose(prev => ({ ...prev, [lead.leadgen_id]: e.target.value }))}
                                                                                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendWhatsApp(phone, lead.leadgen_id); } }}
                                                                                            placeholder="Type a message..."
                                                                                            className="admin-input"
                                                                                            style={{ flex: 1, minHeight: '40px', maxHeight: '100px', resize: 'none', fontSize: '13px', padding: '8px 12px' }}
                                                                                            onClick={e => e.stopPropagation()}
                                                                                        />
                                                                                        <button
                                                                                            onClick={e => { e.stopPropagation(); sendWhatsApp(phone, lead.leadgen_id); }}
                                                                                            disabled={waSending === lead.leadgen_id || !(waCompose[lead.leadgen_id] ?? '').trim()}
                                                                                            style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#25D366', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: waSending === lead.leadgen_id ? 0.6 : 1 }}
                                                                                        >
                                                                                            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'white' }}>send</span>
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Website Form Intakes */}
                                <div className="admin-card">
                                    <h3 style={{ margin: '0 0 16px', fontSize: '18px' }}>Website Form Intakes</h3>
                                    <div style={{ padding: '16px', border: '1px solid var(--admin-border)', borderRadius: '12px', marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <strong>New Website Request</strong>
                                            <span style={{ fontSize: '12px', color: 'var(--admin-primary)' }}>12 mins ago</span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--admin-text-muted)' }}>From: contact@agency.com — check Nodemailer inbox.</p>
                                    </div>
                                </div>

                            </div>
                        );
                    })()}

                    {/* TAB: CAMPAIGNS — WhatsApp Automation */}
                    {activeTab === 'campaigns' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                            {/* Header */}
                            <div className="admin-card" style={{ padding: '24px 28px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg,#25D366,#128C7E)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>WhatsApp Automation</h3>
                                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--admin-text-muted)' }}>Follow-up sequences sent automatically via WhatsApp Cloud API</p>
                                        </div>
                                    </div>
                                    <button onClick={() => { setShowSeqBuilder(true); }} className="admin-btn" style={{ padding: '10px 20px' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span> New Sequence
                                    </button>
                                </div>

                                {/* How it works */}
                                <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                                    {[
                                        { icon: 'person_add', label: 'Lead Created', desc: 'FB Lead Ad triggers webhook' },
                                        { icon: 'schedule', label: 'Queue Scheduled', desc: 'Steps queued per sequence' },
                                        { icon: 'chat', label: 'Message Sent', desc: 'WhatsApp Cloud API delivers' },
                                        { icon: 'autorenew', label: 'Follow-ups', desc: 'Cron runs every 30 min' },
                                    ].map((step, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px 16px', background: 'var(--admin-hover)', borderRadius: '12px' }}>
                                            <span className="material-symbols-outlined" style={{ color: '#25D366', fontSize: '22px' }}>{step.icon}</span>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '13px' }}>{step.label}</div>
                                                <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>{step.desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sequence Builder Modal */}
                            {showSeqBuilder && (
                                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowSeqBuilder(false)}>
                                    <div style={{ background: 'var(--admin-card)', backdropFilter: 'blur(20px)', border: '1px solid var(--admin-border)', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                                        <h3 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: 800 }}>Build Follow-up Sequence</h3>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                                            <div>
                                                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>Sequence Name *</label>
                                                <input value={seqDraft.name} onChange={e => setSeqDraft(p => ({ ...p, name: e.target.value }))} placeholder="e.g. New Lead Welcome" className="admin-input" />
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                <div>
                                                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>Trigger</label>
                                                    <select value={seqDraft.trigger} onChange={e => setSeqDraft(p => ({ ...p, trigger: e.target.value }))} className="admin-input">
                                                        <option value="manual">Manual Only</option>
                                                        <option value="on_new_lead">Auto — On New FB Lead</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>Description</label>
                                                    <input value={seqDraft.description} onChange={e => setSeqDraft(p => ({ ...p, description: e.target.value }))} placeholder="Optional" className="admin-input" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Steps */}
                                        <div style={{ marginBottom: '20px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                                <span style={{ fontSize: '13px', fontWeight: 700 }}>Steps ({seqDraft.steps.length})</span>
                                                <button onClick={addSeqStep} className="admin-btn-outline" style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: 700 }}>+ Add Step</button>
                                            </div>
                                            {seqDraft.steps.length === 0 ? (
                                                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--admin-text-muted)', border: '1px dashed var(--admin-border)', borderRadius: '12px', fontSize: '13px' }}>Click "+ Add Step" to build your sequence</div>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                    {seqDraft.steps.map((step, idx) => (
                                                        <div key={idx} style={{ padding: '16px', background: 'var(--admin-hover)', borderRadius: '12px', border: '1px solid var(--admin-border)', position: 'relative' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#25D366', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>{idx + 1}</div>
                                                                    <span style={{ fontSize: '13px', fontWeight: 700 }}>{idx === 0 ? 'Immediate' : `After ${step.delay_hours}h`}</span>
                                                                </div>
                                                                <button onClick={() => removeSeqStep(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-danger)', fontSize: '18px', lineHeight: 1 }}>×</button>
                                                            </div>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '10px', alignItems: 'start' }}>
                                                                {idx > 0 && (
                                                                    <div>
                                                                        <label style={{ fontSize: '11px', color: 'var(--admin-text-muted)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>DELAY (HRS)</label>
                                                                        <input type="number" min="1" value={step.delay_hours} onChange={e => updateSeqStep(idx, 'delay_hours', Number(e.target.value))} className="admin-input" style={{ padding: '8px 10px' }} />
                                                                    </div>
                                                                )}
                                                                <div style={{ gridColumn: idx === 0 ? '1 / -1' : 'auto' }}>
                                                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                                                        {['text', 'template'].map(t => (
                                                                            <button key={t} onClick={() => updateSeqStep(idx, 'type', t)} style={{ padding: '4px 12px', borderRadius: '20px', border: '1px solid', borderColor: step.type === t ? '#25D366' : 'var(--admin-border)', background: step.type === t ? 'rgba(37,211,102,0.15)' : 'transparent', color: step.type === t ? '#25D366' : 'var(--admin-text-muted)', fontWeight: 700, fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize' }}>{t}</button>
                                                                        ))}
                                                                    </div>
                                                                    {step.type === 'text' ? (
                                                                        <textarea value={step.message ?? ''} onChange={e => updateSeqStep(idx, 'message', e.target.value)} placeholder="Message text... (use {name}, {phone} as variables)" className="admin-input" style={{ minHeight: '72px', fontSize: '13px' }} />
                                                                    ) : (
                                                                        <input value={step.template_name ?? ''} onChange={e => updateSeqStep(idx, 'template_name', e.target.value)} placeholder="Approved template name (e.g. welcome_aks)" className="admin-input" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                            <button onClick={() => setShowSeqBuilder(false)} className="admin-btn-outline" style={{ padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700 }}>Cancel</button>
                                            <button onClick={saveSequence} disabled={seqSaving || !seqDraft.name || !seqDraft.steps.length} className="admin-btn" style={{ padding: '10px 24px' }}>{seqSaving ? 'Saving...' : 'Save Sequence'}</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Sequences List */}
                            <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Active Sequences</h4>
                                    <button onClick={loadWaSequences} className="admin-btn-outline" style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>refresh</span>Refresh
                                    </button>
                                </div>
                                {waSeqLoading ? (
                                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading sequences...</div>
                                ) : waSequences.length === 0 ? (
                                    <div style={{ padding: '48px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '40px', display: 'block', marginBottom: '12px', color: 'var(--admin-border)' }}>smart_toy</span>
                                        No automation sequences yet. Create one above.
                                    </div>
                                ) : waSequences.map((seq: any) => (
                                    <div key={seq.id} style={{ padding: '18px 24px', borderBottom: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: seq.is_active ? 'rgba(37,211,102,0.15)' : 'var(--admin-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: seq.is_active ? '#25D366' : 'var(--admin-text-muted)' }}>smart_toy</span>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 700, fontSize: '14px' }}>{seq.name}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '3px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                                <span>{(seq.steps ?? []).length} step{(seq.steps ?? []).length !== 1 ? 's' : ''}</span>
                                                <span>Trigger: {seq.trigger === 'on_new_lead' ? '🔄 Auto on new lead' : '🖐 Manual'}</span>
                                                {seq.description && <span>{seq.description}</span>}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 700, color: seq.is_active ? '#25D366' : 'var(--admin-text-muted)' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={seq.is_active}
                                                    onChange={e => toggleSequence(seq.id, e.target.checked)}
                                                    style={{ accentColor: '#25D366', width: '16px', height: '16px' }}
                                                />
                                                {seq.is_active ? 'Active' : 'Paused'}
                                            </label>
                                            <button onClick={() => deleteSequence(seq.id)} style={{ padding: '6px 10px', borderRadius: '8px', background: 'var(--admin-danger-light)', color: 'var(--admin-danger)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700 }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Cron info card */}
                            <div className="admin-card" style={{ padding: '20px 24px', background: 'rgba(37,211,102,0.05)', border: '1px solid rgba(37,211,102,0.2)' }}>
                                <div style={{ fontWeight: 700, marginBottom: '8px', fontSize: '14px', color: '#25D366' }}>⚡ Cron Setup for Scheduled Follow-ups</div>
                                <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'var(--admin-text-muted)', lineHeight: 1.6 }}>Schedule <code style={{ background: 'var(--admin-hover)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>POST /api/cron/process-followups</code> to run every 15-30 minutes with header <code style={{ background: 'var(--admin-hover)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>x-cron-secret: YOUR_CRON_SECRET</code></p>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    {[['Vercel Cron', 'Free on Pro plan — add to vercel.json'], ['cron-job.org', 'Free external cron — no server needed'], ['GitHub Actions', 'Free scheduled workflows']].map(([tool, desc]) => (
                                        <div key={tool} style={{ padding: '8px 14px', borderRadius: '10px', background: 'var(--admin-card)', border: '1px solid var(--admin-border)', fontSize: '12px' }}>
                                            <div style={{ fontWeight: 700 }}>{tool}</div>
                                            <div style={{ color: 'var(--admin-text-muted)', fontSize: '11px' }}>{desc}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ── Notification Contacts ── */}
                            <NotificationContacts />

                        </div>
                    )}

                </div>
            </main >
        </>
    );
}
