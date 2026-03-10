import React, { useEffect, useState, useContext } from 'react';
import { studBookingsApi } from '../api';
import { ToastCtx } from '../App';
import Modal from '../components/Modal';
import { Search, Eye } from 'lucide-react';

const STATUS_OPTS = ['pending', 'confirmed', 'cancelled'];
const PER_PAGE = 12;

const STATUS_BADGE = { pending: 'amber', confirmed: 'green', cancelled: 'red' };

export default function StudBookingsPage() {
    const toast = useContext(ToastCtx);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [current, setCurrent] = useState(null);
    const [saving, setSaving] = useState(false);

    const load = () => {
        setLoading(true);
        studBookingsApi.list().then(d => setItems(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
    };
    useEffect(load, []);

    const filtered = items.filter(i =>
        (!search || i.customer_name?.toLowerCase().includes(search.toLowerCase()) || i.stud_breed?.toLowerCase().includes(search.toLowerCase())) &&
        (!status || i.status === status)
    );
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const updateStatus = async (id, newStatus, notes = '') => {
        setSaving(true);
        try {
            await studBookingsApi.update(id, { status: newStatus, admin_notes: notes });
            toast('Status updated!');
            load();
            if (current?.id === id) setCurrent(p => ({ ...p, status: newStatus }));
        } catch (e) { toast(e.message, 'error'); }
        finally { setSaving(false); }
    };

    return (
        <div>
            <div className="page-header">
                <h1>Stud Booking Requests</h1>
                <p>Review and manage stud service booking requests from customers.</p>
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="table-controls">
                        <div className="search-box"><Search size={14} /><input placeholder="Search name or breed…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></div>
                        <select className="filter-select" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
                            <option value="">All Status</option>
                            {STATUS_OPTS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                    </div>
                    <span style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>{filtered.length} requests</span>
                </div>
                <div className="table-wrap">
                    <table>
                        <thead><tr><th>Customer</th><th>Phone</th><th>Stud Breed</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            {loading ? <tr className="empty-row"><td colSpan={7}>Loading…</td></tr>
                                : paged.length === 0 ? <tr className="empty-row"><td colSpan={7}>No booking requests</td></tr>
                                    : paged.map(b => (
                                        <tr key={b.id}>
                                            <td><strong>{b.customer_name}</strong></td>
                                            <td>{b.customer_phone}</td>
                                            <td>{b.stud_breed || <span className="text-muted">Any</span>}</td>
                                            <td>{b.requested_date}</td>
                                            <td>{b.requested_time}</td>
                                            <td>
                                                <select
                                                    className="filter-select"
                                                    value={b.status}
                                                    style={{ padding: '3px 8px', fontSize: '0.78rem', borderRadius: 99 }}
                                                    onChange={e => updateStatus(b.id, e.target.value)}
                                                    disabled={saving}
                                                >
                                                    {STATUS_OPTS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                                </select>
                                            </td>
                                            <td>
                                                <button className="btn-icon" title="View Details" onClick={() => setCurrent(b)}><Eye size={13} /></button>
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
                <Modal title="Booking Details" onClose={() => setCurrent(null)}
                    footer={
                        <div style={{ display: 'flex', gap: 8 }}>
                            {current.status === 'pending' && <>
                                <button className="btn btn-primary" onClick={() => updateStatus(current.id, 'confirmed')} disabled={saving}>Confirm</button>
                                <button className="btn btn-danger" onClick={() => updateStatus(current.id, 'cancelled')} disabled={saving}>Cancel</button>
                            </>}
                            <button className="btn btn-ghost" onClick={() => setCurrent(null)}>Close</button>
                        </div>
                    }>
                    <div className="detail-grid">
                        <div className="detail-item"><label>Customer</label><div className="readonly-field">{current.customer_name}</div></div>
                        <div className="detail-item"><label>Phone</label><div className="readonly-field">{current.customer_phone}</div></div>
                        <div className="detail-item"><label>Stud Breed</label><div className="readonly-field">{current.stud_breed || 'Any'}</div></div>
                        <div className="detail-item"><label>Status</label><span className={`badge badge-${STATUS_BADGE[current.status] || 'gray'}`}>{current.status}</span></div>
                        <div className="detail-item"><label>Requested Date</label><div className="readonly-field">{current.requested_date}</div></div>
                        <div className="detail-item"><label>Time</label><div className="readonly-field">{current.requested_time}</div></div>
                    </div>
                    {current.female_breed_details && (
                        <div style={{ marginTop: 14 }}>
                            <div className="section-title">Female Breed Details</div>
                            <div className="readonly-field">{current.female_breed_details}</div>
                        </div>
                    )}
                    <div style={{ marginTop: 14 }}>
                        <div className="section-title">Submitted</div>
                        <div className="readonly-field">{current.created_at?.slice(0, 19).replace('T', ' ')}</div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
