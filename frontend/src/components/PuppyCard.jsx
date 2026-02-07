import React from 'react';
import { Heart, ArrowRight } from 'lucide-react';

const PuppyCard = ({ image, breed, price, availability, age, onSelect, isWishlisted, onToggleWishlist }) => {
    return (
        <div
            onClick={onSelect}
            className="w-full bg-white rounded-24 lg:rounded-[32px] overflow-hidden border border-champagne-gold/10 group hover:shadow-2xl hover:shadow-forest-green/5 transition-all duration-500 hover:-translate-y-1 cursor-pointer"
        >
            {/* Image Container */}
            <div className="relative h-[200px] lg:h-[240px] overflow-hidden">
                <div className="absolute inset-0 bg-forest-green/10 group-hover:bg-transparent transition-colors duration-500"></div>
                <img
                    src={image || 'https://via.placeholder.com/320x240?text=Puppy'}
                    alt={breed}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 lg:top-4 right-3 lg:right-4">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleWishlist();
                        }}
                        className={`w-9 h-9 lg:w-10 lg:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors shadow-sm active:scale-95 group/heart ${isWishlisted ? 'text-red-500' : 'text-forest-green hover:text-red-500'}`}
                    >
                        <Heart size={16} className={`${isWishlisted ? 'fill-current' : 'group-hover/heart:fill-current'}`} />
                    </button>
                </div>
                <div className="absolute bottom-3 lg:bottom-4 left-3 lg:left-4">
                    <span className="bg-forest-green text-champagne-gold text-[8px] lg:text-[10px] font-bold uppercase tracking-widest px-3 py-1 lg:px-4 rounded-full">
                        {availability}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 lg:p-7">
                <div className="flex justify-between items-start mb-1 lg:mb-2">
                    <div>
                        <h3 className="font-playfair text-lg lg:text-2xl text-forest-green font-bold mb-1">{breed}</h3>
                        <p className="font-inter text-[10px] lg:text-xs text-forest-green/60 uppercase tracking-widest">{age}</p>
                    </div>
                    <span className="font-playfair text-base lg:text-xl text-forest-green font-medium">{price}</span>
                </div>

                <div className="h-[1px] w-full bg-champagne-gold/10 my-4 lg:my-6"></div>

                <button className="w-full py-3.5 lg:py-4 bg-transparent border border-forest-green/10 hover:border-forest-green hover:bg-forest-green hover:text-champagne-gold transition-all duration-500 rounded-xl flex items-center justify-center space-x-2 text-[10px] lg:text-[11px] font-bold uppercase tracking-widest text-forest-green group/btn">
                    <span>Explore Legacy</span>
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default PuppyCard;
