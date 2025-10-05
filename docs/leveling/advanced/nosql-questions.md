---
noteId: "nosql-advanced-001"
tags: []

---

# Advanced Level - NoSQL Database Design (35 Questions)

## Table of Contents
1. [Advanced Schema Design (Q1-Q7)](#advanced-schema-design-q1-q7)
2. [Query Optimization (Q8-Q14)](#query-optimization-q8-q14)
3. [Indexing Strategies (Q15-Q21)](#indexing-strategies-q15-q21)
4. [Data Modeling Patterns (Q22-Q28)](#data-modeling-patterns-q22-q28)
5. [Performance & Scalability (Q29-Q35)](#performance--scalability-q29-q35)

---

## Advanced Schema Design (Q1-Q7)

### Q1: Design a sophisticated MongoDB schema for real-time portfolio management with advanced analytics.

**Answer:**
A comprehensive schema that supports real-time portfolio management with advanced analytics capabilities:

**Real-Time Portfolio Collection:**
```javascript
// real_time_portfolios collection
{
  _id: ObjectId("507f1f77bcf86cd799439080"),
  portfolioId: "port_12345",
  userId: "user_12345",
  name: "Retirement Portfolio",
  type: "retirement",
  status: "active",
  currentValue: 2500000,
  previousValue: 2400000,
  dailyChange: 100000,
  dailyChangePercentage: 0.0417,
  assetAllocation: {
    equity: {
      value: 1500000,
      percentage: 60,
      targetPercentage: 60,
      deviation: 0,
      performance: {
        daily: 0.05,
        weekly: 0.12,
        monthly: 0.18,
        ytd: 0.25
      }
    },
    debt: {
      value: 750000,
      percentage: 30,
      targetPercentage: 30,
      deviation: 0,
      performance: {
        daily: 0.02,
        weekly: 0.05,
        monthly: 0.08,
        ytd: 0.12
      }
    },
    gold: {
      value: 125000,
      percentage: 5,
      targetPercentage: 5,
      deviation: 0,
      performance: {
        daily: 0.01,
        weekly: 0.03,
        monthly: 0.05,
        ytd: 0.08
      }
    },
    governmentSchemes: {
      value: 125000,
      percentage: 5,
      targetPercentage: 5,
      deviation: 0,
      performance: {
        daily: 0.001,
        weekly: 0.003,
        monthly: 0.005,
        ytd: 0.071
      }
    }
  },
  riskMetrics: {
    volatility: 0.18,
    sharpeRatio: 0.67,
    maxDrawdown: -0.08,
    var95: -0.05,
    expectedShortfall: -0.07
  },
  rebalancing: {
    needed: false,
    triggerThreshold: 0.05,
    lastRebalanced: ISODate("2024-01-01T00:00:00Z"),
    nextRebalance: ISODate("2024-04-01T00:00:00Z")
  },
  metadata: {
    lastUpdated: ISODate("2024-01-15T10:30:00Z"),
    version: 1,
    source: "real_time_feed"
  }
}
```

**Portfolio Performance History Collection:**
```javascript
// portfolio_performance_history collection
{
  _id: ObjectId("507f1f77bcf86cd799439081"),
  portfolioId: "port_12345",
  userId: "user_12345",
  date: ISODate("2024-01-15"),
  timestamp: ISODate("2024-01-15T10:30:00Z"),
  metrics: {
    totalValue: 2500000,
    totalInvestment: 2000000,
    totalReturn: 500000,
    returnPercentage: 0.25,
    dailyReturn: 0.001,
    cumulativeReturn: 0.25,
    annualizedReturn: 0.12
  },
  assetBreakdown: {
    equity: {
      value: 1500000,
      percentage: 60,
      return: 0.15,
      volatility: 0.20
    },
    debt: {
      value: 750000,
      percentage: 30,
      return: 0.08,
      volatility: 0.05
    },
    gold: {
      value: 125000,
      percentage: 5,
      return: 0.05,
      volatility: 0.15
    },
    governmentSchemes: {
      value: 125000,
      percentage: 5,
      return: 0.071,
      volatility: 0.02
    }
  },
  benchmarks: {
    nifty50: 0.12,
    sensex: 0.11,
    bondIndex: 0.07,
    goldIndex: 0.05
  },
  riskMetrics: {
    volatility: 0.18,
    sharpeRatio: 0.67,
    maxDrawdown: -0.08,
    var95: -0.05,
    expectedShortfall: -0.07
  },
  metadata: {
    calculatedAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Advanced Analytics Collection:**
```javascript
// advanced_analytics collection
{
  _id: ObjectId("507f1f77bcf86cd799439082"),
  analyticsId: "analytics_12345",
  userId: "user_12345",
  portfolioId: "port_12345",
  date: ISODate("2024-01-15"),
  analysis: {
    performance: {
      absoluteReturn: 500000,
      relativeReturn: 0.25,
      riskAdjustedReturn: 0.67,
      informationRatio: 0.45,
      trackingError: 0.08
    },
    risk: {
      volatility: 0.18,
      beta: 1.2,
      alpha: 0.03,
      sharpeRatio: 0.67,
      sortinoRatio: 0.85,
      calmarRatio: 1.5
    },
    attribution: {
      assetAllocation: 0.15,
      securitySelection: 0.08,
      interaction: 0.02,
      total: 0.25
    },
    correlation: {
      equityDebt: 0.15,
      equityGold: -0.05,
      debtGold: 0.08,
      portfolioMarket: 0.85
    }
  },
  recommendations: [
    {
      type: "rebalancing",
      priority: "medium",
      description: "Consider rebalancing equity allocation",
      action: "Reduce equity by 2%",
      expectedImpact: "Risk reduction of 0.02"
    },
    {
      type: "diversification",
      priority: "low",
      description: "Add international exposure",
      action: "Allocate 5% to international funds",
      expectedImpact: "Diversification benefit of 0.03"
    }
  ],
  metadata: {
    calculatedAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Indexes for Real-Time Portfolio Management:**
```javascript
// Real-time portfolio indexes
db.real_time_portfolios.createIndex({ "userId": 1, "status": 1 });
db.real_time_portfolios.createIndex({ "portfolioId": 1 }, { unique: true });
db.real_time_portfolios.createIndex({ "metadata.lastUpdated": 1 });
db.real_time_portfolios.createIndex({ "type": 1, "status": 1 });

// Performance history indexes
db.portfolio_performance_history.createIndex({ "portfolioId": 1, "date": 1 });
db.portfolio_performance_history.createIndex({ "userId": 1, "date": 1 });
db.portfolio_performance_history.createIndex({ "date": 1 });

// Advanced analytics indexes
db.advanced_analytics.createIndex({ "userId": 1, "portfolioId": 1 });
db.advanced_analytics.createIndex({ "analyticsId": 1 }, { unique: true });
db.advanced_analytics.createIndex({ "date": 1 });
```

---

### Q2: Design a MongoDB schema for machine learning model training and prediction storage.

**Answer:**
A comprehensive schema for storing machine learning models, training data, and predictions:

**ML Models Collection:**
```javascript
// ml_models collection
{
  _id: ObjectId("507f1f77bcf86cd799439090"),
  modelId: "model_12345",
  name: "Portfolio Risk Prediction Model",
  type: "risk_prediction",
  version: "1.2.0",
  status: "active",
  algorithm: "random_forest",
  hyperparameters: {
    n_estimators: 100,
    max_depth: 10,
    min_samples_split: 5,
    min_samples_leaf: 2,
    random_state: 42
  },
  performance: {
    accuracy: 0.85,
    precision: 0.82,
    recall: 0.88,
    f1Score: 0.85,
    auc: 0.90
  },
  trainingData: {
    startDate: ISODate("2023-01-01"),
    endDate: ISODate("2023-12-31"),
    sampleSize: 100000,
    features: [
      "age",
      "income",
      "risk_tolerance",
      "investment_horizon",
      "portfolio_value",
      "volatility"
    ]
  },
  metadata: {
    createdAt: ISODate("2024-01-01T00:00:00Z"),
    updatedAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Training Data Collection:**
```javascript
// training_data collection
{
  _id: ObjectId("507f1f77bcf86cd799439091"),
  dataId: "data_12345",
  modelId: "model_12345",
  userId: "user_12345",
  features: {
    age: 30,
    income: 1200000,
    riskTolerance: "moderate",
    investmentHorizon: 30,
    portfolioValue: 2500000,
    volatility: 0.18,
    sharpeRatio: 0.67,
    maxDrawdown: -0.08
  },
  target: {
    riskLevel: "moderate",
    expectedReturn: 0.12,
    volatility: 0.18
  },
  metadata: {
    createdAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**ML Predictions Collection:**
```javascript
// ml_predictions collection
{
  _id: ObjectId("507f1f77bcf86cd799439092"),
  predictionId: "pred_12345",
  modelId: "model_12345",
  userId: "user_12345",
  portfolioId: "port_12345",
  input: {
    age: 30,
    income: 1200000,
    riskTolerance: "moderate",
    investmentHorizon: 30,
    portfolioValue: 2500000,
    volatility: 0.18
  },
  prediction: {
    riskLevel: "moderate",
    expectedReturn: 0.12,
    volatility: 0.18,
    confidence: 0.85
  },
  metadata: {
    predictedAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Model Performance Collection:**
```javascript
// model_performance collection
{
  _id: ObjectId("507f1f77bcf86cd799439093"),
  performanceId: "perf_12345",
  modelId: "model_12345",
  date: ISODate("2024-01-15"),
  metrics: {
    accuracy: 0.85,
    precision: 0.82,
    recall: 0.88,
    f1Score: 0.85,
    auc: 0.90
  },
  confusionMatrix: {
    truePositives: 850,
    falsePositives: 150,
    trueNegatives: 800,
    falseNegatives: 200
  },
  metadata: {
    calculatedAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Indexes for ML Models:**
```javascript
// ML model indexes
db.ml_models.createIndex({ "modelId": 1 }, { unique: true });
db.ml_models.createIndex({ "type": 1, "status": 1 });
db.ml_models.createIndex({ "metadata.createdAt": 1 });

// Training data indexes
db.training_data.createIndex({ "modelId": 1, "userId": 1 });
db.training_data.createIndex({ "dataId": 1 }, { unique: true });
db.training_data.createIndex({ "metadata.createdAt": 1 });

// ML prediction indexes
db.ml_predictions.createIndex({ "modelId": 1, "userId": 1 });
db.ml_predictions.createIndex({ "predictionId": 1 }, { unique: true });
db.ml_predictions.createIndex({ "metadata.predictedAt": 1 });

// Model performance indexes
db.model_performance.createIndex({ "modelId": 1, "date": 1 });
db.model_performance.createIndex({ "date": 1 });
```

---

### Q3: Design a MongoDB schema for event sourcing and CQRS pattern implementation.

**Answer:**
A comprehensive schema for implementing event sourcing and CQRS patterns:

**Event Store Collection:**
```javascript
// event_store collection
{
  _id: ObjectId("507f1f77bcf86cd799439100"),
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

**Command Store Collection:**
```javascript
// command_store collection
{
  _id: ObjectId("507f1f77bcf86cd799439101"),
  commandId: "cmd_12345",
  aggregateId: "portfolio_12345",
  aggregateType: "portfolio",
  commandType: "UpdatePortfolioValue",
  commandData: {
    portfolioId: "portfolio_12345",
    userId: "user_12345",
    newValue: 2500000,
    reason: "market_update"
  },
  status: "completed",
  result: {
    success: true,
    eventId: "event_12345",
    error: null
  },
  metadata: {
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
  _id: ObjectId("507f1f77bcf86cd799439102"),
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
  _id: ObjectId("507f1f77bcf86cd799439103"),
  projectionId: "proj_12345",
  projectionType: "portfolio_read_model",
  lastProcessedEvent: "event_12345",
  lastProcessedTimestamp: ISODate("2024-01-15T10:30:00Z"),
  status: "active",
  metadata: {
    createdAt: ISODate("2024-01-01T00:00:00Z"),
    updatedAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Indexes for Event Sourcing:**
```javascript
// Event store indexes
db.event_store.createIndex({ "aggregateId": 1, "eventVersion": 1 });
db.event_store.createIndex({ "eventId": 1 }, { unique: true });
db.event_store.createIndex({ "eventType": 1, "metadata.timestamp": 1 });
db.event_store.createIndex({ "metadata.timestamp": 1 });

// Command store indexes
db.command_store.createIndex({ "aggregateId": 1, "commandType": 1 });
db.command_store.createIndex({ "commandId": 1 }, { unique: true });
db.command_store.createIndex({ "status": 1, "metadata.timestamp": 1 });

// Read model indexes
db.portfolio_read_models.createIndex({ "aggregateId": 1 }, { unique: true });
db.portfolio_read_models.createIndex({ "userId": 1, "type": 1 });
db.portfolio_read_models.createIndex({ "metadata.lastUpdated": 1 });

// Projection status indexes
db.projection_status.createIndex({ "projectionId": 1 }, { unique: true });
db.projection_status.createIndex({ "projectionType": 1, "status": 1 });
```

---

### Q4: Design a MongoDB schema for multi-tenant architecture with data isolation.

**Answer:**
A comprehensive schema for implementing multi-tenant architecture with proper data isolation:

**Tenant Management Collection:**
```javascript
// tenants collection
{
  _id: ObjectId("507f1f77bcf86cd799439110"),
  tenantId: "tenant_12345",
  name: "FutureFunds Corp",
  type: "enterprise",
  status: "active",
  subscription: {
    plan: "enterprise",
    startDate: ISODate("2024-01-01"),
    endDate: ISODate("2024-12-31"),
    maxUsers: 1000,
    features: ["advanced_analytics", "api_access", "white_label"]
  },
  configuration: {
    branding: {
      logo: "https://example.com/logo.png",
      primaryColor: "#1e40af",
      secondaryColor: "#3b82f6"
    },
    settings: {
      currency: "INR",
      timezone: "Asia/Kolkata",
      language: "en",
      dateFormat: "DD/MM/YYYY"
    }
  },
  metadata: {
    createdAt: ISODate("2024-01-01T00:00:00Z"),
    updatedAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Tenant Users Collection:**
```javascript
// tenant_users collection
{
  _id: ObjectId("507f1f77bcf86cd799439111"),
  tenantUserId: "tenant_user_12345",
  tenantId: "tenant_12345",
  userId: "user_12345",
  role: "admin",
  permissions: [
    "view_portfolio",
    "edit_portfolio",
    "manage_users",
    "view_analytics"
  ],
  status: "active",
  metadata: {
    createdAt: ISODate("2024-01-01T00:00:00Z"),
    updatedAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Tenant-Specific Portfolio Collection:**
```javascript
// tenant_portfolios collection
{
  _id: ObjectId("507f1f77bcf86cd799439112"),
  portfolioId: "port_12345",
  tenantId: "tenant_12345",
  userId: "user_12345",
  name: "Retirement Portfolio",
  type: "retirement",
  status: "active",
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
  },
  metadata: {
    createdAt: ISODate("2024-01-01T00:00:00Z"),
    updatedAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Tenant Analytics Collection:**
```javascript
// tenant_analytics collection
{
  _id: ObjectId("507f1f77bcf86cd799439113"),
  analyticsId: "analytics_12345",
  tenantId: "tenant_12345",
  date: ISODate("2024-01-15"),
  metrics: {
    users: {
      total: 1000,
      active: 750,
      new: 50,
      churned: 25
    },
    portfolios: {
      total: 2000,
      active: 1800,
      new: 100
    },
    performance: {
      averageReturn: 0.12,
      averageVolatility: 0.18,
      averageSharpeRatio: 0.67
    }
  },
  metadata: {
    calculatedAt: ISODate("2024-01-15T23:59:59Z"),
    version: 1
  }
}
```

**Indexes for Multi-Tenant Architecture:**
```javascript
// Tenant indexes
db.tenants.createIndex({ "tenantId": 1 }, { unique: true });
db.tenants.createIndex({ "status": 1, "subscription.plan": 1 });
db.tenants.createIndex({ "metadata.createdAt": 1 });

// Tenant users indexes
db.tenant_users.createIndex({ "tenantId": 1, "userId": 1 });
db.tenant_users.createIndex({ "tenantUserId": 1 }, { unique: true });
db.tenant_users.createIndex({ "role": 1, "status": 1 });

// Tenant portfolios indexes
db.tenant_portfolios.createIndex({ "tenantId": 1, "userId": 1 });
db.tenant_portfolios.createIndex({ "portfolioId": 1 }, { unique: true });
db.tenant_portfolios.createIndex({ "tenantId": 1, "type": 1 });

// Tenant analytics indexes
db.tenant_analytics.createIndex({ "tenantId": 1, "date": 1 });
db.tenant_analytics.createIndex({ "date": 1 });
```

---

### Q5: Design a MongoDB schema for real-time data streaming and processing.

**Answer:**
A comprehensive schema for handling real-time data streaming and processing:

**Stream Processing Collection:**
```javascript
// stream_processing collection
{
  _id: ObjectId("507f1f77bcf86cd799439120"),
  streamId: "stream_12345",
  name: "Portfolio Value Stream",
  type: "portfolio_updates",
  status: "active",
  configuration: {
    source: "market_data_feed",
    destination: "portfolio_analytics",
    processingMode: "real_time",
    batchSize: 100,
    windowSize: 300, // seconds
    checkpointInterval: 60 // seconds
  },
  metrics: {
    messagesProcessed: 1000000,
    messagesPerSecond: 100,
    averageLatency: 50, // milliseconds
    errorRate: 0.001
  },
  metadata: {
    createdAt: ISODate("2024-01-01T00:00:00Z"),
    updatedAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Stream Events Collection:**
```javascript
// stream_events collection
{
  _id: ObjectId("507f1f77bcf86cd799439121"),
  eventId: "event_12345",
  streamId: "stream_12345",
  eventType: "portfolio_value_update",
  timestamp: ISODate("2024-01-15T10:30:00Z"),
  data: {
    portfolioId: "port_12345",
    userId: "user_12345",
    oldValue: 2400000,
    newValue: 2500000,
    change: 100000,
    changePercentage: 0.0417,
    marketData: {
      nifty50: 0.02,
      sensex: 0.018,
      bondIndex: 0.005
    }
  },
  processing: {
    status: "processed",
    processedAt: ISODate("2024-01-15T10:30:05Z"),
    latency: 5000, // milliseconds
    retryCount: 0
  },
  metadata: {
    source: "market_data_feed",
    version: 1
  }
}
```

**Stream Checkpoints Collection:**
```javascript
// stream_checkpoints collection
{
  _id: ObjectId("507f1f77bcf86cd799439122"),
  checkpointId: "checkpoint_12345",
  streamId: "stream_12345",
  lastProcessedEvent: "event_12345",
  lastProcessedTimestamp: ISODate("2024-01-15T10:30:00Z"),
  offset: 1000000,
  status: "active",
  metadata: {
    createdAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Real-Time Analytics Collection:**
```javascript
// real_time_analytics collection
{
  _id: ObjectId("507f1f77bcf86cd799439123"),
  analyticsId: "analytics_12345",
  streamId: "stream_12345",
  timestamp: ISODate("2024-01-15T10:30:00Z"),
  metrics: {
    totalPortfolios: 100000,
    totalValue: 250000000000,
    averageValue: 2500000,
    totalChange: 10000000,
    averageChange: 100000,
    positiveChange: 60000,
    negativeChange: 40000
  },
  trends: {
    hourly: {
      value: 0.02,
      volume: 1000
    },
    daily: {
      value: 0.05,
      volume: 10000
    },
    weekly: {
      value: 0.12,
      volume: 50000
    }
  },
  metadata: {
    calculatedAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Indexes for Stream Processing:**
```javascript
// Stream processing indexes
db.stream_processing.createIndex({ "streamId": 1 }, { unique: true });
db.stream_processing.createIndex({ "type": 1, "status": 1 });
db.stream_processing.createIndex({ "metadata.createdAt": 1 });

// Stream events indexes
db.stream_events.createIndex({ "streamId": 1, "timestamp": 1 });
db.stream_events.createIndex({ "eventId": 1 }, { unique: true });
db.stream_events.createIndex({ "eventType": 1, "timestamp": 1 });
db.stream_events.createIndex({ "processing.status": 1, "timestamp": 1 });

// Stream checkpoints indexes
db.stream_checkpoints.createIndex({ "streamId": 1 }, { unique: true });
db.stream_checkpoints.createIndex({ "status": 1, "lastProcessedTimestamp": 1 });

// Real-time analytics indexes
db.real_time_analytics.createIndex({ "streamId": 1, "timestamp": 1 });
db.real_time_analytics.createIndex({ "timestamp": 1 });
```

---

### Q6: Design a MongoDB schema for advanced caching and session management.

**Answer:**
A comprehensive schema for implementing advanced caching and session management:

**Cache Store Collection:**
```javascript
// cache_store collection
{
  _id: ObjectId("507f1f77bcf86cd799439130"),
  cacheKey: "portfolio:user_12345:port_12345",
  cacheType: "portfolio_data",
  data: {
    portfolioId: "port_12345",
    userId: "user_12345",
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
  ttl: 3600, // seconds
  expiresAt: ISODate("2024-01-15T11:30:00Z"),
  accessCount: 150,
  lastAccessed: ISODate("2024-01-15T10:30:00Z"),
  metadata: {
    createdAt: ISODate("2024-01-15T09:30:00Z"),
    version: 1
  }
}
```

**Session Store Collection:**
```javascript
// session_store collection
{
  _id: ObjectId("507f1f77bcf86cd799439131"),
  sessionId: "sess_abc123def456",
  userId: "user_12345",
  tenantId: "tenant_12345",
  status: "active",
  sessionData: {
    user: {
      id: "user_12345",
      email: "user@example.com",
      role: "admin",
      permissions: ["view_portfolio", "edit_portfolio"]
    },
    preferences: {
      theme: "light",
      language: "en",
      timezone: "Asia/Kolkata"
    },
    navigation: {
      currentPage: "portfolio_dashboard",
      lastVisited: ["calculator", "schemes", "analytics"]
    }
  },
  device: {
    type: "mobile",
    os: "iOS",
    browser: "Safari",
    version: "17.0"
  },
  location: {
    ip: "192.168.1.1",
    country: "India",
    city: "Mumbai",
    coordinates: {
      lat: 19.0760,
      lng: 72.8777
    }
  },
  security: {
    encrypted: true,
    encryptionKey: "enc_key_12345",
    lastActivity: ISODate("2024-01-15T10:30:00Z"),
    expiresAt: ISODate("2024-01-22T10:30:00Z")
  },
  metadata: {
    createdAt: ISODate("2024-01-15T09:30:00Z"),
    updatedAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Cache Statistics Collection:**
```javascript
// cache_statistics collection
{
  _id: ObjectId("507f1f77bcf86cd799439132"),
  date: ISODate("2024-01-15"),
  cacheType: "portfolio_data",
  metrics: {
    hits: 10000,
    misses: 1000,
    hitRate: 0.909,
    averageResponseTime: 50, // milliseconds
    totalSize: 1000000, // bytes
    evictions: 100
  },
  performance: {
    averageAccessTime: 5, // milliseconds
    peakAccessTime: 20, // milliseconds
    cacheEfficiency: 0.95
  },
  metadata: {
    calculatedAt: ISODate("2024-01-15T23:59:59Z"),
    version: 1
  }
}
```

**Session Analytics Collection:**
```javascript
// session_analytics collection
{
  _id: ObjectId("507f1f77bcf86cd799439133"),
  sessionId: "sess_abc123def456",
  userId: "user_12345",
  startTime: ISODate("2024-01-15T09:30:00Z"),
  endTime: ISODate("2024-01-15T11:30:00Z"),
  duration: 7200, // seconds
  activity: {
    pageViews: 15,
    actions: 50,
    apiCalls: 100,
    errors: 2
  },
  behavior: {
    mostVisitedPages: ["portfolio", "calculator", "schemes"],
    averageTimePerPage: 300, // seconds
    bounceRate: 0.2,
    conversionRate: 0.1
  },
  metadata: {
    createdAt: ISODate("2024-01-15T09:30:00Z"),
    version: 1
  }
}
```

**Indexes for Caching and Sessions:**
```javascript
// Cache store indexes
db.cache_store.createIndex({ "cacheKey": 1 }, { unique: true });
db.cache_store.createIndex({ "cacheType": 1, "expiresAt": 1 });
db.cache_store.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 });
db.cache_store.createIndex({ "lastAccessed": 1 });

// Session store indexes
db.session_store.createIndex({ "sessionId": 1 }, { unique: true });
db.session_store.createIndex({ "userId": 1, "status": 1 });
db.session_store.createIndex({ "security.expiresAt": 1 }, { expireAfterSeconds: 0 });
db.session_store.createIndex({ "security.lastActivity": 1 });

// Cache statistics indexes
db.cache_statistics.createIndex({ "date": 1, "cacheType": 1 });
db.cache_statistics.createIndex({ "date": 1 });

// Session analytics indexes
db.session_analytics.createIndex({ "sessionId": 1 }, { unique: true });
db.session_analytics.createIndex({ "userId": 1, "startTime": 1 });
db.session_analytics.createIndex({ "startTime": 1 });
```

---

### Q7: Design a MongoDB schema for distributed transactions and consistency.

**Answer:**
A comprehensive schema for implementing distributed transactions and ensuring consistency:

**Transaction Log Collection:**
```javascript
// transaction_log collection
{
  _id: ObjectId("507f1f77bcf86cd799439140"),
  transactionId: "txn_12345",
  status: "committed",
  type: "portfolio_update",
  participants: [
    {
      service: "portfolio_service",
      resource: "portfolio_12345",
      action: "update_value",
      status: "committed"
    },
    {
      service: "analytics_service",
      resource: "analytics_12345",
      action: "update_metrics",
      status: "committed"
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
      status: "completed",
      timestamp: ISODate("2024-01-15T10:30:00Z")
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
      status: "completed",
      timestamp: ISODate("2024-01-15T10:30:05Z")
    }
  ],
  metadata: {
    startedAt: ISODate("2024-01-15T10:30:00Z"),
    completedAt: ISODate("2024-01-15T10:30:10Z"),
    duration: 10000, // milliseconds
    version: 1
  }
}
```

**Saga State Collection:**
```javascript
// saga_state collection
{
  _id: ObjectId("507f1f77bcf86cd799439141"),
  sagaId: "saga_12345",
  transactionId: "txn_12345",
  status: "completed",
  steps: [
    {
      stepId: "step_12345",
      service: "portfolio_service",
      action: "update_portfolio",
      status: "completed",
      timestamp: ISODate("2024-01-15T10:30:00Z"),
      compensation: {
        action: "revert_portfolio",
        data: {
          portfolioId: "portfolio_12345",
          oldValue: 2400000
        }
      }
    },
    {
      stepId: "step_12346",
      service: "analytics_service",
      action: "update_analytics",
      status: "completed",
      timestamp: ISODate("2024-01-15T10:30:05Z"),
      compensation: {
        action: "revert_analytics",
        data: {
          analyticsId: "analytics_12345",
          oldMetrics: {
            totalValue: 2400000,
            return: 0.20
          }
        }
      }
    }
  ],
  metadata: {
    createdAt: ISODate("2024-01-15T10:30:00Z"),
    updatedAt: ISODate("2024-01-15T10:30:10Z"),
    version: 1
  }
}
```

**Consistency Check Collection:**
```javascript
// consistency_check collection
{
  _id: ObjectId("507f1f77bcf86cd799439142"),
  checkId: "check_12345",
  type: "portfolio_analytics_consistency",
  status: "passed",
  entities: [
    {
      service: "portfolio_service",
      resource: "portfolio_12345",
      value: 2500000,
      timestamp: ISODate("2024-01-15T10:30:00Z")
    },
    {
      service: "analytics_service",
      resource: "analytics_12345",
      value: 2500000,
      timestamp: ISODate("2024-01-15T10:30:05Z")
    }
  ],
  result: {
    consistent: true,
    differences: [],
    tolerance: 0.01
  },
  metadata: {
    checkedAt: ISODate("2024-01-15T10:30:10Z"),
    version: 1
  }
}
```

**Indexes for Distributed Transactions:**
```javascript
// Transaction log indexes
db.transaction_log.createIndex({ "transactionId": 1 }, { unique: true });
db.transaction_log.createIndex({ "status": 1, "type": 1 });
db.transaction_log.createIndex({ "metadata.startedAt": 1 });

// Saga state indexes
db.saga_state.createIndex({ "sagaId": 1 }, { unique: true });
db.saga_state.createIndex({ "transactionId": 1 });
db.saga_state.createIndex({ "status": 1, "metadata.createdAt": 1 });

// Consistency check indexes
db.consistency_check.createIndex({ "checkId": 1 }, { unique: true });
db.consistency_check.createIndex({ "type": 1, "status": 1 });
db.consistency_check.createIndex({ "metadata.checkedAt": 1 });
```

---

This completes the first 7 questions of the advanced level NoSQL questions, covering advanced schema design for the FutureFunds platform.
