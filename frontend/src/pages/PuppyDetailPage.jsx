import React from 'react';
import { ShieldCheck, Heart, Download } from 'lucide-react';

const PuppyDetailPage = ({ onPageChange, puppy, onToggleWishlist, isWishlisted, onAddToCart }) => {
    // Fallback if puppy is null (e.g. direct refresh)
    if (!puppy) {
        return (
            <div className="fixed-layout py-32 text-center">
                <h2 className="font-playfair text-3xl text-forest-green mb-8">Choose your perfect companion</h2>
                <button onClick={() => onPageChange('puppies')} className="px-10 py-4 bg-forest-green text-champagne-gold rounded-full font-bold uppercase tracking-widest text-xs">
                    View Catalog
                </button>
            </div>
        );
    }

    return (
        <div className="fixed-layout py-16 px-10">
            {/* Back Button */}
            <button
                onClick={() => onPageChange('puppies')}
                className="flex items-center space-x-3 text-forest-green/40 hover:text-forest-green mb-12 transition-colors group"
            >
                <div className="w-8 h-8 rounded-full border border-forest-green/10 flex items-center justify-center group-hover:bg-forest-green group-hover:text-white transition-all text-lg">
                    ←
                </div>
                <span className="font-inter text-xs uppercase tracking-widest font-bold">Back to Collection</span>
            </button>

            <div className="flex flex-col lg:flex-row gap-20 mb-20">
                {/* Left: Photos */}
                <div className="lg:w-[600px] shrink-0">
                    <div className="aspect-[4/5] bg-forest-green/5 rounded-24 overflow-hidden mb-6 relative group">
                        <img
                            src={puppy.image}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            alt={puppy.breed}
                        />
                        <button
                            onClick={(e) => { e.stopPropagation(); onToggleWishlist(); }}
                            className={`absolute top-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl transition-colors ${isWishlisted ? 'text-red-500' : 'text-forest-green hover:text-red-500'}`}
                        >
                            <Heart size={24} className={isWishlisted ? 'fill-current' : ''} />
                        </button>
                        <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/20 to-transparent flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white font-inter text-[10px] uppercase font-bold tracking-widest">Premium Quality Certified</span>
                            <ShieldCheck className="text-white/80" size={20} />
                        </div>
                    </div>

                    <div className="grid grid-cols-5 gap-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="aspect-square bg-forest-green/5 rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-forest-green transition-all">
                                <img src={`${puppy.image}&sig=${i}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Details */}
                <div className="flex-1 pt-4">
                    <div className="flex items-center space-x-3 mb-6">
                        <span className="px-3 py-1 bg-forest-green text-champagne-gold text-[10px] font-bold uppercase tracking-widest rounded-full">
                            {puppy.type || 'Top Quality Dog'}
                        </span>
                        <span className="text-forest-green/40 text-sm font-inter">ID: NS-2026-{(Math.random() * 999).toFixed(0).padStart(3, '0')}</span>
                    </div>

                    <h1 className="font-playfair text-5xl lg:text-7xl text-forest-green mb-4 leading-tight">
                        {puppy.breed.split(' ').length > 1 ? (
                            <>{puppy.breed.split(' ')[0]} <br /> {puppy.breed.split(' ').slice(1).join(' ')}</>
                        ) : (
                            puppy.breed
                        )}
                    </h1>
                    <p className="font-playfair text-2xl text-forest-green/80 mb-8 italic">Elite Heritage & Quality Companion</p>

                    <div className="text-5xl text-forest-green font-playfair mb-10">{puppy.priceDisplay || `₹${(puppy.price / 100000).toFixed(1)}L`}</div>

                    <div className="grid grid-cols-2 gap-y-6 mb-12">
                        <div>
                            <span className="font-inter text-[10px] text-forest-green/40 uppercase tracking-widest block mb-1">How Old</span>
                            <span className="font-inter font-bold text-forest-green text-lg">{puppy.age}</span>
                        </div>
                        <div>
                            <span className="font-inter text-[10px] text-forest-green/40 uppercase tracking-widest block mb-1">Availability</span>
                            <span className={`font-inter font-bold text-lg ${puppy.availability === 'Sold Out' ? 'text-red-500' : 'text-forest-green'}`}>{puppy.availability}</span>
                        </div>
                        <div>
                            <span className="font-inter text-[10px] text-forest-green/40 uppercase tracking-widest block mb-1">Behavior</span>
                            <span className="font-inter font-bold text-forest-green text-lg">Calm & Trained</span>
                        </div>
                        <div>
                            <span className="font-inter text-[10px] text-forest-green/40 uppercase tracking-widest block mb-1">Health Shield</span>
                            <span className="font-inter font-bold text-forest-green text-lg flex items-center">
                                Verified <ShieldCheck size={18} className="ml-2 text-forest-green" />
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => onAddToCart(puppy)}
                            className="flex-1 py-5 bg-forest-green text-champagne-gold font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-forest-green/90 transition-all hover:shadow-2xl hover:-translate-y-1 active:translate-y-0"
                        >
                            Buy Puppy
                        </button>
                        <button
                            onClick={() => onPageChange('contact')}
                            className="px-10 py-5 border-2 border-forest-green text-forest-green font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-forest-green/5 transition-all"
                        >
                            Chat with Breeder
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Tabs (Simplified for UX) */}
            <div className="mt-24">
                <div className="flex space-x-12 mb-12 border-b border-forest-green/10">
                    <button className="pb-6 border-b-2 border-forest-green font-playfair text-2xl text-forest-green">About This Companion</button>
                </div>

                <div className="flex flex-col lg:flex-row gap-16">
                    <div className="lg:w-2/3">
                        <p className="text-xl text-forest-green/80 font-inter leading-relaxed mb-10">
                            Our {puppy.breed} puppies come from a lineage of excellence. We ensure every puppy receives individual attention, high-quality nutrition, and early socialization to make their transition to your home seamless and joyful.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 bg-ivory rounded-2xl border border-forest-green/5">
                                <h4 className="font-playfair text-xl text-forest-green mb-4">Initial Care Package</h4>
                                <ul className="space-y-3 font-inter text-sm text-forest-green/60">
                                    <li>• Complete Vaccinations Record</li>
                                    <li>• Microchipping Documentation</li>
                                    <li>• Beginner's Training Guide</li>
                                    <li>• 14-Day Health Guaranty</li>
                                </ul>
                            </div>
                            <div className="p-8 bg-ivory rounded-2xl border border-forest-green/5">
                                <h4 className="font-playfair text-xl text-forest-green mb-4">Elite Protection</h4>
                                <p className="font-inter text-sm text-forest-green/60 leading-relaxed">
                                    This breed is known for its natural guardian instincts. We provide guidance on maintaining their protective yet gentle nature.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-1/3 bg-forest-green p-10 rounded-[32px] text-ivory-white flex flex-col justify-between">
                        <div>
                            <h4 className="font-playfair text-3xl text-champagne-gold mb-6 italic">Ready to Welcome Them?</h4>
                            <p className="font-inter text-sm opacity-70 leading-relaxed mb-8">
                                Secure this pup today with a 50% reservation deposit. Our team will handle the documentation and final health sweep.
                            </p>
                        </div>
                        <div className="flex items-center space-x-4 pt-6 border-t border-white/10">
                            <div className="w-16 h-16 bg-white rounded-full overflow-hidden border-2 border-champagne-gold/20">
                                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="Lead Breeder" />
                            </div>
                            <div>
                                <div className="font-inter font-bold text-white">Venkatesh S.</div>
                                <div className="font-inter text-xs text-champagne-gold uppercase tracking-widest font-bold">NS Lead Breeder</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PuppyDetailPage;
