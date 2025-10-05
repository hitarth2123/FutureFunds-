---
noteId: "nosql-beginner-001"
tags: []

---

# Beginner Level - NoSQL Database & Architecture (25 Questions)

## Table of Contents
1. [Database Basics (Q1-Q5)](#database-basics-q1-q5)
2. [MongoDB Fundamentals (Q6-Q10)](#mongodb-fundamentals-q6-q10)
3. [Data Modeling (Q11-Q15)](#data-modeling-q11-q15)
4. [Queries & Operations (Q16-Q20)](#queries--operations-q16-q20)
5. [Basic Concepts (Q21-Q25)](#basic-concepts-q21-q25)

---

## Database Basics (Q1-Q5)

### Q1: What is a database and why do we need one?

**Answer:**
A database is a collection of organized data that can be easily accessed, managed, and updated.

**Why we need databases:**
- **Storage**: Store large amounts of data
- **Organization**: Keep data organized and structured
- **Access**: Quickly find and retrieve data
- **Security**: Protect data from unauthorized access
- **Backup**: Keep data safe and recoverable

**Example in FutureFunds:**
```javascript
// We store user retirement scenarios in a database
{
  userId: "user123",
  scenarioName: "Retirement Plan 2024",
  currentAge: 30,
  monthlySIP: 15000,
  createdAt: "2024-01-15"
}
```

**Real-world Context**: In our retirement calculator, we use a database to store user scenarios, calculation results, and user preferences so they can access their data anytime.

---

### Q2: What is the difference between SQL and NoSQL databases?

**Answer:**
**SQL (Relational) Databases:**
- Use tables with rows and columns
- Fixed schema (structure)
- Use SQL language
- Examples: MySQL, PostgreSQL

**NoSQL (Non-relational) Databases:**
- Use documents, key-value pairs, or graphs
- Flexible schema
- Various query languages
- Examples: MongoDB, Redis, Neo4j

**Comparison:**
| Feature | SQL | NoSQL |
|--------|-----|-------|
| Structure | Tables | Documents |
| Schema | Fixed | Flexible |
| Language | SQL | Various |
| Scaling | Vertical | Horizontal |

**FutureFunds Choice:**
We chose MongoDB (NoSQL) because:
- Retirement data varies by user
- Need flexible schema for different scenarios
- Easy to add new features
- Better for web applications

---

### Q3: What is MongoDB and why did we choose it?

**Answer:**
MongoDB is a NoSQL database that stores data in flexible, JSON-like documents.

**Key Features:**
- **Document-based**: Stores data as documents
- **Flexible Schema**: No fixed structure required
- **Scalable**: Can handle large amounts of data
- **Fast**: Quick queries and updates

**Why FutureFunds chose MongoDB:**
```javascript
// Retirement data varies by user - perfect for MongoDB
{
  userId: "user123",
  input: {
    currentAge: 30,
    monthlySIP: 15000,
    schemes: ["PPF", "EPF"] // Some users have schemes, others don't
  },
  output: {
    achievedCorpus: 2500000,
    breakdown: {
      mutualFunds: 1500000,
      schemes: 1000000
    }
  }
}
```

**Benefits for FutureFunds:**
- **Flexibility**: Different users have different data
- **Speed**: Fast queries for real-time calculations
- **Scalability**: Can grow with our user base
- **Developer Friendly**: Easy to work with

---

### Q4: What is a document in MongoDB?

**Answer:**
A document is a record in MongoDB, similar to a row in a SQL table, but much more flexible.

**Document Structure:**
- **JSON-like format**: Key-value pairs
- **Nested data**: Can contain objects and arrays
- **Flexible**: Each document can have different fields
- **Unique ID**: Every document has a unique _id

**Example in FutureFunds:**
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  userId: "user123",
  name: "My Retirement Plan",
  input: {
    currentAge: 30,
    retirementAge: 60,
    monthlySIP: 15000,
    expectedReturn: {
      mutualFunds: 12,
      fd: 7,
      rd: 6
    }
  },
  output: {
    requiredCorpus: 25000000,
    achievedCorpus: 21500000,
    isGoalAchievable: false
  },
  createdAt: ISODate("2024-01-15T10:30:00Z")
}
```

**Key Points:**
- **Flexible**: Can add new fields anytime
- **Nested**: Can store complex data structures
- **Self-contained**: All related data in one document
- **Fast**: Quick to read and write

---

### Q5: What is a collection in MongoDB?

**Answer:**
A collection is a group of documents in MongoDB, similar to a table in SQL databases.

**Collection Characteristics:**
- **Grouped Documents**: Contains related documents
- **No Schema**: Documents can have different structures
- **Named**: Each collection has a name
- **Indexed**: Can have indexes for faster queries

**FutureFunds Collections:**
```javascript
// scenarios collection
db.scenarios.find()
// Returns all retirement scenarios

// users collection  
db.users.find()
// Returns all user profiles

// analytics collection
db.analytics.find()
// Returns all user activity data
```

**Example Queries:**
```javascript
// Find all scenarios for a user
db.scenarios.find({userId: "user123"})

// Find scenarios created this year
db.scenarios.find({createdAt: {$gte: new Date("2024-01-01")}})

// Count total scenarios
db.scenarios.count()
```

**Real-world Context**: We use collections to organize different types of data in our retirement calculator - user scenarios, user profiles, and analytics data.

---

## MongoDB Fundamentals (Q6-Q10)

### Q6: How do you insert data into MongoDB?

**Answer:**
You can insert data into MongoDB using the `insertOne()` or `insertMany()` methods.

**Single Document Insert:**
```javascript
// Insert one scenario
db.scenarios.insertOne({
  userId: "user123",
  name: "Retirement Plan 2024",
  currentAge: 30,
  monthlySIP: 15000,
  createdAt: new Date()
})
```

**Multiple Documents Insert:**
```javascript
// Insert multiple scenarios
db.scenarios.insertMany([
  {
    userId: "user123",
    name: "Conservative Plan",
    monthlySIP: 10000
  },
  {
    userId: "user123", 
    name: "Aggressive Plan",
    monthlySIP: 20000
  }
])
```

**FutureFunds Example:**
```javascript
// Insert new retirement scenario
const newScenario = {
  userId: "user123",
  name: "My Retirement Plan",
  input: {
    currentAge: 30,
    retirementAge: 60,
    monthlySIP: 15000
  },
  output: {
    achievedCorpus: 2500000,
    isGoalAchievable: true
  },
  createdAt: new Date()
}

db.scenarios.insertOne(newScenario)
```

**Key Points:**
- **Automatic ID**: MongoDB creates unique _id if not provided
- **Validation**: Can add validation rules
- **Atomic**: Each insert is atomic (all or nothing)

---

### Q7: How do you find/query data in MongoDB?

**Answer:**
You use the `find()` method to query data in MongoDB with various filters and options.

**Basic Queries:**
```javascript
// Find all documents
db.scenarios.find()

// Find with filter
db.scenarios.find({userId: "user123"})

// Find with multiple conditions
db.scenarios.find({
  userId: "user123",
  currentAge: {$gte: 30}
})
```

**Query Operators:**
```javascript
// Comparison operators
db.scenarios.find({monthlySIP: {$gt: 10000}})  // Greater than
db.scenarios.find({currentAge: {$lte: 35}})    // Less than or equal
db.scenarios.find({name: {$ne: "Test"}})       // Not equal

// Logical operators
db.scenarios.find({
  $and: [
    {userId: "user123"},
    {monthlySIP: {$gt: 10000}}
  ]
})
```

**FutureFunds Queries:**
```javascript
// Find user's scenarios
db.scenarios.find({userId: "user123"})

// Find scenarios with high SIP
db.scenarios.find({monthlySIP: {$gte: 20000}})

// Find recent scenarios
db.scenarios.find({
  createdAt: {$gte: new Date("2024-01-01")}
})
```

**Key Points:**
- **Flexible**: Can query any field
- **Powerful**: Many operators available
- **Fast**: Indexes make queries fast
- **Readable**: JSON-like query syntax

---

### Q8: How do you update data in MongoDB?

**Answer:**
You use `updateOne()` or `updateMany()` methods to modify existing documents in MongoDB.

**Update Methods:**
```javascript
// Update one document
db.scenarios.updateOne(
  {userId: "user123"},  // Filter
  {$set: {monthlySIP: 20000}}  // Update
)

// Update multiple documents
db.scenarios.updateMany(
  {currentAge: {$lt: 30}},
  {$set: {riskProfile: "Aggressive"}}
)
```

**Update Operators:**
```javascript
// $set - Set field value
db.scenarios.updateOne(
  {_id: ObjectId("...")},
  {$set: {monthlySIP: 25000}}
)

// $inc - Increment numeric value
db.scenarios.updateOne(
  {_id: ObjectId("...")},
  {$inc: {currentAge: 1}}
)

// $push - Add to array
db.scenarios.updateOne(
  {_id: ObjectId("...")},
  {$push: {schemes: "NPS"}}
)
```

**FutureFunds Example:**
```javascript
// Update user's scenario
db.scenarios.updateOne(
  {userId: "user123", name: "My Plan"},
  {
    $set: {
      "input.monthlySIP": 20000,
      "input.expectedReturn.mutualFunds": 15,
      updatedAt: new Date()
    }
  }
)
```

**Key Points:**
- **Atomic**: Each update is atomic
- **Flexible**: Can update nested fields
- **Safe**: Use filters to target specific documents
- **Efficient**: Only updates changed fields

---

### Q9: How do you delete data in MongoDB?

**Answer:**
You use `deleteOne()` or `deleteMany()` methods to remove documents from MongoDB.

**Delete Methods:**
```javascript
// Delete one document
db.scenarios.deleteOne({userId: "user123"})

// Delete multiple documents
db.scenarios.deleteMany({currentAge: {$lt: 25}})

// Delete all documents (be careful!)
db.scenarios.deleteMany({})
```

**FutureFunds Examples:**
```javascript
// Delete specific scenario
db.scenarios.deleteOne({
  userId: "user123",
  name: "Old Plan"
})

// Delete user's old scenarios
db.scenarios.deleteMany({
  userId: "user123",
  createdAt: {$lt: new Date("2023-01-01")}
})

// Soft delete (mark as deleted)
db.scenarios.updateOne(
  {_id: ObjectId("...")},
  {$set: {deleted: true, deletedAt: new Date()}}
)
```

**Safety Tips:**
- **Always use filters**: Don't delete all documents
- **Test first**: Use find() to check what will be deleted
- **Backup**: Keep backups before major deletions
- **Soft delete**: Mark as deleted instead of removing

---

### Q10: What is an index in MongoDB and why do you need it?

**Answer:**
An index is a data structure that improves the speed of database queries by creating a quick lookup path.

**Why Indexes Matter:**
- **Speed**: Makes queries much faster
- **Efficiency**: Reduces time to find data
- **Performance**: Better user experience
- **Scalability**: Works with large datasets

**Creating Indexes:**
```javascript
// Single field index
db.scenarios.createIndex({userId: 1})

// Compound index (multiple fields)
db.scenarios.createIndex({userId: 1, createdAt: -1})

// Text index for search
db.scenarios.createIndex({name: "text"})
```

**FutureFunds Indexes:**
```javascript
// Find user scenarios quickly
db.scenarios.createIndex({userId: 1})

// Find recent scenarios
db.scenarios.createIndex({createdAt: -1})

// Find by user and date
db.scenarios.createIndex({userId: 1, createdAt: -1})

// Search scenario names
db.scenarios.createIndex({name: "text"})
```

**Index Types:**
- **Single Field**: One field (userId)
- **Compound**: Multiple fields (userId + createdAt)
- **Text**: Full-text search (name)
- **Unique**: No duplicate values

**Real-world Context**: Indexes help our retirement calculator quickly find user scenarios, even with millions of users and thousands of scenarios per user.

---

## Data Modeling (Q11-Q15)

### Q11: What is data modeling and why is it important?

**Answer:**
Data modeling is the process of designing how data will be stored and organized in a database.

**Why Important:**
- **Structure**: Organizes data logically
- **Efficiency**: Makes queries faster
- **Scalability**: Handles growth well
- **Maintenance**: Easier to update and fix

**Data Modeling Process:**
1. **Understand Requirements**: What data do you need?
2. **Design Structure**: How will data be organized?
3. **Consider Relationships**: How is data connected?
4. **Plan for Growth**: Will it scale?

**FutureFunds Data Model:**
```javascript
// User document
{
  _id: ObjectId("..."),
  userId: "user123",
  email: "user@example.com",
  name: "John Doe",
  createdAt: Date
}

// Scenario document
{
  _id: ObjectId("..."),
  userId: "user123",  // Links to user
  name: "Retirement Plan",
  input: { /* retirement inputs */ },
  output: { /* calculation results */ },
  createdAt: Date
}
```

**Key Principles:**
- **Keep related data together**: User and scenarios
- **Avoid deep nesting**: Don't go too many levels deep
- **Plan for queries**: Design for how you'll access data
- **Consider growth**: Will it work with more data?

---

### Q12: What is the difference between embedding and referencing in MongoDB?

**Answer:**
**Embedding**: Store related data inside the same document
**Referencing**: Store related data in separate documents with references

**Embedding Example:**
```javascript
// User with embedded scenarios
{
  _id: ObjectId("..."),
  userId: "user123",
  name: "John Doe",
  scenarios: [
    {
      name: "Plan 1",
      monthlySIP: 15000
    },
    {
      name: "Plan 2", 
      monthlySIP: 20000
    }
  ]
}
```

**Referencing Example:**
```javascript
// User document
{
  _id: ObjectId("..."),
  userId: "user123",
  name: "John Doe"
}

// Separate scenarios collection
{
  _id: ObjectId("..."),
  userId: "user123",  // Reference to user
  name: "Plan 1",
  monthlySIP: 15000
}
```

**When to Use Embedding:**
- **Small data**: Limited number of related items
- **Always together**: Data always accessed together
- **No updates**: Embedded data rarely changes

**When to Use Referencing:**
- **Large data**: Many related items
- **Independent access**: Data accessed separately
- **Frequent updates**: Referenced data changes often

**FutureFunds Choice:**
We use referencing because:
- Users can have many scenarios
- Scenarios are accessed independently
- Scenarios are updated frequently

---

### Q13: What is schema validation in MongoDB?

**Answer:**
Schema validation is a way to enforce rules on documents when they are inserted or updated in MongoDB.

**Why Use Validation:**
- **Data Quality**: Ensures data is correct
- **Consistency**: All documents follow same rules
- **Error Prevention**: Catches mistakes early
- **Documentation**: Shows what data should look like

**Validation Rules:**
```javascript
// Create collection with validation
db.createCollection("scenarios", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "name", "input"],
      properties: {
        userId: {
          bsonType: "string",
          minLength: 5
        },
        name: {
          bsonType: "string",
          maxLength: 100
        },
        input: {
          bsonType: "object",
          required: ["currentAge", "monthlySIP"],
          properties: {
            currentAge: {
              bsonType: "int",
              minimum: 18,
              maximum: 80
            },
            monthlySIP: {
              bsonType: "double",
              minimum: 0
            }
          }
        }
      }
    }
  }
})
```

**FutureFunds Validation:**
```javascript
// Validate retirement input
{
  currentAge: { $gte: 18, $lte: 80 },
  monthlySIP: { $gte: 0 },
  expectedReturn: {
    mutualFunds: { $gte: 0, $lte: 30 },
    fd: { $gte: 0, $lte: 15 }
  }
}
```

**Benefits:**
- **Prevents bad data**: Stops invalid documents
- **Clear rules**: Everyone knows what's allowed
- **Better debugging**: Easier to find problems
- **Data integrity**: Maintains data quality

---

### Q14: What is data normalization and denormalization?

**Answer:**
**Normalization**: Organizing data to reduce redundancy and improve consistency
**Denormalization**: Intentionally adding redundant data to improve performance

**Normalized Example:**
```javascript
// Users collection
{_id: 1, name: "John", email: "john@example.com"}

