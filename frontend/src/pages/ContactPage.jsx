import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactPage = () => {
    return (
        <div className="fixed-layout py-24 px-10">
            <div className="grid grid-cols-12 gap-20">
                <div className="col-span-5">
                    <span className="font-inter text-xs uppercase tracking-[0.4em] text-forest-green/60 mb-6 block">Help Team</span>
                    <h1 className="font-playfair text-6xl text-forest-green mb-8">Talk To <span className="italic">Us</span>.</h1>
                    <p className="font-inter text-lg text-forest-green/70 leading-relaxed mb-12">
                        Need a puppy or have a question? Our team is here to help you with everything you need.
                    </p>

                    <div className="space-y-8">
                        <div className="flex items-start space-x-6">
                            <div className="w-12 h-12 bg-forest-green/5 rounded-lg flex items-center justify-center text-forest-green shrink-0">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h4 className="font-inter font-bold text-forest-green uppercase tracking-widest text-xs mb-2">Our Address</h4>
                                <p className="font-inter text-sm text-forest-green/60 leading-relaxed">
                                    123 Heritage Lane, <br />
                                    Ooty, Tamil Nadu 643001
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-6">
                            <div className="w-12 h-12 bg-forest-green/5 rounded-lg flex items-center justify-center text-forest-green shrink-0">
                                <Phone size={20} />
                            </div>
                            <div>
                                <h4 className="font-inter font-bold text-forest-green uppercase tracking-widest text-xs mb-2">Call Us</h4>
                                <p className="font-inter text-sm text-forest-green/60">+91 98765 43210</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-6">
                            <div className="w-12 h-12 bg-forest-green/5 rounded-lg flex items-center justify-center text-forest-green shrink-0">
                                <Mail size={20} />
                            </div>
                            <div>
                                <h4 className="font-inter font-bold text-forest-green uppercase tracking-widest text-xs mb-2">Email Us</h4>
                                <p className="font-inter text-sm text-forest-green/60">help@nsdogkennels.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-7">
                    <div className="bg-white p-12 rounded-24 shadow-2xl border border-forest-green/10">
                        <h2 className="font-playfair text-3xl text-forest-green mb-8">Send a Message</h2>
                        <form className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="font-inter text-[10px] uppercase font-bold text-forest-green/40 px-2 tracking-widest">Your Name</label>
                                    <input type="text" className="w-full bg-forest-green/5 border-none rounded-lg p-4 font-inter text-sm focus:ring-2 ring-forest-green transition-all" placeholder="Enter name" />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-inter text-[10px] uppercase font-bold text-forest-green/40 px-2 tracking-widest">Email Address</label>
                                    <input type="email" className="w-full bg-forest-green/5 border-none rounded-lg p-4 font-inter text-sm focus:ring-2 ring-forest-green transition-all" placeholder="Enter email" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="font-inter text-[10px] uppercase font-bold text-forest-green/40 px-2 tracking-widest">What do you need?</label>
                                <select className="w-full bg-forest-green/5 border-none rounded-lg p-4 font-inter text-sm focus:ring-2 ring-forest-green appearance-none">
                                    <option>Buying a Puppy</option>
                                    <option>Booking a Dog</option>
                                    <option>Grooming / Training</option>
                                    <option>Just a Question</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="font-inter text-[10px] uppercase font-bold text-forest-green/40 px-2 tracking-widest">Your Message</label>
                                <textarea className="w-full bg-forest-green/5 border-none rounded-lg p-4 font-inter text-sm focus:ring-2 ring-forest-green h-40" placeholder="Type your message here..."></textarea>
                            </div>

                            <button className="w-full py-5 bg-forest-green text-champagne-gold font-bold uppercase tracking-widest text-xs rounded-lg flex items-center justify-center space-x-3 hover:shadow-xl transition-all">
                                <Send size={16} />
                                <span>Send Message</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-32">
                <h2 className="font-playfair text-4xl text-forest-green mb-12 text-center">Questions People Ask</h2>
                <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                    {[
                        { q: 'How do I buy a puppy?', a: 'You can pay a 20% deposit to hold your puppy. We will send you photos and videos every week.' },
                        { q: 'Can you ship the dog to me?', a: 'Yes, we ship puppies safely to many countries in a comfortable way.' },
                        { q: 'Is the puppy healthy?', a: 'Yes, every puppy from us comes with a health check and we test their DNA too.' },
                        { q: 'Can I come and see the dogs?', a: 'Yes, but please call us first to book a time to visit.' },
                    ].map((faq, i) => (
                        <div key={i} className="p-8 border-b border-forest-green/10 hover:bg-forest-green/5 transition-colors group cursor-pointer">
                            <h4 className="font-playfair text-xl text-forest-green mb-4">{faq.q}</h4>
                            <p className="font-inter text-sm text-forest-green/60 leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
