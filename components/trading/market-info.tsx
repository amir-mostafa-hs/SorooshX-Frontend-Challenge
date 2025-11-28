"use client"

import { useTradingStore } from "@/store/trading-store"
import { useTranslations } from "next-intl"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ChevronDown, Loader2 } from "lucide-react"
import { useEffect, useState, useMemo } from "react"
import Image from "next/image"
import { CoinData, FearGreedData, FundingData } from "@/types/market.type"
import useSelectCoin from "@/lib/hooks/useSelectCoin"
import { formatPrice, formatVolume } from "@/lib/utils"

const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,ripple,dogecoin"

const MarketInfo = () => {
  const { selectedPair, setSelectedPair, setCoinsData, coinsData, tradingPairs } = useTradingStore()
  const tMarket = useTranslations("market")

  const [fundingData, setFundingData] = useState<FundingData | null>(null)
  const [fearGreedData, setFearGreedData] = useState<FearGreedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get the binance symbol for the selected pair
  const selectedBinanceSymbol = useMemo(() => {
    return tradingPairs.find((pair) => pair.symbol === selectedPair)?.binanceSymbol || "BTCUSDT"
  }, [selectedPair])

  // Fetch market data from CoinGecko
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(API_URL)
        if (!response.ok) {
          throw new Error("Failed to fetch market data")
        }
        const data: CoinData[] = await response.json()
        setCoinsData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Refresh data every 60 seconds
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  // Fetch funding rate from Binance
  useEffect(() => {
    const fetchFundingData = async () => {
      try {
        const response = await fetch(
          `https://fapi.binance.com/fapi/v1/premiumIndex?symbol=${selectedBinanceSymbol}`
        )
        if (!response.ok) {
          throw new Error("Failed to fetch funding data")
        }
        const data: FundingData = await response.json()
        setFundingData(data)
      } catch (err) {
        console.error("Failed to fetch funding data:", err)
        setFundingData(null)
      }
    }

    fetchFundingData()

    // Refresh funding data every 30 seconds
    const interval = setInterval(fetchFundingData, 30000)
    return () => clearInterval(interval)
  }, [selectedBinanceSymbol])

  // Calculate countdown to next funding time
  const [countdown, setCountdown] = useState<string>("--:--:--")

  useEffect(() => {
    if (!fundingData?.nextFundingTime) return

    const updateCountdown = () => {
      const now = Date.now()
      const diff = fundingData.nextFundingTime - now

      if (diff <= 0) {
        setCountdown("00:00:00")
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setCountdown(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      )
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [fundingData?.nextFundingTime])

  // Format funding rate as percentage
  const formatFundingRate = (rate: string): string => {
    const numRate = parseFloat(rate) * 100
    return numRate.toFixed(4) + "%"
  }

  // Fetch Fear and Greed Index
  useEffect(() => {
    const fetchFearGreedData = async () => {
      try {
        const response = await fetch("https://api.alternative.me/fng/")
        if (!response.ok) {
          throw new Error("Failed to fetch Fear and Greed data")
        }
        const data: FearGreedData = await response.json()
        setFearGreedData(data)
      } catch (err) {
        console.error("Failed to fetch Fear and Greed data:", err)
        setFearGreedData(null)
      }
    }

    fetchFearGreedData()

    // Refresh Fear and Greed data every 5 minutes
    const interval = setInterval(fetchFearGreedData, 300000)
    return () => clearInterval(interval)
  }, [])

  // Get Fear and Greed color based on value
  const getFearGreedColor = (value: number): string => {
    if (value <= 25) return "#ea3943" // Extreme Fear - Red
    if (value <= 45) return "#ea8c00" // Fear - Orange
    if (value <= 55) return "#f5f500" // Neutral - Yellow
    if (value <= 75) return "#93d900" // Greed - Light Green
    return "#16c784" // Extreme Greed - Green
  }

  // Fear and Greed Gauge Component
  const FearGreedGauge = ({ value, classification }: { value: number; classification: string }) => {
    const rotation = (value / 100) * 180 - 90 // Convert 0-100 to -90 to 90 degrees
    const color = getFearGreedColor(value)

    return (
      <div className="flex items-center gap-2">
        <div className="relative w-12 h-7 overflow-hidden">
          {/* Gauge background arc */}
          <svg viewBox="0 0 100 60" className="w-full h-full">
            {/* Background arc segments */}
            <path
              d="M 10 55 A 40 40 0 0 1 90 55"
              fill="none"
              stroke="#3a3a3a"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Colored arc based on value */}
            <path
              d="M 10 55 A 40 40 0 0 1 90 55"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ea3943" />
                <stop offset="25%" stopColor="#ea8c00" />
                <stop offset="50%" stopColor="#f5f500" />
                <stop offset="75%" stopColor="#93d900" />
                <stop offset="100%" stopColor="#16c784" />
              </linearGradient>
            </defs>
            {/* Needle */}
            <g transform={`rotate(${rotation}, 50, 55)`}>
              <line
                x1="50"
                y1="55"
                x2="50"
                y2="22"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="50" cy="55" r="4" fill={color} />
            </g>
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground leading-tight">{tMarket("fearGreedIndex")}</span>
          <span className="text-xs font-medium leading-tight" style={{ color }}>
            {value} - {classification}
          </span>
        </div>
      </div>
    )
  }

  const selectedCoin = useSelectCoin().selectedCoin

  if (loading && coinsData.length === 0) {
    return (
      <div className="flex items-center justify-center gap-2 px-4 py-4">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        <span className="text-muted-foreground">{tMarket("loading") || "Loading..."}</span>
      </div>
    )
  }

  if (error && coinsData.length === 0) {
    return (
      <div className="flex items-center justify-center gap-2 px-4 py-4">
        <span className="text-trading-red">{error}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4 px-4 py-2 overflow-x-auto">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 px-3 py-2 h-auto">
            {selectedCoin?.image ? (
              <Image
                src={selectedCoin.image}
                alt={selectedCoin.name}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                <span className="text-[10px] font-bold text-foreground">
                  {selectedCoin?.symbol?.toUpperCase().charAt(0) || "?"}
                </span>
              </div>
            )}
            <span className="font-semibold text-foreground">{selectedPair}</span>
            <span className="text-xs px-1.5 py-0.5 bg-muted rounded text-muted-foreground">
              {tMarket("perp")}
            </span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-70 p-2 bg-popover border-border">
          <div className="space-y-1">
            {tradingPairs.map((pair) => {
              const coinData = coinsData.find((c) => c.id === pair.id)
              return (
                <button
                  key={pair.symbol}
                  onClick={() => setSelectedPair(pair.symbol)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded text-start hover:bg-accent transition-colors ${selectedPair === pair.symbol ? "bg-accent" : ""
                    }`}
                >
                  {coinData?.image ? (
                    <Image
                      src={coinData.image}
                      alt={coinData.name}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-muted" />
                  )}
                  <span className="font-medium text-foreground">{pair.symbol}</span>
                  <span className="text-xs text-muted-foreground">{pair.name}</span>
                  {coinData && (
                    <span
                      className={`text-xs ms-auto ${coinData.price_change_percentage_24h >= 0
                          ? "text-primary"
                          : "text-trading-red"
                        }`}
                    >
                      {coinData.price_change_percentage_24h >= 0 ? "+" : ""}
                      {coinData.price_change_percentage_24h.toFixed(2)}%
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>

      {selectedCoin && (
        <div className="flex items-center gap-6 text-sm grow">
          <div>
            <span
              className={`text-xl font-bold ${selectedCoin.price_change_percentage_24h >= 0
                  ? "text-primary"
                  : "text-trading-red"
                }`}
            >
              ${formatPrice(selectedCoin.current_price)}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{tMarket("change24h")}</span>
            <span
              className={`font-medium ${selectedCoin.price_change_percentage_24h >= 0
                  ? "text-primary"
                  : "text-trading-red"
                }`}
            >
              {selectedCoin.price_change_24h >= 0 ? "+" : ""}
              {formatPrice(selectedCoin.price_change_24h)} (
              {selectedCoin.price_change_percentage_24h >= 0 ? "+" : ""}
              {selectedCoin.price_change_percentage_24h.toFixed(2)}%)
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{tMarket("high24h")}</span>
            <span className="text-foreground font-medium">
              ${formatPrice(selectedCoin.high_24h)}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{tMarket("low24h")}</span>
            <span className="text-foreground font-medium">
              ${formatPrice(selectedCoin.low_24h)}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{tMarket("volume")}</span>
            <span className="text-foreground font-medium">
              ${formatVolume(selectedCoin.total_volume)}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{tMarket("marketCap")}</span>
            <span className="text-foreground font-medium">
              ${formatVolume(selectedCoin.market_cap)}
            </span>
          </div>

          <div className="flex flex-col ms-auto">
            <span className="text-xs text-muted-foreground">{tMarket("fundingSettlement")}</span>
            <span
              className={`font-medium ${fundingData && parseFloat(fundingData.lastFundingRate) >= 0
                  ? "text-primary"
                  : "text-trading-red"
                }`}
            >
              {fundingData
                ? `${formatFundingRate(fundingData.lastFundingRate)} / ${countdown}`
                : "--% / --:--:--"}
            </span>
          </div>
        </div>
      )}

      <div>
        {/* Fear and Greed Index Gauge */}
        {fearGreedData?.data?.[0] && (
          <div className="border-s border-border ps-4">
            <FearGreedGauge
              value={parseInt(fearGreedData.data[0].value)}
              classification={fearGreedData.data[0].value_classification}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default MarketInfo
