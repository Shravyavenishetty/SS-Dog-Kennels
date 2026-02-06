import React from 'react';
import { Calendar, User, Heart, Settings, LogOut, Download } from 'lucide-react';

const ProfilePage = () => {
    return (
        <div className="fixed-layout py-16 px-10 flex space-x-12">
            {/* Sidebar */}
            <aside className="w-[300px] shrink-0">
                <div className="bg-white rounded-24 p-10 border border-forest-green/10 shadow-xl">
                    <div className="flex flex-col items-center mb-10 text-center">
                        <div className="w-24 h-24 bg-forest-green rounded-full mb-6 border-4 border-champagne-gold/20 relative">
                            <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover rounded-full" />
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-champagne-gold rounded-full flex items-center justify-center text-forest-green">
                                <Settings size={12} />
                            </div>
                        </div>
                        <h2 className="font-playfair text-2xl text-forest-green">Ganesh Hegde</h2>
                        <p className="font-inter text-xs text-forest-green/40 uppercase tracking-widest mt-1">Customer Since 2025</p>
                    </div>

                    <nav className="space-y-4">
                        {[
                            { icon: Calendar, label: 'Current Bookings', active: true },
                            { icon: Heart, label: 'Saved Dogs' },
                            { icon: User, label: 'My Info' },
                            { icon: Settings, label: 'Security' },
                        ].map((item, i) => (
                            <button key={i} className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${item.active ? 'bg-forest-green text-champagne-gold shadow-lg' : 'text-forest-green/60 hover:bg-forest-green/5'}`}>
                                <div className="flex items-center space-x-4">
                                    <item.icon size={18} />
                                    <span className="font-inter text-sm font-medium">{item.label}</span>
                                </div>
                                {item.active && <div className="w-1.5 h-1.5 bg-champagne-gold rounded-full"></div>}
                            </button>
                        ))}
                        <button className="w-full flex items-center space-x-4 p-4 text-red-400 hover:bg-red-50 rounded-xl transition-all mt-10">
                            <LogOut size={18} />
                            <span className="font-inter text-sm font-medium">Log out</span>
                        </button>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <section className="flex-1 space-y-12">
                <div>
                    <h1 className="font-playfair text-4xl text-forest-green mb-8">Account Summary</h1>
                    <div className="grid grid-cols-3 gap-6">
                        {[
                            { label: 'Total Bookings', value: '02' },
                            { icon: Heart, label: 'Saved Dogs', value: '14' },
                            { label: 'Customer Level', value: 'Gold Level' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-8 rounded-24 border border-forest-green/10 shadow-sm hover:shadow-md transition-shadow">
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
            </section>
        </div>
    );
};

export default ProfilePage;
