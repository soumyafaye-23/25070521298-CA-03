'use client';
import React, { createContext, useContext, useState } from 'react';
const CartContext = createContext(undefined);
export function CartProvider({ children }) {
    const [items, setItems] = useState([]);
    const addToCart = (product) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) => item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };
    const removeFromCart = (itemId) => {
        setItems((prev) => prev.filter((item) => item.id !== itemId));
    };
    const updateQuantity = (itemId, delta) => {
        setItems((prev) => prev.map((item) => {
            if (item.id === itemId) {
                return { ...item, quantity: Math.max(0, item.quantity + delta) };
            }
            return item;
        }).filter((item) => item.quantity > 0));
    };
    const clearCart = () => setItems([]);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return (<CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            total,
            itemCount,
        }}>
            {children}
        </CartContext.Provider>);
}
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
