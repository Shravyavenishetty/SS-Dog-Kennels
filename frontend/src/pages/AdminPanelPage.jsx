import React from 'react';
import { Plus, Search, Edit2, Trash2, ExternalLink, Filter } from 'lucide-react';

const AdminPanelPage = () => {
    return (
        <div className="fixed-layout py-16 px-10">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="font-playfair text-4xl text-forest-green">Breeder Control Center</h1>
                    <p className="font-inter text-sm text-forest-green/40 mt-1">Manage dogs, bookings, and customers from here.</p>
                </div>
                <button className="px-8 py-4 bg-forest-green text-white font-bold uppercase tracking-widest text-[10px] rounded-lg flex items-center space-x-2 shadow-xl hover:scale-105 transition-transform">
                    <Plus size={16} />
                    <span>Add New Entry</span>
                </button>
            </div>

            <div className="grid grid-cols-12 gap-10">
                {/* Sidebar Mini-Dash */}
                <div className="col-span-3 space-y-6">
                    <div className="bg-forest-green p-8 rounded-24 text-white">
                        <div className="text-[10px] uppercase font-bold opacity-60 mb-1">New Bookings</div>
                        <div className="text-4xl font-playfair mb-6">14</div>
                        <div className="text-[10px] uppercase font-bold opacity-60 mb-1">Total Sales (Month)</div>
                        <div className="text-4xl font-playfair">₹84.5L</div>
                    </div>

                    <div className="bg-white p-6 rounded-24 border border-forest-green/10">
                        <h4 className="text-xs font-bold text-forest-green/40 uppercase mb-4 tracking-widest px-2">Settings</h4>
                        <nav className="space-y-1">
                            {['Puppies', 'Stud Dogs', 'Bookings', 'Customers', 'Health Lab'].map((mod, i) => (
                                <button key={mod} className={`w-full text-left p-4 rounded-xl text-sm font-medium ${i === 0 ? 'bg-forest-green/5 text-forest-green border border-forest-green/10' : 'text-forest-green/40'}`}>
                                    {mod}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Table Content */}
                <div className="col-span-9">
                    <div className="bg-white rounded-24 border border-forest-green/10 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-forest-green/10 flex justify-between items-center">
                            <div className="flex items-center bg-forest-green/5 rounded-lg px-4 py-2 w-96">
                                <Search size={16} className="text-forest-green/40 mr-3" />
                                <input type="text" placeholder="Search dogs or names..." className="bg-transparent border-none text-sm focus:outline-none w-full" />
                            </div>
                            <div className="flex space-x-3">
                                <button className="p-2 border border-forest-green/10 rounded-lg text-forest-green/60 hover:bg-forest-green/5"><Filter size={18} /></button>
                                <button className="px-4 py-2 border border-forest-green/10 rounded-lg text-xs font-bold text-forest-green/60">Export File</button>
                            </div>
                        </div>

                        <table className="w-full text-left font-inter text-sm">
                            <thead className="bg-forest-green/5 text-forest-green/40 text-[10px] uppercase font-bold tracking-[0.2em]">
                                <tr>
                                    <th className="px-8 py-4">ID</th>
                                    <th className="px-8 py-4">Breed</th>
                                    <th className="px-8 py-4">Birth Date</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4">Price</th>
                                    <th className="px-8 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-forest-green/10">
                                {[
                                    { id: '#NS-084', breed: 'Caucasian Shepherd', dob: 'Jan 12, 2026', stage: 'Available', price: '₹4.5L' },
                                    { id: '#NS-092', breed: 'Tibetan Mastiff', dob: 'Dec 08, 2025', stage: 'Sold Out', price: '₹12.0L' },
                                    { id: '#NS-104', breed: 'French Bulldog', dob: 'Feb 01, 2026', stage: 'Available', price: '₹2.8L' },
                                    { id: '#NS-112', breed: 'Alaskan Malamute', dob: 'Jan 28, 2026', stage: 'Available', price: '₹3.5L' },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-forest-green/5 transition-colors text-forest-green">
                                        <td className="px-8 py-6 font-bold">{row.id}</td>
                                        <td className="px-8 py-6 font-playfair text-lg">{row.breed}</td>
                                        <td className="px-8 py-6 opacity-60">{row.dob}</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${row.stage === 'Sold Out' ? 'bg-forest-green text-white' : 'bg-forest-green/10'}`}>{row.stage}</span>
                                        </td>
                                        <td className="px-8 py-6 font-playfair">{row.price}</td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-center space-x-4">
                                                <button className="text-forest-green/40 hover:text-forest-green"><Edit2 size={16} /></button>
                                                <button className="text-forest-green/40 hover:text-forest-green"><ExternalLink size={16} /></button>
                                                <button className="text-red-300 hover:text-red-500"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="p-8 border-t border-forest-green/10 flex justify-between items-center text-xs text-forest-green/40">
                            <div>Showing 1 - 4 of 24 dogs</div>
                            <div className="flex space-x-2">
                                <button className="px-4 py-2 border border-forest-green/10 rounded-lg">Back</button>
                                <button className="px-4 py-2 bg-forest-green text-white rounded-lg">Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanelPage;
