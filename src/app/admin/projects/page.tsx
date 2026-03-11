'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../admin.css';

// ─── Stage Config ─────────────────────────────────────────────────────────────
const STAGES = [
    { key: 'discovery', label: 'Discovery', color: '#6366F1', light: 'rgba(99,102,241,0.12)', icon: '🔍', desc: 'Gathering requirements' },
    { key: 'designing', label: 'Designing', color: '#A855F7', light: 'rgba(168,85,247,0.12)', icon: '🎨', desc: 'UI/UX design phase' },
    { key: 'development', label: 'Development', color: '#3B82F6', light: 'rgba(59,130,246,0.12)', icon: '⚙️', desc: 'Building the product' },
    { key: 'review', label: 'Review', color: '#F59E0B', light: 'rgba(245,158,11,0.12)', icon: '👁️', desc: 'Client review' },
    { key: 'changes', label: 'Changes', color: '#EF4444', light: 'rgba(239,68,68,0.12)', icon: '✏️', desc: 'Revision requests' },
    { key: 'deployed', label: 'Deployed', color: '#10B981', light: 'rgba(16,185,129,0.12)', icon: '🚀', desc: 'Live & running' },
    { key: 'payment_pending', label: 'Payment Due', color: '#F97316', light: 'rgba(249,115,22,0.12)', icon: '💳', desc: 'Awaiting payment' },
    { key: 'completed', label: 'Completed', color: '#059669', light: 'rgba(5,150,105,0.12)', icon: '✅', desc: 'Fully delivered' },
    { key: 'on_hold', label: 'On Hold', color: '#94A3B8', light: 'rgba(148,163,184,0.12)', icon: '⏸️', desc: 'Paused' },
];

const PRIORITIES = [
    { key: 'low', label: 'Low', color: '#10B981' },
    { key: 'medium', label: 'Medium', color: '#F59E0B' },
    { key: 'high', label: 'High', color: '#EF4444' },
    { key: 'urgent', label: 'Urgent', color: '#DC2626' },
];

const ss = (key: string) => STAGES.find(s => s.key === key) ?? STAGES[0];
const sp = (key: string) => PRIORITIES.find(p => p.key === key) ?? PRIORITIES[1];

function fmt(n: number | null) { return n ? `₹${Number(n).toLocaleString('en-IN')}` : '₹0'; }
function daysLeft(d: string | null) {
    if (!d) return null;
    const days = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
    return days;
}
function fdate(d: string | null) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

const BLANK = { name: '', client_name: '', client_email: '', client_phone: '', description: '', status: 'discovery', priority: 'medium', start_date: '', due_date: '', budget: '', amount_paid: '', tags: '', notes: '', lead_id: '' };

