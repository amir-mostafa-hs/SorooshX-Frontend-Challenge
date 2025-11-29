"use client"

import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useSelectCoin from "@/lib/hooks/useSelectCoin"
import { useOrderBookWebSocket } from "@/lib/hooks/useOrderBookWebSocket"
import { formatAmount, formatOrderPrice, formatPrice, formatTotal } from "@/lib/utils"
import { useTradingStore } from "@/store/trading-store"
import { useTranslations } from "next-intl"

interface ProcessedOrderEntry {
  price: number
  amount: number
  total: number
}

export function OrderBook() {
  const { ordersBook } = useTradingStore()
  const { asks, bids } = ordersBook
  const { selectedCoin, selectedCoinBinanceSymbol } = useSelectCoin()

  // Connect to WebSocket for order book data
  useOrderBookWebSocket(selectedCoinBinanceSymbol)

  const t = useTranslations("orderBook")

  // Process raw data from Binance [price, amount] format
  const processedAsks = useMemo<ProcessedOrderEntry[]>(() => {
    return asks.map((ask: [string, string]) => {
      const price = parseFloat(String(ask[0]))
      const amount = parseFloat(String(ask[1]))
      const total = price * amount
      return { price, amount, total }
    })
  }, [asks])

  const processedBids = useMemo<ProcessedOrderEntry[]>(() => {
    return bids.map((bid: [string, string]) => {
      const price = parseFloat(String(bid[0]))
      const amount = parseFloat(String(bid[1]))
      const total = price * amount
      return { price, amount, total }
    })
  }, [bids])

  // Calculate max total for depth visualization
  const maxTotal = useMemo(() => {
    const asksMax = processedAsks.length > 0 ? Math.max(...processedAsks.map((a) => a.total)) : 0
    const bidsMax = processedBids.length > 0 ? Math.max(...processedBids.map((b) => b.total)) : 0
    return Math.max(asksMax, bidsMax, 1)
  }, [processedAsks, processedBids])

  // Calculate buy/sell ratio for depth indicator
  const { buyPercent, sellPercent } = useMemo(() => {
    const totalBuyVolume = processedBids.reduce((sum, bid) => sum + bid.total, 0)
    const totalSellVolume = processedAsks.reduce((sum, ask) => sum + ask.total, 0)
    const totalVolume = totalBuyVolume + totalSellVolume

    if (totalVolume === 0) {
      return { buyPercent: 50, sellPercent: 50 }
    }

    const buyPct = Math.round((totalBuyVolume / totalVolume) * 100)
    const sellPct = 100 - buyPct

    return { buyPercent: buyPct, sellPercent: sellPct }
  }, [processedBids, processedAsks])

  return (
    <Card className="flex flex-col h-full bg-card border-border">
      <Tabs defaultValue="orderbook" className="flex flex-col h-full">
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0 h-auto">
          <TabsTrigger
            value="orderbook"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 text-sm"
          >
            {t("title")}
          </TabsTrigger>
          <TabsTrigger
            value="trades"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 text-sm"
          >
            {t("tradeHistory")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orderbook" className="flex-1 flex flex-col mt-0 p-2">
          {/* Display mode buttons */}
          <div className="flex items-center gap-2 mb-2">
            <button className="flex gap-0.5">
              <div className="w-3 h-3 bg-trading-red rounded-sm" />
              <div className="w-3 h-3 bg-trading-red rounded-sm opacity-60" />
            </button>
            <button className="flex gap-0.5 opacity-40">
              <div className="w-3 h-3 bg-trading-red rounded-sm" />
              <div className="w-3 h-3 bg-primary rounded-sm" />
            </button>
            <button className="flex gap-0.5 opacity-40">
              <div className="w-3 h-3 bg-primary rounded-sm" />
              <div className="w-3 h-3 bg-primary rounded-sm opacity-60" />
            </button>
            <span className="ms-auto text-xs text-muted-foreground">0.01 ▾</span>
          </div>

          {/* Column Headers */}
          <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground px-1 py-1">
            <span>{t("price")}</span>
            <span className="text-end">{t("amountBtc")} ({selectedCoin?.symbol.toLocaleUpperCase()})</span>
            <span className="text-end">{t("totalBtc")}</span>
          </div>

          {/* Asks (Sells) */}
          <div className="flex-1 overflow-hidden">
            <div className="space-y-0.5">
              {processedAsks.map((ask, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 text-xs px-1 py-0.5 relative">
                  <div
                    className="absolute inset-y-0 end-0 bg-trading-red/20"
                    style={{ width: `${(ask.total / maxTotal) * 100}%` }}
                  />
                  <span className="text-trading-red relative z-10">{formatOrderPrice(ask.price)}</span>
                  <span className="text-end text-foreground relative z-10">{formatAmount(ask.amount)}</span>
                  <span className="text-end text-foreground relative z-10">{formatTotal(ask.total)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Current Price */}
          <div className="py-2 text-center border-y border-border my-1">
            <span className="text-xl font-bold text-foreground">${formatPrice(selectedCoin?.current_price)}</span>
          </div>

          {/* Bids (Buys) */}
          <div className="flex-1 overflow-hidden">
            <div className="space-y-0.5">
              {processedBids.map((bid, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 text-xs px-1 py-0.5 relative">
                  <div
                    className="absolute inset-y-0 end-0 bg-primary/20"
                    style={{ width: `${(bid.total / maxTotal) * 100}%` }}
                  />
                  <span className="text-primary relative z-10">{formatOrderPrice(bid.price)}</span>
                  <span className="text-end text-foreground relative z-10">{formatAmount(bid.amount)}</span>
                  <span className="text-end text-foreground relative z-10">{formatTotal(bid.total)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Depth indicator - Buy/Sell Ratio */}
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
            <span className="text-xs text-primary">{buyPercent}%</span>
            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden flex">
              <div
                className="h-full bg-primary"
                style={{ width: `${buyPercent}%` }}
              />
              <div
                className="h-full bg-trading-red"
                style={{ width: `${sellPercent}%` }}
              />
            </div>
            <span className="text-xs text-trading-red">{sellPercent}%</span>
          </div>
        </TabsContent>

        <TabsContent value="trades" className="flex-1 p-2">
          <div className="text-center text-muted-foreground text-sm py-8">{t("tradeHistoryPlaceholder")}</div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
