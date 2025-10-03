import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { History, ShoppingCart, DollarSign, Brain } from "lucide-react"
import type { Trade } from "@/components/mutual market/market-dashboard"

type TradeHistoryProps = {
  trades: Trade[]
}

export function TradeHistory({ trades }: TradeHistoryProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <History className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold text-foreground">Trade History</h2>
      </div>

      {trades.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No trades yet. Start buying or selling to see your history.
        </p>
      ) : (
        <div className="space-y-3">
          {trades.map((trade) => (
            <div
              key={trade.id}
              className="p-3 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {trade.action === "ai-sell" ? (
                    <Brain className="w-4 h-4 text-accent" />
                  ) : trade.action === "buy" ? (
                    <ShoppingCart className="w-4 h-4 text-success" />
                  ) : (
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-semibold text-foreground">{trade.symbol}</span>
                </div>
                <Badge
                  variant={
                    trade.action === "buy" ? "default" : trade.action === "ai-sell" ? "destructive" : "secondary"
                  }
                  className="text-xs"
                >
                  {trade.action === "ai-sell" ? "AI Sell" : trade.action.toUpperCase()}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>
                  {trade.shares} shares @ ${trade.price.toFixed(2)}
                </span>
                <span>${(trade.shares * trade.price).toFixed(2)}</span>
              </div>

              {trade.reason && (
                <p className="text-xs text-destructive mt-2 p-2 rounded bg-destructive/10">{trade.reason}</p>
              )}

              <p className="text-xs text-muted-foreground mt-1">{trade.timestamp.toLocaleTimeString()}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
