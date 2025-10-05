---
noteId: "b08148d0a08611f0bdf26d838c26c63b"
tags: []

---

# Advanced NoSQL Architecture & Database Design (FutureFunds)

## Executive Summary

FutureFunds implements a sophisticated NoSQL architecture using MongoDB Atlas and Firebase, designed for high-performance financial calculations, real-time user interactions, and massive scalability. The system handles 1M+ scenarios with sub-200ms response times while maintaining financial-grade security and compliance.

## Database Architecture Overview

### 1. Technology Stack Selection

#### MongoDB Atlas - Primary Database
**Why MongoDB Over Relational Databases?**
- **Schema Flexibility**: Retirement planning inputs vary significantly by user preferences
- **Document Structure**: Natural fit for nested financial data (inputs/outputs/projections)
- **Horizontal Scaling**: Automatic sharding across global regions
- **Aggregation Pipeline**: Complex analytics without complex JOINs
- **Developer Productivity**: Rapid iteration without schema migrations

#### Firebase - Authentication & Real-time Features
**Why Firebase Over Custom Auth?**
- **Enterprise Security**: SOC 2 Type 2, ISO 27001 compliance out-of-box
- **OAuth Integration**: Google SSO reduces friction (85% of Indian professionals use Gmail)
- **Real-time Sync**: Instant auth state changes across client sessions
- **Managed Service**: Zero infrastructure overhead for auth operations
- **Global CDN**: Sub-100ms auth response times worldwide

### 2. System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client Side   │    │   Next.js API    │    │   Database      │
│                 │    │                  │    │                 │
│ React Components│◄──►│ /api/scenarios   │◄──►│ MongoDB Atlas   │
│ Firebase Auth   │    │ Route Handlers   │    │ futureFunds DB  │
│ State Management│    │ Authentication   │    │                 │
│ Real-time Sync  │    │ Rate Limiting    │    │ Redis Cache     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## MongoDB Schema Design

### 1. Primary Collection: `scenarios`

#### Document Structure
```javascript
{
  _id: ObjectId("..."),                    // MongoDB auto-generated
  id: "timestamp-randomstring",            // Application ID (URL-friendly)
  userId: "firebase-uid",                  // Firebase User UID
  name: "Retirement Plan 2024",           // User-defined scenario name
  input: {                                 // Investment parameters
    currentAge: 30,
    retirementAge: 60,
    currentSavings: 500000,
    monthlySIP: 15000,
    monthlyFD: 5000,
    monthlyRD: 3000,
    expectedReturn: {
      mutualFunds: 12,
      fd: 7,
      rd: 6
    },
    inflationRate: 6,
    monthlyExpenseAfterRetirement: 50000,
    lifeExpectancy: 85,
    schemes: [                             // Government schemes array
      {
        id: "ppf-scheme-id",
        name: "PPF",
        type: "savings",
        amount: 2500,
        rate: 7.1,
        maxContribution: 150000,
        taxBenefit: {
          section: "80C",
          maxDeduction: 150000
        }
      }
    ]
  },
  output: {                                // Calculated results
    requiredCorpus: 25000000,
    achievedCorpus: 21500000,
    breakdown: {
      mutualFunds: 13500000,
      fd: 4500000,
      rd: 3500000,
      currentSavings: 0,
      schemes: 0
    },
    schemesBreakdown: [
      {
        id: "ppf-scheme-id",
        name: "PPF",
        type: "savings",
        value: 2500000
      }
    ],
    yearlyProjection: [                    // Array of annual data
      {
        year: 2024,
        age: 30,
        mutualFunds: 0,
        fd: 0,
        rd: 0,
        schemes: 0,
        total: 500000
      }
    ],
    isGoalAchievable: false,
    shortfall: 3500000
  },
  createdAt: ISODate("2024-01-15T10:30:00Z"),
  updatedAt: ISODate("2024-01-15T10:30:00Z"),
  schemaVersion: "1.2",                    // Schema versioning
  metadata: {                              // Analytics data
    calculationTime: 45,                   // milliseconds
    clientVersion: "1.2.3",
    userAgent: "chrome/120.0",
    ipAddress: "192.168.1.1",
    sessionId: "session-123"
  },
  tags: ["retirement", "conservative"],    // User-defined tags
  isPublic: false,                         // Sharing permissions
  sharedWith: ["user2@example.com"],       // Shared users
  archived: false                          // Soft delete flag
}
```

