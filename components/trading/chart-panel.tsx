"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

const timeIntervals = ["Time", "1m", "3m", "5m", "1H", "4H", "1D", "1W"]

export function ChartPanel() {
  return (
    <Card className="flex flex-col h-full bg-card border-border">
      {/* Chart Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-border">
        {timeIntervals.map((interval, index) => (
          <Button
            key={interval}
            variant={interval === "1D" ? "secondary" : "ghost"}
            size="sm"
            className={`text-xs px-3 h-7 ${
              interval === "1D" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {interval}
          </Button>
        ))}
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7">
          <ChevronDown className="w-3 h-3" />
        </Button>
      </div>

      {/* Chart Area - Placeholder for TradingView */}
      <div className="flex-1 relative min-h-[400px] bg-card">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Simulated candlestick chart */}
          <div className="w-full h-full p-4">
            <svg viewBox="0 0 800 400" className="w-full h-full">
              {/* Grid lines */}
              {[...Array(8)].map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1="0"
                  y1={i * 50}
                  x2="800"
                  y2={i * 50}
                  stroke="oklch(0.25 0.005 260)"
                  strokeWidth="0.5"
                />
              ))}
              {[...Array(16)].map((_, i) => (
                <line
                  key={`v-${i}`}
                  x1={i * 50}
                  y1="0"
                  x2={i * 50}
                  y2="400"
                  stroke="oklch(0.25 0.005 260)"
                  strokeWidth="0.5"
                />
              ))}

              {/* Candlesticks */}
              {[
                { x: 50, open: 280, close: 250, high: 230, low: 290, bullish: true },
                { x: 80, open: 250, close: 220, high: 210, low: 260, bullish: true },
                { x: 110, open: 220, close: 240, high: 210, low: 250, bullish: false },
                { x: 140, open: 240, close: 200, high: 190, low: 250, bullish: true },
                { x: 170, open: 200, close: 180, high: 170, low: 210, bullish: true },
                { x: 200, open: 180, close: 220, high: 170, low: 230, bullish: false },
                { x: 230, open: 220, close: 200, high: 190, low: 230, bullish: true },
                { x: 260, open: 200, close: 160, high: 150, low: 210, bullish: true },
                { x: 290, open: 160, close: 180, high: 150, low: 190, bullish: false },
                { x: 320, open: 180, close: 150, high: 140, low: 190, bullish: true },
                { x: 350, open: 150, close: 190, high: 140, low: 200, bullish: false },
                { x: 380, open: 190, close: 220, high: 180, low: 230, bullish: false },
                { x: 410, open: 220, close: 180, high: 170, low: 230, bullish: true },
                { x: 440, open: 180, close: 210, high: 170, low: 220, bullish: false },
                { x: 470, open: 210, close: 190, high: 180, low: 220, bullish: true },
                { x: 500, open: 190, close: 230, high: 180, low: 240, bullish: false },
                { x: 530, open: 230, close: 200, high: 190, low: 240, bullish: true },
                { x: 560, open: 200, close: 180, high: 170, low: 210, bullish: true },
                { x: 590, open: 180, close: 220, high: 170, low: 230, bullish: false },
                { x: 620, open: 220, close: 250, high: 210, low: 260, bullish: false },
                { x: 650, open: 250, close: 230, high: 220, low: 260, bullish: true },
                { x: 680, open: 230, close: 200, high: 190, low: 240, bullish: true },
                { x: 710, open: 200, close: 220, high: 190, low: 230, bullish: false },
                { x: 740, open: 220, close: 240, high: 210, low: 250, bullish: false },
              ].map((candle, i) => (
                <g key={i}>
                  {/* Wick */}
                  <line
                    x1={candle.x}
                    y1={candle.high}
                    x2={candle.x}
                    y2={candle.low}
                    stroke={candle.bullish ? "oklch(0.65 0.2 145)" : "oklch(0.65 0.2 25)"}
                    strokeWidth="1"
                  />
                  {/* Body */}
                  <rect
                    x={candle.x - 8}
                    y={Math.min(candle.open, candle.close)}
                    width="16"
                    height={Math.abs(candle.close - candle.open) || 2}
                    fill={candle.bullish ? "oklch(0.65 0.2 145)" : "oklch(0.65 0.2 25)"}
                  />
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </Card>
  )
}
