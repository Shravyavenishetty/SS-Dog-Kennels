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
        <div className="fixed-layout py-16 px-10">
            {/* Header Section */}
            <div className="text-center mb-20 animate-in fade-in slide-in-from-top-8 duration-1000">
                <span className="font-inter text-xs uppercase tracking-[0.4em] text-forest-green/60 mb-4 block">Superior Bloodlines</span>
                <h1 className="font-playfair text-6xl text-forest-green mb-8">Champion Stud Dogs</h1>
                <p className="max-w-2xl mx-auto text-lg text-forest-green/70 leading-relaxed mb-12">
                    Partner with our elite champion dogs to ensure healthy, strong litters. Every stud is vetted for health, temperament, and quality.
                </p>

                {/* Search & Sort Bar */}
                <div className="max-w-4xl mx-auto flex items-center space-x-6 bg-white p-3 rounded-2xl shadow-xl border border-forest-green/5">
                    <div className="relative flex-1">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-forest-green/20" size={20} />
                        <input
                            type="text"
                            placeholder="Search by stud name or breed..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-6 py-4 bg-forest-green/5 rounded-xl font-inter text-sm text-forest-green focus:outline-none focus:border-forest-green/20 transition-all border border-transparent"
                        />
                    </div>
                    <div className="flex items-center space-x-4 pr-4">
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

            <div className="flex space-x-12">
                {/* Minimalist Sidebar */}
                <aside className="w-[240px] shrink-0">
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
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-10 animate-in fade-in duration-700">
                            {filteredStuds.map((stud, i) => (
                                <div key={i} className="group cursor-pointer">
                                    <div className="aspect-[3/4] rounded-24 overflow-hidden mb-8 shadow-xl relative bg-ivory">
                                        <img src={stud.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={stud.name} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-forest-green via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40"></div>
                                        <div className="absolute bottom-6 left-6 right-6">
                                            <div className="flex items-center space-x-2 text-champagne-gold mb-2">
                                                <Star size={14} fill="currentColor" />
                                                <span className="text-xs font-bold tracking-widest">{stud.rating.toFixed(1)} CHAMPION RATING</span>
                                            </div>
                                            <h3 className="font-playfair text-3xl text-white mb-1">{stud.name}</h3>
                                            <p className="font-inter text-xs text-white/50 uppercase tracking-[0.3em]">{stud.breed}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 px-2">
                                        <div className="flex items-center justify-between font-inter text-xs py-3 border-b border-forest-green/5">
                                            <span className="text-forest-green/40 uppercase tracking-widest font-bold">Litters Proven</span>
                                            <span className="font-bold text-forest-green">{stud.pups}+ Litters</span>
                                        </div>
                                        <div className="flex items-center justify-between font-inter text-xs py-3 border-b border-forest-green/5">
                                            <span className="text-forest-green/40 uppercase tracking-widest font-bold">Booking Status</span>
                                            <button
                                                onClick={() => onPageChange('contact')}
                                                className="text-forest-green font-bold hover:text-champagne-gold transition-colors"
                                            >
                                                Ask Team &rarr;
                                            </button>
                                        </div>

                                        <div className="flex space-x-3 pt-4">
                                            <button
                                                onClick={() => onPageChange('stud-availability')}
                                                className="flex-1 py-4 bg-forest-green text-champagne-gold font-bold uppercase tracking-widest text-[10px] rounded-xl hover:shadow-[0_10px_30px_rgba(20,45,34,0.2)] transition-all active:scale-95"
                                            >
                                                Check Availability
                                            </button>
                                            <button className="w-14 h-14 border border-forest-green/10 rounded-xl flex items-center justify-center text-forest-green hover:bg-forest-green hover:text-champagne-gold transition-all group/btn">
                                                <FileText size={20} className="group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-32 text-center bg-forest-green/5 rounded-32 border border-dashed border-forest-green/10">
                            <h3 className="font-playfair text-3xl text-forest-green mb-4">No champion matches</h3>
                            <p className="text-forest-green/40 max-w-xs mx-auto mb-8">Try adjusting your filters to see other champion dogs in our kennel.</p>
                            <button
                                onClick={() => { setSelectedBreeds([]); setSearchQuery(''); }}
                                className="px-10 py-4 bg-forest-green text-champagne-gold font-bold uppercase tracking-widest text-[10px] rounded-full"
                            >
                                Show All Studs
                            </button>
                        </div>
                    )}
                </section>
            </div>

            {/* Bottom Partnership Section */}
            <div className="mt-48 p-10 lg:p-20 bg-forest-green rounded-32 lg:rounded-[64px] border border-forest-green/10 flex flex-col lg:flex-row items-center justify-between text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-champagne-gold/5 blur-[120px] rounded-full -mr-32 -mt-32"></div>

                <div className="max-w-2xl relative z-10 text-center lg:text-left mb-12 lg:mb-0">
                    <span className="font-inter text-[10px] uppercase tracking-[0.5em] text-champagne-gold/60 mb-6 block">Future Partnerships</span>
                    <h2 className="font-playfair text-4xl lg:text-6xl text-white mb-8">Exclusive Breeder <br /><span className="italic text-champagne-gold">Partnerships</span></h2>
                    <p className="font-inter text-ivory-white/60 mb-10 text-lg leading-relaxed">
                        We collaborate with select breeders nationwide to improve bloodline quality. Join our network for professional support, genetic guidance, and global shipping.
                    </p>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-8">
                        <div className="flex items-center space-x-3 text-[10px] font-bold tracking-widest uppercase text-ivory-white/80">
                            <Calendar size={18} className="text-champagne-gold" />
                            <span>Scheduled Boarding</span>
                        </div>
                        <div className="flex items-center space-x-3 text-[10px] font-bold tracking-widest uppercase text-ivory-white/80">
                            <Mail size={18} className="text-champagne-gold" />
                            <span>Veterinary Support</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => onPageChange('contact')}
                    className="relative z-10 px-16 py-8 bg-champagne-gold text-forest-green font-bold uppercase tracking-widest text-xs rounded-full shadow-2xl hover:bg-white transition-all transform hover:scale-105 active:scale-95"
                >
                    Apply for Partnership
                </button>
            </div>
        </div>
    );
};

export default StudServicesPage;
