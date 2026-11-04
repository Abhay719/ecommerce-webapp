# AURA Backend REST API

Node.js + Express + TypeScript backend service for the AURA E-Commerce platform.

## 🚀 Quick Start

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run in Development Mode (Live reload):**
   ```bash
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

4. **Start Production Build:**
   ```bash
   npm start
   ```

---

## ⚙️ Environment Variables

Configure via `.env` file (copied from `.env.example`):

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | HTTP server listening port | `5000` |
| `NODE_ENV` | Environment (`development` or `production`) | `development` |
| `CLIENT_URL` | Allowed frontend origin(s) for CORS | `http://localhost:5173,http://localhost:3000` |

---

## 📡 API Endpoints

### 🩺 Health & Meta
- `GET /` — Root API info and service directory
- `GET /api/health` — System health, status, and uptime

### 📦 Products
- `GET /api/products` — Retrieve all products
  - **Query Parameters**:
    - `category`: Filter by category (e.g. `audio`, `watches`, `electronics`, `apparel`, `lifestyle`)
    - `search`: Filter by keyword in title, brand, description, or tags
    - `sortBy`: `featured` | `price-asc` | `price-desc` | `rating-desc`
    - `inStockOnly`: `true` to filter in-stock only
    - `featured`: `true` to filter featured items
- `GET /api/products/:id` — Retrieve a single product by ID
- `POST /api/products` — Create a new product (admin/catalog)
- `PUT /api/products/:id` — Update existing product details
- `DELETE /api/products/:id` — Remove a product

### 🏷️ Categories
- `GET /api/categories` — List all categories with live item counts
- `GET /api/categories/:slug` — Retrieve category by slug

### 🛒 Orders
- `POST /api/orders` — Create a new order (validates items, auto-deducts inventory, generates reference ID)
- `GET /api/orders` — List orders
- `GET /api/orders/:id` — Get order status by reference ID
