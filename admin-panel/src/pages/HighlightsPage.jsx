import React, { useEffect, useState, useContext } from 'react';
import { highlightsApi } from '../api';
import { ToastCtx } from '../App';
import Modal from '../components/Modal';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

const EMPTY = { title: '', description: '', icon_name: 'star', display_order: '0', is_active: true };

export default function HighlightsPage() {
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
        highlightsApi.list().then(d => setItems(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
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
            if (modal === 'add') await highlightsApi.create(p);
            else await highlightsApi.update(current.id, p);
            toast(modal === 'add' ? 'Highlight added!' : 'Updated!');
            setModal(null); load();
        } catch (e) { toast(e.message, 'error'); }
        finally { setSaving(false); }
    };

    const del = async () => {
        setSaving(true);
        try { await highlightsApi.delete(current.id); toast('Deleted.'); setModal(null); load(); }
        catch (e) { toast(e.message, 'error'); }
        finally { setSaving(false); }
    };

    const toggleActive = async (h) => {
        try { await highlightsApi.update(h.id, { is_active: !h.is_active }); toast('Updated!'); load(); }
        catch (e) { toast(e.message, 'error'); }
    };

    const f = (k) => e => setForm(p => ({ ...p, [k]: e.target.value }));

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div><h1>Service Highlights</h1><p>Short feature cards shown on the homepage.</p></div>
                <button className="btn btn-primary" onClick={openAdd}><Plus size={14} />Add Highlight</button>
            </div>
            <div className="card">
                <div className="card-header">
                    <div className="search-box"><Search size={14} /><input placeholder="Search title…" value={search} onChange={e => setSearch(e.target.value)} /></div>
                </div>
                <div className="table-wrap">
                    <table>
                        <thead><tr><th>Title</th><th>Description</th><th>Icon</th><th>Order</th><th>Active</th><th>Actions</th></tr></thead>
                        <tbody>
                            {loading ? <tr className="empty-row"><td colSpan={6}>Loading…</td></tr>
                                : filtered.length === 0 ? <tr className="empty-row"><td colSpan={6}>No highlights found</td></tr>
                                    : filtered.map(h => (
                                        <tr key={h.id}>
                                            <td><strong>{h.title}</strong></td>
                                            <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--gray-500)' }}>{h.description}</td>
                                            <td><code style={{ fontSize: '0.75rem', background: 'var(--gray-100)', padding: '2px 6px', borderRadius: 4 }}>{h.icon_name}</code></td>
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
                <Modal title={modal === 'add' ? 'Add Highlight' : 'Edit Highlight'} onClose={() => setModal(null)}
                    footer={<><button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button></>}>
                    <div className="form-grid">
                        <div className="form-group"><label>Title *</label><input className="form-input" value={form.title} onChange={f('title')} /></div>
                        <div className="form-group"><label>Icon Name (Lucide)</label><input className="form-input" value={form.icon_name} onChange={f('icon_name')} placeholder="e.g. award, shield-check" /></div>
                        <div className="form-group span2"><label>Description</label><input className="form-input" value={form.description} onChange={f('description')} /></div>
                        <div className="form-group"><label>Display Order</label><input className="form-input" type="number" value={form.display_order} onChange={f('display_order')} /></div>
                        <div className="form-group" style={{ justifyContent: 'flex-end' }}>
                            <label className="toggle-label" style={{ marginTop: 20 }}>
                                <div className="toggle"><input type="checkbox" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} /><div className="toggle-slider" /></div>
                                Active
                            </label>
                        </div>
                    </div>
                </Modal>
            )}

            {modal === 'delete' && current && (
                <Modal title="Delete Highlight" onClose={() => setModal(null)}
                    footer={<><button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-danger" onClick={del} disabled={saving}>{saving ? 'Deleting…' : 'Delete'}</button></>}>
                    <p className="confirm-text">Delete highlight <strong>{current.title}</strong>?</p>
                </Modal>
            )}
        </div>
    );
}
