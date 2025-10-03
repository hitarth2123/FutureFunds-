"use client"

import Link from "next/link"
import { UserNav } from "@/components/user-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calculator } from "lucide-react"
import { MarketDashboard } from "@/components/mutual market/market-dashboard"

export default function MutualMarketPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <Link href="/" className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold font-serif">FutureFunds</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/calculator" className="text-sm font-medium hover:text-primary transition-colors">Calculator</Link>
            <Link href="/schemes" className="text-sm font-medium hover:text-primary transition-colors">Schemes</Link>
            <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</Link>
            <Link href="/mutual-market" className="text-sm font-medium text-primary">Mutual Market</Link>
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
          </nav>
          <UserNav />
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <Badge variant="secondary" className="mb-3">Beta</Badge>
          <h1 className="text-4xl font-bold font-serif mb-2">Mutual Fund Market</h1>
          <p className="text-muted-foreground">Interactive simulator with portfolio, stocks, AI insights and trade history.</p>
        </div>

        <MarketDashboard />
      </main>
    </div>
  )
}


