import React, { useState, useRef } from 'react';
import { Upload, Link, X } from 'lucide-react';

const BASE = 'http://localhost:8000/api';

/**
 * ImageUploadField — replaces plain URL inputs with a file-upload widget.
 *
 * Props:
 *   value              – current image URL (controlled)
 *   onChange           – called with the new URL string (every change)
 *   onUploadComplete   – optional: called with URL only after a successful file upload
 *   label              – field label text
 *   folder             – Cloudinary folder for the upload (default: "admin-uploads")
 *   onError            – optional (msg: string) => void for error reporting
 */
export default function ImageUploadField({ value = '', onChange, onUploadComplete, label = 'Image', folder = 'admin-uploads', onError }) {
    const [tab, setTab] = useState('upload');
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef(null);

    const handleFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('folder', folder);

            const res = await fetch(`${BASE}/upload-image/`, { method: 'POST', body: fd });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Upload failed');
            onChange(data.url);
            if (onUploadComplete) onUploadComplete(data.url);
            setTab('url'); // switch to URL view so preview is visible
        } catch (err) {
            if (onError) onError(err.message);
            else alert(err.message);
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    return (
        <div className="iuf-wrap">
            {label && <span className="iuf-label">{label}</span>}

            {/* Tab bar */}
            <div className="iuf-tabs">
                <button type="button" className={`iuf-tab${tab === 'upload' ? ' active' : ''}`} onClick={() => setTab('upload')}>
                    <Upload size={11} /> Upload File
                </button>
                <button type="button" className={`iuf-tab${tab === 'url' ? ' active' : ''}`} onClick={() => setTab('url')}>
                    <Link size={11} /> Paste URL
                </button>
            </div>

            {/* Upload panel */}
            {tab === 'upload' && (
                <div
                    className={`iuf-drop${uploading ? ' iuf-drop--loading' : ''}`}
                    onClick={() => !uploading && fileRef.current?.click()}
                >
                    {uploading ? (
                        <>
                            <div className="iuf-spinner" />
                            <span className="iuf-hint">Uploading to Cloudinary…</span>
                        </>
                    ) : (
                        <>
                            <Upload size={24} strokeWidth={1.5} className="iuf-icon" />
                            <span className="iuf-hint">Click to select an image</span>
                            <span className="iuf-sub">PNG · JPG · WEBP · Max 10 MB</span>
                        </>
                    )}
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} disabled={uploading} />
                </div>
            )}

            {/* URL panel */}
            {tab === 'url' && (
                <div className="iuf-url-row">
                    <input
                        className="form-input"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        placeholder="https://res.cloudinary.com/…"
                    />
                    {value && (
                        <button type="button" className="btn-icon delete" title="Clear" onClick={() => onChange('')}>
                            <X size={13} />
                        </button>
                    )}
                </div>
            )}

            {/* Preview — always shown when a URL exists */}
            {value && (
                <div className="iuf-preview">
                    <img src={value} alt="preview" onError={e => { e.target.style.display = 'none'; }} />
                    <span className="iuf-preview-label">Current image</span>
                </div>
            )}
        </div>
    );
}
