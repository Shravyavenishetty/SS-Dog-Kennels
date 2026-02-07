import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Menu, Heart, User, X, ArrowRight, LogOut } from 'lucide-react';

const Header = ({ onPageChange, wishlistCount, cartCount, isLoggedIn, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Prevent background scrolling when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMenuOpen]);

    const navItems = [
        { label: 'Home', id: 'home' },
        { label: 'Puppies', id: 'puppies' },
        { label: 'Stud Dogs', id: 'stud' },
        { label: 'Services', id: 'services' },
        { label: 'About Us', id: 'about' },
        { label: 'Contact', id: 'contact' }
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-ivory lg:bg-ivory/95 lg:backdrop-blur-md border-b border-champagne-gold/10 h-[56px] lg:h-[80px] transition-all duration-300">
            <div className="fixed-layout h-full flex items-center justify-between px-4 lg:px-10">
                {/* Logo Section */}
                <button
                    onClick={() => onPageChange('home')}
                    className="flex items-center space-x-2 lg:space-x-3"
                >
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-forest-green rounded-lg flex items-center justify-center text-champagne-gold shadow-sm">
                        <span className="font-playfair font-bold text-xs lg:text-base">SS</span>
                    </div>
                    <div className="flex flex-col items-start leading-tight">
                        <span className="font-playfair text-sm lg:text-xl font-black tracking-tight text-forest-green">
                            SS DOG KENNELS
                        </span>
                        <span className="hidden lg:block font-inter text-[10px] uppercase tracking-[0.3em] text-forest-green/50 font-bold mt-0.5">
                            Est. 1982 • Legacy of Excellence
                        </span>
                    </div>
                </button>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-8">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onPageChange(item.id)}
                            className="font-inter text-sm font-semibold tracking-wider text-forest-green/70 hover:text-forest-green transition-colors uppercase"
                        >
                            {item.label}
                        </button>
                    ))}
                    {isLoggedIn ? (
                        <button
                            onClick={onLogout}
                            className="font-inter text-sm font-semibold tracking-wider text-red-500 hover:text-red-600 transition-colors uppercase"
                        >
                            Logout
                        </button>
                    ) : (
                        <button
                            onClick={() => onPageChange('login')}
                            className="font-inter text-sm font-semibold tracking-wider text-forest-green/70 hover:text-forest-green transition-colors uppercase"
                        >
                            Login
                        </button>
                    )}
                </nav>

                {/* Actions & Toggle */}
                <div className="flex items-center space-x-0.5 sm:space-x-1 lg:space-x-4">
                    <button
                        onClick={() => onPageChange('wishlist')}
                        className="text-forest-green p-2 sm:p-2.5 hover:bg-forest-green/5 rounded-full transition-all relative"
                    >
                        <Heart size={20} className="w-5 h-5 lg:w-5 lg:h-5" />
                        {wishlistCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 bg-forest-green text-champagne-gold text-[7px] lg:text-[8px] w-3.5 h-3.5 lg:w-4 lg:h-4 rounded-full flex items-center justify-center font-bold">
                                {wishlistCount}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => onPageChange('profile')}
                        className="text-forest-green p-2 sm:p-2.5 hover:bg-forest-green/5 rounded-full transition-all"
                    >
                        <User size={20} className="w-5 h-5 lg:w-5 lg:h-5" />
                    </button>

                    <button
                        onClick={() => onPageChange('cart')}
                        className="text-forest-green p-2 sm:p-2.5 hover:bg-forest-green/5 rounded-full transition-all relative"
                    >
                        <ShoppingCart size={20} className="w-5 h-5 lg:w-5 lg:h-5" />
                        {cartCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 bg-forest-green text-champagne-gold text-[7px] lg:text-[8px] w-3.5 h-3.5 lg:w-4 lg:h-4 rounded-full flex items-center justify-center font-bold">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="lg:hidden w-10 h-10 flex items-center justify-center text-forest-green hover:bg-forest-green/5 rounded-full ml-1"
                    >
                        <Menu size={22} />
                    </button>
                </div>
            </div>

            {/* Mobile Drawer Overlay */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsMenuOpen(false)}
            >
                <div
                    className={`absolute top-0 right-0 w-[280px] h-full bg-ivory shadow-2xl transition-transform duration-300 ease-out flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between px-6 h-[56px] border-b border-champagne-gold/10">
                        <span className="font-playfair font-bold text-forest-green tracking-tight">MENU</span>
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="p-2 text-forest-green hover:bg-forest-green/5 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="px-4 py-4 flex flex-col space-y-1">
                        {/* Nav Items */}
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    onPageChange(item.id);
                                    setIsMenuOpen(false);
                                }}
                                className="flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-forest-green/5 group transition-colors"
                            >
                                <span className="font-playfair text-lg font-bold text-forest-green/80 group-hover:text-forest-green transition-colors">{item.label}</span>
                                <ArrowRight size={16} className="text-forest-green/20 group-hover:text-forest-green transition-all -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
                            </button>
                        ))}

                        {/* Auth Item */}
                        <div className="pt-4 mt-4 border-t border-champagne-gold/10">
                            {isLoggedIn ? (
                                <button
                                    onClick={() => {
                                        onLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl hover:bg-red-50 group transition-colors text-red-500"
                                >
                                    <span className="font-playfair text-lg font-bold">Logout</span>
                                    <LogOut size={16} className="opacity-40 group-hover:opacity-100 transition-all" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        onPageChange('login');
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl hover:bg-forest-green/5 group transition-colors"
                                >
                                    <span className="font-playfair text-lg font-bold text-forest-green/80 group-hover:text-forest-green transition-colors">Login</span>
                                    <ArrowRight size={16} className="text-forest-green/20 group-hover:text-forest-green transition-all -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="mt-auto p-6">
                        <button
                            onClick={() => {
                                onPageChange('contact');
                                setIsMenuOpen(false);
                            }}
                            className="w-full py-4 bg-forest-green text-champagne-gold font-bold uppercase tracking-widest text-[10px] rounded-xl shadow-lg active:scale-95 transition-transform"
                        >
                            Book a Consultation
                        </button>
                        <p className="text-center mt-6 font-inter text-[8px] text-forest-green/30 uppercase tracking-[0.2em] font-bold">
                            SS DOG KENNELS • Est. 1982
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
