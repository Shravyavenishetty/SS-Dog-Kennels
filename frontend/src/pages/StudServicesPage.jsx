import React, { useState, useMemo } from 'react';
import { Calendar, Mail, FileText, Star, Search, SlidersHorizontal } from 'lucide-react';

const StudServicesPage = ({ onPageChange }) => {
    // 1. Data
    const baseStuds = [
        { name: 'Titan', breed: 'Tibetan Mastiff', rating: 5.0, pups: 12, image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=600' },
        { name: 'Storm', breed: 'Doberman', rating: 4.9, pups: 8, image: 'https://images.unsplash.com/photo-1554692998-0420ff80562e?auto=format&fit=crop&q=80&w=600' },
        { name: 'Caesar', breed: 'German Shepherd', rating: 5.0, pups: 24, image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&q=80&w=600' },
        { name: 'Brutus', breed: 'Rottweiler', rating: 4.8, pups: 15, image: 'https://images.unsplash.com/photo-1567171466295-4afa58141417?auto=format&fit=crop&q=80&w=600' },
        { name: 'Shadow', breed: 'Caucasian Shepherd', rating: 5.0, pups: 5, image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600' },
        { name: 'Max', breed: 'Golden Retriever', rating: 4.7, pups: 30, image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400' },
    ];

    // 2. State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBreeds, setSelectedBreeds] = useState([]);
    const [sortBy, setSortBy] = useState('Top Rated');

    // 3. Logic
    const filteredStuds = useMemo(() => {
        let result = [...baseStuds];

        // Search
        if (searchQuery) {
            result = result.filter(s =>
                s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.breed.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Breed Filter
        if (selectedBreeds.length > 0) {
            result = result.filter(s => selectedBreeds.includes(s.breed));
        }

        // Sort
        result.sort((a, b) => {
            if (sortBy === 'Most Experienced') return b.pups - a.pups;
            if (sortBy === 'Top Rated') return b.rating - a.rating;
            if (sortBy === 'Name (A-Z)') return a.name.localeCompare(b.name);
            return 0;
        });

        return result;
    }, [searchQuery, selectedBreeds, sortBy]);

    const breeds = [...new Set(baseStuds.map(s => s.breed))];

    const toggleBreed = (breed) => {
        setSelectedBreeds(prev =>
            prev.includes(breed) ? prev.filter(b => b !== breed) : [...prev, breed]
        );
    };

    return (
        <div className="fixed-layout py-8 lg:py-16 px-6 lg:px-10">
            {/* Header Section */}
            <div className="text-center mb-12 lg:mb-20 animate-in fade-in slide-in-from-top-8 duration-1000">
                <span className="font-inter text-xs uppercase tracking-[0.4em] text-forest-green/60 mb-4 block">Superior Bloodlines</span>
                <h1 className="font-playfair text-3xl lg:text-6xl text-forest-green mb-6 lg:mb-8">Champion Stud Dogs</h1>
                <p className="max-w-2xl mx-auto text-sm lg:text-lg text-forest-green/70 leading-relaxed mb-8 lg:mb-12">
                    Partner with our elite champion dogs to ensure healthy, strong litters. Every stud is vetted for quality.
                </p>

                {/* Search & Sort Bar */}
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 bg-white p-3 rounded-2xl shadow-xl border border-forest-green/5">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-forest-green/20" size={18} />
                        <input
                            type="text"
                            placeholder="Search name or breed..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-6 py-4 bg-forest-green/5 rounded-xl font-inter text-sm text-forest-green focus:outline-none focus:border-forest-green/20 transition-all border border-transparent"
                        />
                    </div>
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-4 px-4 sm:px-0 sm:pr-4">
                        <span className="font-inter text-[10px] uppercase tracking-widest text-forest-green/40 font-bold">Sort By</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-transparent font-inter text-sm text-forest-green font-bold focus:outline-none cursor-pointer"
                        >
                            <option>Top Rated</option>
                            <option>Most Experienced</option>
                            <option>Name (A-Z)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:space-x-12">
                {/* Mobile Filter Chips */}
                <div className="lg:hidden mb-8 overflow-x-auto flex space-x-2 pb-2 scrollbar-hide">
                    {breeds.map(breed => (
                        <button
                            key={breed}
                            onClick={() => toggleBreed(breed)}
                            className={`px-4 py-2 rounded-full whitespace-nowrap text-[10px] font-bold uppercase tracking-widest transition-all ${selectedBreeds.includes(breed) ? 'bg-forest-green text-champagne-gold' : 'bg-forest-green/5 text-forest-green'}`}
                        >
                            {breed}
                        </button>
                    ))}
                </div>

                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-[240px] shrink-0">
                    <div className="sticky top-[120px]">
                        <div className="flex items-center justify-between mb-8 border-b border-forest-green/5 pb-4">
                            <h3 className="font-playfair text-xl text-forest-green flex items-center space-x-2">
                                <SlidersHorizontal size={18} />
                                <span>Refine</span>
                            </h3>
                            {(selectedBreeds.length > 0 || searchQuery) && (
                                <button
                                    onClick={() => { setSelectedBreeds([]); setSearchQuery(''); }}
                                    className="text-[10px] uppercase font-bold text-forest-green/40 hover:text-red-500 transition-colors"
                                >
                                    Reset
                                </button>
                            )}
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h4 className="font-inter text-[10px] uppercase tracking-[0.2em] font-bold text-forest-green/60 mb-4 block">Filter by Breed</h4>
                                <div className="space-y-3">
                                    {breeds.map(breed => (
                                        <label key={breed} className="flex items-center space-x-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={selectedBreeds.includes(breed)}
                                                onChange={() => toggleBreed(breed)}
                                            />
                                            <div className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center ${selectedBreeds.includes(breed) ? 'bg-forest-green border-forest-green' : 'border-forest-green/20'
                                                }`}>
                                                {selectedBreeds.includes(breed) && <div className="w-2 h-2 bg-champagne-gold rounded-sm"></div>}
                                            </div>
                                            <span className={`font-inter text-sm transition-colors ${selectedBreeds.includes(breed) ? 'text-forest-green font-bold' : 'text-forest-green/60 group-hover:text-forest-green'
                                                }`}>{breed}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <section className="flex-1">
                    {filteredStuds.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 animate-in fade-in duration-700">
                            {filteredStuds.map((stud, i) => (
                                <div key={i} className="group cursor-pointer">
                                    <div className="aspect-[3/4] rounded-24 overflow-hidden mb-6 lg:mb-8 shadow-xl relative bg-ivory">
                                        <img src={stud.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={stud.name} />
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-green via-forest-green/40 to-transparent p-6 lg:p-8">
                                            <div className="flex items-center space-x-2 text-champagne-gold mb-1 lg:mb-2">
                                                <Star size={12} fill="currentColor" />
                                                <span className="text-[10px] font-bold tracking-widest">{stud.rating.toFixed(1)} CHAMPION</span>
                                            </div>
                                            <h3 className="font-playfair text-2xl lg:text-3xl text-white mb-1">{stud.name}</h3>
                                            <p className="font-inter text-[10px] text-white/50 uppercase tracking-[0.3em]">{stud.breed}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 lg:space-y-4 px-2">
                                        <div className="flex items-center justify-between font-inter text-[10px] lg:text-xs py-2 lg:py-3 border-b border-forest-green/5">
                                            <span className="text-forest-green/40 uppercase tracking-widest font-bold">Litters Proven</span>
                                            <span className="font-bold text-forest-green">{stud.pups}+ Litters</span>
                                        </div>
                                        <div className="flex items-center justify-between font-inter text-[10px] lg:text-xs py-2 lg:py-3 border-b border-forest-green/5">
                                            <span className="text-forest-green/40 uppercase tracking-widest font-bold">Booking Status</span>
                                            <button
                                                onClick={() => onPageChange('contact')}
                                                className="text-forest-green font-bold hover:text-champagne-gold transition-colors"
                                            >
                                                Details &rarr;
                                            </button>
                                        </div>

                                        <div className="flex space-x-3 pt-3 lg:pt-4">
                                            <button
                                                onClick={() => onPageChange('stud-availability')}
                                                className="flex-1 py-4 bg-forest-green text-champagne-gold font-bold uppercase tracking-widest text-[10px] rounded-xl hover:shadow-2xl transition-all active:scale-95"
                                            >
                                                Check Availability
                                            </button>
                                            <button className="w-12 h-12 lg:w-14 lg:h-14 border border-forest-green/10 rounded-xl flex items-center justify-center text-forest-green hover:bg-forest-green hover:text-champagne-gold transition-all group/btn">
                                                <FileText size={18} className="lg:w-5 lg:h-5 group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 lg:py-32 text-center bg-forest-green/5 rounded-32 border border-dashed border-forest-green/10">
                            <h3 className="font-playfair text-2xl lg:text-3xl text-forest-green mb-4">No champion matches</h3>
                            <button
                                onClick={() => { setSelectedBreeds([]); setSearchQuery(''); }}
                                className="px-8 py-4 bg-forest-green text-champagne-gold font-bold uppercase tracking-widest text-[10px] rounded-full"
                            >
                                Show All Studs
                            </button>
                        </div>
                    )}
                </section>
            </div>

            {/* Bottom Partnership Section */}
            <div className="mt-20 lg:mt-48 p-8 lg:p-20 bg-forest-green rounded-32 lg:rounded-[64px] border border-forest-green/10 flex flex-col lg:flex-row items-center justify-between text-white relative overflow-hidden group gap-12">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-champagne-gold/5 blur-[120px] rounded-full -mr-32 -mt-32"></div>

                <div className="max-w-2xl relative z-10 text-center lg:text-left">
                    <span className="font-inter text-[10px] uppercase tracking-[0.5em] text-champagne-gold/60 mb-4 lg:mb-6 block">Future Partnerships</span>
                    <h2 className="font-playfair text-3xl lg:text-6xl text-white mb-6 lg:mb-8">Breeder <span className="italic text-champagne-gold">Partnerships</span></h2>
                    <p className="font-inter text-ivory-white/60 mb-8 lg:mb-10 text-sm lg:text-lg leading-relaxed">
                        We collaborate with select breeders to improve bloodline quality. Join our network for professional support.
                    </p>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-6 lg:gap-8">
                        <div className="flex items-center space-x-3 text-[10px] font-bold tracking-widest uppercase text-ivory-white/80">
                            <Calendar size={16} className="text-champagne-gold" />
                            <span>Scheduled Boarding</span>
                        </div>
                        <div className="flex items-center space-x-3 text-[10px] font-bold tracking-widest uppercase text-ivory-white/80">
                            <Mail size={16} className="text-champagne-gold" />
                            <span>Veterinary Support</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => onPageChange('contact')}
                    className="w-full lg:w-auto relative z-10 px-10 lg:px-16 py-5 lg:py-8 bg-champagne-gold text-forest-green font-bold uppercase tracking-widest text-[10px] lg:text-xs rounded-full shadow-2xl hover:bg-white transition-all transform hover:scale-105 active:scale-95"
                >
                    Apply for Partnership
                </button>
            </div>
        </div>
    );
};

export default StudServicesPage;
