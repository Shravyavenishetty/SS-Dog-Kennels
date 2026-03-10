import React, { useEffect, useState, useContext } from 'react';
import { bookingsApi } from '../api';
import { ToastCtx } from '../App';
import Modal from '../components/Modal';
import { Search, Eye, Trash2 } from 'lucide-react';

const PER_PAGE = 12;
const STATUS_OPTS = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
const STATUS_BADGE = { Pending: 'amber', Confirmed: 'green', Completed: 'blue', Cancelled: 'red' };

export default function BookingsPage() {
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
        bookingsApi.list().then(d => setItems(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
    };
    useEffect(load, []);

    const filtered = items.filter(i =>
        (!search || i.user_name?.toLowerCase().includes(search.toLowerCase()) || i.service_name?.toLowerCase().includes(search.toLowerCase()) || i.user_email?.toLowerCase().includes(search.toLowerCase())) &&
        (!status || i.status === status)
    );
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const updateStatus = async (id, newStatus) => {
        setSaving(true);
        try {
            await bookingsApi.update(id, { status: newStatus });
            toast('Status updated!');
            load();
            if (current?.id === id) setCurrent(p => ({ ...p, status: newStatus }));
        } catch (e) { toast(e.message, 'error'); }
        finally { setSaving(false); }
    };

    const del = async (id) => {
        if (!confirm('Delete this booking?')) return;
        try { await bookingsApi.delete(id); toast('Booking deleted.'); load(); if (current?.id === id) setCurrent(null); }
        catch (e) { toast(e.message, 'error'); }
    };

    return (
        <div>
            <div className="page-header">
                <h1>Service Bookings</h1>
                <p>Manage customer service bookings and update their status.</p>
            </div>
            <div className="card">
                <div className="card-header">
                    <div className="table-controls">
                        <div className="search-box"><Search size={14} /><input placeholder="Search name, service, email…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></div>
                        <select className="filter-select" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
                            <option value="">All Status</option>
                            {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
                        </select>
                    </div>
                    <span style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>{filtered.length} bookings</span>
                </div>
                <div className="table-wrap">
                    <table>
                        <thead><tr><th>Customer</th><th>Phone</th><th>Service</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            {loading ? <tr className="empty-row"><td colSpan={7}>Loading…</td></tr>
                                : paged.length === 0 ? <tr className="empty-row"><td colSpan={7}>No bookings found</td></tr>
                                    : paged.map(b => (
                                        <tr key={b.id}>
                                            <td><strong>{b.user_name}</strong></td>
                                            <td>{b.user_phone || <span className="text-muted">—</span>}</td>
                                            <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.service_name}</td>
                                            <td>{b.booking_date}</td>
                                            <td>{b.booking_time}</td>
                                            <td>
                                                <select className="filter-select" value={b.status} onChange={e => updateStatus(b.id, e.target.value)} disabled={saving} style={{ padding: '3px 8px', fontSize: '0.78rem' }}>
                                                    {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
                                                </select>
                                            </td>
                                            <td>
                                                <div className="td-actions">
                                                    <button className="btn-icon" title="View" onClick={() => setCurrent(b)}><Eye size={13} /></button>
                                                    <button className="btn-icon delete" title="Delete" onClick={() => del(b.id)}><Trash2 size={13} /></button>
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
                <Modal title="Booking Details" onClose={() => setCurrent(null)}
                    footer={
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {['Confirmed', 'Completed', 'Cancelled'].map(s => s !== current.status && (
                                <button key={s} className={`btn btn-sm ${s === 'Cancelled' ? 'btn-danger' : 'btn-primary'}`} onClick={() => updateStatus(current.id, s)} disabled={saving}>{s}</button>
                            ))}
                            <button className="btn btn-ghost" onClick={() => setCurrent(null)}>Close</button>
                        </div>
                    }>
                    <div className="detail-grid">
                        <div className="detail-item"><label>Customer Name</label><div className="readonly-field">{current.user_name}</div></div>
                        <div className="detail-item"><label>Phone</label><div className="readonly-field">{current.user_phone || '—'}</div></div>
                        <div className="detail-item"><label>Email</label><div className="readonly-field">{current.user_email}</div></div>
                        <div className="detail-item"><label>Status</label><span className={`badge badge-${STATUS_BADGE[current.status] || 'gray'}`}>{current.status}</span></div>
                        <div className="detail-item"><label>Service</label><div className="readonly-field">{current.service_name}</div></div>
                        <div className="detail-item"><label>Date & Time</label><div className="readonly-field">{current.booking_date} at {current.booking_time}</div></div>
                    </div>
                    {current.details && <div style={{ marginTop: 14 }}><div className="section-title">Details / Notes</div><div className="readonly-field">{current.details}</div></div>}
                    <div style={{ marginTop: 14 }}><div className="section-title">Booked On</div><div className="readonly-field">{current.created_at?.slice(0, 19).replace('T', ' ')}</div></div>
                </Modal>
            )}
        </div>
    );
}