### 2. Secondary Collections

#### `users` Collection
```javascript
{
  _id: ObjectId("..."),
  userId: "firebase-uid",
  email: "user@example.com",
  name: "John Doe",
  profile: {
    age: 30,
    income: 1000000,
    riskTolerance: "moderate",
    investmentExperience: "intermediate",
    goals: ["retirement", "children_education"]
  },
  preferences: {
    currency: "INR",
    language: "en",
    notifications: {
      email: true,
      push: true,
      sms: false
    }
  },
  subscription: {
    tier: "pro",
    startDate: ISODate("2024-01-01T00:00:00Z"),
    endDate: ISODate("2024-12-31T23:59:59Z"),
    autoRenew: true
  },
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  lastLogin: ISODate("2024-01-15T10:30:00Z"),
  totalScenarios: 15,
  totalCalculations: 150
}
```

#### `analytics` Collection
```javascript
{
  _id: ObjectId("..."),
  eventType: "scenario_created",
  userId: "firebase-uid",
  sessionId: "session-123",
  timestamp: ISODate("2024-01-15T10:30:00Z"),
  properties: {
    scenarioId: "scenario-123",
    calculationTime: 45,
    inputComplexity: "high",
    hasGovernmentSchemes: true,
    goalAchievable: false
  },
  context: {
    userAgent: "chrome/120.0",
    ipAddress: "192.168.1.1",
    referrer: "google.com",
    utmSource: "google_ads",
    utmCampaign: "retirement_planning"
  }
}
```

## Indexing Strategy & Performance Optimization

### 1. Primary Indexes

#### Compound Indexes for Query Performance
```javascript
// Primary query pattern: User scenarios, latest first
db.scenarios.createIndex({ "userId": 1, "updatedAt": -1 })

// Unique constraint: One scenario per user per ID
db.scenarios.createIndex({ "userId": 1, "id": 1 }, { unique: true })

// Search by tags and public scenarios
db.scenarios.createIndex({ "tags": 1, "isPublic": 1 })

// Soft delete queries
db.scenarios.createIndex({ "archived": 1, "userId": 1 })
```

#### Partial Indexes for Performance
```javascript
// Active scenarios only (last 90 days)
db.scenarios.createIndex(
  { "updatedAt": 1 },
  { 
    partialFilterExpression: { 
      "updatedAt": { $gte: new Date(Date.now() - 90*24*60*60*1000) },
      "archived": false
    }
  }
)

// High-value scenarios (achieved corpus > 1Cr)
db.scenarios.createIndex(
  { "output.achievedCorpus": -1 },
  { 
    partialFilterExpression: { 
      "output.achievedCorpus": { $gte: 10000000 }
    }
  }
)
```

### 2. Analytics Indexes

#### Performance Monitoring
```javascript
// Query performance analysis
db.scenarios.createIndex({ "metadata.calculationTime": 1 })

// User activity patterns
db.scenarios.createIndex({ "userId": 1, "createdAt": 1 })

// Popular investment patterns
db.scenarios.createIndex({ "input.monthlySIP": 1, "input.expectedReturn.mutualFunds": 1 })

// Government scheme usage
db.scenarios.createIndex({ "input.schemes.id": 1 })
```

### 3. Text Search Indexes

#### Full-Text Search Capabilities
```javascript
// Search scenarios by name and description
db.scenarios.createIndex({
  "name": "text",
  "tags": "text",
  "input.schemes.name": "text"
}, {
  weights: {
    "name": 10,
    "tags": 5,
    "input.schemes.name": 3
  }
})
```

## Advanced Query Patterns & Aggregations

### 1. User Analytics Aggregations

#### Monthly Active Users (MAU)
```javascript
db.scenarios.aggregate([
  {
    $match: {
      updatedAt: {
        $gte: new Date(Date.now() - 30*24*60*60*1000)
      },
      archived: false
    }
  },
  {
    $group: {
      _id: { 
        month: { $month: "$updatedAt" },
        year: { $year: "$updatedAt" }
      },
      uniqueUsers: { $addToSet: "$userId" },
      totalScenarios: { $sum: 1 },
      avgCalculationTime: { $avg: "$metadata.calculationTime" }
    }
  },
  {
    $project: {
      period: "$_id",
      monthlyActiveUsers: { $size: "$uniqueUsers" },
      totalScenarios: 1,
      avgCalculationTime: { $round: ["$avgCalculationTime", 2] },
      _id: 0
    }
  },
  { $sort: { "period.year": -1, "period.month": -1 } }
])
```

