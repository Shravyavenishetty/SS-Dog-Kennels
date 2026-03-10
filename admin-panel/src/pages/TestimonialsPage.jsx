import React, { useEffect, useState, useContext } from 'react';
import { testimonialsApi } from '../api';
import { ToastCtx } from '../App';
import Modal from '../components/Modal';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

const EMPTY = { name: '', text: '', location: '', rating: '5.0', display_order: '0', is_active: true };

export default function TestimonialsPage() {
    const toast = useContext(ToastCtx);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState(null);
    const [current, setCurrent] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);

    const load = () => {
        setLoading(true);
        testimonialsApi.list().then(d => setItems(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
    };
    useEffect(load, []);

    const filtered = items.filter(i => !search || i.name?.toLowerCase().includes(search.toLowerCase()) || i.location?.toLowerCase().includes(search.toLowerCase()));

    const openAdd = () => { setForm(EMPTY); setModal('add'); };
    const openEdit = (t) => { setCurrent(t); setForm({ ...EMPTY, ...t, rating: String(t.rating), display_order: String(t.display_order) }); setModal('edit'); };
    const openDel = (t) => { setCurrent(t); setModal('delete'); };

    const save = async () => {
        setSaving(true);
        try {
            const payload = { ...form, rating: Number(form.rating), display_order: Number(form.display_order) };
            if (modal === 'add') await testimonialsApi.create(payload);
            else await testimonialsApi.update(current.id, payload);
            toast(modal === 'add' ? 'Testimonial added!' : 'Updated!');
            setModal(null); load();
        } catch (e) { toast(e.message, 'error'); }
        finally { setSaving(false); }
    };

    const del = async () => {
        setSaving(true);
        try { await testimonialsApi.delete(current.id); toast('Deleted.'); setModal(null); load(); }
        catch (e) { toast(e.message, 'error'); }
        finally { setSaving(false); }
    };

    const toggleActive = async (t) => {
        try { await testimonialsApi.update(t.id, { is_active: !t.is_active }); toast('Updated!'); load(); }
        catch (e) { toast(e.message, 'error'); }
    };

    const f = (k) => e => setForm(p => ({ ...p, [k]: e.target.value }));

    const Stars = ({ val }) => <span className="starred">{'★'.repeat(Math.round(val))}</span>;

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div><h1>Testimonials</h1><p>Manage customer testimonials shown on the homepage.</p></div>
                <button className="btn btn-primary" onClick={openAdd}><Plus size={14} />Add Testimonial</button>
            </div>
            <div className="card">
                <div className="card-header">
                    <div className="search-box"><Search size={14} /><input placeholder="Search name or location…" value={search} onChange={e => setSearch(e.target.value)} /></div>
                    <span style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>{filtered.length} testimonials</span>
                </div>
                <div className="table-wrap">
                    <table>
                        <thead><tr><th>Name</th><th>Location</th><th>Rating</th><th>Order</th><th>Active</th><th>Actions</th></tr></thead>
                        <tbody>
                            {loading ? <tr className="empty-row"><td colSpan={6}>Loading…</td></tr>
                                : filtered.length === 0 ? <tr className="empty-row"><td colSpan={6}>No testimonials found</td></tr>
                                    : filtered.map(t => (
                                        <tr key={t.id}>
                                            <td>
                                                <strong>{t.name}</strong>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: 2, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.text}</p>
                                            </td>
                                            <td>{t.location}</td>
                                            <td><Stars val={t.rating} /> <span style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>{t.rating}</span></td>
                                            <td>{t.display_order}</td>
                                            <td>
                                                <label className="toggle-label">
                                                    <div className="toggle"><input type="checkbox" checked={t.is_active} onChange={() => toggleActive(t)} /><div className="toggle-slider" /></div>
                                                </label>
                                            </td>
                                            <td>
                                                <div className="td-actions">
                                                    <button className="btn-icon edit" onClick={() => openEdit(t)}><Pencil size={13} /></button>
                                                    <button className="btn-icon delete" onClick={() => openDel(t)}><Trash2 size={13} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {(modal === 'add' || modal === 'edit') && (
                <Modal title={modal === 'add' ? 'Add Testimonial' : 'Edit Testimonial'} onClose={() => setModal(null)}
                    footer={<><button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button></>}>
                    <div className="form-grid">
                        <div className="form-group"><label>Name *</label><input className="form-input" value={form.name} onChange={f('name')} /></div>
                        <div className="form-group"><label>Location</label><input className="form-input" value={form.location} onChange={f('location')} placeholder="e.g. Mumbai" /></div>
                        <div className="form-group"><label>Rating (1–5)</label><input className="form-input" type="number" min="1" max="5" step="0.1" value={form.rating} onChange={f('rating')} /></div>
                        <div className="form-group"><label>Display Order</label><input className="form-input" type="number" min="0" value={form.display_order} onChange={f('display_order')} /></div>
                        <div className="form-group span2"><label>Review Text *</label><textarea className="form-textarea" value={form.text} onChange={f('text')} rows={4} /></div>
                        <div className="form-group span2">
                            <label className="toggle-label">
                                <div className="toggle"><input type="checkbox" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} /><div className="toggle-slider" /></div>
                                Active (shows on website)
                            </label>
                        </div>
                    </div>
                </Modal>
            )}

            {modal === 'delete' && current && (
                <Modal title="Delete Testimonial" onClose={() => setModal(null)}
                    footer={<><button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-danger" onClick={del} disabled={saving}>{saving ? 'Deleting…' : 'Delete'}</button></>}>
                    <p className="confirm-text">Delete testimonial from <strong>{current.name}</strong>?</p>
                </Modal>
            )}
        </div>
    );
}
