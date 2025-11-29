"use client"

import { Card } from "@/components/ui/card"
import dynamic from "next/dynamic"

export function ChartPanel() {
  const TradingViewChart = dynamic(() => import("@/components/trading/TradingViewChart"), {
    ssr: false,
  });

  return (
    <Card className="flex flex-col h-full bg-card border-border px-5">
      <TradingViewChart />
    </Card>
  )
}