// Scenarios collection  
{_id: 1, userId: 1, name: "Plan 1"}
{_id: 2, userId: 1, name: "Plan 2"}
```

**Denormalized Example:**
```javascript
// User with embedded scenarios
{
  _id: 1,
  name: "John",
  email: "john@example.com",
  scenarios: [
    {name: "Plan 1"},
    {name: "Plan 2"}
  ]
}
```

**When to Normalize:**
- **Data changes often**: Avoid updating multiple places
- **Storage is expensive**: Reduce data duplication
- **Consistency is critical**: Ensure data accuracy

**When to Denormalize:**
- **Read performance**: Faster queries
- **Data rarely changes**: Less update overhead
- **Query patterns**: Data always accessed together

**FutureFunds Approach:**
We use denormalization because:
- Scenarios are read more than written
- We want fast queries
- Data doesn't change often
- User experience is priority

---

### Q15: What is data migration and why might you need it?

**Answer:**
Data migration is the process of moving data from one structure to another, usually when updating your application.

**Why Migrate Data:**
- **Schema changes**: Adding new fields
- **Database upgrades**: Moving to new version
- **Performance improvements**: Better data structure
- **Feature additions**: New functionality

**Migration Example:**
```javascript
// Old schema
{
  userId: "user123",
  monthlySIP: 15000,
  expectedReturn: 12
}

