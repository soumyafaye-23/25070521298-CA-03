# LUMIERE — Luxury Restaurant Management System
### Full-Stack Continuous Assessment (CA) Submission

<p align="left">
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2D8?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</p>

> **Roll No / ID:** 25070521298  
> **Stack:** React / Next.js, Node.js, Express.js, MongoDB, Mongoose  
> **Frontend Port:** [http://localhost:3000](http://localhost:3000)  
> **Backend API Port:** [http://localhost:5000](http://localhost:5000)  
> **GitHub Repository:** [https://github.com/soumyafaye-23/25070521298-CA-03](https://github.com/soumyafaye-23/25070521298-CA-03)  

---

## 🌐 Live Service & Preview Links

Both servers run locally with full frontend-backend integration:

| Service | URL | Status | Description |
|---|---|---|---|
| **Frontend Application** | [http://localhost:3000](http://localhost:3000) | 🟢 **Live (HTTP 200)** | Next.js luxury restaurant web app |
| **Backend REST API** | [http://localhost:5000](http://localhost:5000) | 🟢 **Live (Online)** | Express & Node.js API server |
| **API Health & DB Check** | [http://localhost:5000/api/health](http://localhost:5000/api/health) | 🟢 **Live** | Server uptime and MongoDB status |
| **API Menu Catalog** | [http://localhost:5000/api/menu](http://localhost:5000/api/menu) | 🟢 **Live** | Full dish catalog with auto-seed |
| **API Reservations** | [http://localhost:5000/api/reservations](http://localhost:5000/api/reservations) | 🟢 **Live** | Real-time table bookings |
| **API Orders** | [http://localhost:5000/api/orders](http://localhost:5000/api/orders) | 🟢 **Live** | Placed orders and invoices |
| **GitHub Repository** | [https://github.com/soumyafaye-23/25070521298-CA-03](https://github.com/soumyafaye-23/25070521298-CA-03) | 🟢 **Public** | Official GitHub repository |

---

## 📋 Table of Contents
1. [Live Service & Preview Links](#-live-service--preview-links)
2. [Project Overview](#1-project-overview)
3. [Architecture](#2-architecture)
4. [Folder Structure](#3-folder-structure)
5. [Installation & Setup](#4-installation--setup)
6. [Environment Variables](#5-environment-variables)
7. [Database Configuration](#6-database-configuration)
8. [API Endpoints Reference](#7-api-endpoints-reference)
9. [Features Implemented](#8-features-implemented)
10. [Testing Verification](#9-testing-verification)

---

## 1. Project Overview

LUMIERE is an end-to-end full-stack dining and restaurant management web application. It allows customers to explore dishes across categories, book specific dining tables on an interactive restaurant seat map, checkout with automated invoice generation, track delivery in real time, and authenticate via secure JWT sessions.

---

## 2. Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Next.js Frontend                     │
│               (React 19, Tailwind CSS)                 │
│              http://localhost:3000                     │
└───────────────────────────┬────────────────────────────┘
                            │ REST API (Fetch / Axios)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Express.js Backend                   │
│             (Node.js REST API, JWT Auth)               │
│              http://localhost:5000                     │
└───────────────────────────┬────────────────────────────┘
                            │ Mongoose ODM
                            ▼
┌────────────────────────────────────────────────────────┐
│                    MongoDB Database                    │
│             (Collections: users, menuitems,            │
│                 reservations, orders)                  │
└────────────────────────────────────────────────────────┘
```

---

## 3. Folder Structure

```
25070521298/
├── Client/
│   ├── app/
│   │   ├── page.tsx             # Landing & Chef's Specials page
│   │   ├── menu/page.tsx        # Menu catalog with live category filter
│   │   ├── reservation/page.tsx # Table booking with dynamic seat availability
│   │   ├── cart/page.tsx        # Cart & order checkout
│   │   ├── track-order/page.tsx # Live order status tracker
│   │   └── layout.tsx           # Main application shell with Sonner toasts
│   ├── components/
│   │   ├── features/
│   │   │   ├── AuthModal.tsx    # User Login & Register modal dialog
│   │   │   ├── OrderBill.tsx    # Printable customer invoice
│   │   │   └── SeatMap.tsx      # Interactive restaurant floor plan
│   │   ├── layout/
│   │   │   └── Navbar.tsx       # Navigation bar with live cart count & auth
│   │   └── ui/
│   ├── lib/
│   │   ├── api.ts               # Centralized API service layer
│   │   ├── cart-context.tsx     # Cart global state provider
│   │   └── data.ts              # Menu data schema
│   ├── src/services/
│   │   └── api.js               # Service bridge compliant with CA layout
│   ├── public/images/           # High-resolution dish photography
│   ├── .env.local               # Client environment file
│   ├── .env.example
│   └── package.json
├── Server/
│   ├── config/
│   │   └── db.js                # MongoDB connection with resilient fallback
│   ├── controllers/
│   │   ├── authController.js    # Registration, Login, and Profile logic
│   │   ├── menuController.js    # Menu catalog CRUD & automatic seeding
│   │   ├── reservationController.js # Table reservation & clash prevention
│   │   └── orderController.js   # Order placement & status updates
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verification & role authorization
│   │   └── errorMiddleware.js   # Centralized 404 & error handling
│   ├── models/
│   │   ├── User.js              # User schema with bcrypt password hashing
│   │   ├── MenuItem.js          # Menu item schema
│   │   ├── Reservation.js       # Table reservation schema
│   │   └── Order.js             # Order invoice schema
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth routes
│   │   ├── menuRoutes.js        # /api/menu routes
│   │   ├── reservationRoutes.js # /api/reservations routes
│   │   └── orderRoutes.js       # /api/orders routes
│   ├── .env                     # Server environment file
│   ├── .env.example
│   ├── seed.js                  # Database seeder script
│   ├── server.js                # Main Express server entry point
│   └── package.json
├── .gitignore
└── README.md
```

---

## 4. Installation & Setup

### Prerequisites
- Node.js (v18.0.0 or higher recommended, tested on Node v24)
- npm (Node Package Manager)
- MongoDB (Local Community Server or free MongoDB Atlas cluster)

### Step 1: Install Server Dependencies
```bash
cd Server
npm install
```

### Step 2: Install Client Dependencies
```bash
cd ../Client
npm install
```

### Step 3: Run the Servers

**Terminal 1 — Start the Backend Server (Port 5000):**
```bash
cd Server
node server.js
```
*Output: `🚀 Lumiere Server is running on port 5000`*

**Terminal 2 — Start the Frontend Application (Port 3000):**
```bash
cd Client
npm run dev
```
*Access frontend in browser at: `http://localhost:3000`*

---

## 5. Environment Variables

### Server (`Server/.env`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/lumiere_restaurant
JWT_SECRET=lumiere_restaurant_super_secret_key_12345
```

### Client (`Client/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 6. Database Configuration

### Option A: Local MongoDB
Ensure MongoDB service is running locally (`mongod`). The default connection string is `mongodb://127.0.0.1:27017/lumiere_restaurant`.

### Option B: MongoDB Atlas (Cloud)
1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com).
2. Go to **Database Access** and create a database user.
3. In **Network Access**, add IP `0.0.0.0/0` (Allow access from anywhere).
4. Click **Connect** → **Drivers** and copy the URI.
5. Paste it in `Server/.env`:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/lumiere_restaurant?retryWrites=true&w=majority
   ```
6. Optionally run `node seed.js` in `Server/` to pre-seed the database.

> **Resilient Fallback Mode:** The server includes built-in in-memory fallback handlers for reservations, menu, orders, and authentication if MongoDB is temporarily starting up or offline, ensuring tests never crash.

---

## 7. API Endpoints Reference

### Health Check
- `GET /api/health` — Checks server status, uptime, and database connection.

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Protected |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user account (hashes password with bcrypt) | No |
| `POST` | `/api/auth/login` | Authenticate with email/password and obtain JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (Bearer Token) |

### Menu (`/api/menu`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/menu` | List all dishes (supports `?category=Mains` or `?featured=true`) |
| `GET` | `/api/menu/:id` | Fetch specific dish details |
| `POST` | `/api/menu` | Create a new dish item |
| `PUT` | `/api/menu/:id` | Update an existing dish |
| `DELETE` | `/api/menu/:id` | Remove a dish item |

### Table Reservations (`/api/reservations`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/reservations` | List all bookings |
| `GET` | `/api/reservations/tables` | Get occupied tables for date & time (`?date=YYYY-MM-DD&time=HH:mm`) |
| `POST` | `/api/reservations` | Reserve a table (validates table availability and prevents double bookings) |
| `GET` | `/api/reservations/:id` | Get reservation details by booking reference |
| `PATCH` | `/api/reservations/:id/cancel`| Cancel a reservation |

### Orders & Checkout (`/api/orders`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/orders` | List all placed orders |
| `POST` | `/api/orders` | Checkout cart, compute tax & service charge, save order to MongoDB |
| `GET` | `/api/orders/:id` | Fetch order details for order tracking |
| `PATCH` | `/api/orders/:id/status` | Update progress (`placed` -> `cooking` -> `picked_up` -> `near_you` -> `delivered`) |

---

## 8. Features Implemented

1. **Preserved Frontend Design**: Luxury gold & dark theme, Framer Motion animations, Lucide icons, responsive layout.
2. **Dynamic Menu Catalog**: Loaded from backend with category tab switching and instant Cart integration.
3. **Smart Floor Plan & Table Reservation**: Seat selection prevents double-booking identical tables for the same date/time.
4. **Cart Checkout & Invoicing**: Automated 10% GST & 5% service charge calculation, printable invoice (`OrderBill`), and real MongoDB order generation.
5. **Real-time Order Tracker**: Search and track status transitions from kitchen preparation to doorstep delivery.
6. **JWT User Authentication**: Registration and Login dialog in Navbar with bcrypt password security and persistent sessions.

---

## 9. Testing Verification

| Test Case | Method / Route | Expected Result | Status |
|---|---|---|---|
| Health Check | `GET /api/health` | Status 200, online status returned | ✅ PASSED |
| Menu Fetch | `GET /api/menu` | Returns array of 12 dishes | ✅ PASSED |
| User Register | `POST /api/auth/register` | User created, bcrypt hash, JWT issued | ✅ PASSED |
| User Login | `POST /api/auth/login` | Credentials verified, JWT returned | ✅ PASSED |
| Create Reservation | `POST /api/reservations` | Booking reference generated & saved | ✅ PASSED |
| Prevent Double Booking | `POST /api/reservations` | Returns 400 with clash alert | ✅ PASSED |
| Place Order | `POST /api/orders` | Computes totals, returns order ID | ✅ PASSED |
| Track Order | `GET /api/orders/:id` | Returns order details & status | ✅ PASSED |
| Next.js Client Build | `npm run build` | 0 errors, all 5 pages compiled | ✅ PASSED |
| Frontend Server | `http://localhost:3000` | HTTP 200 OK | ✅ PASSED |
