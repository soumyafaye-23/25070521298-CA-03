'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';
import { AuthModal } from '@/components/features/AuthModal';
import { api } from '@/lib/api';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const { itemCount } = useCart();
    const [isBouncing, setIsBouncing] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // Check if user is already authenticated
        api.getMe().then((res) => {
            if (res && res.user) {
                setCurrentUser(res.user);
            }
        });
    }, []);

    useEffect(() => {
        if (itemCount > 0) {
            setIsBouncing(true);
            const timer = setTimeout(() => setIsBouncing(false), 300);
            return () => clearTimeout(timer);
        }
    }, [itemCount]);

    return (
        <>
            <nav
                className={cn(
                    'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
                    scrolled
                        ? 'bg-background/80 backdrop-blur-md border-b border-white/10 py-4'
                        : 'bg-transparent py-6'
                )}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-serif font-bold text-foreground tracking-wider">
                        LUMIERE
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {['Home', 'Menu', 'Reservation'].map((item) => (
                            <Link
                                key={item}
                                href={`/${item === 'Home' ? '' : item.toLowerCase()}`}
                                className="text-sm font-medium hover:text-gold transition-colors"
                            >
                                {item}
                            </Link>
                        ))}
                        <Link
                            href="/track-order"
                            className="text-sm font-medium hover:text-gold transition-colors text-gray-300"
                        >
                            Track Order
                        </Link>
                        <Link
                            href="/reservation"
                            className="px-5 py-2 bg-gold text-black font-semibold rounded-full hover:bg-gold-hover transition-colors shadow-lg shadow-gold/10"
                        >
                            Book a Table
                        </Link>

                        {/* User Account / Auth Button */}
                        <button
                            onClick={() => setIsAuthOpen(true)}
                            className="flex items-center gap-1.5 p-2 rounded-full hover:bg-white/10 transition-colors text-sm text-gray-300 hover:text-gold"
                            title={currentUser ? `Logged in as ${currentUser.name}` : 'Sign In'}
                        >
                            <User className="w-5 h-5" />
                            {currentUser && (
                                <span className="text-xs font-semibold max-w-[80px] truncate text-gold">
                                    {currentUser.name}
                                </span>
                            )}
                        </button>

                        {/* Cart Button */}
                        <Link href="/cart" className="relative p-2 hover:bg-white/10 rounded-full transition-colors">
                            <ShoppingBag className="w-5 h-5" />
                            <AnimatePresence>
                                {itemCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: isBouncing ? 1.5 : 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold"
                                    >
                                        {itemCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="flex md:hidden items-center gap-3">
                        <button
                            onClick={() => setIsAuthOpen(true)}
                            className="p-2 text-foreground"
                        >
                            <User className="w-5 h-5" />
                        </button>
                        <Link href="/cart" className="relative p-2">
                            <ShoppingBag className="w-5 h-5" />
                            {itemCount > 0 && (
                                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                        <button
                            className="p-2 text-foreground"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-background border-b border-white/10 overflow-hidden"
                        >
                            <div className="flex flex-col items-center py-8 space-y-6">
                                {['Home', 'Menu', 'Reservation'].map((item) => (
                                    <Link
                                        key={item}
                                        href={`/${item === 'Home' ? '' : item.toLowerCase()}`}
                                        className="text-lg font-medium hover:text-gold transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item}
                                    </Link>
                                ))}
                                <Link
                                    href="/track-order"
                                    className="text-lg font-medium hover:text-gold transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Track Order
                                </Link>
                                <Link
                                    href="/reservation"
                                    className="px-6 py-3 bg-gold text-black font-semibold rounded-full hover:bg-gold-hover transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Book a Table
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Authentication Modal */}
            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
            />
        </>
    );
}
