'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Lock, Mail, Phone, Eye, EyeOff, ArrowLeft, Loader2, LogOut, Sparkles, UtensilsCrossed, ShieldCheck, CalendarDays, ShoppingBag } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { toast } from 'sonner';
function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
    const redirectUrl = searchParams.get('redirect') || '/';
    const [mode, setMode] = useState(initialMode);
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        confirmPassword: '',
        rememberMe: true,
    });
    useEffect(() => {
        // Check if user is currently logged in
        api.getMe().then((res) => {
            if (res && res.user) {
                setCurrentUser(res.user);
            }
            setInitialLoading(false);
        });
    }, []);
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (mode === 'register' && formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match. Please verify your password.', {
                className: 'bg-zinc-900 border-red-500/30 text-white',
            });
            return;
        }
        setLoading(true);
        try {
            if (mode === 'login') {
                const res = await api.login({
                    email: formData.email,
                    password: formData.password,
                });
                if (res.user) {
                    setCurrentUser(res.user);
                    toast.success(`Welcome back, ${res.user.name || 'valued guest'}!`, {
                        description: res.isOfflineDemo ? 'Logged in (demo mode)' : 'Successfully signed in to your account',
                        className: 'bg-zinc-900 border-gold/30 text-white',
                    });
                    setTimeout(() => {
                        router.push(redirectUrl);
                    }, 800);
                }
            }
            else {
                const res = await api.register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                });
                if (res.user) {
                    setCurrentUser(res.user);
                    toast.success(`Account created! Welcome, ${res.user.name}!`, {
                        description: 'Your LUMIERE dining profile has been created',
                        className: 'bg-zinc-900 border-gold/30 text-white',
                    });
                    setTimeout(() => {
                        router.push(redirectUrl);
                    }, 800);
                }
            }
        }
        catch (err) {
            toast.error(err.message || 'Authentication failed. Please try again.', {
                className: 'bg-zinc-900 border-red-500/30 text-white',
            });
        }
        finally {
            setLoading(false);
        }
    };
    const handleDemoLogin = async () => {
        setLoading(true);
        try {
            const res = await api.login({
                email: 'gourmet.guest@lumiere.com',
                password: 'password123',
            });
            if (res.user) {
                setCurrentUser(res.user);
                toast.success(`Welcome, ${res.user.name}! (Demo Account)`, {
                    description: 'Exploring LUMIERE with full guest privileges.',
                    className: 'bg-zinc-900 border-gold/30 text-white',
                });
                setTimeout(() => {
                    router.push(redirectUrl);
                }, 800);
            }
        }
        catch (err) {
            toast.error('Demo login failed');
        }
        finally {
            setLoading(false);
        }
    };
    const handleLogout = () => {
        api.logout();
        setCurrentUser(null);
        toast.info('You have been signed out successfully.', {
            className: 'bg-zinc-900 border-gold/20 text-white',
        });
    };
    return (<div className="min-h-screen bg-background flex flex-col justify-between selection:bg-gold/30">
      <Navbar />

      <main className="flex-1 flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[140px] pointer-events-none"/>
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-amber-600/5 rounded-full blur-[120px] pointer-events-none"/>

        <div className="w-full max-w-md relative z-10">
          {/* Back Link */}
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-xs font-medium text-gray-400 hover:text-gold transition-colors gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5"/> Back to LUMIERE
            </Link>
          </div>

          {/* If already logged in */}
          {currentUser && !initialLoading ? (<motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="bg-surface/90 border border-gold/25 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden text-center">
              <div className="w-20 h-20 rounded-full bg-gold/15 border-2 border-gold flex items-center justify-center mx-auto text-gold text-3xl font-serif font-bold shadow-lg shadow-gold/10 mb-4">
                {currentUser.name ? currentUser.name[0]?.toUpperCase() : 'U'}
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 border border-gold/30 rounded-full text-xs font-medium text-gold mb-3">
                <ShieldCheck className="w-3.5 h-3.5"/> Verified Member
              </div>

              <h2 className="text-2xl font-serif font-bold text-white mb-1">
                {currentUser.name || 'Gourmet Patron'}
              </h2>
              <p className="text-gray-400 text-sm mb-1">{currentUser.email}</p>
              {currentUser.phone && (<p className="text-gray-500 text-xs">{currentUser.phone}</p>)}

              {/* Quick Actions */}
              <div className="mt-8 space-y-3">
                <Link href="/menu" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3 border-white/10 hover:border-gold/50 text-gray-200 hover:text-white">
                    <UtensilsCrossed className="w-4 h-4 text-gold"/>
                    <span>Explore Our Menu</span>
                  </Button>
                </Link>

                <Link href="/reservation" className="block">
                  <Button variant="gold" className="w-full justify-start gap-3">
                    <CalendarDays className="w-4 h-4"/>
                    <span>Reserve a Table</span>
                  </Button>
                </Link>

                <Link href="/track-order" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3 border-white/10 hover:border-gold/50 text-gray-200 hover:text-white">
                    <ShoppingBag className="w-4 h-4 text-gold"/>
                    <span>Track Your Orders</span>
                  </Button>
                </Link>

                <div className="pt-4 border-t border-white/10 mt-6">
                  <Button variant="outline" onClick={handleLogout} className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50">
                    <LogOut className="w-4 h-4 mr-2"/> Sign Out
                  </Button>
                </div>
              </div>
            </motion.div>) : (<motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-surface/90 border border-gold/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent"/>

              {/* Header Title */}
              <div className="text-center mb-6">
                <span className="text-xs font-serif tracking-[0.25em] text-gold uppercase block mb-1">
                  Haute Cuisine & Hospitality
                </span>
                <h1 className="text-3xl font-serif font-bold text-white tracking-wide">
                  {mode === 'login' ? 'Sign In to ' : 'Join '}
                  <span className="text-gold">LUMIERE</span>
                </h1>
                <p className="text-xs text-gray-400 mt-1.5">
                  {mode === 'login'
                ? 'Enter your credentials to access your reservations & orders'
                : 'Create your account to unlock private dining perks'}
                </p>
              </div>

              {/* Tab Selector */}
              <div className="flex bg-black/40 p-1 rounded-xl mb-6 border border-white/5">
                <button type="button" onClick={() => setMode('login')} className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${mode === 'login'
                ? 'bg-gold text-black font-semibold shadow-md'
                : 'text-gray-400 hover:text-white'}`}>
                  Sign In
                </button>
                <button type="button" onClick={() => setMode('register')} className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${mode === 'register'
                ? 'bg-gold text-black font-semibold shadow-md'
                : 'text-gray-400 hover:text-white'}`}>
                  Create Account
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (<div className="space-y-1">
                    <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gold"/> Full Name
                    </label>
                    <input type="text" name="name" required placeholder="e.g. Alex Montgomery" value={formData.name} onChange={handleChange} className="w-full bg-background/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"/>
                  </div>)}

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gold"/> Email Address
                  </label>
                  <input type="email" name="email" required placeholder="guest@example.com" value={formData.email} onChange={handleChange} className="w-full bg-background/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"/>
                </div>

                {mode === 'register' && (<div className="space-y-1">
                    <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gold"/> Phone Number (Optional)
                    </label>
                    <input type="tel" name="phone" placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} className="w-full bg-background/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"/>
                  </div>)}

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-gold"/> Password
                    </label>
                    {mode === 'login' && (<button type="button" onClick={() => toast.info('Password Reset', {
                    description: 'Please contact guest support or use the 1-Click Demo account.',
                    className: 'bg-zinc-900 border-gold/30 text-white',
                })} className="text-[11px] text-gold/80 hover:text-gold hover:underline">
                        Forgot password?
                      </button>)}
                  </div>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} name="password" required placeholder="••••••••" value={formData.password} onChange={handleChange} className="w-full bg-background/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors pr-10"/>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white" tabIndex={-1}>
                      {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                    </button>
                  </div>
                </div>

                {mode === 'register' && (<div className="space-y-1">
                    <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-gold"/> Confirm Password
                    </label>
                    <input type={showPassword ? 'text' : 'password'} name="confirmPassword" required placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} className="w-full bg-background/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"/>
                  </div>)}

                {mode === 'login' && (<div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={formData.rememberMe} onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })} className="w-3.5 h-3.5 rounded accent-gold bg-background border-white/10 cursor-pointer"/>
                      <span>Keep me signed in</span>
                    </label>
                  </div>)}

                <Button type="submit" variant="gold" disabled={loading} className="w-full mt-3 py-2.5 text-black font-semibold flex items-center justify-center gap-2 rounded-xl text-sm">
                  {loading && <Loader2 className="w-4 h-4 animate-spin"/>}
                  {mode === 'login' ? 'Sign In to Account' : 'Complete Registration'}
                </Button>
              </form>

              {/* Demo 1-Click Access for convenient testing */}
              <div className="mt-5 pt-4 border-t border-white/10">
                <Button type="button" variant="outline" onClick={handleDemoLogin} disabled={loading} className="w-full border-gold/40 text-gold hover:bg-gold/10 hover:text-gold flex items-center justify-center gap-2 rounded-xl text-xs py-2">
                  <Sparkles className="w-3.5 h-3.5"/>
                  <span>1-Click Demo Guest Login</span>
                </Button>
              </div>

              {/* Footer Switcher */}
              <div className="mt-6 text-center text-xs text-gray-400">
                {mode === 'login' ? (<>
                    First time at LUMIERE?{' '}
                    <button type="button" onClick={() => setMode('register')} className="text-gold font-semibold hover:underline ml-1">
                      Create an account
                    </button>
                  </>) : (<>
                    Already have an account?{' '}
                    <button type="button" onClick={() => setMode('login')} className="text-gold font-semibold hover:underline ml-1">
                      Sign in here
                    </button>
                  </>)}
              </div>
            </motion.div>)}

          {/* Secure Dining Guarantee */}
          <div className="mt-6 text-center text-[11px] text-gray-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-gold/70"/>
            <span>Encrypted 256-bit SSL Member Authentication</span>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="py-6 border-t border-white/5 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} LUMIERE Restaurant. All rights reserved.</p>
      </footer>
    </div>);
}
export default function LoginPage() {
    return (<Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-gold">
          <Loader2 className="w-8 h-8 animate-spin"/>
        </div>}>
      <LoginContent />
    </Suspense>);
}
