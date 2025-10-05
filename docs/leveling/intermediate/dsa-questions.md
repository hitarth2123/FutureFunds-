---
noteId: "dsa-intermediate-001"
tags: []

---

# Intermediate Level - Data Structures & Algorithms (35 Questions)

## Table of Contents
1. [Advanced Data Structures (Q1-Q7)](#advanced-data-structures-q1-q7)
2. [Algorithm Design (Q8-Q14)](#algorithm-design-q8-q14)
3. [Time & Space Complexity (Q15-Q21)](#time--space-complexity-q15-q21)
4. [Sorting & Searching (Q22-Q28)](#sorting--searching-q22-q28)
5. [Dynamic Programming (Q29-Q35)](#dynamic-programming-q29-q35)

---

## Advanced Data Structures (Q1-Q7)

### Q1: Implement a priority queue for managing retirement investment priorities.

**Answer:**
A priority queue is a data structure where elements are served based on priority rather than order of arrival.

**Implementation:**
```typescript
class PriorityQueue<T> {
  private heap: Array<{item: T, priority: number}> = [];
  
  enqueue(item: T, priority: number): void {
    this.heap.push({item, priority});
    this.heapifyUp(this.heap.length - 1);
  }
  
  dequeue(): T | null {
    if (this.heap.length === 0) return null;
    
    const max = this.heap[0];
    this.heap[0] = this.heap[this.heap.length - 1];
    this.heap.pop();
    this.heapifyDown(0);
    
    return max.item;
  }
  
  private heapifyUp(index: number): void {
    if (index === 0) return;
    
    const parentIndex = Math.floor((index - 1) / 2);
    if (this.heap[parentIndex].priority < this.heap[index].priority) {
      [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
      this.heapifyUp(parentIndex);
    }
  }
  
  private heapifyDown(index: number): void {
    const leftChild = 2 * index + 1;
    const rightChild = 2 * index + 2;
    let largest = index;
    
    if (leftChild < this.heap.length && 
        this.heap[leftChild].priority > this.heap[largest].priority) {
      largest = leftChild;
    }
    
    if (rightChild < this.heap.length && 
        this.heap[rightChild].priority > this.heap[largest].priority) {
      largest = rightChild;
    }
    
    if (largest !== index) {
      [this.heap[index], this.heap[largest]] = [this.heap[largest], this.heap[index]];
      this.heapifyDown(largest);
    }
  }
}
```

**FutureFunds Usage:**
```typescript
// Priority queue for investment recommendations
const investmentQueue = new PriorityQueue<string>();

investmentQueue.enqueue("Emergency Fund", 10);  // Highest priority
investmentQueue.enqueue("Retirement Planning", 8);
investmentQueue.enqueue("Tax Saving", 6);
investmentQueue.enqueue("Vacation Fund", 3);   // Lowest priority

// Process investments by priority
while (investmentQueue.size() > 0) {
  const nextInvestment = investmentQueue.dequeue();
  console.log(`Next priority: ${nextInvestment}`);
}
```

**Time Complexity:**
- **Enqueue**: O(log n)
- **Dequeue**: O(log n)
- **Peek**: O(1)

---

### Q2: Design a hash table for caching retirement calculation results.

**Answer:**
A hash table provides O(1) average time complexity for insert, delete, and search operations.

**Implementation:**
```typescript
class HashTable<K, V> {
  private buckets: Array<Array<{key: K, value: V}>>;
  private size: number;
  private capacity: number;
  
  constructor(initialCapacity: number = 16) {
    this.capacity = initialCapacity;
    this.size = 0;
    this.buckets = new Array(this.capacity).fill(null).map(() => []);
  }
  
  private hash(key: K): number {
    const keyString = JSON.stringify(key);
    let hash = 0;
    for (let i = 0; i < keyString.length; i++) {
      const char = keyString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % this.capacity;
  }
  
  set(key: K, value: V): void {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    
    // Check if key already exists
    for (let i = 0; i < bucket.length; i++) {
      if (JSON.stringify(bucket[i].key) === JSON.stringify(key)) {
        bucket[i].value = value;
        return;
      }
    }
    
    // Add new key-value pair
    bucket.push({key, value});
    this.size++;
    
    // Resize if load factor is too high
    if (this.size > this.capacity * 0.75) {
      this.resize();
    }
  }
  
  get(key: K): V | undefined {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    
    for (let i = 0; i < bucket.length; i++) {
      if (JSON.stringify(bucket[i].key) === JSON.stringify(key)) {
        return bucket[i].value;
      }
    }
    
    return undefined;
  }
  
  private resize(): void {
    const oldBuckets = this.buckets;
    this.capacity *= 2;
    this.size = 0;
    this.buckets = new Array(this.capacity).fill(null).map(() => []);
    
    for (const bucket of oldBuckets) {
      for (const item of bucket) {
        this.set(item.key, item.value);
      }
    }
  }
}
```

**FutureFunds Usage:**
```typescript
// Cache for retirement calculations
const calculationCache = new HashTable<string, number>();

function calculateSIPWithCache(monthlyInvestment: number, rate: number, years: number): number {
  const cacheKey = `${monthlyInvestment}-${rate}-${years}`;
  
  // Check cache first
  const cachedResult = calculationCache.get(cacheKey);
  if (cachedResult !== undefined) {
    console.log('Cache hit!');
    return cachedResult;
  }
  
  // Calculate if not in cache
  const result = calculateSIPFutureValue(monthlyInvestment, rate, years);
  
  // Store in cache
  calculationCache.set(cacheKey, result);
  
  return result;
}
```

**Time Complexity:**
- **Average Case**: O(1) for all operations
- **Worst Case**: O(n) due to collisions
- **Space Complexity**: O(n)

---

### Q3: Implement a binary search tree for organizing investment schemes by interest rate.

**Answer:**
A BST allows efficient searching, insertion, and deletion with O(log n) average time complexity.

**Implementation:**
```typescript
class TreeNode {
  constructor(
    public scheme: string,
    public rate: number,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null
  ) {}
}

class InvestmentBST {
  private root: TreeNode | null = null;
  
  insert(scheme: string, rate: number): void {
    this.root = this.insertNode(this.root, scheme, rate);
  }
  
  private insertNode(node: TreeNode | null, scheme: string, rate: number): TreeNode {
    if (node === null) {
      return new TreeNode(scheme, rate);
    }
    
    if (rate < node.rate) {
      node.left = this.insertNode(node.left, scheme, rate);
    } else if (rate > node.rate) {
      node.right = this.insertNode(node.right, scheme, rate);
    }
    
    return node;
  }
  
  search(rate: number): string | null {
    return this.searchNode(this.root, rate);
  }
  
  private searchNode(node: TreeNode | null, rate: number): string | null {
    if (node === null) return null;
    
    if (rate === node.rate) return node.scheme;
    if (rate < node.rate) return this.searchNode(node.left, rate);
    return this.searchNode(node.right, rate);
  }
  
  inOrderTraversal(): Array<{scheme: string, rate: number}> {
    const result: Array<{scheme: string, rate: number}> = [];
    this.inOrder(this.root, result);
    return result;
  }
  
  private inOrder(node: TreeNode | null, result: Array<{scheme: string, rate: number}>): void {
    if (node !== null) {
      this.inOrder(node.left, result);
      result.push({scheme: node.scheme, rate: node.rate});
      this.inOrder(node.right, result);
    }
  }
  
  findSchemesInRange(minRate: number, maxRate: number): Array<{scheme: string, rate: number}> {
    const result: Array<{scheme: string, rate: number}> = [];
    this.findInRange(this.root, minRate, maxRate, result);
    return result;
  }
  
  private findInRange(node: TreeNode | null, minRate: number, maxRate: number, result: Array<{scheme: string, rate: number}>): void {
    if (node === null) return;
    
    if (node.rate >= minRate && node.rate <= maxRate) {
      result.push({scheme: node.scheme, rate: node.rate});
    }
    
    if (node.rate > minRate) {
      this.findInRange(node.left, minRate, maxRate, result);
    }
    
    if (node.rate < maxRate) {
      this.findInRange(node.right, minRate, maxRate, result);
    }
  }
}
```

**FutureFunds Usage:**
```typescript
// Organize government schemes by interest rate
const schemeBST = new InvestmentBST();

schemeBST.insert("PPF", 7.1);
schemeBST.insert("EPF", 8.5);
schemeBST.insert("NPS", 9.2);
schemeBST.insert("FD", 6.5);
schemeBST.insert("RD", 6.0);

// Find schemes with rates between 7% and 9%
const highYieldSchemes = schemeBST.findSchemesInRange(7, 9);
console.log(highYieldSchemes);
// Output: [{scheme: "PPF", rate: 7.1}, {scheme: "EPF", rate: 8.5}, {scheme: "NPS", rate: 9.2}]

// Get all schemes sorted by rate
const sortedSchemes = schemeBST.inOrderTraversal();
console.log(sortedSchemes);
// Output: [{scheme: "RD", rate: 6.0}, {scheme: "FD", rate: 6.5}, ...]
```

**Time Complexity:**
- **Insert**: O(log n) average, O(n) worst case
- **Search**: O(log n) average, O(n) worst case
- **In-order traversal**: O(n)

---

### Q4: Design a graph data structure for modeling investment relationships.

**Answer:**
A graph can represent relationships between different investment types and their correlations.

**Implementation:**
```typescript
class Graph {
  private adjacencyList: Map<string, Array<{node: string, weight: number}>>;
  
  constructor() {
    this.adjacencyList = new Map();
  }
  
  addNode(node: string): void {
    if (!this.adjacencyList.has(node)) {
      this.adjacencyList.set(node, []);
    }
  }
  
  addEdge(from: string, to: string, weight: number): void {
    this.addNode(from);
    this.addNode(to);
    
    this.adjacencyList.get(from)!.push({node: to, weight});
    this.adjacencyList.get(to)!.push({node: from, weight});
  }
  
  getNeighbors(node: string): Array<{node: string, weight: number}> {
    return this.adjacencyList.get(node) || [];
  }
  
  getAllNodes(): string[] {
    return Array.from(this.adjacencyList.keys());
  }
  
  // Find shortest path using Dijkstra's algorithm
  shortestPath(start: string, end: string): {path: string[], distance: number} {
    const distances = new Map<string, number>();
    const previous = new Map<string, string | null>();
    const visited = new Set<string>();
    
    // Initialize distances
    for (const node of this.getAllNodes()) {
      distances.set(node, Infinity);
    }
    distances.set(start, 0);
    
    while (visited.size < this.getAllNodes().length) {
      // Find unvisited node with minimum distance
      let current = '';
      let minDistance = Infinity;
      
      for (const [node, distance] of distances) {
        if (!visited.has(node) && distance < minDistance) {
          minDistance = distance;
          current = node;
        }
      }
      
      if (current === '') break;
      
      visited.add(current);
      
      // Update distances to neighbors
      for (const neighbor of this.getNeighbors(current)) {
        const newDistance = distances.get(current)! + neighbor.weight;
        if (newDistance < (distances.get(neighbor.node) || Infinity)) {
          distances.set(neighbor.node, newDistance);
          previous.set(neighbor.node, current);
        }
      }
    }
    
    // Reconstruct path
    const path: string[] = [];
    let current = end;
    while (current !== null) {
      path.unshift(current);
      current = previous.get(current) || null;
    }
    
    return {
      path: path[0] === start ? path : [],
      distance: distances.get(end) || Infinity
    };
  }
}
```

**FutureFunds Usage:**
```typescript
// Create investment correlation graph
const investmentGraph = new Graph();

// Add investment types as nodes
investmentGraph.addNode("Equity");
investmentGraph.addNode("Debt");
investmentGraph.addNode("Gold");
investmentGraph.addNode("Real Estate");
investmentGraph.addNode("PPF");
investmentGraph.addNode("EPF");

// Add correlations as edges (lower weight = higher correlation)
investmentGraph.addEdge("Equity", "Debt", 0.3); // Low correlation
investmentGraph.addEdge("Equity", "Gold", 0.1); // Very low correlation
investmentGraph.addEdge("Debt", "PPF", 0.2);    // Low correlation
investmentGraph.addEdge("PPF", "EPF", 0.8);     // High correlation

// Find diversification path
const diversificationPath = investmentGraph.shortestPath("Equity", "PPF");
console.log("Diversification path:", diversificationPath.path);
console.log("Diversification score:", diversificationPath.distance);

// Get correlated investments
const equityNeighbors = investmentGraph.getNeighbors("Equity");
console.log("Equity correlations:", equityNeighbors);
```

**Time Complexity:**
- **Add Node/Edge**: O(1)
- **Shortest Path**: O(V² + E) where V = vertices, E = edges
- **Get Neighbors**: O(1)

---

### Q5: Implement a trie for efficient prefix searching of investment terms.

**Answer:**
A trie (prefix tree) provides efficient prefix-based searching and autocomplete functionality.

**Implementation:**
```typescript
class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
  data: any;
  
  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
    this.data = null;
  }
}

class InvestmentTrie {
  private root: TrieNode;
  
  constructor() {
    this.root = new TrieNode();
  }
  
  insert(word: string, data: any): void {
    let current = this.root;
    
    for (const char of word.toLowerCase()) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char)!;
    }
    
    current.isEndOfWord = true;
    current.data = data;
  }
  
  search(word: string): any {
    let current = this.root;
    
    for (const char of word.toLowerCase()) {
      if (!current.children.has(char)) {
        return null;
      }
      current = current.children.get(char)!;
    }
    
    return current.isEndOfWord ? current.data : null;
  }
  
  startsWith(prefix: string): string[] {
    let current = this.root;
    
    // Navigate to prefix
    for (const char of prefix.toLowerCase()) {
      if (!current.children.has(char)) {
        return [];
      }
      current = current.children.get(char)!;
    }
    
    // Collect all words with this prefix
    const results: string[] = [];
    this.collectWords(current, prefix, results);
    return results;
  }
  
  private collectWords(node: TrieNode, prefix: string, results: string[]): void {
    if (node.isEndOfWord) {
      results.push(prefix);
    }
    
    for (const [char, childNode] of node.children) {
      this.collectWords(childNode, prefix + char, results);
    }
  }
  
  autocomplete(prefix: string, maxResults: number = 10): Array<{word: string, data: any}> {
    const words = this.startsWith(prefix);
    const results: Array<{word: string, data: any}> = [];
    
    for (let i = 0; i < Math.min(words.length, maxResults); i++) {
      const word = words[i];
      const data = this.search(word);
      results.push({word, data});
    }
    
    return results;
  }
}
```

**FutureFunds Usage:**
```typescript
// Create investment terms trie
const investmentTrie = new InvestmentTrie();

// Insert investment terms with metadata
investmentTrie.insert("PPF", {
  name: "Public Provident Fund",
  rate: 7.1,
  type: "Government Scheme",
  minAmount: 500,
  maxAmount: 150000
});

investmentTrie.insert("EPF", {
  name: "Employee Provident Fund", 
  rate: 8.5,
  type: "Government Scheme",
  minAmount: 0,
  maxAmount: 0
});

investmentTrie.insert("NPS", {
  name: "National Pension System",
  rate: 9.2,
  type: "Government Scheme", 
  minAmount: 1000,
  maxAmount: 0
});

investmentTrie.insert("SIP", {
  name: "Systematic Investment Plan",
  rate: 12,
  type: "Mutual Fund",
  minAmount: 500,
  maxAmount: 0
});

// Autocomplete functionality
const suggestions = investmentTrie.autocomplete("P", 5);
console.log(suggestions);
// Output: [
//   {word: "PPF", data: {...}},
//   {word: "EPF", data: {...}}
// ]

// Search for specific term
const ppfData = investmentTrie.search("PPF");
console.log(ppfData);
// Output: {name: "Public Provident Fund", rate: 7.1, ...}
```

**Time Complexity:**
- **Insert**: O(m) where m = length of word
- **Search**: O(m) where m = length of word
- **Prefix Search**: O(m + k) where k = number of results

---

### Q6: Design a circular buffer for storing recent calculation history.

**Answer:**
A circular buffer provides efficient storage with fixed size and automatic overwriting of old data.

**Implementation:**
```typescript
class CircularBuffer<T> {
  private buffer: T[];
  private head: number;
  private tail: number;
  private count: number;
  private capacity: number;
  
  constructor(capacity: number) {
    this.capacity = capacity;
    this.buffer = new Array(capacity);
    this.head = 0;
    this.tail = 0;
    this.count = 0;
  }
  
  enqueue(item: T): void {
    this.buffer[this.tail] = item;
    this.tail = (this.tail + 1) % this.capacity;
    
    if (this.count < this.capacity) {
      this.count++;
    } else {
      this.head = (this.head + 1) % this.capacity;
    }
  }
  
  dequeue(): T | undefined {
    if (this.count === 0) return undefined;
    
    const item = this.buffer[this.head];
    this.head = (this.head + 1) % this.capacity;
    this.count--;
    
    return item;
  }
  
  peek(): T | undefined {
    if (this.count === 0) return undefined;
    return this.buffer[this.head];
  }
  
  getSize(): number {
    return this.count;
  }
  
  isEmpty(): boolean {
    return this.count === 0;
  }
  
  isFull(): boolean {
    return this.count === this.capacity;
  }
  
  toArray(): T[] {
    const result: T[] = [];
    for (let i = 0; i < this.count; i++) {
      const index = (this.head + i) % this.capacity;
      result.push(this.buffer[index]);
    }
    return result;
  }
  
  clear(): void {
    this.head = 0;
    this.tail = 0;
    this.count = 0;
  }
}
```

**FutureFunds Usage:**
```typescript
// Store recent calculation history
const calculationHistory = new CircularBuffer<{
  timestamp: Date;
  input: any;
  output: any;
  calculationTime: number;
}>(100); // Store last 100 calculations

// Add calculation to history
function addCalculation(input: any, output: any, calculationTime: number): void {
  calculationHistory.enqueue({
    timestamp: new Date(),
    input,
    output,
    calculationTime
  });
}

// Get recent calculations
function getRecentCalculations(count: number = 10): any[] {
  const allCalculations = calculationHistory.toArray();
  return allCalculations.slice(-count);
}

// Monitor performance
function getAverageCalculationTime(): number {
  const calculations = calculationHistory.toArray();
  if (calculations.length === 0) return 0;
  
  const totalTime = calculations.reduce((sum, calc) => sum + calc.calculationTime, 0);
  return totalTime / calculations.length;
}

// Example usage
addCalculation(
  {monthlySIP: 15000, rate: 12, years: 30},
  {futureValue: 2500000},
  45
);

const recent = getRecentCalculations(5);
const avgTime = getAverageCalculationTime();
console.log("Average calculation time:", avgTime, "ms");
```

**Time Complexity:**
- **Enqueue**: O(1)
- **Dequeue**: O(1)
- **Peek**: O(1)
- **toArray**: O(n) where n = current size

---

### Q7: Implement a disjoint set (Union-Find) for grouping related investment categories.

**Answer:**
Disjoint sets efficiently manage groups of elements and find which group an element belongs to.

**Implementation:**
```typescript
class DisjointSet {
  private parent: Map<string, string>;
  private rank: Map<string, number>;
  
  constructor() {
    this.parent = new Map();
    this.rank = new Map();
  }
  
  makeSet(x: string): void {
    this.parent.set(x, x);
    this.rank.set(x, 0);
  }
  
  find(x: string): string {
    if (!this.parent.has(x)) {
      this.makeSet(x);
    }
    
    if (this.parent.get(x) !== x) {
      this.parent.set(x, this.find(this.parent.get(x)!));
    }
    
    return this.parent.get(x)!;
  }
  
  union(x: string, y: string): void {
    const rootX = this.find(x);
    const rootY = this.find(y);
    
    if (rootX === rootY) return;
    
    const rankX = this.rank.get(rootX)!;
    const rankY = this.rank.get(rootY)!;
    
    if (rankX < rankY) {
      this.parent.set(rootX, rootY);
    } else if (rankX > rankY) {
      this.parent.set(rootY, rootX);
    } else {
      this.parent.set(rootY, rootX);
      this.rank.set(rootX, rankX + 1);
    }
  }
  
  areConnected(x: string, y: string): boolean {
    return this.find(x) === this.find(y);
  }
  
  getGroups(): Map<string, string[]> {
    const groups = new Map<string, string[]>();
    
    for (const [element, parent] of this.parent) {
      const root = this.find(element);
      if (!groups.has(root)) {
        groups.set(root, []);
      }
      groups.get(root)!.push(element);
    }
    
    return groups;
  }
}
```

**FutureFunds Usage:**
```typescript
// Group investment categories by risk level
const investmentGroups = new DisjointSet();

// Add investment categories
const categories = [
  "Equity Mutual Funds",
  "Debt Mutual Funds", 
  "Balanced Mutual Funds",
  "PPF",
  "EPF",
  "NPS",
  "Fixed Deposits",
  "Recurring Deposits",
  "Gold ETF",
  "Real Estate"
];

categories.forEach(category => investmentGroups.makeSet(category));

// Group by risk level
investmentGroups.union("Equity Mutual Funds", "Balanced Mutual Funds");
investmentGroups.union("PPF", "EPF");
investmentGroups.union("Fixed Deposits", "Recurring Deposits");
investmentGroups.union("Gold ETF", "Real Estate");

// Check if investments are in same risk group
console.log(investmentGroups.areConnected("PPF", "EPF")); // true
console.log(investmentGroups.areConnected("Equity Mutual Funds", "PPF")); // false

// Get all risk groups
const riskGroups = investmentGroups.getGroups();
console.log("Risk Groups:", riskGroups);

// Find all investments in same group as PPF
const ppfGroup = investmentGroups.find("PPF");
const ppfGroupMembers = Array.from(riskGroups.get(ppfGroup) || []);
console.log("PPF Group:", ppfGroupMembers);
```

**Time Complexity:**
- **MakeSet**: O(1)
- **Find**: O(α(n)) where α is inverse Ackermann function (practically O(1))
- **Union**: O(α(n))
- **AreConnected**: O(α(n))

---

This completes the first 7 questions of the intermediate level DSA questions. Each question covers advanced data structures with practical implementations for the FutureFunds retirement planning platform.
