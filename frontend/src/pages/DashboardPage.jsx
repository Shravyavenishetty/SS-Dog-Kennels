import React, { useState, useEffect } from 'react';
import { Calendar, User, Heart, Settings, LogOut, Download, Shield, Loader2, Smartphone, Trash2, Lock, CheckCircle2 } from 'lucide-react';
import { fetchUserProfile, fetchUserBookings, updateUserProfile, deleteProfile, changeUserPhone } from '../lib/api';

const ProfilePage = ({ onPageChange, wishlistCount, onLogout, userPhone, onPhoneChange, kennelDetail }) => {
    const [activeTab, setActiveTab] = useState('summary');
    const [updating, setUpdating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [editData, setEditData] = useState({ firstName: '', lastName: '', email: '' });

    // Phone Change State
    const [isChangingPhone, setIsChangingPhone] = useState(false);
    const [newPhone, setNewPhone] = useState('');
    const [changePhoneStep, setChangePhoneStep] = useState('input'); // input, otp
    const [changeOtp, setChangeOtp] = useState(['', '', '', '', '', '']);
    const [generatedChangeOtp, setGeneratedChangeOtp] = useState('');
    const [changePhoneError, setChangePhoneError] = useState('');
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [timer, setTimer] = useState(0);

    // Re-verify Phone State
    const [isReverifying, setIsReverifying] = useState(false);
    const [reverifyOtp, setReverifyOtp] = useState(['', '', '', '', '', '']);
    const [generatedReverifyOtp, setGeneratedReverifyOtp] = useState('');
    const [reverifyError, setReverifyError] = useState('');
    const [lastVerifiedTime, setLastVerifiedTime] = useState('Just now');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [p, b] = await Promise.all([
                    fetchUserProfile(userPhone),
                    fetchUserBookings(userPhone)
                ]);
                setProfile(p);
                setBookings(b);
                setEditData({
                    firstName: p.firstName,
                    lastName: p.lastName,
                    email: p.email || ''
                });
            } catch (error) {
                console.error("Error loading dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        if (userPhone) loadData();
    }, [userPhone]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await updateUserProfile(userPhone, editData);
            setProfile(prev => ({ ...prev, ...editData }));
            setTimeout(() => setUpdating(false), 2000);
        } catch (error) {
            console.error("Update failed:", error);
            setUpdating(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you absolutely sure you want to delete your account? This action cannot be undone and you will lose all your booking history.")) {
            setUpdating(true);
            try {
                await deleteProfile(userPhone);
                onLogout(); // Log the user out after successful deletion
            } catch (error) {
                console.error("Error deleting account:", error);
                alert("Failed to delete account. Please try again later.");
                setUpdating(false);
            }
        }
    };

    // Phone Change Handlers
    const handleSendChangeOtp = async (e) => {
        e.preventDefault();
        if (newPhone.length !== 10 || !/^[6-9]/.test(newPhone)) {
            setChangePhoneError('Please enter a valid 10-digit Indian mobile number.');
            return;
        }
        if (newPhone === userPhone) {
            setChangePhoneError('New number must be different from current number.');
            return;
        }

        setIsSendingOtp(true);
        setChangePhoneError('');
        try {
            // Check if number is already in use
            const res = await fetch(`http://127.0.0.1:8000/api/user-profiles/check/${newPhone}/`);
            if (res.ok) {
                const data = await res.json();
                if (data.exists) {
                    setChangePhoneError('This mobile number is already registered.');
                    setIsSendingOtp(false);
                    return;
                }
            }

            // Simulate sending OTP
            const otpToLog = Math.floor(100000 + Math.random() * 900000).toString();
            console.log(`[DEV ONLY] OTP for changing number to ${newPhone}:`, otpToLog);
            setGeneratedChangeOtp(otpToLog);
            setChangePhoneStep('otp');
            setTimer(30);

            // Start timer
            const interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

        } catch (error) {
            console.error("Error checking phone:", error);
            setChangePhoneError('Failed to verify network. Try again.');
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleVerifyChangeOtp = async (e) => {
        e.preventDefault();
        const enteredOtp = changeOtp.join('');
        if (enteredOtp !== generatedChangeOtp) {
            setChangePhoneError('Invalid OTP. Please try again.');
            return;
        }

        setUpdating(true);
        setChangePhoneError('');
        try {
            await changeUserPhone(userPhone, newPhone);
            onPhoneChange(newPhone);
            setIsChangingPhone(false);
            setChangePhoneStep('input');
            setNewPhone('');
            setChangeOtp(['', '', '', '', '', '']);
            alert('Mobile number updated successfully!');
        } catch (error) {
            console.error("Error changing phone:", error);
            setChangePhoneError(error.message || 'Failed to update mobile number.');
        } finally {
            setUpdating(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) value = value.slice(-1);
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...changeOtp];
        newOtp[index] = value;
        setChangeOtp(newOtp);

        if (value && index < 5) {
            const nextInput = document.getElementById(`change-otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !changeOtp[index] && index > 0) {
            const prevInput = document.getElementById(`change-otp-${index - 1}`);
            if (prevInput) {
                prevInput.focus();
                const newOtp = [...changeOtp];
                newOtp[index - 1] = '';
                setChangeOtp(newOtp);
            }
        }
    };

    const handleStartReverify = () => {
        setIsReverifying(true);
        setReverifyError('');
        setReverifyOtp(['', '', '', '', '', '']);
        setIsChangingPhone(false); // Make sure change form is closed

        // Simulate sending OTP
        const otpToLog = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`[DEV ONLY] OTP for re-verifying ${userPhone}:`, otpToLog);
        setGeneratedReverifyOtp(otpToLog);

        setTimer(30);
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleVerifySubmit = (e) => {
        e.preventDefault();
        const enteredOtp = reverifyOtp.join('');
        if (enteredOtp !== generatedReverifyOtp) {
            setReverifyError('Invalid OTP. Please try again.');
            return;
        }

        // Success
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastVerifiedTime(`Today at ${timeString}`);
        setIsReverifying(false);
        setReverifyOtp(['', '', '', '', '', '']);
        alert('Mobile number re-verified successfully!');
    };

    const handleReverifyOtpChange = (index, value) => {
        if (value.length > 1) value = value.slice(-1);
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...reverifyOtp];
        newOtp[index] = value;
        setReverifyOtp(newOtp);

        if (value && index < 5) {
            const nextInput = document.getElementById(`reverify-otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleReverifyOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !reverifyOtp[index] && index > 0) {
            const prevInput = document.getElementById(`reverify-otp-${index - 1}`);
            if (prevInput) {
                prevInput.focus();
                const newOtp = [...reverifyOtp];
                newOtp[index - 1] = '';
                setReverifyOtp(newOtp);
            }
        }
    };

    const tabs = [
        { id: 'summary', icon: Calendar, label: 'Upcoming Visits' },
        { id: 'info', icon: User, label: 'Basic Information' },
        { id: 'security', icon: Settings, label: 'Account Security' },
    ];

    const externalLinks = [
        { id: 'wishlist', icon: Heart, label: 'My Saved Dogs', count: wishlistCount },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-ivory">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="w-12 h-12 text-forest-green animate-spin" />
                    <p className="font-playfair text-xl text-forest-green">Bringing your records...</p>
                </div>
            </div>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'info':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8">
                            <h1 className="font-playfair text-2xl lg:text-4xl text-forest-green mb-2 lg:mb-0">Basic Information</h1>
                            {updating && (
                                <span className="w-fit bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-tight animate-pulse">
                                    Changes Saved
                                </span>
                            )}
                        </div>
                        <div className="lg:bg-white lg:p-10 lg:rounded-32 lg:border lg:border-forest-green/10 lg:shadow-sm max-w-2xl">
                            <form onSubmit={handleUpdate} className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 mb-8 lg:mb-10">
                                <div className="space-y-1.5 lg:space-y-2">
                                    <label className="font-inter text-xs uppercase tracking-wider text-forest-green/40 font-bold ml-1">First Name</label>
                                    <input
                                        type="text"
                                        value={editData.firstName}
                                        onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                                        className="w-full p-4 bg-white lg:bg-ivory rounded-xl border border-forest-green/10 lg:border-forest-green/5 font-inter text-sm text-forest-green/80 focus:ring-2 focus:ring-forest-green/20 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5 lg:space-y-2">
                                    <label className="font-inter text-xs uppercase tracking-wider text-forest-green/40 font-bold ml-1">Last Name</label>
                                    <input
                                        type="text"
                                        value={editData.lastName}
                                        onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                                        className="w-full p-4 bg-white lg:bg-ivory rounded-xl border border-forest-green/10 lg:border-forest-green/5 font-inter text-sm text-forest-green/80 focus:ring-2 focus:ring-forest-green/20 outline-none transition-all"
                                    />
                                </div>
                                <div className="sm:col-span-2 space-y-1.5 lg:space-y-2">
                                    <label className="font-inter text-xs uppercase tracking-wider text-forest-green/40 font-bold ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={editData.email}
                                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                        className={`w-full p-4 bg-white lg:bg-ivory rounded-xl border ${editData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email) ? 'border-red-500' : 'border-forest-green/10 lg:border-forest-green/5'} font-inter text-sm text-forest-green/80 focus:ring-2 focus:ring-forest-green/20 outline-none transition-all`}
                                    />
                                    {editData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email) && (
                                        <p className="font-inter text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1 mt-1">Please enter a valid email address</p>
                                    )}
                                </div>
                                <div className="sm:col-span-2">
                                    <button
                                        type="submit"
                                        disabled={updating || (editData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email))}
                                        className="w-full py-5 lg:py-4 bg-forest-green text-champagne-gold rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-forest-green/90 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                                    >
                                        {updating ? 'Saving...' : 'Update Information'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h1 className="font-playfair text-2xl lg:text-4xl text-forest-green mb-8">Account Security</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                            <div className="lg:bg-white p-0 lg:p-10 lg:rounded-32 lg:border lg:border-forest-green/10 lg:shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-12 h-12 bg-forest-green/5 rounded-full flex items-center justify-center hidden lg:flex">
                                        <Smartphone size={24} className="text-forest-green" />
                                    </div>
                                    <h3 className="font-playfair text-xl lg:text-2xl text-forest-green mb-0">Mobile Verification</h3>
                                </div>

                                <div className="bg-ivory rounded-2xl p-4 lg:p-6 mb-6 border border-forest-green/5">
                                    <p className="font-inter text-xs uppercase tracking-wider text-forest-green/60 font-bold mb-2">Registered Mobile</p>
                                    <div className="flex items-center justify-between">
                                        <span className="font-inter text-lg lg:text-xl text-forest-green font-medium">
                                            {userPhone ? `+91 ${userPhone.substring(0, 1)}XXXXXX${userPhone.substring(7)}` : 'Loading...'}
                                        </span>
                                        <div className="flex items-center space-x-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                                            <Shield size={12} className="fill-current" />
                                            <span className="font-inter text-[10px] uppercase font-bold tracking-widest">Verified</span>
                                        </div>
                                    </div>
                                    <p className="font-inter text-xs text-forest-green/40 mt-4 flex items-center space-x-2">
                                        <Calendar size={12} />
                                        <span>Last OTP verified: {lastVerifiedTime}</span>
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    {!isChangingPhone && !isReverifying ? (
                                        <>
                                            <button
                                                onClick={() => setIsChangingPhone(true)}
                                                className="w-full py-4 bg-white lg:bg-transparent border border-forest-green/20 text-forest-green rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-forest-green/5 transition-all"
                                            >
                                                Change Mobile Number
                                            </button>
                                            <button
                                                onClick={handleStartReverify}
                                                className="w-full py-4 bg-forest-green/5 text-forest-green rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-forest-green/10 transition-all"
                                            >
                                                Re-verify Number
                                            </button>
                                        </>
                                    ) : isChangingPhone ? (
                                        <div className="bg-white rounded-xl border border-forest-green/10 p-5 mt-4">
                                            {changePhoneStep === 'input' ? (
                                                <form onSubmit={handleSendChangeOtp} className="space-y-4">
                                                    <div className="space-y-2">
                                                        <label className="font-inter text-[10px] uppercase font-bold text-forest-green/40 tracking-widest ml-1">New Mobile Number</label>
                                                        <div className="relative group">
                                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center border-r border-forest-green/10 pr-3">
                                                                <span className="font-inter text-sm font-bold text-forest-green/60">+91</span>
                                                            </div>
                                                            <input
                                                                type="tel"
                                                                required
                                                                maxLength={10}
                                                                value={newPhone}
                                                                onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, ''))}
                                                                className={`w-full p-4 pl-16 bg-ivory rounded-xl border ${changePhoneError ? 'border-red-500' : 'border-forest-green/5'} focus:ring-2 focus:ring-forest-green/10 outline-none transition-all font-inter text-sm tracking-[0.2em]`}
                                                                placeholder="98765 43210"
                                                            />
                                                        </div>
                                                        {changePhoneError && <p className="font-inter text-[10px] text-red-500 font-bold tracking-wider mt-1">{changePhoneError}</p>}
                                                    </div>
                                                    <div className="flex space-x-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => { setIsChangingPhone(false); setChangePhoneError(''); setNewPhone(''); }}
                                                            className="flex-1 py-4 bg-transparent border border-forest-green/20 text-forest-green rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-forest-green/5 transition-all"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            disabled={isSendingOtp || newPhone.length !== 10}
                                                            className="flex-1 py-4 bg-forest-green text-champagne-gold rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-forest-green/90 transition-all flex justify-center items-center space-x-2 disabled:opacity-50"
                                                        >
                                                            {isSendingOtp ? <Loader2 size={16} className="animate-spin" /> : <span>Send OTP</span>}
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <form onSubmit={handleVerifyChangeOtp} className="space-y-4">
                                                    <div className="space-y-2 text-center">
                                                        <p className="font-inter text-xs text-forest-green/60 mb-4">Enter the code sent to +91 {newPhone}</p>
                                                        <div className="flex justify-center gap-1 sm:gap-2 mx-auto">
                                                            {changeOtp.map((digit, index) => (
                                                                <input
                                                                    key={index}
                                                                    id={`change-otp-${index}`}
                                                                    type="text"
                                                                    maxLength="1"
                                                                    required
                                                                    value={digit}
                                                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                                    className="w-8 h-10 sm:w-11 sm:h-12 lg:w-12 lg:h-14 text-center text-sm sm:text-lg lg:text-xl font-bold text-forest-green bg-ivory border border-forest-green/10 rounded-xl focus:border-forest-green/30 outline-none focus:ring-2 focus:ring-forest-green/10 transition-all flex-shrink-0"
                                                                />
                                                            ))}
                                                        </div>
                                                        {changePhoneError && <p className="font-inter text-[10px] text-red-500 font-bold tracking-wider mt-2">{changePhoneError}</p>}
                                                    </div>

                                                    <div className="text-center mt-4">
                                                        <button
                                                            type="button"
                                                            disabled={timer > 0}
                                                            className="font-inter text-[10px] font-bold text-forest-green hover:underline uppercase tracking-widest disabled:opacity-40 disabled:hover:no-underline"
                                                        >
                                                            {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                                                        </button>
                                                    </div>

                                                    <div className="flex space-x-3 pt-4">
                                                        <button
                                                            type="button"
                                                            onClick={() => { setChangePhoneStep('input'); setChangePhoneError(''); setChangeOtp(['', '', '', '', '', '']); }}
                                                            className="flex-1 py-4 bg-transparent border border-forest-green/20 text-forest-green rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-forest-green/5 transition-all"
                                                        >
                                                            Back
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            disabled={changeOtp.some(d => !d) || updating}
                                                            className="flex-1 py-4 bg-forest-green text-champagne-gold rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-forest-green/90 transition-all flex justify-center items-center space-x-2 disabled:opacity-50"
                                                        >
                                                            {updating ? <Loader2 size={16} className="animate-spin" /> : <span>Verify Code</span>}
                                                        </button>
                                                    </div>
                                                </form>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="bg-white rounded-xl border border-forest-green/10 p-5 mt-4">
                                            <form onSubmit={handleVerifySubmit} className="space-y-4">
                                                <div className="space-y-2 text-center">
                                                    <p className="font-inter text-xs text-forest-green/60 mb-4">Enter the code sent to +91 {userPhone}</p>
                                                    <div className="flex justify-center gap-1 sm:gap-2 mx-auto">
                                                        {reverifyOtp.map((digit, index) => (
                                                            <input
                                                                key={index}
                                                                id={`reverify-otp-${index}`}
                                                                type="text"
                                                                maxLength="1"
                                                                required
                                                                value={digit}
                                                                onChange={(e) => handleReverifyOtpChange(index, e.target.value)}
                                                                onKeyDown={(e) => handleReverifyOtpKeyDown(index, e)}
                                                                className="w-8 h-10 sm:w-11 sm:h-12 lg:w-12 lg:h-14 text-center text-sm sm:text-lg lg:text-xl font-bold text-forest-green bg-ivory border border-forest-green/10 rounded-xl focus:border-forest-green/30 outline-none focus:ring-2 focus:ring-forest-green/10 transition-all flex-shrink-0"
                                                            />
                                                        ))}
                                                    </div>
                                                    {reverifyError && <p className="font-inter text-[10px] text-red-500 font-bold tracking-wider mt-2">{reverifyError}</p>}
                                                </div>

                                                <div className="text-center mt-4">
                                                    <button
                                                        type="button"
                                                        disabled={timer > 0}
                                                        className="font-inter text-[10px] font-bold text-forest-green hover:underline uppercase tracking-widest disabled:opacity-40 disabled:hover:no-underline"
                                                    >
                                                        {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                                                    </button>
                                                </div>

                                                <div className="flex space-x-3 pt-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => { setIsReverifying(false); setReverifyError(''); setReverifyOtp(['', '', '', '', '', '']); }}
                                                        className="flex-1 py-4 bg-transparent border border-forest-green/20 text-forest-green rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-forest-green/5 transition-all"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={reverifyOtp.some(d => !d)}
                                                        className="flex-1 py-4 bg-forest-green text-champagne-gold rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-forest-green/90 transition-all flex justify-center items-center"
                                                    >
                                                        Verify Code
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="lg:bg-white p-0 lg:p-10 lg:rounded-32 lg:border lg:border-forest-green/10 lg:shadow-sm">
                                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-6 hidden lg:flex">
                                    <Trash2 size={24} className="text-red-500" />
                                </div>
                                <h3 className="font-playfair text-xl lg:text-2xl text-forest-green mb-2 lg:mb-4">Privacy & Data</h3>
                                <p className="font-inter text-sm text-forest-green/60 mb-6 lg:mb-8 leading-relaxed">
                                    Take control of your digital footprint. You can request a copy of your adoption history or initiate account deletion.
                                </p>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={updating}
                                    className="font-inter text-[10px] uppercase font-bold text-red-500 tracking-widest hover:underline flex items-center space-x-2 group disabled:opacity-50"
                                >
                                    <span>Delete Account</span>
                                    <Trash2 size={12} className="group-hover:scale-110 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="space-y-10 lg:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <h1 className="font-playfair text-2xl lg:text-4xl text-forest-green mb-6 lg:mb-8">Account Summary</h1>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                                {[
                                    { label: 'Total Bookings', value: bookings.length.toString().padStart(2, '0'), id: 'summary', mobileHidden: true },
                                    { label: 'Saved Dogs', value: wishlistCount.toString().padStart(2, '0'), id: 'wishlist' },
                                ].map((stat, i) => (
                                    <div
                                        key={i}
                                        onClick={() => stat.id === 'summary' ? setActiveTab('summary') : onPageChange(stat.id)}
                                        className={`bg-white p-6 lg:p-8 rounded-24 border border-forest-green/10 shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-1 ${stat.mobileHidden ? 'hidden lg:block' : ''}`}
                                    >
                                        <p className="font-inter text-[11px] lg:text-[10px] uppercase tracking-wide lg:tracking-[0.2em] text-forest-green/40 mb-2 truncate">{stat.label}</p>
                                        <div className="font-playfair text-3xl lg:text-4xl text-forest-green">{stat.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-6 lg:mb-8">
                                <h3 className="font-playfair text-xl lg:text-2xl text-forest-green">Next Appointments</h3>
                                <button className="text-xs font-bold text-forest-green/40 hover:text-forest-green uppercase tracking-wider">See History</button>
                            </div>

                            <div className="space-y-4">
                                {bookings.length > 0 ? bookings.map((booking, idx) => (
                                    <div key={booking.id} className={`bg-white p-6 lg:p-8 rounded-24 border border-forest-green/10 flex flex-col sm:flex-row sm:items-center justify-between group hover:border-forest-green/40 transition-colors gap-4 lg:gap-6 ${idx > 1 ? 'hidden lg:flex' : ''}`}>
                                        <div className="flex items-center space-x-6 lg:space-x-8">
                                            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-forest-green/5 rounded-xl flex flex-col items-center justify-center shrink-0">
                                                <span className="font-inter text-[10px] lg:text-[10px] uppercase font-bold text-forest-green/40">
                                                    {new Date(booking.date).toLocaleString('default', { month: 'short' })}
                                                </span>
                                                <span className="font-playfair text-2xl lg:text-3xl text-forest-green leading-none">
                                                    {new Date(booking.date).getDate()}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="font-playfair text-lg lg:text-xl text-forest-green mb-1 truncate w-40 sm:w-auto">{booking.serviceName}</h4>
                                                <p className="font-inter text-sm lg:text-sm text-forest-green/40">Booking ID: #{booking.id.slice(-6).toUpperCase()}</p>
                                            </div>
                                        </div>
                                        <div className="sm:text-right">
                                            <div className="text-xs lg:text-sm font-bold text-forest-green tracking-wider uppercase">{booking.status}</div>
                                            <div className="text-xs lg:text-xs text-forest-green/40">{kennelDetail?.name || "SS Dog Kennels"}</div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="bg-white p-12 rounded-32 border border-forest-green/5 text-center">
                                        <Calendar className="w-12 h-12 text-forest-green/20 mx-auto mb-4" />
                                        <p className="font-playfair text-xl text-forest-green/40">No upcoming visits scheduled</p>
                                        <button
                                            onClick={() => onPageChange('services')}
                                            className="mt-4 text-forest-green font-bold text-xs uppercase tracking-widest hover:underline"
                                        >
                                            Book a Service
                                        </button>
                                    </div>
                                )}
                                {bookings.length > 2 && (
                                    <button className="lg:hidden w-full py-4 border border-forest-green/10 rounded-xl text-forest-green text-sm font-bold uppercase tracking-wider bg-white">
                                        View All History
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="fixed-layout py-6 lg:py-16 px-4 lg:px-10 min-h-screen">
            <div className="flex flex-col lg:flex-row lg:space-x-12">
                {/* Mobile Profile Header & Vertical-to-Horizontal Tabs */}
                <div className="lg:w-[300px] shrink-0 mb-8 lg:mb-0">
                    <div className="lg:hidden flex flex-col items-center mb-10 text-center">
                        <div className="w-24 h-24 bg-forest-green rounded-full mb-4 border-4 border-champagne-gold/20 relative group overflow-hidden shrink-0 shadow-lg">
                            <img src={`https://ui-avatars.com/api/?name=${profile?.firstName}+${profile?.lastName}&background=0D3B2E&color=D4AF37`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Profile" />
                        </div>
                        <h2 className="font-playfair text-2xl text-forest-green tracking-tight font-bold">{profile?.firstName} {profile?.lastName}</h2>
                        <p className="font-inter text-sm text-forest-green/60 mt-1">Customer since {new Date(profile?.createdAt).getFullYear()}</p>
                    </div>

                    <aside className="hidden lg:block sticky top-32">
                        <div className="bg-white rounded-24 p-10 border border-forest-green/10 shadow-xl">
                            <div className="flex flex-col items-center mb-10 text-center border-b border-forest-green/5 pb-10">
                                <div className="w-24 h-24 bg-forest-green rounded-full mb-6 border-4 border-champagne-gold/20 relative group overflow-hidden shrink-0">
                                    <img src={`https://ui-avatars.com/api/?name=${profile?.firstName}+${profile?.lastName}&background=0D3B2E&color=D4AF37`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Profile" />
                                </div>
                                <h2 className="font-playfair text-2xl text-forest-green">{profile?.firstName} {profile?.lastName}</h2>
                                <p className="font-inter text-[10px] text-forest-green/40 uppercase tracking-widest mt-1">Customer Since {new Date(profile?.createdAt).getFullYear()}</p>
                            </div>

                            <nav className="flex flex-col space-y-1 mb-10 pb-10 border-b border-forest-green/5">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-3 p-4 rounded-xl transition-all ${activeTab === tab.id ? 'bg-forest-green text-champagne-gold shadow-lg translate-x-2' : 'text-forest-green/60 hover:bg-forest-green/5'}`}
                                    >
                                        <tab.icon size={18} />
                                        <span className="font-inter text-sm font-medium">{tab.label}</span>
                                    </button>
                                ))}
                            </nav>

                            <nav className="flex flex-col space-y-1">
                                {externalLinks.map((link) => (
                                    <button
                                        key={link.id}
                                        onClick={() => onPageChange(link.id)}
                                        className="flex items-center justify-between p-4 rounded-xl text-forest-green/60 hover:bg-forest-green/5 transition-all text-left"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <link.icon size={18} />
                                            <span className="font-inter text-sm font-semibold">{link.label}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {link.count > 0 && <span className="bg-forest-green/10 text-forest-green text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{link.count}</span>}
                                        </div>
                                    </button>
                                ))}

                                <button
                                    onClick={onLogout}
                                    className="flex items-center space-x-3 p-4 text-red-500 hover:bg-red-50 rounded-xl transition-all mt-6 group"
                                >
                                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                                    <span className="font-inter text-sm font-semibold">Log out</span>
                                </button>
                            </nav>
                        </div>
                    </aside>

                    <nav className="lg:hidden flex space-x-2 overflow-x-auto scrollbar-hide pb-4 border-b border-forest-green/5 -mx-4 px-4 sticky top-[56px] bg-ivory z-30">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 px-5 py-3 rounded-full transition-all whitespace-nowrap text-sm font-bold tracking-tight ${activeTab === tab.id ? 'bg-forest-green text-champagne-gold shadow-md scale-105' : 'bg-white text-forest-green border border-forest-green/10'}`}
                            >
                                <tab.icon size={16} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <section className="flex-1 mt-6 lg:mt-0">
                    <div className="max-w-4xl mx-auto">
                        {renderContent()}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProfilePage;
