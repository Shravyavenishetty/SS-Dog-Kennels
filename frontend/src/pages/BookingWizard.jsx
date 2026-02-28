import React, { useState, useRef, useEffect } from 'react';
import { Check, Calendar, User, ArrowLeft, Clock, CheckCircle2, Loader2, Mail, Phone, MessageSquare } from 'lucide-react';
import { submitServiceBooking } from '../lib/api';

const TIME_SLOTS = [
    { value: '09:00', label: '09:00 AM' },
    { value: '11:30', label: '11:30 AM' },
    { value: '14:00', label: '02:00 PM' },
    { value: '16:30', label: '04:30 PM' },
];

const today = new Date();
today.setHours(0, 0, 0, 0);

const BookingWizard = ({ onPageChange, initialService }) => {
    const isObject = typeof initialService === 'object' && initialService !== null;
    const [step, setStep] = useState(initialService ? 2 : 1);
    const [selectedSubService, setSelectedSubService] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState(false);

    const nameRef = useRef();
    const phoneRef = useRef();
    const emailRef = useRef();
    const notesRef = useRef();

    const serviceMap = {
        'grooming-training': ['Full Grooming', 'Puppy Grooming', 'De-shedding', 'Obedience Training', 'Protection Training', 'Puppy Socialization'],
        'boarding-daycare': ['Short-term Stay', 'Long-term Stay', 'Luxury Suite', 'Day Care Supervision'],
        'health-consultation': ['Vet Consultation', 'Vaccination Guide', 'Nutrition Planning', 'Health Check'],
        'stud-breeding': ['Breeding Consult', 'Reservation Support', 'Documentation Only'],
        'premium-logistics': ['Domestic Transport', 'Airport Pickup', 'Insurance Help', 'Microchipping']
    };

    const currentSubServices = isObject ? initialService.subServices : (serviceMap[initialService] || ['Grooming', 'Dog Training', 'Dog Boarding', 'Health Check']);

    const currentYear = selectedMonth.getFullYear();
    const currentMonth = selectedMonth.getMonth();
    const monthName = selectedMonth.toLocaleString('default', { month: 'long' });

    const handleNextStep = () => setStep(prev => prev + 1);
    const handlePrevStep = () => setStep(prev => prev - 1);

    const handlePrevMonth = () => {
        const prev = new Date(currentYear, currentMonth - 1);
        const thisMonth = new Date(today.getFullYear(), today.getMonth());
        if (prev >= thisMonth) setSelectedMonth(prev);
    };
    const handleNextMonth = () => setSelectedMonth(new Date(currentYear, currentMonth + 1));

    const isPastDay = (dayNum) => {
        const d = new Date(currentYear, currentMonth, dayNum);
        return d < today;
    };

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const renderCalendar = () => {
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="aspect-square border border-forest-green/5 rounded-md"></div>);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            const isPast = isPastDay(i);
            const isSelected = selectedDate === i;
            days.push(
                <div
                    key={i}
                    onClick={() => !isPast && setSelectedDate(i)}
                    className={`aspect-square border border-forest-green/5 rounded-md p-1 transition-all relative flex items-center justify-center text-[10px] lg:text-xs
                        ${isPast ? 'bg-forest-green/5 cursor-not-allowed opacity-40 text-forest-green/30' : 'hover:bg-ivory cursor-pointer text-forest-green font-bold'}
                        ${isSelected ? 'ring-2 ring-champagne-gold z-10 bg-white shadow-lg' : ''}`}
                >
                    {i}
                    {isSelected && !isPast && (
                        <div className="absolute inset-0 border-2 border-champagne-gold pointer-events-none rounded-md"></div>
                    )}
                </div>
            );
        }
        return days;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        const name = nameRef.current.value.trim();
        const phone = phoneRef.current.value.trim();
        const email = emailRef.current.value.trim();
        const notes = notesRef.current.value.trim();

        if (!name || !phone || !email || !selectedDate || !selectedTime) {
            setSubmitError('Please fill in all fields (Name, Phone, Email, Date, Time).');
            return;
        }

        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;

        // Get the most descriptive service name possible
        let serviceNameStr = 'General Service';
        if (selectedSubService) {
            serviceNameStr = selectedSubService;
        } else if (initialService) {
            serviceNameStr = typeof initialService === 'object' ? initialService.title : String(initialService).replace(/-/g, ' ');
        }

        setIsSubmitting(true);
        try {
            await submitServiceBooking({
                userName: name,
                userPhone: phone,
                userEmail: email,
                serviceName: serviceNameStr,
                bookingDate: dateStr,
                bookingTime: selectedTime,
                details: notes
            });
            setBookingSuccess(true);
        } catch (err) {
            setSubmitError('Failed to submit booking. Please try again.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (bookingSuccess) {
        return (
            <div className="fixed-layout min-h-[70vh] flex flex-col items-center justify-center text-center px-10 animate-in fade-in zoom-in duration-700">
                <div className="w-24 h-24 bg-forest-green rounded-full flex items-center justify-center text-champagne-gold mb-10 shadow-2xl">
                    <CheckCircle2 size={48} />
                </div>
                <h1 className="font-playfair text-5xl text-forest-green mb-6">Booking Inquiry Sent!</h1>
                <p className="max-w-md text-forest-green/60 font-inter leading-relaxed mb-12">
                    We've received your request for <strong>{selectedSubService}</strong> on <strong>{monthName} {selectedDate}, {currentYear}</strong>. Our team will contact you shortly to confirm and discuss payment.
                </p>
                <button
                    onClick={() => onPageChange('services')}
                    className="px-12 py-5 bg-forest-green text-champagne-gold font-bold uppercase tracking-widest text-xs rounded-full hover:scale-105 transition-all shadow-xl"
                >
                    Return to Services
                </button>
            </div>
        );
    }

    return (
        <div className="fixed-layout py-8 lg:py-24 px-4 lg:px-10">
            <div className="max-w-5xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => step === 1 ? onPageChange('services') : handlePrevStep()}
                    className="flex items-center space-x-3 text-forest-green/40 hover:text-forest-green mb-8 lg:mb-12 transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-inter text-[10px] uppercase tracking-widest font-bold">
                        {step === 1 ? 'Back to Services' : 'Previous Step'}
                    </span>
                </button>

                {/* Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <span className="font-inter text-[10px] uppercase tracking-[0.4em] text-forest-green/60 mb-4 block font-bold">Service Concierge</span>
                    <h1 className="font-playfair text-3xl lg:text-6xl text-forest-green mb-4">
                        {step === 1 ? 'Select Your Service' : step === 2 ? 'Choose Date & Time' : 'Finalize Details'}
                    </h1>
                </div>

                {/* Progress Bar */}
                <div className="flex justify-between items-center mb-12 lg:mb-20 relative px-4 max-w-2xl mx-auto">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-forest-green/10 -z-10"></div>
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex flex-col items-center bg-ivory">
                            <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 text-[10px] lg:text-xs ${step >= s ? 'bg-forest-green border-forest-green text-champagne-gold' : 'bg-white border-forest-green/20 text-forest-green/40'}`}>
                                {step > s ? <Check size={14} /> : s}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Content Box */}
                <div className="bg-white rounded-32 lg:rounded-[40px] shadow-2xl border border-forest-green/5 overflow-hidden min-h-[500px]">
                    {step === 1 && (
                        <div className="p-8 lg:p-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {currentSubServices.map(service => (
                                    <button
                                        key={service}
                                        onClick={() => {
                                            setSelectedSubService(service);
                                            setStep(2);
                                        }}
                                        className="p-8 border border-forest-green/10 rounded-2xl hover:border-forest-green hover:bg-forest-green/5 transition-all text-center group flex flex-col items-center justify-center space-y-4"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-forest-green/5 flex items-center justify-center group-hover:bg-forest-green group-hover:text-white transition-colors">
                                            <Check size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <span className="font-playfair text-lg text-forest-green">{service}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col lg:flex-row h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Calendar Side */}
                            <div className="flex-1 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-forest-green/5 bg-ivory/30">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="font-playfair text-2xl text-forest-green">{monthName} <span className="text-sm font-inter text-forest-green/40 uppercase tracking-widest">{currentYear}</span></h3>
                                    <div className="flex space-x-2">
                                        <button onClick={handlePrevMonth} className="p-2 bg-white rounded-full border border-forest-green/10 hover:bg-forest-green hover:text-white transition-all text-xs">&larr;</button>
                                        <button onClick={handleNextMonth} className="p-2 bg-white rounded-full border border-forest-green/10 hover:bg-forest-green hover:text-white transition-all text-xs">&rarr;</button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-7 gap-1 lg:gap-2 mb-2 text-center text-[10px] font-bold text-forest-green/40 uppercase tracking-widest">
                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
                                </div>
                                <div className="grid grid-cols-7 gap-1 lg:gap-2">
                                    {renderCalendar()}
                                </div>
                            </div>

                            {/* Time Side */}
                            <div className="w-full lg:w-[350px] p-8 lg:p-12">
                                <h4 className="font-inter text-[10px] uppercase tracking-widest font-bold text-forest-green/60 mb-8 flex items-center gap-2">
                                    <Clock size={14} className="text-champagne-gold" /> Pick a Time
                                </h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {TIME_SLOTS.map(slot => (
                                        <button
                                            key={slot.value}
                                            onClick={() => {
                                                setSelectedTime(slot.value);
                                                if (selectedDate) handleNextStep();
                                            }}
                                            className={`p-5 rounded-2xl font-inter text-sm font-bold transition-all border ${selectedTime === slot.value ? 'bg-forest-green text-champagne-gold border-forest-green shadow-lg shadow-forest-green/20' : 'bg-white text-forest-green/60 border-forest-green/10 hover:border-forest-green/30'}`}
                                        >
                                            {slot.label}
                                        </button>
                                    ))}
                                </div>
                                {!selectedDate && <p className="mt-6 text-[10px] text-center text-forest-green/40 italic">Please pick a date first</p>}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="p-8 lg:p-16 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto w-full">
                            <div className="mb-10 p-6 bg-forest-green/5 rounded-2xl border border-forest-green/10 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-forest-green/40 mb-1">Service Summary</p>
                                    <h4 className="font-playfair text-xl text-forest-green">{selectedSubService || (isObject ? initialService.title : 'General Service')}</h4>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-forest-green/40 mb-1">Appt. Time</p>
                                    <p className="font-inter text-sm font-bold text-forest-green">{monthName} {selectedDate} @ {TIME_SLOTS.find(t => t.value === selectedTime)?.label}</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-forest-green/40 uppercase tracking-widest flex items-center gap-2">
                                            <User size={12} /> Full Name
                                        </label>
                                        <input ref={nameRef} type="text" required placeholder="John Doe" className="w-full bg-forest-green/5 rounded-2xl px-6 py-4 font-inter text-sm focus:ring-2 focus:ring-forest-green/10 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-forest-green/40 uppercase tracking-widest flex items-center gap-2">
                                            <Phone size={12} /> Phone Number
                                        </label>
                                        <input ref={phoneRef} type="tel" required placeholder="+91 98765 43210" className="w-full bg-forest-green/5 rounded-2xl px-6 py-4 font-inter text-sm focus:ring-2 focus:ring-forest-green/10 outline-none transition-all" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-forest-green/40 uppercase tracking-widest flex items-center gap-2">
                                        <Mail size={12} /> Email Address
                                    </label>
                                    <input ref={emailRef} type="email" required placeholder="john@example.com" className="w-full bg-forest-green/5 rounded-2xl px-6 py-4 font-inter text-sm focus:ring-2 focus:ring-forest-green/10 outline-none transition-all" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-forest-green/40 uppercase tracking-widest flex items-center gap-2">
                                        <MessageSquare size={12} /> Additional Notes (Optional)
                                    </label>
                                    <textarea ref={notesRef} rows="3" placeholder="Tell us about your pet's needs..." className="w-full bg-forest-green/5 rounded-2xl px-6 py-4 font-inter text-sm focus:ring-2 focus:ring-forest-green/10 outline-none transition-all resize-none" />
                                </div>

                                {submitError && <p className="text-red-500 text-xs font-bold text-center">{submitError}</p>}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-6 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 ${isSubmitting ? 'bg-forest-green/20 text-forest-green/40 cursor-not-allowed' : 'bg-forest-green text-champagne-gold hover:shadow-forest-green/20'}`}
                                >
                                    {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Submitting Inquiry...</> : 'Complete Booking'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingWizard;
