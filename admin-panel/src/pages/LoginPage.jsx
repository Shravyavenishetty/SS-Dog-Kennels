import React, { useState } from 'react';
import { Lock, Eye, EyeOff, PawPrint } from 'lucide-react';

const ADMIN_PASS = 'admin123';

export default function LoginPage({ onLogin }) {
    const [pass, setPass] = useState('');
    const [show, setShow] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            if (pass === ADMIN_PASS) {
                onLogin();
            } else {
                setError('Incorrect passphrase. Please try again.');
                setLoading(false);
            }
        }, 400);
    };

    return (
        <div className="login-page">
            <div className="login-left">
                <div className="login-paws">🐾</div>
                <h1>Sangas Dog Kennels</h1>
                <p>Premium kennel management system<br />for India's finest dog breeders</p>

                <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {[
                        ['🐕', 'Manage Puppies & Stud Dogs'],
                        ['📅', 'Track Bookings & Requests'],
                        ['✍️', 'Edit Website Content'],
                        ['💬', 'View Customer Inquiries'],
                    ].map(([ic, txt]) => (
                        <div key={txt} style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,.75)', fontSize: '0.875rem' }}>
                            <span style={{ fontSize: '1.2rem' }}>{ic}</span> {txt}
                        </div>
                    ))}
                </div>
            </div>

            <div className="login-right">
                <div className="login-form-container">
                    <h2>Welcome Back</h2>
                    <p>Enter your admin passphrase to access the dashboard</p>
                    <form className="login-form" onSubmit={handleSubmit}>
                        {error && <div className="login-error">{error}</div>}
                        <div>
                            <label className="login-form-label">Admin Passphrase</label>
                            <div style={{ position: 'relative', marginTop: 5 }}>
                                <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', lineHeight: 0 }}>
                                    <Lock size={16} />
                                </div>
                                <input
                                    type={show ? 'text' : 'password'}
                                    value={pass}
                                    onChange={e => { setPass(e.target.value); setError(''); }}
                                    placeholder="Enter passphrase"
                                    className="form-input"
                                    style={{ paddingLeft: 38, paddingRight: 38 }}
                                    required
                                />
                                <button type="button" onClick={() => setShow(s => !s)}
                                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', lineHeight: 0 }}>
                                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <button type="submit" className="btn-login" disabled={loading}>
                            {loading ? 'Verifying…' : '🔐 Access Dashboard'}
                        </button>
                    </form>
                    <p style={{ marginTop: 24, fontSize: '0.75rem', color: 'var(--gray-400)', textAlign: 'center' }}>
                        Sangas Dog Kennels Admin — Internal Use Only
                    </p>
                </div>
            </div>
        </div>
    );
}
