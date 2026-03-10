import React, { useEffect, useState, useContext } from 'react';
import { puppyInquiriesApi } from '../api';
import { ToastCtx } from '../App';
import Modal from '../components/Modal';
import { Search, Eye, Trash2 } from 'lucide-react';

const PER_PAGE = 12;

export default function PuppyInquiriesPage() {
    const toast = useContext(ToastCtx);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [current, setCurrent] = useState(null);

    const load = () => {
        setLoading(true);
        puppyInquiriesApi.list().then(d => setItems(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
    };
    useEffect(load, []);

    const filtered = items.filter(i =>
        !search ||
        i.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
        i.customer_phone?.includes(search) ||
        i.customer_email?.toLowerCase().includes(search.toLowerCase()) ||
        i.puppy_breed?.toLowerCase().includes(search.toLowerCase())
    );
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const del = async (id) => {
        if (!confirm('Delete this puppy inquiry?')) return;
        try { await puppyInquiriesApi.delete(id); toast('Deleted.'); load(); if (current?.id === id) setCurrent(null); }
        catch (e) { toast(e.message, 'error'); }
    };

    return (
        <div>
            <div className="page-header">
                <h1>Puppy Inquiries</h1>
                <p>Adoption interest forms submitted by customers for specific puppies.</p>
            </div>
            <div className="card">
                <div className="card-header">
                    <div className="search-box"><Search size={14} /><input placeholder="Search name, phone, email, breed…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></div>
                    <span style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>{filtered.length} inquiries</span>
                </div>
                <div className="table-wrap">
                    <table>
                        <thead><tr><th>Customer</th><th>Phone</th><th>Puppy / Breed</th><th>Date</th><th>Actions</th></tr></thead>
                        <tbody>
                            {loading ? <tr className="empty-row"><td colSpan={5}>Loading…</td></tr>
                                : paged.length === 0 ? <tr className="empty-row"><td colSpan={5}>No puppy inquiries found</td></tr>
                                    : paged.map(c => (
                                        <tr key={c.id}>
                                            <td><strong>{c.customer_name}</strong><br /><span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{c.customer_email}</span></td>
                                            <td>{c.customer_phone}</td>
                                            <td><span className="badge badge-forest">{c.puppy_breed || `Puppy #${c.puppy}`}</span></td>
                                            <td style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>{c.created_at?.slice(0, 10)}</td>
                                            <td>
                                                <div className="td-actions">
                                                    <button className="btn-icon" onClick={() => setCurrent(c)}><Eye size={13} /></button>
                                                    <button className="btn-icon delete" onClick={() => del(c.id)}><Trash2 size={13} /></button>
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
                <Modal title="Puppy Inquiry Details" onClose={() => setCurrent(null)}
                    footer={
                        <div style={{ display: 'flex', gap: 8 }}>
                            <a href={`mailto:${current.customer_email}?subject=Re: Your inquiry about ${current.puppy_breed || 'our puppy'}`} className="btn btn-primary" style={{ textDecoration: 'none' }}>📧 Reply</a>
                            <button className="btn btn-ghost" onClick={() => setCurrent(null)}>Close</button>
                        </div>
                    }>
                    <div className="detail-grid">
                        <div className="detail-item"><label>Customer Name</label><div className="readonly-field">{current.customer_name}</div></div>
                        <div className="detail-item"><label>Phone</label><div className="readonly-field">{current.customer_phone}</div></div>
                        <div className="detail-item"><label>Email</label><div className="readonly-field">{current.customer_email}</div></div>
                        <div className="detail-item"><label>Puppy</label><span className="badge badge-forest">{current.puppy_breed || `Puppy #${current.puppy}`}</span></div>
                    </div>
                    <div style={{ marginTop: 14 }}>
                        <div className="section-title">Address</div>
                        <div className="readonly-field">{current.customer_address}</div>
                    </div>
                    {current.additional_notes && (
                        <div style={{ marginTop: 14 }}>
                            <div className="section-title">Additional Notes</div>
                            <div className="readonly-field" style={{ whiteSpace: 'pre-wrap' }}>{current.additional_notes}</div>
                        </div>
                    )}
                    <div style={{ marginTop: 14 }}>
                        <div className="section-title">Submitted On</div>
                        <div className="readonly-field">{current.created_at?.slice(0, 19).replace('T', ' ')}</div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
