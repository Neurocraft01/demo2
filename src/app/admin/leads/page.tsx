'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../admin.css';

// ─── Status Config ────────────────────────────────────────────────────────────
const STATUSES = [
    { key: 'new', label: 'New', color: '#3B82F6', light: 'rgba(59,130,246,0.12)', icon: '⚡' },
    { key: 'follow_up', label: 'Follow Up', color: '#F59E0B', light: 'rgba(245,158,11,0.12)', icon: '📞' },
    { key: 'interested', label: 'Interested', color: '#10B981', light: 'rgba(16,185,129,0.12)', icon: '💚' },
    { key: 'negotiation', label: 'Negotiation', color: '#8B5CF6', light: 'rgba(139,92,246,0.12)', icon: '🤝' },
    { key: 'closed_won', label: 'Closed Won', color: '#059669', light: 'rgba(5,150,105,0.12)', icon: '🏆' },
    { key: 'closed_lost', label: 'Closed Lost', color: '#EF4444', light: 'rgba(239,68,68,0.12)', icon: '✗' },
];

const LEGACY: Record<string, string> = { contacted: 'follow_up', qualified: 'interested', closed: 'closed_won', lost: 'closed_lost' };
const norm = (s: string) => LEGACY[s] || s;
const statusMeta = (key: string) => STATUSES.find(s => s.key === norm(key)) ?? STATUSES[0];

function gf(fd: any[], ...ns: string[]) {
    for (const n of ns) { const f = fd?.find((x: any) => x.name === n); if (f?.values?.[0]) return f.values[0]; }
    return '';
}
function ago(iso: string) {
    if (!iso) return '';
    const d = Date.now() - new Date(iso).getTime();
    const m = Math.floor(d / 60000);
    if (m < 2) return 'just now'; if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
}
function clean(p: string) { return p.replace(/\D/g, ''); }

