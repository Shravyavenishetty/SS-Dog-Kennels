import React from 'react';
import { Search, ShoppingCart, Menu, Heart, Shield, User } from 'lucide-react';

const Header = ({ onPageChange, wishlistCount }) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-ivory/80 backdrop-blur-md border-b border-champagne-gold/20 h-[80px]">
            <div className="fixed-layout h-full flex items-center justify-between px-10">
                {/* Logo */}
                <button
                    onClick={() => onPageChange('home')}
                    className="flex items-center space-x-2"
                >
                    <div className="w-10 h-10 bg-forest-green rounded-full flex items-center justify-center text-champagne-gold font-playfair font-bold text-xl">
                        SS
                    </div>
                    <span className="font-playfair text-2xl font-bold tracking-tight text-forest-green">
                        SS DOG KENNELS
                    </span>
                </button>

                {/* Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    {[
                        { label: 'Home', id: 'home' },
                        { label: 'Puppies', id: 'puppies' },
                        { label: 'Stud Dogs', id: 'stud' },
                        { label: 'Services', id: 'services' },
                        { label: 'About Us', id: 'about' },
                        { label: 'Contact', id: 'contact' }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onPageChange(item.id)}
                            className="font-inter text-sm font-medium tracking-wide text-forest-green/80 hover:text-forest-green transition-colors uppercase"
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Icons */}
                <div className="flex items-center space-x-6">
                    <button className="text-forest-green hover:scale-110 transition-transform">
                        <Search size={20} />
                    </button>
                    <button
                        onClick={() => onPageChange('wishlist')}
                        className="text-forest-green hover:scale-110 transition-transform relative"
                        title="Saved Dogs"
                    >
                        <Heart size={20} />
                        {wishlistCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-forest-green text-champagne-gold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                                {wishlistCount}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => onPageChange('profile')}
                        className="text-forest-green hover:scale-110 transition-transform"
                        title="My Profile"
                    >
                        <User size={20} />
                    </button>
                    <button className="text-forest-green hover:scale-110 transition-transform relative">
                        <ShoppingCart size={20} />
                        <span className="absolute -top-2 -right-2 bg-forest-green text-champagne-gold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                            0
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
