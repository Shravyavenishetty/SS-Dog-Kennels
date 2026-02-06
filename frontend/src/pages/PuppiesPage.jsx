import React, { useState, useMemo } from 'react';
import PuppyCard from '../components/PuppyCard';
import { Search, SlidersHorizontal } from 'lucide-react';

const PuppiesPage = ({ onPageChange, onPuppySelect }) => {
    // 1. Data
    const basePuppies = [
        { breed: 'Caucasian Shepherd', price: 450000, priceDisplay: '₹4.5L', age: '8 Weeks', availability: 'Available Now', type: 'Guard Dogs', image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400' },
        { breed: 'Tibetan Mastiff', price: 1200000, priceDisplay: '₹12L', age: '12 Weeks', availability: 'Coming Soon', type: 'Guard Dogs', image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=400' },
        { breed: 'French Bulldog', price: 280000, priceDisplay: '₹2.8L', age: '10 Weeks', availability: 'Available Now', type: 'Pets', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=400' },
        { breed: 'Golden Retriever', price: 150000, priceDisplay: '₹1.5L', age: '9 Weeks', availability: 'Available Now', type: 'Pets', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400' },
        { breed: 'Alaskan Malamute', price: 350000, priceDisplay: '₹3.5L', age: '11 Weeks', availability: 'Available Now', type: 'Working Dogs', image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=400' },
        { breed: 'Siberian Husky', price: 220000, priceDisplay: '₹2.2L', age: '7 Weeks', availability: 'Available Now', type: 'Pets', image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=400' },
    ];

    // 2. State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedAvailability, setSelectedAvailability] = useState([]);
    const [priceRange, setPriceRange] = useState('All Prices');
    const [sortBy, setSortBy] = useState('Newest');

    // 3. Logic
    const filteredPuppies = useMemo(() => {
        let result = [...basePuppies];

        // Search Filter
        if (searchQuery) {
            result = result.filter(p =>
                p.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.type.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Type Filter
        if (selectedTypes.length > 0) {
            result = result.filter(p => selectedTypes.includes(p.type));
        }

        // Availability Filter
        if (selectedAvailability.length > 0) {
            result = result.filter(p => selectedAvailability.includes(p.availability));
        }

        // Price Range Filter
        if (priceRange !== 'All Prices') {
            result = result.filter(p => {
                if (priceRange === '₹1L - ₹3L') return p.price >= 100000 && p.price <= 300000;
                if (priceRange === '₹3L - ₹10L') return p.price > 300000 && p.price <= 1000000;
                if (priceRange === '₹10L+') return p.price > 1000000;
                return true;
            });
        }

        // Sort Logic
        result.sort((a, b) => {
            if (sortBy === 'Price: Low to High') return a.price - b.price;
            if (sortBy === 'Price: High to Low') return b.price - a.price;
            return 0; // Default: 'Newest' (based on current order)
        });

        return result;
    }, [searchQuery, selectedTypes, selectedAvailability, priceRange, sortBy]);

    // 4. Handlers
    const toggleType = (type) => {
        setSelectedTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const toggleAvailability = (status) => {
        setSelectedAvailability(prev =>
            prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
        );
    };

    return (
        <div className="fixed-layout py-16 px-10 flex space-x-12">
            {/* Sidebar Filters */}
            <aside className="w-[280px] shrink-0">
                <div className="sticky top-[120px]">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="font-playfair text-2xl text-forest-green">Filters</h2>
                        <button
                            onClick={() => {
                                setSelectedTypes([]);
                                setSelectedAvailability([]);
                                setPriceRange('All Prices');
                                setSearchQuery('');
                            }}
                            className="font-inter text-[10px] uppercase tracking-widest text-forest-green/40 hover:text-forest-green transition-colors"
                        >
                            Reset All
                        </button>
                    </div>

                    <div className="space-y-10">
                        {/* Breed Filter */}
                        <div>
                            <h4 className="font-inter text-xs uppercase tracking-widest font-bold text-forest-green/60 mb-4">Dog Type</h4>
                            <div className="space-y-3">
                                {['Guard Dogs', 'Pets', 'Working Dogs', 'Farm Dogs'].map(type => (
                                    <label key={type} className="flex items-center space-x-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={selectedTypes.includes(type)}
                                            onChange={() => toggleType(type)}
                                        />
                                        <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${selectedTypes.includes(type) ? 'bg-forest-green border-forest-green' : 'border-forest-green/20 group-hover:border-forest-green'
                                            }`}>
                                            {selectedTypes.includes(type) && <div className="w-2.5 h-2.5 bg-champagne-gold rounded-sm"></div>}
                                        </div>
                                        <span className={`font-inter text-sm transition-colors ${selectedTypes.includes(type) ? 'text-forest-green font-bold' : 'text-forest-green/80 group-hover:text-forest-green'
                                            }`}>{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Availability */}
                        <div>
                            <h4 className="font-inter text-xs uppercase tracking-widest font-bold text-forest-green/60 mb-4">Availability</h4>
                            <div className="space-y-3">
                                {['Available Now', 'Coming Soon', 'Sold Out'].map(status => (
                                    <label key={status} className="flex items-center space-x-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={selectedAvailability.includes(status)}
                                            onChange={() => toggleAvailability(status)}
                                        />
                                        <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${selectedAvailability.includes(status) ? 'bg-forest-green border-forest-green' : 'border-forest-green/20 group-hover:border-forest-green'
                                            }`}>
                                            {selectedAvailability.includes(status) && <div className="w-2.5 h-2.5 bg-champagne-gold rounded-sm"></div>}
                                        </div>
                                        <span className={`font-inter text-sm transition-colors ${selectedAvailability.includes(status) ? 'text-forest-green font-bold' : 'text-forest-green/80 group-hover:text-forest-green'
                                            }`}>{status}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price */}
                        <div>
                            <h4 className="font-inter text-xs uppercase tracking-widest font-bold text-forest-green/60 mb-4">Price Range</h4>
                            <select
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="w-full bg-transparent border-b border-forest-green/20 py-2 font-inter text-sm text-forest-green focus:outline-none focus:border-forest-green transition-colors cursor-pointer"
                            >
                                <option>All Prices</option>
                                <option>₹1L - ₹3L</option>
                                <option>₹3L - ₹10L</option>
                                <option>₹10L+</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-16 p-8 bg-forest-green rounded-24 text-ivory-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-champagne-gold/10 blur-3xl -mr-16 -mt-16 group-hover:bg-champagne-gold/20 transition-all"></div>
                        <h3 className="font-playfair text-xl mb-4 text-champagne-gold z-10 relative">Need Help?</h3>
                        <p className="font-inter text-xs opacity-70 leading-relaxed mb-6 z-10 relative">
                            Talk to our friendly team to find the right puppy for your family.
                        </p>
                        <button
                            onClick={() => onPageChange('contact')}
                            className="text-xs font-bold uppercase tracking-widest text-champagne-gold hover:text-white transition-colors flex items-center space-x-2 z-10 relative"
                        >
                            <span>Contact Help Team</span>
                            <span>&rarr;</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <section className="flex-1">
                <div className="flex flex-col mb-12">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="font-playfair text-4xl text-forest-green">Our Collection <span className="text-forest-green/40">({filteredPuppies.length} Dogs)</span></h1>
                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-forest-green/40" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search breeds..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 pr-6 py-3 bg-forest-green/5 border border-forest-green/5 rounded-full font-inter text-sm text-forest-green focus:outline-none focus:border-forest-green/20 transition-all w-[240px]"
                                />
                            </div>
                            <div className="flex items-center space-x-3 bg-forest-green/5 px-4 py-2 rounded-lg border border-forest-green/5">
                                <span className="font-inter text-xs text-forest-green/40 font-bold uppercase tracking-widest">Sort:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-transparent font-inter text-sm text-forest-green font-bold focus:outline-none cursor-pointer"
                                >
                                    <option>Newest</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Active Filters Bar */}
                    {(selectedTypes.length > 0 || selectedAvailability.length > 0 || priceRange !== 'All Prices' || searchQuery) && (
                        <div className="flex flex-wrap items-center gap-2 border-t border-forest-green/5 pt-6 animate-in fade-in slide-in-from-top-4 duration-500">
                            <span className="font-inter text-[10px] uppercase tracking-widest text-forest-green/40 font-bold mr-2">Active Filters:</span>
                            {searchQuery && (
                                <div className="px-3 py-1 bg-forest-green/5 border border-forest-green/10 rounded-full text-[10px] text-forest-green font-bold flex items-center space-x-2">
                                    <span>Search: {searchQuery}</span>
                                    <button onClick={() => setSearchQuery('')} className="hover:text-red-500 transition-colors">&times;</button>
                                </div>
                            )}
                            {selectedTypes.map(type => (
                                <div key={type} className="px-3 py-1 bg-forest-green text-champagne-gold rounded-full text-[10px] font-bold flex items-center space-x-2">
                                    <span>{type}</span>
                                    <button onClick={() => toggleType(type)} className="hover:text-white transition-colors">&times;</button>
                                </div>
                            ))}
                            {selectedAvailability.map(status => (
                                <div key={status} className="px-3 py-1 bg-forest-green/10 border border-forest-green text-forest-green rounded-full text-[10px] font-bold flex items-center space-x-2">
                                    <span>{status}</span>
                                    <button onClick={() => toggleAvailability(status)} className="hover:text-red-500 transition-colors">&times;</button>
                                </div>
                            ))}
                            {priceRange !== 'All Prices' && (
                                <div className="px-3 py-1 bg-champagne-gold/20 border border-champagne-gold text-forest-green rounded-full text-[10px] font-bold flex items-center space-x-2">
                                    <span>{priceRange}</span>
                                    <button onClick={() => setPriceRange('All Prices')} className="hover:text-red-500 transition-colors">&times;</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {filteredPuppies.length > 0 ? (
                    <div className="grid grid-cols-3 gap-8 mb-20 animate-in fade-in duration-700">
                        {filteredPuppies.map((puppy, i) => (
                            <PuppyCard
                                key={i}
                                {...puppy}
                                price={puppy.priceDisplay}
                                availability={puppy.availability}
                                onSelect={() => onPuppySelect(puppy)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center bg-forest-green/5 rounded-32 border border-dashed border-forest-green/20">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Search className="text-forest-green/20" size={32} />
                        </div>
                        <h3 className="font-playfair text-2xl text-forest-green mb-2">No matching dogs found</h3>
                        <p className="font-inter text-forest-green/40 text-sm max-w-xs mx-auto">
                            Try adjusting your filters or resetting your search to find your perfect companion.
                        </p>
                        <button
                            onClick={() => {
                                setSelectedTypes([]);
                                setSelectedAvailability([]);
                                setPriceRange('All Prices');
                                setSearchQuery('');
                            }}
                            className="mt-8 px-8 py-3 bg-forest-green text-champagne-gold font-bold uppercase tracking-widest text-xs rounded-lg hover:scale-105 transition-all"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default PuppiesPage;