// New schema
{
  userId: "user123",
  input: {
    monthlySIP: 15000,
    expectedReturn: {
      mutualFunds: 12,
      fd: 7,
      rd: 6
    }
  }
}

// Migration script
db.scenarios.find().forEach(function(doc) {
  db.scenarios.updateOne(
    {_id: doc._id},
    {
      $set: {
        input: {
          monthlySIP: doc.monthlySIP,
          expectedReturn: {
            mutualFunds: doc.expectedReturn,
            fd: 7,
            rd: 6
          }
        }
      },
      $unset: {
        monthlySIP: "",
        expectedReturn: ""
      }
    }
  )
})
```

**Migration Best Practices:**
- **Backup first**: Always backup before migrating
- **Test on copy**: Try migration on test data
- **Plan for downtime**: Some migrations need app downtime
- **Monitor progress**: Track migration status
- **Rollback plan**: Know how to undo if needed

---

## Queries & Operations (Q16-Q20)

### Q16: What are MongoDB aggregation pipelines?

**Answer:**
Aggregation pipelines are a way to process and transform data through a series of stages, like a factory assembly line.

**Pipeline Stages:**
- **$match**: Filter documents
- **$group**: Group documents together
- **$sort**: Sort results
- **$project**: Select specific fields
- **$limit**: Limit number of results

**Basic Example:**
```javascript
db.scenarios.aggregate([
  { $match: { userId: "user123" } },  // Filter by user
  { $group: { 
    _id: "$name", 
    count: { $sum: 1 } 
  }},  // Group by name
  { $sort: { count: -1 } }  // Sort by count
])
```

**FutureFunds Example:**
```javascript
// Find average SIP by age group
db.scenarios.aggregate([
  {
    $group: {
      _id: {
        ageGroup: {
          $switch: {
            branches: [
              { case: { $lt: ["$input.currentAge", 30] }, then: "20-29" },
              { case: { $lt: ["$input.currentAge", 40] }, then: "30-39" },
              { case: { $gte: ["$input.currentAge", 40] }, then: "40+" }
            ]
          }
        }
      },
      avgSIP: { $avg: "$input.monthlySIP" },
      count: { $sum: 1 }
    }
  },
  { $sort: { avgSIP: -1 } }
])
```

**Benefits:**
- **Powerful**: Complex data processing
- **Efficient**: Database does the work
- **Flexible**: Many stages available
- **Fast**: Optimized for performance

---

### Q17: What is the difference between find() and findOne()?

**Answer:**
**find()**: Returns a cursor with multiple documents
**findOne()**: Returns a single document or null

**find() Example:**
```javascript
// Returns all matching documents
let scenarios = db.scenarios.find({userId: "user123"})
scenarios.forEach(function(scenario) {
  print(scenario.name)
})
```

**findOne() Example:**
```javascript
// Returns first matching document or null
let scenario = db.scenarios.findOne({userId: "user123"})
if (scenario) {
  print("Found: " + scenario.name)
} else {
  print("No scenario found")
}
```

**FutureFunds Usage:**
```javascript
// Get all user scenarios
let allScenarios = db.scenarios.find({userId: "user123"})

