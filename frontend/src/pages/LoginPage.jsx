import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Github, Chrome as Google, Smartphone as Apple, Phone, ShieldCheck, RefreshCw, ChevronLeft, User } from 'lucide-react';

const LoginPage = ({ onPageChange, onLoginSuccess }) => {
    const [step, setStep] = useState('number'); // 'number' or 'otp'
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(30);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let interval;
        if (step === 'otp' && timer > 0) {
            interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleSendOTP = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setStep('otp');
            setTimer(30);
        }, 1500);
    };

    const handleVerifyOTP = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            onLoginSuccess();
        }, 1500);
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1 || isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const [googleLoading, setGoogleLoading] = useState(false);

    const handleGoogleLogin = () => {
        setGoogleLoading(true);
        setTimeout(() => {
            setGoogleLoading(false);
            onLoginSuccess();
        }, 2000);
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-20 px-10 bg-ivory/30">
            <div className="w-full max-w-5xl flex bg-white rounded-[40px] shadow-2xl overflow-hidden border border-forest-green/5 min-h-[700px]">

                {/* Visual Side */}
                <div className="hidden lg:block w-1/2 relative overflow-hidden bg-forest-green p-16 flex flex-col justify-between">
                    <div className="absolute inset-0 opacity-20">
                        <img
                            src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800"
                            className="w-full h-full object-cover grayscale"
                            alt="Kennel Background"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-forest-green to-transparent"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-champagne-gold rounded-full flex items-center justify-center text-forest-green font-playfair font-bold text-xl mb-6">
                            SS
                        </div>
                        <h2 className="font-playfair text-4xl text-champagne-gold leading-tight mb-6">
                            Experience the Art of <br />Champion Breeding.
                        </h2>
                        <p className="font-inter text-ivory/60 text-sm leading-relaxed max-w-sm">
                            Join our exclusive community of dog enthusiasts and gain access to premium litters, pedigrees, and elite grooming services.
                        </p>
                    </div>

                    <div className="relative z-10 pt-10 border-t border-white/10">
                        <div className="flex -space-x-3 mb-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-forest-green overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                </div>
                            ))}
                            <div className="w-8 h-8 rounded-full bg-champagne-gold border-2 border-forest-green flex items-center justify-center text-[10px] font-bold text-forest-green">
                                +500
                            </div>
                        </div>
                        <p className="font-inter text-[10px] text-champagne-gold/60 uppercase tracking-widest font-bold">
                            Trusted by 500+ happy owners
                        </p>
                    </div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center relative">
                    {step === 'otp' && (
                        <button
                            onClick={() => setStep('number')}
                            className="absolute top-12 left-12 p-2 border border-forest-green/10 rounded-full text-forest-green/40 hover:text-forest-green hover:border-forest-green/20 transition-all"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    )}

                    <div className="mb-10">
                        <h1 className="font-playfair text-4xl text-forest-green mb-3">
                            {step === 'number' ? 'Welcome Back' : 'Verify Identity'}
                        </h1>
                        <p className="font-inter text-sm text-forest-green/40 uppercase tracking-widest">
                            {step === 'number' ? 'Enter your mobile to receive an OTP' : `We've sent a code to +91 ${phoneNumber}`}
                        </p>
                    </div>

                    {step === 'number' ? (
                        <form onSubmit={handleSendOTP} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="space-y-2">
                                <label className="font-inter text-[10px] uppercase font-bold text-forest-green/40 tracking-widest ml-1">Mobile Number</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center space-x-2 border-r border-forest-green/10 pr-3">
                                        <span className="font-inter text-sm font-bold text-forest-green/60">+91</span>
                                    </div>
                                    <input
                                        type="tel"
                                        required
                                        maxLength={10}
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                        className="w-full p-4 pl-20 bg-ivory rounded-2xl border border-forest-green/5 focus:ring-2 focus:ring-forest-green/10 focus:border-forest-green/20 outline-none transition-all font-inter text-sm tracking-[0.2em]"
                                        placeholder="98765 43210"
                                    />
                                </div>
                            </div>

                            <button
                                disabled={phoneNumber.length !== 10 || isLoading}
                                className="w-full py-5 bg-forest-green text-champagne-gold font-bold uppercase tracking-widest text-xs rounded-2xl hover:bg-forest-green/90 transition-all shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-3 group disabled:opacity-50 disabled:translate-y-0"
                            >
                                {isLoading ? (
                                    <RefreshCw className="animate-spin" size={16} />
                                ) : (
                                    <>
                                        <span>Send Verification Code</span>
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOTP} className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                            <div className="space-y-4 text-center">
                                <div className="flex justify-between gap-3">
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            id={`otp-${i}`}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(i, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(i, e)}
                                            className="w-full h-14 bg-ivory rounded-xl border border-forest-green/5 text-center font-playfair text-2xl text-forest-green focus:ring-2 focus:ring-forest-green/10 focus:border-forest-green/20 outline-none transition-all"
                                        />
                                    ))}
                                </div>
                                <div className="flex items-center justify-center space-x-2">
                                    <p className="font-inter text-xs text-forest-green/40">Didn't receive code?</p>
                                    {timer > 0 ? (
                                        <span className="font-inter text-xs font-bold text-forest-green">Resend in {timer}s</span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setTimer(30);
                                                // Simulate resending
                                            }}
                                            className="font-inter text-xs font-bold text-forest-green hover:underline decoration-champagne-gold/40 underline-offset-4"
                                        >
                                            Resend OTP
                                        </button>
                                    )}
                                </div>
                            </div>

                            <button
                                disabled={otp.some(d => !d) || isLoading}
                                className="w-full py-5 bg-forest-green text-champagne-gold font-bold uppercase tracking-widest text-xs rounded-2xl hover:bg-forest-green/90 transition-all shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-3 group disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <RefreshCw className="animate-spin" size={16} />
                                ) : (
                                    <>
                                        <span>Verify & Sign In</span>
                                        <ShieldCheck size={16} className="group-hover:scale-110 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    <div className="mt-12 relative text-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-forest-green/5"></div>
                        </div>
                        <span className="relative z-10 px-4 bg-white font-inter text-[10px] text-forest-green/30 uppercase tracking-widest">Or continue with</span>
                    </div>

                    <div className="mt-8">
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={googleLoading || isLoading}
                            className="w-full flex items-center justify-center space-x-3 p-5 bg-ivory rounded-2xl border border-forest-green/5 hover:bg-forest-green/5 transition-all text-forest-green/60 group disabled:opacity-50"
                        >
                            {googleLoading ? (
                                <RefreshCw className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <Google size={20} className="group-hover:scale-110 transition-transform duration-300" />
                                    <span className="font-inter text-xs font-bold uppercase tracking-widest">Continue with Google</span>
                                </>
                            )}
                        </button>
                    </div>

                    <p className="mt-12 text-center font-inter text-[10px] text-forest-green/30 uppercase tracking-[0.2em] leading-relaxed">
                        By continuing, you agree to our <br />
                        <span className="text-forest-green/60 hover:text-forest-green cursor-pointer">Terms of Service</span> & <span className="text-forest-green/60 hover:text-forest-green cursor-pointer">Privacy Policy</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
