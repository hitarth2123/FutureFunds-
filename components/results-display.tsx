"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { RetirementOutput } from "@/lib/calculator"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, XAxis, YAxis } from "recharts"
import { TrendingUp, CheckCircle2, AlertCircle } from "lucide-react"

interface ResultsDisplayProps {
  result: RetirementOutput
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  // Prepare data for pie chart (corpus breakdown)
  const pieData = [
    { name: "Mutual Funds", value: result.breakdown.mutualFunds, fill: "#10b981" }, // Emerald
    { name: "Fixed Deposits", value: result.breakdown.fd, fill: "#3b82f6" }, // Blue
    { name: "Recurring Deposits", value: result.breakdown.rd, fill: "#f59e0b" }, // Amber
    { name: "Current Savings", value: result.breakdown.currentSavings, fill: "#8b5cf6" }, // Purple
  ]

  // Prepare data for line chart (yearly projection)
  const lineData = result.yearlyProjection.map((item) => ({
    year: item.year,
    age: item.age,
    "Mutual Funds": Math.round(item.mutualFunds),
    "Fixed Deposits": Math.round(item.fd),
    "Recurring Deposits": Math.round(item.rd),
    Total: Math.round(item.total),
  }))

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`
    return `₹${(value / 1000).toFixed(0)}K`
  }

  const formatPercentage = (value: number) => {
    const percentage = (value / result.achievedCorpus) * 100
    return `${percentage.toFixed(1)}%`
  }

  const chartConfig = {
    mutualFunds: {
      label: "Mutual Funds",
      color: "#10b981",
    },
    fd: {
      label: "Fixed Deposits",
      color: "#3b82f6",
    },
    rd: {
      label: "Recurring Deposits",
      color: "#f59e0b",
    },
    total: {
      label: "Total Corpus",
      color: "#10b981",
    },
  }

  const renderCustomLabel = (entry: any) => {
    const percentage = ((entry.value / result.achievedCorpus) * 100).toFixed(1)
    return `${percentage}%`
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className={result.isGoalAchievable ? "border-primary" : "border-destructive"}>
          <CardHeader className="pb-3">
            <CardDescription>Goal Status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {result.isGoalAchievable ? (
                <>
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold text-primary">On Track!</p>
                    <p className="text-sm text-muted-foreground">You'll meet your goal</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="h-8 w-8 text-destructive" />
                  <div>
                    <p className="text-2xl font-bold text-destructive">Shortfall</p>
                    <p className="text-sm text-muted-foreground">{formatCurrency(result.shortfall)}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Required Corpus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(result.requiredCorpus)}</p>
                <p className="text-sm text-muted-foreground">For retirement</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Achieved Corpus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-primary">{formatCurrency(result.achievedCorpus)}</p>
                <p className="text-sm text-muted-foreground">At retirement</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pie Chart - Corpus Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Corpus Breakdown</CardTitle>
            <CardDescription>Distribution of your retirement corpus by investment type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => formatPercentage(value as number)}
                      labelFormatter={(label) => label}
                    />
                  }
                />
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={renderCustomLabel}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Bar Chart - Investment Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Investment Comparison</CardTitle>
            <CardDescription>Final value of each investment type at retirement</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={pieData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <ChartTooltip
                  content={<ChartTooltipContent formatter={(value) => formatCurrency(value as number)} />}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Line Chart - Growth Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Wealth Growth Projection</CardTitle>
          <CardDescription>Year-by-year growth of your retirement corpus</CardDescription>
        </CardHeader>
        <CardContent className="p-0 pb-6">
          <ChartContainer config={chartConfig} className="h-[450px] w-full">
            <AreaChart data={lineData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => formatCurrency(value as number)}
                    labelFormatter={(label) => `Year ${label}`}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="Total"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorTotal)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Detailed Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle>Investment Breakdown</CardTitle>
          <CardDescription>Detailed view of each investment component</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-semibold">Mutual Funds (SIP)</p>
                <p className="text-sm text-muted-foreground">Equity & debt mutual funds</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-primary">{formatCurrency(result.breakdown.mutualFunds)}</p>
                <p className="text-sm text-muted-foreground">
                  {((result.breakdown.mutualFunds / result.achievedCorpus) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-semibold">Fixed Deposits</p>
                <p className="text-sm text-muted-foreground">Bank fixed deposits</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-primary">{formatCurrency(result.breakdown.fd)}</p>
                <p className="text-sm text-muted-foreground">
                  {((result.breakdown.fd / result.achievedCorpus) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-semibold">Recurring Deposits</p>
                <p className="text-sm text-muted-foreground">Monthly recurring deposits</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-primary">{formatCurrency(result.breakdown.rd)}</p>
                <p className="text-sm text-muted-foreground">
                  {((result.breakdown.rd / result.achievedCorpus) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-semibold">Current Savings</p>
                <p className="text-sm text-muted-foreground">Lumpsum investment growth</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-primary">{formatCurrency(result.breakdown.currentSavings)}</p>
                <p className="text-sm text-muted-foreground">
                  {((result.breakdown.currentSavings / result.achievedCorpus) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg border-2 border-primary">
              <div>
                <p className="font-bold text-lg">Total Corpus</p>
                <p className="text-sm text-muted-foreground">At retirement</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{formatCurrency(result.achievedCorpus)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
