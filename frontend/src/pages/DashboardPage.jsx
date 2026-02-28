import React, { useState, useEffect } from 'react';
import { Calendar, User, Heart, Settings, LogOut, Download, Mail, Phone, MapPin, Shield, Key, ShoppingBag, Loader2 } from 'lucide-react';
import { fetchUserProfile, fetchUserBookings, updateUserProfile } from '../lib/api';

const ProfilePage = ({ onPageChange, wishlistCount, cartCount, onLogout, userPhone }) => {
    const [activeTab, setActiveTab] = useState('summary');
    const [updating, setUpdating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [editData, setEditData] = useState({ firstName: '', lastName: '', email: '' });

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [p, b] = await Promise.all([
                    fetchUserProfile(userPhone),
                    fetchUserBookings(userPhone)
                ]);
                setProfile(p);
                setBookings(b);
                setEditData({
                    firstName: p.firstName,
                    lastName: p.lastName,
                    email: p.email || ''
                });
            } catch (error) {
                console.error("Error loading dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        if (userPhone) loadData();
    }, [userPhone]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await updateUserProfile(userPhone, editData);
            setProfile(prev => ({ ...prev, ...editData }));
            setTimeout(() => setUpdating(false), 2000);
        } catch (error) {
            console.error("Update failed:", error);
            setUpdating(false);
        }
    };

    const tabs = [
        { id: 'summary', icon: Calendar, label: 'Upcoming Visits' },
        { id: 'info', icon: User, label: 'Basic Information' },
        { id: 'security', icon: Settings, label: 'Account Security' },
    ];

    const externalLinks = [
        { id: 'wishlist', icon: Heart, label: 'My Saved Dogs', count: wishlistCount },
        { id: 'cart', icon: ShoppingBag, label: 'My Shopping Cart', count: cartCount },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-ivory">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="w-12 h-12 text-forest-green animate-spin" />
                    <p className="font-playfair text-xl text-forest-green">Bringing your records...</p>
                </div>
            </div>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'info':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8">
                            <h1 className="font-playfair text-2xl lg:text-4xl text-forest-green mb-2 lg:mb-0">Basic Information</h1>
                            {updating && (
                                <span className="w-fit bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-tight animate-pulse">
                                    Changes Saved
                                </span>
                            )}
                        </div>
                        <div className="lg:bg-white lg:p-10 lg:rounded-32 lg:border lg:border-forest-green/10 lg:shadow-sm max-w-2xl">
                            <form onSubmit={handleUpdate} className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 mb-8 lg:mb-10">
                                <div className="space-y-1.5 lg:space-y-2">
                                    <label className="font-inter text-xs uppercase tracking-wider text-forest-green/40 font-bold ml-1">First Name</label>
                                    <input
                                        type="text"
                                        value={editData.firstName}
                                        onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                                        className="w-full p-4 bg-white lg:bg-ivory rounded-xl border border-forest-green/10 lg:border-forest-green/5 font-inter text-sm text-forest-green/80 focus:ring-2 focus:ring-forest-green/20 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5 lg:space-y-2">
                                    <label className="font-inter text-xs uppercase tracking-wider text-forest-green/40 font-bold ml-1">Last Name</label>
                                    <input
                                        type="text"
                                        value={editData.lastName}
                                        onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                                        className="w-full p-4 bg-white lg:bg-ivory rounded-xl border border-forest-green/10 lg:border-forest-green/5 font-inter text-sm text-forest-green/80 focus:ring-2 focus:ring-forest-green/20 outline-none transition-all"
                                    />
                                </div>
                                <div className="sm:col-span-2 space-y-1.5 lg:space-y-2">
                                    <label className="font-inter text-xs uppercase tracking-wider text-forest-green/40 font-bold ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={editData.email}
                                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                        className="w-full p-4 bg-white lg:bg-ivory rounded-xl border border-forest-green/10 lg:border-forest-green/5 font-inter text-sm text-forest-green/80 focus:ring-2 focus:ring-forest-green/20 outline-none transition-all"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <button
                                        type="submit"
                                        disabled={updating}
                                        className="w-full py-5 lg:py-4 bg-forest-green text-champagne-gold rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-forest-green/90 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                                    >
                                        {updating ? 'Saving...' : 'Update Information'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h1 className="font-playfair text-2xl lg:text-4xl text-forest-green mb-8">Account Security</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                            <div className="lg:bg-white p-0 lg:p-10 lg:rounded-32 lg:border lg:border-forest-green/10 lg:shadow-sm">
                                <div className="w-12 h-12 bg-forest-green/5 rounded-full flex items-center justify-center mb-6 hidden lg:flex">
                                    <Key size={24} className="text-forest-green" />
                                </div>
                                <h3 className="font-playfair text-xl lg:text-2xl text-forest-green mb-2 lg:mb-4">Update Password</h3>
                                <p className="font-inter text-sm text-forest-green/60 mb-6 lg:mb-8 leading-relaxed">Ensure your account is using a long, random password to stay secure.</p>
                                <button
                                    onClick={() => { }}
                                    disabled={updating}
                                    className="w-full py-4 bg-white lg:bg-transparent border border-forest-green/20 text-forest-green rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-forest-green/5 transition-all disabled:opacity-50"
                                >
                                    Change Password
                                </button>
                            </div>
                            <div className="lg:bg-white p-0 lg:p-10 lg:rounded-32 lg:border lg:border-forest-green/10 lg:shadow-sm mt-8 lg:mt-0 pt-8 lg:pt-10 border-t lg:border-t-0 border-forest-green/5">
                                <div className="w-12 h-12 bg-forest-green/5 rounded-full flex items-center justify-center mb-6 hidden lg:flex">
                                    <Shield size={24} className="text-forest-green" />
                                </div>
                                <h3 className="font-playfair text-xl lg:text-2xl text-forest-green mb-2 lg:mb-4">Two-Factor Auth</h3>
                                <p className="font-inter text-sm text-forest-green/60 mb-6 lg:mb-8 leading-relaxed">Add an extra layer of security to your account with 2FA.</p>
                                <button
                                    onClick={() => { }}
                                    disabled={updating}
                                    className="w-full py-4 bg-forest-green/10 text-forest-green rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-forest-green/20 transition-all disabled:opacity-50"
                                >
                                    Enable Security
                                </button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="space-y-10 lg:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <h1 className="font-playfair text-2xl lg:text-4xl text-forest-green mb-6 lg:mb-8">Account Summary</h1>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                                {[
                                    { label: 'Total Bookings', value: bookings.length.toString().padStart(2, '0'), id: 'summary', mobileHidden: true },
                                    { label: 'Saved Dogs', value: wishlistCount.toString().padStart(2, '0'), id: 'wishlist' },
                                    { label: 'Items in Cart', value: cartCount.toString().padStart(2, '0'), id: 'cart' },
                                ].map((stat, i) => (
                                    <div
                                        key={i}
                                        onClick={() => stat.id === 'summary' ? setActiveTab('summary') : onPageChange(stat.id)}
                                        className={`bg-white p-6 lg:p-8 rounded-24 border border-forest-green/10 shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-1 ${stat.mobileHidden ? 'hidden lg:block' : ''}`}
                                    >
                                        <p className="font-inter text-[11px] lg:text-[10px] uppercase tracking-wide lg:tracking-[0.2em] text-forest-green/40 mb-2 truncate">{stat.label}</p>
                                        <div className="font-playfair text-3xl lg:text-4xl text-forest-green">{stat.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-6 lg:mb-8">
                                <h3 className="font-playfair text-xl lg:text-2xl text-forest-green">Next Appointments</h3>
                                <button className="text-xs font-bold text-forest-green/40 hover:text-forest-green uppercase tracking-wider">See History</button>
                            </div>

                            <div className="space-y-4">
                                {bookings.length > 0 ? bookings.map((booking, idx) => (
                                    <div key={booking.id} className={`bg-white p-6 lg:p-8 rounded-24 border border-forest-green/10 flex flex-col sm:flex-row sm:items-center justify-between group hover:border-forest-green/40 transition-colors gap-4 lg:gap-6 ${idx > 1 ? 'hidden lg:flex' : ''}`}>
                                        <div className="flex items-center space-x-6 lg:space-x-8">
                                            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-forest-green/5 rounded-xl flex flex-col items-center justify-center shrink-0">
                                                <span className="font-inter text-[10px] lg:text-[10px] uppercase font-bold text-forest-green/40">
                                                    {new Date(booking.date).toLocaleString('default', { month: 'short' })}
                                                </span>
                                                <span className="font-playfair text-2xl lg:text-3xl text-forest-green leading-none">
                                                    {new Date(booking.date).getDate()}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="font-playfair text-lg lg:text-xl text-forest-green mb-1 truncate w-40 sm:w-auto">{booking.serviceName}</h4>
                                                <p className="font-inter text-sm lg:text-sm text-forest-green/40">Booking ID: #{booking.id.slice(-6).toUpperCase()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end space-x-6 lg:space-x-6">
                                            <div className="sm:text-right">
                                                <div className="text-xs lg:text-sm font-bold text-forest-green tracking-wider uppercase">{booking.status}</div>
                                                <div className="text-xs lg:text-xs text-forest-green/40">Elite Kennel Services</div>
                                            </div>
                                            <button className="w-10 h-10 lg:w-12 lg:h-12 border border-forest-green/10 rounded-full flex items-center justify-center text-forest-green hover:bg-forest-green hover:text-white transition-all shrink-0">
                                                <Download size={18} className="lg:w-[18px]" />
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="bg-white p-12 rounded-32 border border-forest-green/5 text-center">
                                        <Calendar className="w-12 h-12 text-forest-green/20 mx-auto mb-4" />
                                        <p className="font-playfair text-xl text-forest-green/40">No upcoming visits scheduled</p>
                                        <button
                                            onClick={() => onPageChange('services')}
                                            className="mt-4 text-forest-green font-bold text-xs uppercase tracking-widest hover:underline"
                                        >
                                            Book a Service
                                        </button>
                                    </div>
                                )}
                                {bookings.length > 2 && (
                                    <button className="lg:hidden w-full py-4 border border-forest-green/10 rounded-xl text-forest-green text-sm font-bold uppercase tracking-wider bg-white">
                                        View All History
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="fixed-layout py-6 lg:py-16 px-4 lg:px-10 min-h-screen">
            <div className="flex flex-col lg:flex-row lg:space-x-12">
                {/* Mobile Profile Header & Vertical-to-Horizontal Tabs */}
                <div className="lg:w-[300px] shrink-0 mb-8 lg:mb-0">
                    <div className="lg:hidden flex flex-col items-center mb-10 text-center">
                        <div className="w-24 h-24 bg-forest-green rounded-full mb-4 border-4 border-champagne-gold/20 relative group overflow-hidden shrink-0 shadow-lg">
                            <img src={`https://ui-avatars.com/api/?name=${profile?.firstName}+${profile?.lastName}&background=0D3B2E&color=D4AF37`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Profile" />
                        </div>
                        <h2 className="font-playfair text-2xl text-forest-green tracking-tight font-bold">{profile?.firstName} {profile?.lastName}</h2>
                        <p className="font-inter text-sm text-forest-green/60 mt-1">Customer since {new Date(profile?.createdAt).getFullYear()}</p>
                    </div>

                    <aside className="hidden lg:block sticky top-32">
                        <div className="bg-white rounded-24 p-10 border border-forest-green/10 shadow-xl">
                            <div className="flex flex-col items-center mb-10 text-center border-b border-forest-green/5 pb-10">
                                <div className="w-24 h-24 bg-forest-green rounded-full mb-6 border-4 border-champagne-gold/20 relative group overflow-hidden shrink-0">
                                    <img src={`https://ui-avatars.com/api/?name=${profile?.firstName}+${profile?.lastName}&background=0D3B2E&color=D4AF37`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Profile" />
                                </div>
                                <h2 className="font-playfair text-2xl text-forest-green">{profile?.firstName} {profile?.lastName}</h2>
                                <p className="font-inter text-[10px] text-forest-green/40 uppercase tracking-widest mt-1">Customer Since {new Date(profile?.createdAt).getFullYear()}</p>
                            </div>

                            <nav className="flex flex-col space-y-1 mb-10 pb-10 border-b border-forest-green/5">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-3 p-4 rounded-xl transition-all ${activeTab === tab.id ? 'bg-forest-green text-champagne-gold shadow-lg translate-x-2' : 'text-forest-green/60 hover:bg-forest-green/5'}`}
                                    >
                                        <tab.icon size={18} />
                                        <span className="font-inter text-sm font-medium">{tab.label}</span>
                                    </button>
                                ))}
                            </nav>

                            <nav className="flex flex-col space-y-1">
                                {externalLinks.map((link) => (
                                    <button
                                        key={link.id}
                                        onClick={() => onPageChange(link.id)}
                                        className="flex items-center justify-between p-4 rounded-xl text-forest-green/60 hover:bg-forest-green/5 transition-all text-left"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <link.icon size={18} />
                                            <span className="font-inter text-sm font-semibold">{link.label}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {link.count > 0 && <span className="bg-forest-green/10 text-forest-green text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{link.count}</span>}
                                        </div>
                                    </button>
                                ))}

                                <button
                                    onClick={onLogout}
                                    className="flex items-center space-x-3 p-4 text-red-500 hover:bg-red-50 rounded-xl transition-all mt-6 group"
                                >
                                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                                    <span className="font-inter text-sm font-semibold">Log out</span>
                                </button>
                            </nav>
                        </div>
                    </aside>

                    <nav className="lg:hidden flex space-x-2 overflow-x-auto scrollbar-hide pb-4 border-b border-forest-green/5 -mx-4 px-4 sticky top-[56px] bg-ivory z-30">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 px-5 py-3 rounded-full transition-all whitespace-nowrap text-sm font-bold tracking-tight ${activeTab === tab.id ? 'bg-forest-green text-champagne-gold shadow-md scale-105' : 'bg-white text-forest-green border border-forest-green/10'}`}
                            >
                                <tab.icon size={16} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <section className="flex-1 mt-6 lg:mt-0">
                    <div className="max-w-4xl mx-auto">
                        {renderContent()}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProfilePage;
