"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTradingStore } from "@/store/trading-store"
import { ChevronDown } from "lucide-react"
import { useTranslations } from "next-intl"

export function PositionsPanel() {
  const { positions, openOrders } = useTradingStore()
  const t = useTranslations("positions")

  return (
    <Card className="bg-card border-border">
      <Tabs defaultValue="positions">
        <div className="flex items-center justify-between px-4 border-b border-border">
          <TabsList className="bg-transparent p-0 h-auto">
            <TabsTrigger
              value="positions"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 text-sm"
            >
              {t("positions")}({positions.length})
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 text-sm"
            >
              {t("orders")}({openOrders.length}) <ChevronDown className="w-3 h-3 ms-1 inline" />
            </TabsTrigger>
            <TabsTrigger
              value="balances"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 text-sm"
            >
              {t("balances")}
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 text-sm"
            >
              {t("history")}
            </TabsTrigger>
          </TabsList>

          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
            {t("cancelAll")}
          </Button>
        </div>

        <TabsContent value="positions" className="mt-0">
          <div className="px-4 py-2 flex items-center gap-2">
            <Checkbox id="hideOther" />
            <label htmlFor="hideOther" className="text-xs text-muted-foreground">
              {t("hideOtherPairs")}
            </label>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground font-normal">{t("pair")}</TableHead>
                <TableHead className="text-xs text-muted-foreground font-normal">
                  {t("positionsBtc")} <ChevronDown className="w-3 h-3 inline ms-1" />
                </TableHead>
                <TableHead className="text-xs text-muted-foreground font-normal">{t("marginUsdt")}</TableHead>
                <TableHead className="text-xs text-muted-foreground font-normal">{t("entryPrice")}</TableHead>
                <TableHead className="text-xs text-muted-foreground font-normal">{t("markPrice")}</TableHead>
                <TableHead className="text-xs text-muted-foreground font-normal">{t("mmr")}</TableHead>
                <TableHead className="text-xs text-muted-foreground font-normal">{t("unrealizedPnl")}</TableHead>
                <TableHead className="text-xs text-muted-foreground font-normal">{t("tpsl")}</TableHead>
                <TableHead className="text-xs text-muted-foreground font-normal text-end">{t("actions")}</TableHead>
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
                        {position.side === "long" ? t("long") : t("short")}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        {position.leverage}X
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        {position.marginType === "cross" ? t("cross") : t("isolated")}
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
                  <TableCell className="text-end">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                        {t("tpsl")}
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                        {t("reverse")}
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                        {t("close")}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="orders" className="p-4 mt-0">
          <div className="text-center text-muted-foreground text-sm py-8">{t("noOpenOrders")}</div>
        </TabsContent>

        <TabsContent value="balances" className="p-4 mt-0">
          <div className="text-center text-muted-foreground text-sm py-8">{t("balancePlaceholder")}</div>
        </TabsContent>

        <TabsContent value="history" className="p-4 mt-0">
          <div className="text-center text-muted-foreground text-sm py-8">{t("historyPlaceholder")}</div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
