import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, MessageSquare, Send, CheckCircle2, ChevronLeft, Loader2, Home } from 'lucide-react';
import { submitPuppyInquiry } from '../lib/api';

const PuppyAdoptionWizard = ({ onPageChange, puppy }) => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, success, error
    const [formData, setFormData] = useState({
        name: '',
        phone: localStorage.getItem('userPhone') || '',
        email: '',
        address: '',
        notes: ''
    });

    if (!puppy) {
        return (
            <div className="py-20 text-center">
                <h2 className="font-playfair text-2xl text-forest-green mb-8">No puppy selected</h2>
                <button onClick={() => onPageChange('puppies')} className="px-10 py-4 bg-forest-green text-champagne-gold rounded-full font-bold uppercase tracking-widest text-xs">
                    View Catalog
                </button>
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await submitPuppyInquiry({
                puppyId: puppy.id,
                ...formData
            });
            setStatus('success');
            setStep(2);
        } catch (error) {
            console.error('Inquiry failed:', error);
            setStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (step === 2 && status === 'success') {
        return (
            <div className="fixed-layout py-20 lg:py-32 px-6 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="w-24 h-24 bg-forest-green/10 text-forest-green rounded-full flex items-center justify-center mb-8 animate-bounce">
                    <CheckCircle2 size={48} />
                </div>
                <h1 className="font-playfair text-4xl lg:text-5xl text-forest-green mb-6 text-center italic">Inquiry Received</h1>
                <p className="font-inter text-forest-green/60 text-center max-w-md mb-12 leading-relaxed">
                    Thank you, <span className="font-bold text-forest-green">{formData.name}</span>. We've received your interest in the <span className="font-bold text-forest-green">{puppy.breed}</span>.
                    Our lead breeder will contact you at <span className="font-bold text-forest-green text-xs tracking-tighter">{formData.phone}</span> shortly to discuss the next steps.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => onPageChange('home')}
                        className="px-10 py-5 bg-forest-green text-champagne-gold font-bold uppercase tracking-widest text-[10px] rounded-xl flex items-center space-x-3 shadow-xl hover:shadow-2xl transition-all"
                    >
                        <Home size={16} />
                        <span>Back to Home</span>
                    </button>
                    <button
                        onClick={() => onPageChange('puppies')}
                        className="px-10 py-5 border-2 border-forest-green text-forest-green font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-forest-green/5 transition-all"
                    >
                        View Other Pups
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed-layout py-8 lg:py-16 px-4 lg:px-10">
            <button
                onClick={() => onPageChange('puppy-detail')}
                className="flex items-center space-x-3 text-forest-green/40 hover:text-forest-green mb-8 transition-colors group"
            >
                <div className="w-8 h-8 rounded-full border border-forest-green/10 flex items-center justify-center group-hover:bg-forest-green group-hover:text-white transition-all text-sm">
                    <ChevronLeft size={16} />
                </div>
                <span className="font-inter text-[10px] uppercase tracking-widest font-bold">Back to {puppy.breed}</span>
            </button>

            <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
                    {/* Left: Summary */}
                    <div className="bg-forest-green p-8 lg:p-12 rounded-32 text-ivory-white sticky top-24">
                        <span className="font-inter text-[10px] uppercase font-bold tracking-[0.2em] text-champagne-gold/60 mb-6 block">Adoption Inquiry</span>
                        <h2 className="font-playfair text-3xl lg:text-4xl mb-8 leading-tight italic">Welcoming Your New Companion</h2>

                        <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10 mb-8">
                            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                                <img src={puppy.image} className="w-full h-full object-cover" alt={puppy.breed} />
                            </div>
                            <div>
                                <div className="font-playfair text-lg text-white">{puppy.breed}</div>
                                <div className="font-inter text-[10px] text-champagne-gold uppercase tracking-wider">{puppy.age} • {puppy.behavior}</div>
                            </div>
                        </div>

                        <ul className="space-y-6">
                            {[
                                "Admin will call to discuss temperament",
                                "Documentation/Health scan overview",
                                "Address coordination for delivery/pickup",
                                "Flexible payment options via consultation"
                            ].map((text, i) => (
                                <li key={i} className="flex items-start space-x-4">
                                    <div className="w-5 h-5 rounded-full bg-champagne-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-champagne-gold" />
                                    </div>
                                    <span className="font-inter text-sm text-ivory-white/70 leading-relaxed">{text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right: Form */}
                    <div className="pt-4 lg:pt-8">
                        <h3 className="font-playfair text-2xl lg:text-3xl text-forest-green mb-8">Personal & Address Details</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="font-inter text-[10px] uppercase font-bold text-forest-green/40 px-2 tracking-widest">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-forest-green/30" size={16} />
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-forest-green/5 border-none rounded-xl py-4 pl-12 pr-4 font-inter text-sm focus:ring-2 ring-forest-green/10 outline-none transition-all"
                                        placeholder="Ganesh..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="font-inter text-[10px] uppercase font-bold text-forest-green/40 px-2 tracking-widest">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-forest-green/30" size={16} />
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full bg-forest-green/5 border-none rounded-xl py-4 pl-12 pr-4 font-inter text-sm focus:ring-2 ring-forest-green/10 outline-none transition-all"
                                            placeholder="98765 43210"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="font-inter text-[10px] uppercase font-bold text-forest-green/40 px-2 tracking-widest">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-forest-green/30" size={16} />
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full bg-forest-green/5 border-none rounded-xl py-4 pl-12 pr-4 font-inter text-sm focus:ring-2 ring-forest-green/10 outline-none transition-all"
                                            placeholder="ganesh@example.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="font-inter text-[10px] uppercase font-bold text-forest-green/40 px-2 tracking-widest">Full Delivery Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-4 text-forest-green/30" size={16} />
                                    <textarea
                                        name="address"
                                        required
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full bg-forest-green/5 border-none rounded-xl p-4 pl-12 font-inter text-sm focus:ring-2 ring-forest-green/10 outline-none transition-all h-32 resize-none"
                                        placeholder="Street, City, Pincode..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="font-inter text-[10px] uppercase font-bold text-forest-green/40 px-2 tracking-widest">Special Requests (Optional)</label>
                                <div className="relative">
                                    <MessageSquare className="absolute left-4 top-4 text-forest-green/30" size={16} />
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        className="w-full bg-forest-green/5 border-none rounded-xl p-4 pl-12 font-inter text-sm focus:ring-2 ring-forest-green/10 outline-none transition-all h-24 resize-none"
                                        placeholder="Ask about diet, transport, etc."
                                    />
                                </div>
                            </div>

                            {status === 'error' && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold uppercase tracking-widest">
                                    Submission failed. Please try again.
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-5 bg-forest-green text-champagne-gold font-bold uppercase tracking-widest text-[10px] lg:text-xs rounded-xl flex items-center justify-center space-x-3 hover:shadow-2xl transition-all shadow-xl active:scale-95 disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                <span>Complete Booking</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PuppyAdoptionWizard;
