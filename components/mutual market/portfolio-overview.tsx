import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, PieChart } from "lucide-react"
import type { Stock } from "@/components/mutual market/market-dashboard"

type PortfolioOverviewProps = {
  totalValue: number
  totalGain: number
  portfolio: Stock[]
}

export function PortfolioOverview({ totalValue, totalGain, portfolio }: PortfolioOverviewProps) {
  const totalInvested = portfolio.reduce((sum, stock) => sum + stock.invested, 0)
  const gainPercent = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0
  const isPositive = totalGain >= 0

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Portfolio Overview</h2>
        <PieChart className="w-5 h-5 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Total Value</p>
          <p className="text-3xl font-bold text-foreground">${totalValue.toFixed(2)}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-1">Total Gain/Loss</p>
          <div className="flex items-center gap-2">
            <p className={`text-3xl font-bold ${isPositive ? "text-success" : "text-destructive"}`}>
              {isPositive ? "+" : ""}
              {totalGain.toFixed(2)}
            </p>
            {isPositive ? (
              <TrendingUp className="w-6 h-6 text-success" />
            ) : (
              <TrendingDown className="w-6 h-6 text-destructive" />
            )}
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-1">Return</p>
          <p className={`text-3xl font-bold ${isPositive ? "text-success" : "text-destructive"}`}>
            {isPositive ? "+" : ""}
            {gainPercent.toFixed(2)}%
          </p>
        </div>
      </div>
    </Card>
  )
}
