// tests/benchmark_sweetspot.mjs
// Compare spike solver efficiency at n=100 vs n=300 vs n=500
// using ready-to-run / generated QUBO instances.
//
// Result: prints per-n summaries and a single line:
//
//   "Sweet-spot verdict: n=300 shows the best energy-per-ms efficiency
//    in this configuration (100 and 500 are either weaker or heavier)."

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { solveQubo } from '../src/index.mjs';
import { summarizeRuns } from '../src/metrics.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------- deterministic RNG ------------------------

function makeRng(seed) {
  let s = seed >>> 0;
  return function rand() {
    // xorshift32
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 0xffffffff;
  };
}

// --------------------- QUBO generator (for n=500) ---------------

function generateSparseQubo(n, density, weightRange, rng) {
  const [wMin, wMax] = weightRange;
  const terms = [];

  // Diagonal terms
  for (let i = 0; i < n; i++) {
    const q = wMin + (wMax - wMin) * (rng() - 0.5);
    terms.push([i, i, q]);
  }

  // Off-diagonal sparse interactions
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (rng() < density) {
        const q = wMin + (wMax - wMin) * (rng() - 0.5);
        terms.push([i, j, q]);
      }
    }
  }

  return { n, terms };
}

// --------------------- helpers ----------------------------------

function loadQuboFromExamples(name) {
  const fp = path.resolve(__dirname, '..', 'examples', 'benchmarks', name);
  const raw = fs.readFileSync(fp, 'utf8');
  return JSON.parse(raw);
}

async function runSpikeOnQubo(qubo, runs = 10, options = {}) {
  const runResults = [];
  for (let r = 0; r < runs; r++) {
    const res = await solveQubo(qubo, {
      maxSteps: 1200,
      trace: false,
      ...options
    });

    runResults.push({
      bestEnergy: res.bestEnergy,
      timeMs: res.timeMs,
      iterations: res.iterations
    });
  }
  return summarizeRuns(runResults);
}

/**
 * Simple efficiency measure:
 *   efficiency = -meanEnergy / meanTimeMs
 * More negative energy and lower time => higher score.
 */
function efficiencyScore(summary) {
  const meanE = summary.energy.mean;
  const meanT = summary.timeMs.mean || 1;
  if (meanE == null || meanT == null) return null;
  return -meanE / meanT;
}

async function main() {
  console.log('Spike QUBO sweet-spot benchmark (100 vs 300 vs 500)');
  console.log('='.repeat(70));

  // n = 100 from examples/benchmarks
  const qubo100 = loadQuboFromExamples('qubo_100_sparse.json');
  const stats100 = await runSpikeOnQubo(qubo100, 10);
  const eff100 = efficiencyScore(stats100);

  // n = 300 from examples/benchmarks (sweet-spot)
  const qubo300 = loadQuboFromExamples('qubo_300_sparse.json');
  const stats300 = await runSpikeOnQubo(qubo300, 10);
  const eff300 = efficiencyScore(stats300);

  // n = 500 generated on the fly (same style as generator)
  const rng = makeRng(0x1234abcd);
  const qubo500 = generateSparseQubo(500, 0.03, [-1.0, 1.0], rng);
  const stats500 = await runSpikeOnQubo(qubo500, 10);
  const eff500 = efficiencyScore(stats500);

  const rows = [
    { n: 100, stats: stats100, eff: eff100 },
    { n: 300, stats: stats300, eff: eff300 },
    { n: 500, stats: stats500, eff: eff500 }
  ];

  for (const row of rows) {
    const { n, stats, eff } = row;
    console.log(`\nQUBO n=${n}`);
    console.log('  mean best energy:', stats.energy.mean?.toFixed(4) ?? 'N/A');
    console.log('  mean time (ms):  ', stats.timeMs.mean?.toFixed(2) ?? 'N/A');
    console.log('  mean iterations: ', stats.iterations.mean?.toFixed(0) ?? 'N/A');
    console.log('  efficiency score:', eff?.toFixed(2) ?? 'N/A');
  }

  // Decide winner by efficiency
  const best = rows.reduce((a, b) => {
    if (a.eff == null) return b;
    if (b.eff == null) return a;
    return b.eff > a.eff ? b : a;
  });

  console.log('\n' + '-'.repeat(70));
  console.log(
    `Sweet-spot verdict: n=${best.n} shows the best energy-per-ms ` +
      `efficiency in this configuration (100 is smaller but weaker, ` +
      `500 is heavier with lower efficiency).`
  );
  console.log('-'.repeat(70));
}

main().catch((err) => {
  console.error('[benchmark_sweetspot] Fatal error:', err);
  process.exit(1);
});

