'use client';

import { MenuItem } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface OrderBillProps {
    items: (MenuItem & { quantity: number })[];
    total: number;
    orderId: string;
    date: string;
}

export function OrderBill({ items, total, orderId, date }: OrderBillProps) {
    const tax = total * 0.10;
    const serviceCharge = total * 0.05;
    const grandTotal = total + tax + serviceCharge;

    return (
        <div className="bg-white text-black p-8 rounded-lg shadow-xl max-w-md mx-auto font-mono text-sm">
            <div className="text-center border-b border-black/10 pb-4 mb-4">
                <h2 className="text-2xl font-bold font-serif mb-1">LUMIERE</h2>
                <p className="text-gray-600">Premium Dining Experience</p>
                <p className="text-xs text-gray-500 mt-2">123 Culinary Avenue, Food City</p>
            </div>

            <div className="flex justify-between mb-4">
                <div>
                    <p>Order #: {orderId}</p>
                </div>
                <div className="text-right">
                    <p>{date}</p>
                </div>
            </div>

            <div className="space-y-3 mb-6">
                {items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                        <span>{item.quantity}x {item.name}</span>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
            </div>

            <div className="border-t border-black/10 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Tax (10%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Service Charge (5%)</span>
                    <span>₹{serviceCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-black">
                    <span>Grand Total</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                </div>
            </div>

            <div className="mt-8 text-center space-y-4">
                <p className="italic">Thank you for dining with us!</p>
                <Button
                    variant="outline"
                    className="w-full border-black hover:bg-black hover:text-white transition-colors"
                    onClick={() => window.print()}
                >
                    <Printer className="w-4 h-4 mr-2" /> Print Bill
                </Button>
            </div>
        </div>
    );
}
