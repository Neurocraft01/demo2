'use client';

import { useState, useEffect } from 'react';

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

    useEffect(() => {
        checkAuth();

        // Auto color-scheme detection if no initial theme exists
        if (!localStorage.getItem('admin-theme')) {
            document.documentElement.setAttribute('data-admin-theme', 'light');
        } else {
            document.documentElement.setAttribute('data-admin-theme', localStorage.getItem('admin-theme')!);
        }
    }, []);

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
                    {activeTab === 'leads' && (
                        <div className="admin-grid-2">
                            <div className="admin-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ padding: '24px', borderBottom: '1px solid var(--admin-border)' }}>
                                    <h3 style={{ margin: 0, fontSize: '18px' }}>WhatsApp Intercom Hub</h3>
                                </div>
                                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '64px', marginBottom: '16px', color: 'var(--admin-border)' }}>forum</span>
                                    <p>Connect your WhatsApp Business API to see live chat logs here.</p>
                                    <button className="admin-btn" style={{ marginTop: '16px' }}>Connect WhatsApp API</button>
                                </div>
                            </div>
                            <div className="admin-card">
                                <h3 style={{ margin: '0 0 16px', fontSize: '18px' }}>Live Form Intakes</h3>
                                <div style={{ padding: '16px', border: '1px solid var(--admin-border)', borderRadius: '12px', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <strong>New Website Request</strong>
                                        <span style={{ fontSize: '12px', color: 'var(--admin-primary)' }}>12 mins ago</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--admin-text-muted)' }}>From: contact@agency.com. Check Nodemailer.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: CAMPAIGNS */}
                    {activeTab === 'campaigns' && (
                        <div className="admin-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                <h3 style={{ margin: 0, fontSize: '20px' }}>Offer & Campaign Manager</h3>
                                <button className="admin-btn">+ Create New Offer</button>
                            </div>
                            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--admin-bg)', borderRadius: '12px', border: '1px dashed var(--admin-border)' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--admin-primary)' }}>local_offer</span>
                                <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '16px' }}>No Active Campaigns</div>
                                <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px', marginTop: '8px', maxWidth: '400px', margin: '8px auto 0' }}>Deploy pop-up banners and discount campaigns directly to the website without code.</p>
                            </div>
                        </div>
                    )}

                </div>
            </main >
        </>
    );
}
