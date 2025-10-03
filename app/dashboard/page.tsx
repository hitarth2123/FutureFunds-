"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScenarioCard } from "@/components/scenario-card"
import { UserNav } from "@/components/user-nav"
import { getUserScenarios, type Scenario } from "@/lib/scenarios"
import { getCurrentUser } from "@/lib/auth"
import { Calculator, Plus, FolderOpen } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const mutualMarketHref = process.env.NEXT_PUBLIC_MUTUAL_MARKET_URL || "/mutual-market"
  const router = useRouter()
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/auth")
      return
    }
    let mounted = true
    ;(async () => {
      const data = await getUserScenarios()
      if (mounted) {
        setScenarios(Array.isArray(data) ? data : [])
        setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [router])

  const handleScenarioDeleted = async () => {
    const data = await getUserScenarios()
    setScenarios(Array.isArray(data) ? data : [])
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

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
            <Link href="/calculator" className="text-sm font-medium hover:text-primary transition-colors">
              Calculator
            </Link>
            <Link href="/schemes" className="text-sm font-medium hover:text-primary transition-colors">
              Schemes
            </Link>
            <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href={mutualMarketHref} className="text-sm font-medium hover:text-primary transition-colors">
              Mutual Market
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-primary">
              Dashboard
            </Link>
          </nav>
          <UserNav />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-serif">My Scenarios</h1>
              <p className="text-muted-foreground mt-1">Manage and compare your retirement planning scenarios</p>
            </div>
            <Link href="/calculator">
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                New Scenario
              </Button>
            </Link>
          </div>

          {/* Scenarios Grid */}
          {scenarios.length === 0 ? (
            <Card className="border-dashed">
              <CardHeader className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <FolderOpen className="h-16 w-16 text-muted-foreground" />
                </div>
                <CardTitle>No Scenarios Yet</CardTitle>
                <CardDescription className="max-w-md mx-auto">
                  Start planning your retirement by creating your first scenario. Use the calculator to explore
                  different investment strategies.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-12">
                <Link href="/calculator">
                  <Button size="lg">
                    <Calculator className="mr-2 h-5 w-5" />
                    Create First Scenario
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scenarios.map((scenario) => (
                <ScenarioCard key={scenario.id} scenario={scenario} onDelete={handleScenarioDeleted} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