// ─── Component ────────────────────────────────────────────────────────────────
export default function LeadsPipeline() {
    const router = useRouter();
    const [authed, setAuthed] = useState(false);
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'kanban' | 'list'>('kanban');
    const [search, setSearch] = useState('');
    const [filterStatus, setFilter] = useState('');
    const [selected, setSelected] = useState<any>(null);
    const [panelTab, setPanelTab] = useState<'details' | 'whatsapp' | 'notes'>('details');
    const [notes, setNotes] = useState<Record<string, string>>({});
    const [dragId, setDragId] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState<string | null>(null);
    const [updating, setUpdating] = useState<string | null>(null);
    const [waMsg, setWaMsg] = useState('');
    const [waSending, setWaSending] = useState(false);
    const [waHistory, setWaHistory] = useState<any[]>([]);
    const [toast, setToast] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [addForm, setAddForm] = useState({ name: '', email: '', phone: '', status: 'new', notes: '' });
    const [addSaving, setAddSaving] = useState(false);

    const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    // ── Auth ──────────────────────────────────────────────────────────────────
    useEffect(() => {
        fetch('/api/admin/login').then(r => {
            if (r.ok) { setAuthed(true); } else { router.replace('/admin'); }
        }).catch(() => router.replace('/admin'));
    }, [router]);

    // ── Load ──────────────────────────────────────────────────────────────────
    const load = useCallback(async () => {
        setLoading(true);
        const r = await fetch('/api/admin/fb-leads');
        if (r.ok) { const d = await r.json(); setLeads(d.leads || []); }
        setLoading(false);
    }, []);

    useEffect(() => { if (authed) load(); }, [authed, load]);

    // ── Update status ─────────────────────────────────────────────────────────
    const updateStatus = async (leadgen_id: string, status: string) => {
        setUpdating(leadgen_id);
        const r = await fetch('/api/admin/fb-leads', {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ leadgen_id, status }),
        });
        if (r.ok) {
            setLeads(prev => prev.map(l => l.leadgen_id === leadgen_id ? { ...l, status } : l));
            if (selected?.leadgen_id === leadgen_id) setSelected((p: any) => ({ ...p, status }));
            notify('Status updated ✅');
        }
        setUpdating(null);
    };

    const saveNotes = async (leadgen_id: string) => {
        const n = notes[leadgen_id] ?? '';
        await fetch('/api/admin/fb-leads', {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ leadgen_id, notes: n }),
        });
        setLeads(prev => prev.map(l => l.leadgen_id === leadgen_id ? { ...l, notes: n } : l));
        if (selected?.leadgen_id === leadgen_id) setSelected((p: any) => ({ ...p, notes: n }));
        notify('Notes saved ✅');
    };

    const deleteLead = async (leadgen_id: string) => {
        if (!confirm('Delete this lead permanently?')) return;
        await fetch(`/api/admin/fb-leads?leadgen_id=${leadgen_id}`, { method: 'DELETE' });
        setLeads(prev => prev.filter(l => l.leadgen_id !== leadgen_id));
        setSelected(null);
        notify('Lead deleted');
    };

    // ── WhatsApp ──────────────────────────────────────────────────────────────
    const loadWA = useCallback(async (lead_id: string) => {
        const r = await fetch(`/api/send-whatsapp?lead_id=${lead_id}`);
        if (r.ok) { const d = await r.json(); setWaHistory(d.messages || []); }
    }, []);

    useEffect(() => {
        if (selected && panelTab === 'whatsapp') { loadWA(selected.leadgen_id); }
    }, [selected, panelTab, loadWA]);

    const sendWA = async () => {
        if (!waMsg.trim() || !selected) return;
        const phone = gf(selected.field_data || [], 'phone_number', 'phone');
        if (!phone) return notify('No phone number on this lead');
        setWaSending(true);
        const r = await fetch('/api/send-whatsapp', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'text', phone: clean(phone), message: waMsg, lead_id: selected.leadgen_id }),
        });
        if (r.ok) { setWaMsg(''); await loadWA(selected.leadgen_id); notify('Message sent ✅'); }
        else notify('Send failed ❌');
        setWaSending(false);
    };

    // ── Add manual lead ───────────────────────────────────────────────────────
    const addLead = async () => {
        if (!addForm.name) return;
        setAddSaving(true);
        const r = await fetch('/api/admin/fb-leads', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(addForm),
        });
        if (r.ok) { await load(); setShowAdd(false); setAddForm({ name: '', email: '', phone: '', status: 'new', notes: '' }); notify('Lead added ✅'); }
        setAddSaving(false);
    };

    // ── DnD ───────────────────────────────────────────────────────────────────
    const onDrop = (status: string) => {
        if (dragId && dragId !== status) { updateStatus(dragId, status); }
        setDragId(null); setDragOver(null);
    };

    // ── Export ────────────────────────────────────────────────────────────────
    const exportCSV = () => {
        const fns = Array.from(new Set(leads.flatMap(l => (l.field_data || []).map((f: any) => f.name))));
        const hdr = ['Lead ID', 'Status', 'Received', ...fns, 'Notes'];
        const rows = leads.map(l => {
            const fv: Record<string, string> = {};
            (l.field_data || []).forEach((f: any) => { fv[f.name] = (f.values || []).join(', '); });
            return [l.leadgen_id, l.status, l.received_at, ...fns.map(n => fv[n] || ''), l.notes || ''];
        });
        const csv = [hdr, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
        const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: `leads-${Date.now()}.csv` });
        a.click();
    };

    // ── Derived ───────────────────────────────────────────────────────────────
    const filtered = leads.filter(l => {
        const q = search.toLowerCase();
        if (filterStatus && norm(l.status) !== filterStatus) return false;
        if (!q) return true;
        const name = gf(l.field_data || [], 'full_name', 'name').toLowerCase();
        const email = gf(l.field_data || [], 'email').toLowerCase();
        const phone = gf(l.field_data || [], 'phone_number', 'phone').toLowerCase();
        return name.includes(q) || email.includes(q) || phone.includes(q) || l.leadgen_id?.includes(q);
    });

    const grouped = Object.fromEntries(STATUSES.map(s => [s.key, filtered.filter(l => norm(l.status) === s.key)]));

    if (!authed) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif' }}>
            <div style={{ fontSize: '14px', color: '#888' }}>Authenticating...</div>
        </div>
    );

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
                * { box-sizing: border-box; }
                body { margin: 0; background: var(--admin-bg); color: var(--admin-text); font-family: 'Outfit', sans-serif; }
                .lp-card { background: var(--admin-card); border: 1px solid var(--admin-border); border-radius: 14px; backdrop-filter: blur(16px); }
                .lp-lead-card { background: var(--admin-card); border: 1px solid var(--admin-border); border-radius: 12px; padding: 14px; cursor: pointer; transition: all 0.2s; user-select: none; }
                .lp-lead-card:hover { border-color: var(--admin-primary); box-shadow: 0 6px 24px rgba(0,0,0,0.1); transform: translateY(-2px); }
                .lp-lead-card.dragging { opacity: 0.4; transform: rotate(2deg); }
                .lp-col { min-height: 300px; border-radius: 12px; transition: background 0.2s; padding: 8px; }
                .lp-col.drag-over { background: rgba(79,70,229,0.06); outline: 2px dashed var(--admin-primary); }
                .lp-input { background: var(--admin-card); border: 1px solid var(--admin-border); color: var(--admin-text); border-radius: 10px; padding: 10px 14px; font-family: inherit; font-size: 14px; width: 100%; outline: none; transition: border 0.2s; }
                .lp-input:focus { border-color: var(--admin-primary); }
                .lp-btn { background: var(--admin-primary-grad); color: white; border: none; border-radius: 10px; padding: 10px 20px; font-weight: 700; font-family: inherit; cursor: pointer; font-size: 14px; display: inline-flex; align-items: center; gap: 6px; transition: opacity 0.2s; }
                .lp-btn:hover { opacity: 0.9; }
                .lp-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                .lp-btn-sm { padding: 6px 14px; font-size: 12px; border-radius: 8px; }
                .lp-ghost { background: transparent; border: 1px solid var(--admin-border); color: var(--admin-text); border-radius: 10px; padding: 8px 16px; font-weight: 700; font-family: inherit; cursor: pointer; font-size: 13px; transition: all 0.2s; }
                .lp-ghost:hover { background: var(--admin-hover); }
                .wa-bubble-out { background: #DCF8C6; color: #111; border-radius: 14px 14px 0 14px; padding: 8px 12px; max-width: 78%; font-size: 13px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
                .wa-bubble-in  { background: var(--admin-card); color: var(--admin-text); border-radius: 14px 14px 14px 0; padding: 8px 12px; max-width: 78%; font-size: 13px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
                .pipeline-step { flex: 1; height: 4px; border-radius: 2px; transition: background 0.3s; }
                @keyframes toast-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .lp-toast { animation: toast-in 0.3s ease; position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); background: #0F172A; color: white; padding: 12px 24px; border-radius: 30px; font-size: 14px; font-weight: 600; z-index: 2000; box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
            `}</style>

            {/* Toast */}
            {toast && <div className="lp-toast">{toast}</div>}

            {/* Header */}
            <header style={{ background: 'var(--admin-sidebar)', borderBottom: '1px solid var(--admin-border)', padding: '0 28px', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)' }}>
                <div style={{ maxWidth: '1600px', margin: '0 auto', height: '60px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--admin-text-muted)', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span> Admin
                    </Link>
                    <span style={{ color: 'var(--admin-border)' }}>/</span>
                    <h1 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Leads Pipeline</h1>
                    <div style={{ flex: 1 }} />
                    {/* View toggle */}
                    <div style={{ display: 'flex', gap: '4px', background: 'var(--admin-hover)', borderRadius: '10px', padding: '4px' }}>
                        {(['kanban', 'list'] as const).map(v => (
                            <button key={v} onClick={() => setView(v)} style={{ padding: '5px 14px', borderRadius: '8px', border: 'none', fontFamily: 'inherit', fontWeight: 700, fontSize: '12px', cursor: 'pointer', textTransform: 'capitalize', background: view === v ? 'var(--admin-card)' : 'transparent', color: view === v ? 'var(--admin-primary)' : 'var(--admin-text-muted)', transition: 'all 0.2s', boxShadow: view === v ? '0 2px 8px rgba(0,0,0,0.08)' : 'none' }}>{v}</button>
                        ))}
                    </div>
                    <button onClick={exportCSV} className="lp-ghost" style={{ fontSize: '13px', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span> CSV
                    </button>
                    <button onClick={() => setShowAdd(true)} className="lp-btn lp-btn-sm">
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span> Add Lead
                    </button>
                </div>
            </header>

            <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px 28px' }}>

                {/* Stats bar */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    <button onClick={() => setFilter('')} style={{ padding: '8px 16px', borderRadius: '30px', border: '2px solid', borderColor: filterStatus === '' ? 'var(--admin-primary)' : 'transparent', background: filterStatus === '' ? 'var(--admin-primary-light)' : 'var(--admin-card)', color: filterStatus === '' ? 'var(--admin-primary)' : 'var(--admin-text-muted)', fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                        All <span style={{ marginLeft: '6px', fontWeight: 900 }}>{leads.length}</span>
                    </button>
                    {STATUSES.map(s => (
                        <button key={s.key} onClick={() => setFilter(filterStatus === s.key ? '' : s.key)} style={{ padding: '8px 16px', borderRadius: '30px', border: '2px solid', borderColor: filterStatus === s.key ? s.color : 'transparent', background: filterStatus === s.key ? s.light : 'var(--admin-card)', color: filterStatus === s.key ? s.color : 'var(--admin-text-muted)', fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                            {s.icon} {s.label} <span style={{ marginLeft: '6px', fontWeight: 900 }}>{leads.filter(l => norm(l.status) === s.key).length}</span>
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div style={{ position: 'relative', marginBottom: '24px', maxWidth: '400px' }}>
                    <span className="material-symbols-outlined" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: 'var(--admin-text-muted)' }}>search</span>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, phone..." className="lp-input" style={{ paddingLeft: '42px' }} />
                </div>

                {/* Loading */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '80px', color: 'var(--admin-text-muted)' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '48px', animation: 'spin 1s linear infinite', display: 'block', marginBottom: '12px' }}>autorenew</span>
                        Loading leads...
                    </div>
                ) : view === 'kanban' ? (
                    /* ──────────── KANBAN VIEW ──────────── */
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(240px, 1fr))', gap: '16px', overflowX: 'auto', paddingBottom: '16px' }}>
                        {STATUSES.map(s => (
                            <div key={s.key}>
                                {/* Column Header */}
                                <div style={{ padding: '10px 12px', borderRadius: '10px 10px 0 0', background: s.light, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px', border: `1px solid ${s.color}33` }}>
                                    <span style={{ fontSize: '16px' }}>{s.icon}</span>
                                    <span style={{ fontWeight: 800, fontSize: '13px', color: s.color }}>{s.label}</span>
                                    <span style={{ marginLeft: 'auto', background: s.color, color: 'white', borderRadius: '20px', padding: '2px 8px', fontSize: '11px', fontWeight: 800 }}>{grouped[s.key]?.length || 0}</span>
                                </div>
                                {/* Drop Zone */}
                                <div
                                    className={`lp-col${dragOver === s.key ? ' drag-over' : ''}`}
                                    onDragOver={e => { e.preventDefault(); setDragOver(s.key); }}
                                    onDragLeave={() => setDragOver(null)}
                                    onDrop={() => onDrop(s.key)}
                                    style={{ border: `1px solid ${s.color}33`, borderTop: 'none', borderRadius: '0 0 12px 12px', minHeight: '400px', display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px 8px' }}
                                >
                                    {(grouped[s.key] || []).map((lead: any) => {
                                        const fd = lead.field_data || [];
                                        const name = gf(fd, 'full_name', 'name') || 'Unknown';
                                        const email = gf(fd, 'email');
                                        const phone = gf(fd, 'phone_number', 'phone');
                                        const init = name.charAt(0).toUpperCase();
                                        return (
                                            <div
                                                key={lead.leadgen_id}
                                                className={`lp-lead-card${dragId === lead.leadgen_id ? ' dragging' : ''}`}
                                                draggable
                                                onDragStart={() => setDragId(lead.leadgen_id)}
                                                onDragEnd={() => { setDragId(null); setDragOver(null); }}
                                                onClick={() => { setSelected(lead); setNotes(p => ({ ...p, [lead.leadgen_id]: lead.notes ?? '' })); setPanelTab('details'); }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `linear-gradient(135deg,${s.color},${s.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '15px', flexShrink: 0 }}>{init}</div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ fontWeight: 700, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
                                                        {email && <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email}</div>}
                                                        {phone && <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '1px' }}>{phone}</div>}
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                                                    <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>{ago(lead.received_at)}</span>
                                                    <div style={{ display: 'flex', gap: '6px' }}>
                                                        {email && <a href={`mailto:${email}`} onClick={e => e.stopPropagation()} style={{ padding: '3px 6px', borderRadius: '6px', background: 'var(--admin-hover)', fontSize: '13px', textDecoration: 'none' }}>✉</a>}
                                                        {phone && <a href={`https://wa.me/${clean(phone)}`} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ padding: '3px 6px', borderRadius: '6px', background: 'rgba(37,211,102,0.12)', fontSize: '13px', textDecoration: 'none' }}>💬</a>}
                                                    </div>
                                                </div>
                                                {updating === lead.leadgen_id && <div style={{ marginTop: '8px', height: '2px', borderRadius: '2px', background: `linear-gradient(90deg,${s.color},transparent)`, animation: 'pulse 1s infinite' }} />}
                                            </div>
                                        );
                                    })}
                                    {(grouped[s.key] || []).length === 0 && (
                                        <div style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '32px 12px', fontSize: '13px', opacity: 0.5 }}>Drop leads here</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* ──────────── LIST VIEW ──────────── */
                    <div className="lp-card" style={{ overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--admin-border)', background: 'var(--admin-hover)' }}>
                                    {['Lead', 'Email', 'Phone', 'Status', 'Source', 'Received', 'Actions'].map(h => (
                                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--admin-text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((lead: any) => {
                                    const fd = lead.field_data || [];
                                    const name = gf(fd, 'full_name', 'name') || 'Unknown';
                                    const email = gf(fd, 'email');
                                    const phone = gf(fd, 'phone_number', 'phone');
                                    const sm = statusMeta(lead.status);
                                    return (
                                        <tr key={lead.leadgen_id} style={{ borderBottom: '1px solid var(--admin-border)', cursor: 'pointer', transition: 'background 0.15s' }}
                                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--admin-hover)')}
                                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                            onClick={() => { setSelected(lead); setNotes(p => ({ ...p, [lead.leadgen_id]: lead.notes ?? '' })); setPanelTab('details'); }}>
                                            <td style={{ padding: '12px 16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `linear-gradient(135deg,${sm.color},${sm.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '13px', flexShrink: 0 }}>{name.charAt(0)}</div>
                                                    <span style={{ fontWeight: 700 }}>{name}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px 16px', color: 'var(--admin-text-muted)', fontSize: '13px' }}>{email || '—'}</td>
                                            <td style={{ padding: '12px 16px', color: 'var(--admin-text-muted)', fontSize: '13px' }}>{phone || '—'}</td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <span style={{ padding: '4px 10px', borderRadius: '20px', background: sm.light, color: sm.color, fontWeight: 700, fontSize: '12px' }}>{sm.icon} {sm.label}</span>
                                            </td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(24,119,242,0.1)', color: '#1877F2', fontSize: '11px', fontWeight: 700 }}>Facebook</span>
                                            </td>
                                            <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--admin-text-muted)', whiteSpace: 'nowrap' }}>{ago(lead.received_at)}</td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                                                    {email && <a href={`mailto:${email}`} style={{ padding: '5px 10px', borderRadius: '7px', background: 'var(--admin-success-light)', color: 'var(--admin-success)', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}>Email</a>}
                                                    {phone && <a href={`https://wa.me/${clean(phone)}`} target="_blank" rel="noreferrer" style={{ padding: '5px 10px', borderRadius: '7px', background: 'rgba(37,211,102,0.12)', color: '#25D366', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}>WA</a>}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filtered.length === 0 && (
                                    <tr><td colSpan={7} style={{ padding: '60px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>No leads match your search.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ──────────── DETAIL PANEL ──────────── */}
            {selected && (() => {
                const fd = selected.field_data || [];
                const name = gf(fd, 'full_name', 'name') || 'Unknown';
                const email = gf(fd, 'email');
                const phone = gf(fd, 'phone_number', 'phone');
                const sm = statusMeta(selected.status);
                const siMap: Record<string, string> = { sent: '✓', delivered: '✓✓', read: '✓✓', failed: '✗', received: '' };
                return (
                    <>
                        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, backdropFilter: 'blur(4px)' }} />
                        <aside style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: '420px', maxWidth: '100vw', zIndex: 300, background: 'var(--admin-card)', borderLeft: '1px solid var(--admin-border)', display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.3s ease', overflowY: 'auto' }}>
                            <style>{`@keyframes slideInRight { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>

                            {/* Panel header */}
                            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', gap: '14px', background: `linear-gradient(135deg,${sm.color}18,transparent)` }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: `linear-gradient(135deg,${sm.color},${sm.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '20px', flexShrink: 0 }}>{name.charAt(0)}</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 800, fontSize: '16px' }}>{name}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '2px' }}>{email || phone || selected.leadgen_id}</div>
                                </div>
                                <button onClick={() => setSelected(null)} style={{ background: 'var(--admin-hover)', border: 'none', borderRadius: '10px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-text-muted)', fontSize: '18px', fontFamily: 'inherit' }}>✕</button>
                            </div>

                            {/* Status pipeline */}
                            <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--admin-border)', background: 'var(--admin-hover)' }}>
                                <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px' }}>Pipeline Stage</div>
                                <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
                                    {STATUSES.map(s => (
                                        <div key={s.key} className="pipeline-step" style={{ background: norm(selected.status) === s.key ? s.color : `${s.color}33` }} title={s.label} />
                                    ))}
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {STATUSES.map(s => (
                                        <button key={s.key} onClick={() => updateStatus(selected.leadgen_id, s.key)} disabled={updating === selected.leadgen_id} style={{ padding: '5px 12px', borderRadius: '20px', border: `1.5px solid`, borderColor: norm(selected.status) === s.key ? s.color : 'var(--admin-border)', background: norm(selected.status) === s.key ? s.light : 'transparent', color: norm(selected.status) === s.key ? s.color : 'var(--admin-text-muted)', fontWeight: 700, fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                                            {s.icon} {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tabs */}
                            <div style={{ display: 'flex', borderBottom: '1px solid var(--admin-border)', padding: '0 24px' }}>
                                {([['details', '📋', 'Details'], ['whatsapp', '💬', 'WhatsApp'], ['notes', '📝', 'Notes']] as const).map(([t, ic, lb]) => (
                                    <button key={t} onClick={() => setPanelTab(t)} style={{ padding: '12px 16px', border: 'none', borderBottom: `2.5px solid ${panelTab === t ? 'var(--admin-primary)' : 'transparent'}`, background: 'transparent', color: panelTab === t ? 'var(--admin-primary)' : 'var(--admin-text-muted)', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>{ic} {lb}</button>
                                ))}
                            </div>

                            {/* Panel body */}
                            <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
                                {panelTab === 'details' && (
                                    <div>
                                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Lead Fields</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                                            {fd.length > 0 ? fd.map((f: any, i: number) => (
                                                <div key={i} style={{ display: 'flex', gap: '12px', padding: '10px 14px', background: 'var(--admin-hover)', borderRadius: '10px' }}>
                                                    <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)', fontWeight: 700, minWidth: '110px', textTransform: 'capitalize' }}>{f.name.replace(/_/g, ' ')}</span>
                                                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{(f.values || []).join(', ')}</span>
                                                </div>
                                            )) : <div style={{ fontSize: '13px', color: 'var(--admin-text-muted)', padding: '10px 0' }}>No field data available.</div>}
                                        </div>
                                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Meta Info</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                                            {[['Form', selected.form_id], ['Ad', selected.ad_id], ['Page', selected.page_id]].map(([k, v]) => v ? (
                                                <span key={k} style={{ padding: '4px 10px', borderRadius: '20px', background: 'var(--admin-hover)', border: '1px solid var(--admin-border)', fontSize: '11px', color: 'var(--admin-text-muted)' }}>{k}: {v}</span>
                                            ) : null)}
                                        </div>
                                        {/* Quick actions */}
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                            {email && <a href={`mailto:${email}`} style={{ padding: '9px 16px', borderRadius: '10px', background: 'var(--admin-success-light)', color: 'var(--admin-success)', fontWeight: 700, fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>✉ Email</a>}
                                            {phone && <a href={`https://wa.me/${clean(phone)}`} target="_blank" rel="noreferrer" style={{ padding: '9px 16px', borderRadius: '10px', background: 'rgba(37,211,102,0.12)', color: '#25D366', fontWeight: 700, fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>💬 WhatsApp</a>}
                                            <button onClick={() => deleteLead(selected.leadgen_id)} style={{ padding: '9px 14px', borderRadius: '10px', background: 'var(--admin-danger-light)', color: 'var(--admin-danger)', border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer', marginLeft: 'auto', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '5px' }}>🗑 Delete</button>
                                        </div>
                                    </div>
                                )}

                                {panelTab === 'whatsapp' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                        {/* Messages */}
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', padding: '4px 0 16px', minHeight: '200px', maxHeight: '360px', overflowY: 'auto' }}>
                                            {waHistory.length === 0 ? (
                                                <div style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '32px 0', fontSize: '13px' }}>No messages yet</div>
                                            ) : waHistory.slice().reverse().map((m: any, i: number) => (
                                                <div key={i} style={{ display: 'flex', justifyContent: m.direction === 'outbound' ? 'flex-end' : 'flex-start' }}>
                                                    <div className={m.direction === 'outbound' ? 'wa-bubble-out' : 'wa-bubble-in'}>
                                                        <div>{m.content}</div>
                                                        <div style={{ fontSize: '10px', color: '#666', marginTop: '4px', textAlign: 'right' }}>
                                                            {m.sent_at ? new Date(m.sent_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
                                                            {m.direction === 'outbound' && <span style={{ marginLeft: '4px', color: m.status === 'read' ? '#53bdeb' : '#999' }}>{siMap[m.status] ?? ''}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Compose */}
                                        {phone ? (
                                            <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '14px', display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                                                <textarea value={waMsg} onChange={e => setWaMsg(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendWA(); } }} placeholder="Type a message..." className="lp-input" style={{ flex: 1, minHeight: '44px', maxHeight: '120px', resize: 'none', fontSize: '13px' }} />
                                                <button onClick={sendWA} disabled={waSending || !waMsg.trim()} style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#25D366', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: waSending ? 0.6 : 1 }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'white' }}>send</span>
                                                </button>
                                            </div>
                                        ) : <div style={{ color: 'var(--admin-text-muted)', fontSize: '13px', paddingTop: '12px', borderTop: '1px solid var(--admin-border)' }}>No phone number captured for this lead.</div>}
                                    </div>
                                )}

                                {panelTab === 'notes' && (
                                    <div>
                                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Internal Notes</div>
                                        <textarea value={notes[selected.leadgen_id] ?? selected.notes ?? ''} onChange={e => setNotes(p => ({ ...p, [selected.leadgen_id]: e.target.value }))} placeholder="Private notes about this lead (not visible to client)..." className="lp-input" style={{ minHeight: '180px', resize: 'vertical', marginBottom: '12px' }} />
                                        <button onClick={() => saveNotes(selected.leadgen_id)} className="lp-btn" style={{ width: '100%', justifyContent: 'center' }}>Save Notes</button>
                                    </div>
                                )}
                            </div>
                        </aside>
                    </>
                );
            })()}

            {/* ──────────── ADD LEAD MODAL ──────────── */}
            {showAdd && (
                <div onClick={() => setShowAdd(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: 'var(--admin-card)', border: '1px solid var(--admin-border)', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '480px' }}>
                        <h3 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: 800 }}>Add Lead Manually</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                            {([['Name *', 'name', 'text', 'Full name'], ['Email', 'email', 'email', 'Email address'], ['Phone', 'phone', 'tel', 'Phone (with country code)']] as const).map(([lb, key, type, ph]) => (
                                <div key={key}>
                                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>{lb}</label>
                                    <input type={type} value={(addForm as any)[key] ?? ''} onChange={e => setAddForm(p => ({ ...p, [key]: e.target.value }))} placeholder={ph} className="lp-input" />
                                </div>
                            ))}
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>Initial Status</label>
                                <select value={addForm.status} onChange={e => setAddForm(p => ({ ...p, status: e.target.value }))} className="lp-input">
                                    {STATUSES.map(s => <option key={s.key} value={s.key}>{s.icon} {s.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>Notes</label>
                                <textarea value={addForm.notes} onChange={e => setAddForm(p => ({ ...p, notes: e.target.value }))} placeholder="Optional notes..." className="lp-input" style={{ minHeight: '80px' }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setShowAdd(false)} className="lp-ghost" style={{ padding: '10px 20px' }}>Cancel</button>
                            <button onClick={addLead} disabled={addSaving || !addForm.name} className="lp-btn" style={{ padding: '10px 24px' }}>{addSaving ? 'Saving...' : 'Add Lead'}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
