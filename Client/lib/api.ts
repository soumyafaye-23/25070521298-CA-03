const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface MenuItemResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Appetizers' | 'Mains' | 'Desserts' | 'Breads';
  image: string;
  featured?: boolean;
}

export interface ReservationData {
  date: string;
  time: string;
  guests: string;
  name: string;
  phone: string;
  email?: string;
  requests?: string;
  tableId: string;
}

export interface OrderData {
  orderId?: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  customer?: {
    name?: string;
    phone?: string;
    address?: string;
  };
}

export const api = {
  // Menu Endpoints
  async getMenu(category?: string) {
    try {
      const url = category && category !== 'All'
        ? `${API_BASE_URL}/menu?category=${encodeURIComponent(category)}`
        : `${API_BASE_URL}/menu`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.warn('API getMenu failed, fallback to local data:', err);
      return null;
    }
  },

  // Reservation Endpoints
  async createReservation(data: ReservationData) {
    const res = await fetch(`${API_BASE_URL}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to create reservation');
    }
    return json;
  },

  async getReservedTables(date?: string, time?: string) {
    try {
      const params = new URLSearchParams();
      if (date) params.append('date', date);
      if (time) params.append('time', time);
      const res = await fetch(`${API_BASE_URL}/reservations/tables?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch reserved tables');
      const json = await res.json();
      return json.reservedTables || [];
    } catch (err) {
      console.warn('API getReservedTables error:', err);
      return [];
    }
  },

  async getReservationById(id: string) {
    const res = await fetch(`${API_BASE_URL}/reservations/${id}`);
    if (!res.ok) throw new Error('Reservation not found');
    return await res.json();
  },

  // Order Endpoints
  async createOrder(data: OrderData) {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to place order');
    }
    return json;
  },

  async getOrderById(id: string) {
    const res = await fetch(`${API_BASE_URL}/orders/${id}`);
    if (!res.ok) throw new Error('Order not found');
    return await res.json();
  },

  // Auth Endpoints
  async register(userData: { name: string; email: string; password: string; phone?: string }) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Registration failed');
    if (json.token) localStorage.setItem('lumiere_token', json.token);
    return json;
  },

  async login(credentials: { email: string; password: string }) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Login failed');
    if (json.token) localStorage.setItem('lumiere_token', json.token);
    return json;
  },

  async getMe() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('lumiere_token') : null;
    if (!token) return null;
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return await res.json();
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lumiere_token');
    }
  },
};
