# AURA — Full-Stack E-Commerce Platform

A modern, high-performance full-stack e-commerce web application built with **React, TypeScript, Node.js, and Express**.

---

## 🏗️ Architecture & Structure

```bash
ecommerce/
├── client/          # Frontend: React 19 + TypeScript + Vite + Vanilla CSS
│   ├── src/
│   │   ├── components/   # Navbar, HeroBanner, CategoryFilter, ProductCard, CartDrawer, etc.
│   │   ├── context/      # CartContext (State, LocalStorage persistence, Wishlist, Checkout)
│   │   ├── data/         # Catalog data with specs & high-res assets
│   │   ├── services/     # API service with backend fallback
│   │   ├── types/        # Strict TypeScript interfaces
│   │   ├── App.tsx       # Main Store App
│   │   └── index.css     # Luxury design system with CSS custom properties
│   └── package.json
├── server/          # Backend: Node.js + Express + TypeScript (Upcoming)
└── README.md
```

---

## ⚡ Getting Started (Frontend)

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 🌟 Key Features

- **Luxury Design System**: Custom glassmorphism, responsive grid, dynamic dark/light themes.
- **Dynamic Catalog**: Category tabs, real-time search, price & rating sorting, in-stock filtering.
- **Quick-View Modal**: Image gallery, tech specs table, quantity stepper, and quick action buttons.
- **Cart Drawer & Wishlist**: Real-time bag totals, free shipping progress bar, and localStorage persistence.
- **Simulated Checkout**: Multi-step checkout flow with order verification and confirmation receipt.
- **Full-Stack Ready**: API service layer wired for seamless Express backend connection.
