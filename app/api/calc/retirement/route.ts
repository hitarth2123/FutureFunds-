import { type NextRequest, NextResponse } from "next/server"
import { calculateRetirement, type RetirementInput } from "@/lib/calculator"

export async function POST(request: NextRequest) {
  try {
    const body: RetirementInput = await request.json()

    // Validate input
    if (body.currentAge >= body.retirementAge) {
      return NextResponse.json({ error: "Retirement age must be greater than current age" }, { status: 400 })
    }

    if (body.retirementAge >= body.lifeExpectancy) {
      return NextResponse.json({ error: "Life expectancy must be greater than retirement age" }, { status: 400 })
    }

    // Calculate retirement projection
    const result = calculateRetirement(body)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error in retirement calculation:", error)
    return NextResponse.json({ error: "Failed to calculate retirement projection" }, { status: 500 })
  }
}
