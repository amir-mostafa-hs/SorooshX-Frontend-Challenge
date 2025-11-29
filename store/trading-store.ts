"use client"

import { create } from "zustand"
import { CoinData } from "@/types/market.type"

// Trading pair type
export interface TradingPair {
    id: string
    symbol: string
    name: string
    binanceSymbol: string
}

// Order book entry type
export interface OrdersBookEntry {
    bids: [string, string][]
    asks: [string, string][]
}

// Trading pairs data
export const tradingPairs: TradingPair[] = [
    { id: "bitcoin", symbol: "BTC/USDT", name: "Bitcoin", binanceSymbol: "BTCUSDT" },
    { id: "ethereum", symbol: "ETH/USDT", name: "Ethereum", binanceSymbol: "ETHUSDT" },
    { id: "solana", symbol: "SOL/USDT", name: "Solana", binanceSymbol: "SOLUSDT" },
    { id: "ripple", symbol: "XRP/USDT", name: "Ripple", binanceSymbol: "XRPUSDT" },
    { id: "dogecoin", symbol: "DOGE/USDT", name: "Dogecoin", binanceSymbol: "DOGEUSDT" },
]

interface TradingState {
    // Selected trading pair
    selectedPair: string
    setSelectedPair: (pair: string) => void

    // Coins market data
    coinsData: CoinData[]
    setCoinsData: (data: CoinData[]) => void

    // Trading pairs
    tradingPairs: TradingPair[]

    // Order book
    ordersBook: OrdersBookEntry
    setOrdersBook: (data: OrdersBookEntry) => void
}

export const useTradingStore = create<TradingState>()((set) => ({
    // Selected pair
    selectedPair: "BTC/USDT",
    setSelectedPair: (pair) => set({ selectedPair: pair }),

    // Coins data
    coinsData: [],
    setCoinsData: (data) => set({ coinsData: data }),

    // Trading pairs
    tradingPairs,

    // Order book
    ordersBook: {
        bids: [],
        asks: [],
    },
    setOrdersBook: (data) => set({ ordersBook: data }),
}))
