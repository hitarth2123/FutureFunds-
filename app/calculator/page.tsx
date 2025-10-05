"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CalculatorForm } from "@/components/calculator-form"
import { ResultsDisplay } from "@/components/results-display"
import { SaveScenarioDialog } from "@/components/save-scenario-dialog"
import { UserNav } from "@/components/user-nav"
import type { RetirementOutput, RetirementInput } from "@/lib/calculator"
import { Calculator } from "lucide-react"
import { getScenarioById } from "@/lib/scenarios"
import { getSchemeById } from "@/lib/schemes"

export default function CalculatorPage() {
  const mutualMarketHref = process.env.NEXT_PUBLIC_MUTUAL_MARKET_URL || "/mutual-market"
  const searchParams = useSearchParams()
  const [result, setResult] = useState<RetirementOutput | null>(null)
  const [currentInput, setCurrentInput] = useState<RetirementInput | null>(null)

  useEffect(() => {
    const viewId = searchParams.get("view")
    const editId = searchParams.get("edit")
    const id = viewId || editId
    if (!id) return
    let mounted = true
    ;(async () => {
      const scenario = await getScenarioById(id)
      if (scenario && mounted) {
        if (editId) {
          setCurrentInput(scenario.input)
          setResult(null)
        } else {
          setResult(scenario.output)
          setCurrentInput(scenario.input)
        }
      }
    })()
    return () => {
      mounted = false
    }
  }, [searchParams])

  // Apply selected schemes (from Schemes page) to calculator inputs
  useEffect(() => {
    const raw = sessionStorage.getItem('selectedSchemes')
    if (!raw) return
    try {
      const list: Array<{ id: string; amount: number }> = JSON.parse(raw)
      if (!Array.isArray(list) || list.length === 0) return
      // Clear the sessionStorage - schemes will be handled separately in the form
      // Don't add schemes to monthlySIP/FD/RD values anymore
      sessionStorage.removeItem('selectedSchemes')
    } catch {}
  }, [])

  const handleCalculate = (output: RetirementOutput, input: RetirementInput) => {
    setResult(output)
    setCurrentInput(input)
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
            <Link href="/calculator" className="text-sm font-medium text-primary">
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
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </Link>
          </nav>
          <UserNav />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl px-4 py-8">
        {searchParams.get("edit") || !result ? (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2 font-serif">
                {searchParams.get("edit") ? "Edit Scenario" : "Plan Your Retirement"}
              </h2>
              <p className="text-muted-foreground">
                Enter your details below to calculate your retirement corpus and see if you're on track to meet your
                goals.
              </p>
            </div>
            <CalculatorForm onCalculate={handleCalculate} initialInput={currentInput} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-3xl font-bold font-serif">Your Retirement Plan</h2>
              <div className="flex gap-2">
                {currentInput && (
                  <SaveScenarioDialog input={currentInput} output={result} triggerLabel="Save Data" />
                )}
                <Button variant="outline" onClick={() => setResult(null)}>
                  Recalculate
                </Button>
              </div>
            </div>

            <ResultsDisplay result={result} />
          </div>
        )}
      </main>
    </div>
  )
}
