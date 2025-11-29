import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  FEAR_GREED_COLORS,
  FEAR_GREED_THRESHOLDS,
} from "./constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ==================== Number Formatting ====================

/**
 * Format large numbers with suffix (K, M, B)
 */
export const formatVolume = (volume?: number): string => {
  if (volume === undefined || volume === null) return ""
  if (volume >= 1e9) return (volume / 1e9).toFixed(2) + "B"
  if (volume >= 1e6) return (volume / 1e6).toFixed(2) + "M"
  if (volume >= 1e3) return (volume / 1e3).toFixed(2) + "K"
  return volume.toFixed(2)
}

/**
 * Format price based on value magnitude
 */
export const formatPrice = (price?: number): string => {
  if (price === undefined || price === null) return ""
  if (price >= 1) {
    return price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }
  return price.toFixed(6)
}

/**
 * Format price for order book display
 */
export const formatOrderPrice = (price: number): string => {
  if (price >= 1000) return price.toFixed(2)
  if (price >= 1) return price.toFixed(4)
  return price.toFixed(6)
}

/**
 * Format amount with appropriate decimals
 */
export const formatAmount = (amount: number): string => {
  if (amount >= 1000000) return (amount / 1000000).toFixed(4) + "M"
  if (amount >= 1000) return (amount / 1000).toFixed(4) + "K"
  return amount.toFixed(4)
}

/**
 * Format total (USD value) with dollar sign
 */
export const formatTotal = (total: number): string => {
  if (total >= 1000000) return "$" + (total / 1000000).toFixed(4) + "M"
  if (total >= 1000) return "$" + (total / 1000).toFixed(4) + "K"
  return "$" + total.toFixed(4)
}

/**
 * Format PNL with sign prefix
 */
export const formatPnl = (pnl: number): string => {
  const sign = pnl >= 0 ? "+" : ""
  return `${sign}${pnl.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/**
 * Format ROE percentage
 */
export const formatRoe = (roe: number): string => {
  const sign = roe >= 0 ? "+" : ""
  return `${sign}${roe.toFixed(2)}%`
}

/**
 * Format funding rate as percentage
 */
export const formatFundingRate = (rate: string): string => {
  const numRate = parseFloat(rate) * 100
  return numRate.toFixed(4) + "%"
}

// ==================== Time Formatting ====================

/**
 * Format countdown time from milliseconds
 */
export const formatCountdown = (diffMs: number): string => {
  if (diffMs <= 0) return "00:00:00"

  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

// ==================== Color Utilities ====================

/**
 * Get Fear & Greed color based on value
 */
export const getFearGreedColor = (value: number): string => {
  if (value <= FEAR_GREED_THRESHOLDS.EXTREME_FEAR) return FEAR_GREED_COLORS.EXTREME_FEAR
  if (value <= FEAR_GREED_THRESHOLDS.FEAR) return FEAR_GREED_COLORS.FEAR
  if (value <= FEAR_GREED_THRESHOLDS.NEUTRAL) return FEAR_GREED_COLORS.NEUTRAL
  if (value <= FEAR_GREED_THRESHOLDS.GREED) return FEAR_GREED_COLORS.GREED
  return FEAR_GREED_COLORS.EXTREME_GREED
}