export default function ProjectsPage() {
    const router = useRouter();
    const [authed, setAuthed] = useState(false);
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'kanban' | 'list'>('kanban');
    const [search, setSearch] = useState('');
    const [filterStage, setFilter] = useState('');
    const [selected, setSelected] = useState<any>(null);
    const [editing, setEditing] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ ...BLANK });
    const [saving, setSaving] = useState(false);
    const [dragId, setDragId] = useState<number | null>(null);
    const [dragOver, setDragOver] = useState<string | null>(null);
    const [toast, setToast] = useState('');
    const [updating, setUpdating] = useState<number | null>(null);

    const notify = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000); };
    const fv = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

    useEffect(() => {
        fetch('/api/admin/login').then(r => {
            if (r.ok) setAuthed(true); else router.replace('/admin');
        }).catch(() => router.replace('/admin'));
    }, [router]);

    const load = useCallback(async () => {
        setLoading(true);
        const r = await fetch('/api/admin/projects');
        if (r.ok) { const d = await r.json(); setProjects(d.projects || []); }
        setLoading(false);
    }, []);

    useEffect(() => { if (authed) load(); }, [authed, load]);

    // ── Status update ─────────────────────────────────────────────────────────
    const updateStatus = async (id: number, status: string) => {
        setUpdating(id);
        const r = await fetch('/api/admin/projects', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
        if (r.ok) {
            setProjects(p => p.map(x => x.id === id ? { ...x, status } : x));
            if (selected?.id === id) setSelected((p: any) => ({ ...p, status }));
            notify('Stage updated ✅');
        }
        setUpdating(null);
    };

    // ── Save (add or edit) ────────────────────────────────────────────────────
    const save = async () => {
        if (!form.name.trim()) return;
        setSaving(true);
        const payload = { ...form, budget: Number(form.budget) || 0, amount_paid: Number(form.amount_paid) || 0, tags: form.tags ? form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [], start_date: form.start_date || null, due_date: form.due_date || null };
        const isEdit = editing && selected;
        const r = await fetch('/api/admin/projects', {
            method: isEdit ? 'PATCH' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(isEdit ? { id: selected.id, ...payload } : payload),
        });
        if (r.ok) {
            const d = await r.json();
            if (isEdit) {
                setProjects(p => p.map(x => x.id === selected.id ? d.project : x));
                setSelected(d.project);
            } else {
                setProjects(p => [d.project, ...p]);
            }
            setShowAdd(false); setEditing(false); setForm({ ...BLANK }); notify(isEdit ? 'Project updated ✅' : 'Project created ✅');
        }
        setSaving(false);
    };

    const deleteProject = async (id: number) => {
        if (!confirm('Delete this project permanently?')) return;
        await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' });
        setProjects(p => p.filter(x => x.id !== id));
        setSelected(null); notify('Project deleted');
    };

    // ── DnD ───────────────────────────────────────────────────────────────────
    const onDrop = (status: string) => { if (dragId) updateStatus(dragId, status); setDragId(null); setDragOver(null); };

    // ── Derived ───────────────────────────────────────────────────────────────
    const filtered = projects.filter(p => {
        if (filterStage && p.status !== filterStage) return false;
        const q = search.toLowerCase();
        return !q || p.name?.toLowerCase().includes(q) || p.client_name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
    });
    const grouped = Object.fromEntries(STAGES.map(s => [s.key, filtered.filter(p => p.status === s.key)]));
    const totalBudget = projects.reduce((s, p) => s + (Number(p.budget) || 0), 0);
    const totalPaid = projects.reduce((s, p) => s + (Number(p.amount_paid) || 0), 0);
    const totalPending = totalBudget - totalPaid;

    const openEdit = (pr: any) => { setForm({ ...BLANK, ...pr, budget: pr.budget ?? '', amount_paid: pr.amount_paid ?? '', tags: (pr.tags || []).join(', '), start_date: pr.start_date ?? '', due_date: pr.due_date ?? '' }); setEditing(true); setShowAdd(true); };

    if (!authed) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', color: '#888', fontSize: '14px' }}>Authenticating…</div>;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
                *{box-sizing:border-box}body{margin:0;background:var(--admin-bg);color:var(--admin-text);font-family:'Outfit',sans-serif}
                .pc{background:var(--admin-card);border:1px solid var(--admin-border);border-radius:14px;backdrop-filter:blur(16px)}
                .pcard{background:var(--admin-card);border:1px solid var(--admin-border);border-radius:12px;padding:14px;cursor:pointer;transition:all .2s;user-select:none}
                .pcard:hover{border-color:var(--admin-primary);box-shadow:0 6px 24px rgba(0,0,0,.12);transform:translateY(-2px)}
                .pcard.dragging{opacity:.35;transform:rotate(2deg) scale(.97)}
                .pcol{min-height:320px;border-radius:0 0 12px 12px;transition:background .2s;padding:8px}
                .pcol.dov{background:rgba(79,70,229,.06);outline:2px dashed var(--admin-primary)}
                .pi{background:var(--admin-card);border:1px solid var(--admin-border);color:var(--admin-text);border-radius:10px;padding:10px 14px;font-family:inherit;font-size:14px;width:100%;outline:none;transition:border .2s}
                .pi:focus{border-color:var(--admin-primary)}
                .pb{background:var(--admin-primary-grad);color:#fff;border:none;border-radius:10px;padding:10px 20px;font-weight:700;font-family:inherit;cursor:pointer;font-size:14px;display:inline-flex;align-items:center;gap:6px;transition:opacity .2s}
                .pb:hover{opacity:.9}.pb:disabled{opacity:.5;cursor:not-allowed}
                .pg{background:transparent;border:1px solid var(--admin-border);color:var(--admin-text);border-radius:10px;padding:8px 16px;font-weight:700;font-family:inherit;cursor:pointer;font-size:13px;transition:all .2s}
                .pg:hover{background:var(--admin-hover)}
                @keyframes tin{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
                .toast{animation:tin .3s ease;position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:#0F172A;color:#fff;padding:12px 24px;border-radius:30px;font-size:14px;font-weight:600;z-index:2000;box-shadow:0 8px 32px rgba(0,0,0,.3)}
                @keyframes sdr{from{transform:translateX(40px);opacity:0}to{transform:translateX(0);opacity:1}}
                .pay-bar{height:6px;border-radius:3px;background:var(--admin-hover);overflow:hidden;margin-top:6px}
                .pay-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,#25D366,#059669);transition:width .4s}
                label.lbl{font-size:12px;font-weight:700;color:var(--admin-text-muted);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:6px}
            `}</style>

            {toast && <div className="toast">{toast}</div>}

            {/* ── Header ── */}
            <header style={{ background: 'var(--admin-sidebar)', borderBottom: '1px solid var(--admin-border)', padding: '0 28px', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)' }}>
                <div style={{ maxWidth: '1700px', margin: '0 auto', height: '60px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--admin-text-muted)', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span> Admin
                    </Link>
                    <span style={{ color: 'var(--admin-border)' }}>/</span>
                    <h1 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Project Status Board</h1>
                    <div style={{ flex: 1 }} />
                    <div style={{ display: 'flex', gap: '4px', background: 'var(--admin-hover)', borderRadius: '10px', padding: '4px' }}>
                        {(['kanban', 'list'] as const).map(v => (
                            <button key={v} onClick={() => setView(v)} style={{ padding: '5px 14px', borderRadius: '8px', border: 'none', fontFamily: 'inherit', fontWeight: 700, fontSize: '12px', cursor: 'pointer', textTransform: 'capitalize', background: view === v ? 'var(--admin-card)' : 'transparent', color: view === v ? 'var(--admin-primary)' : 'var(--admin-text-muted)', transition: 'all .2s', boxShadow: view === v ? '0 2px 8px rgba(0,0,0,.08)' : 'none' }}>{v}</button>
                        ))}
                    </div>
                    <button onClick={() => { setEditing(false); setForm({ ...BLANK }); setShowAdd(true); }} className="pb" style={{ padding: '8px 18px', fontSize: '13px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span> New Project
                    </button>
                </div>
            </header>

            <div style={{ maxWidth: '1700px', margin: '0 auto', padding: '24px 28px' }}>

                {/* ── Finance summary ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '12px', marginBottom: '20px' }}>
                    {[
                        { lbl: 'Total Projects', val: projects.length, color: 'var(--admin-primary)', icon: 'folder' },
                        { lbl: 'Total Budget', val: fmt(totalBudget), color: '#6366F1', icon: 'account_balance_wallet' },
                        { lbl: 'Amount Received', val: fmt(totalPaid), color: '#10B981', icon: 'payments' },
                        { lbl: 'Pending Payment', val: fmt(totalPending), color: '#F97316', icon: 'pending_actions' },
                        { lbl: 'Active Projects', val: projects.filter(p => !['completed', 'on_hold'].includes(p.status)).length, color: '#3B82F6', icon: 'play_circle' },
                    ].map(c => (
                        <div key={c.lbl} className="pc" style={{ padding: '16px 20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: c.color }}>{c.icon}</span>
                                <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{c.lbl}</span>
                            </div>
                            <div style={{ fontSize: '22px', fontWeight: 900, color: c.color }}>{c.val}</div>
                        </div>
                    ))}
                </div>

                {/* ── Stage filter pills ── */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    <button onClick={() => setFilter('')} style={{ padding: '6px 14px', borderRadius: '30px', border: '2px solid', borderColor: filterStage === '' ? 'var(--admin-primary)' : 'transparent', background: filterStage === '' ? 'var(--admin-primary-light)' : 'var(--admin-card)', color: filterStage === '' ? 'var(--admin-primary)' : 'var(--admin-text-muted)', fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                        All {projects.length}
                    </button>
                    {STAGES.map(s => (
                        <button key={s.key} onClick={() => setFilter(filterStage === s.key ? '' : s.key)} style={{ padding: '6px 14px', borderRadius: '30px', border: '2px solid', borderColor: filterStage === s.key ? s.color : 'transparent', background: filterStage === s.key ? s.light : 'var(--admin-card)', color: filterStage === s.key ? s.color : 'var(--admin-text-muted)', fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s' }}>
                            {s.icon} {s.label} <span style={{ fontWeight: 900 }}>{projects.filter(p => p.status === s.key).length}</span>
                        </button>
                    ))}
                </div>

                {/* ── Search ── */}
                <div style={{ position: 'relative', marginBottom: '24px', maxWidth: '380px' }}>
                    <span className="material-symbols-outlined" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: 'var(--admin-text-muted)' }}>search</span>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects or clients…" className="pi" style={{ paddingLeft: '42px' }} />
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '80px', color: 'var(--admin-text-muted)' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '48px', animation: 'spin 1s linear infinite', display: 'block', marginBottom: '12px' }}>autorenew</span>Loading projects…
                    </div>

                ) : view === 'kanban' ? (
                    /* ── KANBAN ── */
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, minmax(210px, 1fr))', gap: '12px', overflowX: 'auto', paddingBottom: '16px' }}>
                        {STAGES.map(s => (
                            <div key={s.key}>
                                <div style={{ padding: '10px 12px', borderRadius: '10px 10px 0 0', background: s.light, border: `1px solid ${s.color}33`, borderBottom: 'none', display: 'flex', alignItems: 'center', gap: '7px' }}>
                                    <span style={{ fontSize: '15px' }}>{s.icon}</span>
                                    <span style={{ fontWeight: 800, fontSize: '12px', color: s.color, flex: 1 }}>{s.label}</span>
                                    <span style={{ background: s.color, color: '#fff', borderRadius: '20px', padding: '2px 7px', fontSize: '11px', fontWeight: 800 }}>{(grouped[s.key] || []).length}</span>
                                </div>
                                <div
                                    className={`pcol${dragOver === s.key ? ' dov' : ''}`}
                                    style={{ border: `1px solid ${s.color}33`, borderTop: 'none', borderRadius: '0 0 12px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}
                                    onDragOver={e => { e.preventDefault(); setDragOver(s.key); }}
                                    onDragLeave={() => setDragOver(null)}
                                    onDrop={() => onDrop(s.key)}
                                >
                                    {(grouped[s.key] || []).map((pr: any) => {
                                        const prio = sp(pr.priority);
                                        const dl = daysLeft(pr.due_date);
                                        const paid = pr.budget > 0 ? Math.min(100, Math.round((pr.amount_paid / pr.budget) * 100)) : 0;
                                        return (
                                            <div
                                                key={pr.id}
                                                className={`pcard${dragId === pr.id ? ' dragging' : ''}`}
                                                draggable
                                                onDragStart={() => setDragId(pr.id)}
                                                onDragEnd={() => { setDragId(null); setDragOver(null); }}
                                                onClick={() => setSelected(pr)}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                                    <div style={{ fontWeight: 800, fontSize: '13px', lineHeight: 1.3, flex: 1, marginRight: '8px' }}>{pr.name}</div>
                                                    <span style={{ padding: '2px 7px', borderRadius: '20px', background: `${prio.color}22`, color: prio.color, fontWeight: 800, fontSize: '10px', flexShrink: 0 }}>{pr.priority}</span>
                                                </div>
                                                {pr.client_name && <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginBottom: '8px' }}>👤 {pr.client_name}</div>}
                                                {pr.budget > 0 && (
                                                    <div style={{ marginBottom: '6px' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--admin-text-muted)' }}>
                                                            <span>{fmt(pr.amount_paid)} paid</span><span>{paid}%</span>
                                                        </div>
                                                        <div className="pay-bar"><div className="pay-fill" style={{ width: `${paid}%` }} /></div>
                                                    </div>
                                                )}
                                                {dl !== null && (
                                                    <div style={{ fontSize: '11px', color: dl < 0 ? '#EF4444' : dl <= 3 ? '#F59E0B' : 'var(--admin-text-muted)', fontWeight: 600 }}>
                                                        {dl < 0 ? `⚠ Overdue ${Math.abs(dl)}d` : dl === 0 ? '⚠ Due today' : `📅 ${dl}d left`}
                                                    </div>
                                                )}
                                                {updating === pr.id && <div style={{ height: '2px', borderRadius: '2px', background: `linear-gradient(90deg,${s.color},transparent)`, marginTop: '8px', animation: 'pulse 1s infinite' }} />}
                                            </div>
                                        );
                                    })}
                                    {(grouped[s.key] || []).length === 0 && (
                                        <div style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '28px 8px', fontSize: '12px', opacity: .5 }}>Drop here</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                ) : (
                    /* ── LIST VIEW ── */
                    <div className="pc" style={{ overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--admin-border)', background: 'var(--admin-hover)' }}>
                                    {['Project', 'Client', 'Stage', 'Priority', 'Due Date', 'Budget', 'Paid', 'Actions'].map(h => (
                                        <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.8px', color: 'var(--admin-text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((pr: any) => {
                                    const st = ss(pr.status);
                                    const prio = sp(pr.priority);
                                    const dl = daysLeft(pr.due_date);
                                    const paid = pr.budget > 0 ? Math.min(100, Math.round((pr.amount_paid / pr.budget) * 100)) : 0;
                                    return (
                                        <tr key={pr.id} style={{ borderBottom: '1px solid var(--admin-border)', cursor: 'pointer', transition: 'background .15s' }}
                                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--admin-hover)')}
                                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                            onClick={() => setSelected(pr)}>
                                            <td style={{ padding: '12px 16px', fontWeight: 700 }}>{pr.name}</td>
                                            <td style={{ padding: '12px 16px', color: 'var(--admin-text-muted)', fontSize: '13px' }}>{pr.client_name || '—'}</td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <span style={{ padding: '4px 10px', borderRadius: '20px', background: st.light, color: st.color, fontWeight: 700, fontSize: '12px' }}>{st.icon} {st.label}</span>
                                            </td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <span style={{ padding: '4px 10px', borderRadius: '20px', background: `${prio.color}18`, color: prio.color, fontWeight: 700, fontSize: '12px', textTransform: 'capitalize' }}>{pr.priority}</span>
                                            </td>
                                            <td style={{ padding: '12px 16px', fontSize: '12px', color: dl !== null && dl < 0 ? '#EF4444' : dl !== null && dl <= 3 ? '#F59E0B' : 'var(--admin-text-muted)' }}>
                                                {fdate(pr.due_date)} {dl !== null && dl < 0 ? '⚠' : ''}
                                            </td>
                                            <td style={{ padding: '12px 16px', fontSize: '13px' }}>{fmt(pr.budget)}</td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{ width: '60px', height: '5px', borderRadius: '3px', background: 'var(--admin-hover)', overflow: 'hidden' }}>
                                                        <div style={{ width: `${paid}%`, height: '100%', background: '#25D366', borderRadius: '3px' }} />
                                                    </div>
                                                    <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>{paid}%</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                                                    <button onClick={() => openEdit(pr)} style={{ padding: '5px 10px', borderRadius: '7px', background: 'var(--admin-hover)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-muted)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Edit</button>
                                                    <button onClick={() => deleteProject(pr.id)} style={{ padding: '5px 10px', borderRadius: '7px', background: 'var(--admin-danger-light)', color: 'var(--admin-danger)', border: 'none', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filtered.length === 0 && <tr><td colSpan={8} style={{ padding: '60px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>No projects found.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── DETAIL PANEL ── */}
            {selected && (() => {
                const st = ss(selected.status);
                const prio = sp(selected.priority);
                const paid = selected.budget > 0 ? Math.min(100, Math.round((selected.amount_paid / selected.budget) * 100)) : 0;
                const remaining = (selected.budget || 0) - (selected.amount_paid || 0);
                const stageIdx = STAGES.findIndex(s => s.key === selected.status);
                return (
                    <>
                        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, backdropFilter: 'blur(4px)' }} />
                        <aside style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: '460px', maxWidth: '100vw', zIndex: 300, background: 'var(--admin-card)', borderLeft: '1px solid var(--admin-border)', display: 'flex', flexDirection: 'column', animation: 'sdr .3s ease', overflowY: 'auto' }}>

                            {/* Panel header */}
                            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--admin-border)', background: `linear-gradient(135deg,${st.color}18,transparent)` }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                            <span style={{ fontSize: '20px' }}>{st.icon}</span>
                                            <span style={{ padding: '3px 10px', borderRadius: '20px', background: st.light, color: st.color, fontWeight: 700, fontSize: '12px' }}>{st.label}</span>
                                            <span style={{ padding: '3px 10px', borderRadius: '20px', background: `${prio.color}18`, color: prio.color, fontWeight: 700, fontSize: '12px', textTransform: 'capitalize' }}>{selected.priority}</span>
                                        </div>
                                        <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 900 }}>{selected.name}</h2>
                                        {selected.client_name && <div style={{ fontSize: '13px', color: 'var(--admin-text-muted)' }}>👤 {selected.client_name}</div>}
                                    </div>
                                    <button onClick={() => setSelected(null)} style={{ background: 'var(--admin-hover)', border: 'none', borderRadius: '10px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-text-muted)', fontSize: '18px', fontFamily: 'inherit', flexShrink: 0 }}>✕</button>
                                </div>

                                {/* Stage progress bar */}
                                <div style={{ marginTop: '16px' }}>
                                    <div style={{ display: 'flex', gap: '3px', marginBottom: '8px' }}>
                                        {STAGES.filter(s => s.key !== 'on_hold').map((s, i) => (
                                            <div key={s.key} title={s.label} style={{ flex: 1, height: '5px', borderRadius: '3px', background: i <= stageIdx ? s.color : `${s.color}33`, transition: 'background .3s' }} />
                                        ))}
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                                        Stage {Math.min(stageIdx + 1, STAGES.length)} of {STAGES.length} — {st.desc}
                                    </div>
                                </div>
                            </div>

                            {/* Stage buttons */}
                            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--admin-border)', background: 'var(--admin-hover)' }}>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Move to Stage</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {STAGES.map(s => (
                                        <button key={s.key} onClick={() => updateStatus(selected.id, s.key)} disabled={updating === selected.id} style={{ padding: '5px 11px', borderRadius: '20px', border: '1.5px solid', borderColor: selected.status === s.key ? s.color : 'var(--admin-border)', background: selected.status === s.key ? s.light : 'transparent', color: selected.status === s.key ? s.color : 'var(--admin-text-muted)', fontWeight: 700, fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s' }}>
                                            {s.icon} {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Panel body */}
                            <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                                {/* Client info */}
                                {(selected.client_email || selected.client_phone) && (
                                    <div>
                                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Client Contact</div>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {selected.client_email && <a href={`mailto:${selected.client_email}`} style={{ padding: '8px 14px', borderRadius: '10px', background: 'var(--admin-success-light)', color: 'var(--admin-success)', fontWeight: 700, fontSize: '13px', textDecoration: 'none' }}>✉ {selected.client_email}</a>}
                                            {selected.client_phone && <a href={`https://wa.me/${selected.client_phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ padding: '8px 14px', borderRadius: '10px', background: 'rgba(37,211,102,0.12)', color: '#25D366', fontWeight: 700, fontSize: '13px', textDecoration: 'none' }}>💬 {selected.client_phone}</a>}
                                        </div>
                                    </div>
                                )}

                                {/* Description */}
                                {selected.description && (
                                    <div>
                                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Description</div>
                                        <div style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--admin-text)', background: 'var(--admin-hover)', padding: '12px 16px', borderRadius: '10px' }}>{selected.description}</div>
                                    </div>
                                )}

                                {/* Dates */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    {[['Start Date', selected.start_date], ['Due Date', selected.due_date]].map(([lbl, d]) => (
                                        <div key={lbl as string} style={{ padding: '12px 14px', background: 'var(--admin-hover)', borderRadius: '10px' }}>
                                            <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', fontWeight: 700, marginBottom: '4px' }}>{lbl as string}</div>
                                            <div style={{ fontSize: '14px', fontWeight: 700, color: lbl === 'Due Date' && daysLeft(d as string) !== null && daysLeft(d as string)! < 0 ? '#EF4444' : 'var(--admin-text)' }}>{fdate(d as string)}</div>
                                            {lbl === 'Due Date' && daysLeft(d as string) !== null && (
                                                <div style={{ fontSize: '11px', marginTop: '2px', color: daysLeft(d as string)! < 0 ? '#EF4444' : '#F59E0B' }}>
                                                    {daysLeft(d as string)! < 0 ? `${Math.abs(daysLeft(d as string)!)}d overdue` : `${daysLeft(d as string)}d remaining`}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Finance */}
                                <div>
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Financials</div>
                                    <div style={{ background: 'var(--admin-hover)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '13px', color: 'var(--admin-text-muted)' }}>Total Budget</span>
                                            <span style={{ fontWeight: 800, fontSize: '15px' }}>{fmt(selected.budget)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '13px', color: '#25D366' }}>✅ Amount Received</span>
                                            <span style={{ fontWeight: 800, fontSize: '15px', color: '#25D366' }}>{fmt(selected.amount_paid)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '13px', color: remaining > 0 ? '#F97316' : 'var(--admin-text-muted)' }}>{remaining > 0 ? '⏳ Pending' : '✅ Fully Paid'}</span>
                                            <span style={{ fontWeight: 800, fontSize: '15px', color: remaining > 0 ? '#F97316' : '#10B981' }}>{fmt(remaining)}</span>
                                        </div>
                                        <div className="pay-bar"><div className="pay-fill" style={{ width: `${paid}%` }} /></div>
                                        <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--admin-text-muted)', fontWeight: 700 }}>{paid}% payment received</div>
                                    </div>
                                </div>

                                {/* Tags */}
                                {(selected.tags || []).length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {selected.tags.map((t: string) => (
                                            <span key={t} style={{ padding: '4px 12px', borderRadius: '20px', background: 'var(--admin-hover)', border: '1px solid var(--admin-border)', fontSize: '12px', fontWeight: 600 }}>#{t}</span>
                                        ))}
                                    </div>
                                )}

                                {/* Notes */}
                                {selected.notes && (
                                    <div>
                                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Notes</div>
                                        <div style={{ fontSize: '14px', lineHeight: 1.6, background: 'var(--admin-hover)', padding: '12px 16px', borderRadius: '10px', borderLeft: '3px solid var(--admin-primary)' }}>{selected.notes}</div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '10px', paddingTop: '4px', borderTop: '1px solid var(--admin-border)' }}>
                                    <button onClick={() => openEdit(selected)} className="pb" style={{ flex: 1, justifyContent: 'center', fontSize: '13px', padding: '10px' }}>✏️ Edit Project</button>
                                    <button onClick={() => deleteProject(selected.id)} style={{ padding: '10px 16px', borderRadius: '10px', background: 'var(--admin-danger-light)', color: 'var(--admin-danger)', border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>🗑</button>
                                </div>
                            </div>
                        </aside>
                    </>
                );
            })()}

            {/* ── ADD / EDIT MODAL ── */}
            {showAdd && (
                <div onClick={() => { setShowAdd(false); setEditing(false); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: 'var(--admin-card)', border: '1px solid var(--admin-border)', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: 800 }}>{editing ? '✏️ Edit Project' : '➕ New Project'}</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label className="lbl">Project Name *</label>
                                <input value={form.name} onChange={e => fv('name', e.target.value)} placeholder="e.g. AKS Automations Website v2" className="pi" />
                            </div>
                            <div>
                                <label className="lbl">Client Name</label>
                                <input value={form.client_name} onChange={e => fv('client_name', e.target.value)} placeholder="Client full name" className="pi" />
                            </div>
                            <div>
                                <label className="lbl">Client Email</label>
                                <input type="email" value={form.client_email} onChange={e => fv('client_email', e.target.value)} placeholder="client@email.com" className="pi" />
                            </div>
                            <div>
                                <label className="lbl">Client Phone</label>
                                <input value={form.client_phone} onChange={e => fv('client_phone', e.target.value)} placeholder="+91 98765 43210" className="pi" />
                            </div>
                            <div>
                                <label className="lbl">Stage</label>
                                <select value={form.status} onChange={e => fv('status', e.target.value)} className="pi">
                                    {STAGES.map(s => <option key={s.key} value={s.key}>{s.icon} {s.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="lbl">Priority</label>
                                <select value={form.priority} onChange={e => fv('priority', e.target.value)} className="pi">
                                    {PRIORITIES.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="lbl">Start Date</label>
                                <input type="date" value={form.start_date} onChange={e => fv('start_date', e.target.value)} className="pi" />
                            </div>
                            <div>
                                <label className="lbl">Due Date</label>
                                <input type="date" value={form.due_date} onChange={e => fv('due_date', e.target.value)} className="pi" />
                            </div>
                            <div>
                                <label className="lbl">Budget (₹)</label>
                                <input type="number" value={form.budget} onChange={e => fv('budget', e.target.value)} placeholder="0" className="pi" />
                            </div>
                            <div>
                                <label className="lbl">Amount Paid (₹)</label>
                                <input type="number" value={form.amount_paid} onChange={e => fv('amount_paid', e.target.value)} placeholder="0" className="pi" />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label className="lbl">Description</label>
                                <textarea value={form.description} onChange={e => fv('description', e.target.value)} placeholder="Project scope and details…" className="pi" style={{ minHeight: '80px', resize: 'vertical' }} />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label className="lbl">Tags (comma separated)</label>
                                <input value={form.tags} onChange={e => fv('tags', e.target.value)} placeholder="website, automation, whatsapp-bot" className="pi" />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label className="lbl">Internal Notes</label>
                                <textarea value={form.notes} onChange={e => fv('notes', e.target.value)} placeholder="Private notes…" className="pi" style={{ minHeight: '70px', resize: 'vertical' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button onClick={() => { setShowAdd(false); setEditing(false); }} className="pg" style={{ padding: '10px 20px' }}>Cancel</button>
                            <button onClick={save} disabled={saving || !form.name.trim()} className="pb" style={{ padding: '10px 28px' }}>{saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Project'}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
