import React, { useEffect, useState, useContext } from 'react';
import { contactInquiriesApi } from '../api';
import { ToastCtx } from '../App';
import Modal from '../components/Modal';
import { Search, Eye, Trash2 } from 'lucide-react';

const PER_PAGE = 12;
const SUBJECTS = ['Buying a Puppy', 'Booking a Dog', 'Grooming / Training', 'General Inquiry'];
const SUBJ_COLOR = { 'Buying a Puppy': 'green', 'Booking a Dog': 'blue', 'Grooming / Training': 'amber', 'General Inquiry': 'gray' };

export default function ContactPage() {
    const toast = useContext(ToastCtx);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [subject, setSubject] = useState('');
    const [page, setPage] = useState(1);
    const [current, setCurrent] = useState(null);

    const load = () => {
        setLoading(true);
        contactInquiriesApi.list().then(d => setItems(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
    };
    useEffect(load, []);

    const filtered = items.filter(i =>
        (!search || i.name?.toLowerCase().includes(search.toLowerCase()) || i.email?.toLowerCase().includes(search.toLowerCase())) &&
        (!subject || i.subject === subject)
    );
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const del = async (id) => {
        if (!confirm('Delete this inquiry?')) return;
        try { await contactInquiriesApi.delete(id); toast('Deleted.'); load(); if (current?.id === id) setCurrent(null); }
        catch (e) { toast(e.message, 'error'); }
    };

    return (
        <div>
            <div className="page-header">
                <h1>Contact Inquiries</h1>
                <p>Customer inquiries submitted through the Contact page.</p>
            </div>
            <div className="card">
                <div className="card-header">
                    <div className="table-controls">
                        <div className="search-box"><Search size={14} /><input placeholder="Search name or email…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></div>
                        <select className="filter-select" value={subject} onChange={e => { setSubject(e.target.value); setPage(1); }}>
                            <option value="">All Subjects</option>
                            {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                        </select>
                    </div>
                    <span style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>{filtered.length} inquiries</span>
                </div>
                <div className="table-wrap">
                    <table>
                        <thead><tr><th>Name</th><th>Email</th><th>Subject</th><th>Date</th><th>Actions</th></tr></thead>
                        <tbody>
                            {loading ? <tr className="empty-row"><td colSpan={5}>Loading…</td></tr>
                                : paged.length === 0 ? <tr className="empty-row"><td colSpan={5}>No inquiries found</td></tr>
                                    : paged.map(c => (
                                        <tr key={c.id}>
                                            <td><strong>{c.name}</strong></td>
                                            <td>{c.email}</td>
                                            <td><span className={`badge badge-${SUBJ_COLOR[c.subject] || 'gray'}`}>{c.subject}</span></td>
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
                <Modal title="Inquiry Details" onClose={() => setCurrent(null)}
                    footer={<button className="btn btn-ghost" onClick={() => setCurrent(null)}>Close</button>}>
                    <div className="detail-grid">
                        <div className="detail-item"><label>Name</label><div className="readonly-field">{current.name}</div></div>
                        <div className="detail-item"><label>Email</label><div className="readonly-field">{current.email}</div></div>
                        <div className="detail-item"><label>Subject</label><span className={`badge badge-${SUBJ_COLOR[current.subject] || 'gray'}`}>{current.subject}</span></div>
                        <div className="detail-item"><label>Received</label><div className="readonly-field">{current.created_at?.slice(0, 19).replace('T', ' ')}</div></div>
                    </div>
                    <div style={{ marginTop: 14 }}>
                        <div className="section-title">Message</div>
                        <div className="readonly-field" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{current.message}</div>
                    </div>
                    <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                        <a href={`mailto:${current.email}?subject=Re: ${encodeURIComponent(current.subject)}`} className="btn btn-primary" style={{ textDecoration: 'none' }}>📧 Reply via Email</a>
                    </div>
                </Modal>
            )}
        </div>
    );
}
