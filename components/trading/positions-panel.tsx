"use client"

import { useState, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useTradeStore } from "@/store/trade-store"
import { X, TrendingUp, TrendingDown } from "lucide-react"
import { useTranslations } from "next-intl"
import useSelectCoin from "@/lib/hooks/useSelectCoin"

interface PositionsPanelProps {
    markPrice?: number
}

export function PositionsPanel({ markPrice: externalMarkPrice }: PositionsPanelProps) {
    const { positions, openOrders, orderHistory, closePosition, markPrice: storeMarkPrice, balance } =
        useTradeStore()
    const { selectedCoin } = useSelectCoin()

    const [activeTab, setActiveTab] = useState("positions")
    const tPositions = useTranslations("trading.positions")

    const currentMarkPrice = externalMarkPrice ?? storeMarkPrice

    // Calculate PNL for each position
    const positionsWithPnl = useMemo(() => {
        return positions.map((position) => {
            const priceDiff = currentMarkPrice - position.entryPrice
            const pnl =
                position.side === "long"
                    ? priceDiff * position.size
                    : -priceDiff * position.size

            const roe = (pnl / position.margin) * 100

            return {
                ...position,
                pnl,
                roe,
            }
        })
    }, [positions, currentMarkPrice])

    // Calculate total unrealized PNL
    const totalUnrealizedPnl = useMemo(() => {
        return positionsWithPnl.reduce((sum, p) => sum + p.pnl, 0)
    }, [positionsWithPnl])

    const handleClosePosition = (id: string) => {
        closePosition(id, currentMarkPrice)
    }

    const formatPrice = (price: number) => {
        return price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    }

    const formatPnl = (pnl: number) => {
        const sign = pnl >= 0 ? "+" : ""
        return `${sign}${pnl.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`
    }

    const formatRoe = (roe: number) => {
        const sign = roe >= 0 ? "+" : ""
        return `${sign}${roe.toFixed(2)}%`
    }

    return (
        <Card className="bg-card">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                {/* Header with tabs and summary */}
                <div className="flex items-center justify-between border-b border-border px-3 py-2">
                    <TabsList className="h-8 bg-transparent p-0 gap-4">
                        <TabsTrigger
                            value="positions"
                            className="h-7 px-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none relative text-sm"
                        >
                            {tPositions("positions")}
                            {positions.length > 0 && (
                                <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">
                                    {positions.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger
                            value="orders"
                            className="h-7 px-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-sm"
                        >
                            {tPositions("openOrders")}
                            {openOrders.length > 0 && (
                                <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">
                                    {openOrders.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger
                            value="history"
                            className="h-7 px-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-sm"
                        >
                            {tPositions("history")}
                        </TabsTrigger>
                        <TabsTrigger
                            value="balances"
                            className="h-7 px-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-sm"
                        >
                            {tPositions("balances")}
                        </TabsTrigger>
                    </TabsList>

                    {/* Summary Stats */}
                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                            <span className="text-muted-foreground">{tPositions("unrealizedPnl")}:</span>
                            <span
                                className={cn(
                                    "font-medium",
                                    totalUnrealizedPnl >= 0 ? "text-primary" : "text-trading-red"
                                )}
                            >
                                {formatPnl(totalUnrealizedPnl)} USDT
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-muted-foreground">{tPositions("balances")}:</span>
                            <span className="font-medium">{formatPrice(balance)} USDT</span>
                        </div>
                    </div>
                </div>

                {/* Tab Contents */}
                <TabsContent value="positions" className="mt-0">
                    <ScrollArea className="h-[200px]">
                        {positionsWithPnl.length === 0 ? (
                            <div className="flex items-center justify-center h-[180px] text-muted-foreground text-sm">
                                {tPositions("noPositions")}
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="text-xs h-8">{tPositions("symbol")}</TableHead>
                                        <TableHead className="text-xs h-8">{tPositions("size")}</TableHead>
                                        <TableHead className="text-xs h-8">{tPositions("entryPrice")}</TableHead>
                                        <TableHead className="text-xs h-8">{tPositions("markPrice")}</TableHead>
                                        <TableHead className="text-xs h-8">{tPositions("margin")}</TableHead>
                                        <TableHead className="text-xs h-8">{tPositions("pnlRoe")}</TableHead>
                                        <TableHead className="text-xs h-8 text-right">{tPositions("action")}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {positionsWithPnl.map((position) => (
                                        <TableRow key={position.id} className="hover:bg-muted/50">
                                            <TableCell className="py-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1.5">
                                                        {position.side === "long" ? (
                                                            <TrendingUp className="h-4 w-4 text-primary" />
                                                        ) : (
                                                            <TrendingDown className="h-4 w-4 text-trading-red" />
                                                        )}
                                                        <span className="font-medium text-sm">
                                                            {position.symbol}
                                                        </span>
                                                    </div>
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            "text-xs h-5 px-1.5",
                                                            position.side === "long"
                                                                ? "border-primary text-primary"
                                                                : "border-trading-red text-trading-red"
                                                        )}
                                                    >
                                                        {position.leverage}x
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell
                                                className={cn(
                                                    "py-2 font-medium text-sm",
                                                    position.side === "long"
                                                        ? "text-primary"
                                                        : "text-trading-red"
                                                )}
                                            >
                                                {position.side === "long" ? "+" : "-"}
                                                {position.size.toFixed(6)} {selectedCoin?.symbol.toLocaleUpperCase()}
                                            </TableCell>
                                            <TableCell className="py-2 text-sm">
                                                {formatPrice(position.entryPrice)}
                                            </TableCell>
                                            <TableCell className="py-2 text-sm">
                                                {formatPrice(currentMarkPrice)}
                                            </TableCell>
                                            <TableCell className="py-2 text-sm">
                                                {formatPrice(position.margin)} USDT
                                            </TableCell>
                                            <TableCell className="py-2">
                                                <div
                                                    className={cn(
                                                        "font-medium text-sm",
                                                        position.pnl >= 0
                                                            ? "text-primary"
                                                            : "text-trading-red"
                                                    )}
                                                >
                                                    <div>{formatPnl(position.pnl)} USDT</div>
                                                    <div className="text-xs opacity-80">
                                                        {formatRoe(position.roe)}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-2 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 px-2 text-xs hover:bg-trading-red/10 hover:text-trading-red"
                                                    onClick={() => handleClosePosition(position.id)}
                                                >
                                                    <X className="h-3 w-3 mr-1" />
                                                    {tPositions("closePosition")}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </ScrollArea>
                </TabsContent>

                <TabsContent value="orders" className="mt-0">
                    <ScrollArea className="h-[200px]">
                        {openOrders.length === 0 ? (
                            <div className="flex items-center justify-center h-[180px] text-muted-foreground text-sm">
                                {tPositions("noOrders")}
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="text-xs h-8">{tPositions("symbol")}</TableHead>
                                        <TableHead className="text-xs h-8">{tPositions("type")}</TableHead>
                                        <TableHead className="text-xs h-8">{tPositions("side")}</TableHead>
                                        <TableHead className="text-xs h-8">{tPositions("price")}</TableHead>
                                        <TableHead className="text-xs h-8">{tPositions("amount")}</TableHead>
                                        <TableHead className="text-xs h-8 text-right">{tPositions("action")}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {openOrders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="py-2">{order.symbol}</TableCell>
                                            <TableCell className="py-2 capitalize">{order.type}</TableCell>
                                            <TableCell
                                                className={cn(
                                                    "py-2",
                                                    order.side === "long"
                                                        ? "text-primary"
                                                        : "text-trading-red"
                                                )}
                                            >
                                                {order.side === "long" ? "Buy" : "Sell"}
                                            </TableCell>
                                            <TableCell className="py-2">
                                                {formatPrice(order.price)}
                                            </TableCell>
                                            <TableCell className="py-2">{order.amount}</TableCell>
                                            <TableCell className="py-2 text-right">
                                                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                                                    {tPositions("cancel")}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </ScrollArea>
                </TabsContent>

                <TabsContent value="history" className="mt-0">
                    <ScrollArea className="h-[200px]">
                        {orderHistory.length === 0 ? (
                            <div className="flex items-center justify-center h-[180px] text-muted-foreground text-sm">
                                {tPositions("noHistory")}
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="text-xs h-8">{tPositions("symbol")}</TableHead>
                                        <TableHead className="text-xs h-8">{tPositions("side")}</TableHead>
                                        <TableHead className="text-xs h-8">{tPositions("size")}</TableHead>
                                        <TableHead className="text-xs h-8">{tPositions("entryPrice")}</TableHead>
                                        <TableHead className="text-xs h-8">{tPositions("pnl")}</TableHead>
                                        <TableHead className="text-xs h-8">{tPositions("time")}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orderHistory.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="py-2 font-medium">
                                                {item.symbol}
                                            </TableCell>
                                            <TableCell
                                                className={cn(
                                                    "py-2",
                                                    item.side === "long"
                                                        ? "text-primary"
                                                        : "text-trading-red"
                                                )}
                                            >
                                                {item.side === "long" ? "Long" : "Short"}
                                            </TableCell>
                                            <TableCell className="py-2">{item.size.toFixed(6)}</TableCell>
                                            <TableCell className="py-2">
                                                {formatPrice(item.entryPrice)}
                                            </TableCell>
                                            <TableCell
                                                className={cn(
                                                    "py-2 font-medium",
                                                    item.pnl >= 0 ? "text-primary" : "text-trading-red"
                                                )}
                                            >
                                                {formatPnl(item.pnl)} USDT
                                            </TableCell>
                                            <TableCell className="py-2 text-muted-foreground text-xs">
                                                {new Date(item.closedAt).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </ScrollArea>
                </TabsContent>

                <TabsContent value="balances" className="mt-0">
                    <ScrollArea className="h-[200px]">
                        <div className="p-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-1">
                                    <div className="text-xs text-muted-foreground">{tPositions("totalBalance")}</div>
                                    <div className="text-lg font-semibold">
                                        {formatPrice(balance + totalUnrealizedPnl)} USDT
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xs text-muted-foreground">{tPositions("availableBalance")}</div>
                                    <div className="text-lg font-semibold">{formatPrice(balance)} USDT</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xs text-muted-foreground">{tPositions("inPositions")}</div>
                                    <div className="text-lg font-semibold">
                                        {formatPrice(
                                            positions.reduce((sum, p) => sum + p.margin, 0)
                                        )}{" "}
                                        USDT
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xs text-muted-foreground">{tPositions("unrealizedPnl")}</div>
                                    <div
                                        className={cn(
                                            "text-lg font-semibold",
                                            totalUnrealizedPnl >= 0
                                                ? "text-primary"
                                                : "text-trading-red"
                                        )}
                                    >
                                        {formatPnl(totalUnrealizedPnl)} USDT
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </Card>
    )
}
