import React, { useState } from 'react';
import { Calendar as CalendarIcon, ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck, Mail, Clock } from 'lucide-react';

const StudAvailabilityPage = ({ onPageChange, selectedStud: initialStud }) => {
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    // Mock data for availability
    const bookedDates = [5, 12, 13, 19, 20, 26, 27]; // Just for demo

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const currentYear = selectedMonth.getFullYear();
    const currentMonth = selectedMonth.getMonth();
    const monthName = selectedMonth.toLocaleString('default', { month: 'long' });

    const handlePrevMonth = () => setSelectedMonth(new Date(currentYear, currentMonth - 1));
    const handleNextMonth = () => setSelectedMonth(new Date(currentYear, currentMonth + 1));

    const days = [];
    for (let i = 0; i < firstDayOfMonth(currentYear, currentMonth); i++) {
        days.push(<div key={`empty-${i}`} className="aspect-square border border-forest-green/5"></div>);
    }
    for (let i = 1; i <= daysInMonth(currentYear, currentMonth); i++) {
        const isBooked = bookedDates.includes(i);
        const isSelected = selectedDate === i;
        days.push(
            <div
                key={i}
                onClick={() => !isBooked && setSelectedDate(i)}
                className={`aspect-square border border-forest-green/5 p-1 lg:p-2 transition-all relative cursor-pointer group flex items-center justify-center ${isBooked ? 'bg-forest-green/5 cursor-not-allowed' : 'hover:bg-ivory'
                    } ${isSelected ? 'ring-2 ring-champagne-gold z-10 bg-white shadow-lg' : ''}`}
            >
                <span className={`font-inter text-[10px] lg:text-xs ${isBooked ? 'text-forest-green/20' : 'text-forest-green font-bold'}`}>{i}</span>
                {isBooked && (
                    <div className="absolute inset-x-0 bottom-1 flex justify-center">
                        <div className="w-1 h-1 bg-forest-green/10 rounded-full"></div>
                    </div>
                )}
                {!isBooked && isSelected && (
                    <div className="absolute inset-0 border-2 border-champagne-gold pointer-events-none"></div>
                )}
            </div>
        );
    }

    if (bookingSuccess) {
        return (
            <div className="fixed-layout min-h-[70vh] flex flex-col items-center justify-center text-center px-10 animate-in fade-in zoom-in duration-700">
                <div className="w-24 h-24 bg-forest-green rounded-full flex items-center justify-center text-champagne-gold mb-10 shadow-2xl">
                    <CheckCircle2 size={48} />
                </div>
                <h1 className="font-playfair text-5xl text-forest-green mb-6">Inquiry Received</h1>
                <p className="max-w-md text-forest-green/60 font-inter leading-relaxed mb-12">
                    We have received your interest for a stud service on **{monthName} {selectedDate}, {currentYear}**. Our team will contact you within 24 hours to confirm details.
                </p>
                <button
                    onClick={() => onPageChange('stud')}
                    className="px-12 py-5 bg-forest-green text-champagne-gold font-bold uppercase tracking-widest text-xs rounded-full hover:scale-105 transition-all"
                >
                    Back to Stud Dogs
                </button>
            </div>
        );
    }

    return (
        <div className="fixed-layout py-16 px-10">
            {/* Top Navigation & Header */}
            <div className="max-w-6xl mx-auto mb-20 text-center">
                <button
                    onClick={() => onPageChange('stud')}
                    className="inline-flex items-center space-x-3 text-forest-green/40 hover:text-forest-green mb-10 transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
                    <span className="font-inter text-[10px] uppercase tracking-widest font-bold">Back to Stud Dogs</span>
                </button>

                <span className="font-inter text-[10px] uppercase tracking-[0.4em] text-forest-green/60 mb-6 block font-bold">Booking Portal</span>
                <h1 className="font-playfair text-5xl lg:text-7xl text-forest-green mb-8">Champion Stud <br /><span className="italic text-[#C5A059] underline decoration-forest-green/5 underline-offset-8">Availability</span></h1>
                <p className="max-w-2xl mx-auto text-lg text-forest-green/60 leading-relaxed">
                    Reserve your mating session with our elite champions. Our streamlined process ensures your business success starts with the right foundation.
                </p>
            </div>

            {/* Main Centered Hub */}
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-[40px] shadow-2xl shadow-forest-green/5 border border-forest-green/5 overflow-hidden flex flex-col lg:flex-row">

                    {/* Left Panel: Calendar - NOW MORE PROMINENT */}
                    <div className="lg:w-[450px] bg-ivory/50 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-forest-green/5">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="font-playfair text-3xl text-forest-green">{monthName}</h3>
                                <p className="font-inter text-[10px] text-forest-green/40 uppercase tracking-[0.2em] font-bold mt-1">{currentYear}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button onClick={handlePrevMonth} className="w-10 h-10 rounded-full bg-white border border-forest-green/5 flex items-center justify-center hover:bg-forest-green hover:text-white transition-all shadow-sm">
                                    <ChevronLeft size={18} />
                                </button>
                                <button onClick={handleNextMonth} className="w-10 h-10 rounded-full bg-white border border-forest-green/5 flex items-center justify-center hover:bg-forest-green hover:text-white transition-all shadow-sm">
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 mb-4">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                                <div key={day} className="py-2 text-center text-[10px] font-bold text-forest-green/30 uppercase">{day}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1 lg:gap-2">
                            {days}
                        </div>

                        <div className="mt-10 pt-8 border-t border-forest-green/5 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-forest-green/20"></div>
                                <span className="text-[9px] uppercase font-bold text-forest-green/40 tracking-wider">Booked</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full border border-forest-green/20"></div>
                                <span className="text-[9px] uppercase font-bold text-forest-green/40 tracking-wider">Available</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-champagne-gold"></div>
                                <span className="text-[9px] uppercase font-bold text-forest-green/40 tracking-wider">Selected</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Form & Info */}
                    <div className="flex-1 p-8 lg:p-12 bg-white">
                        <div className="mb-10">
                            <h3 className="font-playfair text-3xl text-forest-green mb-4">Mating Request</h3>
                            <p className="font-inter text-sm text-forest-green/60">Fill in the details below to check pedigree compatibility and secure your dates.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-forest-green/40 uppercase tracking-widest pl-2">Selected Date</label>
                                    <div className="w-full bg-forest-green/5 rounded-2xl px-5 py-4 font-inter text-sm text-forest-green font-bold">
                                        {selectedDate ? `${monthName} ${selectedDate}, ${currentYear}` : 'Select a date'}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-forest-green/40 uppercase tracking-widest pl-2">Full Name</label>
                                    <input type="text" placeholder="Ganesh..." className="w-full bg-forest-green/5 border-none rounded-2xl px-5 py-4 font-inter text-sm focus:ring-2 focus:ring-forest-green/10 transition-all" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-forest-green/40 uppercase tracking-widest pl-2">Email Address</label>
                                <input type="email" placeholder="hello@example.com" className="w-full bg-forest-green/5 border-none rounded-2xl px-5 py-4 font-inter text-sm focus:ring-2 focus:ring-forest-green/10 transition-all" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-forest-green/40 uppercase tracking-widest pl-2">Special Notes & Breed Details</label>
                                <textarea rows="3" placeholder="Tell us about your female dog..." className="w-full bg-forest-green/5 border-none rounded-2xl px-5 py-4 font-inter text-sm focus:ring-2 focus:ring-forest-green/10 transition-all resize-none"></textarea>
                            </div>

                            <button
                                disabled={!selectedDate}
                                onClick={() => setBookingSuccess(true)}
                                className={`w-full py-6 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all mt-4 shadow-xl ${selectedDate
                                    ? 'bg-forest-green text-champagne-gold hover:translate-y-[-2px] hover:shadow-forest-green/20 active:translate-y-0'
                                    : 'bg-forest-green/10 text-forest-green/20 cursor-not-allowed'
                                    }`}
                            >
                                Secure Your Session
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-12 pt-10 border-t border-forest-green/5 flex flex-wrap gap-8 justify-center lg:justify-start">
                            <div className="flex items-center space-x-3">
                                <ShieldCheck size={18} className="text-champagne-gold" />
                                <span className="text-[10px] font-bold text-forest-green/40 uppercase tracking-widest">Health Vetted</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Clock size={18} className="text-champagne-gold" />
                                <span className="text-[10px] font-bold text-forest-green/40 uppercase tracking-widest">24h Response</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail size={18} className="text-champagne-gold" />
                                <span className="text-[10px] font-bold text-forest-green/40 uppercase tracking-widest">Support</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Support Section - Fills vertical gap */}
            <div className="max-w-5xl mx-auto mt-24 text-center">
                <div className="inline-block p-1 rounded-full bg-forest-green/5 mb-8">
                    <div className="flex items-center space-x-4 px-6 py-2">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-forest-green/10 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Expert" />
                                </div>
                            ))}
                        </div>
                        <span className="text-xs font-bold text-forest-green/60">Help team standing by</span>
                    </div>
                </div>
                <h4 className="font-playfair text-2xl text-forest-green mb-4">Need immediate help?</h4>
                <p className="text-forest-green/40 text-sm mb-8">Our breeding experts are available for consult on complex pedigrees.</p>
                <button
                    onClick={() => onPageChange('contact')}
                    className="text-forest-green font-bold text-xs uppercase tracking-[0.2em] hover:text-champagne-gold transition-colors underline decoration-champagne-gold underline-offset-8"
                >
                    Contact Breeding Experts &rarr;
                </button>
            </div>
        </div>
    );
};

export default StudAvailabilityPage;