// Get specific scenario
let specificScenario = db.scenarios.findOne({
  userId: "user123",
  name: "My Retirement Plan"
})

// Get latest scenario
let latestScenario = db.scenarios.findOne(
  {userId: "user123"},
  {sort: {createdAt: -1}}
)
```

**When to Use:**
- **find()**: When you need multiple results
- **findOne()**: When you need one specific result
- **Performance**: findOne() is faster for single results
- **Memory**: findOne() uses less memory

---

### Q18: What are MongoDB operators and how do you use them?

**Answer:**
MongoDB operators are special keywords that perform specific operations on data.

**Query Operators:**
```javascript
// Comparison operators
db.scenarios.find({monthlySIP: {$gt: 10000}})    // Greater than
db.scenarios.find({currentAge: {$gte: 30}})      // Greater than or equal
db.scenarios.find({name: {$ne: "Test"}})         // Not equal
db.scenarios.find({userId: {$in: ["user1", "user2"]}})  // In array

// Logical operators
db.scenarios.find({
  $and: [
    {userId: "user123"},
    {monthlySIP: {$gt: 10000}}
  ]
})

db.scenarios.find({
  $or: [
    {currentAge: {$lt: 30}},
    {monthlySIP: {$gt: 20000}}
  ]
})
```

**Update Operators:**
```javascript
// $set - Set field value
db.scenarios.updateOne(
  {_id: ObjectId("...")},
  {$set: {monthlySIP: 25000}}
)

