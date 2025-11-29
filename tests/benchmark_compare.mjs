// tests/benchmark_compare.mjs
// Compare spike vs SA vs greedy on a couple of QUBO / Max-Cut instances.

import {
  solveQubo,
  solveMaxCut,
  simulatedAnnealingQubo,
  greedyQubo,
  greedyMaxCut
} from '../src/index.mjs';
import { summarizeRuns } from '../src/metrics.mjs';

console.log('spike-qubo-solver: Spike vs SA vs Greedy\n');

console.log('='.repeat(60));

function randomQubo(n, density = 0.03) {
  const terms = [];
  for (let i = 0; i < n; i++) {
    terms.push([i, i, (Math.random() - 0.5) * 2]);
  }
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.random() < density) {
        terms.push([i, j, (Math.random() - 0.5) * 2]);
      }
    }
  }
  return { n, terms };
}

function randomGraph(n, edgeProb = 0.1) {
  const edges = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.random() < edgeProb) {
        edges.push([i, j, Math.random()]);
      }
    }
  }
  return { n, edges };
}

async function compareQubo(n = 100, runs = 10) {
  console.log(`\nQUBO comparison (n=${n})`);
  const qubo = randomQubo(n);

  const spikeRuns = [];
  const saRuns = [];
  const greedyRuns = [];

  for (let r = 0; r < runs; r++) {
    const spike = await solveQubo(qubo, { maxSteps: 1200 });
    spikeRuns.push(spike);

    const sa = await simulatedAnnealingQubo(qubo, { maxSteps: 3000 });
    saRuns.push(sa);

    const greedy = await greedyQubo(qubo, { maxPasses: 10 });
    greedyRuns.push({
      bestEnergy: greedy.bestEnergy,
      timeMs: null,
      iterations: null
    });
  }

  console.log('  Spike:', summarizeRuns(spikeRuns));
  console.log('  SA   :', summarizeRuns(saRuns));
  console.log('  Greedy:', summarizeRuns(greedyRuns));
}

async function compareMaxCut(n = 50, runs = 10) {
  console.log(`\nMax-Cut comparison (n=${n})`);
  const graph = randomGraph(n, 0.1);

  const spikeRuns = [];
  const greedyRuns = [];

  for (let r = 0; r < runs; r++) {
    const spike = await solveMaxCut(graph, { maxSteps: 1500 });
    spikeRuns.push({
      bestEnergy: -spike.cutValue,
      timeMs: spike.timeMs,
      iterations: spike.iterations
    });

    const greedy = await greedyMaxCut(graph, { maxPasses: 10 });
    greedyRuns.push({
      bestEnergy: -greedy.bestCut,
      timeMs: null,
      iterations: null
    });
  }

  console.log('  Spike:', summarizeRuns(spikeRuns));
  console.log('  Greedy:', summarizeRuns(greedyRuns));
}

async function main() {
  await compareQubo(100, 10);
  await compareQubo(300, 10);
  await compareMaxCut(50, 10);
}

main().catch(err => {
  console.error('[benchmark_compare] Fatal error:', err);
  process.exit(1);
});

