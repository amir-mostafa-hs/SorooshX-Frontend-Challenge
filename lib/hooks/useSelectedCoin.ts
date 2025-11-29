"use client"

import { useMemo } from "react"
import { useTradingStore } from "@/store"
import type { UseSelectedCoinReturn } from "@/types"

/**
 * Hook to get the currently selected coin data
 * Provides coin info, binance symbol, and trading pair details
 */
const useSelectedCoin = (): UseSelectedCoinReturn => {
    const { selectedPair, coinsData, tradingPairs } = useTradingStore()

    const selectedTradingPair = useMemo(() => {
        return tradingPairs.find((pair) => pair.symbol === selectedPair)
    }, [tradingPairs, selectedPair])

    const selectedCoinId = useMemo(() => {
        return selectedTradingPair?.id || "bitcoin"
    }, [selectedTradingPair])

    const selectedCoin = useMemo(() => {
        return coinsData.find((coin) => coin.id === selectedCoinId)
    }, [coinsData, selectedCoinId])

    const selectedCoinBinanceSymbol = useMemo(() => {
        return selectedTradingPair?.binanceSymbol || "BTCUSDT"
    }, [selectedTradingPair])

    return {
        selectedCoinId,
        selectedCoin,
        selectedCoinBinanceSymbol,
        selectedTradingPair,
    }
}

export default useSelectedCoin

// Alias for backward compatibility
export { useSelectedCoin as useSelectCoin }
