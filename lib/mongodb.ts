import { MongoClient, ServerApiVersion, Db, Collection, type Document } from 'mongodb'

let cachedClient: MongoClient | null = null
let cachedClientPromise: Promise<MongoClient> | null = null
let cachedDb: Db | null = null

async function getMongoClient(): Promise<MongoClient> {
  if (cachedClient) return cachedClient
  if (cachedClientPromise) return cachedClientPromise
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('Missing MONGODB_URI environment variable')
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  })
  cachedClientPromise = client.connect().then((c) => {
    cachedClient = c
    return c
  })
  return cachedClientPromise
}

export async function getMongoDb(): Promise<Db> {
  if (cachedDb) return cachedDb
  let dbName = process.env.MONGODB_DB
  if (!dbName) {
    const uri = process.env.MONGODB_URI!
    try {
      const url = new URL(uri)
      const path = url.pathname || ''
      const candidate = path.startsWith('/') ? path.slice(1) : path
      dbName = candidate || ''
    } catch {
      dbName = ''
    }
  }
  if (!dbName) {
    // Fallback to a sensible default to avoid crashes in local/Atlas setups
    dbName = 'futureFunds'
  }
  const client = await getMongoClient()
  cachedDb = client.db(dbName)
  return cachedDb
}

export async function getCollection<TSchema extends Document = Document>(name: string): Promise<Collection<TSchema>> {
  const db = await getMongoDb()
  return db.collection<TSchema>(name)
}


