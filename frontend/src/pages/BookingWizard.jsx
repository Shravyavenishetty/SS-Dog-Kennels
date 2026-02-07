import React, { useState } from 'react';
import { Check, Calendar, CreditCard, User } from 'lucide-react';

const BookingWizard = ({ onPageChange, initialService }) => {
    const [step, setStep] = useState(initialService ? 2 : 1);
    const [selectedSubService, setSelectedSubService] = useState(null);

    const serviceMap = {
        'grooming-training': ['Full Grooming', 'Puppy Grooming', 'De-shedding', 'Obedience Training', 'Protection Training', 'Puppy Socialization'],
        'boarding-daycare': ['Short-term Stay', 'Long-term Stay', 'Luxury Suite', 'Day Care Supervision'],
        'health-consultation': ['Vet Consultation', 'Vaccination Guide', 'Nutrition Planning', 'Health Check'],
        'stud-breeding': ['Breeding Consult', 'Reservation Support', 'Documentation Only'],
        'premium-logistics': ['Domestic Transport', 'Airport Pickup', 'Insurance Help', 'Microchipping']
    };

    const currentSubServices = serviceMap[initialService] || ['Grooming', 'Dog Training', 'Dog Boarding', 'Health Check'];

    return (
        <div className="fixed-layout py-8 lg:py-24 px-4 lg:px-10">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => onPageChange('services')}
                    className="flex items-center space-x-3 text-forest-green/40 hover:text-forest-green mb-8 lg:mb-12 transition-colors group"
                >
                    <div className="w-8 h-8 rounded-full border border-forest-green/10 flex items-center justify-center group-hover:bg-forest-green group-hover:text-white transition-all text-sm">
                        ←
                    </div>
                    <span className="font-inter text-[10px] uppercase tracking-widest font-bold">Back to Services</span>
                </button>

                {/* Progress Bar */}
                <div className="flex justify-between items-center mb-12 lg:mb-20 relative px-4">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-forest-green/10 -z-10"></div>
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex flex-col items-center bg-ivory">
                            <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 text-xs lg:text-base ${step >= s ? 'bg-forest-green border-forest-green text-champagne-gold' : 'bg-white border-forest-green/20 text-forest-green/40'}`}>
                                {step > s ? <Check size={18} /> : s}
                            </div>
                            <span className={`mt-2 lg:mt-4 font-inter text-[8px] lg:text-xs uppercase tracking-widest font-bold ${step >= s ? 'text-forest-green' : 'text-forest-green/30'}`}>
                                {s === 1 ? 'Service' : s === 2 ? 'Details' : 'Confirm'}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Content */}
                <div className="bg-white rounded-24 p-6 lg:p-16 shadow-2xl border border-champagne-gold/10">
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="font-playfair text-2xl lg:text-4xl text-forest-green mb-6 lg:mb-8">What do you need?</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                                {currentSubServices.map(service => (
                                    <button
                                        key={service}
                                        onClick={() => {
                                            setSelectedSubService(service);
                                            setStep(2);
                                        }}
                                        className="p-6 lg:p-8 border border-forest-green/10 rounded-xl hover:border-forest-green hover:bg-forest-green/5 transition-all text-left flex justify-between items-center group"
                                    >
                                        <span className="font-playfair text-lg lg:text-xl text-forest-green">{service}</span>
                                        <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full border border-forest-green/20 group-hover:bg-forest-green transition-colors"></div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="font-playfair text-2xl lg:text-4xl text-forest-green mb-6 lg:mb-8 text-center sm:text-left">When do you want to come?</h2>
                            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                                <div className="flex-1 bg-forest-green/5 rounded-xl p-6 lg:p-8 border border-forest-green/10">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="font-inter font-bold text-forest-green text-xs lg:text-sm uppercase tracking-widest">March 2026</span>
                                        <div className="flex space-x-2">
                                            <button className="p-2 bg-white rounded border border-forest-green/10 text-xs">&lt;</button>
                                            <button className="p-2 bg-white rounded border border-forest-green/10 text-xs">&gt;</button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 lg:gap-2 text-center text-[8px] lg:text-[10px] font-bold text-forest-green/40 mb-4">
                                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 lg:gap-2">
                                        {Array.from({ length: 31 }).map((_, i) => (
                                            <button key={i} className={`aspect-square rounded flex items-center justify-center text-xs lg:text-sm ${i === 14 ? 'bg-forest-green text-white shadow-lg' : 'hover:bg-forest-green/10 text-forest-green'}`}>
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="w-full lg:w-[300px] shrink-0 space-y-4">
                                    <h4 className="font-inter text-[10px] lg:text-xs uppercase tracking-widest font-bold text-forest-green/60 mb-4 px-2">Pick a Time</h4>
                                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                                        {['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'].map(time => (
                                            <button key={time} onClick={() => setStep(3)} className="w-full p-4 border border-forest-green/10 rounded-lg hover:border-forest-green text-forest-green text-sm font-medium transition-all">
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-lg mx-auto">
                            <h2 className="font-playfair text-2xl lg:text-4xl text-forest-green mb-6 lg:mb-8 text-center">Ready to Book?</h2>
                            <div className="p-6 lg:p-8 bg-forest-green rounded-xl text-ivory-white mb-8">
                                <div className="flex justify-between items-center mb-6 opacity-60 text-[10px] uppercase tracking-widest">
                                    <span>Your Order</span>
                                    <span>#NS-8274</span>
                                </div>
                                <div className="flex justify-between mb-4">
                                    <span className="font-playfair text-lg lg:text-xl">{selectedSubService || 'Elite Session'}</span>
                                    <span className="font-playfair text-lg lg:text-xl">₹4,500</span>
                                </div>
                                <div className="flex flex-col space-y-1 text-[10px] lg:text-sm opacity-70">
                                    <span>March 15, 2026</span>
                                    <span>09:00 AM @ Beverly Hills</span>
                                    <span className="text-[8px] lg:text-[10px] mt-2 italic">* Tax included in total</span>
                                </div>
                            </div>

                            <button className="w-full py-5 bg-forest-green text-champagne-gold font-bold uppercase tracking-widest text-[10px] lg:text-xs rounded-xl hover:bg-forest-green/90 transition-all flex items-center justify-center space-x-3 shadow-xl active:scale-95">
                                <CreditCard size={16} />
                                <span>Complete Booking</span>
                            </button>

                            <button onClick={() => setStep(2)} className="w-full mt-4 py-3 text-forest-green/40 hover:text-forest-green text-[10px] font-bold uppercase tracking-widest transition-colors">
                                Go back
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingWizard;