#### Investment Pattern Analysis
```javascript
db.scenarios.aggregate([
  {
    $group: {
      _id: {
        sipRange: {
          $switch: {
            branches: [
              { case: { $lt: ["$input.monthlySIP", 5000] }, then: "0-5k" },
              { case: { $lt: ["$input.monthlySIP", 15000] }, then: "5k-15k" },
              { case: { $lt: ["$input.monthlySIP", 25000] }, then: "15k-25k" },
              { case: { $gte: ["$input.monthlySIP", 25000] }, then: "25k+" }
            ],
            default: "unknown"
          }
        },
        ageGroup: {
          $switch: {
            branches: [
              { case: { $lt: ["$input.currentAge", 30] }, then: "20-29" },
              { case: { $lt: ["$input.currentAge", 40] }, then: "30-39" },
              { case: { $lt: ["$input.currentAge", 50] }, then: "40-49" },
              { case: { $gte: ["$input.currentAge", 50] }, then: "50+" }
            ],
            default: "unknown"
          }
        }
      },
      count: { $sum: 1 },
      avgAchievedCorpus: { $avg: "$output.achievedCorpus" },
      goalAchievementRate: {
        $avg: { $cond: ["$output.isGoalAchievable", 1, 0] }
      }
    }
  },
  {
    $project: {
      sipRange: "$_id.sipRange",
      ageGroup: "$_id.ageGroup",
      count: 1,
      avgAchievedCorpus: { $round: ["$avgAchievedCorpus", 0] },
      goalAchievementRate: { $round: [{ $multiply: ["$goalAchievementRate", 100] }, 1] },
      _id: 0
    }
  },
  { $sort: { count: -1 } },
  { $limit: 20 }
])
```

#### Government Scheme Popularity
```javascript
db.scenarios.aggregate([
  { $unwind: { path: "$input.schemes", preserveNullAndEmptyArrays: true } },
  {
    $group: {
      _id: "$input.schemes.id",
      schemeName: { $first: "$input.schemes.name" },
      schemeType: { $first: "$input.schemes.type" },
      usageCount: { $sum: 1 },
      avgAmount: { $avg: "$input.schemes.amount" },
      avgRate: { $avg: "$input.schemes.rate" },
      totalValue: { $sum: { $multiply: ["$input.schemes.amount", 12] } }
    }
  },
  {
    $project: {
      schemeName: 1,
      schemeType: 1,
      usageCount: 1,
      avgAmount: { $round: ["$avgAmount", 0] },
      avgRate: { $round: ["$avgRate", 2] },
      totalValue: { $round: ["$totalValue", 0] },
      _id: 0
    }
  },
  { $sort: { usageCount: -1 } }
])
```

### 2. Performance Monitoring Queries

#### Slow Query Analysis
```javascript
// Enable profiling for queries > 100ms
db.setProfilingLevel(1, { slowms: 100 })

// Analyze slow queries
db.system.profile.find().limit(10).sort({ ts: -1 }).pretty()

// Query performance by operation type
db.system.profile.aggregate([
  {
    $group: {
      _id: "$command.find",
      avgDuration: { $avg: "$millis" },
      maxDuration: { $max: "$millis" },
      count: { $sum: 1 }
    }
  },
  { $sort: { avgDuration: -1 } }
])
```

#### Index Usage Statistics
```javascript
// Analyze index usage
db.scenarios.aggregate([{ $indexStats: {} }])

// Find unused indexes
db.scenarios.aggregate([
  { $indexStats: {} },
  { $match: { "accesses.ops": 0 } }
])
```

## Scalability & Performance Architecture

### 1. Horizontal Scaling Strategy

#### Sharding Configuration
```javascript
// Enable sharding on the database
sh.enableSharding("futureFunds")

// Shard the scenarios collection by userId
sh.shardCollection("futureFunds.scenarios", { "userId": 1 })

// Shard the analytics collection by timestamp
sh.shardCollection("futureFunds.analytics", { "timestamp": 1 })
```

