import React, { useEffect, useState, useContext } from 'react';
import { usersApi } from '../api';
import { ToastCtx } from '../App';
import Modal from '../components/Modal';
import { Search, Eye, Trash2 } from 'lucide-react';

const PER_PAGE = 15;

export default function UsersPage() {
    const toast = useContext(ToastCtx);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [current, setCurrent] = useState(null);

    const load = () => {
        setLoading(true);
        usersApi.list().then(d => setItems(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
    };
    useEffect(load, []);

    const filtered = items.filter(i =>
        !search ||
        `${i.first_name} ${i.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
        i.phone_number?.includes(search) ||
        i.email?.toLowerCase().includes(search.toLowerCase())
    );
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const del = async (phone) => {
        if (!confirm('Delete this user account? This cannot be undone.')) return;
        try { await usersApi.delete(phone); toast('User deleted.'); load(); if (current?.phone_number === phone) setCurrent(null); }
        catch (e) { toast(e.message, 'error'); }
    };

    const avatar = (u) => `${u.first_name?.[0] || ''}${u.last_name?.[0] || ''}`.toUpperCase() || '?';

    return (
        <div>
            <div className="page-header">
                <h1>Registered Users</h1>
                <p>View all registered customer accounts.</p>
            </div>
            <div className="card">
                <div className="card-header">
                    <div className="search-box"><Search size={14} /><input placeholder="Search name, phone, email…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></div>
                    <span style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>{filtered.length} users</span>
                </div>
                <div className="table-wrap">
                    <table>
                        <thead><tr><th>User</th><th>Phone</th><th>Email</th><th>Joined</th><th>Actions</th></tr></thead>
                        <tbody>
                            {loading ? <tr className="empty-row"><td colSpan={5}>Loading…</td></tr>
                                : paged.length === 0 ? <tr className="empty-row"><td colSpan={5}>No users found</td></tr>
                                    : paged.map(u => (
                                        <tr key={u.id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--forest-lite)', color: 'var(--forest)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>{avatar(u)}</div>
                                                    <div><div style={{ fontWeight: 600 }}>{u.first_name} {u.last_name}</div></div>
                                                </div>
                                            </td>
                                            <td>{u.phone_number}</td>
                                            <td>{u.email || <span className="text-muted">—</span>}</td>
                                            <td style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>{u.created_at?.slice(0, 10)}</td>
                                            <td>
                                                <div className="td-actions">
                                                    <button className="btn-icon" onClick={() => setCurrent(u)}><Eye size={13} /></button>
                                                    <button className="btn-icon delete" onClick={() => del(u.phone_number)}><Trash2 size={13} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                    <div className="pagination">
                        <span>{(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}</span>
                        <div className="pagination-pages">
                            <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                            {Array.from({ length: totalPages }, (_, i) => <button key={i} className={`page-btn${page === i + 1 ? ' active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>)}
                            <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
                        </div>
                    </div>
                )}
            </div>

            {current && (
                <Modal title="User Profile" onClose={() => setCurrent(null)}
                    footer={<button className="btn btn-ghost" onClick={() => setCurrent(null)}>Close</button>}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--forest)', color: 'var(--champagne)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem' }}>{avatar(current)}</div>
                        <div><h3 style={{ fontSize: '1.1rem' }}>{current.first_name} {current.last_name}</h3><p style={{ color: 'var(--gray-400)', fontSize: '0.82rem' }}>Joined {current.created_at?.slice(0, 10)}</p></div>
                    </div>
                    <div className="detail-grid">
                        <div className="detail-item"><label>Phone</label><div className="readonly-field">{current.phone_number}</div></div>
                        <div className="detail-item"><label>Email</label><div className="readonly-field">{current.email || '—'}</div></div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
