// scripts/generate_bench_instances.mjs
// Generate deterministic benchmark instances for QUBO and Max-Cut.
//
// Outputs JSON files into examples/benchmarks/:
//
//   QUBO:
//     - qubo_50_sparse.json
//     - qubo_100_sparse.json
//     - qubo_300_sparse.json  (sweet-spot regime)
//
//   Max-Cut:
//     - maxcut_50_er_0.15.json
//     - maxcut_100_er_0.10.json
//     - maxcut_200_er_0.08.json
//
// All instances are generated using a simple seeded PRNG for reproducibility.

import fs from 'node:fs';
import path from 'node:path';

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

// --------------------- QUBO generator ---------------------------

function generateSparseQubo(n, density, weightRange, rng) {
  const [wMin, wMax] = weightRange;
  const terms = [];

  // Diagonal terms
  for (let i = 0; i < n; i++) {
    const q = wMin + (wMax - wMin) * (rng() - 0.5); // centred near 0
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

// --------------------- Max-Cut generator ------------------------

function generateErGraph(n, p, rng) {
  const edges = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (rng() < p) {
        const w = 0.5 + rng(); // weights in (0.5, 1.5)
        edges.push([i, j, w]);
      }
    }
  }
  return { n, edges };
}

// --------------------- Main generation --------------------------

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

async function main() {
  const outDir = path.resolve('examples/benchmarks');
  ensureDir(outDir);

  const rng = makeRng(0x5a5a5a5a);

  // QUBO instances (sparse, mixed weights)
  const qubos = [
    { name: 'qubo_50_sparse', n: 50, density: 0.06 },
    { name: 'qubo_100_sparse', n: 100, density: 0.04 },
    { name: 'qubo_300_sparse', n: 300, density: 0.03 } // sweet spot
  ];

  const quboWeightRange = [-1.0, 1.0];

  for (const cfg of qubos) {
    const qubo = generateSparseQubo(cfg.n, cfg.density, quboWeightRange, rng);
    const filePath = path.join(outDir, `${cfg.name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(qubo, null, 2), 'utf8');
    console.log(`Wrote QUBO instance: ${filePath}`);
  }

  // Max-Cut instances (Erdős–Rényi graphs)
  const graphs = [
    { name: 'maxcut_50_er_0.15', n: 50, p: 0.15 },
    { name: 'maxcut_100_er_0.10', n: 100, p: 0.10 },
    { name: 'maxcut_200_er_0.08', n: 200, p: 0.08 }
  ];

  for (const cfg of graphs) {
    const graph = generateErGraph(cfg.n, cfg.p, rng);
    const filePath = path.join(outDir, `${cfg.name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(graph, null, 2), 'utf8');
    console.log(`Wrote Max-Cut instance: ${filePath}`);
  }

  console.log('\nBenchmark instances generated in examples/benchmarks/');
}

main().catch((err) => {
  console.error('[generate_bench_instances] Fatal error:', err);
  process.exit(1);
});

