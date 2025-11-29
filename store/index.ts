"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
    OrderSide,
    TradingPair,
    Position,
    OpenOrder,
    ClosedPosition,
    OrdersBookEntry,
    CoinData,
} from "@/types"

// Re-export types for backward compatibility
export type { OrderSide, MarginMode, OrderType, TradingPair, Position, OpenOrder, ClosedPosition, OrdersBookEntry } from "@/types"
export type { CoinData, FundingData, FearGreedData } from "@/types"

// ==================== Constants ====================

export const TRADING_PAIRS: TradingPair[] = [
    { id: "bitcoin", symbol: "BTC/USDT", name: "Bitcoin", binanceSymbol: "BTCUSDT" },
    { id: "ethereum", symbol: "ETH/USDT", name: "Ethereum", binanceSymbol: "ETHUSDT" },
    { id: "solana", symbol: "SOL/USDT", name: "Solana", binanceSymbol: "SOLUSDT" },
    { id: "ripple", symbol: "XRP/USDT", name: "Ripple", binanceSymbol: "XRPUSDT" },
    { id: "dogecoin", symbol: "DOGE/USDT", name: "Dogecoin", binanceSymbol: "DOGEUSDT" },
]

export const DEFAULT_BALANCE = 100000 // $100,000
export const DEFAULT_MARK_PRICE = 97000 // Default BTC price

// ==================== Store Interface ====================

interface TradingStoreState {
    // Market Data
    selectedPair: string
    coinsData: CoinData[]
    tradingPairs: TradingPair[]
    ordersBook: OrdersBookEntry
    markPrice: number

    // User Account
    balance: number
    positions: Position[]
    openOrders: OpenOrder[]
    orderHistory: ClosedPosition[]

    // Market Actions
    setSelectedPair: (pair: string) => void
    setCoinsData: (data: CoinData[]) => void
    setOrdersBook: (data: OrdersBookEntry) => void
    setMarkPrice: (price: number) => void

    // Trading Actions
    openPosition: (params: {
        symbol: string
        side: OrderSide
        price: number
        amount: number
        leverage: number
    }) => boolean
    closePosition: (id: string, markPrice: number) => void
    cancelOrder: (id: string) => void
    setBalance: (balance: number) => void

    // Selectors (computed helpers)
    getSelectedTradingPair: () => TradingPair | undefined
    getSelectedCoinData: () => CoinData | undefined
}

// ==================== Store ====================

export const useTradingStore = create<TradingStoreState>()(
    persist(
        (set, get) => ({
            // Initial Market State
            selectedPair: "BTC/USDT",
            coinsData: [],
            tradingPairs: TRADING_PAIRS,
            ordersBook: { bids: [], asks: [] },
            markPrice: DEFAULT_MARK_PRICE,

            // Initial User State
            balance: DEFAULT_BALANCE,
            positions: [],
            openOrders: [],
            orderHistory: [],

            // Market Actions
            setSelectedPair: (pair) => set({ selectedPair: pair }),
            setCoinsData: (data) => set({ coinsData: data }),
            setOrdersBook: (data) => set({ ordersBook: data }),
            setMarkPrice: (price) => set({ markPrice: price }),

            // Trading Actions
            openPosition: ({ symbol, side, price, amount, leverage }) => {
                const state = get()
                const margin = (price * amount) / leverage

                if (margin > state.balance) {
                    return false
                }

                const newPosition: Position = {
                    id: crypto.randomUUID(),
                    symbol,
                    side,
                    size: amount,
                    entryPrice: price,
                    leverage,
                    margin,
                    createdAt: Date.now(),
                }

                set({
                    balance: state.balance - margin,
                    positions: [...state.positions, newPosition],
                })

                return true
            },

            closePosition: (id, currentMarkPrice) => {
                const state = get()
                const position = state.positions.find((p) => p.id === id)

                if (!position) return

                const priceDiff = currentMarkPrice - position.entryPrice
                const pnl =
                    position.side === "long"
                        ? priceDiff * position.size
                        : -priceDiff * position.size

                const returnAmount = position.margin + pnl

                set({
                    balance: state.balance + returnAmount,
                    positions: state.positions.filter((p) => p.id !== id),
                    orderHistory: [
                        ...state.orderHistory,
                        { ...position, closedAt: Date.now(), pnl },
                    ],
                })
            },

            cancelOrder: (id) => {
                set((state) => ({
                    openOrders: state.openOrders.filter((o) => o.id !== id),
                }))
            },

            setBalance: (balance) => set({ balance }),

            // Selectors
            getSelectedTradingPair: () => {
                const state = get()
                return state.tradingPairs.find((pair) => pair.symbol === state.selectedPair)
            },

            getSelectedCoinData: () => {
                const state = get()
                const tradingPair = state.tradingPairs.find(
                    (pair) => pair.symbol === state.selectedPair
                )
                if (!tradingPair) return undefined
                return state.coinsData.find((coin) => coin.id === tradingPair.id)
            },
        }),
        {
            name: "trading-store",
            partialize: (state) => ({
                balance: state.balance,
                positions: state.positions,
                openOrders: state.openOrders,
                orderHistory: state.orderHistory,
                selectedPair: state.selectedPair,
            }),
        }
    )
)

// ==================== Aliases for backward compatibility ====================
// These can be removed after updating all imports
export const useTradeStore = useTradingStore
