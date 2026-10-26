'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, Mail, Phone, Loader2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: any;
    setCurrentUser: (user: any) => void;
}

export function AuthModal({ isOpen, onClose, currentUser, setCurrentUser }: AuthModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                const res = await api.login({
                    email: formData.email,
                    password: formData.password,
                });
                if (res.success && res.user) {
                    setCurrentUser(res.user);
                    toast.success(`Welcome back, ${res.user.name}!`, {
                        className: 'bg-zinc-900 border-gold/20 text-white',
                    });
                    onClose();
                }
            } else {
                const res = await api.register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                });
                if (res.success && res.user) {
                    setCurrentUser(res.user);
                    toast.success(`Account created! Welcome, ${res.user.name}`, {
                        className: 'bg-zinc-900 border-gold/20 text-white',
                    });
                    onClose();
                }
            }
        } catch (err: any) {
            toast.error(err.message || 'Authentication failed', {
                className: 'bg-zinc-900 border-red-500/30 text-white',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        api.logout();
        setCurrentUser(null);
        toast.info('Logged out successfully', {
            className: 'bg-zinc-900 border-gold/20 text-white',
        });
        onClose();
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-md bg-surface border border-gold/20 rounded-2xl p-6 sm:p-8 shadow-2xl"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {currentUser ? (
                        <div className="text-center py-6 space-y-4">
                            <div className="w-16 h-16 rounded-full bg-gold/20 border border-gold flex items-center justify-center mx-auto text-gold text-2xl font-bold">
                                {currentUser.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{currentUser.name}</h3>
                                <p className="text-gray-400 text-sm">{currentUser.email}</p>
                                {currentUser.phone && <p className="text-gray-400 text-xs mt-1">{currentUser.phone}</p>}
                            </div>
                            <div className="pt-4">
                                <Button
                                    variant="outline"
                                    onClick={handleLogout}
                                    className="border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white w-full"
                                >
                                    <LogOut className="w-4 h-4 mr-2" /> Log Out
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-serif font-bold text-white mb-2">
                                    {isLogin ? 'Sign In to ' : 'Create '}
                                    <span className="text-gold">LUMIERE</span>
                                </h2>
                                <p className="text-xs text-gray-400">
                                    {isLogin
                                        ? 'Access your orders and table reservations'
                                        : 'Join us for a personalized dining experience'}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {!isLogin && (
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400 flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5 text-gold" /> Full Name
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm focus:border-gold focus:outline-none"
                                        />
                                    </div>
                                )}

                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 flex items-center gap-1.5">
                                        <Mail className="w-3.5 h-3.5 text-gold" /> Email Address
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="user@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm focus:border-gold focus:outline-none"
                                    />
                                </div>

                                {!isLogin && (
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400 flex items-center gap-1.5">
                                            <Phone className="w-3.5 h-3.5 text-gold" /> Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="+91 9876543210"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm focus:border-gold focus:outline-none"
                                        />
                                    </div>
                                )}

                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 flex items-center gap-1.5">
                                        <Lock className="w-3.5 h-3.5 text-gold" /> Password
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm focus:border-gold focus:outline-none"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    variant="gold"
                                    disabled={loading}
                                    className="w-full mt-4 flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                    {isLogin ? 'Sign In' : 'Register Account'}
                                </Button>
                            </form>

                            <div className="mt-6 text-center text-xs text-gray-400 border-t border-white/10 pt-4">
                                {isLogin ? "Don't have an account yet?" : 'Already have an account?'}{' '}
                                <button
                                    type="button"
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-gold font-semibold hover:underline ml-1"
                                >
                                    {isLogin ? 'Register here' : 'Sign In'}
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
