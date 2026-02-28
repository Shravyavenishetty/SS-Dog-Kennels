import React, { useEffect, useState, useRef } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { fetchFaqs, fetchKennelDetails, submitContactInquiry } from '../lib/api';

const ContactPage = () => {
    const [faqs, setFaqs] = useState([]);
    const [kennel, setKennel] = useState({
        address: 'Heritage Lane, Ooty\nTamil Nadu, India',
        phone: '+91 98765 43210',
        email: 'help@nsdogkennels.com',
        mapUrl: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'
    const [errorMessage, setErrorMessage] = useState('');

    const formRef = useRef();

    useEffect(() => {
        let mounted = true;

        // Fetch FAQs
        fetchFaqs()
            .then((items) => {
                if (mounted) setFaqs(items);
            })
            .catch((err) => console.error("Failed to load FAQs:", err));

        // Fetch Kennel Details
        fetchKennelDetails()
            .then((data) => {
                if (mounted && data) setKennel(data);
            })
            .catch((err) => console.error("Failed to load kennel details:", err));

        return () => { mounted = false; };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus(null);
        setErrorMessage('');
        setIsSubmitting(true);

        const formData = new FormData(formRef.current);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
        };

        try {
            await submitContactInquiry(data);
            setSubmitStatus('success');
            formRef.current.reset();
        } catch (err) {
            setSubmitStatus('error');
            setErrorMessage('Something went wrong. Please try again later.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed-layout py-12 lg:py-24 px-4 lg:px-10">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                {/* Left Side: Contact Info */}
                <div className="w-full lg:w-[40%]">
                    <span className="font-inter text-xs uppercase tracking-[0.4em] text-forest-green/60 mb-4 lg:mb-6 block font-bold">Help Team</span>
                    <h1 className="font-playfair text-4xl lg:text-7xl text-forest-green mb-6 lg:mb-8 leading-tight">Talk To <span className="italic text-[#C5A059]">Us</span>.</h1>
                    <p className="font-inter text-sm lg:text-lg text-forest-green/70 leading-relaxed mb-8 lg:mb-12">
                        Questions about a companion or service? Professional assistance at every step.
                    </p>

                    <div className="space-y-6 lg:space-y-8">
                        <div className="flex items-start space-x-5 lg:space-x-6">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-forest-green/5 rounded-lg flex items-center justify-center text-forest-green shrink-0">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h4 className="font-inter font-bold text-forest-green uppercase tracking-widest text-[10px] mb-1">Our Address</h4>
                                <p className="font-inter text-xs lg:text-sm text-forest-green/60 leading-relaxed whitespace-pre-line">
                                    {kennel.address}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-5 lg:space-x-6">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-forest-green/5 rounded-lg flex items-center justify-center text-forest-green shrink-0">
                                <Phone size={20} />
                            </div>
                            <div>
                                <h4 className="font-inter font-bold text-forest-green uppercase tracking-widest text-[10px] mb-1">Call Us</h4>
                                <p className="font-inter text-xs lg:text-sm text-forest-green/60">{kennel.phone}</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-5 lg:space-x-6">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-forest-green/5 rounded-lg flex items-center justify-center text-forest-green shrink-0">
                                <Mail size={20} />
                            </div>
                            <div>
                                <h4 className="font-inter font-bold text-forest-green uppercase tracking-widest text-[10px] mb-1">Email Us</h4>
                                <p className="font-inter text-xs lg:text-sm text-forest-green/60 break-all">{kennel.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full lg:w-[60%]">
                    <div className="bg-white p-8 lg:p-12 rounded-32 shadow-2xl border border-forest-green/10">
                        <h2 className="font-playfair text-2xl lg:text-3xl text-forest-green mb-6 lg:mb-8 text-center sm:text-left">Send a Message</h2>

                        {submitStatus === 'success' ? (
                            <div className="py-12 text-center animate-in fade-in zoom-in duration-500">
                                <div className="w-16 h-16 bg-forest-green/10 text-forest-green rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 size={32} />
                                </div>
                                <h3 className="font-playfair text-2xl text-forest-green mb-2">Message Received</h3>
                                <p className="text-forest-green/60 font-inter text-sm mb-8">Thank you for reaching out. Our team will get back to you shortly.</p>
                                <button
                                    onClick={() => setSubmitStatus(null)}
                                    className="text-forest-green font-bold uppercase tracking-widest text-[10px] hover:underline"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                                    <div className="space-y-2">
                                        <label className="font-inter text-[10px] uppercase font-bold text-forest-green/40 px-2 tracking-widest">Your Name</label>
                                        <input name="name" type="text" required className="w-full bg-forest-green/5 border-none rounded-xl p-4 font-inter text-sm focus:ring-2 ring-forest-green/10 outline-none transition-all" placeholder="Ganesh..." />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-inter text-[10px] uppercase font-bold text-forest-green/40 px-2 tracking-widest">Email Address</label>
                                        <input name="email" type="email" required className="w-full bg-forest-green/5 border-none rounded-xl p-4 font-inter text-sm focus:ring-2 ring-forest-green/10 outline-none transition-all" placeholder="hello@example.com" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="font-inter text-[10px] uppercase font-bold text-forest-green/40 px-2 tracking-widest">What do you need?</label>
                                    <div className="relative">
                                        <select name="subject" required className="w-full bg-forest-green/5 border-none rounded-xl p-4 font-inter text-sm focus:ring-2 ring-forest-green/10 outline-none transition-all appearance-none cursor-pointer">
                                            <option value="Buying a Puppy">Buying a Puppy</option>
                                            <option value="Booking a Dog">Booking a Dog</option>
                                            <option value="Grooming / Training">Grooming / Training</option>
                                            <option value="General Inquiry">General Inquiry</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-forest-green/20">
                                            ▼
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="font-inter text-[10px] uppercase font-bold text-forest-green/40 px-2 tracking-widest">Your Message</label>
                                    <textarea name="message" required className="w-full bg-forest-green/5 border-none rounded-xl p-4 font-inter text-sm focus:ring-2 ring-forest-green/10 outline-none transition-all h-32 lg:h-40 resize-none" placeholder="Type message here..."></textarea>
                                </div>

                                {submitStatus === 'error' && (
                                    <div className="flex items-center space-x-2 text-red-500 bg-red-50 p-4 rounded-xl border border-red-100">
                                        <AlertCircle size={16} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">{errorMessage}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-5 bg-forest-green text-champagne-gold font-bold uppercase tracking-widest text-[10px] lg:text-xs rounded-xl flex items-center justify-center space-x-3 hover:shadow-2xl transition-all shadow-xl active:scale-95 disabled:bg-forest-green/20 disabled:text-forest-green/40 disabled:scale-100"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} />
                                            <span>Send Message</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Map Section */}
            {kennel.mapUrl && (
                <div className="mt-20 lg:mt-32 w-full h-[300px] lg:h-[450px] rounded-32 overflow-hidden shadow-2xl border border-forest-green/10 relative group">
                    {kennel.mapUrl.includes('google.com/maps/embed') ? (
                        <>
                            <iframe
                                src={kennel.mapUrl}
                                className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Kennel Location"
                            ></iframe>
                            <div className="absolute top-6 left-6 pointer-events-none transition-opacity duration-500 group-hover:opacity-0">
                                <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-forest-green/5 flex items-center space-x-3">
                                    <MapPin size={16} className="text-forest-green" />
                                    <span className="font-inter text-xs font-bold text-forest-green uppercase tracking-widest italic">Our Location</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full bg-forest-green/5 flex flex-col items-center justify-center p-8 text-center">
                            <div className="w-16 h-16 bg-forest-green/10 text-forest-green rounded-full flex items-center justify-center mb-6">
                                <MapPin size={32} />
                            </div>
                            <h3 className="font-playfair text-2xl text-forest-green mb-4">Find Us on the Map</h3>
                            <p className="text-forest-green/60 font-inter text-sm mb-8 max-w-md">We're located in the beautiful hills of Ooty. Click below for live directions.</p>
                            <a
                                href={kennel.mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-10 py-5 bg-forest-green text-champagne-gold font-bold uppercase tracking-widest text-[10px] lg:text-xs rounded-xl hover:shadow-2xl transition-all shadow-xl"
                            >
                                Open in Google Maps
                            </a>
                        </div>
                    )}
                </div>
            )}

            {/* FAQ Section */}
            <div className="mt-20 lg:mt-32">
                <h2 className="font-playfair text-3xl lg:text-4xl text-forest-green mb-8 lg:mb-12 text-center">Frequently Asked</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 lg:gap-y-6">
                    {faqs.map((faq, i) => (
                        <div key={i} className="p-6 lg:p-8 border-b border-forest-green/10 hover:bg-forest-green/5 transition-colors group cursor-pointer rounded-xl">
                            <h4 className="font-playfair text-lg lg:text-xl text-forest-green mb-3 lg:mb-4">{faq.q}</h4>
                            <p className="font-inter text-xs lg:text-sm text-forest-green/60 leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
