"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTradingStore } from "@/store/trading-store"
import { ChevronDown } from "lucide-react"

export function PositionsPanel() {
  const { positions, openOrders } = useTradingStore()

  return (
    <Card className="bg-card border-border">
      <Tabs defaultValue="positions">
        <div className="flex items-center justify-between px-4 border-b border-border">
          <TabsList className="bg-transparent p-0 h-auto">
            <TabsTrigger
              value="positions"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 text-sm"
            >
              Positions({positions.length})
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 text-sm"
            >
              Orders({openOrders.length}) <ChevronDown className="w-3 h-3 ml-1 inline" />
            </TabsTrigger>
            <TabsTrigger
              value="balances"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 text-sm"
            >
              Balances
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 text-sm"
            >
              History
            </TabsTrigger>
          </TabsList>

          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
            Cancel all
          </Button>
        </div>

        <TabsContent value="positions" className="mt-0">
          <div className="px-4 py-2 flex items-center gap-2">
            <Checkbox id="hideOther" />
            <label htmlFor="hideOther" className="text-xs text-muted-foreground">
              Hide other pairs
            </label>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground font-normal">Pair</TableHead>
                <TableHead className="text-xs text-muted-foreground font-normal">
                  Positions(BTC) <ChevronDown className="w-3 h-3 inline ml-1" />
                </TableHead>
                <TableHead className="text-xs text-muted-foreground font-normal">Margin(USDT)</TableHead>
                <TableHead className="text-xs text-muted-foreground font-normal">Entry Price(USDT)</TableHead>
                <TableHead className="text-xs text-muted-foreground font-normal">Mark Price</TableHead>
                <TableHead className="text-xs text-muted-foreground font-normal">MMR</TableHead>
                <TableHead className="text-xs text-muted-foreground font-normal">Unrealized PNL</TableHead>
                <TableHead className="text-xs text-muted-foreground font-normal">TP/SL</TableHead>
                <TableHead className="text-xs text-muted-foreground font-normal text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map((position) => (
                <TableRow key={position.id} className="border-border">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{position.symbol}</span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded ${
                          position.side === "long"
                            ? "bg-trading-green/20 text-trading-green"
                            : "bg-trading-red/20 text-trading-red"
                        }`}
                      >
                        {position.side === "long" ? "Long" : "Short"}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        {position.leverage}X
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        {position.marginType === "cross" ? "Cross" : "Isolated"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">{position.size}</TableCell>
                  <TableCell className="text-foreground">{position.margin}</TableCell>
                  <TableCell className="text-foreground">{position.entryPrice}</TableCell>
                  <TableCell className="text-foreground">{position.markPrice}</TableCell>
                  <TableCell className="text-foreground">3.83%</TableCell>
                  <TableCell>
                    <span className="text-trading-green">
                      ${position.unrealizedPnl} ({position.pnlPercentage}%)
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-primary">{position.tpsl} ✓</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                        TP/SL
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                        Reverse
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                        Close
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="orders" className="p-4 mt-0">
          <div className="text-center text-muted-foreground text-sm py-8">No open orders</div>
        </TabsContent>

        <TabsContent value="balances" className="p-4 mt-0">
          <div className="text-center text-muted-foreground text-sm py-8">Balance information will appear here</div>
        </TabsContent>

        <TabsContent value="history" className="p-4 mt-0">
          <div className="text-center text-muted-foreground text-sm py-8">Trade history will appear here</div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
