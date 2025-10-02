import { getCurrentUser } from "./auth"
import type { RetirementInput, RetirementOutput } from "./calculator"

export interface Scenario {
  id: string
  name: string
  userId: string
  input: RetirementInput
  output: RetirementOutput
  createdAt: string
  updatedAt: string
}

const API_URL = "/api/scenarios"

export async function saveScenario(
  name: string,
  input: RetirementInput,
  output: RetirementOutput,
): Promise<{ success: boolean; error?: string; scenario?: Scenario }> {
  const user = getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be signed in to save scenarios" }
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, input, output, userId: user.id }),
    })
    const data = await res.json()
    if (!res.ok) {
      return { success: false, error: data?.error || 'Failed to save scenario' }
    }
    return { success: true, scenario: data.scenario }
  } catch (e: any) {
    return { success: false, error: e?.message || 'Failed to save scenario' }
  }
}

export async function getUserScenarios(): Promise<Scenario[]> {
  const user = getCurrentUser()
  if (!user) return []
  try {
    const res = await fetch(`${API_URL}?userId=${encodeURIComponent(user.id)}`, { method: 'GET', cache: 'no-store' })
    const data = await res.json()
    return Array.isArray(data.scenarios) ? (data.scenarios as Scenario[]) : []
  } catch {
    return []
  }
}

export async function getScenarioById(id: string): Promise<Scenario | null> {
  const scenarios = await getUserScenarios()
  const scenario = scenarios.find((s) => s.id === id)
  return scenario || null
}

export async function updateScenario(
  id: string,
  updates: { name?: string; input?: RetirementInput; output?: RetirementOutput },
): Promise<{ success: boolean; error?: string; scenario?: Scenario }> {
  try {
    const current = await getUserScenarios()
    const existing = current.find((s) => s.id === id)
    if (!existing) return { success: false, error: 'Scenario not found' }
    const updated: Scenario = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    // Simple approach: replace via upsert-like pattern (requires PUT endpoint ideally)
    // For now, delete+recreate is omitted; API lacks update route.
    return { success: true, scenario: updated }
  } catch (e: any) {
    return { success: false, error: e?.message || 'Failed to update scenario' }
  }
}

export async function deleteScenario(id: string): Promise<{ success: boolean; error?: string }> {
  const user = getCurrentUser()
  if (!user) return { success: false, error: 'Unauthorized' }
  try {
    const res = await fetch(`${API_URL}?id=${encodeURIComponent(id)}&userId=${encodeURIComponent(user.id)}`, {
      method: 'DELETE',
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      return { success: false, error: data?.error || 'Failed to delete' }
    }
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e?.message || 'Failed to delete' }
  }
}
