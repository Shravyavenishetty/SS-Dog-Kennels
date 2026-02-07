import React from 'react';
import PuppyCard from '../components/PuppyCard';

const WishlistPage = ({ onPageChange, onPuppySelect, wishlist, onToggleWishlist }) => {
    return (
        <div className="fixed-layout py-16 px-10">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="font-playfair text-4xl text-forest-green mb-2">My Saved Dogs</h1>
                    <p className="font-inter text-sm text-forest-green/40 uppercase tracking-widest">Dogs you are interested in</p>
                </div>
                <button
                    onClick={() => onPageChange('puppies')}
                    className="px-6 py-2 border border-forest-green/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-forest-green hover:bg-forest-green hover:text-white transition-all"
                >
                    Find More Dogs
                </button>
            </div>

            {wishlist.length > 0 ? (
                <div className="grid grid-cols-4 gap-8">
                    {wishlist.map((puppy, i) => (
                        <PuppyCard
                            key={i}
                            {...puppy}
                            price={puppy.priceDisplay || puppy.price}
                            onSelect={() => onPuppySelect(puppy)}
                            isWishlisted={true}
                            onToggleWishlist={() => onToggleWishlist(puppy)}
                        />
                    ))}
                </div>
            ) : (
                <div className="py-32 text-center bg-forest-green/5 rounded-24 border border-dashed border-forest-green/20">
                    <p className="font-playfair text-2xl text-forest-green opacity-40">No dogs saved yet.</p>
                </div>
            )}
        </div>
    );
};

export default WishlistPage;
