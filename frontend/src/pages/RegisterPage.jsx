import React, { useState } from 'react';
import { User, Phone, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { registerWithMobilePassword } from '../lib/api';

const RegisterPage = ({ onPageChange, onRegisterSuccess }) => {
    const [formData, setFormData] = useState({ name: '', phone: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            setFormData((prev) => ({ ...prev, phone: value.replace(/\D/g, '').slice(0, 10) }));
            return;
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const payload = await registerWithMobilePassword(formData);
            onRegisterSuccess({
                phone: payload.phone_number || formData.phone,
                name: payload.name || formData.name,
                token: payload.token || '',
            });
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const phoneValid = /^[6-9]\d{9}$/.test(formData.phone);
    const canSubmit = formData.name.trim().length > 0 && phoneValid && formData.password.length >= 6 && !isLoading;

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-8 lg:py-20 px-4 lg:px-10 bg-ivory/30">
            <div className="w-full max-w-xl bg-white rounded-32 p-8 lg:p-12 border border-forest-green/10 shadow-2xl">
                <h1 className="font-playfair text-4xl text-forest-green mb-2">Register</h1>
                <p className="font-inter text-xs uppercase tracking-widest text-forest-green/40 mb-8">
                    Name, mobile number and password
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="font-inter text-[10px] uppercase tracking-widest font-bold text-forest-green/40 px-1">Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-forest-green/30" size={16} />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Your full name"
                                className="w-full bg-forest-green/5 rounded-xl py-4 pl-12 pr-4 font-inter text-sm outline-none ring-0 focus:ring-2 ring-forest-green/10"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="font-inter text-[10px] uppercase tracking-widest font-bold text-forest-green/40 px-1">Mobile Number</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-forest-green/30" size={16} />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                maxLength={10}
                                placeholder="9876543210"
                                className="w-full bg-forest-green/5 rounded-xl py-4 pl-12 pr-4 font-inter text-sm outline-none ring-0 focus:ring-2 ring-forest-green/10"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="font-inter text-[10px] uppercase tracking-widest font-bold text-forest-green/40 px-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-forest-green/30" size={16} />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                placeholder="Minimum 6 characters"
                                className="w-full bg-forest-green/5 rounded-xl py-4 pl-12 pr-4 font-inter text-sm outline-none ring-0 focus:ring-2 ring-forest-green/10"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl p-3 font-inter text-xs">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!canSubmit}
                        className="w-full py-4 bg-forest-green text-champagne-gold rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                        <span>{isLoading ? 'Creating account...' : 'Register'}</span>
                    </button>
                </form>

                <p className="mt-6 text-center font-inter text-xs text-forest-green/60">
                    Already have an account?{' '}
                    <button
                        onClick={() => onPageChange('login')}
                        className="font-bold text-forest-green underline underline-offset-4"
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
