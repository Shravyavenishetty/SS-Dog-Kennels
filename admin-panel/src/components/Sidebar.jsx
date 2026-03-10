import React from 'react';
import {
    LayoutDashboard, Dog, Heart, CalendarCheck, Scissors, BookOpen,
    Users, MessageSquare, Star, Lightbulb, Building2, HelpCircle,
    Phone, Mail, LogOut, PawPrint, ShoppingBag
} from 'lucide-react';

const NAV = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Main' },
    { key: 'puppies', label: 'Puppies', icon: Dog, section: 'Catalog' },
    { key: 'stud-dogs', label: 'Stud Dogs', icon: PawPrint, section: 'Catalog' },
    { key: 'stud-bookings', label: 'Stud Requests', icon: CalendarCheck, section: 'Catalog' },
    { key: 'services', label: 'Services', icon: Scissors, section: 'Services' },
    { key: 'bookings', label: 'Bookings', icon: BookOpen, section: 'Services' },
    { key: 'users', label: 'Users', icon: Users, section: 'Users' },
    { key: 'testimonials', label: 'Testimonials', icon: Star, section: 'Content' },
    { key: 'highlights', label: 'Highlights', icon: Lightbulb, section: 'Content' },
    { key: 'facilities', label: 'Facilities', icon: Building2, section: 'Content' },
    { key: 'faqs', label: 'FAQs', icon: HelpCircle, section: 'Content' },
    { key: 'kennel-detail', label: 'Kennel Details', icon: Phone, section: 'Settings' },
    { key: 'contact', label: 'Contact Inquiries', icon: Mail, section: 'Inquiries' },
    { key: 'puppy-inquiries', label: 'Puppy Inquiries', icon: ShoppingBag, section: 'Inquiries' },
];

export default function Sidebar({ active, onNav, onLogout, isOpen, onClose }) {
    const sections = [...new Set(NAV.map(n => n.section))];

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-brand">
                <h2>🐾 SS Kennels</h2>
                <span>Admin Dashboard</span>
            </div>
            <nav className="sidebar-nav">
                {sections.map(section => (
                    <div key={section}>
                        <div className="nav-section-label">{section}</div>
                        {NAV.filter(n => n.section === section).map(({ key, label, icon: Icon }) => (
                            <div
                                key={key}
                                className={`nav-item${active === key ? ' active' : ''}`}
                                onClick={() => onNav(key)}
                            >
                                <Icon size={16} />
                                {label}
                            </div>
                        ))}
                    </div>
                ))}
            </nav>
            <div className="sidebar-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Admin Panel v1.0</span>
                <button
                    onClick={onLogout}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                    title="Logout"
                >
                    <LogOut size={14} />
                </button>
            </div>
        </aside>
    );
}
