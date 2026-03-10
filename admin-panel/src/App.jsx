import React, { useState, useCallback, useEffect } from 'react';
import { Menu } from 'lucide-react';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import PuppiesPage from './pages/PuppiesPage';
import StudDogsPage from './pages/StudDogsPage';
import StudBookingsPage from './pages/StudBookingsPage';
import ServicesPage from './pages/ServicesPage';
import BookingsPage from './pages/BookingsPage';
import UsersPage from './pages/UsersPage';
import TestimonialsPage from './pages/TestimonialsPage';
import HighlightsPage from './pages/HighlightsPage';
import FacilitiesPage from './pages/FacilitiesPage';
import FAQsPage from './pages/FAQsPage';
import KennelDetailPage from './pages/KennelDetailPage';
import ContactPage from './pages/ContactPage';
import PuppyInquiriesPage from './pages/PuppyInquiriesPage';
import Sidebar from './components/Sidebar';
import ToastContainer from './components/Toast';

export const ToastCtx = React.createContext(null);
export const NavCtx = React.createContext(null);

const PAGES = {
    dashboard: <Dashboard />,
    puppies: <PuppiesPage />,
    'stud-dogs': <StudDogsPage />,
    'stud-bookings': <StudBookingsPage />,
    services: <ServicesPage />,
    bookings: <BookingsPage />,
    users: <UsersPage />,
    testimonials: <TestimonialsPage />,
    highlights: <HighlightsPage />,
    facilities: <FacilitiesPage />,
    faqs: <FAQsPage />,
    'kennel-detail': <KennelDetailPage />,
    contact: <ContactPage />,
    'puppy-inquiries': <PuppyInquiriesPage />,
};

const PAGE_TITLES = {
    dashboard: 'Dashboard',
    puppies: 'Puppies',
    'stud-dogs': 'Stud Dogs',
    'stud-bookings': 'Stud Booking Requests',
    services: 'Services',
    bookings: 'Bookings',
    users: 'Registered Users',
    testimonials: 'Testimonials',
    highlights: 'Service Highlights',
    facilities: 'Facilities',
    faqs: 'FAQs',
    'kennel-detail': 'Kennel Details',
    contact: 'Contact Inquiries',
    'puppy-inquiries': 'Puppy Inquiries',
};

export default function App() {
    const [authed, setAuthed] = useState(() => localStorage.getItem('admin_authed') === '1');
    const [page, setPage] = useState('dashboard');
    const [toasts, setToasts] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toast = useCallback((msg, type = 'success') => {
        const id = Date.now();
        setToasts(t => [...t, { id, msg, type }]);
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
    }, []);

    const dismissToast = (id) => setToasts(t => t.filter(x => x.id !== id));

    const handleLogin = () => {
        localStorage.setItem('admin_authed', '1');
        setAuthed(true);
    };
    const handleLogout = () => {
        localStorage.removeItem('admin_authed');
        setAuthed(false);
    };

    if (!authed) return (
        <ToastCtx.Provider value={toast}>
            <LoginPage onLogin={handleLogin} />
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </ToastCtx.Provider>
    );

    return (
        <ToastCtx.Provider value={toast}>
            <NavCtx.Provider value={setPage}>
                <div className="admin-layout">
                    {/* Dark overlay when sidebar is open on mobile */}
                    <div
                        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
                        onClick={() => setSidebarOpen(false)}
                    />

                    <Sidebar
                        active={page}
                        onNav={(k) => { setPage(k); setSidebarOpen(false); }}
                        onLogout={handleLogout}
                        isOpen={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                    />
                    <div className="admin-main">
                        <header className="admin-topbar">
                            <div className="topbar-left">
                                <button
                                    className="menu-btn"
                                    onClick={() => setSidebarOpen(true)}
                                    aria-label="Toggle Menu"
                                >
                                    <Menu size={20} />
                                </button>
                                <span className="topbar-title">🐾 {PAGE_TITLES[page] || 'Admin'}</span>
                            </div>
                            <div className="topbar-right">
                                <div className="topbar-avatar">A</div>
                            </div>
                        </header>
                        <div className="admin-content">
                            {PAGES[page] || <Dashboard />}
                        </div>
                    </div>
                </div>
                <ToastContainer toasts={toasts} onDismiss={dismissToast} />
            </NavCtx.Provider>
        </ToastCtx.Provider>
    );
}