// $inc - Increment value
db.scenarios.updateOne(
  {_id: ObjectId("...")},
  {$inc: {currentAge: 1}}
)

// $push - Add to array
db.scenarios.updateOne(
  {_id: ObjectId("...")},
  {$push: {schemes: "NPS"}}
)
```

**FutureFunds Examples:**
```javascript
// Find high-value scenarios
db.scenarios.find({
  "output.achievedCorpus": {$gte: 10000000}
})

// Update user's scenario
db.scenarios.updateOne(
  {userId: "user123", name: "My Plan"},
  {
    $set: {
      "input.monthlySIP": 20000,
      updatedAt: new Date()
    }
  }
)
```

---

### Q19: What is sorting in MongoDB and how do you use it?

**Answer:**
Sorting arranges query results in a specific order using the `sort()` method.

**Sort Syntax:**
```javascript
// Sort by single field
db.scenarios.find().sort({name: 1})    // Ascending (A-Z)
db.scenarios.find().sort({name: -1})   // Descending (Z-A)

// Sort by multiple fields
db.scenarios.find().sort({userId: 1, createdAt: -1})
```

**Sort Values:**
- **1**: Ascending order (A-Z, 0-9)
- **-1**: Descending order (Z-A, 9-0)

**FutureFunds Examples:**
```javascript
// Get user's scenarios by creation date (newest first)
db.scenarios.find({userId: "user123"}).sort({createdAt: -1})

