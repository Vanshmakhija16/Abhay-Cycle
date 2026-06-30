# 🚴 Abhay Cycle Shop — Complete MERN Project

## 🚀 Quick Start Guide

### Step 1 — Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Step 2 — Setup Environment
The `.env` file is already created in `/server/.env`.
Update your MongoDB URI if needed (default: local MongoDB).

For Razorpay, replace:
- `RAZORPAY_KEY_ID` with your actual Razorpay Key ID
- `RAZORPAY_KEY_SECRET` with your actual Razorpay Key Secret

### Step 3 — Seed the Database

```bash
cd server
node seed.js
```

This creates:
- **Admin user:** admin@abhaycycle.com / admin123
- **9 sample products** (MTB, Road, Kids categories)

### Step 4 — Run the Project

Open **two terminals:**

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```
> Runs on http://localhost:5000

**Terminal 2 — Frontend:**
```bash
cd client
npm start
```
> Runs on http://localhost:3000

---

## 📁 Project Structure

```
abhay-cycle-shop/
├── client/                        # React Frontend
│   ├── public/
│   └── src/
│       ├── App.js                 # Main app with routes
│       ├── index.js               # Entry point
│       ├── index.css              # Global styles + Tailwind
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Navbar.js      # Responsive navbar with theme toggle
│       │   │   └── Footer.js      # Footer with links
│       │   └── ui/
│       │       ├── ScrollCycle.js # GSAP scroll-driven cycle animation
│       │       ├── ProtectedRoute.js
│       │       └── AdminRoute.js
│       ├── context/
│       │   ├── ThemeContext.js    # Light/Dark theme
│       │   ├── AuthContext.js     # JWT Auth
│       │   └── CartContext.js     # Shopping cart
│       ├── three/
│       │   └── HeroScene.js       # Three.js 3D hero scene
│       └── pages/
│           ├── Home.js            # Landing page
│           ├── Shop.js            # Product listing
│           ├── ProductDetail.js   # Product + Reviews
│           ├── Cart.js            # Shopping cart
│           ├── Checkout.js        # Checkout + Payment
│           ├── Login.js
│           ├── Register.js
│           ├── Profile.js         # User profile + Orders
│           ├── OrderSuccess.js
│           └── admin/
│               ├── AdminDashboard.js  # Stats + Charts
│               ├── AdminProducts.js   # CRUD products
│               ├── AdminOrders.js     # Manage orders
│               └── AdminCustomers.js  # View customers
│
└── server/                        # Node.js + Express Backend
    ├── server.js                  # Express app entry
    ├── seed.js                    # Database seeder
    ├── .env                       # Environment variables
    ├── config/
    │   └── db.js
    ├── models/
    │   ├── User.js
    │   ├── Product.js
    │   ├── Order.js
    │   └── Review.js
    ├── controllers/
    │   ├── authController.js
    │   ├── productController.js
    │   ├── orderController.js
    │   ├── reviewController.js
    │   ├── paymentController.js
    │   └── adminController.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── productRoutes.js
    │   ├── orderRoutes.js
    │   ├── reviewRoutes.js
    │   ├── paymentRoutes.js
    │   ├── userRoutes.js
    │   └── adminRoutes.js
    ├── middleware/
    │   └── authMiddleware.js
    └── uploads/                   # Product image uploads
```

---

## ✅ Features Implemented

| Feature | Status |
|---|---|
| 🏠 Home page with 3D Three.js hero | ✅ |
| 🛒 Shop with filters, search, pagination | ✅ |
| 📦 Product detail with specs | ✅ |
| ⭐ Reviews & ratings | ✅ |
| 🛍️ Shopping cart | ✅ |
| 💳 Checkout (COD + UPI + Razorpay) | ✅ |
| 🔐 JWT Auth (Login/Register) | ✅ |
| 👤 User profile & order history | ✅ |
| 🔴 Light/Dark theme toggle | ✅ |
| 🚴 GSAP scroll cycle animation | ✅ |
| 🌀 Framer Motion page transitions | ✅ |
| 🎮 Three.js 3D hero scene | ✅ |
| 🛠️ Admin: Products CRUD | ✅ |
| 🛠️ Admin: Orders management | ✅ |
| 🛠️ Admin: Customer list | ✅ |
| 📊 Admin: Dashboard stats | ✅ |
| 🌱 Seed data (9 products, 3 users) | ✅ |

---

## 🎨 Theme Palette

| Mode | Primary | Background | Cards |
|---|---|---|---|
| ☀️ Light | `#DC2626` Bold Red | `#FAF9F9` Warm White | `#FFFFFF` |
| 🌙 Dark | `#FF6B00` Orange | `#0F0F1A` Deep Navy | `#1C1C2E` |
