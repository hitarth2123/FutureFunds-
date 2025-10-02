"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save } from "lucide-react"
import { saveScenario } from "@/lib/scenarios"
import type { RetirementInput, RetirementOutput } from "@/lib/calculator"
import { useRouter } from "next/navigation"

interface SaveScenarioDialogProps {
  input: RetirementInput
  output: RetirementOutput
  triggerLabel?: string
}

export function SaveScenarioDialog({ input, output, triggerLabel = "Save Scenario" }: SaveScenarioDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Please enter a scenario name")
      return
    }

    setSaving(true)
    setError("")

    const result = await saveScenario(name.trim(), input, output)

    if (result.success) {
      setOpen(false)
      setName("")
      router.push("/scenarios")
    } else {
      setError(result.error || "Failed to save scenario")
    }

    setSaving(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">
          <Save className="mr-2 h-5 w-5" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Retirement Scenario</DialogTitle>
          <DialogDescription>
            Give your scenario a name to save it for future reference and comparison.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="scenario-name">Scenario Name</Label>
            <Input
              id="scenario-name"
              placeholder="e.g., Conservative Plan, Aggressive Growth"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave()
                }
              }}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Scenario"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