// Get scenarios by SIP amount (highest first)
db.scenarios.find().sort({"input.monthlySIP": -1})

// Get scenarios by user and date
db.scenarios.find().sort({userId: 1, createdAt: -1})

// Get top 10 scenarios by corpus
db.scenarios.find().sort({"output.achievedCorpus": -1}).limit(10)
```

**Performance Tips:**
- **Use indexes**: Sort fields should be indexed
- **Limit results**: Use limit() with sort()
- **Compound indexes**: For multiple sort fields
- **Avoid large sorts**: Can be slow on big datasets

---

### Q20: What is limiting results in MongoDB?

**Answer:**
Limiting results controls how many documents are returned from a query using the `limit()` method.

**Limit Syntax:**
```javascript
// Limit to 10 results
db.scenarios.find().limit(10)

// Limit with sort
db.scenarios.find().sort({createdAt: -1}).limit(5)

// Limit with skip (pagination)
db.scenarios.find().skip(10).limit(10)  // Page 2 (skip first 10)
```

**FutureFunds Examples:**
```javascript
// Get user's 5 most recent scenarios
db.scenarios.find({userId: "user123"})
  .sort({createdAt: -1})
  .limit(5)

// Get top 10 scenarios by corpus
db.scenarios.find()
  .sort({"output.achievedCorpus": -1})
  .limit(10)

