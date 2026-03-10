import React, { useState, useRef } from 'react';
import { Upload, Link, X } from 'lucide-react';

const BASE = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/+$/, '');

/**
 * VideoUploadField — replaces plain URL inputs with a file-upload widget.
 *
 * Props:
 *   value              – current video URL (controlled)
 *   onChange           – called with the new URL string (every change)
 *   onUploadComplete   – optional: called with URL only after a successful file upload
 *   label              – field label text
 *   folder             – Cloudinary folder for the upload (default: "admin-uploads")
 *   onError            – optional (msg: string) => void for error reporting
 */
export default function VideoUploadField({ value = '', onChange, onUploadComplete, label = 'Video', folder = 'admin-uploads', onError }) {
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
                    <Upload size={11} /> Upload Video
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
                            <span className="iuf-hint">Uploading to Cloudinary (this may take a minute)…</span>
                        </>
                    ) : (
                        <>
                            <Upload size={24} strokeWidth={1.5} className="iuf-icon" />
                            <span className="iuf-hint">Click to select a video</span>
                            <span className="iuf-sub">MP4 · WEBM · MOV</span>
                        </>
                    )}
                    <input ref={fileRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={handleFile} disabled={uploading} />
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
                    <video src={value} controls style={{ width: '100%', maxHeight: '160px', borderRadius: '4px', objectFit: 'contain', backgroundColor: '#000' }} onError={e => { e.target.style.display = 'none'; }} />
                    <span className="iuf-preview-label">Current video</span>
                </div>
            )}
        </div>
    );
}