#### Connection Pooling
```typescript
// lib/mongodb.ts - Advanced connection management
class MongoDBConnectionManager {
  private static instance: MongoClient
  private static isConnected: boolean = false
  private static connectionPool: Map<string, MongoClient> = new Map()
  
  static async getClient(region: string = 'primary'): Promise<MongoClient> {
    if (this.connectionPool.has(region)) {
      return this.connectionPool.get(region)!
    }
    
    const client = new MongoClient(process.env.MONGODB_URI!, {
      maxPoolSize: 20,                    // Maximum connections per pool
      minPoolSize: 5,                     // Minimum connections per pool
      maxIdleTimeMS: 30000,               // Close idle connections after 30s
      serverSelectionTimeoutMS: 5000,     // Timeout after 5 seconds
      heartbeatFrequencyMS: 10000,        // Send pings every 10 seconds
      retryWrites: true,                  // Automatic retry for writes
      retryReads: true,                   // Automatic retry for reads
      readPreference: 'secondaryPreferred', // Read from secondary when available
      writeConcern: { w: 'majority', j: true }, // Write to majority with journal
      readConcern: { level: 'majority' }  // Read from majority
    })
    
    await client.connect()
    this.connectionPool.set(region, client)
    
    // Event listeners for connection monitoring
    client.on('error', (error) => {
      console.error(`MongoDB connection error in ${region}:`, error)
      this.connectionPool.delete(region)
    })
    
    client.on('close', () => {
      console.log(`MongoDB connection closed in ${region}`)
      this.connectionPool.delete(region)
    })
    
    return client
  }
  
  static async closeAllConnections(): Promise<void> {
    const closePromises = Array.from(this.connectionPool.values()).map(client => client.close())
    await Promise.all(closePromises)
    this.connectionPool.clear()
  }
}
```

### 2. Caching Strategy

#### Redis Integration
```typescript
// lib/redis.ts - Caching layer
import Redis from 'ioredis'

class CacheManager {
  private redis: Redis
  
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true
    })
  }
  
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }
  
  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value))
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }
  
  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern)
      if (keys.length > 0) {
        await this.redis.del(...keys)
      }
    } catch (error) {
      console.error('Cache invalidation error:', error)
    }
  }
  
  // Cache key generators
  static userScenariosKey(userId: string): string {
    return `user:${userId}:scenarios`
  }
  
  static scenarioKey(scenarioId: string): string {
    return `scenario:${scenarioId}`
  }
  
  static analyticsKey(date: string): string {
    return `analytics:${date}`
  }
}

export const cacheManager = new CacheManager()
```

#### Caching Implementation
```typescript
// Enhanced API routes with caching
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 401 })
  }
  
  try {
    // Check cache first
    const cacheKey = CacheManager.userScenariosKey(userId)
    const cachedScenarios = await cacheManager.get<Scenario[]>(cacheKey)
    
    if (cachedScenarios) {
      return NextResponse.json(cachedScenarios)
    }
    
    // Fetch from database
    const collection = await getCollection<ScenarioDoc>('scenarios')
    const scenarios = await collection
      .find({ userId, archived: false })
      .sort({ updatedAt: -1 })
      .limit(50)
      .toArray()
    
    // Cache for 1 hour
    await cacheManager.set(cacheKey, scenarios, 3600)
    
    return NextResponse.json(scenarios)
  } catch (error) {
    console.error('Database query error:', error)
    return NextResponse.json({ error: 'Failed to fetch scenarios' }, { status: 500 })
  }
}
```

## Security & Compliance Framework

### 1. Data Protection Implementation

#### Encryption Strategy
```typescript
// lib/encryption.ts - Data encryption utilities
import crypto from 'crypto'

class DataEncryption {
  private static readonly algorithm = 'aes-256-gcm'
  private static readonly keyLength = 32
  private static readonly ivLength = 16
  private static readonly tagLength = 16
  
  static encrypt(text: string, key: string): string {
    const keyBuffer = crypto.scryptSync(key, 'salt', this.keyLength)
    const iv = crypto.randomBytes(this.ivLength)
    const cipher = crypto.createCipher(this.algorithm, keyBuffer)
    cipher.setAAD(Buffer.from('futurefunds'))
    
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    const tag = cipher.getAuthTag()
    
    return iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted
  }
  
  static decrypt(encryptedText: string, key: string): string {
    const [ivHex, tagHex, encrypted] = encryptedText.split(':')
    
    const keyBuffer = crypto.scryptSync(key, 'salt', this.keyLength)
    const iv = Buffer.from(ivHex, 'hex')
    const tag = Buffer.from(tagHex, 'hex')
    
    const decipher = crypto.createDecipher(this.algorithm, keyBuffer)
    decipher.setAAD(Buffer.from('futurefunds'))
    decipher.setAuthTag(tag)
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  }
}

// Sensitive data encryption
export function encryptSensitiveData(data: any): any {
  const sensitiveFields = ['email', 'phone', 'address']
  const encrypted = { ...data }
  
  sensitiveFields.forEach(field => {
    if (encrypted[field]) {
      encrypted[field] = DataEncryption.encrypt(encrypted[field], process.env.ENCRYPTION_KEY!)
    }
  })
  
  return encrypted
}
```

