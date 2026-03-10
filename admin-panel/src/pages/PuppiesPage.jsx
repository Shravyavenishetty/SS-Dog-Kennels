import React, { useEffect, useState, useContext } from 'react';
import { puppiesApi, puppyImagesApi, puppyVideosApi } from '../api';
import { ToastCtx } from '../App';
import Modal from '../components/Modal';
import ImageUploadField from '../components/ImageUploadField';
import VideoUploadField from '../components/VideoUploadField';
import { Plus, Pencil, Trash2, Search, Image, Film, X } from 'lucide-react';

const AVAIL = ['Available Now', 'Coming Soon', 'Sold Out'];
const TYPES = ['Guard Dogs', 'Pets', 'Working Dogs', 'Farm Dogs'];
const PER_PAGE = 10;
const EMPTY = {
    breed: '', price: '', price_display: '', age: '',
    availability: 'Available Now', dog_type: 'Pets', image_url: '',
    tagline: 'Elite Heritage & Quality Companion', behavior: 'Calm & Trained',
    health_shield: 'Verified', description: '', initial_package: '', elite_protection: '',
    new_gallery_urls: [], new_video_urls: []
};

function buildPuppyPayload(form) {
    return {
        breed: form.breed,
        price: Number(form.price) || 0,
        price_display: form.price_display,
        age: form.age,
        availability: form.availability,
        dog_type: form.dog_type,
        tagline: form.tagline,
        behavior: form.behavior,
        health_shield: form.health_shield,
        description: form.description,
        initial_package: form.initial_package,
        elite_protection: form.elite_protection,
        raw_image_url: form.image_url || '',
    };
}

