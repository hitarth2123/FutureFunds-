"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign } from "lucide-react"
import type { Stock } from "@/components/mutual market/market-dashboard"

type StockListProps = {
  stocks: Stock[]
  onBuy: (stockId: string, shares: number) => void
  onSell: (stockId: string, shares: number) => void
}

export function StockList({ stocks, onBuy, onSell }: StockListProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Mutual Funds</h2>
        <Badge variant="secondary">Live Market</Badge>
      </div>

      <div className="space-y-4">
        {stocks.map((stock) => (
          <StockItem key={stock.id} stock={stock} onBuy={onBuy} onSell={onSell} />
        ))}
      </div>
    </Card>
  )
}

function StockItem({
  stock,
  onBuy,
  onSell,
}: { stock: Stock; onBuy: (id: string, shares: number) => void; onSell: (id: string, shares: number) => void }) {
  const isPositive = stock.change >= 0
  const currentValue = stock.price * stock.shares
  const profitLoss = currentValue - stock.invested

  return (
    <div className="p-4 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-lg font-semibold text-foreground">{stock.symbol}</h3>
            <Badge variant={isPositive ? "default" : "destructive"} className="gap-1">
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {isPositive ? "+" : ""}
              {stock.changePercent.toFixed(2)}%
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{stock.name}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">${stock.price.toFixed(2)}</p>
          <p className={`text-sm ${isPositive ? "text-success" : "text-destructive"}`}>
            {isPositive ? "+" : ""}
            {stock.change.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-3 p-3 rounded-md bg-muted/50">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Shares Owned</p>
          <p className="text-sm font-semibold text-foreground">{stock.shares}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Current Value</p>
          <p className="text-sm font-semibold text-foreground">${currentValue.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Profit/Loss</p>
          <p className={`text-sm font-semibold ${profitLoss >= 0 ? "text-success" : "text-destructive"}`}>
            {profitLoss >= 0 ? "+" : ""}${profitLoss.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => onBuy(stock.id, 10)} className="flex-1 gap-2" variant="default">
          <ShoppingCart className="w-4 h-4" />
          Buy 10 Shares
        </Button>
        <Button
          onClick={() => onSell(stock.id, 10)}
          className="flex-1 gap-2"
          variant="outline"
          disabled={stock.shares < 10}
        >
          <DollarSign className="w-4 h-4" />
          Sell 10 Shares
        </Button>
      </div>
    </div>
  )
}
