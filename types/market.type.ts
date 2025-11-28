export interface CoinData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  circulating_supply: number
  last_updated: string
}

export interface FundingData {
  symbol: string
  markPrice: string
  indexPrice: string
  estimatedSettlePrice: string
  lastFundingRate: string
  interestRate: string
  nextFundingTime: number
  time: number
}

export interface FearGreedData {
  name: string
  data: {
    value: string
    value_classification: string
    timestamp: string
    time_until_update: string
  }[]
  metadata: {
    error: string | null
  }
}