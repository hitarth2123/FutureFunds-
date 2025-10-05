---
noteId: "dsa-advanced-001"
tags: []

---

# Advanced Level - Data Structures & Algorithms (35 Questions)

## Table of Contents
1. [Advanced Graph Algorithms (Q1-Q7)](#advanced-graph-algorithms-q1-q7)
2. [Complex Data Structures (Q8-Q14)](#complex-data-structures-q8-q14)
3. [Advanced Dynamic Programming (Q15-Q21)](#advanced-dynamic-programming-q15-q21)
4. [Network Flow & Matching (Q22-Q28)](#network-flow--matching-q22-q28)
5. [Computational Geometry (Q29-Q35)](#computational-geometry-q29-q35)

---

## Advanced Graph Algorithms (Q1-Q7)

### Q1: Implement Dijkstra's algorithm for finding optimal investment paths.

**Answer:**
Dijkstra's algorithm finds the shortest path in a weighted graph with non-negative weights.

**Implementation:**
```typescript
interface InvestmentNode {
  id: string;
  name: string;
  type: 'start' | 'investment' | 'goal';
}

interface InvestmentEdge {
  from: string;
  to: string;
  weight: number; // Risk-adjusted return
  cost: number;   // Investment amount
}

class InvestmentGraph {
  private nodes: Map<string, InvestmentNode> = new Map();
  private edges: Map<string, InvestmentEdge[]> = new Map();
  
  addNode(node: InvestmentNode): void {
    this.nodes.set(node.id, node);
    this.edges.set(node.id, []);
  }
  
  addEdge(edge: InvestmentEdge): void {
    this.edges.get(edge.from)?.push(edge);
  }
  
  dijkstra(startId: string, goalId: string): {
    path: string[];
    totalWeight: number;
    totalCost: number;
  } {
    const distances = new Map<string, number>();
    const costs = new Map<string, number>();
    const previous = new Map<string, string | null>();
    const visited = new Set<string>();
    
    // Initialize distances
    for (const nodeId of this.nodes.keys()) {
      distances.set(nodeId, Infinity);
      costs.set(nodeId, Infinity);
    }
    distances.set(startId, 0);
    costs.set(startId, 0);
    
    const pq = new PriorityQueue<{id: string, distance: number}>();
    pq.enqueue({id: startId, distance: 0}, 0);
    
    while (!pq.isEmpty()) {
      const current = pq.dequeue();
      if (!current) break;
      
      const currentId = current.id;
      if (visited.has(currentId)) continue;
      
      visited.add(currentId);
      
      if (currentId === goalId) break;
      
      const neighbors = this.edges.get(currentId) || [];
      for (const edge of neighbors) {
        if (visited.has(edge.to)) continue;
        
        const newDistance = distances.get(currentId)! + edge.weight;
        const newCost = costs.get(currentId)! + edge.cost;
        
        if (newDistance < (distances.get(edge.to) || Infinity)) {
          distances.set(edge.to, newDistance);
          costs.set(edge.to, newCost);
          previous.set(edge.to, currentId);
          pq.enqueue({id: edge.to, distance: newDistance}, newDistance);
        }
      }
    }
    
    // Reconstruct path
    const path: string[] = [];
    let current = goalId;
    while (current !== null) {
      path.unshift(current);
      current = previous.get(current) || null;
    }
    
    return {
      path: path[0] === startId ? path : [],
      totalWeight: distances.get(goalId) || Infinity,
      totalCost: costs.get(goalId) || Infinity
    };
  }
}

// FutureFunds Usage
const graph = new InvestmentGraph();

// Add nodes
graph.addNode({id: 'start', name: 'Initial Capital', type: 'start'});
graph.addNode({id: 'ppf', name: 'PPF', type: 'investment'});
graph.addNode({id: 'epf', name: 'EPF', type: 'investment'});
graph.addNode({id: 'nps', name: 'NPS', type: 'investment'});
graph.addNode({id: 'sip', name: 'SIP', type: 'investment'});
graph.addNode({id: 'goal', name: 'Retirement Goal', type: 'goal'});

// Add edges with risk-adjusted weights
graph.addEdge({from: 'start', to: 'ppf', weight: 0.1, cost: 150000});
graph.addEdge({from: 'start', to: 'epf', weight: 0.15, cost: 100000});
graph.addEdge({from: 'start', to: 'nps', weight: 0.2, cost: 50000});
graph.addEdge({from: 'start', to: 'sip', weight: 0.3, cost: 25000});
graph.addEdge({from: 'ppf', to: 'goal', weight: 0.05, cost: 0});
graph.addEdge({from: 'epf', to: 'goal', weight: 0.08, cost: 0});
graph.addEdge({from: 'nps', to: 'goal', weight: 0.12, cost: 0});
graph.addEdge({from: 'sip', to: 'goal', weight: 0.18, cost: 0});

const result = graph.dijkstra('start', 'goal');
console.log("Optimal investment path:", result.path);
console.log("Total risk score:", result.totalWeight);
console.log("Total investment:", result.totalCost);
```

**Time Complexity:**
- **Time**: O((V + E) log V) with priority queue
- **Space**: O(V + E)

---

### Q2: Design a Bellman-Ford algorithm for detecting negative cycles in investment returns.

**Answer:**
Bellman-Ford detects negative cycles and finds shortest paths with negative weights.

**Implementation:**
```typescript
interface InvestmentEdge {
  from: string;
  to: string;
  weight: number; // Can be negative
}

class InvestmentBellmanFord {
  private nodes: string[] = [];
  private edges: InvestmentEdge[] = [];
  
  addNode(nodeId: string): void {
    if (!this.nodes.includes(nodeId)) {
      this.nodes.push(nodeId);
    }
  }
  
  addEdge(edge: InvestmentEdge): void {
    this.addNode(edge.from);
    this.addNode(edge.to);
    this.edges.push(edge);
  }
  
  findShortestPaths(startNode: string): {
    distances: Map<string, number>;
    hasNegativeCycle: boolean;
    negativeCycleNodes: string[];
  } {
    const distances = new Map<string, number>();
    const previous = new Map<string, string | null>();
    
    // Initialize distances
    for (const node of this.nodes) {
      distances.set(node, Infinity);
    }
    distances.set(startNode, 0);
    
    // Relax edges V-1 times
    for (let i = 0; i < this.nodes.length - 1; i++) {
      for (const edge of this.edges) {
        const fromDist = distances.get(edge.from);
        const toDist = distances.get(edge.to);
        
        if (fromDist !== Infinity && fromDist + edge.weight < toDist!) {
          distances.set(edge.to, fromDist + edge.weight);
          previous.set(edge.to, edge.from);
        }
      }
    }
    
    // Check for negative cycles
    const negativeCycleNodes: string[] = [];
    for (const edge of this.edges) {
      const fromDist = distances.get(edge.from);
      const toDist = distances.get(edge.to);
      
      if (fromDist !== Infinity && fromDist + edge.weight < toDist!) {
        negativeCycleNodes.push(edge.to);
      }
    }
    
    return {
      distances,
      hasNegativeCycle: negativeCycleNodes.length > 0,
      negativeCycleNodes
    };
  }
  
  detectArbitrage(): {
    hasArbitrage: boolean;
    arbitragePath: string[];
    profit: number;
  } {
    // Add a virtual start node with zero-weight edges to all nodes
    const virtualStart = 'virtual_start';
    this.addNode(virtualStart);
    
    for (const node of this.nodes) {
      if (node !== virtualStart) {
        this.addEdge({from: virtualStart, to: node, weight: 0});
      }
    }
    
    const result = this.findShortestPaths(virtualStart);
    
    if (result.hasNegativeCycle) {
      // Find the negative cycle path
      const cyclePath = this.findNegativeCyclePath(result.negativeCycleNodes[0]);
      const profit = this.calculateCycleProfit(cyclePath);
      
      return {
        hasArbitrage: true,
        arbitragePath: cyclePath,
        profit
      };
    }
    
    return {
      hasArbitrage: false,
      arbitragePath: [],
      profit: 0
    };
  }
  
  private findNegativeCyclePath(startNode: string): string[] {
    const visited = new Set<string>();
    const path: string[] = [];
    
    let current = startNode;
    while (!visited.has(current)) {
      visited.add(current);
      path.push(current);
      
      // Find next node in cycle
      const nextEdge = this.edges.find(e => e.from === current);
      if (nextEdge) {
        current = nextEdge.to;
      } else {
        break;
      }
    }
    
    return path;
  }
  
  private calculateCycleProfit(path: string[]): number {
    let profit = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const edge = this.edges.find(e => e.from === path[i] && e.to === path[i + 1]);
      if (edge) {
        profit += edge.weight;
      }
    }
    return profit;
  }
}

// FutureFunds Usage
const bf = new InvestmentBellmanFord();

// Add currency exchange rates (can be negative for arbitrage)
bf.addEdge({from: 'USD', to: 'INR', weight: -74.5});
bf.addEdge({from: 'INR', to: 'EUR', weight: -0.011});
bf.addEdge({from: 'EUR', to: 'USD', weight: -1.08});
bf.addEdge({from: 'USD', to: 'GBP', weight: -0.73});
bf.addEdge({from: 'GBP', to: 'INR', weight: -102.3});

const arbitrage = bf.detectArbitrage();
if (arbitrage.hasArbitrage) {
  console.log("Arbitrage opportunity found!");
  console.log("Path:", arbitrage.arbitragePath);
  console.log("Profit:", arbitrage.profit);
}
```

**Time Complexity:**
- **Time**: O(VE) where V = vertices, E = edges
- **Space**: O(V)

---

### Q3: Implement the Floyd-Warshall algorithm for all-pairs shortest paths in investment networks.

**Answer:**
Floyd-Warshall finds shortest paths between all pairs of nodes in O(V³) time.

**Implementation:**
```typescript
class InvestmentFloydWarshall {
  private nodes: string[] = [];
  private distances: number[][] = [];
  private next: string[][] = [];
  
  constructor(nodes: string[]) {
    this.nodes = nodes;
    const n = nodes.length;
    
    // Initialize distance matrix
    this.distances = Array(n).fill(null).map(() => Array(n).fill(Infinity));
    this.next = Array(n).fill(null).map(() => Array(n).fill(''));
    
    // Distance from node to itself is 0
    for (let i = 0; i < n; i++) {
      this.distances[i][i] = 0;
      this.next[i][i] = nodes[i];
    }
  }
  
  addEdge(from: string, to: string, weight: number): void {
    const fromIndex = this.nodes.indexOf(from);
    const toIndex = this.nodes.indexOf(to);
    
    if (fromIndex !== -1 && toIndex !== -1) {
      this.distances[fromIndex][toIndex] = weight;
      this.next[fromIndex][toIndex] = to;
    }
  }
  
  computeAllPairsShortestPaths(): void {
    const n = this.nodes.length;
    
    // Floyd-Warshall algorithm
    for (let k = 0; k < n; k++) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          const newDistance = this.distances[i][k] + this.distances[k][j];
          if (newDistance < this.distances[i][j]) {
            this.distances[i][j] = newDistance;
            this.next[i][j] = this.next[i][k];
          }
        }
      }
    }
  }
  
  getShortestPath(from: string, to: string): {
    path: string[];
    distance: number;
  } {
    const fromIndex = this.nodes.indexOf(from);
    const toIndex = this.nodes.indexOf(to);
    
    if (fromIndex === -1 || toIndex === -1) {
      return {path: [], distance: Infinity};
    }
    
    if (this.distances[fromIndex][toIndex] === Infinity) {
      return {path: [], distance: Infinity};
    }
    
    const path: string[] = [from];
    let current = fromIndex;
    
    while (current !== toIndex) {
      current = this.nodes.indexOf(this.next[current][toIndex]);
      path.push(this.nodes[current]);
    }
    
    return {
      path,
      distance: this.distances[fromIndex][toIndex]
    };
  }
  
  getDistanceMatrix(): number[][] {
    return this.distances.map(row => [...row]);
  }
  
  findCentralNode(): {
    node: string;
    maxDistance: number;
    averageDistance: number;
  } {
    let bestNode = this.nodes[0];
    let minMaxDistance = Infinity;
    let minAverageDistance = Infinity;
    
    for (let i = 0; i < this.nodes.length; i++) {
      const distances = this.distances[i];
      const maxDistance = Math.max(...distances.filter(d => d !== Infinity));
      const averageDistance = distances
        .filter(d => d !== Infinity && d !== 0)
        .reduce((sum, d) => sum + d, 0) / (distances.length - 1);
      
      if (maxDistance < minMaxDistance || 
          (maxDistance === minMaxDistance && averageDistance < minAverageDistance)) {
        minMaxDistance = maxDistance;
        minAverageDistance = averageDistance;
        bestNode = this.nodes[i];
      }
    }
    
    return {
      node: bestNode,
      maxDistance: minMaxDistance,
      averageDistance: minAverageDistance
    };
  }
}

// FutureFunds Usage
const nodes = ['PPF', 'EPF', 'NPS', 'SIP', 'FD', 'Gold'];
const fw = new InvestmentFloydWarshall(nodes);

// Add investment transition costs
fw.addEdge('PPF', 'EPF', 0.1);
fw.addEdge('EPF', 'NPS', 0.15);
fw.addEdge('NPS', 'SIP', 0.2);
fw.addEdge('SIP', 'FD', 0.05);
fw.addEdge('FD', 'Gold', 0.1);
fw.addEdge('Gold', 'PPF', 0.08);

fw.computeAllPairsShortestPaths();

const path = fw.getShortestPath('PPF', 'Gold');
console.log("Shortest path from PPF to Gold:", path.path);
console.log("Transition cost:", path.distance);

const central = fw.findCentralNode();
console.log("Most central investment:", central.node);
```

**Time Complexity:**
- **Time**: O(V³)
- **Space**: O(V²)

---

### Q4: Design a topological sort for investment dependency resolution.

**Answer:**
Topological sort orders nodes in a DAG such that dependencies come before dependents.

**Implementation:**
```typescript
class InvestmentDependencyGraph {
  private nodes: Set<string> = new Set();
  private inDegree: Map<string, number> = new Map();
  private adjList: Map<string, string[]> = new Map();
  
  addNode(nodeId: string): void {
    this.nodes.add(nodeId);
    this.inDegree.set(nodeId, 0);
    this.adjList.set(nodeId, []);
  }
  
  addDependency(from: string, to: string): void {
    this.addNode(from);
    this.addNode(to);
    
    this.adjList.get(from)!.push(to);
    this.inDegree.set(to, (this.inDegree.get(to) || 0) + 1);
  }
  
  topologicalSort(): {
    order: string[];
    hasCycle: boolean;
    cycleNodes: string[];
  } {
    const order: string[] = [];
    const inDegreeCopy = new Map(this.inDegree);
    const queue: string[] = [];
    
    // Find nodes with no incoming edges
    for (const [node, degree] of inDegreeCopy) {
      if (degree === 0) {
        queue.push(node);
      }
    }
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      order.push(current);
      
      // Remove this node and update in-degrees
      const neighbors = this.adjList.get(current) || [];
      for (const neighbor of neighbors) {
        const newDegree = inDegreeCopy.get(neighbor)! - 1;
        inDegreeCopy.set(neighbor, newDegree);
        
        if (newDegree === 0) {
          queue.push(neighbor);
        }
      }
    }
    
    // Check for cycle
    const hasCycle = order.length !== this.nodes.size;
    const cycleNodes = hasCycle ? 
      Array.from(this.nodes).filter(node => !order.includes(node)) : [];
    
    return {
      order,
      hasCycle,
      cycleNodes
    };
  }
  
  findCriticalPath(): {
    path: string[];
    totalTime: number;
  } {
    const {order} = this.topologicalSort();
    const distances = new Map<string, number>();
    const previous = new Map<string, string | null>();
    
    // Initialize distances
    for (const node of this.nodes) {
      distances.set(node, 0);
    }
    
    // Process nodes in topological order
    for (const node of order) {
      const neighbors = this.adjList.get(node) || [];
      for (const neighbor of neighbors) {
        const newDistance = distances.get(node)! + 1; // Assuming unit weight
        if (newDistance > distances.get(neighbor)!) {
          distances.set(neighbor, newDistance);
          previous.set(neighbor, node);
        }
      }
    }
    
    // Find the node with maximum distance
    let maxNode = order[0];
    let maxDistance = distances.get(maxNode)!;
    
    for (const [node, distance] of distances) {
      if (distance > maxDistance) {
        maxDistance = distance;
        maxNode = node;
      }
    }
    
    // Reconstruct critical path
    const path: string[] = [];
    let current: string | null = maxNode;
    while (current !== null) {
      path.unshift(current);
      current = previous.get(current) || null;
    }
    
    return {
      path,
      totalTime: maxDistance
    };
  }
}

// FutureFunds Usage
const dependencyGraph = new InvestmentDependencyGraph();

// Add investment dependencies
dependencyGraph.addDependency('Emergency Fund', 'PPF');
dependencyGraph.addDependency('Emergency Fund', 'EPF');
dependencyGraph.addDependency('PPF', 'NPS');
dependencyGraph.addDependency('EPF', 'NPS');
dependencyGraph.addDependency('NPS', 'SIP');
dependencyGraph.addDependency('SIP', 'Real Estate');
dependencyGraph.addDependency('SIP', 'Gold');

const topoSort = dependencyGraph.topologicalSort();
console.log("Investment order:", topoSort.order);
console.log("Has circular dependencies:", topoSort.hasCycle);

const criticalPath = dependencyGraph.findCriticalPath();
console.log("Critical investment path:", criticalPath.path);
console.log("Total steps:", criticalPath.totalTime);
```

**Time Complexity:**
- **Time**: O(V + E)
- **Space**: O(V + E)

---

### Q5: Implement the A* algorithm for optimal investment pathfinding.

**Answer:**
A* finds the shortest path using heuristics to guide the search efficiently.

**Implementation:**
```typescript
interface InvestmentNode {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'start' | 'investment' | 'goal';
}

interface InvestmentEdge {
  from: string;
  to: string;
  weight: number;
  cost: number;
}

class InvestmentAStar {
  private nodes: Map<string, InvestmentNode> = new Map();
  private edges: Map<string, InvestmentEdge[]> = new Map();
  
  addNode(node: InvestmentNode): void {
    this.nodes.set(node.id, node);
    this.edges.set(node.id, []);
  }
  
  addEdge(edge: InvestmentEdge): void {
    this.edges.get(edge.from)?.push(edge);
  }
  
  heuristic(from: string, to: string): number {
    const fromNode = this.nodes.get(from);
    const toNode = this.nodes.get(to);
    
    if (!fromNode || !toNode) return Infinity;
    
    // Euclidean distance as heuristic
    const dx = fromNode.x - toNode.x;
    const dy = fromNode.y - toNode.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  findPath(startId: string, goalId: string): {
    path: string[];
    totalCost: number;
    totalWeight: number;
  } {
    const openSet = new PriorityQueue<{id: string, f: number}>();
    const cameFrom = new Map<string, string | null>();
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();
    
    // Initialize scores
    for (const nodeId of this.nodes.keys()) {
      gScore.set(nodeId, Infinity);
      fScore.set(nodeId, Infinity);
    }
    
    gScore.set(startId, 0);
    fScore.set(startId, this.heuristic(startId, goalId));
    
    openSet.enqueue({id: startId, f: fScore.get(startId)!}, fScore.get(startId)!);
    
    while (!openSet.isEmpty()) {
      const current = openSet.dequeue();
      if (!current) break;
      
      if (current.id === goalId) {
        // Reconstruct path
        const path: string[] = [];
        let node: string | null = goalId;
        while (node !== null) {
          path.unshift(node);
          node = cameFrom.get(node) || null;
        }
        
        return {
          path,
          totalCost: gScore.get(goalId)!,
          totalWeight: fScore.get(goalId)!
        };
      }
      
      const neighbors = this.edges.get(current.id) || [];
      for (const edge of neighbors) {
        const tentativeGScore = gScore.get(current.id)! + edge.weight;
        
        if (tentativeGScore < (gScore.get(edge.to) || Infinity)) {
          cameFrom.set(edge.to, current.id);
          gScore.set(edge.to, tentativeGScore);
          fScore.set(edge.to, tentativeGScore + this.heuristic(edge.to, goalId));
          
          openSet.enqueue({id: edge.to, f: fScore.get(edge.to)!}, fScore.get(edge.to)!);
        }
      }
    }
    
    return {path: [], totalCost: Infinity, totalWeight: Infinity};
  }
  
  findMultiplePaths(startId: string, goalId: string, maxPaths: number = 3): Array<{
    path: string[];
    totalCost: number;
    totalWeight: number;
  }> {
    const paths: Array<{
      path: string[];
      totalCost: number;
      totalWeight: number;
    }> = [];
    
    const usedEdges = new Set<string>();
    
    for (let i = 0; i < maxPaths; i++) {
      const path = this.findPathWithExclusions(startId, goalId, usedEdges);
      if (path.path.length === 0) break;
      
      paths.push(path);
      
      // Mark edges as used
      for (let j = 0; j < path.path.length - 1; j++) {
        usedEdges.add(`${path.path[j]}-${path.path[j + 1]}`);
      }
    }
    
    return paths;
  }
  
  private findPathWithExclusions(
    startId: string, 
    goalId: string, 
    excludedEdges: Set<string>
  ): {
    path: string[];
    totalCost: number;
    totalWeight: number;
  } {
    // Similar to findPath but skip excluded edges
    const openSet = new PriorityQueue<{id: string, f: number}>();
    const cameFrom = new Map<string, string | null>();
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();
    
    for (const nodeId of this.nodes.keys()) {
      gScore.set(nodeId, Infinity);
      fScore.set(nodeId, Infinity);
    }
    
    gScore.set(startId, 0);
    fScore.set(startId, this.heuristic(startId, goalId));
    
    openSet.enqueue({id: startId, f: fScore.get(startId)!}, fScore.get(startId)!);
    
    while (!openSet.isEmpty()) {
      const current = openSet.dequeue();
      if (!current) break;
      
      if (current.id === goalId) {
        const path: string[] = [];
        let node: string | null = goalId;
        while (node !== null) {
          path.unshift(node);
          node = cameFrom.get(node) || null;
        }
        
        return {
          path,
          totalCost: gScore.get(goalId)!,
          totalWeight: fScore.get(goalId)!
        };
      }
      
      const neighbors = this.edges.get(current.id) || [];
      for (const edge of neighbors) {
        const edgeKey = `${current.id}-${edge.to}`;
        if (excludedEdges.has(edgeKey)) continue;
        
        const tentativeGScore = gScore.get(current.id)! + edge.weight;
        
        if (tentativeGScore < (gScore.get(edge.to) || Infinity)) {
          cameFrom.set(edge.to, current.id);
          gScore.set(edge.to, tentativeGScore);
          fScore.set(edge.to, tentativeGScore + this.heuristic(edge.to, goalId));
          
          openSet.enqueue({id: edge.to, f: fScore.get(edge.to)!}, fScore.get(edge.to)!);
        }
      }
    }
    
    return {path: [], totalCost: Infinity, totalWeight: Infinity};
  }
}

// FutureFunds Usage
const aStar = new InvestmentAStar();

// Add investment nodes with coordinates
aStar.addNode({id: 'start', name: 'Initial Capital', x: 0, y: 0, type: 'start'});
aStar.addNode({id: 'ppf', name: 'PPF', x: 1, y: 1, type: 'investment'});
aStar.addNode({id: 'epf', name: 'EPF', x: 2, y: 1, type: 'investment'});
aStar.addNode({id: 'nps', name: 'NPS', x: 3, y: 2, type: 'investment'});
aStar.addNode({id: 'sip', name: 'SIP', x: 4, y: 2, type: 'investment'});
aStar.addNode({id: 'goal', name: 'Retirement Goal', x: 5, y: 3, type: 'goal'});

// Add edges with weights
aStar.addEdge({from: 'start', to: 'ppf', weight: 0.1, cost: 150000});
aStar.addEdge({from: 'start', to: 'epf', weight: 0.15, cost: 100000});
aStar.addEdge({from: 'ppf', to: 'nps', weight: 0.2, cost: 50000});
aStar.addEdge({from: 'epf', to: 'nps', weight: 0.18, cost: 50000});
aStar.addEdge({from: 'nps', to: 'sip', weight: 0.25, cost: 25000});
aStar.addEdge({from: 'sip', to: 'goal', weight: 0.1, cost: 0});

const path = aStar.findPath('start', 'goal');
console.log("Optimal investment path:", path.path);
console.log("Total cost:", path.totalCost);

const multiplePaths = aStar.findMultiplePaths('start', 'goal', 3);
console.log("Alternative paths:", multiplePaths.length);
```

**Time Complexity:**
- **Time**: O(b^d) where b = branching factor, d = depth
- **Space**: O(b^d)

---

### Q6: Design a minimum spanning tree algorithm for investment network optimization.

**Answer:**
MST finds the minimum cost tree that connects all investment nodes.

**Implementation:**
```typescript
interface InvestmentEdge {
  from: string;
  to: string;
  weight: number;
  cost: number;
}

class InvestmentMST {
  private nodes: Set<string> = new Set();
  private edges: InvestmentEdge[] = [];
  
  addNode(nodeId: string): void {
    this.nodes.add(nodeId);
  }
  
  addEdge(edge: InvestmentEdge): void {
    this.addNode(edge.from);
    this.addNode(edge.to);
    this.edges.push(edge);
  }
  
  kruskalMST(): {
    mst: InvestmentEdge[];
    totalWeight: number;
    totalCost: number;
  } {
    // Sort edges by weight
    const sortedEdges = [...this.edges].sort((a, b) => a.weight - b.weight);
    
    const mst: InvestmentEdge[] = [];
    const parent = new Map<string, string>();
    const rank = new Map<string, number>();
    
    // Initialize Union-Find
    for (const node of this.nodes) {
      parent.set(node, node);
      rank.set(node, 0);
    }
    
    let totalWeight = 0;
    let totalCost = 0;
    
    for (const edge of sortedEdges) {
      const rootFrom = this.find(edge.from, parent);
      const rootTo = this.find(edge.to, parent);
      
      if (rootFrom !== rootTo) {
        mst.push(edge);
        this.union(rootFrom, rootTo, parent, rank);
        totalWeight += edge.weight;
        totalCost += edge.cost;
        
        // Stop when we have n-1 edges
        if (mst.length === this.nodes.size - 1) break;
      }
    }
    
    return {mst, totalWeight, totalCost};
  }
  
  primMST(startNode: string): {
    mst: InvestmentEdge[];
    totalWeight: number;
    totalCost: number;
  } {
    const mst: InvestmentEdge[] = [];
    const inMST = new Set<string>();
    const key = new Map<string, number>();
    const parent = new Map<string, string | null>();
    
    // Initialize
    for (const node of this.nodes) {
      key.set(node, Infinity);
    }
    key.set(startNode, 0);
    parent.set(startNode, null);
    
    const pq = new PriorityQueue<{node: string, key: number}>();
    pq.enqueue({node: startNode, key: 0}, 0);
    
    while (!pq.isEmpty()) {
      const current = pq.dequeue();
      if (!current) break;
      
      if (inMST.has(current.node)) continue;
      
      inMST.add(current.node);
      
      // Add edge to MST if not the starting node
      if (parent.get(current.node)) {
        const edge = this.edges.find(e => 
          e.from === parent.get(current.node) && e.to === current.node
        );
        if (edge) {
          mst.push(edge);
        }
      }
      
      // Update keys of adjacent nodes
      const neighbors = this.edges.filter(e => e.from === current.node || e.to === current.node);
      for (const edge of neighbors) {
        const neighbor = edge.from === current.node ? edge.to : edge.from;
        
        if (!inMST.has(neighbor) && edge.weight < (key.get(neighbor) || Infinity)) {
          key.set(neighbor, edge.weight);
          parent.set(neighbor, current.node);
          pq.enqueue({node: neighbor, key: edge.weight}, edge.weight);
        }
      }
    }
    
    const totalWeight = mst.reduce((sum, edge) => sum + edge.weight, 0);
    const totalCost = mst.reduce((sum, edge) => sum + edge.cost, 0);
    
    return {mst, totalWeight, totalCost};
  }
  
  private find(node: string, parent: Map<string, string>): string {
    if (parent.get(node) !== node) {
      parent.set(node, this.find(parent.get(node)!, parent));
    }
    return parent.get(node)!;
  }
  
  private union(
    root1: string, 
    root2: string, 
    parent: Map<string, string>, 
    rank: Map<string, number>
  ): void {
    if (rank.get(root1)! < rank.get(root2)!) {
      parent.set(root1, root2);
    } else if (rank.get(root1)! > rank.get(root2)!) {
      parent.set(root2, root1);
    } else {
      parent.set(root2, root1);
      rank.set(root1, rank.get(root1)! + 1);
    }
  }
  
  findSteinerTree(requiredNodes: string[]): {
    steinerTree: InvestmentEdge[];
    totalWeight: number;
    totalCost: number;
  } {
    // Simplified Steiner tree using MST on required nodes
    const requiredSet = new Set(requiredNodes);
    const filteredEdges = this.edges.filter(e => 
      requiredSet.has(e.from) && requiredSet.has(e.to)
    );
    
    const tempMST = new InvestmentMST();
    for (const node of requiredNodes) {
      tempMST.addNode(node);
    }
    for (const edge of filteredEdges) {
      tempMST.addEdge(edge);
    }
    
    return tempMST.kruskalMST();
  }
}

// FutureFunds Usage
const mst = new InvestmentMST();

// Add investment nodes
mst.addNode('PPF');
mst.addNode('EPF');
mst.addNode('NPS');
mst.addNode('SIP');
mst.addNode('FD');
mst.addNode('Gold');

// Add edges with weights and costs
mst.addEdge({from: 'PPF', to: 'EPF', weight: 0.1, cost: 50000});
mst.addEdge({from: 'PPF', to: 'NPS', weight: 0.2, cost: 75000});
mst.addEdge({from: 'EPF', to: 'NPS', weight: 0.15, cost: 60000});
mst.addEdge({from: 'NPS', to: 'SIP', weight: 0.3, cost: 100000});
mst.addEdge({from: 'SIP', to: 'FD', weight: 0.05, cost: 25000});
mst.addEdge({from: 'FD', to: 'Gold', weight: 0.08, cost: 30000});
mst.addEdge({from: 'PPF', to: 'Gold', weight: 0.12, cost: 40000});

const kruskalResult = mst.kruskalMST();
console.log("Kruskal MST:", kruskalResult.mst);
console.log("Total weight:", kruskalResult.totalWeight);
console.log("Total cost:", kruskalResult.totalCost);

const primResult = mst.primMST('PPF');
console.log("Prim MST:", primResult.mst);

const steinerResult = mst.findSteinerTree(['PPF', 'NPS', 'SIP']);
console.log("Steiner tree:", steinerResult.steinerTree);
```

**Time Complexity:**
- **Kruskal**: O(E log E)
- **Prim**: O(E log V)
- **Space**: O(V + E)

---

### Q7: Implement a strongly connected components algorithm for investment cycles.

**Answer:**
SCC finds groups of nodes where every node can reach every other node in the group.

**Implementation:**
```typescript
class InvestmentSCC {
  private nodes: Set<string> = new Set();
  private adjList: Map<string, string[]> = new Map();
  private revAdjList: Map<string, string[]> = new Map();
  
  addNode(nodeId: string): void {
    this.nodes.add(nodeId);
    this.adjList.set(nodeId, []);
    this.revAdjList.set(nodeId, []);
  }
  
  addEdge(from: string, to: string): void {
    this.addNode(from);
    this.addNode(to);
    
    this.adjList.get(from)!.push(to);
    this.revAdjList.get(to)!.push(from);
  }
  
  findSCCs(): Array<{
    component: string[];
    size: number;
    isCycle: boolean;
  }> {
    const visited = new Set<string>();
    const finishOrder: string[] = [];
    
    // First DFS to get finish order
    for (const node of this.nodes) {
      if (!visited.has(node)) {
        this.dfs1(node, visited, finishOrder);
      }
    }
    
    // Second DFS on reversed graph
    visited.clear();
    const sccs: Array<{
      component: string[];
      size: number;
      isCycle: boolean;
    }> = [];
    
    for (let i = finishOrder.length - 1; i >= 0; i--) {
      const node = finishOrder[i];
      if (!visited.has(node)) {
        const component: string[] = [];
        this.dfs2(node, visited, component);
        
        const isCycle = this.isCycle(component);
        sccs.push({
          component,
          size: component.length,
          isCycle
        });
      }
    }
    
    return sccs;
  }
  
  private dfs1(node: string, visited: Set<string>, finishOrder: string[]): void {
    visited.add(node);
    
    const neighbors = this.adjList.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        this.dfs1(neighbor, visited, finishOrder);
      }
    }
    
    finishOrder.push(node);
  }
  
  private dfs2(node: string, visited: Set<string>, component: string[]): void {
    visited.add(node);
    component.push(node);
    
    const neighbors = this.revAdjList.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        this.dfs2(neighbor, visited, component);
      }
    }
  }
  
  private isCycle(component: string[]): boolean {
    if (component.length < 2) return false;
    
    // Check if every node can reach every other node
    for (const start of component) {
      const reachable = new Set<string>();
      this.dfsReachable(start, reachable);
      
      for (const target of component) {
        if (target !== start && !reachable.has(target)) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  private dfsReachable(node: string, reachable: Set<string>): void {
    reachable.add(node);
    
    const neighbors = this.adjList.get(node) || [];
    for (const neighbor of neighbors) {
      if (!reachable.has(neighbor)) {
        this.dfsReachable(neighbor, reachable);
      }
    }
  }
  
  findArbitrageOpportunities(): Array<{
    cycle: string[];
    profit: number;
    risk: number;
  }> {
    const sccs = this.findSCCs();
    const arbitrageOpportunities: Array<{
      cycle: string[];
      profit: number;
      risk: number;
    }> = [];
    
    for (const scc of sccs) {
      if (scc.isCycle && scc.size > 1) {
        const cycle = this.findCycleInComponent(scc.component);
        if (cycle.length > 0) {
          const profit = this.calculateCycleProfit(cycle);
          const risk = this.calculateCycleRisk(cycle);
          
          arbitrageOpportunities.push({
            cycle,
            profit,
            risk
          });
        }
      }
    }
    
    return arbitrageOpportunities.sort((a, b) => b.profit - a.profit);
  }
  
  private findCycleInComponent(component: string[]): string[] {
    // Find a cycle in the component using DFS
    const visited = new Set<string>();
    const recStack = new Set<string>();
    const path: string[] = [];
    
    for (const node of component) {
      if (!visited.has(node)) {
        const cycle = this.dfsCycle(node, visited, recStack, path);
        if (cycle.length > 0) {
          return cycle;
        }
      }
    }
    
    return [];
  }
  
  private dfsCycle(
    node: string, 
    visited: Set<string>, 
    recStack: Set<string>, 
    path: string[]
  ): string[] {
    visited.add(node);
    recStack.add(node);
    path.push(node);
    
    const neighbors = this.adjList.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        const cycle = this.dfsCycle(neighbor, visited, recStack, path);
        if (cycle.length > 0) {
          return cycle;
        }
      } else if (recStack.has(neighbor)) {
        // Found a cycle
        const cycleStart = path.indexOf(neighbor);
        return path.slice(cycleStart);
      }
    }
    
    recStack.delete(node);
    path.pop();
    return [];
  }
  
  private calculateCycleProfit(cycle: string[]): number {
    // Simplified profit calculation
    return cycle.length * 0.1; // 10% per step
  }
  
  private calculateCycleRisk(cycle: string[]): number {
    // Simplified risk calculation
    return cycle.length * 0.05; // 5% risk per step
  }
}

// FutureFunds Usage
const scc = new InvestmentSCC();

// Add investment nodes
scc.addNode('USD');
scc.addNode('INR');
scc.addNode('EUR');
scc.addNode('GBP');
scc.addNode('JPY');

// Add currency exchange edges
scc.addEdge('USD', 'INR');
scc.addEdge('INR', 'EUR');
scc.addEdge('EUR', 'USD');
scc.addEdge('USD', 'GBP');
scc.addEdge('GBP', 'JPY');
scc.addEdge('JPY', 'USD');

const sccs = scc.findSCCs();
console.log("Strongly Connected Components:", sccs);

const arbitrage = scc.findArbitrageOpportunities();
console.log("Arbitrage opportunities:", arbitrage);
```

**Time Complexity:**
- **Time**: O(V + E)
- **Space**: O(V + E)

---

This completes the first 7 questions of the advanced level DSA questions, covering advanced graph algorithms with practical implementations for the FutureFunds retirement planning platform.
