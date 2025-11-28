import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format volume utility
export const formatVolume = (volume?: number): string => {
  if (volume === undefined) return "";
  if (volume >= 1e9) {
    return (volume / 1e9).toFixed(2) + "B"
  } else if (volume >= 1e6) {
    return (volume / 1e6).toFixed(2) + "M"
  } else if (volume >= 1e3) {
    return (volume / 1e3).toFixed(2) + "K"
  }
  return volume.toFixed(2)
}

// Format price utility
export const formatPrice = (price?: number): string => {
  if (price === undefined) return "";
  if (price >= 1) {
    return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  return price.toFixed(6)
}

// Format price based on coin value
export const formatOrderPrice = (price: number) => {
  if (price >= 1000) return price.toFixed(2)
  if (price >= 1) return price.toFixed(4)
  return price.toFixed(6)
}

// Format amount
export const formatAmount = (amount: number) => {
  if (amount >= 1000000) return (amount / 1000000).toFixed(4) + "M"
  if (amount >= 1000) return (amount / 1000).toFixed(4) + "K"
  return amount.toFixed(4)
}

// Format total (USD value)
export const formatTotal = (total: number) => {
  if (total >= 1000000) return "$" + (total / 1000000).toFixed(4) + "M"
  if (total >= 1000) return "$" + (total / 1000).toFixed(4) + "K"
  return "$" + total.toFixed(4)
}