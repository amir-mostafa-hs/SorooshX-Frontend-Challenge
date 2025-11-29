"use client"

import { useState, useMemo, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useTradeStore, type MarginMode, type OrderSide } from "@/store/trade-store"
import { ChevronDown, Settings2 } from "lucide-react"
import { useTranslations } from "next-intl"
import useSelectCoin from "@/lib/hooks/useSelectCoin"

interface OrderFormProps {
    symbol?: string
    currentPrice?: number
}

export function OrderForm({
    symbol = "BTC/USDT",
    currentPrice = 97000,
}: OrderFormProps) {
    const { balance, openPosition, setMarkPrice } = useTradeStore()
    const tOrderForm = useTranslations("trading.orderForm")

    const { selectedCoin } = useSelectCoin()

    // Form State
    const [orderType, setOrderType] = useState<"limit" | "market">("limit")
    const [marginMode, setMarginMode] = useState<MarginMode>("cross")
    const [leverage, setLeverage] = useState(10)
    const [price, setPrice] = useState(currentPrice.toString())
    const [amount, setAmount] = useState("")
    const [sliderValue, setSliderValue] = useState([0])

    // Update mark price when currentPrice changes
    useEffect(() => {
        setMarkPrice(selectedCoin?.current_price || 0)
        setPrice(selectedCoin?.current_price?.toString() || "0")
    }, [selectedCoin?.current_price, setMarkPrice])

    // Calculate available amount based on balance and leverage
    const maxAmount = useMemo(() => {
        const priceNum = parseFloat(price) || currentPrice
        return (balance * leverage) / priceNum
    }, [balance, leverage, price, currentPrice])

    // Calculate cost
    const cost = useMemo(() => {
        const priceNum = parseFloat(price) || 0
        const amountNum = parseFloat(amount) || 0
        return (priceNum * amountNum) / leverage
    }, [price, amount, leverage])

    // Handle slider change
    const handleSliderChange = (value: number[]) => {
        setSliderValue(value)
        const percentage = value[0] / 100
        const newAmount = maxAmount * percentage
        setAmount(newAmount > 0 ? newAmount.toFixed(6) : "")
    }

    // Handle amount change
    const handleAmountChange = (value: string) => {
        setAmount(value)
        const amountNum = parseFloat(value) || 0
        const percentage = Math.min((amountNum / maxAmount) * 100, 100)
        setSliderValue([percentage])
    }

    // Handle order submission
    const handleSubmit = (side: OrderSide) => {
        const priceNum = parseFloat(price)
        const amountNum = parseFloat(amount)

        if (!priceNum || !amountNum) return

        const success = openPosition({
            symbol,
            side,
            price: priceNum,
            amount: amountNum,
            leverage,
        })

        if (success) {
            setAmount("")
            setSliderValue([0])
        }
    }

    const leverageOptions = [1, 2, 3, 5, 10, 20, 50, 75, 100, 125]

    return (
        <Card className="h-full flex flex-col p-3 gap-3 bg-card">
            {/* Order Type Tabs */}
            <Tabs value={orderType} onValueChange={(v) => setOrderType(v as "limit" | "market")}>
                <TabsList className="w-full grid grid-cols-2 h-8">
                    <TabsTrigger value="limit" className="text-xs h-full">
                        {tOrderForm("limit")}
                    </TabsTrigger>
                    <TabsTrigger value="market" className="text-xs h-full">
                        {tOrderForm("market")}
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Margin Mode & Leverage */}
            <div className="flex items-center gap-2">
                {/* Margin Mode Selector */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 justify-between text-xs h-8"
                        >
                            {marginMode === "cross" ? "Cross" : "Isolated"}
                            <ChevronDown className="h-3 w-3 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-32 p-1">
                        <Button
                            variant={marginMode === "cross" ? "secondary" : "ghost"}
                            size="sm"
                            className="w-full justify-start text-xs"
                            onClick={() => setMarginMode("cross")}
                        >
                            {tOrderForm("cross")}
                        </Button>
                        <Button
                            variant={marginMode === "isolated" ? "secondary" : "ghost"}
                            size="sm"
                            className="w-full justify-start text-xs"
                            onClick={() => setMarginMode("isolated")}
                        >
                            {tOrderForm("isolated")}
                        </Button>
                    </PopoverContent>
                </Popover>

                {/* Leverage Selector */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 justify-between text-xs h-8"
                        >
                            {leverage}x
                            <Settings2 className="h-3 w-3 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-3">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">{tOrderForm("leverage")}</span>
                                <span className="text-sm font-medium">{leverage}x</span>
                            </div>
                            <Slider
                                value={[leverage]}
                                min={1}
                                max={125}
                                step={1}
                                onValueChange={(v) => setLeverage(v[0])}
                            />
                            <div className="flex flex-wrap gap-1">
                                {leverageOptions.map((lev) => (
                                    <Button
                                        key={lev}
                                        variant={leverage === lev ? "default" : "outline"}
                                        size="sm"
                                        className="text-xs h-6 px-2"
                                        onClick={() => setLeverage(lev)}
                                    >
                                        {lev}x
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Price Input */}
            <div className="space-y-1">
                <label className="text-xs text-muted-foreground">{tOrderForm("price")} (USDT)</label>
                <div className="relative">
                    <Input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        className="pr-14 h-9 text-sm"
                        disabled={orderType === "market"}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        USDT
                    </span>
                </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-1">
                <div className="flex justify-between">
                    <label className="text-xs text-muted-foreground">{tOrderForm("amount")} ({selectedCoin?.symbol.toLocaleUpperCase()})</label>
                    <span className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => handleAmountChange(maxAmount.toFixed(6))}>
                        Max: {maxAmount.toFixed(6)}
                    </span>
                </div>
                <div className="relative">
                    <Input
                        type="number"
                        value={amount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        placeholder="0.00"
                        className="pr-12 h-9 text-sm"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        {selectedCoin?.symbol.toLocaleUpperCase()}
                    </span>
                </div>
            </div>

            {/* Slider */}
            <div className="space-y-2">
                <Slider
                    value={sliderValue}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={handleSliderChange}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                    {[0, 25, 50, 75, 100].map((pct) => (
                        <button
                            key={pct}
                            className={cn(
                                "hover:text-foreground transition-colors",
                                sliderValue[0] >= pct && "text-foreground"
                            )}
                            onClick={() => handleSliderChange([pct])}
                        >
                            {pct}%
                        </button>
                    ))}
                </div>
            </div>

            {/* Cost Display */}
            <div className="flex justify-between items-center py-2 border-t border-border">
                <span className="text-xs text-muted-foreground">{tOrderForm("cost")}</span>
                <span className="text-sm font-medium">
                    {cost.toFixed(2)} USDT
                </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
                <Button
                    className="h-10 bg-primary hover:bg-primary/90 text-white font-medium"
                    onClick={() => handleSubmit("long")}
                    disabled={!amount || !price}
                >
                    {tOrderForm("buyLong")}
                </Button>
                <Button
                    className="h-10 bg-trading-red hover:bg-trading-red/90 text-white font-medium"
                    onClick={() => handleSubmit("short")}
                    disabled={!amount || !price}
                >
                    {tOrderForm("sellShort")}
                </Button>
            </div>

            {/* Available Balance */}
            <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">{tOrderForm("available")}</span>
                <span className="text-sm font-medium text-primary">
                    {balance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}{" "}
                    USDT
                </span>
            </div>
        </Card>
    )
}
