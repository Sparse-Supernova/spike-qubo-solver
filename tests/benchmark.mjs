// tests/benchmark.mjs
// Simple benchmark for spike-qubo-solver

import { solveQubo, solveMaxCut } from '../src/index.mjs';

console.log('spike-qubo-solver Benchmark\n');
console.log('='.repeat(50));

// Benchmark 1: Small QUBO
console.log('\n1. Small QUBO (n=10)');
const qubo1 = {
  n: 10,
  terms: []
};

for (let i = 0; i < 10; i++) {
  for (let j = i; j < 10; j++) {
    if (Math.random() < 0.2) {
      qubo1.terms.push([i, j, (Math.random() - 0.5) * 2]);
    }
  }
}

const t0 = Date.now();
const r1 = await solveQubo(qubo1, { maxIterations: 1000, recordTrace: true });
const t1 = Date.now();

console.log(`  Energy: ${r1.bestEnergy.toFixed(4)}`);
console.log(`  Time: ${r1.timeMs.toFixed(2)} ms`);
console.log(`  Iterations: ${r1.iterations}`);
console.log(`  Trace points: ${r1.trace?.length || 0}`);

// Benchmark 2: Medium QUBO
console.log('\n2. Medium QUBO (n=50)');
const qubo2 = {
  n: 50,
  terms: []
};

for (let i = 0; i < 50; i++) {
  for (let j = i; j < 50; j++) {
    if (Math.random() < 0.05) {
      qubo2.terms.push([i, j, (Math.random() - 0.5) * 2]);
    }
  }
}

const r2 = await solveQubo(qubo2, { maxIterations: 1500, recordTrace: true });
console.log(`  Energy: ${r2.bestEnergy.toFixed(4)}`);
console.log(`  Time: ${r2.timeMs.toFixed(2)} ms`);
console.log(`  Iterations: ${r2.iterations}`);
console.log(`  Trace points: ${r2.trace?.length || 0}`);

// Benchmark 3: Max-Cut
console.log('\n3. Max-Cut (n=30)');
const graph = {
  n: 30,
  edges: []
};

for (let i = 0; i < 30; i++) {
  for (let j = i + 1; j < 30; j++) {
    if (Math.random() < 0.1) {
      graph.edges.push([i, j, Math.random()]);
    }
  }
}

const r3 = await solveMaxCut(graph, { maxIterations: 1500, recordTrace: true });
console.log(`  Cut value: ${r3.cutValue.toFixed(4)}`);
console.log(`  Time: ${r3.timeMs.toFixed(2)} ms`);
console.log(`  Iterations: ${r3.iterations}`);
console.log(`  Trace points: ${r3.trace?.length || 0}`);

console.log('\n' + '='.repeat(50));
console.log('Benchmark complete!');

