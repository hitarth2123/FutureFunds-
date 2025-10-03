"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PortfolioOverview } from "@/components/mutual market/portfolio-overview"
import { StockList } from "@/components/mutual market/stock-list"
import { AIInsights } from "@/components/mutual market/ai-insights"
import { TradeHistory } from "@/components/mutual market/trade-history"
import { Activity, Brain } from "lucide-react"

export type Stock = {
  id: string
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  shares: number
  invested: number
}

export type Trade = {
  id: string
  symbol: string
  action: "buy" | "sell" | "ai-sell"
  shares: number
  price: number
  timestamp: Date
  reason?: string
}

export function MarketDashboard() {
  const [portfolio, setPortfolio] = useState<Stock[]>([
    {
      id: "1",
      symbol: "TECH",
      name: "Tech Growth Fund",
      price: 125.5,
      change: 2.3,
      changePercent: 1.87,
      shares: 50,
      invested: 6000,
    },
    {
      id: "2",
      symbol: "HEALTH",
      name: "Healthcare Fund",
      price: 89.2,
      change: -1.5,
      changePercent: -1.65,
      shares: 75,
      invested: 6800,
    },
    {
      id: "3",
      symbol: "ENERGY",
      name: "Energy Sector Fund",
      price: 156.8,
      change: 4.2,
      changePercent: 2.75,
      shares: 30,
      invested: 4500,
    },
    {
      id: "4",
      symbol: "FINANCE",
      name: "Financial Services",
      price: 98.4,
      change: -3.2,
      changePercent: -3.15,
      shares: 60,
      invested: 6100,
    },
  ])

  const [trades, setTrades] = useState<Trade[]>([])
  const [aiActive, setAiActive] = useState(true)
  const [totalValue, setTotalValue] = useState(0)
  const [totalGain, setTotalGain] = useState(0)

  useEffect(() => {
    // Simulate real-time price updates
    const interval = setInterval(() => {
      setPortfolio((prev) =>
        prev.map((stock) => {
          const changeAmount = (Math.random() - 0.5) * 5
          const newPrice = Math.max(stock.price + changeAmount, 10)
          const newChange = newPrice - stock.price
          const newChangePercent = (newChange / stock.price) * 100

          // AI Loss Detection: Auto-sell if loss exceeds 5%
          if (aiActive && newChangePercent < -5 && stock.shares > 0) {
            const trade: Trade = {
              id: Date.now().toString(),
              symbol: stock.symbol,
              action: "ai-sell",
              shares: stock.shares,
              price: newPrice,
              timestamp: new Date(),
              reason: `AI detected ${newChangePercent.toFixed(2)}% loss - Auto-sold to prevent further losses`,
            }
            setTrades((prev) => [trade, ...prev].slice(0, 10))

            return {
              ...stock,
              price: newPrice,
              change: newChange,
              changePercent: newChangePercent,
              shares: 0,
            }
          }

          return {
            ...stock,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
          }
        }),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [aiActive])

  useEffect(() => {
    const total = portfolio.reduce((sum, stock) => sum + stock.price * stock.shares, 0)
    const invested = portfolio.reduce((sum, stock) => sum + stock.invested, 0)
    setTotalValue(total)
    setTotalGain(total - invested)
  }, [portfolio])

  const handleBuy = (stockId: string, shares: number) => {
    setPortfolio((prev) =>
      prev.map((stock) => {
        if (stock.id === stockId) {
          const trade: Trade = {
            id: Date.now().toString(),
            symbol: stock.symbol,
            action: "buy",
            shares,
            price: stock.price,
            timestamp: new Date(),
          }
          setTrades((prev) => [trade, ...prev].slice(0, 10))

          return {
            ...stock,
            shares: stock.shares + shares,
            invested: stock.invested + stock.price * shares,
          }
        }
        return stock
      }),
    )
  }

  const handleSell = (stockId: string, shares: number) => {
    setPortfolio((prev) =>
      prev.map((stock) => {
        if (stock.id === stockId && stock.shares >= shares) {
          const trade: Trade = {
            id: Date.now().toString(),
            symbol: stock.symbol,
            action: "sell",
            shares,
            price: stock.price,
            timestamp: new Date(),
          }
          setTrades((prev) => [trade, ...prev].slice(0, 10))

          return {
            ...stock,
            shares: stock.shares - shares,
          }
        }
        return stock
      }),
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
                <Activity className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Market Simulator</h1>
                <p className="text-sm text-muted-foreground">Smart Trading with Loss Protection</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={aiActive ? "default" : "secondary"} className="gap-2">
                <Brain className="w-4 h-4" />
                AI Protection {aiActive ? "Active" : "Inactive"}
              </Badge>
              <Button variant={aiActive ? "destructive" : "default"} onClick={() => setAiActive(!aiActive)}>
                {aiActive ? "Disable AI" : "Enable AI"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Portfolio & Stocks */}
          <div className="lg:col-span-2 space-y-6">
            <PortfolioOverview totalValue={totalValue} totalGain={totalGain} portfolio={portfolio} />
            <StockList stocks={portfolio} onBuy={handleBuy} onSell={handleSell} />
          </div>

          {/* Right Column - AI Insights & History */}
          <div className="space-y-6">
            <AIInsights portfolio={portfolio} aiActive={aiActive} />
            <TradeHistory trades={trades} />
          </div>
        </div>
      </div>
    </div>
  )
}
