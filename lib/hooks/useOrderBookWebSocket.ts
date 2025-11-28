"use client"

import { useEffect, useRef } from "react"
import { useTradingStore, OrdersBookEntry } from "@/store/trading-store"

const BINANCE_WS_URL = "wss://stream.binance.com:9443/ws"

interface BinanceDepthData {
    lastUpdateId: number
    bids: [string, string][]
    asks: [string, string][]
}

export const useOrderBookWebSocket = (binanceSymbol: string) => {
    const wsRef = useRef<WebSocket | null>(null)
    const previousSymbolRef = useRef<string>(binanceSymbol)
    const setOrdersBook = useTradingStore((state) => state.setOrdersBook)

    useEffect(() => {
        const ws = new WebSocket(BINANCE_WS_URL)
        wsRef.current = ws

        const subscribeMessage = {
            method: "SUBSCRIBE",
            params: [`${binanceSymbol.toLowerCase()}@depth20`],
            id: 1,
        }

        ws.onopen = () => {
            ws.send(JSON.stringify(subscribeMessage))
            previousSymbolRef.current = binanceSymbol
        }

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)

                // Check if it's depth data (not subscription confirmation)
                if (data.bids && data.asks) {
                    const depthData: BinanceDepthData = data

                    const ordersBook: OrdersBookEntry = {
                        bids: depthData.bids.slice(0, 10),
                        asks: depthData.asks.slice(0, 10),
                    }

                    setOrdersBook(ordersBook)
                }
            } catch (err) {
                console.error("Failed to parse WebSocket message:", err)
            }
        }

        ws.onerror = (error) => {
            console.error("WebSocket error:", error)
        }

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                // Unsubscribe before closing
                const unsubscribeMessage = {
                    method: "UNSUBSCRIBE",
                    params: [`${binanceSymbol.toLowerCase()}@depth20`],
                    id: 1,
                }
                ws.send(JSON.stringify(unsubscribeMessage))
                ws.close()
            } else if (ws.readyState === WebSocket.CONNECTING) {
                ws.close()
            }
        }
    }, [binanceSymbol, setOrdersBook])
}
