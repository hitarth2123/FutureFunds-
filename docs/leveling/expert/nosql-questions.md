---
noteId: "nosql-expert-001"
tags: []

---

# Expert Level - NoSQL Database Design (35 Questions)

## Table of Contents
1. [Advanced Schema Design (Q1-Q7)](#advanced-schema-design-q1-q7)
2. [Query Optimization (Q8-Q14)](#query-optimization-q8-q14)
3. [Indexing Strategies (Q15-Q21)](#indexing-strategies-q15-q21)
4. [Data Modeling Patterns (Q22-Q28)](#data-modeling-patterns-q22-q28)
5. [Performance & Scalability (Q29-Q35)](#performance--scalability-q29-q35)

---

## Advanced Schema Design (Q1-Q7)

### Q1: Design a sophisticated MongoDB schema for a distributed microservices architecture with event-driven communication.

**Answer:**
A comprehensive schema for implementing distributed microservices with event-driven communication:

**Microservice Registry Collection:**
```javascript
// microservice_registry collection
{
  _id: ObjectId("507f1f77bcf86cd799439150"),
  serviceId: "portfolio_service_001",
  serviceName: "portfolio-service",
  version: "1.2.0",
  status: "healthy",
  endpoints: [
    {
      name: "update_portfolio",
      method: "PUT",
      path: "/api/v1/portfolios/{id}",
      rateLimit: 1000,
      timeout: 5000
    },
    {
      name: "get_portfolio",
      method: "GET",
      path: "/api/v1/portfolios/{id}",
      rateLimit: 2000,
      timeout: 3000
    }
  ],
  dependencies: [
    {
      service: "user-service",
      version: "1.1.0",
      required: true
    },
    {
      service: "analytics-service",
      version: "1.0.0",
      required: false
    }
  ],
  health: {
    status: "healthy",
    lastCheck: ISODate("2024-01-15T10:30:00Z"),
    responseTime: 50,
    errorRate: 0.001
  },
  metadata: {
    registeredAt: ISODate("2024-01-01T00:00:00Z"),
    lastUpdated: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Event Bus Collection:**
```javascript
// event_bus collection
{
  _id: ObjectId("507f1f77bcf86cd799439151"),
  eventId: "event_12345",
  eventType: "PortfolioValueUpdated",
  version: "1.0",
  source: "portfolio-service",
  timestamp: ISODate("2024-01-15T10:30:00Z"),
  data: {
    portfolioId: "port_12345",
    userId: "user_12345",
    oldValue: 2400000,
    newValue: 2500000,
    change: 100000,
    changePercentage: 0.0417
  },
  metadata: {
    correlationId: "corr_12345",
    causationId: "causation_12345",
    userId: "user_12345",
    tenantId: "tenant_12345"
  },
  routing: {
    subscribers: [
      {
        service: "analytics-service",
        endpoint: "/events/portfolio-updated",
        status: "delivered",
        deliveredAt: ISODate("2024-01-15T10:30:05Z")
      },
      {
        service: "notification-service",
        endpoint: "/events/portfolio-updated",
        status: "delivered",
        deliveredAt: ISODate("2024-01-15T10:30:03Z")
      }
    ]
  },
  processing: {
    status: "completed",
    processedAt: ISODate("2024-01-15T10:30:10Z"),
    retryCount: 0,
    errorCount: 0
  }
}
```

**Service Communication Collection:**
```javascript
// service_communication collection
{
  _id: ObjectId("507f1f77bcf86cd799439152"),
  communicationId: "comm_12345",
  sourceService: "portfolio-service",
  targetService: "analytics-service",
  type: "http_request",
  method: "POST",
  endpoint: "/api/v1/analytics/update",
  request: {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer token_12345",
      "X-Correlation-ID": "corr_12345"
    },
    body: {
      portfolioId: "port_12345",
      newValue: 2500000,
      timestamp: ISODate("2024-01-15T10:30:00Z")
    }
  },
  response: {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      success: true,
      analyticsId: "analytics_12345"
    }
  },
  timing: {
    startTime: ISODate("2024-01-15T10:30:00Z"),
    endTime: ISODate("2024-01-15T10:30:05Z"),
    duration: 5000
  },
  metadata: {
    correlationId: "corr_12345",
    userId: "user_12345",
    version: 1
  }
}
```

**Circuit Breaker Collection:**
```javascript
// circuit_breaker collection
{
  _id: ObjectId("507f1f77bcf86cd799439153"),
  breakerId: "breaker_12345",
  service: "analytics-service",
  endpoint: "/api/v1/analytics/update",
  state: "closed",
  config: {
    failureThreshold: 5,
    timeout: 30000,
    resetTimeout: 60000
  },
  metrics: {
    totalRequests: 1000,
    successfulRequests: 950,
    failedRequests: 50,
    failureRate: 0.05,
    lastFailure: ISODate("2024-01-15T10:25:00Z"),
    lastSuccess: ISODate("2024-01-15T10:30:00Z")
  },
  stateHistory: [
    {
      state: "closed",
      timestamp: ISODate("2024-01-15T09:00:00Z"),
      reason: "initial"
    },
    {
      state: "open",
      timestamp: ISODate("2024-01-15T10:25:00Z"),
      reason: "failure_threshold_exceeded"
    },
    {
      state: "half_open",
      timestamp: ISODate("2024-01-15T10:26:00Z"),
      reason: "reset_timeout_expired"
    },
    {
      state: "closed",
      timestamp: ISODate("2024-01-15T10:30:00Z"),
      reason: "successful_request"
    }
  ],
  metadata: {
    createdAt: ISODate("2024-01-01T00:00:00Z"),
    updatedAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Indexes for Microservices:**
```javascript
// Microservice registry indexes
db.microservice_registry.createIndex({ "serviceId": 1 }, { unique: true });
db.microservice_registry.createIndex({ "serviceName": 1, "version": 1 });
db.microservice_registry.createIndex({ "status": 1, "health.lastCheck": 1 });

// Event bus indexes
db.event_bus.createIndex({ "eventId": 1 }, { unique: true });
db.event_bus.createIndex({ "eventType": 1, "timestamp": 1 });
db.event_bus.createIndex({ "source": 1, "timestamp": 1 });
db.event_bus.createIndex({ "metadata.correlationId": 1 });

// Service communication indexes
db.service_communication.createIndex({ "communicationId": 1 }, { unique: true });
db.service_communication.createIndex({ "sourceService": 1, "targetService": 1 });
db.service_communication.createIndex({ "metadata.correlationId": 1 });
db.service_communication.createIndex({ "timing.startTime": 1 });

// Circuit breaker indexes
db.circuit_breaker.createIndex({ "breakerId": 1 }, { unique: true });
db.circuit_breaker.createIndex({ "service": 1, "endpoint": 1 });
db.circuit_breaker.createIndex({ "state": 1, "metadata.updatedAt": 1 });
```

---

### Q2: Design a MongoDB schema for implementing CQRS (Command Query Responsibility Segregation) with event sourcing.

**Answer:**
A comprehensive schema for implementing CQRS with event sourcing:

**Command Store Collection:**
```javascript
// command_store collection
{
  _id: ObjectId("507f1f77bcf86cd799439160"),
  commandId: "cmd_12345",
  aggregateId: "portfolio_12345",
  aggregateType: "portfolio",
  commandType: "UpdatePortfolioValue",
  commandData: {
    portfolioId: "portfolio_12345",
    userId: "user_12345",
    newValue: 2500000,
    reason: "market_update",
    timestamp: ISODate("2024-01-15T10:30:00Z")
  },
  status: "completed",
  result: {
    success: true,
    eventId: "event_12345",
    error: null
  },
  metadata: {
    userId: "user_12345",
    correlationId: "corr_12345",
    causationId: "causation_12345",
    timestamp: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Event Store Collection:**
```javascript
// event_store collection
{
  _id: ObjectId("507f1f77bcf86cd799439161"),
  eventId: "event_12345",
  aggregateId: "portfolio_12345",
  aggregateType: "portfolio",
  eventType: "PortfolioValueUpdated",
  eventVersion: 1,
  data: {
    portfolioId: "portfolio_12345",
    userId: "user_12345",
    oldValue: 2400000,
    newValue: 2500000,
    change: 100000,
    changePercentage: 0.0417,
    timestamp: ISODate("2024-01-15T10:30:00Z")
  },
  metadata: {
    correlationId: "corr_12345",
    causationId: "causation_12345",
    userId: "user_12345",
    timestamp: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Read Model Collections:**
```javascript
// portfolio_read_models collection
{
  _id: ObjectId("507f1f77bcf86cd799439162"),
  aggregateId: "portfolio_12345",
  userId: "user_12345",
  name: "Retirement Portfolio",
  type: "retirement",
  currentValue: 2500000,
  previousValue: 2400000,
  dailyChange: 100000,
  dailyChangePercentage: 0.0417,
  assetAllocation: {
    equity: { value: 1500000, percentage: 60 },
    debt: { value: 750000, percentage: 30 },
    gold: { value: 125000, percentage: 5 },
    governmentSchemes: { value: 125000, percentage: 5 }
  },
  performance: {
    totalReturn: 500000,
    returnPercentage: 0.25,
    annualizedReturn: 0.12,
    volatility: 0.18,
    sharpeRatio: 0.67
  },
  lastEventId: "event_12345",
  lastEventVersion: 1,
  metadata: {
    lastUpdated: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Projection Status Collection:**
```javascript
// projection_status collection
{
  _id: ObjectId("507f1f77bcf86cd799439163"),
  projectionId: "proj_12345",
  projectionType: "portfolio_read_model",
  lastProcessedEvent: "event_12345",
  lastProcessedEventVersion: 1,
  lastProcessedTimestamp: ISODate("2024-01-15T10:30:00Z"),
  status: "active",
  errorCount: 0,
  lastError: null,
  metadata: {
    createdAt: ISODate("2024-01-01T00:00:00Z"),
    updatedAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Snapshot Collection:**
```javascript
// snapshots collection
{
  _id: ObjectId("507f1f77bcf86cd799439164"),
  aggregateId: "portfolio_12345",
  aggregateType: "portfolio",
  version: 10,
  data: {
    portfolioId: "portfolio_12345",
    userId: "user_12345",
    name: "Retirement Portfolio",
    type: "retirement",
    currentValue: 2500000,
    assetAllocation: {
      equity: { value: 1500000, percentage: 60 },
      debt: { value: 750000, percentage: 30 },
      gold: { value: 125000, percentage: 5 },
      governmentSchemes: { value: 125000, percentage: 5 }
    },
    performance: {
      totalReturn: 500000,
      returnPercentage: 0.25,
      annualizedReturn: 0.12,
      volatility: 0.18,
      sharpeRatio: 0.67
    }
  },
  metadata: {
    createdAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Indexes for CQRS:**
```javascript
// Command store indexes
db.command_store.createIndex({ "commandId": 1 }, { unique: true });
db.command_store.createIndex({ "aggregateId": 1, "commandType": 1 });
db.command_store.createIndex({ "status": 1, "metadata.timestamp": 1 });
db.command_store.createIndex({ "metadata.correlationId": 1 });

// Event store indexes
db.event_store.createIndex({ "eventId": 1 }, { unique: true });
db.event_store.createIndex({ "aggregateId": 1, "eventVersion": 1 });
db.event_store.createIndex({ "eventType": 1, "metadata.timestamp": 1 });
db.event_store.createIndex({ "metadata.correlationId": 1 });

// Read model indexes
db.portfolio_read_models.createIndex({ "aggregateId": 1 }, { unique: true });
db.portfolio_read_models.createIndex({ "userId": 1, "type": 1 });
db.portfolio_read_models.createIndex({ "metadata.lastUpdated": 1 });

// Projection status indexes
db.projection_status.createIndex({ "projectionId": 1 }, { unique: true });
db.projection_status.createIndex({ "projectionType": 1, "status": 1 });
db.projection_status.createIndex({ "lastProcessedTimestamp": 1 });

// Snapshot indexes
db.snapshots.createIndex({ "aggregateId": 1, "version": 1 });
db.snapshots.createIndex({ "aggregateType": 1, "version": 1 });
```

---

### Q3: Design a MongoDB schema for implementing distributed locks and consensus algorithms.

**Answer:**
A comprehensive schema for implementing distributed locks and consensus algorithms:

**Distributed Lock Collection:**
```javascript
// distributed_locks collection
{
  _id: ObjectId("507f1f77bcf86cd799439170"),
  lockId: "lock_12345",
  resource: "portfolio_12345",
  lockType: "exclusive",
  owner: "service_001",
  acquiredAt: ISODate("2024-01-15T10:30:00Z"),
  expiresAt: ISODate("2024-01-15T10:35:00Z"),
  ttl: 300, // seconds
  status: "active",
  metadata: {
    operation: "portfolio_update",
    priority: 1,
    retryCount: 0,
    version: 1
  }
}
```

**Consensus State Collection:**
```javascript
// consensus_state collection
{
  _id: ObjectId("507f1f77bcf86cd799439171"),
  consensusId: "consensus_12345",
  resource: "portfolio_12345",
  state: "committed",
  participants: [
    {
      nodeId: "node_001",
      vote: "commit",
      timestamp: ISODate("2024-01-15T10:30:00Z"),
      signature: "sig_12345"
    },
    {
      nodeId: "node_002",
      vote: "commit",
      timestamp: ISODate("2024-01-15T10:30:01Z"),
      signature: "sig_12346"
    },
    {
      nodeId: "node_003",
      vote: "commit",
      timestamp: ISODate("2024-01-15T10:30:02Z"),
      signature: "sig_12347"
    }
  ],
  proposal: {
    operation: "update_portfolio_value",
    data: {
      portfolioId: "portfolio_12345",
      newValue: 2500000
    },
    timestamp: ISODate("2024-01-15T10:30:00Z")
  },
  metadata: {
    createdAt: ISODate("2024-01-15T10:30:00Z"),
    committedAt: ISODate("2024-01-15T10:30:05Z"),
    version: 1
  }
}
```

**Leader Election Collection:**
```javascript
// leader_election collection
{
  _id: ObjectId("507f1f77bcf86cd799439172"),
  electionId: "election_12345",
  cluster: "portfolio_cluster",
  leader: "node_001",
  term: 5,
  status: "active",
  candidates: [
    {
      nodeId: "node_001",
      votes: 3,
      timestamp: ISODate("2024-01-15T10:30:00Z")
    },
    {
      nodeId: "node_002",
      votes: 0,
      timestamp: ISODate("2024-01-15T10:30:00Z")
    },
    {
      nodeId: "node_003",
      votes: 0,
      timestamp: ISODate("2024-01-15T10:30:00Z")
    }
  ],
  electionHistory: [
    {
      term: 4,
      leader: "node_002",
      startTime: ISODate("2024-01-15T09:00:00Z"),
      endTime: ISODate("2024-01-15T10:00:00Z"),
      reason: "node_failure"
    }
  ],
  metadata: {
    createdAt: ISODate("2024-01-15T10:30:00Z"),
    updatedAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Indexes for Distributed Locks:**
```javascript
// Distributed lock indexes
db.distributed_locks.createIndex({ "lockId": 1 }, { unique: true });
db.distributed_locks.createIndex({ "resource": 1, "lockType": 1 });
db.distributed_locks.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 });
db.distributed_locks.createIndex({ "owner": 1, "status": 1 });

// Consensus state indexes
db.consensus_state.createIndex({ "consensusId": 1 }, { unique: true });
db.consensus_state.createIndex({ "resource": 1, "state": 1 });
db.consensus_state.createIndex({ "metadata.createdAt": 1 });

// Leader election indexes
db.leader_election.createIndex({ "electionId": 1 }, { unique: true });
db.leader_election.createIndex({ "cluster": 1, "status": 1 });
db.leader_election.createIndex({ "leader": 1, "term": 1 });
```

---

### Q4: Design a MongoDB schema for implementing advanced caching strategies with cache invalidation.

**Answer:**
A comprehensive schema for implementing advanced caching strategies:

**Cache Strategy Collection:**
```javascript
// cache_strategy collection
{
  _id: ObjectId("507f1f77bcf86cd799439180"),
  strategyId: "strategy_12345",
  name: "Portfolio Data Cache",
  type: "write_through",
  config: {
    ttl: 3600, // seconds
    maxSize: 1000000, // bytes
    evictionPolicy: "lru",
    compression: true,
    encryption: true
  },
  invalidation: {
    triggers: ["portfolio_update", "user_preference_change"],
    patterns: ["portfolio:*", "user:*"],
    strategy: "immediate"
  },
  performance: {
    hitRate: 0.95,
    missRate: 0.05,
    averageResponseTime: 10, // milliseconds
    memoryUsage: 500000000 // bytes
  },
  metadata: {
    createdAt: ISODate("2024-01-01T00:00:00Z"),
    updatedAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Cache Entry Collection:**
```javascript
// cache_entry collection
{
  _id: ObjectId("507f1f77bcf86cd799439181"),
  cacheKey: "portfolio:user_12345:port_12345",
  strategyId: "strategy_12345",
  data: {
    portfolioId: "port_12345",
    userId: "user_12345",
    currentValue: 2500000,
    assetAllocation: {
      equity: { value: 1500000, percentage: 60 },
      debt: { value: 750000, percentage: 30 },
      gold: { value: 125000, percentage: 5 },
      governmentSchemes: { value: 125000, percentage: 5 }
    }
  },
  ttl: 3600,
  expiresAt: ISODate("2024-01-15T11:30:00Z"),
  accessCount: 150,
  lastAccessed: ISODate("2024-01-15T10:30:00Z"),
  size: 1024, // bytes
  compressed: true,
  encrypted: true,
  metadata: {
    createdAt: ISODate("2024-01-15T09:30:00Z"),
    version: 1
  }
}
```

**Cache Invalidation Collection:**
```javascript
// cache_invalidation collection
{
  _id: ObjectId("507f1f77bcf86cd799439182"),
  invalidationId: "inv_12345",
  trigger: "portfolio_update",
  patterns: ["portfolio:user_12345:*"],
  affectedKeys: [
    "portfolio:user_12345:port_12345",
    "portfolio:user_12345:analytics_12345"
  ],
  status: "completed",
  metadata: {
    triggeredAt: ISODate("2024-01-15T10:30:00Z"),
    completedAt: ISODate("2024-01-15T10:30:05Z"),
    version: 1
  }
}
```

**Cache Statistics Collection:**
```javascript
// cache_statistics collection
{
  _id: ObjectId("507f1f77bcf86cd799439183"),
  date: ISODate("2024-01-15"),
  strategyId: "strategy_12345",
  metrics: {
    hits: 10000,
    misses: 500,
    hitRate: 0.95,
    evictions: 100,
    totalSize: 1000000, // bytes
    averageResponseTime: 10 // milliseconds
  },
  performance: {
    peakHits: 1000, // per second
    averageHits: 500, // per second
    peakMemory: 800000000, // bytes
    averageMemory: 500000000 // bytes
  },
  metadata: {
    calculatedAt: ISODate("2024-01-15T23:59:59Z"),
    version: 1
  }
}
```

**Indexes for Advanced Caching:**
```javascript
// Cache strategy indexes
db.cache_strategy.createIndex({ "strategyId": 1 }, { unique: true });
db.cache_strategy.createIndex({ "type": 1, "status": 1 });
db.cache_strategy.createIndex({ "metadata.createdAt": 1 });

// Cache entry indexes
db.cache_entry.createIndex({ "cacheKey": 1 }, { unique: true });
db.cache_entry.createIndex({ "strategyId": 1, "expiresAt": 1 });
db.cache_entry.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 });
db.cache_entry.createIndex({ "lastAccessed": 1 });

// Cache invalidation indexes
db.cache_invalidation.createIndex({ "invalidationId": 1 }, { unique: true });
db.cache_invalidation.createIndex({ "trigger": 1, "status": 1 });
db.cache_invalidation.createIndex({ "metadata.triggeredAt": 1 });

// Cache statistics indexes
db.cache_statistics.createIndex({ "date": 1, "strategyId": 1 });
db.cache_statistics.createIndex({ "date": 1 });
```

---

### Q5: Design a MongoDB schema for implementing distributed transactions with two-phase commit.

**Answer:**
A comprehensive schema for implementing distributed transactions with two-phase commit:

**Transaction Coordinator Collection:**
```javascript
// transaction_coordinator collection
{
  _id: ObjectId("507f1f77bcf86cd799439190"),
  transactionId: "txn_12345",
  status: "committed",
  phase: "completed",
  participants: [
    {
      service: "portfolio_service",
      resource: "portfolio_12345",
      status: "committed",
      prepareResponse: {
        status: "prepared",
        timestamp: ISODate("2024-01-15T10:30:00Z")
      },
      commitResponse: {
        status: "committed",
        timestamp: ISODate("2024-01-15T10:30:05Z")
      }
    },
    {
      service: "analytics_service",
      resource: "analytics_12345",
      status: "committed",
      prepareResponse: {
        status: "prepared",
        timestamp: ISODate("2024-01-15T10:30:01Z")
      },
      commitResponse: {
        status: "committed",
        timestamp: ISODate("2024-01-15T10:30:06Z")
      }
    }
  ],
  operations: [
    {
      operationId: "op_12345",
      service: "portfolio_service",
      action: "update",
      data: {
        portfolioId: "portfolio_12345",
        newValue: 2500000
      },
      status: "completed"
    },
    {
      operationId: "op_12346",
      service: "analytics_service",
      action: "update",
      data: {
        analyticsId: "analytics_12345",
        newMetrics: {
          totalValue: 2500000,
          return: 0.25
        }
      },
      status: "completed"
    }
  ],
  metadata: {
    startedAt: ISODate("2024-01-15T10:30:00Z"),
    preparedAt: ISODate("2024-01-15T10:30:02Z"),
    committedAt: ISODate("2024-01-15T10:30:10Z"),
    duration: 10000, // milliseconds
    version: 1
  }
}
```

**Transaction Participant Collection:**
```javascript
// transaction_participant collection
{
  _id: ObjectId("507f1f77bcf86cd799439191"),
  participantId: "part_12345",
  transactionId: "txn_12345",
  service: "portfolio_service",
  resource: "portfolio_12345",
  status: "committed",
  phase: "completed",
  operations: [
    {
      operationId: "op_12345",
      action: "update",
      data: {
        portfolioId: "portfolio_12345",
        newValue: 2500000
      },
      status: "completed"
    }
  ],
  prepare: {
    status: "prepared",
    timestamp: ISODate("2024-01-15T10:30:00Z"),
    lockAcquired: true,
    resourcesReserved: true
  },
  commit: {
    status: "committed",
    timestamp: ISODate("2024-01-15T10:30:05Z"),
    changesApplied: true,
    locksReleased: true
  },
  rollback: {
    status: "not_required",
    timestamp: null,
    changesReverted: false,
    locksReleased: false
  },
  metadata: {
    createdAt: ISODate("2024-01-15T10:30:00Z"),
    updatedAt: ISODate("2024-01-15T10:30:05Z"),
    version: 1
  }
}
```

**Transaction Log Collection:**
```javascript
// transaction_log collection
{
  _id: ObjectId("507f1f77bcf86cd799439192"),
  logId: "log_12345",
  transactionId: "txn_12345",
  phase: "commit",
  action: "participant_committed",
  service: "portfolio_service",
  resource: "portfolio_12345",
  data: {
    operationId: "op_12345",
    status: "committed",
    timestamp: ISODate("2024-01-15T10:30:05Z")
  },
  metadata: {
    timestamp: ISODate("2024-01-15T10:30:05Z"),
    version: 1
  }
}
```

**Indexes for Distributed Transactions:**
```javascript
// Transaction coordinator indexes
db.transaction_coordinator.createIndex({ "transactionId": 1 }, { unique: true });
db.transaction_coordinator.createIndex({ "status": 1, "phase": 1 });
db.transaction_coordinator.createIndex({ "metadata.startedAt": 1 });

// Transaction participant indexes
db.transaction_participant.createIndex({ "participantId": 1 }, { unique: true });
db.transaction_participant.createIndex({ "transactionId": 1, "service": 1 });
db.transaction_participant.createIndex({ "status": 1, "phase": 1 });

// Transaction log indexes
db.transaction_log.createIndex({ "logId": 1 }, { unique: true });
db.transaction_log.createIndex({ "transactionId": 1, "phase": 1 });
db.transaction_log.createIndex({ "service": 1, "metadata.timestamp": 1 });
```

---

### Q6: Design a MongoDB schema for implementing distributed consensus with Raft algorithm.

**Answer:**
A comprehensive schema for implementing distributed consensus with Raft algorithm:

**Raft Node Collection:**
```javascript
// raft_node collection
{
  _id: ObjectId("507f1f77bcf86cd799439200"),
  nodeId: "node_001",
  cluster: "portfolio_cluster",
  role: "leader",
  term: 5,
  status: "active",
  config: {
    heartbeatInterval: 1000, // milliseconds
    electionTimeout: 5000, // milliseconds
    maxLogEntries: 1000000,
    snapshotThreshold: 10000
  },
  peers: [
    {
      nodeId: "node_002",
      address: "192.168.1.2:8080",
      status: "active",
      lastHeartbeat: ISODate("2024-01-15T10:30:00Z")
    },
    {
      nodeId: "node_003",
      address: "192.168.1.3:8080",
      status: "active",
      lastHeartbeat: ISODate("2024-01-15T10:30:00Z")
    }
  ],
  metadata: {
    createdAt: ISODate("2024-01-01T00:00:00Z"),
    updatedAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Raft Log Collection:**
```javascript
// raft_log collection
{
  _id: ObjectId("507f1f77bcf86cd799439201"),
  logId: "log_12345",
  nodeId: "node_001",
  term: 5,
  index: 1000,
  entry: {
    type: "portfolio_update",
    data: {
      portfolioId: "portfolio_12345",
      newValue: 2500000,
      timestamp: ISODate("2024-01-15T10:30:00Z")
    }
  },
  committed: true,
  metadata: {
    createdAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Raft Vote Collection:**
```javascript
// raft_vote collection
{
  _id: ObjectId("507f1f77bcf86cd799439202"),
  voteId: "vote_12345",
  nodeId: "node_001",
  candidateId: "node_002",
  term: 5,
  granted: true,
  metadata: {
    timestamp: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Raft Snapshot Collection:**
```javascript
// raft_snapshot collection
{
  _id: ObjectId("507f1f77bcf86cd799439203"),
  snapshotId: "snapshot_12345",
  nodeId: "node_001",
  term: 5,
  index: 1000,
  data: {
    portfolios: [
      {
        portfolioId: "portfolio_12345",
        value: 2500000,
        lastUpdated: ISODate("2024-01-15T10:30:00Z")
      }
    ],
    users: [
      {
        userId: "user_12345",
        lastActivity: ISODate("2024-01-15T10:30:00Z")
      }
    ]
  },
  metadata: {
    createdAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Indexes for Raft Consensus:**
```javascript
// Raft node indexes
db.raft_node.createIndex({ "nodeId": 1 }, { unique: true });
db.raft_node.createIndex({ "cluster": 1, "role": 1 });
db.raft_node.createIndex({ "status": 1, "term": 1 });

// Raft log indexes
db.raft_log.createIndex({ "logId": 1 }, { unique: true });
db.raft_log.createIndex({ "nodeId": 1, "term": 1, "index": 1 });
db.raft_log.createIndex({ "committed": 1, "term": 1 });

// Raft vote indexes
db.raft_vote.createIndex({ "voteId": 1 }, { unique: true });
db.raft_vote.createIndex({ "nodeId": 1, "term": 1 });
db.raft_vote.createIndex({ "candidateId": 1, "term": 1 });

// Raft snapshot indexes
db.raft_snapshot.createIndex({ "snapshotId": 1 }, { unique: true });
db.raft_snapshot.createIndex({ "nodeId": 1, "term": 1, "index": 1 });
```

---

### Q7: Design a MongoDB schema for implementing distributed data replication with conflict resolution.

**Answer:**
A comprehensive schema for implementing distributed data replication with conflict resolution:

**Replication Node Collection:**
```javascript
// replication_node collection
{
  _id: ObjectId("507f1f77bcf86cd799439210"),
  nodeId: "node_001",
  cluster: "portfolio_cluster",
  role: "primary",
  status: "active",
  config: {
    replicationFactor: 3,
    consistencyLevel: "strong",
    conflictResolution: "last_write_wins",
    syncInterval: 1000 // milliseconds
  },
  peers: [
    {
      nodeId: "node_002",
      address: "192.168.1.2:8080",
      role: "secondary",
      status: "active",
      lastSync: ISODate("2024-01-15T10:30:00Z"),
      lag: 50 // milliseconds
    },
    {
      nodeId: "node_003",
      address: "192.168.1.3:8080",
      role: "secondary",
      status: "active",
      lastSync: ISODate("2024-01-15T10:30:00Z"),
      lag: 100 // milliseconds
    }
  ],
  metadata: {
    createdAt: ISODate("2024-01-01T00:00:00Z"),
    updatedAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Replication Log Collection:**
```javascript
// replication_log collection
{
  _id: ObjectId("507f1f77bcf86cd799439211"),
  logId: "log_12345",
  nodeId: "node_001",
  operation: "update",
  resource: "portfolio_12345",
  data: {
    portfolioId: "portfolio_12345",
    newValue: 2500000,
    timestamp: ISODate("2024-01-15T10:30:00Z")
  },
  vectorClock: {
    node_001: 1000,
    node_002: 950,
    node_003: 900
  },
  status: "replicated",
  metadata: {
    createdAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Conflict Resolution Collection:**
```javascript
// conflict_resolution collection
{
  _id: ObjectId("507f1f77bcf86cd799439212"),
  conflictId: "conflict_12345",
  resource: "portfolio_12345",
  conflicts: [
    {
      nodeId: "node_001",
      value: 2500000,
      timestamp: ISODate("2024-01-15T10:30:00Z"),
      vectorClock: { node_001: 1000, node_002: 950, node_003: 900 }
    },
    {
      nodeId: "node_002",
      value: 2400000,
      timestamp: ISODate("2024-01-15T10:29:00Z"),
      vectorClock: { node_001: 950, node_002: 1000, node_003: 900 }
    }
  ],
  resolution: {
    strategy: "last_write_wins",
    winner: "node_001",
    resolvedValue: 2500000,
    resolvedAt: ISODate("2024-01-15T10:30:05Z")
  },
  metadata: {
    createdAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Indexes for Distributed Replication:**
```javascript
// Replication node indexes
db.replication_node.createIndex({ "nodeId": 1 }, { unique: true });
db.replication_node.createIndex({ "cluster": 1, "role": 1 });
db.replication_node.createIndex({ "status": 1, "metadata.updatedAt": 1 });

// Replication log indexes
db.replication_log.createIndex({ "logId": 1 }, { unique: true });
db.replication_log.createIndex({ "nodeId": 1, "operation": 1 });
db.replication_log.createIndex({ "status": 1, "metadata.createdAt": 1 });

// Conflict resolution indexes
db.conflict_resolution.createIndex({ "conflictId": 1 }, { unique: true });
db.conflict_resolution.createIndex({ "resource": 1, "metadata.createdAt": 1 });
db.conflict_resolution.createIndex({ "resolution.strategy": 1 });
```

---

This completes the first 7 questions of the expert level NoSQL questions, covering advanced schema design for the FutureFunds platform.
