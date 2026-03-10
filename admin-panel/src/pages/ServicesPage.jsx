import React, { useEffect, useState, useContext } from 'react';
import { servicesApi, subServicesApi } from '../api';
import { ToastCtx } from '../App';
import Modal from '../components/Modal';
import ImageUploadField from '../components/ImageUploadField';
import { Plus, Pencil, Trash2, Search, List, X, Image } from 'lucide-react';

const EMPTY = { title: '', tagline: '', image_url: '', icon_name: 'scissors', price_range: '' };

export default function ServicesPage() {
    const toast = useContext(ToastCtx);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState(null);
    const [current, setCurrent] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [subName, setSubName] = useState('');
    const [saving, setSaving] = useState(false);

    const load = () => {
        setLoading(true);
        servicesApi.list().then(d => setItems(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
    };
    useEffect(load, []);

    const filtered = items.filter(i => !search || i.title?.toLowerCase().includes(search.toLowerCase()));

    const openAdd = () => { setForm(EMPTY); setModal('add'); };
    const openEdit = (s) => { setCurrent(s); setForm({ ...EMPTY, ...s }); setModal('edit'); };
    const openDel = (s) => { setCurrent(s); setModal('delete'); };
    const openSubs = (s) => { setCurrent(s); setSubName(''); setModal('subs'); };

    const save = async () => {
        setSaving(true);
        try {
            if (modal === 'add') await servicesApi.create(form);
            else await servicesApi.update(current.id, form);
            toast(modal === 'add' ? 'Service added!' : 'Updated!');
            setModal(null); load();
        } catch (e) { toast(e.message, 'error'); }
        finally { setSaving(false); }
    };

    const del = async () => {
        setSaving(true);
        try { await servicesApi.delete(current.id); toast('Deleted.'); setModal(null); load(); }
        catch (e) { toast(e.message, 'error'); }
        finally { setSaving(false); }
    };

    const addSub = async () => {
        if (!subName.trim()) return;
        setSaving(true);
        try {
            await subServicesApi.create({ category: current.id, name: subName.trim() });
            toast('Sub-service added!'); setSubName(''); load();
        } catch (e) { toast(e.message, 'error'); }
        finally { setSaving(false); }
    };

    const removeSub = async (id) => {
        try { await subServicesApi.delete(id); toast('Removed.'); load(); }
        catch (e) { toast(e.message, 'error'); }
    };

    const f = (k) => e => setForm(p => ({ ...p, [k]: e.target.value }));

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div><h1>Services</h1><p>Manage service categories and sub-services.</p></div>
                <button className="btn btn-primary" onClick={openAdd}><Plus size={14} />Add Service</button>
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="search-box"><Search size={14} /><input placeholder="Search service…" value={search} onChange={e => setSearch(e.target.value)} /></div>
                    <span style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>{filtered.length} services</span>
                </div>
                <div className="table-wrap">
                    <table>
                        <thead><tr><th>Image</th><th>Title</th><th>Tagline</th><th>Price Range</th><th>Sub-Services</th><th>Actions</th></tr></thead>
                        <tbody>
                            {loading
                                ? <tr className="empty-row"><td colSpan={6}>Loading…</td></tr>
                                : filtered.length === 0
                                    ? <tr className="empty-row"><td colSpan={6}>No services found</td></tr>
                                    : filtered.map(s => (
                                        <tr key={s.id}>
                                            <td>
                                                {s.image_url
                                                    ? <img className="img-thumb" src={s.image_url} alt={s.title} onError={e => e.target.style.display = 'none'} />
                                                    : <div className="no-img"><Image size={14} /></div>}
                                            </td>
                                            <td><strong>{s.title}</strong></td>
                                            <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--gray-500)' }}>{s.tagline}</td>
                                            <td><span className="badge badge-champagne" style={{ background: '#FDF3E3', color: '#9A6B12' }}>{s.price_range}</span></td>
                                            <td><span className="badge badge-gray">{(s.sub_services || []).length} items</span></td>
                                            <td>
                                                <div className="td-actions">
                                                    <button className="btn-icon" title="Sub-services" onClick={() => openSubs(s)}><List size={13} /></button>
                                                    <button className="btn-icon edit" onClick={() => openEdit(s)}><Pencil size={13} /></button>
                                                    <button className="btn-icon delete" onClick={() => openDel(s)}><Trash2 size={13} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add / Edit */}
            {(modal === 'add' || modal === 'edit') && (
                <Modal title={modal === 'add' ? 'Add Service' : 'Edit Service'} onClose={() => setModal(null)}
                    footer={<><button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button></>}>
                    <div className="form-grid">
                        <div className="form-group span2"><label>Title *</label><input className="form-input" value={form.title} onChange={f('title')} placeholder="e.g. Dog Grooming" /></div>
                        <div className="form-group span2"><label>Tagline</label><input className="form-input" value={form.tagline} onChange={f('tagline')} placeholder="Short description" /></div>
                        <div className="form-group"><label>Price Range</label><input className="form-input" value={form.price_range} onChange={f('price_range')} placeholder="e.g. ₹500–₹2000" /></div>
                        <div className="form-group"><label>Icon Name (Lucide)</label><input className="form-input" value={form.icon_name} onChange={f('icon_name')} placeholder="e.g. scissors" /></div>
                        <div className="form-group span2">
                            <ImageUploadField
                                label="Service Image"
                                value={form.image_url}
                                onChange={url => setForm(p => ({ ...p, image_url: url }))}
                                folder="services"
                                onError={msg => toast(msg, 'error')}
                            />
                        </div>
                    </div>
                </Modal>
            )}

            {/* Sub-services */}
            {modal === 'subs' && current && (
                <Modal title={`Sub-Services — ${current.title}`} onClose={() => setModal(null)}>
                    <div style={{ marginBottom: 12 }}>
                        {(current.sub_services || []).length === 0 && <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>No sub-services yet.</p>}
                        {(current.sub_services || []).map(sub => (
                            <div key={sub.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--gray-100)' }}>
                                <span style={{ fontSize: '0.88rem' }}>{sub.name}</span>
                                <button className="btn-icon delete" onClick={() => removeSub(sub.id)}><X size={12} /></button>
                            </div>
                        ))}
                    </div>
                    <hr className="divider" />
                    <div className="section-title">Add Sub-Service</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <input className="form-input" value={subName} onChange={e => setSubName(e.target.value)} placeholder="e.g. Basic Bath & Dry" style={{ flex: 1 }} />
                        <button className="btn btn-primary" onClick={addSub} disabled={saving || !subName.trim()}><Plus size={14} />Add</button>
                    </div>
                </Modal>
            )}

            {/* Delete */}
            {modal === 'delete' && current && (
                <Modal title="Delete Service" onClose={() => setModal(null)}
                    footer={<><button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-danger" onClick={del} disabled={saving}>{saving ? 'Deleting…' : 'Delete'}</button></>}>
                    <p className="confirm-text">Delete <strong>{current.title}</strong> and all its sub-services?</p>
                </Modal>
            )}
        </div>
    );
}
