import React, { useState } from 'react';
import { Calendar, User, Heart, Settings, LogOut, Download, Mail, Phone, MapPin, Shield, Key, ShoppingBag } from 'lucide-react';

const ProfilePage = ({ onPageChange, wishlistCount, cartCount, onLogout }) => {
    const [activeTab, setActiveTab] = useState('summary');
    const [updating, setUpdating] = useState(false);

    const handleUpdate = () => {
        setUpdating(true);
        setTimeout(() => setUpdating(false), 2000);
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

    const renderContent = () => {
        switch (activeTab) {
            case 'info':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="font-playfair text-4xl text-forest-green">Basic Information</h1>
                            {updating && (
                                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse">
                                    Changes Saved Successfully
                                </span>
                            )}
                        </div>
                        <div className="bg-white p-10 rounded-32 border border-forest-green/10 shadow-sm max-w-2xl">
                            <div className="grid grid-cols-2 gap-8 mb-10">
                                <div className="space-y-2">
                                    <label className="font-inter text-[10px] uppercase tracking-widest text-forest-green/40 font-bold ml-1">First Name</label>
                                    <input type="text" defaultValue="Ganesh" className="w-full flex items-center space-x-3 p-4 bg-ivory rounded-xl border border-forest-green/5 font-inter text-sm text-forest-green/80 focus:ring-2 focus:ring-forest-green/20 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-inter text-[10px] uppercase tracking-widest text-forest-green/40 font-bold ml-1">Last Name</label>
                                    <input type="text" defaultValue="Hegde" className="w-full flex items-center space-x-3 p-4 bg-ivory rounded-xl border border-forest-green/5 font-inter text-sm text-forest-green/80 focus:ring-2 focus:ring-forest-green/20 outline-none" />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="font-inter text-[10px] uppercase tracking-widest text-forest-green/40 font-bold ml-1">Email Address</label>
                                    <input type="email" defaultValue="ganesh.hegde@example.com" className="w-full flex items-center space-x-3 p-4 bg-ivory rounded-xl border border-forest-green/5 font-inter text-sm text-forest-green/80 focus:ring-2 focus:ring-forest-green/20 outline-none" />
                                </div>
                            </div>
                            <button
                                onClick={handleUpdate}
                                disabled={updating}
                                className="w-full py-4 bg-forest-green text-champagne-gold rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-forest-green/90 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                            >
                                {updating ? 'Saving...' : 'Update Information'}
                            </button>
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h1 className="font-playfair text-4xl text-forest-green mb-8">Account Security</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-10 rounded-32 border border-forest-green/10 shadow-sm">
                                <div className="w-12 h-12 bg-forest-green/5 rounded-full flex items-center justify-center mb-6">
                                    <Key size={24} className="text-forest-green" />
                                </div>
                                <h3 className="font-playfair text-2xl text-forest-green mb-4">Update Password</h3>
                                <p className="font-inter text-sm text-forest-green/60 mb-8 leading-relaxed">Ensure your account is using a long, random password to stay secure.</p>
                                <button
                                    onClick={handleUpdate}
                                    disabled={updating}
                                    className="w-full py-4 border border-forest-green/20 text-forest-green rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-forest-green/5 transition-all disabled:opacity-50"
                                >
                                    {updating ? 'Processing...' : 'Change Password'}
                                </button>
                            </div>
                            <div className="bg-white p-10 rounded-32 border border-forest-green/10 shadow-sm">
                                <div className="w-12 h-12 bg-forest-green/5 rounded-full flex items-center justify-center mb-6">
                                    <Shield size={24} className="text-forest-green" />
                                </div>
                                <h3 className="font-playfair text-2xl text-forest-green mb-4">Two-Factor Auth</h3>
                                <p className="font-inter text-sm text-forest-green/60 mb-8 leading-relaxed">Add an extra layer of security to your account with 2FA.</p>
                                <button
                                    onClick={handleUpdate}
                                    disabled={updating}
                                    className="w-full py-4 bg-forest-green/10 text-forest-green rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-forest-green/20 transition-all disabled:opacity-50"
                                >
                                    {updating ? 'Enabling...' : 'Enable Security'}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <h1 className="font-playfair text-4xl text-forest-green mb-8">Account Summary</h1>
                            <div className="grid grid-cols-3 gap-6">
                                {[
                                    { label: 'Total Bookings', value: '00', id: 'summary' },
                                    { label: 'Saved Dogs', value: wishlistCount.toString().padStart(2, '0'), id: 'wishlist' },
                                    { label: 'Items in Cart', value: cartCount.toString().padStart(2, '0'), id: 'cart' },
                                ].map((stat, i) => (
                                    <div
                                        key={i}
                                        onClick={() => stat.id === 'summary' ? setActiveTab('summary') : onPageChange(stat.id)}
                                        className="bg-white p-8 rounded-24 border border-forest-green/10 shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-1"
                                    >
                                        <p className="font-inter text-[10px] uppercase tracking-[0.2em] text-forest-green/40 mb-2">{stat.label}</p>
                                        <div className="font-playfair text-4xl text-forest-green">{stat.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="font-playfair text-2xl text-forest-green">Next Appointments</h3>
                                <button className="text-xs font-bold text-forest-green/40 hover:text-forest-green uppercase tracking-widest">See History</button>
                            </div>

                            <div className="space-y-4">
                                {[1, 2].map(i => (
                                    <div key={i} className="bg-white p-8 rounded-24 border border-forest-green/10 flex items-center justify-between group hover:border-forest-green/40 transition-colors">
                                        <div className="flex items-center space-x-8">
                                            <div className="w-20 h-20 bg-forest-green/5 rounded-xl flex flex-col items-center justify-center">
                                                <span className="font-inter text-[10px] uppercase font-bold text-forest-green/40">March</span>
                                                <span className="font-playfair text-3xl text-forest-green leading-none">15</span>
                                            </div>
                                            <div>
                                                <h4 className="font-playfair text-xl text-forest-green mb-1">Elite Grooming</h4>
                                                <p className="font-inter text-sm text-forest-green/40">Order ID: #NS-928{i}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-6">
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-forest-green tracking-widest uppercase">Confirmed</div>
                                                <div className="text-xs text-forest-green/40">09:00 AM @ Beverly Hills</div>
                                            </div>
                                            <button className="w-12 h-12 border border-forest-green/10 rounded-full flex items-center justify-center text-forest-green hover:bg-forest-green hover:text-white transition-all">
                                                <Download size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="fixed-layout py-16 px-10 flex space-x-12 min-h-[800px]">
            {/* Sidebar */}
            <aside className="w-[300px] shrink-0">
                <div className="bg-white rounded-24 p-10 border border-forest-green/10 shadow-xl sticky top-32">
                    <div className="flex flex-col items-center mb-10 text-center border-b border-forest-green/5 pb-10">
                        <div className="w-24 h-24 bg-forest-green rounded-full mb-6 border-4 border-champagne-gold/20 relative group overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Profile" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                <Settings size={20} className="text-white" />
                            </div>
                        </div>
                        <h2 className="font-playfair text-2xl text-forest-green">Ganesh Hegde</h2>
                        <p className="font-inter text-xs text-forest-green/40 uppercase tracking-widest mt-1">Customer Since 2025</p>
                    </div>

                    <nav className="space-y-2 mb-10 pb-10 border-b border-forest-green/5">
                        <span className="font-inter text-[10px] uppercase font-bold text-forest-green/20 tracking-widest ml-4 block mb-4">Account</span>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${activeTab === tab.id ? 'bg-forest-green text-champagne-gold shadow-lg translate-x-2' : 'text-forest-green/60 hover:bg-forest-green/5'}`}
                            >
                                <div className="flex items-center space-x-4">
                                    <tab.icon size={18} />
                                    <span className="font-inter text-sm font-medium">{tab.label}</span>
                                </div>
                                {activeTab === tab.id && <div className="w-1.5 h-1.5 bg-champagne-gold rounded-full"></div>}
                            </button>
                        ))}
                    </nav>

                    <nav className="space-y-2">
                        <span className="font-inter text-[10px] uppercase font-bold text-forest-green/20 tracking-widest ml-4 block mb-4">Jump To</span>
                        {externalLinks.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => onPageChange(link.id)}
                                className="w-full flex items-center justify-between p-4 rounded-xl text-forest-green/60 hover:bg-forest-green/5 transition-all"
                            >
                                <div className="flex items-center space-x-4">
                                    <link.icon size={18} />
                                    <span className="font-inter text-sm font-medium">{link.label}</span>
                                </div>
                                {link.count > 0 && <span className="bg-forest-green/10 text-forest-green text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold tracking-tight">{link.count}</span>}
                            </button>
                        ))}

                        <button
                            onClick={onLogout}
                            className="w-full flex items-center space-x-4 p-4 text-red-400 hover:bg-red-50 rounded-xl transition-all mt-6 group"
                        >
                            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-inter text-sm font-medium">Log out</span>
                        </button>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <section className="flex-1">
                {renderContent()}
            </section>
        </div>
    );
};

export default ProfilePage;
