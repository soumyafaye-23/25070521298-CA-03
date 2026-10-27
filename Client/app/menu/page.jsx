'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { menuItems as fallbackMenuItems } from '@/lib/data';
import { api } from '@/lib/api';
import { useCart } from '@/lib/cart-context';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
const categories = ['All', 'Appetizers', 'Mains', 'Breads', 'Desserts'];
export default function MenuPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [itemsList, setItemsList] = useState(fallbackMenuItems);
    const [loading, setLoading] = useState(false);
    const [isLiveApi, setIsLiveApi] = useState(false);
    const { addToCart } = useCart();
    useEffect(() => {
        let isMounted = true;
        const fetchDishes = async () => {
            setLoading(true);
            try {
                const apiItems = await api.getMenu(activeCategory);
                if (isMounted && apiItems && apiItems.length > 0) {
                    setItemsList(apiItems);
                    setIsLiveApi(true);
                }
                else if (isMounted) {
                    // Fallback filtering
                    const filtered = activeCategory === 'All'
                        ? fallbackMenuItems
                        : fallbackMenuItems.filter((item) => item.category === activeCategory);
                    setItemsList(filtered);
                }
            }
            catch (err) {
                if (isMounted) {
                    const filtered = activeCategory === 'All'
                        ? fallbackMenuItems
                        : fallbackMenuItems.filter((item) => item.category === activeCategory);
                    setItemsList(filtered);
                }
            }
            finally {
                if (isMounted)
                    setLoading(false);
            }
        };
        fetchDishes();
        return () => {
            isMounted = false;
        };
    }, [activeCategory]);
    const handleAddToCart = (item) => {
        addToCart(item);
        toast.success(`Added ${item.name} to cart`, {
            description: "View your cart to checkout",
            action: {
                label: "View Cart",
                onClick: () => window.location.href = '/cart'
            },
            className: "bg-zinc-900 border-gold/20 text-white"
        });
    };
    return (<main className="min-h-screen bg-background pb-20">
            <Navbar />

            {/* Header */}
            <div className="pt-32 pb-12 text-center px-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-medium mb-3">
                    <Sparkles className="w-3.5 h-3.5"/>
                    {isLiveApi ? 'Connected to MongoDB & Express Backend' : 'Lumiere Signature Dishes'}
                </div>
                <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
                    Our <span className="text-gold">Menu</span>
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Explore our carefully curated selection of authentic dishes, each telling a unique story of flavor and tradition.
                </p>
            </div>

            {/* Category Tabs */}
            <div className="sticky top-20 z-40 bg-background/95 backdrop-blur shadow-sm mb-12 py-4">
                <div className="flex justify-center flex-wrap gap-2 px-4 max-w-4xl mx-auto">
                    {categories.map((category) => (<button key={category} onClick={() => setActiveCategory(category)} className={cn('px-6 py-2 rounded-full text-sm font-medium transition-all duration-300', activeCategory === category
                ? 'bg-gold text-black shadow-lg shadow-gold/20'
                : 'bg-surface text-gray-400 hover:bg-surface-hover hover:text-white')}>
                            {category}
                        </button>))}
                </div>
            </div>

            {/* Menu Grid */}
            <div className="container mx-auto px-4 md:px-10">
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-12">
                    <AnimatePresence>
                        {itemsList.map((item) => (<motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }} key={item.id} className="group flex flex-col sm:flex-row bg-surface rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-gold/5 transition-all duration-300">
                                {/* Image Side */}
                                <div className="relative w-full sm:w-1/3 h-48 sm:h-auto overflow-hidden">
                                    <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500"/>
                                </div>

                                {/* Content Side */}
                                <div className="flex-1 p-6 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold font-serif group-hover:text-gold transition-colors">
                                                {item.name}
                                            </h3>
                                            <span className="text-gold font-bold text-lg">₹{item.price}</span>
                                        </div>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button onClick={() => handleAddToCart(item)} size="sm" variant="outline" className="border-white/10 hover:border-gold hover:bg-gold hover:text-black gap-2 transition-all duration-300">
                                            <Plus className="w-4 h-4"/> Add
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>))}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Floating View Order Button (Mobile) */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden">
                <Link href="/cart">
                    <Button variant="gold" size="lg" className="shadow-2xl shadow-gold/20 rounded-full px-8">
                        View Order
                    </Button>
                </Link>
            </div>
        </main>);
}
