import React from 'react';
import { ShieldCheck, Heart, Download } from 'lucide-react';

const PuppyDetailPage = ({ onPageChange, puppy, onToggleWishlist, isWishlisted, onBookPuppy }) => {
    const [activeImage, setActiveImage] = React.useState(puppy?.image);

    // Update activeImage if puppy changes
    React.useEffect(() => {
        if (puppy) setActiveImage(puppy.image);
    }, [puppy]);

    // Fallback if puppy is null (e.g. direct refresh)
    if (!puppy) {
        return (
            <div className="fixed-layout py-20 lg:py-32 px-6 lg:px-10 text-center">
                <h2 className="font-playfair text-2xl lg:text-3xl text-forest-green mb-8">Choose your perfect companion</h2>
                <button onClick={() => onPageChange('puppies')} className="px-10 py-4 bg-forest-green text-champagne-gold rounded-full font-bold uppercase tracking-widest text-xs">
                    View Catalog
                </button>
            </div>
        );
    }

    // Prepare gallery: main image + nested images
    const allImages = [puppy.image, ...(puppy.images || [])].filter(Boolean);

    return (
        <div className="fixed-layout py-8 lg:py-16 px-4 lg:px-10">
            {/* Back Button */}
            <button
                onClick={() => onPageChange('puppies')}
                className="flex items-center space-x-3 text-forest-green/40 hover:text-forest-green mb-8 lg:mb-12 transition-colors group"
            >
                <div className="w-8 h-8 rounded-full border border-forest-green/10 flex items-center justify-center group-hover:bg-forest-green group-hover:text-white transition-all text-sm">
                    ←
                </div>
                <span className="font-inter text-[10px] uppercase tracking-widest font-bold">Back to Collection</span>
            </button>

            <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 mb-16 lg:mb-20">
                {/* Left: Photos */}
                <div className="w-full lg:w-[600px] shrink-0">
                    <div className="aspect-[4/5] bg-forest-green/5 rounded-24 lg:rounded-32 overflow-hidden mb-4 lg:mb-6 relative group">
                        <img
                            src={activeImage || puppy.image}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            alt={puppy.breed}
                        />
                        <button
                            onClick={(e) => { e.stopPropagation(); onToggleWishlist(); }}
                            className={`absolute top-4 lg:top-6 right-4 lg:right-6 w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center shadow-xl transition-colors ${isWishlisted ? 'text-red-500' : 'text-forest-green hover:text-red-500'}`}
                        >
                            <Heart size={20} className={isWishlisted ? 'fill-current lg:w-6 lg:h-6' : 'lg:w-6 lg:h-6'} />
                        </button>
                    </div>

                    <div className="grid grid-cols-5 gap-2 lg:gap-4 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                        {allImages.map((img, i) => (
                            <div
                                key={i}
                                onClick={() => setActiveImage(img)}
                                className={`aspect-square bg-forest-green/5 rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-forest-green transition-all shrink-0 ${activeImage === img ? 'ring-2' : ''}`}
                            >
                                <img src={img} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Details */}
                <div className="flex-1 pt-0 lg:pt-4">
                    <div className="flex items-center space-x-3 mb-4 lg:mb-6">
                        <span className="px-3 py-1 bg-forest-green text-champagne-gold text-[10px] font-bold uppercase tracking-widest rounded-full">
                            {puppy.type || 'Top Quality Dog'}
                        </span>
                        <span className="text-forest-green/40 text-[10px] lg:text-sm font-inter">ID: SS-2026-{(Math.random() * 999).toFixed(0).padStart(3, '0')}</span>
                    </div>

                    <h1 className="font-playfair text-4xl lg:text-7xl text-forest-green mb-2 lg:mb-4 leading-tight">
                        {puppy.breed}
                    </h1>
                    <p className="font-playfair text-xl lg:text-2xl text-forest-green/80 mb-6 lg:mb-8 italic">{puppy.tagline || 'Elite Heritage & Quality Companion'}</p>

                    <div className="text-4xl lg:text-6xl text-forest-green font-playfair mb-8 lg:mb-10">{puppy.priceDisplay || `₹${(puppy.price / 100000).toFixed(1)}L`}</div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-6 lg:gap-x-12 lg:gap-y-8 mb-10 lg:mb-12">
                        <div className="break-words pr-2">
                            <span className="font-inter text-[8px] lg:text-[10px] text-forest-green/40 uppercase tracking-widest block mb-1">How Old</span>
                            <span className="font-inter font-bold text-forest-green text-base lg:text-lg">{puppy.age}</span>
                        </div>
                        <div className="break-words">
                            <span className="font-inter text-[8px] lg:text-[10px] text-forest-green/40 uppercase tracking-widest block mb-1">Availability</span>
                            <span className={`font-inter font-bold text-base lg:text-lg ${puppy.availability === 'Sold Out' ? 'text-red-500' : 'text-forest-green'}`}>{puppy.availability}</span>
                        </div>
                        <div className="break-words pr-2">
                            <span className="font-inter text-[8px] lg:text-[10px] text-forest-green/40 uppercase tracking-widest block mb-1">Behavior</span>
                            <span className="font-inter font-bold text-forest-green text-base lg:text-lg">{puppy.behavior || 'Calm & Trained'}</span>
                        </div>
                        <div className="break-words">
                            <span className="font-inter text-[8px] lg:text-[10px] text-forest-green/40 uppercase tracking-widest block mb-1">Health Shield</span>
                            <span className="font-inter font-bold text-forest-green text-base lg:text-lg flex items-center flex-wrap gap-x-2">
                                <span>{puppy.health_shield || 'Verified'}</span> <ShieldCheck size={16} className="text-forest-green shrink-0" />
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => onBookPuppy(puppy)}
                            className="flex-1 py-5 bg-forest-green text-champagne-gold font-bold uppercase tracking-widest text-[10px] lg:text-xs rounded-xl hover:bg-forest-green/90 transition-all hover:shadow-2xl active:scale-95"
                        >
                            Complete Booking
                        </button>
                        <button
                            onClick={() => onPageChange('contact')}
                            className="flex-1 px-10 py-5 border-2 border-forest-green text-forest-green font-bold uppercase tracking-widest text-[10px] lg:text-xs rounded-xl hover:bg-forest-green/5 transition-all active:scale-95"
                        >
                            Chat with Breeder
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="mt-16 lg:mt-24">
                <div className="flex mb-8 lg:mb-12 border-b border-forest-green/10 overflow-x-auto scrollbar-hide">
                    <button className="whitespace-nowrap pb-4 lg:pb-6 border-b-2 border-forest-green font-playfair text-xl lg:text-2xl text-forest-green">About This Companion</button>
                </div>

                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                    <div className="lg:w-2/3">
                        <p className="text-lg lg:text-xl text-forest-green/80 font-inter leading-relaxed mb-8 lg:mb-10">
                            {puppy.description || `Our ${puppy.breed} puppies come from a lineage of excellence. We ensure every puppy receives individual attention, high-quality nutrition, and early socialization to make their transition to your home seamless and joyful.`}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                            <div className="p-6 lg:p-8 bg-ivory rounded-2xl border border-forest-green/5">
                                <h4 className="font-playfair text-lg lg:text-xl text-forest-green mb-4">Initial Care Package</h4>
                                <div className="space-y-3 font-inter text-[10px] lg:text-sm text-forest-green/60">
                                    {(puppy.initial_package || '• Complete Vaccinations Record\n• Microchipping Documentation\n• Beginner\'s Training Guide\n• 14-Day Health Guaranty').split('\n').map((item, index) => (
                                        <div key={index}>{item}</div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 lg:p-8 bg-ivory rounded-2xl border border-forest-green/5">
                                <h4 className="font-playfair text-lg lg:text-xl text-forest-green mb-4">Elite Protection</h4>
                                <p className="font-inter text-[10px] lg:text-sm text-forest-green/60 leading-relaxed whitespace-pre-wrap">
                                    {puppy.elite_protection || 'This breed is known for its natural guardian instincts. We provide guidance on maintaining their protective yet gentle nature.'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-1/3 bg-forest-green p-8 lg:p-10 rounded-24 lg:rounded-[32px] text-ivory-white flex flex-col justify-between">
                        <div>
                            <h4 className="font-playfair text-2xl lg:text-3xl text-champagne-gold mb-4 lg:mb-6 italic">Ready to Welcome Them?</h4>
                            <p className="font-inter text-[10px] lg:text-sm opacity-70 leading-relaxed mb-6 lg:mb-8">
                                Secure this pup today with a 50% reservation deposit. Our team will handle the documentation and final health sweep.
                            </p>
                        </div>
                        <div className="flex items-center space-x-4 pt-6 border-t border-white/10">
                            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white rounded-full overflow-hidden border-2 border-champagne-gold/20 shrink-0">
                                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="Lead Breeder" />
                            </div>
                            <div>
                                <div className="font-inter text-sm lg:text-base font-bold text-white">Venkatesh S.</div>
                                <div className="font-inter text-[8px] lg:text-xs text-champagne-gold uppercase tracking-widest font-bold">NS Lead Breeder</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PuppyDetailPage;