export default function PuppiesPage() {
    const toast = useContext(ToastCtx);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [avail, setAvail] = useState('');
    const [type, setType] = useState('');
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(null); // null | 'add' | 'edit' | 'delete'
    const [current, setCurrent] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);

    // Existing media (for edit mode)
    const [existingGallery, setExistingGallery] = useState([]);
    const [existingVideos, setExistingVideos] = useState([]);

    const load = () => {
        setLoading(true);
        puppiesApi.list().then(d => setItems(Array.isArray(d) ? d : (d?.results || []))).finally(() => setLoading(false));
    };
    useEffect(load, []);

    const filtered = items.filter(i =>
        (!search || i.breed?.toLowerCase().includes(search.toLowerCase())) &&
        (!avail || i.availability === avail) &&
        (!type || i.dog_type === type)
    );
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const openAdd = () => {
        setForm({ ...EMPTY, new_gallery_urls: [], new_video_urls: [] });
        setExistingGallery([]);
        setExistingVideos([]);
        setModal('add');
    };
    const openEdit = (p) => {
        setCurrent(p);
        setForm({ ...EMPTY, ...p, new_gallery_urls: [], new_video_urls: [] });
        setExistingGallery(p.images || []);
        setExistingVideos(p.videos || []);
        setModal('edit');
    };
    const openDel = (p) => { setCurrent(p); setModal('delete'); };

    const save = async () => {
        setSaving(true);
        try {
            const payload = buildPuppyPayload(form);

            let savedPuppy;
            if (modal === 'add') savedPuppy = await puppiesApi.create(payload);
            else {
                await puppiesApi.update(current.id, payload);
                savedPuppy = current;
            }

            // Save new gallery images
            for (const url of form.new_gallery_urls) {
                await puppyImagesApi.create({ puppy: savedPuppy.id, image_url: url });
            }
            // Save new videos
            for (const url of form.new_video_urls) {
                await puppyVideosApi.create({ puppy: savedPuppy.id, video_url: url });
            }

            toast(modal === 'add' ? 'Puppy added!' : 'Puppy updated!');
            setModal(null); load();
        } catch (e) { toast(e.message, 'error'); }
        finally { setSaving(false); }
    };

    const del = async () => {
        setSaving(true);
        try { await puppiesApi.delete(current.id); toast('Puppy deleted.'); setModal(null); load(); }
        catch (e) { toast(e.message, 'error'); }
        finally { setSaving(false); }
    };

    const removeExistingGalleryImage = async (id) => {
        try {
            await puppyImagesApi.delete(id);
            setExistingGallery(prev => prev.filter(img => img.id !== id));
            toast('Image removed.');
        } catch (e) { toast(e.message, 'error'); }
    };

    const removeExistingVideo = async (id) => {
        try {
            await puppyVideosApi.delete(id);
            setExistingVideos(prev => prev.filter(v => v.id !== id));
            toast('Video removed.');
        } catch (e) { toast(e.message, 'error'); }
    };

    const removeNewGalleryImage = (index) => {
        setForm(p => ({ ...p, new_gallery_urls: p.new_gallery_urls.filter((_, i) => i !== index) }));
    };

    const removeNewVideo = (index) => {
        setForm(p => ({ ...p, new_video_urls: p.new_video_urls.filter((_, i) => i !== index) }));
    };

    const f = (k) => e => setForm(p => ({ ...p, [k]: e.target.value }));

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div><h1>Puppies</h1><p>Manage your puppy listings and gallery images.</p></div>
                <button className="btn btn-primary" onClick={openAdd}><Plus size={14} />Add Puppy</button>
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="table-controls">
                        <div className="search-box"><Search size={14} /><input placeholder="Search breed…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></div>
                        <select className="filter-select" value={avail} onChange={e => { setAvail(e.target.value); setPage(1); }}>
                            <option value="">All Availability</option>{AVAIL.map(a => <option key={a}>{a}</option>)}
                        </select>
                        <select className="filter-select" value={type} onChange={e => { setType(e.target.value); setPage(1); }}>
                            <option value="">All Types</option>{TYPES.map(t => <option key={t}>{t}</option>)}
                        </select>
                    </div>
                    <span style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>{filtered.length} puppies</span>
                </div>
                <div className="table-wrap">
                    <table>
                        <thead><tr><th>Image</th><th>Breed</th><th>Price</th><th>Age</th><th>Type</th><th>Availability</th><th>Actions</th></tr></thead>
                        <tbody>
                            {loading ? <tr className="empty-row"><td colSpan={7}>Loading…</td></tr>
                                : paged.length === 0 ? <tr className="empty-row"><td colSpan={7}>No puppies found</td></tr>
                                    : paged.map(p => (
                                        <tr key={p.id}>
                                            <td>{p.image_url ? <img className="img-thumb" src={p.image_url} alt={p.breed} onError={e => e.target.style.display = 'none'} /> : <div className="no-img"><Image size={14} /></div>}</td>
                                            <td><strong>{p.breed}</strong></td>
                                            <td>{p.price_display || `₹${p.price}`}</td>
                                            <td>{p.age}</td>
                                            <td><span className="badge badge-forest">{p.dog_type}</span></td>
                                            <td><span className={`badge ${p.availability === 'Available Now' ? 'badge-green' : p.availability === 'Coming Soon' ? 'badge-amber' : 'badge-red'}`}>{p.availability}</span></td>
                                            <td>
                                                <div className="td-actions">
                                                    <button className="btn-icon edit" title="Edit" onClick={() => openEdit(p)}><Pencil size={13} /></button>
                                                    <button className="btn-icon delete" title="Delete" onClick={() => openDel(p)}><Trash2 size={13} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                    <div className="pagination">
                        <span>Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}</span>
                        <div className="pagination-pages">
                            <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                            {Array.from({ length: totalPages }, (_, i) => <button key={i + 1} className={`page-btn${page === i + 1 ? ' active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>)}
                            <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add / Edit Modal */}
            {(modal === 'add' || modal === 'edit') && (
                <Modal title={modal === 'add' ? 'Add New Puppy' : 'Edit Puppy'} onClose={() => setModal(null)} size="lg"
                    footer={<><button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Puppy'}</button></>}>
                    <div className="form-grid">
                        <div className="form-group"><label>Breed *</label><input className="form-input" value={form.breed} onChange={f('breed')} placeholder="e.g. German Shepherd" /></div>
                        <div className="form-group"><label>Age</label><input className="form-input" value={form.age} onChange={f('age')} placeholder="e.g. 2 months" /></div>
                        <div className="form-group"><label>Price (₹)</label><input className="form-input" type="number" value={form.price} onChange={f('price')} /></div>
                        <div className="form-group"><label>Price Display</label><input className="form-input" value={form.price_display} onChange={f('price_display')} placeholder="e.g. ₹45,000" /></div>
                        <div className="form-group"><label>Type</label><select className="form-select" value={form.dog_type} onChange={f('dog_type')}>{TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
                        <div className="form-group"><label>Availability</label><select className="form-select" value={form.availability} onChange={f('availability')}>{AVAIL.map(a => <option key={a}>{a}</option>)}</select></div>
                        <div className="form-group span2">
                            <ImageUploadField
                                label="Main Image"
                                value={form.image_url}
                                onChange={url => setForm(p => ({ ...p, image_url: url }))}
                                folder="puppies"
                                onError={msg => toast(msg, 'error')}
                            />
                        </div>

                        {/* Video Section */}
                        <div className="form-group span2" style={{ marginTop: '8px' }}>
                            <div className="section-title">Videos (Max 3)</div>
                            <div className="inline-gallery" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '8px' }}>
                                {/* Existing */}
                                {existingVideos.map(vid => (
                                    <div className="gallery-thumb" key={vid.id} style={{ height: 'auto', padding: '4px', background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: '8px', position: 'relative' }}>
                                        <video src={vid.video_url} controls style={{ width: '100%', borderRadius: '4px', background: '#000', maxHeight: '120px' }} />
                                        <button className="rm-btn" title="Remove" onClick={() => removeExistingVideo(vid.id)} style={{ position: 'absolute', top: '-8px', right: '-8px' }}>×</button>
                                    </div>
                                ))}
                                {/* New */}
                                {form.new_video_urls.map((url, i) => (
                                    <div className="gallery-thumb" key={`new-${i}`} style={{ height: 'auto', padding: '4px', background: 'var(--brand-50)', border: '2px dashed var(--brand)', opacity: 0.8, borderRadius: '8px', position: 'relative' }}>
                                        <video src={url} controls style={{ width: '100%', borderRadius: '4px', background: '#000', maxHeight: '120px' }} />
                                        <button className="rm-btn" title="Remove" onClick={() => removeNewVideo(i)} style={{ position: 'absolute', top: '-8px', right: '-8px' }}>×</button>
                                    </div>
                                ))}
                            </div>
                            {(existingVideos.length + form.new_video_urls.length) >= 3 ? (
                                <p style={{ color: 'var(--amber-600)', fontSize: '0.85rem' }}>Maximum 3 videos allowed.</p>
                            ) : (
                                <VideoUploadField
                                    label=""
                                    value=""
                                    onChange={url => {
                                        if (url) setForm(p => ({ ...p, new_video_urls: [...p.new_video_urls, url] }));
                                    }}
                                    onUploadComplete={() => { }}
                                    folder="puppies/videos"
                                    onError={msg => toast(msg, 'error')}
                                />
                            )}
                        </div>

                        {/* Gallery Section */}
                        <div className="form-group span2" style={{ marginTop: '8px' }}>
                            <div className="section-title">Gallery Images</div>
                            <div className="inline-gallery" style={{ marginBottom: '8px' }}>
                                {/* Existing */}
                                {existingGallery.map(img => (
                                    <div className="gallery-thumb" key={img.id} style={{ position: 'relative' }}>
                                        <img src={img.image_url || img.url} alt="gallery" onError={e => e.target.src = ''} />
                                        <button className="rm-btn" title="Remove" onClick={() => removeExistingGalleryImage(img.id)}>×</button>
                                    </div>
                                ))}
                                {/* New  */}
                                {form.new_gallery_urls.map((url, i) => (
                                    <div className="gallery-thumb" key={`new-${i}`} style={{ position: 'relative', border: '2px dashed var(--brand)', opacity: 0.8 }}>
                                        <img src={url} alt="new gallery" />
                                        <button className="rm-btn" title="Remove" onClick={() => removeNewGalleryImage(i)}>×</button>
                                    </div>
                                ))}
                            </div>
                            <ImageUploadField
                                label=""
                                value=""
                                onChange={url => {
                                    if (url) setForm(p => ({ ...p, new_gallery_urls: [...p.new_gallery_urls, url] }));
                                }}
                                onUploadComplete={() => { }}
                                folder="puppies/gallery"
                                onError={msg => toast(msg, 'error')}
                            />
                        </div>

                        <hr className="divider span2" style={{ margin: '12px 0' }} />

                        <div className="form-group span2"><label>Tagline</label><input className="form-input" value={form.tagline} onChange={f('tagline')} /></div>
                        <div className="form-group"><label>Behavior</label><input className="form-input" value={form.behavior} onChange={f('behavior')} /></div>
                        <div className="form-group"><label>Health Shield</label><input className="form-input" value={form.health_shield} onChange={f('health_shield')} /></div>
                        <div className="form-group span2"><label>Description</label><textarea className="form-textarea" value={form.description} onChange={f('description')} rows={3} /></div>
                        <div className="form-group span2"><label>Initial Package</label><textarea className="form-textarea" value={form.initial_package} onChange={f('initial_package')} rows={3} /></div>
                        <div className="form-group span2"><label>Elite Protection</label><textarea className="form-textarea" value={form.elite_protection} onChange={f('elite_protection')} rows={3} /></div>

                        <div style={{ marginTop: '16px', padding: '12px', background: 'var(--forest-50)', color: 'var(--forest-800)', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', gridColumn: '1 / -1' }}>
                            <Film size={16} />
                            <span><strong>Note:</strong> Videos and Gallery Images uploaded here will be saved when you submit the form.</span>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Delete Modal */}
            {modal === 'delete' && current && (
                <Modal title="Delete Puppy" onClose={() => setModal(null)}
                    footer={<><button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-danger" onClick={del} disabled={saving}>{saving ? 'Deleting…' : 'Delete'}</button></>}>
                    <p className="confirm-text">Are you sure you want to delete <strong>{current.breed}</strong>? This cannot be undone.</p>
                </Modal>
            )}
        </div>
    );
}
