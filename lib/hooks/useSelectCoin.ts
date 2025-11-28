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
    return { selectedCoinId, selectedCoin }
}
export default useSelectCoin