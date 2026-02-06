import React, { useState } from 'react';
import { Check, Calendar, CreditCard, User } from 'lucide-react';

const BookingWizard = () => {
    const [step, setStep] = useState(1);

    return (
        <div className="fixed-layout py-24 px-10">
            <div className="max-w-4xl mx-auto">
                {/* Progress Bar */}
                <div className="flex justify-between items-center mb-20 relative">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-forest-green/10 -z-10"></div>
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${step >= s ? 'bg-forest-green border-forest-green text-champagne-gold' : 'bg-white border-forest-green/20 text-forest-green/40'}`}>
                                {step > s ? <Check size={20} /> : s}
                            </div>
                            <span className={`mt-4 font-inter text-xs uppercase tracking-widest font-bold ${step >= s ? 'text-forest-green' : 'text-forest-green/30'}`}>
                                {s === 1 ? 'Pick Service' : s === 2 ? 'Pick Date' : 'Confirm'}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Content */}
                <div className="bg-white rounded-24 p-16 shadow-2xl border border-champagne-gold/10">
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="font-playfair text-4xl text-forest-green mb-8">What do you need?</h2>
                            <div className="grid grid-cols-2 gap-6">
                                {['Grooming', 'Dog Training', 'Dog Staying', 'Health Check'].map(service => (
                                    <button key={service} onClick={() => setStep(2)} className="p-8 border border-forest-green/10 rounded-xl hover:border-forest-green hover:bg-forest-green/5 transition-all text-left flex justify-between items-center group">
                                        <span className="font-playfair text-xl text-forest-green">{service}</span>
                                        <div className="w-6 h-6 rounded-full border border-forest-green/20 group-hover:bg-forest-green transition-colors"></div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="font-playfair text-4xl text-forest-green mb-8">When do you want to come?</h2>
                            <div className="grid grid-cols-12 gap-8">
                                <div className="col-span-7 bg-forest-green/5 rounded-xl p-8 border border-forest-green/10">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="font-inter font-bold text-forest-green uppercase tracking-widest">March 2026</span>
                                        <div className="flex space-x-2">
                                            <button className="p-2 bg-white rounded border border-forest-green/10">&lt;</button>
                                            <button className="p-2 bg-white rounded border border-forest-green/10">&gt;</button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-forest-green/40 mb-4">
                                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
                                    </div>
                                    <div className="grid grid-cols-7 gap-2">
                                        {Array.from({ length: 31 }).map((_, i) => (
                                            <button key={i} className={`aspect-square rounded flex items-center justify-center text-sm ${i === 14 ? 'bg-forest-green text-white shadow-lg' : 'hover:bg-forest-green/10 text-forest-green'}`}>
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-span-5 space-y-4">
                                    <h4 className="font-inter text-xs uppercase tracking-widest font-bold text-forest-green/60 mb-4 px-2">Pick a Time</h4>
                                    {['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'].map(time => (
                                        <button key={time} onClick={() => setStep(3)} className="w-full p-4 border border-forest-green/10 rounded-lg hover:border-forest-green text-forest-green font-medium transition-all">
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="font-playfair text-4xl text-forest-green mb-8">Ready to Book?</h2>
                            <div className="p-8 bg-forest-green rounded-xl text-ivory-white mb-8">
                                <div className="flex justify-between items-center mb-6 opacity-60 text-xs uppercase tracking-widest">
                                    <span>Your Order</span>
                                    <span>#NS-8274</span>
                                </div>
                                <div className="flex justify-between mb-4">
                                    <span className="font-playfair text-xl">Elite Grooming</span>
                                    <span className="font-playfair text-xl">₹4,500</span>
                                </div>
                                <div className="flex justify-between text-sm opacity-70">
                                    <span>March 15, 2026 at 09:00 AM</span>
                                    <span>Tax included</span>
                                </div>
                            </div>

                            <button className="w-full py-5 bg-forest-green text-champagne-gold font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-forest-green/90 transition-all flex items-center justify-center space-x-3 shadow-xl">
                                <CreditCard size={16} />
                                <span>Pay Now</span>
                            </button>

                            <button onClick={() => setStep(1)} className="w-full mt-4 py-3 text-forest-green/40 hover:text-forest-green text-xs font-bold uppercase tracking-widest transition-colors">
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