// Pagination - get page 2 (scenarios 11-20)
db.scenarios.find({userId: "user123"})
  .sort({createdAt: -1})
  .skip(10)
  .limit(10)
```

**Why Use Limit:**
- **Performance**: Faster queries
- **Memory**: Uses less memory
- **User Experience**: Shows results quickly
- **Pagination**: Break large results into pages

**Best Practices:**
- **Always use with sort**: For consistent results
- **Use indexes**: For better performance
- **Consider skip**: For pagination
- **Test performance**: Large limits can be slow

---

## Basic Concepts (Q21-Q25)

### Q21: What is a database connection and why do you need it?

**Answer:**
A database connection is a link between your application and the database that allows them to communicate.

**Why You Need Connections:**
- **Communication**: App and database talk to each other
- **Data Transfer**: Send queries and receive results
- **Security**: Authenticate and authorize access
- **Performance**: Reuse connections for efficiency

**Connection Example:**
```javascript
// Connect to MongoDB
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('futureFunds');
    return db;
  } catch (error) {
    console.error('Connection failed:', error);
  }
}
```

**FutureFunds Connection:**
```javascript
// Connect to FutureFunds database
const db = await connectToDatabase();
const scenarios = db.collection('scenarios');

// Use the connection
const userScenarios = await scenarios.find({userId: "user123"}).toArray();
```

**Connection Management:**
- **Open**: Create connection when needed
- **Reuse**: Use same connection for multiple operations
- **Close**: Close when done to free resources
- **Pool**: Use connection pool for multiple users

---

### Q22: What is error handling in database operations?

**Answer:**
Error handling is the process of catching and managing errors that occur during database operations.

**Common Database Errors:**
- **Connection errors**: Can't connect to database
- **Query errors**: Invalid query syntax
- **Validation errors**: Data doesn't meet rules
- **Permission errors**: Not allowed to access data

**Error Handling Example:**
```javascript
async function saveScenario(scenarioData) {
  try {
    const result = await db.scenarios.insertOne(scenarioData);
    console.log('Scenario saved:', result.insertedId);
    return { success: true, id: result.insertedId };
  } catch (error) {
    console.error('Error saving scenario:', error);
    return { success: false, error: error.message };
  }
}
```

**FutureFunds Error Handling:**
```javascript
async function getUserScenarios(userId) {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const scenarios = await db.scenarios
      .find({userId})
      .sort({createdAt: -1})
      .toArray();
    
    return { success: true, data: scenarios };
  } catch (error) {
    console.error('Database error:', error);
    return { 
      success: false, 
      error: 'Failed to fetch scenarios',
      details: error.message 
    };
  }
}
```

**Error Handling Best Practices:**
- **Always use try-catch**: Catch errors before they crash app
- **Log errors**: Record errors for debugging
- **User-friendly messages**: Don't show technical details to users
- **Graceful degradation**: App continues working even with errors

---

### Q23: What is data backup and why is it important?

**Answer:**
Data backup is creating copies of your database to protect against data loss.

**Why Backup is Important:**
- **Data Loss**: Protects against accidental deletion
- **Hardware Failure**: Server crashes or disk failures
- **Human Error**: Mistakes in operations
- **Disasters**: Natural disasters or cyber attacks

**Backup Types:**
- **Full Backup**: Complete copy of all data
- **Incremental**: Only changed data since last backup
- **Automated**: Regular automatic backups
- **Manual**: On-demand backups

**MongoDB Backup:**
```bash
# Create backup
mongodump --db futureFunds --out /backup/2024-01-15

