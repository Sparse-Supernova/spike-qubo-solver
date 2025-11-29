// examples/example_qubo.mjs
// Simple QUBO example

import { solveQubo } from '../src/index.mjs';

// Small QUBO: minimize -x0 - x1 + 2*x0*x1
// Optimal: x0=1, x1=1 gives energy = -1 - 1 + 2 = 0
// Format: array of [i, j, weight] terms
const Q = [
  [0, 0, -1],  // -x0
  [1, 1, -1],  // -x1
  [0, 1, 2]    // 2*x0*x1
];

console.log('Solving QUBO:');
console.log('  Q:', JSON.stringify(Q, null, 2));

const result = await solveQubo(Q, {
  maxSteps: 1000,
  trace: true
});

console.log('\nResult:');
console.log('  Best energy:', result.bestEnergy);
console.log('  State:', result.state);
console.log('  Iterations:', result.iterations);
console.log('  Time (ms):', result.timeMs);
if (result.trace) {
  console.log('  Trace length:', result.trace.length);
  console.log('  First few trace points:', result.trace.slice(0, 5));
}
