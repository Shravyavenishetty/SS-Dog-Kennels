import React from 'react';
import { ArrowRight, Play, Award, ShieldCheck, Heart, Star, Calendar, MessageCircle } from 'lucide-react';
import PuppyCard from '../components/PuppyCard';
import LitterCounter from '../components/LitterCounter';

const HomePage = ({ onPageChange, onPuppySelect }) => {
    const featuredPuppies = [
        { breed: 'Caucasian Shepherd', price: '₹4.5L', age: '8 Weeks', availability: 'Available', image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400' },
        { breed: 'Tibetan Mastiff', price: '₹12L', age: '12 Weeks', availability: 'Reserved', image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=400' },
        { breed: 'French Bulldog', price: '₹2.8L', age: '10 Weeks', availability: 'Available', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800' },
        { breed: 'Golden Retriever', price: '₹1.5L', age: '9 Weeks', availability: 'Available', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400' },
    ];

    const testimonials = [
        { name: 'Arjun Sharma', text: 'Finding our Labrador through NS Kennels was the best decision. The level of care they show for their pups is visible from day one.', location: 'Mumbai' },
        { name: 'Priya Patel', text: 'Our Caucasian Shepherd is not just a dog; he is a protector. Healthy, strong, and very well-behaved from the start.', location: 'Delhi' },
        { name: 'Dr. Vivek R.', text: 'As a vet, I am very picky. NS Kennels has some of the healthiest breeding lines I have seen in the country.', location: 'Bangalore' },
    ];

    return (
        <div className="flex flex-col">
            {/* Improved Hero Section with Emotional Imagery */}
            <section className="relative h-[600px] lg:h-[850px] w-full overflow-hidden bg-forest-green">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=1600"
                        className="w-full h-full object-cover"
                        alt="Puppy with child - Emotional Connection"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-forest-green/80 via-forest-green/40 to-transparent"></div>

                <div className="fixed-layout relative h-full flex flex-col justify-center px-6 lg:px-10 mt-12 lg:mt-0">
                    <div className="max-w-2xl animate-in fade-in slide-in-from-left-8 duration-1000">
                        <span className="font-inter text-[10px] lg:text-xs uppercase tracking-[0.4em] text-champagne-gold mb-4 lg:mb-6 block drop-shadow-lg">44 Years of Trust • Family Business</span>
                        <h1 className="font-playfair text-4xl lg:text-7xl text-white leading-tight mb-6 lg:mb-8 drop-shadow-2xl">
                            Find Your New <br className="hidden sm:block" />
                            <span className="italic text-champagne-gold">Best Friend.</span>
                        </h1>
                        <p className="font-inter text-sm lg:text-lg text-ivory-white/90 leading-relaxed mb-8 lg:mb-10 max-w-xl drop-shadow-md">
                            We raise healthy, happy dogs that become more than just pets—they become family. Every puppy is born with love and raised with care.
                        </p>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <button
                                onClick={() => onPageChange('puppies')}
                                className="px-10 py-5 bg-champagne-gold text-forest-green font-bold uppercase tracking-widest text-xs rounded-lg hover:shadow-[0_0_30px_rgba(247,231,206,0.3)] transition-all transform hover:-translate-y-1"
                            >
                                View Puppies
                            </button>
                            <button
                                onClick={() => onPageChange('services')}
                                className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-white/20 transition-all transform hover:-translate-y-1"
                            >
                                Book a Service
                            </button>
                        </div>
                    </div>

                    <div className="hidden sm:flex absolute right-6 lg:right-10 bottom-10 lg:bottom-20 space-x-8 lg:space-x-12">
                        <div className="text-white drop-shadow-lg">
                            <div className="font-playfair text-3xl lg:text-4xl mb-1 text-champagne-gold">24+</div>
                            <div className="font-inter text-[10px] uppercase tracking-widest opacity-70">Happy Litters</div>
                        </div>
                        <div className="text-white drop-shadow-lg">
                            <div className="font-playfair text-3xl lg:text-4xl mb-1 text-champagne-gold">180+</div>
                            <div className="font-inter text-[10px] uppercase tracking-widest opacity-70">Top Awards</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Bar */}
            <div className="bg-ivory border-b border-champagne-gold/10 py-8 lg:py-10 shadow-sm overflow-hidden">
                <div className="fixed-layout px-6 lg:px-10 flex flex-wrap lg:flex-nowrap gap-8 justify-between items-center opacity-40 grayscale hover:opacity-70 transition-opacity">
                    <div className="flex items-center space-x-3">
                        <Award size={28} className="lg:w-8 lg:h-8" />
                        <span className="font-playfair font-bold text-lg lg:text-xl tracking-tighter uppercase">Certified Breeders</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <ShieldCheck size={28} className="lg:w-8 lg:h-8" />
                        <span className="font-playfair font-bold text-lg lg:text-xl tracking-tighter uppercase">Health Clearance</span>
                    </div>
                    <div className="font-playfair font-bold text-xl lg:text-2xl tracking-tighter">KCI REGISTERED</div>
                    <div className="font-playfair font-bold text-xl lg:text-2xl tracking-tighter italic">ESTD. 1982</div>
                </div>
            </div>

            {/* Featured Puppies Grid */}
            <section id="puppies" className="bg-white py-20 lg:py-32">
                <div className="fixed-layout px-6 lg:px-10">
                    <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-12 lg:mb-20 border-b border-forest-green/5 pb-10">
                        <div className="mb-6 lg:mb-0">
                            <span className="font-inter text-xs uppercase tracking-widest text-forest-green/60 mb-2 lg:mb-4 block">Our Current Selection</span>
                            <h2 className="text-4xl lg:text-6xl text-forest-green font-playfair">Featured Puppies</h2>
                        </div>
                        <button
                            onClick={() => onPageChange('puppies')}
                            className="flex items-center space-x-2 text-forest-green font-bold uppercase tracking-widest text-xs group w-fit"
                        >
                            <span>See All Puppies</span>
                            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {featuredPuppies.map((puppy, i) => (
                            <PuppyCard
                                key={i}
                                {...puppy}
                                onSelect={() => onPuppySelect(puppy)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Preview Section */}
            <section className="bg-forest-green py-20 lg:py-32 text-ivory-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-champagne-gold/5 blur-[120px] rounded-full"></div>

                <div className="fixed-layout px-6 lg:px-10 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
                        <div>
                            <span className="font-inter text-xs uppercase tracking-[0.4em] text-champagne-gold/60 mb-4 lg:mb-6 block">Care for Life</span>
                            <h2 className="text-4xl lg:text-6xl text-white font-playfair mb-6 lg:mb-8 leading-tight">Professional Services for <br className="hidden sm:block" /><span className="italic text-champagne-gold">Every Stage.</span></h2>
                            <p className="font-inter text-base lg:text-lg text-ivory-white/60 mb-8 lg:mb-12 max-w-lg leading-relaxed">
                                From the first grooming session to lifelong boarding and training, we are here to support you and your new companion.
                            </p>
                            <button
                                onClick={() => onPageChange('services')}
                                className="w-full sm:w-auto px-10 py-5 bg-champagne-gold text-forest-green font-bold uppercase tracking-widest text-xs rounded-lg hover:scale-105 transition-all"
                            >
                                Book a Service
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                            {[
                                { title: 'Grooming', icon: Award, desc: 'Keeping them clean & happy.' },
                                { title: 'Training', icon: ShieldCheck, desc: 'Help them listen better.' },
                                { title: 'Boarding', icon: Heart, desc: 'A safe home away from home.' },
                                { title: 'Health', icon: MessageCircle, desc: 'Expert advice anytime.' },
                            ].map((s, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 p-6 lg:p-8 rounded-24 hover:bg-white/10 transition-colors">
                                    <s.icon className="text-champagne-gold mb-4 lg:mb-6" size={24} />
                                    <h4 className="font-playfair text-xl mb-2">{s.title}</h4>
                                    <p className="font-inter text-xs text-ivory-white/40">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stud Availability Preview */}
            <section className="py-20 lg:py-32 bg-ivory">
                <div className="fixed-layout px-6 lg:px-10">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-20">
                        <div className="lg:flex-1">
                            <span className="font-inter text-xs uppercase tracking-widest text-forest-green/60 mb-4 block">Breeding Partners</span>
                            <h2 className="text-4xl lg:text-5xl text-forest-green font-playfair mb-6 lg:mb-8">Champion Stud Dogs</h2>
                            <p className="font-inter text-base lg:text-lg text-forest-green/60 mb-8 max-w-lg leading-relaxed">
                                We offer stud services with some of the strongest and healthiest male dogs in India. Available for approved breeding partners only.
                            </p>
                            <div className="space-y-4 mb-10">
                                <div className="flex items-center space-x-3 text-forest-green font-bold text-sm tracking-wide">
                                    <Calendar size={18} className="text-forest-green/40" />
                                    <span>Check Current Availability</span>
                                </div>
                                <div className="flex items-center space-x-3 text-forest-green font-bold text-sm tracking-wide">
                                    <Award size={18} className="text-forest-green/40" />
                                    <span>Show Quality Profiles</span>
                                </div>
                            </div>
                            <button
                                onClick={() => onPageChange('stud')}
                                className="flex items-center space-x-3 text-forest-green font-bold uppercase tracking-widest text-xs group w-fit"
                            >
                                <span>See Stud Profiles</span>
                                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>
                        <div className="lg:flex-1 grid grid-cols-2 gap-4">
                            <div className="rounded-24 overflow-hidden h-[300px] lg:h-[400px]">
                                <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Stud" />
                            </div>
                            <div className="rounded-24 overflow-hidden h-[300px] lg:h-[400px] mt-8 lg:mt-12">
                                <img src="https://images.unsplash.com/photo-1560743173-567a3b5658b1?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Stud 2" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 lg:py-32 bg-white">
                <div className="fixed-layout px-6 lg:px-10 text-center">
                    <span className="font-inter text-xs uppercase tracking-[0.4em] text-forest-green/40 mb-4 lg:mb-6 block">Customer Stories</span>
                    <h2 className="text-4xl lg:text-5xl text-forest-green font-playfair mb-12 lg:mb-20 leading-tight">Shared Love for <br className="hidden sm:block" /><span className="italic">Grown Pups.</span></h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                        {testimonials.map((t, i) => (
                            <div key={i} className="text-left p-8 lg:p-10 bg-ivory/30 rounded-24 border border-forest-green/5 hover:border-champagne-gold/40 transition-all group">
                                <div className="flex space-x-1 mb-6">
                                    {[1, 2, 3, 4, 5].map(star => <Star key={star} size={14} fill="#C5A059" className="text-champagne-gold" />)}
                                </div>
                                <p className="font-inter text-sm lg:text-base text-forest-green/80 italic mb-8 leading-relaxed">"{t.text}"</p>
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-forest-green rounded-full flex items-center justify-center text-champagne-gold font-bold text-xs">{t.name[0]}</div>
                                    <div>
                                        <div className="font-playfair font-bold text-forest-green">{t.name}</div>
                                        <div className="text-[10px] text-forest-green/40 font-bold uppercase tracking-widest">{t.location}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final Story CTA */}
            <section className="bg-ivory py-20 lg:py-32">
                <div className="fixed-layout px-6 lg:px-10 flex flex-col items-center text-center">
                    <LitterCounter />
                    <p className="mt-8 font-inter text-forest-green/40 text-[10px] lg:text-xs uppercase tracking-widest mb-8 lg:mb-12">Puppies found their homes in 44 years</p>
                    <h3 className="text-3xl lg:text-4xl text-forest-green font-playfair mb-8 max-w-2xl px-4">Ready to welcome your next family member?</h3>
                    <button
                        onClick={() => onPageChange('contact')}
                        className="w-full sm:w-auto px-12 py-6 bg-forest-green text-champagne-gold font-bold uppercase tracking-widest text-xs rounded-lg shadow-2xl hover:scale-105 transition-transform"
                    >
                        Talk to our Breeders
                    </button>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
