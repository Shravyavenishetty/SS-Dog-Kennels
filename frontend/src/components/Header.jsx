import React, { useState } from 'react';
import { Search, ShoppingCart, Menu, Heart, Shield, User, X } from 'lucide-react';

const Header = ({ onPageChange, wishlistCount, cartCount }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { label: 'Home', id: 'home' },
        { label: 'Puppies', id: 'puppies' },
        { label: 'Stud Dogs', id: 'stud' },
        { label: 'Services', id: 'services' },
        { label: 'About Us', id: 'about' },
        { label: 'Contact', id: 'contact' }
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-ivory/80 backdrop-blur-md border-b border-champagne-gold/20 h-[80px]">
            <div className="fixed-layout h-full flex items-center justify-between px-6 lg:px-10">
                {/* Logo */}
                <button
                    onClick={() => onPageChange('home')}
                    className="flex items-center space-x-2 z-50"
                >
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-forest-green rounded-full flex items-center justify-center text-champagne-gold font-playfair font-bold text-lg lg:text-xl">
                        SS
                    </div>
                    <span className="font-playfair text-xl lg:text-2xl font-bold tracking-tight text-forest-green">
                        SS DOG KENNELS
                    </span>
                </button>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-8">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onPageChange(item.id)}
                            className="font-inter text-sm font-medium tracking-wide text-forest-green/80 hover:text-forest-green transition-colors uppercase"
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Icons & Mobile Toggle */}
                <div className="flex items-center space-x-4 lg:space-x-6 z-50">
                    <button className="hidden sm:block text-forest-green hover:scale-110 transition-transform">
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
                    <button
                        onClick={() => onPageChange('cart')}
                        className="text-forest-green hover:scale-110 transition-transform relative"
                        title="Shopping Cart"
                    >
                        <ShoppingCart size={20} />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-forest-green text-champagne-gold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden text-forest-green p-2 hover:bg-forest-green/5 rounded-full transition-colors"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation Overlay */}
                <div className={`
                    fixed inset-0 bg-ivory z-40 lg:hidden transition-transform duration-500 ease-in-out
                    ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}
                `}>
                    <div className="flex flex-col items-center justify-center h-full space-y-8 px-10 pt-[80px]">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    onPageChange(item.id);
                                    setIsMenuOpen(false);
                                }}
                                className="font-playfair text-3xl font-bold text-forest-green hover:text-champagne-gold transition-colors"
                            >
                                {item.label}
                            </button>
                        ))}
                        <div className="pt-8 w-full">
                            <button
                                onClick={() => {
                                    onPageChange('contact');
                                    setIsMenuOpen(false);
                                }}
                                className="w-full py-4 bg-forest-green text-champagne-gold font-bold uppercase tracking-widest text-xs rounded-lg"
                            >
                                Get in Touch
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
