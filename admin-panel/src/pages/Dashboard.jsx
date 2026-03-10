import React, { useEffect, useState, useContext } from 'react';
import { statsApi, bookingsApi, contactInquiriesApi } from '../api';
import { NavCtx } from '../App';
import { Dog, BookOpen, Mail, CalendarCheck, Users, ShoppingBag, TrendingUp, AlertCircle } from 'lucide-react';

function StatCard({ icon: Icon, label, value, pending, color, onClick }) {
    return (
        <div className="stat-card" style={{ cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
            <div className={`stat-icon ${color}`}><Icon size={20} /></div>
            <div className="stat-info">
                <h3>{value ?? '—'}</h3>
                <p>{label}</p>
                {pending > 0 && <span className="stat-badge pending">{pending} pending</span>}
            </div>
        </div>
    );
}

export default function Dashboard() {
    const nav = useContext(NavCtx);
    const [stats, setStats] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([statsApi.get(), bookingsApi.list(), contactInquiriesApi.list()])
            .then(([s, b, c]) => {
                setStats(s);
                setBookings(Array.isArray(b) ? b.slice(0, 6) : []);
                setContacts(Array.isArray(c) ? c.slice(0, 6) : []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const STATUS_BADGE = { Pending: 'amber', Confirmed: 'green', Completed: 'blue', Cancelled: 'red' };

    return (
        <div>
            <div className="page-header">
                <h1>Dashboard</h1>
                <p>Welcome back! Here's what's happening at SS Dog Kennels.</p>
            </div>

            {loading ? (
                <div className="loading-center">Loading stats…</div>
            ) : (
                <div className="stats-grid">
                    <StatCard icon={Dog} label="Total Puppies" value={stats?.puppies} color="forest" onClick={() => nav('puppies')} />
                    <StatCard icon={BookOpen} label="Total Bookings" value={stats?.bookings} pending={stats?.pending_bookings} color="blue" onClick={() => nav('bookings')} />
                    <StatCard icon={Mail} label="Contact Inquiries" value={stats?.contact_inquiries} color="champagne" onClick={() => nav('contact')} />
                    <StatCard icon={ShoppingBag} label="Puppy Inquiries" value={stats?.puppy_inquiries} color="amber" onClick={() => nav('puppy-inquiries')} />
                    <StatCard icon={CalendarCheck} label="Stud Requests" value={stats?.stud_requests} pending={stats?.pending_stud_requests} color="green" onClick={() => nav('stud-bookings')} />
                    <StatCard icon={Users} label="Registered Users" value={stats?.users} color="forest" onClick={() => nav('users')} />
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* Recent Bookings */}
                <div className="card">
                    <div className="card-header">
                        <h2>Recent Bookings</h2>
                        <button className="btn btn-ghost btn-sm" onClick={() => nav('bookings')}>View all</button>
                    </div>
                    <div className="table-wrap">
                        <table>
                            <thead><tr><th>Customer</th><th>Service</th><th>Date</th><th>Status</th></tr></thead>
                            <tbody>
                                {bookings.length === 0
                                    ? <tr className="empty-row"><td colSpan={4}>No bookings yet</td></tr>
                                    : bookings.map(b => (
                                        <tr key={b.id}>
                                            <td>{b.user_name}</td>
                                            <td style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.service_name}</td>
                                            <td>{b.booking_date}</td>
                                            <td><span className={`badge badge-${STATUS_BADGE[b.status] || 'gray'}`}>{b.status}</span></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Contact Inquiries */}
                <div className="card">
                    <div className="card-header">
                        <h2>Recent Inquiries</h2>
                        <button className="btn btn-ghost btn-sm" onClick={() => nav('contact')}>View all</button>
                    </div>
                    <div className="table-wrap">
                        <table>
                            <thead><tr><th>Name</th><th>Subject</th><th>Date</th></tr></thead>
                            <tbody>
                                {contacts.length === 0
                                    ? <tr className="empty-row"><td colSpan={3}>No inquiries yet</td></tr>
                                    : contacts.map(c => (
                                        <tr key={c.id}>
                                            <td>{c.name}</td>
                                            <td><span className="badge badge-forest">{c.subject}</span></td>
                                            <td style={{ color: 'var(--gray-400)', fontSize: '0.78rem' }}>{c.created_at?.slice(0, 10)}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
