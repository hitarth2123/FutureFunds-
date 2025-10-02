"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Scenario } from "@/lib/scenarios"
import { Trash2, Eye, Calendar, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { deleteScenario } from "@/lib/scenarios"
import { useState } from "react"

interface ScenarioCardProps {
  scenario: Scenario
  onDelete: () => void
}

export function ScenarioCard({ scenario, onDelete }: ScenarioCardProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`
    return `₹${(value / 1000).toFixed(0)}K`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this scenario?")) return

    setDeleting(true)
    const result = await deleteScenario(scenario.id)

    if (result.success) {
      onDelete()
    } else {
      alert(result.error || "Failed to delete scenario")
    }

    setDeleting(false)
  }

  const handleView = () => {
    // Store scenario in sessionStorage for viewing
    sessionStorage.setItem("viewScenario", JSON.stringify(scenario))
    router.push("/calculator?view=" + scenario.id)
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{scenario.name}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(scenario.updatedAt)}
            </CardDescription>
          </div>
          <Badge variant={scenario.output.isGoalAchievable ? "default" : "destructive"}>
            {scenario.output.isGoalAchievable ? (
              <CheckCircle2 className="h-3 w-3 mr-1" />
            ) : (
              <AlertCircle className="h-3 w-3 mr-1" />
            )}
            {scenario.output.isGoalAchievable ? "On Track" : "Shortfall"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Retirement Age</p>
            <p className="text-lg font-semibold">{scenario.input.retirementAge} years</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Monthly SIP</p>
            <p className="text-lg font-semibold">{formatCurrency(scenario.input.monthlySIP)}</p>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Required Corpus</span>
            <span className="font-semibold">{formatCurrency(scenario.output.requiredCorpus)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Achieved Corpus</span>
            <span className="font-semibold text-primary flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {formatCurrency(scenario.output.achievedCorpus)}
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={handleView} className="flex-1">
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
          <Button variant="destructive" size="icon" onClick={handleDelete} disabled={deleting}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
