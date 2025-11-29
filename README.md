# SorooshX Futures Trading Platform - Frontend Challenge

![Project Screenshot](public/screenshot.png)

## 🚀 Overview

A professional **Crypto Futures Trading Interface** built as part of the SorooshX frontend hiring challenge. This application replicates the functionality of a real-time crypto exchange, featuring a live order book with WebSocket integration, dynamic TradingView charting, market sentiment indicators, and a complete order management system.

Built with performance, responsiveness, clean architecture, and full internationalization (RTL/LTR) support in mind.

**🔗 Live Demo:** [Vercel Deployment Link]

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router + Turbopack) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **UI Components** | [ShadCN UI](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| **State Management** | [Zustand 5](https://github.com/pmndrs/zustand) with persist middleware |
| **Real-time Data** | WebSocket (Binance Stream API) |
| **Internationalization** | [next-intl](https://next-intl-docs.vercel.app/) (English & Persian/RTL) |
| **Charting** | TradingView Widget |
| **Runtime** | [React 19](https://react.dev/) |

---

## ✨ Key Features

This project implements the 5 key zones required by the challenge:

### 1. 📝 Order Entry Form (Zone 1)
- **Order Types:** Support for Limit and Market orders
- **Leverage Selection:** Adjustable leverage from 1x to 125x via popover selector
- **Margin Modes:** Cross and Isolated margin support
- **Amount Slider:** Quick percentage-based amount selection (25%, 50%, 75%, 100%)
- **Real-time Cost Calculation:** Automatically calculates required margin based on price, amount, and leverage
- **Balance Validation:** Prevents orders exceeding available balance

### 2. 🟢 Real-time Order Book (Zone 2)
- Connects directly to **Binance WebSocket** (`wss://stream.binance.com:9443/ws/{symbol}@depth20`)
- Displays real-time Bids (green) and Asks (red) with dynamic depth visualization
- **Buy/Sell Ratio Indicator:** Visual bar showing market sentiment
- Automatic reconnection on WebSocket disconnection
- Optimized with throttled state updates to prevent UI lag

### 3. 📊 Market Info & Ticker Switcher (Zone 3)
- **Coin Selector:** Switch between BTC, ETH, SOL, XRP, DOGE trading pairs
- **Real-time Market Data:** 24h price change, high/low, volume (via CoinGecko API)
- **Funding Rate:** Live funding rates from Binance Futures API with countdown timer
- **Fear & Greed Index:** Market sentiment gauge with animated needle indicator

### 4. 📈 Interactive Chart (Zone 4)
- Integrated **TradingView Widget** for professional-grade charting
- Custom candle colors matching platform theme
- Multiple timeframe support (1m, 15m, 1H, 4H, 1D)
- Dynamic symbol switching based on selected trading pair

### 5. 💼 Position Management (Zone 5)
- **Positions Tab:** View open Long/Short positions with live PNL calculation
- **Open Orders Tab:** Track pending limit orders
- **Order History Tab:** Complete history of closed positions with realized PNL
- **Balances Tab:** View available margin balance
- **Real-time PNL:** Calculates unrealized PNL based on (Mark Price - Entry Price) × Size
- **ROE Calculation:** Return on Equity percentage display
- **Close Position:** One-click position closing with PNL settlement

### 🌍 Internationalization (i18n)
- Fully bilingual: **English** and **Persian (Farsi)**
- **RTL Support:** Automatic layout direction switching (Right-to-Left) for Persian
- **RTL Font:** Noto Naskh Arabic font for Persian text
- Language switcher in header

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm/yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/amir-mostafa-hs/SorooshX-Frontend-Challenge.git
   cd SorooshX-Frontend-Challenge
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Run the development server:**
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Create production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Fix ESLint errors |
| `pnpm format` | Format code with Prettier |

---

## 🧩 Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with providers & fonts
│   ├── page.tsx            # Main trading page
│   └── globals.css         # Global styles & Tailwind config
│
├── components/
│   ├── trading/            # Trading-specific components
│   │   ├── chart-panel.tsx       # Chart container
│   │   ├── TradingViewChart.tsx  # TradingView widget integration
│   │   ├── header.tsx            # Trading header
│   │   ├── market-info.tsx       # Market data & coin selector
│   │   ├── order-book.tsx        # Real-time order book
│   │   ├── order-form.tsx        # Order entry form
│   │   └── positions-panel.tsx   # Positions & orders management
│   │
│   ├── ui/                 # ShadCN UI components
│   ├── language-switcher.tsx
│   ├── locale-provider.tsx
│   └── theme-provider.tsx
│
├── lib/
│   ├── constants.ts        # API URLs, trading pairs, intervals
│   ├── utils.ts            # Utility & formatting functions
│   └── hooks/
│       ├── useOrderBookWebSocket.ts  # WebSocket connection hook
│       └── useSelectedCoin.ts        # Selected coin state hook
│
├── store/
│   └── index.ts            # Unified Zustand store
│
├── types/
│   ├── index.ts            # Type exports
│   ├── market.type.ts      # Market data types
│   └── trading.types.ts    # Trading-related types
│
├── messages/               # i18n translation files
│   ├── en.json             # English translations
│   └── fa.json             # Persian translations
│
├── i18n/                   # Internationalization config
│   ├── config.ts
│   └── request.ts
│
└── public/                 # Static assets
```

---

## 🔌 API Integrations

| API | Purpose | Endpoint |
|-----|---------|----------|
| **CoinGecko** | Market data (price, volume, 24h change) | `api.coingecko.com/api/v3/coins/markets` |
| **Binance WebSocket** | Real-time order book | `wss://stream.binance.com:9443/ws/{symbol}@depth20` |
| **Binance Futures** | Funding rate & mark price | `fapi.binance.com/fapi/v1/premiumIndex` |
| **Alternative.me** | Fear & Greed Index | `api.alternative.me/fng/` |

---

## 💡 Implementation Highlights

### WebSocket Optimization
High-frequency updates from Binance WebSocket are handled with a throttled state management approach in Zustand to prevent excessive re-renders and maintain smooth UI performance.

### Centralized State Management
A unified Zustand store with persist middleware manages all trading state including:
- Selected trading pair
- Market data (coins, order book)
- User positions and orders
- Balance and margin calculations

### Type Safety
All types are centralized in the `/types` directory with strict TypeScript configuration for improved developer experience and runtime safety.

### Responsive Design
Fully responsive layout using Tailwind CSS with mobile-first approach and RTL support for Persian language.

---

## 👤 Author

**Amir Mostafa Haji Sadeghian**
- Email: amir.mostafa.hs@gmail.com
- GitHub: [@amir-mostafa-hs](https://github.com/amir-mostafa-hs)

---

*Built for the SorooshX Frontend Hiring Challenge - November 2025*