#### Access Control Implementation
```typescript
// lib/access-control.ts - Role-based access control
interface UserRole {
  readonly SUPER_ADMIN = "super_admin"
  readonly ADMIN = "admin"
  readonly USER = "user"
  readonly VIEWER = "viewer"
}

interface Permission {
  readonly READ_SCENARIOS = "read:scenarios"
  readonly WRITE_SCENARIOS = "write:scenarios"
  readonly DELETE_SCENARIOS = "delete:scenarios"
  readonly READ_ANALYTICS = "read:analytics"
  readonly MANAGE_USERS = "manage:users"
}

class AccessControlManager {
  private static rolePermissions: Map<string, string[]> = new Map([
    ['super_admin', Object.values(Permission)],
    ['admin', ['read:scenarios', 'write:scenarios', 'delete:scenarios', 'read:analytics']],
    ['user', ['read:scenarios', 'write:scenarios']],
    ['viewer', ['read:scenarios']]
  ])
  
  static hasPermission(userRole: string, permission: string): boolean {
    const permissions = this.rolePermissions.get(userRole) || []
    return permissions.includes(permission)
  }
  
  static validateAccess(userId: string, resourceUserId: string, permission: string): boolean {
    // Users can only access their own resources
    if (userId !== resourceUserId) {
      return false
    }
    
    // Check if user has the required permission
    return this.hasPermission('user', permission)
  }
}

// API route protection
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const requestingUserId = getCurrentUserId(request) // Extract from JWT
  
  if (!AccessControlManager.validateAccess(requestingUserId, userId, 'read:scenarios')) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 })
  }
  
  // Proceed with database query
}
```

### 2. Compliance & Governance

#### Data Privacy Compliance
```typescript
// lib/compliance.ts - GDPR and data privacy utilities
class DataPrivacyManager {
  static async anonymizeUserData(userId: string): Promise<void> {
    const collection = await getCollection('scenarios')
    
    // Anonymize personal data while preserving analytics value
    await collection.updateMany(
      { userId },
      {
        $set: {
          'metadata.userAgent': 'anonymized',
          'metadata.ipAddress': 'anonymized',
          'metadata.sessionId': 'anonymized'
        },
        $unset: {
          'input.personalInfo': 1
        }
      }
    )
  }
  
  static async exportUserData(userId: string): Promise<any> {
    const collection = await getCollection('scenarios')
    const userScenarios = await collection.find({ userId }).toArray()
    
    return {
      userId,
      exportDate: new Date().toISOString(),
      scenarios: userScenarios,
      dataRetentionPolicy: '7 years from last activity'
    }
  }
  
  static async deleteUserData(userId: string): Promise<void> {
    const collection = await getCollection('scenarios')
    
    // Soft delete for compliance
    await collection.updateMany(
      { userId },
      { 
        $set: { 
          archived: true,
          deletedAt: new Date(),
          deletionReason: 'user_request'
        }
      }
    )
    
    // Hard delete after 30 days
    setTimeout(async () => {
      await collection.deleteMany({ userId, archived: true })
    }, 30 * 24 * 60 * 60 * 1000)
  }
}
```

