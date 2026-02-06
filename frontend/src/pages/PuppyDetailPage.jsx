import React from 'react';
import { ShieldCheck, Heart, Download } from 'lucide-react';

const PuppyDetailPage = () => {
    return (
        <div className="fixed-layout py-16 px-10">
            <div className="flex space-x-12 mb-20">
                {/* Left: Photos */}
                <div className="w-[700px] shrink-0">
                    <div className="aspect-[4/5] bg-forest-green/5 rounded-24 overflow-hidden mb-6 relative group">
                        <img
                            src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=1000"
                            className="w-full h-full object-cover"
                            alt="Caucasian Shepherd"
                        />
                        <button className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center text-forest-green shadow-xl">
                            <Heart size={24} />
                        </button>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-forest-green/20 backdrop-blur-sm cursor-zoom-in">
                            <span className="font-playfair text-xl text-white underline">Click to Zoom</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-5 gap-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="aspect-square bg-forest-green/5 rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-forest-green transition-all">
                                <img src={`https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=200&sig=${i}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Details */}
                <div className="flex-1 pt-4">
                    <div className="flex items-center space-x-3 mb-6">
                        <span className="px-3 py-1 bg-forest-green text-champagne-gold text-[10px] font-bold uppercase tracking-widest rounded-full">
                            Top Quality Dog
                        </span>
                        <span className="text-forest-green/40 text-sm font-inter">ID: NS-2026-084</span>
                    </div>

                    <h1 className="font-playfair text-6xl text-forest-green mb-4">Caucasian <br />Shepherd</h1>
                    <p className="font-playfair text-3xl text-forest-green/80 mb-8 italic">Strong & Loyal Guardian</p>

                    <div className="text-4xl text-forest-green font-playfair mb-10">₹4,50,000</div>

                    <div className="space-y-6 mb-12">
                        <div className="flex items-center justify-between py-4 border-b border-forest-green/10">
                            <span className="font-inter text-sm text-forest-green/60 uppercase tracking-widest">How Old</span>
                            <span className="font-inter font-bold text-forest-green">8 Weeks Old</span>
                        </div>
                        <div className="flex items-center justify-between py-4 border-b border-forest-green/10">
                            <span className="font-inter text-sm text-forest-green/60 uppercase tracking-widest">Behavior</span>
                            <span className="font-inter font-bold text-forest-green">Calm & Protective</span>
                        </div>
                        <div className="flex items-center justify-between py-4 border-b border-forest-green/10">
                            <span className="font-inter text-sm text-forest-green/60 uppercase tracking-widest">Health Check</span>
                            <span className="font-inter font-bold text-forest-green flex items-center">
                                Passed <ShieldCheck size={16} className="ml-2 text-forest-green" />
                            </span>
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <button className="flex-1 py-5 bg-forest-green text-champagne-gold font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-forest-green/90 transition-colors shadow-xl">
                            Request This Puppy
                        </button>
                        <button className="px-8 py-5 border border-forest-green/20 text-forest-green font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-forest-green/5 transition-colors">
                            Ask a Question
                        </button>
                    </div>
                </div>
            </div>

            {/* More Info */}
            <div className="border-t border-forest-green/10 pt-20">
                <div className="flex space-x-12 mb-12 border-b border-forest-green/10 pb-4">
                    {['About This Dog', 'Health Details', 'Care Info'].map((tab, i) => (
                        <button key={tab} className={`font-playfair text-xl ${i === 0 ? 'text-forest-green border-b-2 border-forest-green' : 'text-forest-green/40'} pb-4`}>
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-12 gap-12">
                    <div className="col-span-8">
                        <h3 className="font-playfair text-3xl mb-8 text-forest-green">Health & Behavior</h3>
                        <div className="p-10 bg-forest-green/5 rounded-24 border border-forest-green/10">
                            <p className="font-inter text-forest-green/70 leading-relaxed mb-8">
                                This puppy is very healthy and has been raised with a lot of care. We make sure every dog is strong and friendly before they go to their new home.
                            </p>

                            <div className="space-y-4">
                                <div className="p-6 bg-white rounded-xl shadow-sm border border-forest-green/5">
                                    <div className="font-playfair text-lg text-forest-green mb-2">Health Certificate</div>
                                    <p className="font-inter text-sm text-forest-green/60 px-0">Fully vaccinated and checked by a vet.</p>
                                </div>
                                <div className="p-6 bg-white rounded-xl shadow-sm border border-forest-green/5">
                                    <div className="font-playfair text-lg text-forest-green mb-2">Diet & Food</div>
                                    <p className="font-inter text-sm text-forest-green/60 px-0">Eating high-quality puppy food for strong bones.</p>
                                </div>
                            </div>

                            <button className="mt-12 flex items-center space-x-2 text-forest-green font-bold hover:text-forest-green/70 transition-colors">
                                <Download size={16} />
                                <span className="text-xs font-bold uppercase tracking-widest">Download Health Record (PDF)</span>
                            </button>
                        </div>
                    </div>

                    <div className="col-span-4 bg-forest-green p-10 rounded-24 text-ivory-white">
                        <h4 className="font-playfair text-2xl text-champagne-gold mb-6">Our Notes</h4>
                        <p className="font-inter text-sm opacity-70 leading-relaxed mb-8">
                            "This pup is very brave and grows quickly. He will be a great protector for a home with a large garden."
                        </p>
                        <div className="flex items-center space-x-4 pt-4 border-t border-white/10">
                            <div className="w-12 h-12 bg-white rounded-full overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" alt="Breeder" />
                            </div>
                            <div>
                                <div className="font-inter font-bold">Venkatesh</div>
                                <div className="font-inter text-xs opacity-60">Lead Dog Breeder</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PuppyDetailPage;
