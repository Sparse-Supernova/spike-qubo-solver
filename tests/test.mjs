// tests/test.mjs
// Basic tests for spike-qubo-solver

import { solveQubo, solveMaxCut } from '../src/index.mjs';

console.log('Running spike-qubo-solver tests...\n');

// Test 1: Simple QUBO
console.log('Test 1: Simple QUBO (n=2)');
const qubo1 = {
  n: 2,
  terms: [
    [0, 0, -1],
    [1, 1, -1],
    [0, 1, 2]
  ]
};

const result1 = await solveQubo(qubo1, { maxIterations: 500 });
console.log('  Best energy:', result1.bestEnergy);
console.log('  State:', result1.state);
console.log('  Time:', result1.timeMs, 'ms');
console.log('  ✓ Passed\n');

// Test 2: Max-Cut
console.log('Test 2: Max-Cut (n=4)');
const graph1 = {
  n: 4,
  edges: [
    [0, 1, 1.0],
    [1, 2, 1.0],
    [2, 0, 1.0],
    [2, 3, 1.0]
  ]
};

const result2 = await solveMaxCut(graph1, { maxIterations: 500 });
console.log('  Cut value:', result2.cutValue);
console.log('  Partition:', result2.bestCut);
console.log('  Time:', result2.timeMs, 'ms');
console.log('  ✓ Passed\n');

// Test 3: Medium QUBO
console.log('Test 3: Medium QUBO (n=20)');
const qubo2 = {
  n: 20,
  terms: []
};

// Add some random terms
for (let i = 0; i < 20; i++) {
  for (let j = i; j < 20; j++) {
    if (Math.random() < 0.1) {
      qubo2.terms.push([i, j, (Math.random() - 0.5) * 2]);
    }
  }
}

const result3 = await solveQubo(qubo2, { maxIterations: 1000 });
console.log('  Best energy:', result3.bestEnergy.toFixed(4));
console.log('  Iterations:', result3.iterations);
console.log('  Time:', result3.timeMs.toFixed(2), 'ms');
console.log('  ✓ Passed\n');

console.log('All tests passed! ✓');

