import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import type { Document } from 'mongodb'
import { getCurrentUser } from '@/lib/auth'

type ScenarioDoc = Document & {
  _id?: any
  id: string
  name: string
  userId: string
  input: any
  output: any
  createdAt: string
  updatedAt: string
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    if (!userId) return NextResponse.json({ scenarios: [] }, { status: 200 })
    const col = await getCollection<ScenarioDoc>('futureFunds')
    // Ensure collection exists and basic index is present (auto-creates collection on first run)
    await col.createIndex({ userId: 1, id: 1 })
    const docs = await col.find({ userId }).sort({ updatedAt: -1 }).toArray()
    return NextResponse.json({ scenarios: docs }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch scenarios' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, input, output, userId } = body || {}
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (!name || !input || !output) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    const scenario: ScenarioDoc = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      userId,
      input,
      output,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const col = await getCollection<ScenarioDoc>('futureFunds')
    // Ensure collection exists and basic index is present (auto-creates collection on first run)
    await col.createIndex({ userId: 1, id: 1 })
    await col.insertOne(scenario)
    return NextResponse.json({ scenario }, { status: 201 })
  } catch (err: any) {
    console.error('POST /api/scenarios error:', err)
    const message = err?.message || 'Failed to save scenario'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')
    if (!id || !userId) {
      return NextResponse.json({ error: 'Missing id or userId' }, { status: 400 })
    }
    const col = await getCollection<ScenarioDoc>('futureFunds')
    const result = await col.deleteOne({ id, userId })
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Scenario not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err: any) {
    console.error('DELETE /api/scenarios error:', err)
    return NextResponse.json({ error: err?.message || 'Failed to delete scenario' }, { status: 500 })
  }
}


