'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { menuItems } from '@/lib/data';
import { useCart } from '@/lib/cart-context';
import { toast } from 'sonner';

export default function Home() {
  const { addToCart } = useCart();
  const featuredItems = menuItems.filter((item) => item.featured);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/30 z-10" />
          {/* Placeholder for hero background - using one of the food images as a large blur for now if no specific hero exists */}
          <Image
            src="/images/Paneer_Lababdar.webp"
            alt="Hero Background"
            fill
            className="object-cover opacity-50 blur-sm scale-110"
            priority
          />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6"
          >
            Experience the <span className="text-gold">Art</span> of Dining
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
          >
            Indulge in a symphony of flavors crafted with passion and served with elegance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/reservation">
              <Button variant="gold" size="lg" className="text-lg px-8">
                Book a Table
              </Button>
            </Link>
            <Link href="/menu">
              <Button variant="outline" size="lg" className="text-lg px-8 border-gold text-gold hover:bg-gold hover:text-black">
                View Menu <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="py-24 px-6 container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Chef's <span className="text-gold">Specials</span>
          </h2>
          <p className="text-gray-400">Curated dishes that define our culinary excellence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {featuredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-surface rounded-xl overflow-hidden shadow-lg hover:shadow-gold/10 transition-shadow duration-300"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold font-serif">{item.name}</h3>
                  <span className="text-gold font-bold text-lg">₹{item.price}</span>
                </div>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex text-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Button
                    size="sm"
                    variant="gold"
                    className="rounded-full"
                    onClick={() => {
                      addToCart(item);
                      toast.success(`Added ${item.name} to cart`);
                    }}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Location & Map Section */}
      <section className="py-24 px-6 bg-surface relative overflow-hidden">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-serif font-bold">
              Find <span className="text-gold">Us</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Located in the heart of the city, LUMIERE offers a sanctuary of taste and tranquility.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <span className="text-xl">📍</span>
                </div>
                <div>
                  <h3 className="font-bold text-white">Address</h3>
                  <p className="text-gray-400">123 Culinary Avenue, Food District, FD 10101</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <span className="text-xl">📞</span>
                </div>
                <div>
                  <h3 className="font-bold text-white">Reservations</h3>
                  <p className="text-gray-400">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Frame */}
          <div className="relative h-[400px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.88727280387!2d77.20666037550007!3d28.60315797568085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2db961be393%3A0xf6c24c1332214341!2sIndia%20Gate!5e0!3m2!1sen!2sin!4v1705646399622!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(1) contrast(1.2) opacity(0.8)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="absolute inset-0 pointer-events-none border-2 border-gold/20 rounded-2xl" />
          </div>
        </div>
      </section>
    </main>
  );
}
