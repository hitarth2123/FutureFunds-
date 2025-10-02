import { NextResponse } from "next/server"
import { indianSchemes, fdRates } from "@/lib/schemes"

export async function GET() {
  try {
    return NextResponse.json({
      schemes: indianSchemes,
      fdRates,
    })
  } catch (error) {
    console.error("[v0] Error fetching schemes:", error)
    return NextResponse.json({ error: "Failed to fetch schemes" }, { status: 500 })
  }
}
