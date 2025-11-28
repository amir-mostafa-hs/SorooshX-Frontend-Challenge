"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { useTradingStore } from "@/store/trading-store"
import { ChevronDown, Plus } from "lucide-react"

export function OrderForm() {
  const {
    orderType,
    marginType,
    leverage,
    price,
    amount,
    percentageAmount,
    availableFunds,
    setOrderType,
    setMarginType,
    setLeverage,
    setPrice,
    setAmount,
    setPercentageAmount,
  } = useTradingStore()

  return (
    <Card className="flex flex-col h-full bg-card border-border p-3">
      {/* Margin Type & Leverage */}
      <div className="flex items-center gap-2 mb-3">
        <Button
          variant={marginType === "cross" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setMarginType("cross")}
          className="flex-1 h-8 text-xs"
        >
          Cross
        </Button>
        <Button variant="outline" size="sm" className="h-8 text-xs px-3 bg-transparent">
          {leverage}X
        </Button>
        <Button
          variant={marginType === "isolated" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setMarginType("isolated")}
          className="h-8 text-xs px-2"
        >
          S
        </Button>
      </div>

      {/* Order Type Tabs */}
      <Tabs defaultValue="limit" className="flex flex-col flex-1">
        <TabsList className="w-full justify-start rounded-none bg-transparent p-0 h-auto border-b border-border">
          <TabsTrigger
            value="limit"
            onClick={() => setOrderType("limit")}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 text-sm flex-1"
          >
            Limit
          </TabsTrigger>
          <TabsTrigger
            value="market"
            onClick={() => setOrderType("market")}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 text-sm flex-1"
          >
            Market <ChevronDown className="w-3 h-3 ml-1 inline" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="limit" className="flex-1 flex flex-col mt-3 space-y-3">
          {/* Price Input */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Price</label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="pr-12 bg-input border-border h-9"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 text-xs text-primary"
              >
                BBO
              </Button>
            </div>
          </div>

          {/* Margin selector */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Margin</label>
            <div className="relative">
              <Input type="text" placeholder="Margin" className="pr-16 bg-input border-border h-9" />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 text-xs text-muted-foreground"
              >
                USDT <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>

          {/* Amount display */}
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">~ 0.00 BTC</span>
            <span className="text-primary">{percentageAmount}%</span>
          </div>

          {/* Percentage Slider */}
          <Slider
            value={[percentageAmount]}
            onValueChange={(val) => setPercentageAmount(val[0])}
            max={100}
            step={25}
            className="w-full"
          />

          {/* Percentage Buttons */}
          <div className="flex gap-1">
            {[0, 25, 50, 75, 100].map((pct) => (
              <Button
                key={pct}
                variant={percentageAmount === pct ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setPercentageAmount(pct)}
                className="flex-1 h-6 text-xs"
              >
                {pct}%
              </Button>
            ))}
          </div>

          {/* Margin & Est. Liq Price */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Margin</span>
            <span>0.00 / 0.00</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Est. Liq Price</span>
            <span>-- / --</span>
          </div>

          {/* TP/SL Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox id="tpsl" />
            <label htmlFor="tpsl" className="text-xs text-muted-foreground">
              TP/SL
            </label>
          </div>

          {/* Available & Max */}
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Available</span>
            <span className="text-foreground flex items-center gap-1">
              0.00 USDT <Plus className="w-3 h-3 text-primary" />
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Max Open</span>
            <span className="text-foreground">1.4 BTC</span>
          </div>

          {/* Buy/Sell Buttons */}
          <div className="space-y-2 mt-auto pt-2">
            <Button className="w-full bg-trading-green hover:bg-trading-green/90 text-foreground h-10">Buy/long</Button>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Max Open</span>
              <span>1.4 BTC</span>
            </div>
            <Button className="w-full bg-trading-red hover:bg-trading-red/90 text-foreground h-10">Sell/short</Button>
          </div>

          {/* Available Funds */}
          <div className="pt-2 border-t border-border">
            <div className="text-sm text-center mb-2">
              <span className="text-muted-foreground">Available Funds</span>
              <span className="ml-2 text-foreground">{availableFunds.toFixed(2)} USDT</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 h-8 text-xs bg-transparent">
                Deposite
              </Button>
              <Button variant="outline" size="sm" className="flex-1 h-8 text-xs bg-transparent">
                Transfer
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="market" className="flex-1 flex flex-col mt-3 space-y-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Amount</label>
            <Input
              type="text"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-input border-border h-9"
            />
          </div>

          <Slider
            value={[percentageAmount]}
            onValueChange={(val) => setPercentageAmount(val[0])}
            max={100}
            step={25}
            className="w-full"
          />

          <div className="space-y-2 mt-auto pt-2">
            <Button className="w-full bg-trading-green hover:bg-trading-green/90 text-foreground h-10">Buy/long</Button>
            <Button className="w-full bg-trading-red hover:bg-trading-red/90 text-foreground h-10">Sell/short</Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
