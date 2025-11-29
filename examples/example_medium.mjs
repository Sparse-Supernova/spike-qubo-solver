// examples/example_medium.mjs
// Medium-sized QUBO example

import { solveQubo } from '../src/index.mjs';

// Generate a medium-sized random QUBO (n=50, sparse)
const n = 50;
const density = 0.05; // 5% density
const Q = [];

// Add diagonal terms
for (let i = 0; i < n; i++) {
  Q.push([i, i, Math.random() * 2 - 1]);
}

// Add off-diagonal terms
const maxPairs = Math.floor((n * (n - 1)) / 2 * density);
for (let k = 0; k < maxPairs; k++) {
  const i = Math.floor(Math.random() * n);
  const j = Math.floor(Math.random() * n);
  if (i !== j) {
    Q.push([i, j, Math.random() * 2 - 1]);
  }
}

console.log(`Solving medium QUBO (n=${n}, ${Q.length} terms):`);

const startTime = Date.now();
const result = await solveQubo(Q, {
  maxSteps: 2000,
  trace: true
});
const endTime = Date.now();

console.log('\nResult:');
console.log('  Best energy:', result.bestEnergy.toFixed(4));
console.log('  Iterations:', result.iterations);
console.log('  Time (ms):', result.timeMs.toFixed(2));
console.log('  Total time (ms):', (endTime - startTime).toFixed(2));
if (result.trace) {
  console.log('  Trace points:', result.trace.length);
  console.log('  Energy improvement:', 
    (result.trace[0].energy - result.bestEnergy).toFixed(4));
}
