import { CoinData } from "@/types/market.type"
import { create } from "zustand"

const tradingPairs = [
  { symbol: "BTC/USDT", name: "Bitcoin", id: "bitcoin", binanceSymbol: "BTCUSDT" },
  { symbol: "ETH/USDT", name: "Ethereum", id: "ethereum", binanceSymbol: "ETHUSDT" },
  { symbol: "SOL/USDT", name: "Solana", id: "solana", binanceSymbol: "SOLUSDT" },
  { symbol: "XRP/USDT", name: "Ripple", id: "ripple", binanceSymbol: "XRPUSDT" },
  { symbol: "DOGE/USDT", name: "Dogecoin", id: "dogecoin", binanceSymbol: "DOGEUSDT" },
]

export interface OrdersBookEntry {
  bids: [string | number, string | number][]
  asks: [string | number, string | number][]
}

export interface Position {
  id: string
  symbol: string
  side: "long" | "short"
  leverage: number
  marginType: "cross" | "isolated"
  size: number
  margin: number
  entryPrice: number
  markPrice: number
  unrealizedPnl: number
  pnlPercentage: number
  tpsl?: string
}

interface TradingState {
  // Available trading pairs
  tradingPairs: typeof tradingPairs

  // Market data
  coinsData: CoinData[]
  selectedPair: string

  // Order book
  ordersBook: OrdersBookEntry

  // Order form
  orderType: "limit" | "market"
  marginType: "cross" | "isolated"
  leverage: number
  price: string
  amount: string
  percentageAmount: number

  // Positions & orders
  positions: Position[]
  openOrders: Position[]

  // Available funds
  availableFunds: number

  // Actions
  setSelectedPair: (pair: string) => void
  setOrderType: (type: "limit" | "market") => void
  setMarginType: (type: "cross" | "isolated") => void
  setLeverage: (leverage: number) => void
  setPrice: (price: string) => void
  setAmount: (amount: string) => void
  setPercentageAmount: (percentage: number) => void
  setCoinsData: (coinsData: CoinData[]) => void
  setOrdersBook: (ordersBook: OrdersBookEntry) => void
}

export const useTradingStore = create<TradingState>((set) => ({
  coinsData: [],
  tradingPairs: tradingPairs,
  selectedPair: "BTC/USDT",

  ordersBook: {
    bids: [
      [
        "90912.46000000",
        "5.63897000"
      ],
      [
        "90912.35000000",
        "0.00006000"
      ],
      [
        "90912.01000000",
        "0.00012000"
      ],
      [
        "90912.00000000",
        "0.10032000"
      ],
      [
        "90911.61000000",
        "0.00006000"
      ],
      [
        "90911.46000000",
        "0.00012000"
      ],
      [
        "90911.45000000",
        "0.03327000"
      ],
      [
        "90911.31000000",
        "0.00067000"
      ],
      [
        "90911.27000000",
        "0.00012000"
      ],
      [
        "90911.26000000",
        "0.18203000"
      ],
      [
        "90911.25000000",
        "0.00012000"
      ],
      [
        "90911.24000000",
        "0.60426000"
      ],
      [
        "90910.69000000",
        "0.00006000"
      ],
      [
        "90909.90000000",
        "0.00006000"
      ],
      [
        "90909.54000000",
        "0.00006000"
      ],
      [
        "90909.28000000",
        "0.00078000"
      ],
      [
        "90909.11000000",
        "0.00440000"
      ],
      [
        "90909.00000000",
        "0.00256000"
      ],
      [
        "90908.37000000",
        "0.00044000"
      ],
      [
        "90908.24000000",
        "0.00006000"
      ]
    ],
    asks: [
      [
        "90912.47000000",
        "0.20455000"
      ],
      [
        "90912.48000000",
        "0.00070000"
      ],
      [
        "90913.20000000",
        "0.00007000"
      ],
      [
        "90913.45000000",
        "0.00128000"
      ],
      [
        "90914.13000000",
        "0.00006000"
      ],
      [
        "90914.29000000",
        "0.00006000"
      ],
      [
        "90914.49000000",
        "0.00006000"
      ],
      [
        "90914.81000000",
        "0.00012000"
      ],
      [
        "90914.82000000",
        "0.03230000"
      ],
      [
        "90915.58000000",
        "0.00006000"
      ],
      [
        "90915.65000000",
        "0.00086000"
      ],
      [
        "90915.75000000",
        "0.00100000"
      ],
      [
        "90915.77000000",
        "0.00156000"
      ],
      [
        "90915.94000000",
        "0.00007000"
      ],
      [
        "90916.76000000",
        "0.00121000"
      ],
      [
        "90916.80000000",
        "0.00006000"
      ],
      [
        "90916.81000000",
        "0.05503000"
      ],
      [
        "90916.82000000",
        "0.17833000"
      ],
      [
        "90917.20000000",
        "0.00440000"
      ],
      [
        "90917.46000000",
        "0.00054000"
      ]
    ]
  },

  orderType: "limit",
  marginType: "cross",
  leverage: 10,
  price: "",
  amount: "",
  percentageAmount: 50,

  positions: [
    {
      id: "1",
      symbol: "BTC/USDT",
      side: "long",
      leverage: 10,
      marginType: "cross",
      size: 0.92,
      margin: 353.22,
      entryPrice: 96343.4,
      markPrice: 95432.52,
      unrealizedPnl: 89.45,
      pnlPercentage: 59,
      tpsl: "99000 / 89500",
    },
  ],

  openOrders: [],
  availableFunds: 0.0,

  setSelectedPair: (pair) => set({ selectedPair: pair }),
  setOrderType: (type) => set({ orderType: type }),
  setMarginType: (type) => set({ marginType: type }),
  setLeverage: (leverage) => set({ leverage }),
  setPrice: (price) => set({ price }),
  setAmount: (amount) => set({ amount }),
  setPercentageAmount: (percentage) => set({ percentageAmount: percentage }),
  setCoinsData: (coinsData) => set({ coinsData }),
  setOrdersBook: (ordersBook) => set({ ordersBook }),
}))