# Restore backup
mongorestore --db futureFunds /backup/2024-01-15/futureFunds
```

**FutureFunds Backup Strategy:**
- **Daily backups**: Automatic daily backups
- **Multiple locations**: Local and cloud storage
- **Test restores**: Regularly test backup restoration
- **Retention policy**: Keep backups for 30 days

**Backup Best Practices:**
- **Regular schedule**: Automated daily backups
- **Test restores**: Verify backups work
- **Multiple locations**: Don't keep all backups in one place
- **Documentation**: Record backup procedures

---

### Q24: What is database security and how do you protect data?

**Answer:**
Database security is protecting your database from unauthorized access, data breaches, and other security threats.

**Security Measures:**
- **Authentication**: Verify who can access
- **Authorization**: Control what they can do
- **Encryption**: Protect data in transit and at rest
- **Access Control**: Limit who can access what

**MongoDB Security:**
```javascript
// Create user with specific permissions
db.createUser({
  user: "appUser",
  pwd: "securePassword",
  roles: [
    { role: "readWrite", db: "futureFunds" }
  ]
})

// Connect with authentication
const client = new MongoClient('mongodb://appUser:securePassword@localhost:27017/futureFunds');
```

**FutureFunds Security:**
- **User authentication**: Firebase Auth for users
- **Database users**: Separate users for app and admin
- **Data encryption**: Encrypt sensitive data
- **Access logs**: Track who accesses what
- **Regular updates**: Keep database updated

**Security Best Practices:**
- **Strong passwords**: Use complex passwords
- **Least privilege**: Give minimum required access
- **Regular updates**: Keep software updated
- **Monitor access**: Track who accesses data
- **Encrypt data**: Protect sensitive information

---

### Q25: What is database performance and how do you optimize it?

**Answer:**
Database performance is how fast and efficiently your database responds to queries and operations.

**Performance Factors:**
- **Query speed**: How fast queries execute
- **Memory usage**: How much memory is used
- **CPU usage**: How much processing power needed
- **Disk I/O**: How much disk reading/writing

**Optimization Techniques:**
- **Indexes**: Create indexes on frequently queried fields
- **Query optimization**: Write efficient queries
- **Connection pooling**: Reuse database connections
- **Caching**: Store frequently accessed data in memory

**FutureFunds Optimization:**
```javascript
// Create indexes for common queries
db.scenarios.createIndex({userId: 1})  // Find by user
db.scenarios.createIndex({createdAt: -1})  // Sort by date
db.scenarios.createIndex({userId: 1, createdAt: -1})  // Compound index

// Optimize queries
// Good: Uses index
db.scenarios.find({userId: "user123"}).sort({createdAt: -1})

// Bad: Can't use index efficiently
db.scenarios.find({$or: [{userId: "user123"}, {name: "Plan"}]})
```

**Performance Monitoring:**
- **Query time**: Measure how long queries take
- **Index usage**: Check if indexes are being used
- **Memory usage**: Monitor memory consumption
- **Slow queries**: Identify and optimize slow queries

**Performance Best Practices:**
- **Use indexes**: Create indexes for common queries
- **Limit results**: Use limit() to reduce data transfer
- **Avoid large operations**: Break large operations into smaller ones
- **Monitor performance**: Regularly check database performance
- **Optimize queries**: Write efficient queries

---

This completes the 25 beginner-level NoSQL questions. Each question includes:
- Clear explanation of database concepts
- Practical MongoDB examples
- Real-world context from FutureFunds
- Simple, easy-to-understand answers
- Basic database terminology and operations
