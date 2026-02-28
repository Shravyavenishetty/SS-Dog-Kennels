import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = ({ onPageChange }) => {
    return (
        <footer className="bg-forest-green text-ivory-white py-8 lg:py-12 mt-0 border-t border-white/5">
            <div className="fixed-layout px-4 lg:px-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 mb-8 lg:mb-12">
                    {/* Brand Section */}
                    <div className="md:col-span-4 translate-y-0">
                        <div className="flex items-center space-x-3 mb-3 lg:mb-4">
                            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-champagne-gold rounded-full flex items-center justify-center text-forest-green font-playfair font-bold text-sm lg:text-base">SS</div>
                            <h2 className="font-playfair text-xl lg:text-2xl font-bold text-champagne-gold tracking-tight uppercase">SS DOG KENNELS</h2>
                        </div>
                        <p className="font-inter text-xs lg:text-sm leading-relaxed text-ivory-white/60 mb-4 lg:mb-6 max-w-sm">
                            Since 2020, we have been dedicated to raising the healthiest and happiest dogs. Our focus is on quality breeding and ensuring every puppy find a loving home.
                        </p>
                        <div className="flex space-x-4 lg:space-x-5">
                            <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-champagne-gold hover:border-champagne-gold transition-all">
                                <Instagram size={18} />
                            </button>
                            <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-champagne-gold hover:border-champagne-gold transition-all">
                                <Facebook size={18} />
                            </button>
                            <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-champagne-gold hover:border-champagne-gold transition-all">
                                <Twitter size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="md:col-span-5 grid grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-playfair text-base lg:text-lg text-white mb-4 lg:mb-6 uppercase tracking-widest">Our Kennel</h4>
                            <ul className="space-y-2 lg:space-y-3 font-inter text-xs lg:text-sm text-ivory-white/60">
                                <li><button onClick={() => onPageChange('puppies')} className="hover:text-champagne-gold transition-colors">Available Puppies</button></li>
                                <li><button onClick={() => onPageChange('stud')} className="hover:text-champagne-gold transition-colors">Stud Services</button></li>
                                <li><button onClick={() => onPageChange('about')} className="hover:text-champagne-gold transition-colors">Our Story</button></li>
                                <li><button onClick={() => onPageChange('services')} className="hover:text-champagne-gold transition-colors">Boarding & Care</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-playfair text-base lg:text-lg text-white mb-4 lg:mb-6 uppercase tracking-widest">Help Center</h4>
                            <ul className="space-y-2 lg:space-y-3 font-inter text-xs lg:text-sm text-ivory-white/60">
                                <li><button onClick={() => onPageChange('contact')} className="hover:text-champagne-gold transition-colors">Contact Team</button></li>
                                <li><button className="hover:text-champagne-gold transition-colors">Shipping Info</button></li>
                                <li><button className="hover:text-champagne-gold transition-colors">Health Guarantee</button></li>
                                <li><button className="hover:text-champagne-gold transition-colors">Buyer FAQ</button></li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="md:col-span-3">
                        <h4 className="font-playfair text-base lg:text-lg text-white mb-4 lg:mb-6 uppercase tracking-widest">Get in Touch</h4>
                        <div className="space-y-3 lg:space-y-4">
                            <div className="flex items-start space-x-4">
                                <MapPin size={18} className="text-champagne-gold shrink-0 mt-0.5" />
                                <span className="font-inter text-xs lg:text-sm text-ivory-white/60">NS Estate, Kennel Village,<br />Mahabaleshwar, India</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Phone size={18} className="text-champagne-gold shrink-0" />
                                <span className="font-inter text-xs lg:text-sm text-ivory-white/60">+91 98765 43210</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Mail size={18} className="text-champagne-gold shrink-0" />
                                <span className="font-inter text-xs lg:text-sm text-ivory-white/60">hello@nskennels.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-4 lg:pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-ivory-white/30 font-inter text-[10px] lg:text-xs">
                    <p className="mb-6 md:mb-0 text-center md:text-left">&copy; 2026 NS Dog Kennels. All rights reserved. Trusted since 1982.</p>
                    <div className="flex flex-wrap justify-center gap-4 lg:gap-8">
                        <button className="hover:text-champagne-gold transition-colors">Privacy Policy</button>
                        <button className="hover:text-champagne-gold transition-colors">Terms of Business</button>
                        <button className="hover:text-champagne-gold transition-colors">Cookie Policy</button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;