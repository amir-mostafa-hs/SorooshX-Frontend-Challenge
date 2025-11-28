import { CoinData } from "@/types/market.type"
import { create } from "zustand"

const tradingPairs = [
  { symbol: "BTC/USDT", name: "Bitcoin", id: "bitcoin", binanceSymbol: "BTCUSDT" },
  { symbol: "ETH/USDT", name: "Ethereum", id: "ethereum", binanceSymbol: "ETHUSDT" },
  { symbol: "SOL/USDT", name: "Solana", id: "solana", binanceSymbol: "SOLUSDT" },
  { symbol: "XRP/USDT", name: "Ripple", id: "ripple", binanceSymbol: "XRPUSDT" },
  { symbol: "DOGE/USDT", name: "Dogecoin", id: "dogecoin", binanceSymbol: "DOGEUSDT" },
]

export interface OrderBookEntry {
  price: number
  amount: number
  total: number
}

export interface Position {
  id: string
  symbol: string
  side: "long" | "short"
  leverage: number
  marginType: "cross" | "isolated"
  size: number
  margin: number
  entryPrice: number
  markPrice: number
  unrealizedPnl: number
  pnlPercentage: number
  tpsl?: string
}

interface TradingState {
  // Available trading pairs
  tradingPairs: typeof tradingPairs
  // Market data
  coinsData: CoinData[]
  selectedPair: string

  // Order book
  asks: OrderBookEntry[]
  bids: OrderBookEntry[]

  // Order form
  orderType: "limit" | "market"
  marginType: "cross" | "isolated"
  leverage: number
  price: string
  amount: string
  percentageAmount: number

  // Positions & orders
  positions: Position[]
  openOrders: Position[]

  // Available funds
  availableFunds: number

  // Actions
  setSelectedPair: (pair: string) => void
  setOrderType: (type: "limit" | "market") => void
  setMarginType: (type: "cross" | "isolated") => void
  setLeverage: (leverage: number) => void
  setPrice: (price: string) => void
  setAmount: (amount: string) => void
  setPercentageAmount: (percentage: number) => void
  setCoinsData: (coinsData: CoinData[]) => void
}

export const useTradingStore = create<TradingState>((set) => ({
  coinsData: [],
  tradingPairs: tradingPairs,
  selectedPair: "BTC/USDT",

  asks: [
    { price: 95589.4, amount: 54.93, total: 329.39 },
    { price: 95576.3, amount: 52.46, total: 284.93 },
    { price: 95534.6, amount: 43.54, total: 243.54 },
    { price: 95520.8, amount: 39.34, total: 189.34 },
    { price: 95505.9, amount: 32.47, total: 147.37 },
    { price: 95435.8, amount: 39.73, total: 39.73 },
  ],

  bids: [
    { price: 95433.9, amount: 54.93, total: 329.39 },
    { price: 95423.4, amount: 52.46, total: 284.93 },
    { price: 95420.9, amount: 43.54, total: 243.54 },
    { price: 95415.4, amount: 39.34, total: 189.34 },
    { price: 95396.9, amount: 32.47, total: 147.37 },
    { price: 95388.5, amount: 39.73, total: 39.73 },
  ],

  orderType: "limit",
  marginType: "cross",
  leverage: 10,
  price: "",
  amount: "",
  percentageAmount: 50,

  positions: [
    {
      id: "1",
      symbol: "BTC/USDT",
      side: "long",
      leverage: 10,
      marginType: "cross",
      size: 0.92,
      margin: 353.22,
      entryPrice: 96343.4,
      markPrice: 95432.52,
      unrealizedPnl: 89.45,
      pnlPercentage: 59,
      tpsl: "99000 / 89500",
    },
  ],

  openOrders: [],
  availableFunds: 0.0,

  setSelectedPair: (pair) => set({ selectedPair: pair }),
  setOrderType: (type) => set({ orderType: type }),
  setMarginType: (type) => set({ marginType: type }),
  setLeverage: (leverage) => set({ leverage }),
  setPrice: (price) => set({ price }),
  setAmount: (amount) => set({ amount }),
  setPercentageAmount: (percentage) => set({ percentageAmount: percentage }),
  setCoinsData: (coinsData) => set({ coinsData }),
}))
