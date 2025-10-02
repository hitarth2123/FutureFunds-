"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getUserScenarios, deleteScenario } from "@/lib/scenarios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"

export default function ScenariosPage() {
  const router = useRouter()
  const [user, setUser] = useState(getCurrentUser())
  const [loading, setLoading] = useState(true)
  const [scenarios, setScenarios] = useState<any[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/auth")
      return
    }
    let mounted = true
    ;(async () => {
      const data = await getUserScenarios()
      if (mounted) {
        setScenarios(data)
        setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [user, router])

  if (!user) {
    return null
  }

  if (loading) return null

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4 -ml-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-4xl font-bold mb-2">My Scenarios</h1>
        <p className="text-muted-foreground">View and manage your retirement planning scenarios</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {scenarios.length === 0 && (
          <Card className="md:col-span-2 lg:col-span-3 border-dashed">
            <CardHeader>
              <CardTitle className="text-xl">No scenarios yet</CardTitle>
              <CardDescription>Create your first scenario to get started.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push("/calculator")}>
                Create New Scenario
              </Button>
            </CardContent>
          </Card>
        )}
        {scenarios.map((scenario: any) => (
          <Card key={scenario.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl">{scenario.name}</CardTitle>
                <Badge variant="secondary">saved</Badge>
              </div>
              <CardDescription>Updated on {new Date(scenario.updatedAt).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Target Corpus:</span>
                  <span className="font-medium">₹{(scenario.input?.targetCorpus || 0) / 10000000}Cr</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => router.push(`/calculator?view=${encodeURIComponent(scenario.id)}`)}
                >
                  View Details
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1"
                  onClick={() => router.push(`/calculator?edit=${encodeURIComponent(scenario.id)}`)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={async () => {
                    if (!confirm('Delete this scenario?')) return
                    setDeletingId(scenario.id)
                    const res = await deleteScenario(scenario.id)
                    if (res.success) {
                      setScenarios((prev) => prev.filter((s) => s.id !== scenario.id))
                    } else {
                      alert(res.error || 'Failed to delete')
                    }
                    setDeletingId(null)
                  }}
                  disabled={deletingId === scenario.id}
                >
                  {deletingId === scenario.id ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="border-dashed hover:border-solid hover:shadow-lg transition-all cursor-pointer">
          <CardHeader className="h-full flex items-center justify-center">
            <Button
              variant="ghost"
              className="h-full w-full flex flex-col gap-2"
              onClick={() => router.push("/calculator")}
            >
              <div className="text-4xl">+</div>
              <CardTitle className="text-xl">Create New Scenario</CardTitle>
              <CardDescription>Start planning a new retirement strategy</CardDescription>
            </Button>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
