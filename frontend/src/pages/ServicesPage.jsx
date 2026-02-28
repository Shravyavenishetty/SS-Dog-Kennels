import React, { useEffect, useState } from 'react';
import { Scissors, GraduationCap, Home, HeartPulse, ShieldCheck, Truck, Apple, Scale, MessageCircle, ArrowRight, Star } from 'lucide-react';
import { fetchServiceCategories } from '../lib/api';

const ServicesPage = ({ onPageChange, onServiceSelect }) => {
    const fallbackCategories = [
        {
            id: 'grooming-training',
            title: 'Grooming & Training',
            tagline: 'Precision Care & Elite Discipline',
            image: 'https://www.cgshospital.com/images/blog/groomingservices.jpeg',
            icon: Scissors,
            subServices: [
                'Full Grooming (Bath, Haircut, Nails)',
                'Puppy Grooming (Gentle First-Care)',
                'De-shedding & Coat Treatment',
                'Basic Obedience Training',
                'Advanced / Protection Training',
                'Puppy Socialization'
            ],
            priceRange: '₹1,500 - ₹25,000'
        },
        {
            id: 'boarding-daycare',
            title: 'Boarding & Day Care',
            tagline: 'Their Home Away From Home',
            image: 'https://cdn.prod.website-files.com/5742366615d374a826153265/612eb723f3ee1354b7556259_Boarding-Facility-1200.jpg',
            icon: Home,
            subServices: [
                'Short-term & Long-term Stays',
                'Luxury Suites (Private, AC)',
                'Live Camera Access for Owners',
                'Supervised Daily Playtime',
                'Day Care Supervision',
                'Personalized Feeding Plans'
            ],
            priceRange: '₹800 - ₹2,500 / Day'
        },
        {
            id: 'health-consultation',
            title: 'Health & Consultation',
            tagline: 'Professional Wellness Guidance',
            image: 'https://d3544la1u8djza.cloudfront.net/APHI/Blog/2022/04-18/woman%2Band%2Bdog%2Bhaving%2Ban%2Bonline%2Bconsultation%2Bwith%2Ba%2Bveterinarian-min.jpg',
            icon: HeartPulse,
            subServices: [
                'Vet Consultation (Online/In-person)',
                'Vaccination & Health Guidance',
                'Nutrition & Individual Diet Plans',
                'Post-adoption Health Checks',
                'Growth & Wellness Tracking',
                'DNA & Breed Health Screening'
            ],
            priceRange: 'Consultation starts ₹1,000'
        },
        {
            id: 'stud-breeding',
            title: 'Stud & Breeding',
            tagline: 'Elite Heritage & Support',
            image: 'https://www.ecad1.org/images/Breeding_Collage.jpg',
            icon: Star,
            subServices: [
                'Champion Stud Availability',
                'Pedigree & Bloodline Details',
                'Breeding Consultation',
                'Puppy Reservation Support',
                'Documentation & Registration',
                'Adoption Coordination'
            ],
            priceRange: 'Contact for Pricing'
        },
        {
            id: 'premium-logistics',
            title: 'Premium & Logistics',
            tagline: 'Global Support System',
            image: 'https://www.acrossthepondpet.com/images/blog/gl-10.jpg',
            icon: Truck,
            subServices: [
                'Domestic Pet Transport',
                'Safe Crate & Travel Support',
                'Airport Pickup / Drop-off',
                'Pet Insurance Guidance',
                'Ownership Transfer Support',
                'Microchipping Assistance'
            ],
            priceRange: 'Varies by Service'
        }
    ];
    const [categories, setCategories] = useState(() => {
        const cached = localStorage.getItem('ss_services_cache');
        return cached ? JSON.parse(cached) : [];
    });
    const [isLoading, setIsLoading] = useState(categories.length === 0);

    const iconMap = {
        scissors: Scissors,
        graduationcap: GraduationCap,
        "graduation-cap": GraduationCap,
        home: Home,
        heartpulse: HeartPulse,
        "heart-pulse": HeartPulse,
        shieldcheck: ShieldCheck,
        "shield-check": ShieldCheck,
        truck: Truck,
        apple: Apple,
        scale: Scale,
        messagecircle: MessageCircle,
        "message-circle": MessageCircle,
        star: Star
    };

    useEffect(() => {
        let mounted = true;
        fetchServiceCategories()
            .then((items) => {
                if (!mounted) return;
                setCategories(items);
                localStorage.setItem('ss_services_cache', JSON.stringify(items));
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load services from API:", err);
                if (mounted) setIsLoading(false);
            });
        return () => { mounted = false; };
    }, []);

    if (isLoading) {
        return (
            <div className="fixed-layout py-12 lg:py-24 px-4 lg:px-10 animate-pulse">
                <div className="max-w-4xl mb-16 lg:mb-24">
                    <div className="h-4 bg-forest-green/5 w-32 rounded mb-6" />
                    <div className="h-16 bg-forest-green/5 w-3/4 rounded mb-8" />
                    <div className="h-20 bg-forest-green/5 w-full rounded" />
                </div>
                <div className="space-y-20 lg:space-y-32">
                    {[1, 2].map(i => (
                        <div key={i} className="flex flex-col lg:flex-row gap-10 lg:gap-20">
                            <div className="w-full lg:w-1/2 h-[300px] lg:h-[500px] bg-forest-green/5 rounded-32" />
                            <div className="w-full lg:w-1/2 space-y-6 flex flex-col justify-center">
                                <div className="h-8 bg-forest-green/5 w-1/2 rounded" />
                                <div className="h-24 bg-forest-green/5 w-full rounded" />
                                <div className="h-12 bg-forest-green/5 w-1/3 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="fixed-layout py-12 lg:py-24 px-4 lg:px-10">
            {/* Header Section */}
            <div className="max-w-4xl mb-16 lg:mb-24">
                <span className="font-inter text-xs uppercase tracking-[0.4em] text-forest-green/60 mb-4 lg:mb-6 block font-bold">SS Care Ecosystem</span>
                <h1 className="font-playfair text-4xl lg:text-7xl text-forest-green mb-6 lg:mb-8 leading-tight">Professional Services for <br className="hidden sm:block" /><span className="italic text-champagne-gold underline decoration-forest-green/5 underline-offset-8">Every Stage.</span></h1>
                <p className="text-lg lg:text-xl text-forest-green/70 leading-relaxed font-inter">
                    From the first grooming session to lifelong boarding and elite breeding support, we ensure your companion receives the gold standard of care.
                </p>
            </div>

            {/* Comprehensive Categories */}
            <div className="space-y-20 lg:space-y-32">
                {categories.map((cat, index) => (
                    <div key={cat.id} className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-20 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                        {/* Image Panel */}
                        <div className="w-full lg:w-1/2 shadow-2xl rounded-24 lg:rounded-32 overflow-hidden relative group">
                            <img src={cat.image} alt={cat.title} className="w-full h-[300px] lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-forest-green/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8 lg:p-12">
                                <span className="text-white font-playfair text-xl lg:text-2xl italic">Trusted by thousands of owners.</span>
                            </div>
                        </div>

                        {/* Content Panel */}
                        <div className="w-full lg:w-1/2 flex flex-col justify-center">
                            <div className="flex items-center space-x-4 mb-4 lg:mb-6">
                                <div className="p-3 bg-forest-green/5 rounded-xl text-forest-green">
                                    {(() => {
                                        const IconComp = iconMap[cat.iconName?.toLowerCase()] || Star;
                                        return <IconComp size={20} className="lg:w-6 lg:h-6" />;
                                    })()}
                                </div>
                                <span className="font-inter text-[10px] lg:text-xs uppercase tracking-widest text-[#C5A059] font-bold">{cat.tagline}</span>
                            </div>

                            <h2 className="font-playfair text-3xl lg:text-5xl text-forest-green mb-6 lg:mb-8">{cat.title}</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 lg:gap-x-12 mb-8 lg:mb-12">
                                {cat.subServices.map((service, i) => (
                                    <div key={i} className="flex items-start space-x-3">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C5A059] shrink-0" />
                                        <span className="font-inter text-sm text-forest-green/70 leading-relaxed">{service}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-t border-forest-green/5 pt-8 lg:pt-10 gap-6 sm:gap-0">
                                <div>
                                    <span className="text-[10px] font-bold text-forest-green/40 uppercase tracking-widest block mb-1">Pricing Overview</span>
                                    <span className="font-playfair text-xl lg:text-2xl text-forest-green font-bold">{cat.priceRange}</span>
                                </div>
                                <button
                                    onClick={() => onServiceSelect(cat.id)}
                                    className="w-full sm:w-auto px-10 lg:px-12 py-4 lg:py-5 bg-forest-green text-champagne-gold font-bold uppercase tracking-widest text-[10px] lg:text-xs rounded-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center space-x-3"
                                >
                                    <span>Plan This Service</span>
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Support Section */}
            <div className="mt-24 lg:mt-48 bg-ivory rounded-32 lg:rounded-[40px] p-8 lg:p-24 text-center border border-forest-green/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/5 blur-3xl rounded-full"></div>
                <div className="max-w-2xl mx-auto relative z-10">
                    <ShieldCheck size={32} className="lg:w-12 lg:h-12 mx-auto text-forest-green mb-6 lg:mb-8" />
                    <h3 className="font-playfair text-2xl lg:text-4xl text-forest-green mb-4 lg:mb-6">Can't find what you need?</h3>
                    <p className="text-sm lg:text-base text-forest-green/60 mb-8 lg:mb-10 leading-relaxed font-inter">
                        Our help team is available for custom arrangements, including long-term breeding partnerships and international pet relocation.
                    </p>
                    <div className="flex flex-col sm:flex-row underline-offset-8 items-center justify-center gap-6">
                        <button
                            onClick={() => onPageChange('contact')}
                            className="w-full sm:w-auto px-10 py-4 lg:py-5 border-2 border-forest-green text-forest-green font-bold uppercase tracking-widest text-[10px] lg:text-xs rounded-xl hover:bg-forest-green hover:text-white transition-all"
                        >
                            Talk to our Help Team
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;
