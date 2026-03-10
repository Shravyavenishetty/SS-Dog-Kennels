import React, { useEffect, useState, useContext } from 'react';
import { studDogsApi, studAvailabilityApi } from '../api';
import { ToastCtx } from '../App';
import Modal from '../components/Modal';
import ImageUploadField from '../components/ImageUploadField';
import { Plus, Pencil, Trash2, Search, CalendarDays, X } from 'lucide-react';

const EMPTY = { breed: '', rating: '5.0', pups_produced: '0', image_url: '' };
const EMPTY_DATE = { stud: '', date: '', note: '' };

export default function StudDogsPage() {
    const toast = useContext(ToastCtx);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState(null);
    const [current, setCurrent] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [dateForm, setDateForm] = useState(EMPTY_DATE);
    const [saving, setSaving] = useState(false);

    const load = () => {
        setLoading(true);
        studDogsApi.list().then(d => setItems(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
    };
    useEffect(load, []);

    const filtered = items.filter(i => !search || i.breed?.toLowerCase().includes(search.toLowerCase()));

    const openAdd = () => { setForm(EMPTY); setModal('add'); };
    const openEdit = (s) => { setCurrent(s); setForm({ ...EMPTY, ...s }); setModal('edit'); };
    const openDel = (s) => { setCurrent(s); setModal('delete'); };
    const openDates = (s) => { setCurrent(s); setDateForm({ ...EMPTY_DATE, stud: s.id }); setModal('dates'); };

    const save = async () => {
        setSaving(true);
        try {
            const payload = { ...form, rating: Number(form.rating), pups_produced: Number(form.pups_produced) };
            if (modal === 'add') await studDogsApi.create(payload);
            else await studDogsApi.update(current.id, payload);
            toast(modal === 'add' ? 'Stud dog added!' : 'Updated!');
            setModal(null); load();
        } catch (e) { toast(e.message, 'error'); }
        finally { setSaving(false); }
    };

    const del = async () => {
        setSaving(true);
        try { await studDogsApi.delete(current.id); toast('Deleted.'); setModal(null); load(); }
        catch (e) { toast(e.message, 'error'); }
        finally { setSaving(false); }
    };

    const addDate = async () => {
        setSaving(true);
        try {
            await studAvailabilityApi.create({ stud: current.id, date: dateForm.date, note: dateForm.note });
            toast('Booked date added!'); load();
            setDateForm({ ...EMPTY_DATE, stud: current.id });
        } catch (e) { toast(e.message, 'error'); }
        finally { setSaving(false); }
    };

    const removeDate = async (dateId) => {
        try { await studAvailabilityApi.delete(dateId); toast('Date removed.'); load(); }
        catch (e) { toast(e.message, 'error'); }
    };

    const f = (k) => e => setForm(p => ({ ...p, [k]: e.target.value }));

    const Stars = ({ val }) => (
        <span className="starred">{'★'.repeat(Math.floor(val))}{'☆'.repeat(5 - Math.floor(val))}</span>
    );

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div><h1>Stud Dogs</h1><p>Manage stud dog profiles and booked availability dates.</p></div>
                <button className="btn btn-primary" onClick={openAdd}><Plus size={14} />Add Stud Dog</button>
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="search-box"><Search size={14} /><input placeholder="Search breed…" value={search} onChange={e => setSearch(e.target.value)} /></div>
                    <span style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>{filtered.length} stud dogs</span>
                </div>
                <div className="table-wrap">
                    <table>
                        <thead><tr><th>Breed</th><th>Rating</th><th>Pups Produced</th><th>Booked Dates</th><th>Actions</th></tr></thead>
                        <tbody>
                            {loading ? <tr className="empty-row"><td colSpan={5}>Loading…</td></tr>
                                : filtered.length === 0 ? <tr className="empty-row"><td colSpan={5}>No stud dogs found</td></tr>
                                    : filtered.map(s => (
                                        <tr key={s.id}>
                                            <td><strong>{s.breed}</strong></td>
                                            <td><Stars val={Number(s.rating)} /> <span style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>{s.rating}/5</span></td>
                                            <td>{s.pups_produced}</td>
                                            <td>
                                                <div className="dates-list">
                                                    {(s.booked_dates || []).slice(0, 3).map(d => (
                                                        <span key={d.id} className="date-chip">
                                                            {d.date}
                                                            <button onClick={() => removeDate(d.id)} title="Remove"><X size={10} /></button>
                                                        </span>
                                                    ))}
                                                    {(s.booked_dates || []).length > 3 && <span className="badge badge-gray">+{s.booked_dates.length - 3} more</span>}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="td-actions">
                                                    <button className="btn-icon" title="Manage Dates" onClick={() => openDates(s)}><CalendarDays size={13} /></button>
                                                    <button className="btn-icon edit" title="Edit" onClick={() => openEdit(s)}><Pencil size={13} /></button>
                                                    <button className="btn-icon delete" title="Delete" onClick={() => openDel(s)}><Trash2 size={13} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add / Edit Modal */}
            {(modal === 'add' || modal === 'edit') && (
                <Modal title={modal === 'add' ? 'Add Stud Dog' : 'Edit Stud Dog'} onClose={() => setModal(null)}
                    footer={<><button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button></>}>
                    <div className="form-grid">
                        <div className="form-group span2"><label>Breed *</label><input className="form-input" value={form.breed} onChange={f('breed')} placeholder="e.g. Labrador Retriever" /></div>
                        <div className="form-group"><label>Rating (0–5)</label><input className="form-input" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={f('rating')} /></div>
                        <div className="form-group"><label>Pups Produced</label><input className="form-input" type="number" min="0" value={form.pups_produced} onChange={f('pups_produced')} /></div>
                        <div className="form-group span2">
                            <ImageUploadField
                                label="Stud Dog Image"
                                value={form.image_url}
                                onChange={url => setForm(p => ({ ...p, image_url: url }))}
                                folder="stud-dogs"
                                onError={msg => toast(msg, 'error')}
                            />
                        </div>
                    </div>
                </Modal>
            )}

            {/* Booked Dates Modal */}
            {modal === 'dates' && current && (
                <Modal title={`Booked Dates — ${current.breed}`} onClose={() => setModal(null)} size="lg">
                    <div className="dates-list" style={{ marginBottom: 16 }}>
                        {(current.booked_dates || []).length === 0 && <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>No booked dates.</p>}
                        {(current.booked_dates || []).map(d => (
                            <span key={d.id} className="date-chip">
                                {d.date} {d.note && <em>({d.note})</em>}
                                <button onClick={() => removeDate(d.id)}><X size={10} /></button>
                            </span>
                        ))}
                    </div>
                    <hr className="divider" />
                    <div className="section-title">Add Booked Date</div>
                    <div className="form-grid">
                        <div className="form-group"><label>Date *</label><input className="form-input" type="date" value={dateForm.date} onChange={e => setDateForm(p => ({ ...p, date: e.target.value }))} /></div>
                        <div className="form-group"><label>Note (optional)</label><input className="form-input" value={dateForm.note} onChange={e => setDateForm(p => ({ ...p, note: e.target.value }))} placeholder="e.g. Morning slot" /></div>
                    </div>
                    <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={addDate} disabled={saving || !dateForm.date}>{saving ? 'Adding…' : 'Add Date'}</button>
                </Modal>
            )}

            {/* Delete Modal */}
            {modal === 'delete' && current && (
                <Modal title="Delete Stud Dog" onClose={() => setModal(null)}
                    footer={<><button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-danger" onClick={del} disabled={saving}>{saving ? 'Deleting…' : 'Delete'}</button></>}>
                    <p className="confirm-text">Delete <strong>{current.breed}</strong>? All booked dates will also be removed.</p>
                </Modal>
            )}
        </div>
    );
}
