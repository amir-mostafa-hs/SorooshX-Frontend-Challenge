import { useTradingStore } from "@/store/trading-store"
import { useMemo } from "react"

const useSelectCoin = () => {
  const { selectedPair, coinsData, tradingPairs } = useTradingStore()

  const selectedCoinId = useMemo(() => {
    return tradingPairs.find((pair) => pair.symbol === selectedPair)?.id || "bitcoin"
  }, [selectedPair])

  const selectedCoin = useMemo(() => {
    return coinsData.find((coin) => coin.id === selectedCoinId)
  }, [coinsData, selectedCoinId])

  const selectedCoinBinanceSymbol = useMemo(() => {
    return tradingPairs.find((pair) => pair.symbol === selectedPair)?.binanceSymbol || "BTCUSDT"
  }, [selectedPair])

  return { selectedCoinId, selectedCoin, selectedCoinBinanceSymbol }
}
export default useSelectCoin