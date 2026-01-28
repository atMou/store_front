# Front Store - Modern E-Commerce Platform

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.0-purple?style=for-the-badge&logo=redux&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![SignalR](https://img.shields.io/badge/SignalR-Realtime-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

<video src="public/fakelando.mp4" width="100%" autoplay muted loop playsinline></video>

An e-commerce application inspired by the **Zalando** user experience. Built with a focus on scalability, maintainability, and real-time responsiveness. This platform features dedicated localized storefronts, a comprehensive administration dashboard, and a seamless checkout experience powered by modern web technologies.

## 🌟 Key Features

### 🛍️ Immersive Shopping Experience

- **Personalized Storefronts**: Distinct "Data-Driven" homes for Men, Women, and Kids using dynamic routing.
- **Advanced Filtering Engine**: Deep filtering capabilities (Brand, Color, Size, Price, Material) with URL synchronization.
- **Optimistic UI**: Instant feedback on cart operations and wishlist toggles, backed by background synchronization.
- **Smart Recommendations**: Client-side logic for "Trending" and "You Might Also Like" sections.

### ⚡ Real-Time Architecture

- **Live Inventory**: Real-time stock level updates via **SignalR** websockets (no page refresh required).
- **Order Tracking**: Instant push notifications for order status changes (Processing → Shipped → Delivered).
- **Interactive Notifications**: Toast alerts for system events, stock warnings, and payment confirmations.

### 🛡️ Dashboard & Administration

- **Role-Based Access Control (RBAC)**: Secure HOC-based route protection (`WithPermission`, `WithRole`).
- **Data Visualization**: Interactive revenue and sales charts powered by **ApexCharts**.
- **Product Management**: Complete CRUD operations with drag-and-drop image uploading.
- **Audit Logs**: Comprehensive tracking of user actions and system changes.

## 🏗️ Architecture

This project follows a strict **Feature-Based Architecture** combined with **Atomic Design Principles** to ensure modularity and ease of maintenance.

### 1. Feature-Based Organization

Business logic is encapsulated within `features/` to keep related code together:

```
features/
  ├── product/           # Feature Name
  │   ├── api.ts         # RTK Query Endpoints (injected)
  │   ├── slice.ts       # Redux State Slice
  │   ├── components/    # Feature-specific components
  │   ├── hooks/         # Custom hooks
  │   └── types.ts       # Feature types
  ├── auth/
  ├── cart/
  └── ...
```

### 2. Atomic Design System

UI components are organized by complexity in `components/`:

- **Atoms**: Basic building blocks (Buttons, Inputs, Badges).
- **Molecules**: Simple groups of UI elements (SearchBars, FormGroups).
- **Organisms**: Complex interaction zones (ProductCards, NavigationBars).
- **Templates/Layouts**: Page structure wrappers.

### 3. State Management Strategy

- **Server State (Caching)**: Handled by **RTK Query** with automatic cache invalidation strategies using tags (`Product`, `Order`).
- **Client State**: Managed by **Redux Toolkit** slices.
- **Persistence**: Critical state (Cart, User Preferences) persisted to `localStorage` via **redux-persist**.

## 🛠️ Tech Stack & Tools

**Frontend Core:**

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **State:** Redux Toolkit + RTK Query
- **Routing:** Next.js App Directory (Route Groups & Intercepting Routes)

**UI & styling:**

- **System:** Tailwind CSS
- **Components:** Radix UI (Headless primitives)
- **Animations:** Framer Motion (Page transitions & Micro-interactions)
- **Icons:** Lucide React

**Backend Integration:**

- **API:** RESTful .NET Core API
- **Real-time:** ASP.NET Core SignalR
- **Payments:** Stripe API

**DevOps & Quality:**

- **Linting:** ESLint + Prettier
- **CI/CD:** GitHub Actions
- **Logging:** Custom Production Logger (no `console.log` in prod)

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x+
- npm 10.x+

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/front_store.git
   cd front_store
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env.local` file:

   ```env
   # Backend API
   NEXT_PUBLIC_BASE_API_URL=http://localhost:5046
   NEXT_PUBLIC_SIGNALR_URL=http://localhost:5046/chatHub

   # Payments
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

   # Logging
   NEXT_PUBLIC_LOG_LEVEL=info
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

### Production Build

```bash
# Run type checks and linting
npm run check

# Build for production
npm run build

# Start production server
npm start
```

## 📂 Project Structure

```bash
front_store/
├── app/                  # Next.js App Router
│   ├── (auth)/           # Authentication routes (Login/Register)
│   ├── (shop)/           # Public e-commerce pages
│   └── (private)/        # Protected dashboard routes
├── components/           # Atomic Design Components
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── feedback/         # Skeletons, Loaders, Errors
├── features/             # Business Logic (Slice, API, Hooks)
├── hooks/                # Global Hooks (useAuth, useDebounce)
├── shared/               # Utilities, Logger, Providers
├── store/                # Redux Configuration
└── types/                # Global TypeScript Definitions
```

## 🤝 Contributing

We welcome contributions! Please follow our [Contribution Guidelines](CONTRIBUTING.md).

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/NewFeature`)
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
