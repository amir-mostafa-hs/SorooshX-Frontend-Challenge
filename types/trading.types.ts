// ==================== Trading Types ====================

// Order Types
export type OrderSide = "long" | "short"
export type MarginMode = "cross" | "isolated"
export type OrderType = "limit" | "market"

// Trading Pair
export interface TradingPair {
    id: string
    symbol: string
    name: string
    binanceSymbol: string
}

// Position
export interface Position {
    id: string
    symbol: string
    side: OrderSide
    size: number
    entryPrice: number
    leverage: number
    margin: number
    createdAt: number
}

// Open Order
export interface OpenOrder {
    id: string
    symbol: string
    side: OrderSide
    type: OrderType
    price: number
    amount: number
    leverage: number
    createdAt: number
}

// Closed Position (History)
export interface ClosedPosition extends Position {
    closedAt: number
    pnl: number
}

// Order Book Entry
export interface OrdersBookEntry {
    bids: [string, string][]
    asks: [string, string][]
}

// ==================== Component Props Types ====================

export interface OrderFormProps {
    symbol?: string
    currentPrice?: number
}

export interface PositionsPanelProps {
    markPrice?: number
}

export interface ProcessedOrderEntry {
    price: number
    amount: number
    total: number
}

// ==================== Hook Return Types ====================

export interface UseSelectedCoinReturn {
    selectedCoinId: string
    selectedCoin: import("./market.type").CoinData | undefined
    selectedCoinBinanceSymbol: string
    selectedTradingPair: TradingPair | undefined
}
