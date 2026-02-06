import React from 'react';
import PuppyCard from '../components/PuppyCard';

const WishlistPage = ({ onPuppySelect }) => {
    // Demo data for saved dogs
    const savedPuppies = [
        { breed: 'Caucasian Shepherd', price: '₹4.5L', age: '8 Weeks', availability: 'Available', image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400' },
        { breed: 'French Bulldog', price: '₹2.8L', age: '10 Weeks', availability: 'Available', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=400' },
    ];

    return (
        <div className="fixed-layout py-16 px-10">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="font-playfair text-4xl text-forest-green mb-2">My Saved Dogs</h1>
                    <p className="font-inter text-sm text-forest-green/40 uppercase tracking-widest">Dogs you are interested in</p>
                </div>
            </div>

            {savedPuppies.length > 0 ? (
                <div className="grid grid-cols-4 gap-8">
                    {savedPuppies.map((puppy, i) => (
                        <PuppyCard
                            key={i}
                            {...puppy}
                            onSelect={() => onPuppySelect(puppy)}
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
