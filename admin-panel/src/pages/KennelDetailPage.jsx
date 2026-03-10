import React, { useEffect, useState, useContext } from 'react';
import { kennelDetailApi } from '../api';
import { ToastCtx } from '../App';
import { Save } from 'lucide-react';

const EMPTY = { address: '', phone: '', email: '', map_url: '' };

export default function KennelDetailPage() {
    const toast = useContext(ToastCtx);
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(EMPTY);
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const load = () => {
        setLoading(true);
        kennelDetailApi.list().then(d => {
            const list = Array.isArray(d) ? d : (d?.results || []);
            setItems(list);
            if (list.length > 0) { setRecord(list[0]); setForm({ ...EMPTY, ...list[0] }); }
        }).finally(() => setLoading(false));
    };
    useEffect(load, []);

    const save = async () => {
        setSaving(true);
        try {
            if (record) await kennelDetailApi.update(record.id, form);
            else await kennelDetailApi.create(form);
            toast('Kennel details saved!');
            load();
        } catch (e) { toast(e.message, 'error'); }
        finally { setSaving(false); }
    };

    const f = (k) => e => setForm(p => ({ ...p, [k]: e.target.value }));

    if (loading) return <div className="loading-center">Loading…</div>;

    return (
        <div>
            <div className="page-header">
                <h1>Kennel Details</h1>
                <p>Edit the contact information shown on the website.</p>
            </div>

            <div className="card" style={{ maxWidth: 640 }}>
                <div className="card-header">
                    <h2>Contact Information</h2>
                    {record?.updated_at && <span style={{ color: 'var(--gray-400)', fontSize: '0.78rem' }}>Last updated: {record.updated_at?.slice(0, 10)}</span>}
                </div>
                <div className="card-body">
                    <div className="form-grid col1" style={{ gap: 18 }}>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input className="form-input" value={form.phone} onChange={f('phone')} placeholder="+91 98765 43210" />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input className="form-input" type="email" value={form.email} onChange={f('email')} placeholder="info@sskennels.com" />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <textarea className="form-textarea" value={form.address} onChange={f('address')} rows={3} placeholder="Full address…" />
                        </div>
                        <div className="form-group">
                            <label>Google Maps URL</label>
                            <input className="form-input" value={form.map_url} onChange={f('map_url')} placeholder="https://maps.google.com/?q=…" />
                            <span className="form-help">Embed link for the map iFrame on Contact page.</span>
                        </div>
                        <button className="btn btn-primary" onClick={save} disabled={saving} style={{ width: 'fit-content' }}>
                            <Save size={14} />{saving ? 'Saving…' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
