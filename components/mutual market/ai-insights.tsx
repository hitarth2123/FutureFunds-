"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, AlertTriangle, TrendingUp, Shield } from "lucide-react"
import type { Stock } from "@/components/mutual market/market-dashboard"

type AIInsightsProps = {
  portfolio: Stock[]
  aiActive: boolean
}

export function AIInsights({ portfolio, aiActive }: AIInsightsProps) {
  const atRiskStocks = portfolio.filter((s) => s.changePercent < -3 && s.shares > 0)
  const performingStocks = portfolio.filter((s) => s.changePercent > 2 && s.shares > 0)

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent">
          <Brain className="w-5 h-5 text-accent-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">AI Insights</h2>
          <p className="text-xs text-muted-foreground">Real-time analysis</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* AI Status */}
        <div className={`p-4 rounded-lg ${aiActive ? "bg-success/10 border border-success/20" : "bg-muted"}`}>
          <div className="flex items-center gap-2 mb-2">
            <Shield className={`w-4 h-4 ${aiActive ? "text-success" : "text-muted-foreground"}`} />
            <p className="text-sm font-semibold text-foreground">Loss Protection</p>
          </div>
          <p className="text-xs text-muted-foreground">
            {aiActive
              ? "AI will automatically sell positions losing more than 5%"
              : "AI protection is currently disabled"}
          </p>
        </div>

        {/* At Risk Stocks */}
        {atRiskStocks.length > 0 && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <p className="text-sm font-semibold text-foreground">At Risk</p>
            </div>
            <div className="space-y-2">
              {atRiskStocks.map((stock) => (
                <div key={stock.id} className="flex items-center justify-between">
                  <span className="text-xs text-foreground">{stock.symbol}</span>
                  <Badge variant="destructive" className="text-xs">
                    {stock.changePercent.toFixed(2)}%
                  </Badge>
                </div>
              ))}
            </div>
            {aiActive && <p className="text-xs text-muted-foreground mt-2">AI will auto-sell if losses exceed -5%</p>}
          </div>
        )}

        {/* Performing Stocks */}
        {performingStocks.length > 0 && (
          <div className="p-4 rounded-lg bg-success/10 border border-success/20">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-success" />
              <p className="text-sm font-semibold text-foreground">Top Performers</p>
            </div>
            <div className="space-y-2">
              {performingStocks.map((stock) => (
                <div key={stock.id} className="flex items-center justify-between">
                  <span className="text-xs text-foreground">{stock.symbol}</span>
                  <Badge variant="default" className="text-xs bg-success text-success-foreground">
                    +{stock.changePercent.toFixed(2)}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Recommendations */}
        <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
          <p className="text-sm font-semibold text-foreground mb-2">AI Recommendation</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {portfolio.some((s) => s.changePercent < -3)
              ? "Consider diversifying your portfolio to reduce risk exposure."
              : "Your portfolio is well-balanced. Continue monitoring market trends."}
          </p>
        </div>
      </div>
    </Card>
  )
}
