"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import type { RetirementInput, RetirementOutput } from "@/lib/calculator"
import { Loader2 } from "lucide-react"

interface CalculatorFormProps {
  onCalculate: (result: RetirementOutput, input: RetirementInput) => void
  initialInput?: RetirementInput | null
}

export function CalculatorForm({ onCalculate, initialInput }: CalculatorFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [currentAge, setCurrentAge] = useState(30)
  const [retirementAge, setRetirementAge] = useState(60)
  const [lifeExpectancy, setLifeExpectancy] = useState(80)
  const [currentSavings, setCurrentSavings] = useState(500000)
  const [monthlySIP, setMonthlySIP] = useState(10000)
  const [monthlyFD, setMonthlyFD] = useState(5000)
  const [monthlyRD, setMonthlyRD] = useState(3000)
  const [monthlyExpense, setMonthlyExpense] = useState(50000)
  const [mfReturn, setMfReturn] = useState(12)
  const [fdReturn, setFdReturn] = useState(7)
  const [rdReturn, setRdReturn] = useState(7)
  const [inflation, setInflation] = useState(6)

  useEffect(() => {
    if (initialInput) {
      setCurrentAge(initialInput.currentAge)
      setRetirementAge(initialInput.retirementAge)
      setLifeExpectancy(initialInput.lifeExpectancy)
      setCurrentSavings(initialInput.currentSavings)
      setMonthlySIP(initialInput.monthlySIP)
      setMonthlyFD(initialInput.monthlyFD)
      setMonthlyRD(initialInput.monthlyRD)
      setMonthlyExpense(initialInput.monthlyExpenseAfterRetirement)
      setMfReturn(initialInput.expectedReturn.mutualFunds)
      setFdReturn(initialInput.expectedReturn.fd)
      setRdReturn(initialInput.expectedReturn.rd)
      setInflation(initialInput.inflationRate)
    }
  }, [initialInput])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const input: RetirementInput = {
      currentAge,
      retirementAge,
      currentSavings,
      monthlySIP,
      monthlyFD,
      monthlyRD,
      expectedReturn: {
        mutualFunds: mfReturn,
        fd: fdReturn,
        rd: rdReturn,
      },
      inflationRate: inflation,
      monthlyExpenseAfterRetirement: monthlyExpense,
      lifeExpectancy,
    }

    try {
      const response = await fetch("/api/calc/retirement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Calculation failed")
      }

      const result: RetirementOutput = await response.json()
      onCalculate(result, input)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Details */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
          <CardDescription>Tell us about yourself and your retirement plans</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="currentAge">Current Age</Label>
              <span className="text-sm text-muted-foreground">{currentAge} years</span>
            </div>
            <Slider
              id="currentAge"
              min={18}
              max={65}
              step={1}
              value={[currentAge]}
              onValueChange={(value) => setCurrentAge(value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="retirementAge">Retirement Age</Label>
              <span className="text-sm text-muted-foreground">{retirementAge} years</span>
            </div>
            <Slider
              id="retirementAge"
              min={currentAge + 1}
              max={75}
              step={1}
              value={[retirementAge]}
              onValueChange={(value) => setRetirementAge(value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="lifeExpectancy">Life Expectancy</Label>
              <span className="text-sm text-muted-foreground">{lifeExpectancy} years</span>
            </div>
            <Slider
              id="lifeExpectancy"
              min={retirementAge + 1}
              max={100}
              step={1}
              value={[lifeExpectancy]}
              onValueChange={(value) => setLifeExpectancy(value[0])}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyExpense">Monthly Expense After Retirement</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
              <Input
                id="monthlyExpense"
                type="number"
                value={monthlyExpense}
                onChange={(e) => setMonthlyExpense(Number(e.target.value))}
                className="pl-8"
                min={0}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Savings & Investments */}
      <Card>
        <CardHeader>
          <CardTitle>Current Savings & Monthly Investments</CardTitle>
          <CardDescription>Enter your existing savings and planned monthly contributions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentSavings">Current Savings (Lumpsum)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
              <Input
                id="currentSavings"
                type="number"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(Number(e.target.value))}
                className="pl-8"
                min={0}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlySIP">Monthly SIP (Mutual Funds)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
              <Input
                id="monthlySIP"
                type="number"
                value={monthlySIP}
                onChange={(e) => setMonthlySIP(Number(e.target.value))}
                className="pl-8"
                min={0}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyFD">Monthly Fixed Deposit</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
              <Input
                id="monthlyFD"
                type="number"
                value={monthlyFD}
                onChange={(e) => setMonthlyFD(Number(e.target.value))}
                className="pl-8"
                min={0}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyRD">Monthly Recurring Deposit</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
              <Input
                id="monthlyRD"
                type="number"
                value={monthlyRD}
                onChange={(e) => setMonthlyRD(Number(e.target.value))}
                className="pl-8"
                min={0}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expected Returns */}
      <Card>
        <CardHeader>
          <CardTitle>Expected Returns</CardTitle>
          <CardDescription>Adjust expected annual returns for each investment type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="mfReturn">Mutual Funds Return</Label>
              <span className="text-sm text-muted-foreground">{mfReturn}% p.a.</span>
            </div>
            <Slider
              id="mfReturn"
              min={8}
              max={18}
              step={0.5}
              value={[mfReturn]}
              onValueChange={(value) => setMfReturn(value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="fdReturn">Fixed Deposit Return</Label>
              <span className="text-sm text-muted-foreground">{fdReturn}% p.a.</span>
            </div>
            <Slider
              id="fdReturn"
              min={5}
              max={9}
              step={0.1}
              value={[fdReturn]}
              onValueChange={(value) => setFdReturn(value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="rdReturn">Recurring Deposit Return</Label>
              <span className="text-sm text-muted-foreground">{rdReturn}% p.a.</span>
            </div>
            <Slider
              id="rdReturn"
              min={5}
              max={9}
              step={0.1}
              value={[rdReturn]}
              onValueChange={(value) => setRdReturn(value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="inflation">Inflation Rate</Label>
              <span className="text-sm text-muted-foreground">{inflation}% p.a.</span>
            </div>
            <Slider
              id="inflation"
              min={3}
              max={10}
              step={0.5}
              value={[inflation]}
              onValueChange={(value) => setInflation(value[0])}
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg border border-destructive/20">
          {error}
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Calculating...
          </>
        ) : (
          "Calculate Retirement Plan"
        )}
      </Button>
    </form>
  )
}
