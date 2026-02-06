import React from 'react';
import { Award, Heart, Users, MapPin } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="fixed-layout py-24 px-10">
            <div className="grid grid-cols-2 gap-20 items-center mb-32">
                <div>
                    <span className="font-inter text-xs uppercase tracking-[0.4em] text-forest-green/60 mb-6 block">Our Story</span>
                    <h1 className="font-playfair text-6xl text-forest-green mb-8 leading-tight">We Love Raising <span className="italic">Great Dogs</span>.</h1>
                    <p className="font-inter text-lg text-forest-green/70 leading-relaxed mb-8">
                        Starting in 1982, our family has worked hard to raise the best guard dogs and family pets. We believe every puppy deserves a loving home and a healthy start in life.
                    </p>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <div className="font-playfair text-4xl text-forest-green mb-2">44+</div>
                            <div className="font-inter text-xs uppercase tracking-widest text-forest-green/40">Years of Work</div>
                        </div>
                        <div>
                            <div className="font-playfair text-4xl text-forest-green mb-2">180+</div>
                            <div className="font-inter text-xs uppercase tracking-widest text-forest-green/40">Dog Show Wins</div>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <div className="aspect-[4/5] rounded-24 overflow-hidden shadow-2xl">
                        <img src="https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-10 -left-10 bg-forest-green p-10 rounded-24 text-champagne-gold shadow-2xl max-w-xs transition-transform hover:-translate-y-2">
                        <Award size={32} className="mb-4" />
                        <h4 className="font-playfair text-xl mb-2">Trusted Breeders</h4>
                        <p className="font-inter text-xs opacity-70 leading-relaxed">We follow the best rules to make sure every puppy is healthy and happy.</p>
                    </div>
                </div>
            </div>

            <div className="bg-forest-green/5 rounded-24 p-20 mb-32">
                <div className="text-center mb-20 text-forest-green">
                    <h2 className="font-playfair text-5xl mb-6">Where We Work</h2>
                    <p className="max-w-xl mx-auto opacity-70">Our farm is the perfect place for puppies to grow, run around, and meet people.</p>
                </div>
                <div className="grid grid-cols-3 gap-10">
                    {[
                        { title: 'Health Lab', desc: 'Where we do health and DNA tests for every dog.' },
                        { title: 'Play Grounds', desc: '10 acres of land where puppies play and learn.' },
                        { title: 'Puppy Rooms', desc: 'Clean and warm rooms where our dogs live and sleep.' },
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-10 rounded-24 border border-forest-green/10 shadow-sm">
                            <h3 className="font-playfair text-2xl text-forest-green mb-4">{item.title}</h3>
                            <p className="font-inter text-sm text-forest-green/60 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center">
                <h2 className="font-playfair text-4xl text-forest-green mb-12 italic">People Trust Us</h2>
                <div className="flex justify-center items-center space-x-20 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                    <div className="font-playfair font-bold text-2xl">AKC</div>
                    <div className="font-playfair font-bold text-2xl">FCI</div>
                    <div className="font-playfair font-bold text-2xl">KCI</div>
                    <div className="font-playfair font-bold text-2xl">UKC</div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
