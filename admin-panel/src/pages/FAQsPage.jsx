import React, { useEffect, useState, useContext } from 'react';
import { faqsApi } from '../api';
import { ToastCtx } from '../App';
import Modal from '../components/Modal';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

const EMPTY = { question: '', answer: '', display_order: '0', is_active: true };

export default function FAQsPage() {
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
        faqsApi.list().then(d => setItems(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
    };
    useEffect(load, []);

    const filtered = items.filter(i => !search || i.question?.toLowerCase().includes(search.toLowerCase()));

    const openAdd = () => { setForm(EMPTY); setModal('add'); };
    const openEdit = (q) => { setCurrent(q); setForm({ ...EMPTY, ...q, display_order: String(q.display_order) }); setModal('edit'); };
    const openDel = (q) => { setCurrent(q); setModal('delete'); };

    const save = async () => {
        setSaving(true);
        try {
            const p = { ...form, display_order: Number(form.display_order) };
            if (modal === 'add') await faqsApi.create(p);
            else await faqsApi.update(current.id, p);
            toast(modal === 'add' ? 'FAQ added!' : 'Updated!');
            setModal(null); load();
        } catch (e) { toast(e.message, 'error'); }
        finally { setSaving(false); }
    };

    const del = async () => {
        setSaving(true);
        try { await faqsApi.delete(current.id); toast('Deleted.'); setModal(null); load(); }
        catch (e) { toast(e.message, 'error'); }
        finally { setSaving(false); }
    };

    const toggleActive = async (q) => {
        try { await faqsApi.update(q.id, { is_active: !q.is_active }); toast('Updated!'); load(); }
        catch (e) { toast(e.message, 'error'); }
    };

    const f = (k) => e => setForm(p => ({ ...p, [k]: e.target.value }));

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div><h1>FAQs</h1><p>Manage frequently asked questions displayed on the website.</p></div>
                <button className="btn btn-primary" onClick={openAdd}><Plus size={14} />Add FAQ</button>
            </div>
            <div className="card">
                <div className="card-header">
                    <div className="search-box"><Search size={14} /><input placeholder="Search question…" value={search} onChange={e => setSearch(e.target.value)} /></div>
                    <span style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>{filtered.length} FAQs</span>
                </div>
                <div className="table-wrap">
                    <table>
                        <thead><tr><th>#</th><th>Question</th><th>Answer Preview</th><th>Active</th><th>Actions</th></tr></thead>
                        <tbody>
                            {loading ? <tr className="empty-row"><td colSpan={5}>Loading…</td></tr>
                                : filtered.length === 0 ? <tr className="empty-row"><td colSpan={5}>No FAQs found</td></tr>
                                    : filtered.map(q => (
                                        <tr key={q.id}>
                                            <td style={{ color: 'var(--gray-400)' }}>{q.display_order}</td>
                                            <td style={{ maxWidth: 220 }}><strong style={{ fontSize: '0.88rem' }}>{q.question}</strong></td>
                                            <td style={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--gray-500)', fontSize: '0.82rem' }}>{q.answer}</td>
                                            <td><label className="toggle-label"><div className="toggle"><input type="checkbox" checked={q.is_active} onChange={() => toggleActive(q)} /><div className="toggle-slider" /></div></label></td>
                                            <td><div className="td-actions"><button className="btn-icon edit" onClick={() => openEdit(q)}><Pencil size={13} /></button><button className="btn-icon delete" onClick={() => openDel(q)}><Trash2 size={13} /></button></div></td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {(modal === 'add' || modal === 'edit') && (
                <Modal title={modal === 'add' ? 'Add FAQ' : 'Edit FAQ'} onClose={() => setModal(null)}
                    footer={<><button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button></>}>
                    <div className="form-grid col1">
                        <div className="form-group"><label>Question *</label><input className="form-input" value={form.question} onChange={f('question')} /></div>
                        <div className="form-group"><label>Answer *</label><textarea className="form-textarea" value={form.answer} onChange={f('answer')} rows={5} /></div>
                        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                            <div className="form-group"><label>Display Order</label><input className="form-input" type="number" value={form.display_order} onChange={f('display_order')} /></div>
                            <div className="form-group" style={{ justifyContent: 'flex-end' }}>
                                <label className="toggle-label" style={{ marginTop: 20 }}><div className="toggle"><input type="checkbox" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} /><div className="toggle-slider" /></div>Active</label>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {modal === 'delete' && current && (
                <Modal title="Delete FAQ" onClose={() => setModal(null)}
                    footer={<><button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-danger" onClick={del} disabled={saving}>{saving ? 'Deleting…' : 'Delete'}</button></>}>
                    <p className="confirm-text">Delete this FAQ: <strong>{current.question}</strong>?</p>
                </Modal>
            )}
        </div>
    );
}
