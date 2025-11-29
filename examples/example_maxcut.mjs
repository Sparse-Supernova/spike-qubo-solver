// examples/example_maxcut.mjs
// Simple Max-Cut example

import { solveMaxCut } from '../src/index.mjs';

// Simple 4-node cycle graph
const graph = {
  n: 4,
  edges: [
    [0, 1, 1.0],
    [1, 2, 1.0],
    [2, 3, 1.0],
    [3, 0, 1.0]
  ]
};

console.log('Solving Max-Cut:');
console.log('  Graph:', JSON.stringify(graph, null, 2));

const result = await solveMaxCut(graph, {
  maxSteps: 1000,
  trace: false
});

console.log('\nResult:');
console.log('  Cut value:', result.cutValue);
console.log('  State (partition):', result.state);
console.log('  Best energy:', result.bestEnergy);
console.log('  Iterations:', result.iterations);
console.log('  Time (ms):', result.timeMs);
