---
noteId: "nosql-intermediate-001"
tags: []

---

# Intermediate Level - NoSQL Database Design (35 Questions)

## Table of Contents
1. [Advanced Schema Design (Q1-Q7)](#advanced-schema-design-q1-q7)
2. [Query Optimization (Q8-Q14)](#query-optimization-q8-q14)
3. [Indexing Strategies (Q15-Q21)](#indexing-strategies-q15-q21)
4. [Data Modeling Patterns (Q22-Q28)](#data-modeling-patterns-q22-q28)
5. [Performance & Scalability (Q29-Q35)](#performance--scalability-q29-q35)

---

## Advanced Schema Design (Q1-Q7)

### Q1: Design a comprehensive MongoDB schema for the FutureFunds user management system.

**Answer:**
A well-designed MongoDB schema that supports user management, authentication, and profile data:

**User Collection Schema:**
```javascript
// users collection
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  userId: "user_12345",
  email: "user@example.com",
  phone: "+91-9876543210",
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: ISODate("1990-01-15"),
    gender: "male",
    maritalStatus: "single",
    dependents: 0,
    address: {
      street: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      country: "India"
    }
  },
  financialProfile: {
    annualIncome: 1200000,
    monthlyExpenses: 50000,
    existingInvestments: 500000,
    riskTolerance: "moderate",
    investmentGoals: ["retirement", "tax_saving"],
    preferredInvestmentTypes: ["mutual_funds", "government_schemes"]
  },
  authentication: {
    passwordHash: "$2b$10$...",
    salt: "random_salt_string",
    twoFactorEnabled: true,
    lastLogin: ISODate("2024-01-15T10:30:00Z"),
    loginAttempts: 0,
    accountLocked: false,
    emailVerified: true,
    phoneVerified: true
  },
  preferences: {
    notifications: {
      email: true,
      sms: false,
      push: true,
      frequency: "weekly"
    },
    privacy: {
      profileVisibility: "private",
      dataSharing: false
    },
    language: "en",
    timezone: "Asia/Kolkata"
  },
  metadata: {
    createdAt: ISODate("2024-01-01T00:00:00Z"),
    updatedAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1,
    source: "web_app"
  }
}
```

**User Sessions Collection:**
```javascript
// user_sessions collection
{
  _id: ObjectId("507f1f77bcf86cd799439012"),
  userId: "user_12345",
  sessionId: "sess_abc123def456",
  deviceInfo: {
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
  status: "active",
  createdAt: ISODate("2024-01-15T10:30:00Z"),
  lastActivity: ISODate("2024-01-15T11:45:00Z"),
  expiresAt: ISODate("2024-01-22T10:30:00Z")
}
```

**User Preferences Collection:**
```javascript
// user_preferences collection
{
  _id: ObjectId("507f1f77bcf86cd799439013"),
  userId: "user_12345",
  investmentPreferences: {
    riskProfile: "moderate",
    investmentHorizon: 30,
    monthlyInvestmentCapacity: 25000,
    preferredSchemes: ["PPF", "NPS", "EPF"],
    excludedSchemes: ["ULIP"],
    autoRebalancing: true,
    taxOptimization: true
  },
  displayPreferences: {
    currency: "INR",
    dateFormat: "DD/MM/YYYY",
    numberFormat: "Indian",
    theme: "light",
    dashboardLayout: "compact"
  },
  notificationPreferences: {
    portfolioUpdates: {
      email: true,
      push: true,
      frequency: "daily"
    },
    marketUpdates: {
      email: false,
      push: true,
      frequency: "weekly"
    },
    schemeUpdates: {
      email: true,
      push: false,
      frequency: "monthly"
    }
  },
  updatedAt: ISODate("2024-01-15T10:30:00Z")
}
```

**Indexes for User Management:**
```javascript
// Compound indexes for efficient queries
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "phone": 1 }, { unique: true });
db.users.createIndex({ "userId": 1 }, { unique: true });
db.users.createIndex({ "personalInfo.dateOfBirth": 1 });
db.users.createIndex({ "financialProfile.annualIncome": 1 });
db.users.createIndex({ "metadata.createdAt": 1 });
db.users.createIndex({ "authentication.lastLogin": 1 });

// Text index for search
db.users.createIndex({
  "personalInfo.firstName": "text",
  "personalInfo.lastName": "text",
  "email": "text"
});

// Compound index for filtering
db.users.createIndex({
  "financialProfile.riskTolerance": 1,
  "financialProfile.annualIncome": 1,
  "metadata.createdAt": 1
});
```

---

### Q2: Design a MongoDB schema for portfolio and investment tracking.

**Answer:**
A comprehensive schema for tracking user portfolios and investments:

**Portfolio Collection:**
```javascript
// portfolios collection
{
  _id: ObjectId("507f1f77bcf86cd799439020"),
  portfolioId: "port_12345",
  userId: "user_12345",
  name: "Retirement Portfolio",
  type: "retirement",
  status: "active",
  targetAmount: 10000000,
  currentValue: 2500000,
  targetDate: ISODate("2054-01-01"),
  riskProfile: "moderate",
  assetAllocation: {
    equity: 60,
    debt: 30,
    gold: 5,
    governmentSchemes: 5
  },
  performance: {
    totalReturn: 0.15,
    annualizedReturn: 0.12,
    volatility: 0.18,
    sharpeRatio: 0.67,
    maxDrawdown: -0.08
  },
  metadata: {
    createdAt: ISODate("2024-01-01T00:00:00Z"),
    updatedAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Investments Collection:**
```javascript
// investments collection
{
  _id: ObjectId("507f1f77bcf86cd799439021"),
  investmentId: "inv_12345",
  portfolioId: "port_12345",
  userId: "user_12345",
  scheme: {
    id: "PPF",
    name: "Public Provident Fund",
    type: "government_scheme",
    category: "debt",
    riskLevel: "low",
    expectedReturn: 0.071,
    lockInPeriod: 15,
    minAmount: 500,
    maxAmount: 150000
  },
  investmentDetails: {
    amount: 150000,
    investmentDate: ISODate("2024-01-01"),
    maturityDate: ISODate("2039-01-01"),
    frequency: "annual",
    nextDueDate: ISODate("2025-01-01"),
    status: "active"
  },
  performance: {
    currentValue: 150000,
    totalReturn: 0,
    annualizedReturn: 0,
    lastUpdated: ISODate("2024-01-15T10:30:00Z")
  },
  transactions: [
    {
      transactionId: "txn_12345",
      type: "investment",
      amount: 150000,
      date: ISODate("2024-01-01"),
      status: "completed"
    }
  ],
  metadata: {
    createdAt: ISODate("2024-01-01T00:00:00Z"),
    updatedAt: ISODate("2024-01-15T10:30:00Z")
  }
}
```

**Transactions Collection:**
```javascript
// transactions collection
{
  _id: ObjectId("507f1f77bcf86cd799439022"),
  transactionId: "txn_12345",
  userId: "user_12345",
  portfolioId: "port_12345",
  investmentId: "inv_12345",
  type: "investment",
  category: "government_scheme",
  amount: 150000,
  currency: "INR",
  status: "completed",
  paymentMethod: "net_banking",
  paymentDetails: {
    bankName: "HDFC Bank",
    accountNumber: "****1234",
    transactionReference: "TXN123456789"
  },
  scheme: {
    id: "PPF",
    name: "Public Provident Fund"
  },
  metadata: {
    createdAt: ISODate("2024-01-01T00:00:00Z"),
    processedAt: ISODate("2024-01-01T00:05:00Z"),
    version: 1
  }
}
```

**Portfolio Performance Collection:**
```javascript
// portfolio_performance collection
{
  _id: ObjectId("507f1f77bcf86cd799439023"),
  portfolioId: "port_12345",
  userId: "user_12345",
  date: ISODate("2024-01-15"),
  metrics: {
    totalValue: 2500000,
    totalInvestment: 2000000,
    totalReturn: 500000,
    returnPercentage: 0.25,
    dailyReturn: 0.001,
    volatility: 0.18,
    sharpeRatio: 0.67
  },
  assetBreakdown: {
    equity: {
      value: 1500000,
      percentage: 60,
      return: 0.15
    },
    debt: {
      value: 750000,
      percentage: 30,
      return: 0.08
    },
    gold: {
      value: 125000,
      percentage: 5,
      return: 0.05
    },
    governmentSchemes: {
      value: 125000,
      percentage: 5,
      return: 0.071
    }
  },
  benchmarks: {
    nifty50: 0.12,
    sensex: 0.11,
    bondIndex: 0.07
  },
  metadata: {
    calculatedAt: ISODate("2024-01-15T23:59:59Z"),
    version: 1
  }
}
```

**Indexes for Portfolio Management:**
```javascript
// Portfolio indexes
db.portfolios.createIndex({ "userId": 1, "status": 1 });
db.portfolios.createIndex({ "portfolioId": 1 }, { unique: true });
db.portfolios.createIndex({ "type": 1, "riskProfile": 1 });
db.portfolios.createIndex({ "metadata.createdAt": 1 });

// Investment indexes
db.investments.createIndex({ "userId": 1, "portfolioId": 1 });
db.investments.createIndex({ "investmentId": 1 }, { unique: true });
db.investments.createIndex({ "scheme.id": 1, "scheme.type": 1 });
db.investments.createIndex({ "investmentDetails.status": 1 });
db.investments.createIndex({ "investmentDetails.investmentDate": 1 });

// Transaction indexes
db.transactions.createIndex({ "userId": 1, "type": 1 });
db.transactions.createIndex({ "transactionId": 1 }, { unique: true });
db.transactions.createIndex({ "status": 1, "metadata.createdAt": 1 });
db.transactions.createIndex({ "scheme.id": 1, "type": 1 });

// Performance indexes
db.portfolio_performance.createIndex({ "portfolioId": 1, "date": 1 });
db.portfolio_performance.createIndex({ "userId": 1, "date": 1 });
db.portfolio_performance.createIndex({ "date": 1 });
```

---

### Q3: Design a MongoDB schema for government schemes and their integration.

**Answer:**
A comprehensive schema for managing government schemes and their integration:

**Government Schemes Collection:**
```javascript
// government_schemes collection
{
  _id: ObjectId("507f1f77bcf86cd799439030"),
  schemeId: "PPF",
  name: "Public Provident Fund",
  fullName: "Public Provident Fund",
  type: "savings",
  category: "retirement",
  description: "Long-term savings scheme with tax benefits",
  eligibility: {
    age: {
      min: 18,
      max: null
    },
    income: {
      min: 0,
      max: null
    },
    citizenship: "Indian",
    other: ["Valid PAN card", "Bank account"]
  },
  features: {
    interestRate: 0.071,
    lockInPeriod: 15,
    minAmount: 500,
    maxAmount: 150000,
    frequency: "annual",
    taxBenefits: {
      section80C: 150000,
      section80C_deduction: true,
      taxFree: true
    }
  },
  documents: [
    "PAN card",
    "Address proof",
    "Bank account details",
    "Passport size photo"
  ],
  applicationProcess: {
    online: true,
    offline: true,
    requiredDocuments: ["PAN", "Address proof", "Bank details"],
    processingTime: "1-2 days"
  },
  status: "active",
  metadata: {
    createdAt: ISODate("2024-01-01T00:00:00Z"),
    updatedAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Scheme Interest Rates Collection:**
```javascript
// scheme_interest_rates collection
{
  _id: ObjectId("507f1f77bcf86cd799439031"),
  schemeId: "PPF",
  rate: 0.071,
  effectiveDate: ISODate("2024-01-01"),
  endDate: ISODate("2024-12-31"),
  quarter: "Q1_2024",
  announcementDate: ISODate("2023-12-31"),
  source: "RBI",
  metadata: {
    createdAt: ISODate("2024-01-01T00:00:00Z"),
    version: 1
  }
}
```

**User Scheme Applications Collection:**
```javascript
// user_scheme_applications collection
{
  _id: ObjectId("507f1f77bcf86cd799439032"),
  applicationId: "app_12345",
  userId: "user_12345",
  schemeId: "PPF",
  status: "approved",
  applicationDate: ISODate("2024-01-01"),
  approvalDate: ISODate("2024-01-03"),
  accountNumber: "PPF123456789",
  applicationDetails: {
    amount: 150000,
    frequency: "annual",
    nominee: {
      name: "Jane Doe",
      relationship: "spouse",
      share: 100
    }
  },
  documents: [
    {
      type: "PAN",
      documentId: "doc_12345",
      status: "verified"
    },
    {
      type: "Address proof",
      documentId: "doc_12346",
      status: "verified"
    }
  ],
  metadata: {
    createdAt: ISODate("2024-01-01T00:00:00Z"),
    updatedAt: ISODate("2024-01-03T10:30:00Z"),
    version: 1
  }
}
```

**Scheme Performance Collection:**
```javascript
// scheme_performance collection
{
  _id: ObjectId("507f1f77bcf86cd799439033"),
  schemeId: "PPF",
  date: ISODate("2024-01-15"),
  metrics: {
    totalInvestors: 5000000,
    totalAmount: 5000000000000,
    averageInvestment: 1000000,
    growthRate: 0.12
  },
  performance: {
    currentRate: 0.071,
    historicalAverage: 0.075,
    volatility: 0.02,
    riskLevel: "low"
  },
  metadata: {
    calculatedAt: ISODate("2024-01-15T23:59:59Z"),
    version: 1
  }
}
```

**Indexes for Government Schemes:**
```javascript
// Scheme indexes
db.government_schemes.createIndex({ "schemeId": 1 }, { unique: true });
db.government_schemes.createIndex({ "type": 1, "category": 1 });
db.government_schemes.createIndex({ "status": 1 });
db.government_schemes.createIndex({ "features.interestRate": 1 });

// Interest rate indexes
db.scheme_interest_rates.createIndex({ "schemeId": 1, "effectiveDate": 1 });
db.scheme_interest_rates.createIndex({ "effectiveDate": 1, "endDate": 1 });
db.scheme_interest_rates.createIndex({ "rate": 1 });

// Application indexes
db.user_scheme_applications.createIndex({ "userId": 1, "schemeId": 1 });
db.user_scheme_applications.createIndex({ "applicationId": 1 }, { unique: true });
db.user_scheme_applications.createIndex({ "status": 1, "applicationDate": 1 });

// Performance indexes
db.scheme_performance.createIndex({ "schemeId": 1, "date": 1 });
db.scheme_performance.createIndex({ "date": 1 });
```

---

### Q4: Design a MongoDB schema for financial calculations and projections.

**Answer:**
A comprehensive schema for storing and managing financial calculations and projections:

**Calculation Templates Collection:**
```javascript
// calculation_templates collection
{
  _id: ObjectId("507f1f77bcf86cd799439040"),
  templateId: "calc_sip",
  name: "SIP Future Value Calculator",
  type: "sip",
  description: "Calculate future value of Systematic Investment Plan",
  formula: {
    variables: ["monthlyInvestment", "annualRate", "years"],
    expression: "monthlyInvestment * ((1 + annualRate/12)^(years*12) - 1) / (annualRate/12)",
    parameters: {
      monthlyInvestment: { type: "number", min: 0, max: 1000000 },
      annualRate: { type: "number", min: 0, max: 1 },
      years: { type: "number", min: 1, max: 50 }
    }
  },
  metadata: {
    createdAt: ISODate("2024-01-01T00:00:00Z"),
    updatedAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**User Calculations Collection:**
```javascript
// user_calculations collection
{
  _id: ObjectId("507f1f77bcf86cd799439041"),
  calculationId: "calc_12345",
  userId: "user_12345",
  templateId: "calc_sip",
  inputs: {
    monthlyInvestment: 25000,
    annualRate: 0.12,
    years: 30
  },
  outputs: {
    futureValue: 7500000,
    totalInvestment: 9000000,
    totalReturn: 6600000,
    annualizedReturn: 0.12
  },
  assumptions: {
    inflationRate: 0.06,
    taxRate: 0.20,
    expenseRatio: 0.01
  },
  metadata: {
    calculatedAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Projection Scenarios Collection:**
```javascript
// projection_scenarios collection
{
  _id: ObjectId("507f1f77bcf86cd799439042"),
  scenarioId: "scenario_12345",
  userId: "user_12345",
  name: "Conservative Retirement Plan",
  type: "retirement",
  inputs: {
    currentAge: 30,
    retirementAge: 60,
    lifeExpectancy: 80,
    currentSavings: 500000,
    monthlySIP: 25000,
    monthlyFD: 10000,
    monthlyRD: 5000,
    expectedReturn: {
      mutualFunds: 0.12,
      fd: 0.07,
      rd: 0.07
    },
    inflationRate: 0.06,
    monthlyExpenseAfterRetirement: 100000
  },
  projections: [
    {
      year: 2024,
      age: 30,
      totalValue: 500000,
      mutualFunds: 300000,
      fd: 150000,
      rd: 50000
    },
    {
      year: 2025,
      age: 31,
      totalValue: 750000,
      mutualFunds: 450000,
      fd: 225000,
      rd: 75000
    }
  ],
  summary: {
    totalCorpus: 15000000,
    monthlyPension: 125000,
    corpusAdequacy: 0.8,
    riskScore: 0.3
  },
  metadata: {
    createdAt: ISODate("2024-01-15T10:30:00Z"),
    updatedAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Market Data Collection:**
```javascript
// market_data collection
{
  _id: ObjectId("507f1f77bcf86cd799439043"),
  date: ISODate("2024-01-15"),
  type: "mutual_fund",
  schemeId: "MF_12345",
  schemeName: "HDFC Equity Fund",
  nav: 45.67,
  change: 0.23,
  changePercentage: 0.005,
  aum: 5000000000,
  expenseRatio: 0.015,
  returns: {
    oneDay: 0.005,
    oneWeek: 0.02,
    oneMonth: 0.05,
    threeMonths: 0.12,
    sixMonths: 0.18,
    oneYear: 0.25,
    threeYears: 0.45,
    fiveYears: 0.78
  },
  metadata: {
    source: "AMFI",
    updatedAt: ISODate("2024-01-15T18:00:00Z"),
    version: 1
  }
}
```

**Indexes for Financial Calculations:**
```javascript
// Calculation template indexes
db.calculation_templates.createIndex({ "templateId": 1 }, { unique: true });
db.calculation_templates.createIndex({ "type": 1 });

// User calculation indexes
db.user_calculations.createIndex({ "userId": 1, "templateId": 1 });
db.user_calculations.createIndex({ "calculationId": 1 }, { unique: true });
db.user_calculations.createIndex({ "metadata.calculatedAt": 1 });

// Projection scenario indexes
db.projection_scenarios.createIndex({ "userId": 1, "type": 1 });
db.projection_scenarios.createIndex({ "scenarioId": 1 }, { unique: true });
db.projection_scenarios.createIndex({ "metadata.createdAt": 1 });

// Market data indexes
db.market_data.createIndex({ "date": 1, "type": 1 });
db.market_data.createIndex({ "schemeId": 1, "date": 1 });
db.market_data.createIndex({ "type": 1, "date": 1 });
```

---

### Q5: Design a MongoDB schema for notifications and communication.

**Answer:**
A comprehensive schema for managing user notifications and communication:

**Notification Templates Collection:**
```javascript
// notification_templates collection
{
  _id: ObjectId("507f1f77bcf86cd799439050"),
  templateId: "notif_portfolio_update",
  name: "Portfolio Update Notification",
  type: "portfolio",
  category: "update",
  channels: ["email", "push", "sms"],
  subject: "Your portfolio has been updated",
  content: {
    email: {
      html: "<h1>Portfolio Update</h1><p>Your portfolio value is now ₹{currentValue}</p>",
      text: "Portfolio Update: Your portfolio value is now ₹{currentValue}"
    },
    push: {
      title: "Portfolio Updated",
      body: "Your portfolio value is now ₹{currentValue}",
      icon: "portfolio_icon",
      action: "view_portfolio"
    },
    sms: {
      message: "Portfolio Update: Your portfolio value is now ₹{currentValue}. Check your FutureFunds app for details."
    }
  },
  variables: ["currentValue", "previousValue", "change", "changePercentage"],
  metadata: {
    createdAt: ISODate("2024-01-01T00:00:00Z"),
    updatedAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**User Notifications Collection:**
```javascript
// user_notifications collection
{
  _id: ObjectId("507f1f77bcf86cd799439051"),
  notificationId: "notif_12345",
  userId: "user_12345",
  templateId: "notif_portfolio_update",
  type: "portfolio",
  category: "update",
  status: "sent",
  channels: ["email", "push"],
  content: {
    email: {
      subject: "Your portfolio has been updated",
      html: "<h1>Portfolio Update</h1><p>Your portfolio value is now ₹2,500,000</p>",
      text: "Portfolio Update: Your portfolio value is now ₹2,500,000"
    },
    push: {
      title: "Portfolio Updated",
      body: "Your portfolio value is now ₹2,500,000",
      icon: "portfolio_icon",
      action: "view_portfolio"
    }
  },
  delivery: {
    email: {
      sent: true,
      delivered: true,
      opened: false,
      clicked: false,
      sentAt: ISODate("2024-01-15T10:30:00Z"),
      deliveredAt: ISODate("2024-01-15T10:31:00Z")
    },
    push: {
      sent: true,
      delivered: true,
      opened: true,
      clicked: false,
      sentAt: ISODate("2024-01-15T10:30:00Z"),
      deliveredAt: ISODate("2024-01-15T10:30:05Z"),
      openedAt: ISODate("2024-01-15T10:35:00Z")
    }
  },
  metadata: {
    createdAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Communication Logs Collection:**
```javascript
// communication_logs collection
{
  _id: ObjectId("507f1f77bcf86cd799439052"),
  logId: "log_12345",
  userId: "user_12345",
  type: "email",
  action: "sent",
  details: {
    to: "user@example.com",
    subject: "Portfolio Update",
    templateId: "notif_portfolio_update",
    status: "delivered",
    messageId: "msg_12345"
  },
  metadata: {
    timestamp: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**User Communication Preferences Collection:**
```javascript
// user_communication_preferences collection
{
  _id: ObjectId("507f1f77bcf86cd799439053"),
  userId: "user_12345",
  preferences: {
    email: {
      enabled: true,
      frequency: "daily",
      types: ["portfolio_updates", "market_updates", "scheme_updates"],
      time: "09:00"
    },
    push: {
      enabled: true,
      frequency: "real_time",
      types: ["portfolio_updates", "market_alerts", "scheme_updates"]
    },
    sms: {
      enabled: false,
      frequency: "weekly",
      types: ["important_updates", "security_alerts"]
    }
  },
  metadata: {
    updatedAt: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**Indexes for Notifications:**
```javascript
// Notification template indexes
db.notification_templates.createIndex({ "templateId": 1 }, { unique: true });
db.notification_templates.createIndex({ "type": 1, "category": 1 });

// User notification indexes
db.user_notifications.createIndex({ "userId": 1, "status": 1 });
db.user_notifications.createIndex({ "notificationId": 1 }, { unique: true });
db.user_notifications.createIndex({ "metadata.createdAt": 1 });
db.user_notifications.createIndex({ "type": 1, "category": 1 });

// Communication log indexes
db.communication_logs.createIndex({ "userId": 1, "type": 1 });
db.communication_logs.createIndex({ "logId": 1 }, { unique: true });
db.communication_logs.createIndex({ "metadata.timestamp": 1 });

// Communication preferences indexes
db.user_communication_preferences.createIndex({ "userId": 1 }, { unique: true });
```

---

### Q6: Design a MongoDB schema for audit trails and compliance.

**Answer:**
A comprehensive schema for maintaining audit trails and ensuring compliance:

**Audit Logs Collection:**
```javascript
// audit_logs collection
{
  _id: ObjectId("507f1f77bcf86cd799439060"),
  auditId: "audit_12345",
  userId: "user_12345",
  action: "portfolio_update",
  entity: "portfolio",
  entityId: "port_12345",
  changes: {
    before: {
      totalValue: 2400000,
      lastUpdated: ISODate("2024-01-14T10:30:00Z")
    },
    after: {
      totalValue: 2500000,
      lastUpdated: ISODate("2024-01-15T10:30:00Z")
    }
  },
  metadata: {
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    sessionId: "sess_abc123def456",
    timestamp: ISODate("2024-01-15T10:30:00Z"),
    source: "web_app",
    version: 1
  }
}
```

**Compliance Records Collection:**
```javascript
// compliance_records collection
{
  _id: ObjectId("507f1f77bcf86cd799439061"),
  recordId: "comp_12345",
  userId: "user_12345",
  type: "kyc_verification",
  status: "completed",
  requirements: [
    {
      name: "PAN verification",
      status: "verified",
      verifiedAt: ISODate("2024-01-01T10:00:00Z"),
      documentId: "doc_12345"
    },
    {
      name: "Address verification",
      status: "verified",
      verifiedAt: ISODate("2024-01-01T10:05:00Z"),
      documentId: "doc_12346"
    }
  ],
  documents: [
    {
      documentId: "doc_12345",
      type: "PAN",
      status: "verified",
      uploadedAt: ISODate("2024-01-01T09:00:00Z"),
      verifiedAt: ISODate("2024-01-01T10:00:00Z")
    }
  ],
  metadata: {
    createdAt: ISODate("2024-01-01T09:00:00Z"),
    updatedAt: ISODate("2024-01-01T10:05:00Z"),
    version: 1
  }
}
```

**Data Privacy Records Collection:**
```javascript
// data_privacy_records collection
{
  _id: ObjectId("507f1f77bcf86cd799439062"),
  recordId: "privacy_12345",
  userId: "user_12345",
  type: "data_access",
  action: "view_portfolio",
  dataAccessed: [
    "personal_info",
    "financial_data",
    "portfolio_data"
  ],
  purpose: "portfolio_display",
  legalBasis: "consent",
  retentionPeriod: 7, // years
  metadata: {
    timestamp: ISODate("2024-01-15T10:30:00Z"),
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0...",
    version: 1
  }
}
```

**Indexes for Audit and Compliance:**
```javascript
// Audit log indexes
db.audit_logs.createIndex({ "userId": 1, "action": 1 });
db.audit_logs.createIndex({ "auditId": 1 }, { unique: true });
db.audit_logs.createIndex({ "metadata.timestamp": 1 });
db.audit_logs.createIndex({ "entity": 1, "entityId": 1 });

// Compliance record indexes
db.compliance_records.createIndex({ "userId": 1, "type": 1 });
db.compliance_records.createIndex({ "recordId": 1 }, { unique: true });
db.compliance_records.createIndex({ "status": 1, "metadata.createdAt": 1 });

// Data privacy indexes
db.data_privacy_records.createIndex({ "userId": 1, "type": 1 });
db.data_privacy_records.createIndex({ "recordId": 1 }, { unique: true });
db.data_privacy_records.createIndex({ "metadata.timestamp": 1 });
```

---

### Q7: Design a MongoDB schema for analytics and reporting.

**Answer:**
A comprehensive schema for analytics and reporting:

**Analytics Events Collection:**
```javascript
// analytics_events collection
{
  _id: ObjectId("507f1f77bcf86cd799439070"),
  eventId: "event_12345",
  userId: "user_12345",
  eventType: "portfolio_view",
  eventName: "Portfolio Dashboard Viewed",
  properties: {
    page: "portfolio_dashboard",
    section: "overview",
    device: "mobile",
    browser: "Chrome",
    os: "Android"
  },
  session: {
    sessionId: "sess_abc123def456",
    duration: 300, // seconds
    pageViews: 5
  },
  metadata: {
    timestamp: ISODate("2024-01-15T10:30:00Z"),
    version: 1
  }
}
```

**User Analytics Collection:**
```javascript
// user_analytics collection
{
  _id: ObjectId("507f1f77bcf86cd799439071"),
  userId: "user_12345",
  date: ISODate("2024-01-15"),
  metrics: {
    sessions: 3,
    pageViews: 15,
    timeOnSite: 1800, // seconds
    bounceRate: 0.33,
    conversionRate: 0.05
  },
  behavior: {
    mostVisitedPages: ["portfolio", "calculator", "schemes"],
    averageSessionDuration: 600,
    deviceUsage: {
      mobile: 0.7,
      desktop: 0.3
    }
  },
  engagement: {
    featureUsage: {
      calculator: 5,
      portfolio: 10,
      schemes: 3
    },
    contentInteraction: {
      articlesRead: 2,
      videosWatched: 1,
      toolsUsed: 3
    }
  },
  metadata: {
    calculatedAt: ISODate("2024-01-15T23:59:59Z"),
    version: 1
  }
}
```

**Business Metrics Collection:**
```javascript
// business_metrics collection
{
  _id: ObjectId("507f1f77bcf86cd799439072"),
  date: ISODate("2024-01-15"),
  metrics: {
    users: {
      total: 100000,
      active: 15000,
      new: 500,
      churned: 50
    },
    revenue: {
      total: 5000000,
      subscription: 4000000,
      transaction: 1000000
    },
    engagement: {
      averageSessionDuration: 600,
      pagesPerSession: 3.5,
      bounceRate: 0.35
    }
  },
  metadata: {
    calculatedAt: ISODate("2024-01-15T23:59:59Z"),
    version: 1
  }
}
```

**Indexes for Analytics:**
```javascript
// Analytics event indexes
db.analytics_events.createIndex({ "userId": 1, "eventType": 1 });
db.analytics_events.createIndex({ "eventId": 1 }, { unique: true });
db.analytics_events.createIndex({ "metadata.timestamp": 1 });
db.analytics_events.createIndex({ "eventType": 1, "metadata.timestamp": 1 });

// User analytics indexes
db.user_analytics.createIndex({ "userId": 1, "date": 1 });
db.user_analytics.createIndex({ "date": 1 });

// Business metrics indexes
db.business_metrics.createIndex({ "date": 1 });
db.business_metrics.createIndex({ "metrics.users.total": 1 });
```

---

This completes the first 7 questions of the intermediate level NoSQL questions, covering advanced schema design for the FutureFunds platform.