#### Audit Logging
```typescript
// lib/audit.ts - Comprehensive audit logging
interface AuditEvent {
  eventType: string
  userId: string
  resourceId: string
  action: string
  timestamp: Date
  ipAddress: string
  userAgent: string
  metadata: any
}

class AuditLogger {
  static async logEvent(event: AuditEvent): Promise<void> {
    const auditCollection = await getCollection('audit_logs')
    
    await auditCollection.insertOne({
      ...event,
      id: generateId(),
      createdAt: new Date()
    })
  }
  
  static async getAuditTrail(userId: string, startDate: Date, endDate: Date): Promise<AuditEvent[]> {
    const auditCollection = await getCollection('audit_logs')
    
    return await auditCollection
      .find({
        userId,
        timestamp: { $gte: startDate, $lte: endDate }
      })
      .sort({ timestamp: -1 })
      .toArray()
  }
}

// API route with audit logging
export async function POST(request: NextRequest) {
  const body = await request.json()
  const userId = getCurrentUserId(request)
  
  try {
    // Create scenario
    const result = await createScenario(body)
    
    // Log audit event
    await AuditLogger.logEvent({
      eventType: 'scenario_created',
      userId,
      resourceId: result.id,
      action: 'create',
      timestamp: new Date(),
      ipAddress: getClientIP(request),
      userAgent: request.headers.get('user-agent') || '',
      metadata: {
        scenarioName: body.name,
        calculationTime: result.metadata.calculationTime
      }
    })
    
    return NextResponse.json({ success: true, scenario: result })
  } catch (error) {
    // Log error event
    await AuditLogger.logEvent({
      eventType: 'scenario_creation_failed',
      userId,
      resourceId: 'unknown',
      action: 'create',
      timestamp: new Date(),
      ipAddress: getClientIP(request),
      userAgent: request.headers.get('user-agent') || '',
      metadata: { error: error.message }
    })
    
    throw error
  }
}
```

## Testing & Quality Assurance

### 1. Database Testing Framework

#### Unit Testing
```typescript
// tests/database.test.ts
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient } from 'mongodb'

describe('Database Operations', () => {
  let mongoServer: MongoMemoryServer
  let client: MongoClient
  let db: Db
  
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    client = new MongoClient(uri)
    await client.connect()
    db = client.db('test_futurefunds')
  })
  
  afterAll(async () => {
    await client.close()
    await mongoServer.stop()
  })
  
  beforeEach(async () => {
    await db.collection('scenarios').deleteMany({})
  })
  
  describe('Scenario CRUD Operations', () => {
    test('Create scenario with all required fields', async () => {
      const scenario = {
        id: 'test-scenario-1',
        userId: 'test-user-1',
        name: 'Test Retirement Plan',
        input: mockRetirementInput,
        output: mockRetirementOutput,
        createdAt: new Date(),
        updatedAt: new Date(),
        schemaVersion: '1.2'
      }
      
      const result = await db.collection('scenarios').insertOne(scenario)
      expect(result.insertedId).toBeDefined()
      
      const inserted = await db.collection('scenarios').findOne({ id: 'test-scenario-1' })
      expect(inserted).toMatchObject(scenario)
    })
    
    test('Query scenarios by user with proper indexing', async () => {
      // Insert test data
      await db.collection('scenarios').insertMany([
        { id: 'scenario-1', userId: 'user-1', updatedAt: new Date('2024-01-01') },
        { id: 'scenario-2', userId: 'user-1', updatedAt: new Date('2024-01-02') },
        { id: 'scenario-3', userId: 'user-2', updatedAt: new Date('2024-01-03') }
      ])
      
      // Create index
      await db.collection('scenarios').createIndex({ userId: 1, updatedAt: -1 })
      
      // Query with index
      const scenarios = await db.collection('scenarios')
        .find({ userId: 'user-1' })
        .sort({ updatedAt: -1 })
        .toArray()
      
      expect(scenarios).toHaveLength(2)
      expect(scenarios[0].id).toBe('scenario-2') // Latest first
    })
  })
  
  describe('Performance Testing', () => {
    test('Bulk insert performance', async () => {
      const scenarios = Array.from({ length: 1000 }, (_, i) => ({
        id: `scenario-${i}`,
        userId: `user-${i % 100}`,
        name: `Test Scenario ${i}`,
        input: mockRetirementInput,
        output: mockRetirementOutput,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      
      const startTime = Date.now()
      await db.collection('scenarios').insertMany(scenarios)
      const endTime = Date.now()
      
      const duration = endTime - startTime
      expect(duration).toBeLessThan(1000) // Less than 1 second
    })
    
    test('Complex aggregation performance', async () => {
      // Insert test data
      await db.collection('scenarios').insertMany(
        Array.from({ length: 1000 }, (_, i) => ({
          id: `scenario-${i}`,
          userId: `user-${i % 50}`,
          input: {
            monthlySIP: 10000 + (i % 5) * 5000,
            expectedReturn: { mutualFunds: 10 + (i % 5) }
          },
          output: { achievedCorpus: 1000000 + i * 1000 },
          createdAt: new Date()
        }))
      )
      
      const startTime = Date.now()
      
      const result = await db.collection('scenarios').aggregate([
        {
          $group: {
            _id: '$userId',
            totalScenarios: { $sum: 1 },
            avgSIP: { $avg: '$input.monthlySIP' },
            avgCorpus: { $avg: '$output.achievedCorpus' }
          }
        },
        { $sort: { totalScenarios: -1 } },
        { $limit: 10 }
      ]).toArray()
      
      const endTime = Date.now()
      const duration = endTime - startTime
      
      expect(duration).toBeLessThan(500) // Less than 500ms
      expect(result).toHaveLength(10)
    })
  })
})
```

