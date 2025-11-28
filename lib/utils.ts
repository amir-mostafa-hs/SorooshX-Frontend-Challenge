import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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

export const formatPrice = (price?: number): string => {
  if (price === undefined) return "";
  if (price >= 1) {
    return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  return price.toFixed(6)
}