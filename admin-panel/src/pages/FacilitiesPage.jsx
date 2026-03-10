import React, { useEffect, useState, useContext } from 'react';
import { facilitiesApi } from '../api';
import { ToastCtx } from '../App';
import Modal from '../components/Modal';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

const EMPTY = { title: '', description: '', display_order: '0', is_active: true };

export default function FacilitiesPage() {
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
        facilitiesApi.list().then(d => setItems(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
    };
    useEffect(load, []);

    const filtered = items.filter(i => !search || i.title?.toLowerCase().includes(search.toLowerCase()));

    const openAdd = () => { setForm(EMPTY); setModal('add'); };
    const openEdit = (h) => { setCurrent(h); setForm({ ...EMPTY, ...h, display_order: String(h.display_order) }); setModal('edit'); };
    const openDel = (h) => { setCurrent(h); setModal('delete'); };

    const save = async () => {
        setSaving(true);
        try {
            const p = { ...form, display_order: Number(form.display_order) };
            if (modal === 'add') await facilitiesApi.create(p);
            else await facilitiesApi.update(current.id, p);
            toast(modal === 'add' ? 'Facility added!' : 'Updated!');
            setModal(null); load();
        } catch (e) { toast(e.message, 'error'); }
        finally { setSaving(false); }
    };

    const del = async () => {
        setSaving(true);
        try { await facilitiesApi.delete(current.id); toast('Deleted.'); setModal(null); load(); }
        catch (e) { toast(e.message, 'error'); }
        finally { setSaving(false); }
    };

    const toggleActive = async (h) => {
        try { await facilitiesApi.update(h.id, { is_active: !h.is_active }); toast('Updated!'); load(); }
        catch (e) { toast(e.message, 'error'); }
    };

    const f = (k) => e => setForm(p => ({ ...p, [k]: e.target.value }));

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div><h1>Facilities</h1><p>Manage kennel facility descriptions shown on the About page.</p></div>
                <button className="btn btn-primary" onClick={openAdd}><Plus size={14} />Add Facility</button>
            </div>
            <div className="card">
                <div className="card-header">
                    <div className="search-box"><Search size={14} /><input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} /></div>
                </div>
                <div className="table-wrap">
                    <table>
                        <thead><tr><th>Title</th><th>Description</th><th>Order</th><th>Active</th><th>Actions</th></tr></thead>
                        <tbody>
                            {loading ? <tr className="empty-row"><td colSpan={5}>Loading…</td></tr>
                                : filtered.length === 0 ? <tr className="empty-row"><td colSpan={5}>No facilities found</td></tr>
                                    : filtered.map(h => (
                                        <tr key={h.id}>
                                            <td><strong>{h.title}</strong></td>
                                            <td style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--gray-500)' }}>{h.description}</td>
                                            <td>{h.display_order}</td>
                                            <td><label className="toggle-label"><div className="toggle"><input type="checkbox" checked={h.is_active} onChange={() => toggleActive(h)} /><div className="toggle-slider" /></div></label></td>
                                            <td><div className="td-actions"><button className="btn-icon edit" onClick={() => openEdit(h)}><Pencil size={13} /></button><button className="btn-icon delete" onClick={() => openDel(h)}><Trash2 size={13} /></button></div></td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {(modal === 'add' || modal === 'edit') && (
                <Modal title={modal === 'add' ? 'Add Facility' : 'Edit Facility'} onClose={() => setModal(null)}
                    footer={<><button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button></>}>
                    <div className="form-grid">
                        <div className="form-group"><label>Title *</label><input className="form-input" value={form.title} onChange={f('title')} /></div>
                        <div className="form-group"><label>Display Order</label><input className="form-input" type="number" value={form.display_order} onChange={f('display_order')} /></div>
                        <div className="form-group span2"><label>Description</label><textarea className="form-textarea" value={form.description} onChange={f('description')} rows={4} /></div>
                        <div className="form-group span2">
                            <label className="toggle-label"><div className="toggle"><input type="checkbox" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} /><div className="toggle-slider" /></div>Active (visible on website)</label>
                        </div>
                    </div>
                </Modal>
            )}

            {modal === 'delete' && current && (
                <Modal title="Delete Facility" onClose={() => setModal(null)}
                    footer={<><button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-danger" onClick={del} disabled={saving}>{saving ? 'Deleting…' : 'Delete'}</button></>}>
                    <p className="confirm-text">Delete facility <strong>{current.title}</strong>?</p>
                </Modal>
            )}
        </div>
    );
}
