'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { SeatMap } from '@/components/features/SeatMap';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function ReservationPage() {
    const [step, setStep] = useState(1); // 1: Details, 2: Seat Selection, 3: Confirmation
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        guests: '2',
        name: '',
        email: '',
        phone: '',
        requests: '',
        tableId: '',
    });
    const [loading, setLoading] = useState(false);
    const [reservedTables, setReservedTables] = useState<string[]>(['T2', 'T6']);
    const [reservationResult, setReservationResult] = useState<{ reservationId: string } | null>(null);

    const handleDetailsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Fetch dynamically reserved tables from backend API
            const tables = await api.getReservedTables(formData.date, formData.time);
            if (tables && tables.length > 0) {
                setReservedTables(tables);
            }
        } catch (err) {
            console.warn('Could not fetch reserved tables, using defaults');
        } finally {
            setLoading(false);
            setStep(2);
        }
    };

    const handleTableSelect = (tableId: string) => {
        setFormData({ ...formData, tableId });
    };

    const handleFinalSubmit = async () => {
        if (!formData.tableId) return;
        setLoading(true);
        try {
            const res = await api.createReservation(formData);
            if (res.success && res.data) {
                setReservationResult(res.data);
                toast.success('Table Reserved Successfully!', {
                    description: `Booking Reference: ${res.data.reservationId}`,
                    className: 'bg-zinc-900 border-gold/20 text-white',
                });
                setStep(3);
            } else {
                throw new Error(res.message || 'Failed to reserve table');
            }
        } catch (err: any) {
            toast.error(err.message || 'Error creating reservation', {
                className: 'bg-zinc-900 border-red-500/30 text-white',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="pt-32 pb-12 text-center px-4">
                <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
                    Book a <span className="text-gold">Table</span>
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Reserve your spot for an unforgettable dining experience. Real-time availability connected to MongoDB.
                </p>
            </div>

            <div className="container mx-auto px-4 md:px-10 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-surface p-8 md:p-12 rounded-2xl shadow-2xl shadow-gold/5 min-h-[500px]"
                >
                    {step === 1 && (
                        <form onSubmit={handleDetailsSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gold" /> Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-background border border-white/10 rounded-lg p-3 focus:border-gold focus:outline-none transition-colors"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gold" /> Time
                                    </label>
                                    <select
                                        required
                                        className="w-full bg-background border border-white/10 rounded-lg p-3 focus:border-gold focus:outline-none transition-colors"
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    >
                                        <option value="">Select Time</option>
                                        <option value="17:00">5:00 PM</option>
                                        <option value="17:30">5:30 PM</option>
                                        <option value="18:00">6:00 PM</option>
                                        <option value="18:30">6:30 PM</option>
                                        <option value="19:00">7:00 PM</option>
                                        <option value="19:30">7:30 PM</option>
                                        <option value="20:00">8:00 PM</option>
                                        <option value="20:30">8:30 PM</option>
                                        <option value="21:00">9:00 PM</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                        <Users className="w-4 h-4 text-gold" /> Guests
                                    </label>
                                    <select
                                        required
                                        className="w-full bg-background border border-white/10 rounded-lg p-3 focus:border-gold focus:outline-none transition-colors"
                                        value={formData.guests}
                                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, '8+'].map((num) => (
                                            <option key={num} value={num}>
                                                {num} People
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="John Doe"
                                        className="w-full bg-background border border-white/10 rounded-lg p-3 focus:border-gold focus:outline-none transition-colors"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Phone</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="+1 234 567 890"
                                        className="w-full bg-background border border-white/10 rounded-lg p-3 focus:border-gold focus:outline-none transition-colors"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Special Requests</label>
                                <textarea
                                    rows={3}
                                    placeholder="Allergies, anniversary, candle light, etc."
                                    className="w-full bg-background border border-white/10 rounded-lg p-3 focus:border-gold focus:outline-none transition-colors"
                                    value={formData.requests}
                                    onChange={(e) => setFormData({ ...formData, requests: e.target.value })}
                                />
                            </div>

                            <div className="text-center pt-4">
                                <Button type="submit" variant="gold" size="lg" disabled={loading} className="w-full md:w-auto px-12">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                                    Select Table
                                </Button>
                            </div>
                        </form>
                    )}

                    {step === 2 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            <div className="text-center md:text-left mb-6">
                                <h2 className="text-2xl font-serif font-bold text-gold">Select Your Table</h2>
                                <p className="text-gray-400 text-sm">
                                    Live floor plan for {formData.date} at {formData.time}. Green tables are available.
                                </p>
                            </div>

                            <SeatMap
                                onTableSelect={handleTableSelect}
                                selectedTable={formData.tableId}
                                reservedTables={reservedTables}
                            />

                            <div className="flex justify-between items-center pt-6">
                                <Button variant="ghost" onClick={() => setStep(1)} className="text-gray-400 hover:text-white">
                                    Back
                                </Button>
                                <Button
                                    onClick={handleFinalSubmit}
                                    variant="gold"
                                    size="lg"
                                    disabled={!formData.tableId || loading}
                                    className="px-12 flex items-center gap-2"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                                    Confirm Reservation {formData.tableId && `(${formData.tableId})`}
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-16"
                        >
                            <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Calendar className="w-10 h-10 text-gold" />
                            </div>
                            <h2 className="text-3xl font-serif font-bold mb-4">Reservation Confirmed!</h2>
                            <p className="text-gray-400 mb-4 max-w-lg mx-auto">
                                Thank you, <span className="text-white font-semibold">{formData.name}</span>. We look forward to hosting you on{' '}
                                <span className="text-white font-semibold">{formData.date}</span> at <span className="text-white font-semibold">{formData.time}</span>. <br />
                                We have reserved <span className="text-gold font-bold">Table {formData.tableId}</span> for you.
                            </p>
                            {reservationResult?.reservationId && (
                                <div className="inline-block bg-zinc-900 border border-gold/30 px-4 py-2 rounded-lg font-mono text-xs text-gold mb-8">
                                    Booking Reference: {reservationResult.reservationId}
                                </div>
                            )}
                            <div className="flex justify-center gap-4">
                                <Button variant="outline" onClick={() => { setStep(1); setFormData({ ...formData, tableId: '' }) }}>
                                    Make Another Reservation
                                </Button>
                                <Button variant="gold" onClick={() => window.location.href = '/menu'}>
                                    View Menu
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </main>
    );
}
