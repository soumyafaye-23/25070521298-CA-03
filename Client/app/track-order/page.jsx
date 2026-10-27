'use client';
import { Navbar } from '@/components/layout/Navbar';
import { motion } from 'framer-motion';
import { MapPin, Home, ChefHat, Truck, CheckCircle, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { api } from '@/lib/api';
export default function TrackOrderPage() {
    const [status, setStatus] = useState(0);
    const [orderIdInput, setOrderIdInput] = useState('');
    const [currentOrder, setCurrentOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        // Read last placed order from storage
        const savedOrderId = typeof window !== 'undefined' ? localStorage.getItem('lumiere_last_order_id') : null;
        if (savedOrderId) {
            setOrderIdInput(savedOrderId);
            lookupOrder(savedOrderId);
        }
    }, []);
    const lookupOrder = async (id) => {
        if (!id)
            return;
        setLoading(true);
        try {
            const res = await api.getOrderById(id.trim());
            if (res.success && res.data) {
                setCurrentOrder(res.data);
                // Map status to progress step
                const statusMap = {
                    placed: 0,
                    cooking: 0,
                    picked_up: 1,
                    near_you: 2,
                    delivered: 3,
                };
                setStatus(statusMap[res.data.status] ?? 1);
            }
        }
        catch (err) {
            // Keep simulated flow if order id not in DB
        }
        finally {
            setLoading(false);
        }
    };
    // Simulate order progress if actively watching
    useEffect(() => {
        const timer1 = setTimeout(() => setStatus(1), 3000); // Kitchen
        const timer2 = setTimeout(() => setStatus(2), 7000); // Out for delivery
        const timer3 = setTimeout(() => setStatus(3), 11000); // Delivered
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, []);
    const steps = [
        { icon: ChefHat, label: 'Cooking', desc: 'Chef is preparing your meal' },
        { icon: Truck, label: 'Picked Up', desc: 'Driver is on the way' },
        { icon: MapPin, label: 'Near You', desc: 'Arriving in 2 mins' },
        { icon: CheckCircle, label: 'Delivered', desc: 'Enjoy your meal!' },
    ];
    return (<main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="pt-32 container mx-auto px-4 max-w-3xl">
                <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4 text-center">
                    Track <span className="text-gold">Order</span>
                </h1>
                <p className="text-gray-400 text-center mb-8 text-sm">
                    Real-time status updates powered by Express & MongoDB API
                </p>

                {/* Search Order Bar */}
                <div className="flex gap-2 mb-8 max-w-md mx-auto">
                    <input type="text" placeholder="Enter Order ID (e.g. LUM-XXXX)" value={orderIdInput} onChange={(e) => setOrderIdInput(e.target.value)} className="flex-1 bg-surface border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-gold focus:outline-none transition-colors"/>
                    <Button variant="gold" onClick={() => lookupOrder(orderIdInput)} disabled={loading} className="px-6">
                        <Search className="w-4 h-4 mr-1"/> Track
                    </Button>
                </div>

                {currentOrder && (<div className="bg-surface border border-gold/20 rounded-xl p-4 mb-8 text-sm flex flex-wrap justify-between items-center gap-4">
                        <div>
                            <span className="text-gray-400">Order ID: </span>
                            <span className="font-mono font-bold text-gold">{currentOrder.orderId}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Items: </span>
                            <span className="font-semibold text-white">{currentOrder.items?.length || 1} dishes</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Total: </span>
                            <span className="font-bold text-gold">₹{currentOrder.total}</span>
                        </div>
                    </div>)}

                {/* Map Visualization (Simulated) */}
                <div className="bg-surface rounded-2xl overflow-hidden shadow-2xl border border-white/10 h-[300px] relative mb-10 group">
                    <div className="absolute inset-0 bg-neutral-800 opacity-50"/>
                    {/* Grid lines for map effect */}
                    <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)',
            backgroundSize: '20px 20px'
        }}/>

                    {/* Path */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <path d="M 100 150 Q 250 50 400 150 T 700 150" fill="none" stroke="#D4AF37" strokeWidth="2" strokeDasharray="5,5"/>
                    </svg>

                    {/* Home Icon */}
                    <div className="absolute right-10 md:right-20 top-1/2 -translate-y-1/2 flex flex-col items-center">
                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500 animate-pulse">
                            <Home className="text-green-500"/>
                        </div>
                        <span className="text-xs mt-2 font-bold">You</span>
                    </div>

                    {/* Moving Driver Icon */}
                    <motion.div className="absolute top-1/2 -translate-y-1/2" initial={{ left: '10%' }} animate={{
            left: status === 0 ? '10%' : status === 1 ? '30%' : status === 2 ? '60%' : '85%'
        }} transition={{ duration: 2, ease: "easeInOut" }}>
                        <div className="flex flex-col items-center relative z-10">
                            <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center shadow-lg shadow-gold/50">
                                <Truck className="text-black w-5 h-5"/>
                            </div>
                            <div className="bg-black/80 px-2 py-1 rounded text-xs mt-2 border border-white/10 whitespace-nowrap">
                                {status === 3 ? 'Arrived!' : 'On the move'}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Timeline */}
                <div className="space-y-8 relative">
                    {/* Vertical Line */}
                    <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-white/10 md:left-1/2 md:-ml-px"/>

                    {steps.map((step, index) => {
            const isActive = index <= status;
            const Icon = step.icon;
            return (<motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.2 }} className={`relative flex items-center gap-6 md:justify-center ${isActive ? 'opacity-100' : 'opacity-30 blur-[1px]'}`}>
                                {/* Left Side (Desktop) */}
                                <div className="hidden md:block w-1/2 text-right pr-10">
                                    <h3 className={`text-xl font-bold ${isActive ? 'text-gold' : 'text-gray-500'}`}>
                                        {step.label}
                                    </h3>
                                    <p className="text-sm text-gray-400">{step.desc}</p>
                                </div>

                                {/* Center Icon */}
                                <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isActive
                    ? 'bg-gold border-gold text-black shadow-lg shadow-gold/20 scale-110'
                    : 'bg-surface border-white/10 text-gray-500'}`}>
                                    <Icon className="w-5 h-5"/>
                                </div>

                                {/* Right Side (Mobile & Desktop) */}
                                <div className="md:w-1/2 md:pl-10">
                                    <div className="md:hidden">
                                        <h3 className={`text-xl font-bold ${isActive ? 'text-gold' : 'text-gray-500'}`}>
                                            {step.label}
                                        </h3>
                                        <p className="text-sm text-gray-400">{step.desc}</p>
                                    </div>
                                </div>
                            </motion.div>);
        })}
                </div>

                {status === 3 && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 text-center">
                        <Link href="/menu">
                            <Button variant="gold" size="lg">Order Again</Button>
                        </Link>
                    </motion.div>)}
            </div>
        </main>);
}
