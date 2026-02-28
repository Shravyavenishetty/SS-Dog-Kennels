import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck, Mail, Clock, Loader2 } from 'lucide-react';
import { fetchStudDogs, submitStudBookingRequest } from '../lib/api';

const TIME_SLOTS = [
    { value: '09:00', label: '9:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '17:00', label: '5:00 PM' },
];

const today = new Date();
today.setHours(0, 0, 0, 0);

const StudAvailabilityPage = ({ onPageChange, initialStud }) => {
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [studs, setStuds] = useState([]);
    const [selectedStudId, setSelectedStudId] = useState(initialStud ? initialStud.id : 'all');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const nameRef = useRef();
    const phoneRef = useRef();
    const breedRef = useRef();

    useEffect(() => {
        fetchStudDogs()
            .then(data => {
                setStuds(data);
                // If we have an initialStud but it's not in the loaded data yet, we wait for data
                if (initialStud && !selectedStudId) {
                    setSelectedStudId(initialStud.id);
                }
            })
            .catch(err => console.error('Failed to load stud dogs:', err));
    }, [initialStud]);

    const currentYear = selectedMonth.getFullYear();
    const currentMonth = selectedMonth.getMonth();
    const monthName = selectedMonth.toLocaleString('default', { month: 'long' });

    const handlePrevMonth = () => {
        const prev = new Date(currentYear, currentMonth - 1);
        const thisMonth = new Date(today.getFullYear(), today.getMonth());
        if (prev >= thisMonth) setSelectedMonth(prev);
    };
    const handleNextMonth = () => setSelectedMonth(new Date(currentYear, currentMonth + 1));

    const getBookedDayNumbers = () => {
        const prefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-`;
        if (selectedStudId === 'all') {
            const all = new Set();
            studs.forEach(s => {
                (s.booked_dates || []).forEach(d => {
                    if (d.startsWith(prefix)) all.add(parseInt(d.split('-')[2], 10));
                });
            });
            return all;
        }
        // Force string comparison for IDs which might be ObjectIDs or strings
        const stud = studs.find(s => String(s.id) === String(selectedStudId));
        if (!stud) return new Set();
        const booked = new Set();
        (stud.booked_dates || []).forEach(d => {
            if (d.startsWith(prefix)) booked.add(parseInt(d.split('-')[2], 10));
        });
        return booked;
    };

    const bookedSet = getBookedDayNumbers();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const isPastDay = (dayNum) => {
        const d = new Date(currentYear, currentMonth, dayNum);
        return d < today;
    };

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className="aspect-square border border-forest-green/5 rounded-md"></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        const isBooked = bookedSet.has(i);
        const isPast = isPastDay(i);
        const isDisabled = isBooked || isPast;
        const isSelected = selectedDate === i;
        days.push(
            <div
                key={i}
                onClick={() => !isDisabled && setSelectedDate(i)}
                title={isPast ? 'Date passed' : isBooked ? 'Already booked' : ''}
                className={`aspect-square border border-forest-green/5 rounded-md p-1 transition-all relative flex items-center justify-center
                    ${isDisabled ? 'bg-forest-green/5 cursor-not-allowed opacity-40' : 'hover:bg-ivory cursor-pointer'}
                    ${isSelected ? 'ring-2 ring-champagne-gold z-10 bg-white shadow-lg' : ''}`}
            >
                <span className={`font-inter text-[10px] lg:text-xs ${isDisabled ? 'text-forest-green/30' : 'text-forest-green font-bold'}`}>{i}</span>
                {isBooked && !isPast && (
                    <div className="absolute inset-x-0 bottom-1 flex justify-center">
                        <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                    </div>
                )}
                {!isDisabled && isSelected && (
                    <div className="absolute inset-0 border-2 border-champagne-gold pointer-events-none rounded-md"></div>
                )}
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        const name = nameRef.current.value.trim();
        const phone = phoneRef.current.value.trim();
        const breedDetails = breedRef.current.value.trim();

        if (!name || !phone || !selectedDate || !selectedTime) {
            setSubmitError('Please fill in all fields and select a date and time.');
            return;
        }

        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;

        // Find current stud details
        let studBreed = 'Any';
        if (selectedStudId !== 'all') {
            const currentStud = studs.find(s => String(s.id) === String(selectedStudId));
            if (currentStud) {
                studBreed = currentStud.breed;
            }
        }

        setIsSubmitting(true);
        try {
            await submitStudBookingRequest({
                stud_breed: studBreed,
                customer_name: name,
                customer_phone: phone,
                female_breed_details: breedDetails,
                requested_date: dateStr,
                requested_time: selectedTime,
            });
            setBookingSuccess(true);
        } catch (err) {
            setSubmitError('Something went wrong. Please try again.');
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
                <h1 className="font-playfair text-5xl text-forest-green mb-6">Inquiry Received!</h1>
                <p className="max-w-md text-forest-green/60 font-inter leading-relaxed mb-2">
                    Your stud session request for <strong>{monthName} {selectedDate}, {currentYear}</strong> at <strong>{TIME_SLOTS.find(t => t.value === selectedTime)?.label}</strong> has been received.
                </p>
                <p className="max-w-md text-forest-green/40 font-inter text-sm leading-relaxed mb-12">
                    Our team will contact you directly within 24 hours to confirm your booking details.
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
        <div className="fixed-layout py-8 lg:py-16 px-4 lg:px-10">
            {/* Header */}
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => onPageChange('stud')}
                    className="inline-flex items-center space-x-3 text-forest-green/40 hover:text-forest-green mb-8 transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-inter text-[10px] uppercase tracking-widest font-bold">Back to Stud Dogs</span>
                </button>
            </div>

            <div className="max-w-6xl mx-auto mb-12 lg:mb-20 text-center">

                <span className="font-inter text-[10px] uppercase tracking-[0.4em] text-forest-green/60 mb-4 block font-bold">Booking Portal</span>
                <h1 className="font-playfair text-3xl lg:text-7xl text-forest-green mb-6 lg:mb-8 leading-tight">
                    Champion Stud <br className="hidden sm:block" />
                    <span className="italic text-[#C5A059] underline decoration-forest-green/5 underline-offset-8">Availability</span>
                </h1>
                <p className="max-w-2xl mx-auto text-sm lg:text-lg text-forest-green/60 leading-relaxed">
                    Reserve your session with our elite champions. Select a date, pick a time, and our team will reach out directly.
                </p>

                {/* Stud Selector */}
                {studs.length > 0 && (
                    <div className="mt-8 flex flex-wrap justify-center gap-2">
                        <button
                            onClick={() => { setSelectedStudId('all'); setSelectedDate(null); }}
                            className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${selectedStudId === 'all' ? 'bg-forest-green text-champagne-gold' : 'bg-forest-green/5 text-forest-green hover:bg-forest-green/10'}`}
                        >
                            Any Stud
                        </button>
                        {studs.map(s => (
                            <button
                                key={s.id}
                                onClick={() => { setSelectedStudId(s.id); setSelectedDate(null); }}
                                className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${selectedStudId === s.id ? 'bg-forest-green text-champagne-gold' : 'bg-forest-green/5 text-forest-green hover:bg-forest-green/10'}`}
                            >
                                {s.breed}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Main Card */}
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-32 lg:rounded-[40px] shadow-2xl shadow-forest-green/5 border border-forest-green/5 overflow-hidden flex flex-col lg:flex-row">

                    {/* Left: Calendar */}
                    <div className="w-full lg:w-[420px] bg-ivory/50 p-6 lg:p-12 border-b lg:border-b-0 lg:border-r border-forest-green/5">
                        <div className="flex items-center justify-between mb-8 lg:mb-10">
                            <div>
                                <h3 className="font-playfair text-2xl lg:text-3xl text-forest-green">{monthName}</h3>
                                <p className="font-inter text-[10px] text-forest-green/40 uppercase tracking-[0.2em] font-bold mt-1">{currentYear}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button onClick={handlePrevMonth} className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white border border-forest-green/5 flex items-center justify-center hover:bg-forest-green hover:text-white transition-all shadow-sm">
                                    <ChevronLeft size={16} />
                                </button>
                                <button onClick={handleNextMonth} className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white border border-forest-green/5 flex items-center justify-center hover:bg-forest-green hover:text-white transition-all shadow-sm">
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 mb-2">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                <div key={i} className="py-2 text-center text-[10px] font-bold text-forest-green/30 uppercase">{day}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {days}
                        </div>

                        <div className="mt-8 pt-6 border-t border-forest-green/5 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-forest-green/20"></div>
                                <span className="text-[8px] uppercase font-bold text-forest-green/40 tracking-wider">Past / Booked</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full border border-forest-green/40"></div>
                                <span className="text-[8px] uppercase font-bold text-forest-green/40 tracking-wider">Available</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-champagne-gold"></div>
                                <span className="text-[8px] uppercase font-bold text-forest-green/40 tracking-wider">Selected</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="flex-1 p-6 lg:p-12 bg-white">
                        <div className="mb-6 lg:mb-8">
                            <h3 className="font-playfair text-2xl lg:text-3xl text-forest-green mb-2">Mating Request</h3>
                            <p className="font-inter text-sm text-forest-green/60">Fill in your details — our breeder will reach out within 24 hours.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-forest-green/40 uppercase tracking-widest">Selected Date</label>
                                    <div className="w-full bg-forest-green/5 rounded-2xl px-5 py-4 font-inter text-xs lg:text-sm text-forest-green font-bold">
                                        {selectedDate ? `${monthName} ${selectedDate}, ${currentYear}` : 'Pick a date ←'}
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-forest-green/40 uppercase tracking-widest">Preferred Time</label>
                                    <div className="grid grid-cols-2 gap-1.5">
                                        {TIME_SLOTS.map(slot => (
                                            <button
                                                key={slot.value}
                                                type="button"
                                                onClick={() => setSelectedTime(slot.value)}
                                                className={`py-2 px-2 rounded-xl text-[9px] lg:text-[10px] font-bold uppercase tracking-wider transition-all ${selectedTime === slot.value ? 'bg-forest-green text-champagne-gold' : 'bg-forest-green/5 text-forest-green/60 hover:bg-forest-green/10'}`}
                                            >
                                                {slot.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-forest-green/40 uppercase tracking-widest">Your Full Name</label>
                                    <input ref={nameRef} type="text" required placeholder="e.g. Ravi Kumar" className="w-full bg-forest-green/5 rounded-2xl px-5 py-3 lg:py-4 font-inter text-sm focus:ring-2 focus:ring-forest-green/10 transition-all outline-none" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-forest-green/40 uppercase tracking-widest">Your Phone</label>
                                    <input ref={phoneRef} type="tel" required placeholder="+91 98765 43210" className="w-full bg-forest-green/5 rounded-2xl px-5 py-3 lg:py-4 font-inter text-sm focus:ring-2 focus:ring-forest-green/10 transition-all outline-none" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-forest-green/40 uppercase tracking-widest">About Your Female Dog</label>
                                <textarea ref={breedRef} rows="3" placeholder="Breed, age, and any health details of your female..." className="w-full bg-forest-green/5 rounded-2xl px-5 py-3 lg:py-4 font-inter text-sm focus:ring-2 focus:ring-forest-green/10 transition-all resize-none outline-none"></textarea>
                            </div>

                            {submitError && (
                                <p className="font-inter text-xs text-red-500 font-bold text-center">{submitError}</p>
                            )}

                            <button
                                type="submit"
                                disabled={!selectedDate || !selectedTime || isSubmitting}
                                className={`w-full py-5 lg:py-6 rounded-2xl font-bold uppercase tracking-widest text-[10px] lg:text-xs transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 ${selectedDate && selectedTime && !isSubmitting
                                    ? 'bg-forest-green text-champagne-gold hover:shadow-forest-green/20'
                                    : 'bg-forest-green/10 text-forest-green/30 cursor-not-allowed'
                                    }`}
                            >
                                {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : 'Secure Your Session'}
                            </button>
                        </form>

                        {/* Trust Badges */}
                        <div className="mt-8 pt-6 border-t border-forest-green/5 flex flex-wrap gap-5 lg:gap-8 justify-center lg:justify-start">
                            <div className="flex items-center space-x-2">
                                <ShieldCheck size={14} className="text-champagne-gold" />
                                <span className="text-[9px] font-bold text-forest-green/40 uppercase tracking-widest">Health Vetted</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Clock size={14} className="text-champagne-gold" />
                                <span className="text-[9px] font-bold text-forest-green/40 uppercase tracking-widest">24h Response</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail size={14} className="text-champagne-gold" />
                                <span className="text-[9px] font-bold text-forest-green/40 uppercase tracking-widest">Direct Contact</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Support */}
            <div className="max-w-5xl mx-auto mt-16 lg:mt-24 text-center px-4">
                <h4 className="font-playfair text-xl lg:text-2xl text-forest-green mb-3">Need immediate help?</h4>
                <p className="text-forest-green/40 text-[10px] lg:text-sm mb-6">Breeding experts available for pedigree consult.</p>
                <button
                    onClick={() => onPageChange('contact')}
                    className="text-forest-green font-bold text-[10px] lg:text-xs uppercase tracking-[0.2em] hover:text-champagne-gold transition-colors underline decoration-champagne-gold underline-offset-8"
                >
                    Contact Experts &rarr;
                </button>
            </div>
        </div>
    );
};

export default StudAvailabilityPage;
