import React from 'react';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

const CartPage = ({ onPageChange, cart, onRemoveFromCart }) => {
    const totalAmount = cart.reduce((sum, item) => sum + (item.price || 0), 0);
    const formatPrice = (price) => {
        if (typeof price === 'string') return price;
        return `₹${(price / 100000).toFixed(1)}L`;
    };

    return (
        <div className="fixed-layout py-8 lg:py-16 px-4 lg:px-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 lg:mb-12 gap-4">
                <div>
                    <h1 className="font-playfair text-3xl lg:text-4xl text-forest-green mb-2">Your Puppy Cart</h1>
                    <p className="font-inter text-xs lg:text-sm text-forest-green/40 uppercase tracking-widest">Selected companions</p>
                </div>
                <button
                    onClick={() => onPageChange('puppies')}
                    className="font-inter text-[10px] lg:text-xs font-bold text-forest-green underline underline-offset-8 decoration-champagne-gold/40 hover:text-forest-green/60 transition-colors uppercase tracking-widest"
                >
                    Continue Browsing
                </button>
            </div>

            {cart.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
                    {/* Items List */}
                    <div className="lg:col-span-8 space-y-4 lg:space-y-6">
                        {cart.map((puppy, i) => (
                            <div key={i} className="flex flex-col sm:flex-row items-center p-4 lg:p-6 bg-white rounded-24 border border-forest-green/5 shadow-sm hover:shadow-md transition-all group gap-6">
                                <div className="w-full sm:w-32 h-48 sm:h-32 rounded-16 overflow-hidden shrink-0">
                                    <img src={puppy.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={puppy.breed} />
                                </div>
                                <div className="w-full flex-1">
                                    <div className="flex justify-between items-start mb-4 sm:mb-0">
                                        <div>
                                            <h3 className="font-playfair text-xl lg:text-2xl text-forest-green mb-1">{puppy.breed}</h3>
                                            <p className="font-inter text-[10px] text-forest-green/40 uppercase tracking-widest">Age: {puppy.age}</p>
                                        </div>
                                        <div className="text-lg lg:text-xl font-playfair text-forest-green">{puppy.priceDisplay || formatPrice(puppy.price)}</div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center space-x-2 text-[10px] font-bold text-forest-green/20 uppercase tracking-widest">
                                            <div className="w-1.5 h-1.5 rounded-full bg-forest-green"></div>
                                            <span>Premium Breeding Line</span>
                                        </div>
                                        <button
                                            onClick={() => onRemoveFromCart(puppy)}
                                            className="text-red-400 hover:text-red-600 transition-colors p-2"
                                            title="Remove Item"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Panel */}
                    <div className="lg:col-span-4">
                        <div className="bg-forest-green p-8 lg:p-10 rounded-32 text-ivory-white lg:sticky lg:top-32">
                            <h2 className="font-playfair text-xl lg:text-2xl text-champagne-gold mb-6 lg:mb-8 text-center sm:text-left">Summary</h2>

                            <div className="space-y-4 lg:space-y-6 mb-8 lg:mb-10 pb-8 lg:pb-10 border-b border-white/10">
                                <div className="flex justify-between items-center text-xs lg:text-sm">
                                    <span className="opacity-60 font-inter">Subtotal ({cart.length})</span>
                                    <span className="font-bold">{formatPrice(totalAmount)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs lg:text-sm">
                                    <span className="opacity-60 font-inter">Documentation</span>
                                    <span className="font-bold">Included</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-8 lg:mb-12">
                                <span className="font-inter text-[10px] uppercase tracking-widest opacity-60">Total</span>
                                <span className="text-3xl lg:text-4xl font-playfair text-champagne-gold">{formatPrice(totalAmount)}</span>
                            </div>

                            <button
                                onClick={() => onPageChange('contact')}
                                className="w-full py-5 bg-white text-forest-green font-bold uppercase tracking-widest text-[10px] lg:text-xs rounded-xl hover:bg-champagne-gold transition-colors flex items-center justify-center group shadow-xl active:scale-95"
                            >
                                <span>Complete Purchase</span>
                                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <div className="mt-8 text-center">
                                <p className="font-inter text-[8px] lg:text-[10px] opacity-40 uppercase tracking-[0.2em] leading-relaxed">
                                    Reservation deposit is 50%.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="py-20 lg:py-32 text-center bg-forest-green/5 rounded-32 border border-dashed border-forest-green/20">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-forest-green/10 rounded-full flex items-center justify-center mx-auto mb-8">
                        <ShoppingBag size={28} className="text-forest-green/40" />
                    </div>
                    <h2 className="font-playfair text-2xl lg:text-3xl text-forest-green mb-4">Cart is empty</h2>
                    <p className="font-inter text-xs lg:text-sm text-forest-green/60 mb-10 max-w-sm mx-auto leading-relaxed px-6">
                        Discover your perfect companion among our litters.
                    </p>
                    <button
                        onClick={() => onPageChange('puppies')}
                        className="px-8 py-4 bg-forest-green text-champagne-gold rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-all active:scale-95"
                    >
                        Browse Puppies
                    </button>
                </div>
            )}
        </div>
    );
};

export default CartPage;
