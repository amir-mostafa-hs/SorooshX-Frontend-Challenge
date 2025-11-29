// API URLs
export const API_URLS = {
    COINGECKO_MARKETS:
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,ripple,dogecoin",
    BINANCE_FUNDING: "https://fapi.binance.com/fapi/v1/premiumIndex?symbol=",
    FEAR_GREED: "https://api.alternative.me/fng/",
    BINANCE_WS: "wss://stream.binance.com:9443/ws",
} as const

// Refresh intervals (in milliseconds)
export const REFRESH_INTERVALS = {
    MARKET_DATA: 60000, // 1 minute
    FUNDING_DATA: 30000, // 30 seconds
    FEAR_GREED: 300000, // 5 minutes
    COUNTDOWN: 1000, // 1 second
} as const

// Trading constants
export const LEVERAGE_OPTIONS = [1, 2, 3, 5, 10, 20, 50, 75, 100, 125] as const
export const MAX_LEVERAGE = 125
export const MIN_LEVERAGE = 1

// Percentage shortcuts for slider
export const PERCENTAGE_SHORTCUTS = [0, 25, 50, 75, 100] as const

// Fear & Greed colors
export const FEAR_GREED_COLORS = {
    EXTREME_FEAR: "#ea3943",
    FEAR: "#ea8c00",
    NEUTRAL: "#f5f500",
    GREED: "#93d900",
    EXTREME_GREED: "#16c784",
} as const

// Fear & Greed thresholds
export const FEAR_GREED_THRESHOLDS = {
    EXTREME_FEAR: 25,
    FEAR: 45,
    NEUTRAL: 55,
    GREED: 75,
} as const
