# AURA — Full-Stack E-Commerce Platform

A modern, high-performance full-stack e-commerce web application built with **React, TypeScript, Node.js, and Express**.

---

## 🏗️ Architecture & Project Structure

```bash
ecommerce/
├── frontend/                   # Frontend: React 19 + TypeScript + Vite + Vanilla CSS
│   ├── src/
│   │   ├── components/         # Navbar, HeroBanner, CategoryFilter, ProductCard, CartDrawer, etc.
│   │   ├── context/            # CartContext (State, LocalStorage persistence, Wishlist, Checkout)
│   │   ├── data/               # Catalog fallback data with specs & high-res assets
│   │   ├── services/           # API service layer with auto-fallback
│   │   ├── types/              # Strict TypeScript interfaces
│   │   ├── App.tsx             # Main Store App
│   │   └── index.css           # Luxury design system with CSS custom properties
│   └── package.json
├── backend/                    # Backend: Node.js + Express + TypeScript + Prisma ORM
│   ├── prisma/
│   │   ├── schema.prisma       # Prisma 7 PostgreSQL schema (Category, Product, Order, OrderItem)
│   │   └── seed.ts             # Initial database catalog & category seeder
│   ├── src/
│   │   ├── controllers/        # Products, Orders, and Categories controllers with Prisma queries
│   │   ├── routes/             # RESTful API route definitions
│   │   ├── lib/prisma.ts       # Prisma Client singleton with PostgreSQL connection pool
│   │   ├── data/               # Catalog fallbacks
│   │   ├── middleware/         # 404 & global error handling
│   │   ├── types/              # Backend data contracts & DTOs
│   │   ├── app.ts              # Express application config & CORS
│   │   └── server.ts           # Server entry point
│   ├── .env                    # Environment variables (configured with DATABASE_URL)
│   ├── .env.example            # Environment variables template
│   ├── prisma.config.ts        # Prisma 7 CLI configuration
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml          # PostgreSQL 16 Alpine container configuration
├── package.json                # Monorepo orchestration scripts
└── README.md
```

---

## ⚡ Quick Start

### 1. Start PostgreSQL (Docker)
Start the PostgreSQL container:
```bash
docker compose up -d
# or using the root npm shortcut:
npm run docker:up
```
> Running on `localhost:5434` (mapped to port 5434 so it won't conflict with any other PostgreSQL services on 5432/5433).

### 2. Backend Server & Database Setup
From the root directory or inside `backend/`:
```bash
cd backend
npm install
npm run db:push    # Sync schema to PostgreSQL
npm run db:seed    # Seed catalog & categories
npm run dev        # Run API server with live reload
```
> The API server will start on [http://localhost:5000](http://localhost:5000).

To view and edit database records visually via Prisma Studio:
```bash
npm run db:studio
```

### 3. Frontend Client Setup
In a second terminal:
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
> The frontend will run on [http://localhost:5173](http://localhost:5173) and automatically communicate with the backend on port 5000.

### 4. Running from Root
You can also run commands directly from the root repository:
- `npm run docker:up` — Start PostgreSQL Docker container
- `npm run docker:down` — Stop PostgreSQL Docker container
- `npm run db:push` — Push Prisma schema to PostgreSQL
- `npm run db:seed` — Seed initial data to database
- `npm run db:studio` — Open Prisma Studio GUI
- `npm run dev:backend` — Run backend with live reload
- `npm run dev:frontend` — Run frontend Vite server
- `npm run build:backend` — Compile backend TypeScript
- `npm run build:frontend` — Build frontend production bundle

---

## 📡 Backend API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API status and directory |
| `GET` | `/api/health` | Health check & uptime |
| `GET` | `/api/products` | Get products (supports `category`, `search`, `sortBy`, `inStockOnly`, `featured`) |
| `GET` | `/api/products/:id` | Get single product by ID |
| `POST` | `/api/products` | Create a new product |
| `PUT` | `/api/products/:id` | Update product details |
| `DELETE` | `/api/products/:id` | Delete product |
| `GET` | `/api/categories` | Get categories with active product counts |
| `GET` | `/api/categories/:slug` | Get category by slug |
| `POST` | `/api/orders` | Place new order & auto-deduct inventory |
| `GET` | `/api/orders` | List all orders |
| `GET` | `/api/orders/:id` | Get order details by order ID |

---

## 🌟 Key Features

- **Luxury Design System**: Custom glassmorphism, responsive grid, dynamic dark/light themes.
- **Dynamic Catalog**: Category tabs, real-time search, price & rating sorting, in-stock filtering.
- **Quick-View Modal**: Image gallery, tech specs table, quantity stepper, and quick action buttons.
- **Cart Drawer & Wishlist**: Real-time bag totals, free shipping progress bar, and localStorage persistence.
- **Checkout & Inventory Flow**: Multi-step checkout with backend order verification and live stock deduction.
- **Full-Stack Resilience**: Seamless auto-fallback ensures frontend stays fully functional even when backend is offline.
