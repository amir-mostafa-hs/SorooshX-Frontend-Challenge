import { Header } from "@/components/trading/header"
import { ChartPanel } from "@/components/trading/chart-panel"
import { OrderBook } from "@/components/trading/order-book"
import { OrderForm } from "@/components/trading/order-form"
import { PositionsPanel } from "@/components/trading/positions-panel"

export default function TradingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with market info */}
      <Header />

      {/* Main Content - 3 Column Layout */}
      <div className="flex-1 p-2 grid grid-cols-1 lg:grid-cols-[1fr_280px_280px] gap-2 min-h-0">
        {/* Chart Panel - Center (largest) */}
        <div className="order-2 lg:order-1 min-h-[400px] lg:min-h-0">
          <ChartPanel />
        </div>

        {/* Order Book - Middle Right */}
        <div className="order-1 lg:order-2 h-auto">
          <OrderBook />
        </div>

        {/* Order Form - Far Right */}
        <div className="order-3 h-auto lg:h-auto">
          <OrderForm />
        </div>
      </div>

      {/* Positions Panel - Bottom */}
      <div className="p-2 pt-0">
        <PositionsPanel />
      </div>
    </div>
  )
}
