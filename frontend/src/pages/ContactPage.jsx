import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { fetchFaqs } from '../lib/api';

const ContactPage = () => {
    const [faqs, setFaqs] = useState([]);

    useEffect(() => {
        let mounted = true;
        fetchFaqs()
            .then((items) => {
                if (!mounted) return;
                setFaqs(items);
            })
            .catch((err) => {
                console.error("Failed to load FAQs from API:", err);
            });
        return () => { mounted = false; };
    }, []);

    return (
        <div className="fixed-layout py-12 lg:py-24 px-4 lg:px-10">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                <div className="w-full lg:w-[40%]">
                    <span className="font-inter text-xs uppercase tracking-[0.4em] text-forest-green/60 mb-4 lg:mb-6 block">Help Team</span>
                    <h1 className="font-playfair text-4xl lg:text-7xl text-forest-green mb-6 lg:mb-8 leading-tight">Talk To <span className="italic text-champagne-gold">Us</span>.</h1>
                    <p className="font-inter text-sm lg:text-lg text-forest-green/70 leading-relaxed mb-8 lg:mb-12">
                        Questions about a companion or service? Professional assistance at every step.
                    </p>

                    <div className="space-y-6 lg:space-y-8">
                        <div className="flex items-start space-x-5 lg:space-x-6">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-forest-green/5 rounded-lg flex items-center justify-center text-forest-green shrink-0">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h4 className="font-inter font-bold text-forest-green uppercase tracking-widest text-[10px] mb-1">Our Address</h4>
                                <p className="font-inter text-xs lg:text-sm text-forest-green/60 leading-relaxed">
                                    Heritage Lane, Ooty <br />
                                    Tamil Nadu, India
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-5 lg:space-x-6">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-forest-green/5 rounded-lg flex items-center justify-center text-forest-green shrink-0">
                                <Phone size={20} />
                            </div>
                            <div>
                                <h4 className="font-inter font-bold text-forest-green uppercase tracking-widest text-[10px] mb-1">Call Us</h4>
                                <p className="font-inter text-xs lg:text-sm text-forest-green/60">+91 98765 43210</p>
                            </div>
                        </div>

                        <div className="flex items-start space-y-3 lg:space-y-0 lg:space-x-6 flex-col sm:flex-row">
                            <div className="flex items-start space-x-5 lg:space-x-6">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-forest-green/5 rounded-lg flex items-center justify-center text-forest-green shrink-0">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <h4 className="font-inter font-bold text-forest-green uppercase tracking-widest text-[10px] mb-1">Email Us</h4>
                                    <p className="font-inter text-xs lg:text-sm text-forest-green/60 break-all">help@nsdogkennels.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-[60%]">
                    <div className="bg-white p-8 lg:p-12 rounded-32 shadow-2xl border border-forest-green/10">
                        <h2 className="font-playfair text-2xl lg:text-3xl text-forest-green mb-6 lg:mb-8 text-center sm:text-left">Send a Message</h2>
                        <form className="space-y-4 lg:space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                                <div className="space-y-2">
                                    <label className="font-inter text-[10px] uppercase font-bold text-forest-green/40 px-2 tracking-widest">Your Name</label>
                                    <input type="text" className="w-full bg-forest-green/5 border-none rounded-xl p-4 font-inter text-sm focus:ring-2 ring-forest-green/10 outline-none transition-all" placeholder="Ganesh..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-inter text-[10px] uppercase font-bold text-forest-green/40 px-2 tracking-widest">Email Address</label>
                                    <input type="email" className="w-full bg-forest-green/5 border-none rounded-xl p-4 font-inter text-sm focus:ring-2 ring-forest-green/10 outline-none transition-all" placeholder="hello@example.com" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="font-inter text-[10px] uppercase font-bold text-forest-green/40 px-2 tracking-widest">What do you need?</label>
                                <select className="w-full bg-forest-green/5 border-none rounded-xl p-4 font-inter text-sm focus:ring-2 ring-forest-green/10 outline-none transition-all appearance-none cursor-pointer">
                                    <option>Buying a Puppy</option>
                                    <option>Booking a Dog</option>
                                    <option>Grooming / Training</option>
                                    <option>General Inquiry</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="font-inter text-[10px] uppercase font-bold text-forest-green/40 px-2 tracking-widest">Your Message</label>
                                <textarea className="w-full bg-forest-green/5 border-none rounded-xl p-4 font-inter text-sm focus:ring-2 ring-forest-green/10 outline-none transition-all h-32 lg:h-40 resize-none" placeholder="Type message here..."></textarea>
                            </div>

                            <button className="w-full py-5 bg-forest-green text-champagne-gold font-bold uppercase tracking-widest text-[10px] lg:text-xs rounded-xl flex items-center justify-center space-x-3 hover:shadow-2xl transition-all shadow-xl active:scale-95">
                                <Send size={16} />
                                <span>Send Message</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-20 lg:mt-32">
                <h2 className="font-playfair text-3xl lg:text-4xl text-forest-green mb-8 lg:mb-12 text-center">Frequently Asked</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 lg:gap-y-6">
                    {faqs.map((faq, i) => (
                        <div key={i} className="p-6 lg:p-8 border-b border-forest-green/10 hover:bg-forest-green/5 transition-colors group cursor-pointer rounded-xl">
                            <h4 className="font-playfair text-lg lg:text-xl text-forest-green mb-3 lg:mb-4">{faq.q}</h4>
                            <p className="font-inter text-xs lg:text-sm text-forest-green/60 leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
