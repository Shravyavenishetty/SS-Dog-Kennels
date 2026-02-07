import React from 'react';
import { Scissors, GraduationCap, Home, HeartPulse, Clock, Sparkles, ShieldCheck } from 'lucide-react';

const ServicesPage = ({ onPageChange }) => {
    const services = [
        {
            id: 'grooming',
            title: 'Elite Grooming',
            description: 'Full-service spa treatment including bath, hair-cut, nail trimming, and ear cleaning. We use premium organic shampoos tailored to your dog\'s coat type.',
            price: 'Starting at ₹1,500',
            duration: '2-3 Hours',
            icon: Scissors,
            benefits: ['Coat Conditioning', 'Stress-free environment', 'Expert Stylists']
        },
        {
            id: 'training',
            title: 'Professional Training',
            description: 'From basic obedience to advanced behavioral correction. Our certified trainers use positive reinforcement techniques to build lasting bonds.',
            price: 'Starting at ₹15,000',
            duration: '10 Sessions',
            icon: GraduationCap,
            benefits: ['KCI Standards', 'Socialization', 'Home Integration']
        },
        {
            id: 'boarding',
            title: 'Luxury Boarding',
            description: 'Climate-controlled individual suites with 24/7 supervision. Includes daily exercise, social playtime, and personalized feeding schedules.',
            price: '₹1,200 / Night',
            duration: '24/7 Care',
            icon: Home,
            benefits: ['Live Feed Access', 'Veterinary On-call', 'Spacious Play Yards']
        },
        {
            id: 'health',
            title: 'Wellness Check',
            description: 'Comprehensive health assessment including vaccinations, parasite control, and nutritional consulting for puppies and adults.',
            price: '₹2,500',
            duration: '45 Minutes',
            icon: HeartPulse,
            benefits: ['Health Records', 'Growth Tracking', 'Diet Plans']
        }
    ];

    return (
        <div className="fixed-layout py-24 px-10">
            {/* Header Section */}
            <div className="mb-20">
                <span className="font-inter text-xs uppercase tracking-[0.4em] text-forest-green/60 mb-6 block font-bold">NS Care Services</span>
                <h1 className="font-playfair text-6xl text-forest-green mb-8 leading-tight">Expert Care for your <br /><span className="italic text-champagne-gold underline decoration-forest-green/5 underline-offset-8">Best Friend.</span></h1>
                <p className="max-w-2xl text-lg text-forest-green/60 leading-relaxed">
                    Our commitment to excellence extends beyond breeding. We provide lifelong support through professional grooming, training, and sanctuary boarding.
                </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-24">
                {services.map((service, index) => (
                    <div key={index} className="bg-white rounded-32 border border-forest-green/5 shadow-22 shadow-forest-green/5 p-12 hover:shadow-32 hover:border-champagne-gold/20 transition-all group overflow-hidden relative">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-forest-green/5 rounded-full blur-3xl group-hover:bg-champagne-gold/10 transition-colors"></div>

                        <div className="flex items-start justify-between mb-10">
                            <div className="w-16 h-16 bg-forest-green rounded-2xl flex items-center justify-center text-champagne-gold shadow-xl group-hover:scale-110 transition-transform">
                                <service.icon size={32} />
                            </div>
                            <div className="text-right">
                                <span className="font-playfair text-2xl text-forest-green font-bold block">{service.price}</span>
                                <span className="text-[10px] font-bold text-forest-green/40 uppercase tracking-widest flex items-center justify-end mt-1">
                                    <Clock size={12} className="mr-1" /> {service.duration}
                                </span>
                            </div>
                        </div>

                        <h3 className="font-playfair text-3xl text-forest-green mb-4">{service.title}</h3>
                        <p className="font-inter text-forest-green/60 leading-relaxed mb-8">
                            {service.description}
                        </p>

                        <div className="flex flex-wrap gap-4 mb-10">
                            {service.benefits.map((benefit, i) => (
                                <span key={i} className="px-3 py-1 bg-ivory text-forest-green/60 text-[10px] uppercase font-bold tracking-widest rounded-full border border-forest-green/5">
                                    {benefit}
                                </span>
                            ))}
                        </div>

                        <button
                            onClick={() => onPageChange('booking-wizard')}
                            className="w-full py-5 bg-forest-green text-champagne-gold font-bold uppercase tracking-widest text-xs rounded-xl hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center space-x-3"
                        >
                            <Sparkles size={16} />
                            <span>Book {service.title}</span>
                        </button>
                    </div>
                ))}
            </div>

            {/* Quality Promise Section */}
            <div className="bg-forest-green rounded-[40px] p-20 text-ivory flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 blur-[120px] rounded-full"></div>
                <ShieldCheck size={48} className="text-champagne-gold mb-8" />
                <h2 className="font-playfair text-5xl mb-6">Our Quality Promise</h2>
                <p className="max-w-2xl text-white/60 mb-12 text-lg">
                    Every service is supervised by our senior breeding team. We ensure that the dogs in our care receive the same respect and affection as our home champions.
                </p>
                <div className="flex space-x-12">
                    <div className="text-center">
                        <div className="text-3xl font-playfair text-champagne-gold mb-1">100%</div>
                        <div className="text-[10px] uppercase font-bold tracking-widest text-white/40">Organic Products</div>
                    </div>
                    <div className="text-center border-x border-white/10 px-12">
                        <div className="text-3xl font-playfair text-champagne-gold mb-1">Top Tier</div>
                        <div className="text-[10px] uppercase font-bold tracking-widest text-white/40">KCI Certified</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-playfair text-champagne-gold mb-1">Safe</div>
                        <div className="text-[10px] uppercase font-bold tracking-widest text-white/40">24/7 CCTV</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;