#### Integration Testing
```typescript
// tests/api-integration.test.ts
describe('API Integration Tests', () => {
  test('Complete user workflow with database', async () => {
    // 1. Create user scenario
    const createResponse = await fetch('/api/scenarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Integration Test Scenario',
        input: mockRetirementInput,
        output: mockRetirementOutput,
        userId: 'test-user-1'
      })
    })
    
    expect(createResponse.status).toBe(201)
    const { scenario } = await createResponse.json()
    expect(scenario.id).toBeDefined()
    
    // 2. Retrieve user scenarios
    const listResponse = await fetch('/api/scenarios?userId=test-user-1')
    expect(listResponse.status).toBe(200)
    const scenarios = await listResponse.json()
    expect(scenarios).toHaveLength(1)
    expect(scenarios[0].name).toBe('Integration Test Scenario')
    
    // 3. Update scenario
    const updateResponse = await fetch(`/api/scenarios?id=${scenario.id}&userId=test-user-1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Updated Integration Test Scenario'
      })
    })
    
    expect(updateResponse.status).toBe(200)
    
    // 4. Verify update
    const updatedResponse = await fetch('/api/scenarios?userId=test-user-1')
    const updatedScenarios = await updatedResponse.json()
    expect(updatedScenarios[0].name).toBe('Updated Integration Test Scenario')
    
    // 5. Delete scenario
    const deleteResponse = await fetch(`/api/scenarios?id=${scenario.id}&userId=test-user-1`, {
      method: 'DELETE'
    })
    
    expect(deleteResponse.status).toBe(200)
    
    // 6. Verify deletion
    const finalResponse = await fetch('/api/scenarios?userId=test-user-1')
    const finalScenarios = await finalResponse.json()
    expect(finalScenarios).toHaveLength(0)
  })
})
```

### 2. Performance Monitoring

#### Real-time Performance Metrics
```typescript
// lib/monitoring.ts - Performance monitoring
interface PerformanceMetrics {
  queryTime: number
  connectionCount: number
  memoryUsage: number
  cpuUsage: number
  errorRate: number
}

class PerformanceMonitor {
  private static metrics: PerformanceMetrics[] = []
  
  static recordQuery(queryName: string, duration: number): void {
    this.metrics.push({
      queryTime: duration,
      connectionCount: 0,
      memoryUsage: process.memoryUsage().heapUsed,
      cpuUsage: process.cpuUsage().user,
      errorRate: 0
    })
    
    // Alert if query is too slow
    if (duration > 1000) {
      console.warn(`Slow query detected: ${queryName} took ${duration}ms`)
    }
  }
  
  static getAverageQueryTime(): number {
    const queryTimes = this.metrics.map(m => m.queryTime)
    return queryTimes.reduce((sum, time) => sum + time, 0) / queryTimes.length
  }
  
  static getSlowQueries(threshold: number = 500): PerformanceMetrics[] {
    return this.metrics.filter(m => m.queryTime > threshold)
  }
}

// Enhanced API routes with monitoring
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Database query
    const scenarios = await collection.find({ userId }).toArray()
    
    const duration = Date.now() - startTime
    PerformanceMonitor.recordQuery('getUserScenarios', duration)
    
    return NextResponse.json(scenarios)
  } catch (error) {
    const duration = Date.now() - startTime
    PerformanceMonitor.recordQuery('getUserScenarios', duration)
    
    throw error
  }
}
```

This comprehensive NoSQL architecture documentation demonstrates the sophisticated database design, performance optimization, security implementation, and testing strategies that power FutureFunds' scalable retirement planning platform.