"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

// Types
export type OrderSide = "long" | "short"
export type MarginMode = "cross" | "isolated"
export type OrderType = "limit" | "market"

export interface Position {
    id: string
    symbol: string
    side: OrderSide
    size: number
    entryPrice: number
    leverage: number
    margin: number
    createdAt: number
}

export interface OpenOrder {
    id: string
    symbol: string
    side: OrderSide
    type: OrderType
    price: number
    amount: number
    leverage: number
    createdAt: number
}

interface TradeState {
    // User balance
    balance: number

    // Positions
    positions: Position[]

    // Open Orders
    openOrders: OpenOrder[]

    // Order History
    orderHistory: (Position & { closedAt: number; pnl: number })[]

    // Current Mark Price (simulated, would come from WebSocket in production)
    markPrice: number

    // Actions
    setMarkPrice: (price: number) => void
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
}

export const useTradeStore = create<TradeState>()(
    persist(
        (set, get) => ({
            // Initial State
            balance: 100000, // $100,000 initial balance
            positions: [],
            openOrders: [],
            orderHistory: [],
            markPrice: 97000, // Default BTC price

            // Actions
            setMarkPrice: (price) => set({ markPrice: price }),

            openPosition: ({ symbol, side, price, amount, leverage }) => {
                const state = get()
                const margin = (price * amount) / leverage

                // Check if user has enough balance
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

            closePosition: (id, markPrice) => {
                const state = get()
                const position = state.positions.find((p) => p.id === id)

                if (!position) return

                // Calculate PNL
                const priceDiff = markPrice - position.entryPrice
                const pnl =
                    position.side === "long"
                        ? priceDiff * position.size
                        : -priceDiff * position.size

                // Return margin + PNL to balance
                const returnAmount = position.margin + pnl

                set({
                    balance: state.balance + returnAmount,
                    positions: state.positions.filter((p) => p.id !== id),
                    orderHistory: [
                        ...state.orderHistory,
                        {
                            ...position,
                            closedAt: Date.now(),
                            pnl,
                        },
                    ],
                })
            },

            cancelOrder: (id) => {
                set((state) => ({
                    openOrders: state.openOrders.filter((o) => o.id !== id),
                }))
            },

            setBalance: (balance) => set({ balance }),
        }),
        {
            name: "trade-store",
            partialize: (state) => ({
                balance: state.balance,
                positions: state.positions,
                openOrders: state.openOrders,
                orderHistory: state.orderHistory,
            }),
        }
    )
)
