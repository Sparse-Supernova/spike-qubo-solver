// tests/api-smoke.mjs
// Basic API smoke-test for spike-qubo-solver.
//
// Modes:
//   - Local (default): import from ../src/index.mjs
//   - Package:         import from '@sparse-supernova/spike-qubo-solver'
//
// Usage:
//   node tests/api-smoke.mjs          # local mode
//   node tests/api-smoke.mjs pkg      # package mode (after npm install)
//   SPIKE_QUBO_SMOKE_MODE=pkg node tests/api-smoke.mjs

import { fileURLToPath } from 'node:url';
import path from 'node:path';

const argv = process.argv.slice(2);
const modeEnv = process.env.SPIKE_QUBO_SMOKE_MODE;
const modeArg = argv[0];
const mode = modeArg === 'pkg' || modeEnv === 'pkg' ? 'pkg' : 'local';

async function loadApi() {
  if (mode === 'pkg') {
    // Validate the npm-installed package name
    return await import('@sparse-supernova/spike-qubo-solver');
  } else {
    // Validate the local source (for dev)
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const localPath = path.resolve(__dirname, '..', 'src', 'index.mjs');
    return await import(localPath);
  }
}

function assert(cond, msg) {
  if (!cond) {
    throw new Error(`API smoke assertion failed: ${msg}`);
  }
}

async function runSmoke() {
  const api = await loadApi();
  const {
    solveQubo,
    solveMaxCut,
    encodeMaxCutToQubo,
    evaluateMaxCut,
    simulatedAnnealingQubo,
    greedyQubo,
    greedyMaxCut
  } = api;

  // Basic presence checks
  assert(typeof solveQubo === 'function', 'solveQubo is not a function');
  assert(typeof solveMaxCut === 'function', 'solveMaxCut is not a function');
  assert(typeof encodeMaxCutToQubo === 'function', 'encodeMaxCutToQubo missing');
  assert(typeof evaluateMaxCut === 'function', 'evaluateMaxCut missing');
  // Baselines are optional but expected in v1.1
  assert(typeof simulatedAnnealingQubo === 'function', 'simulatedAnnealingQubo missing');
  assert(typeof greedyQubo === 'function', 'greedyQubo missing');
  assert(typeof greedyMaxCut === 'function', 'greedyMaxCut missing');

  // Small QUBO instance
  const qubo = {
    n: 3,
    terms: [
      [0, 0, -1.0],
      [1, 1, -1.0],
      [2, 2, -1.0],
      [0, 1, 2.0],
      [1, 2, -0.5]
    ]
  };

  const quboRes = await solveQubo(qubo, {
    maxSteps: 200,
    trace: false
  });

  assert(typeof quboRes.bestEnergy === 'number', 'solveQubo.bestEnergy not numeric');
  assert(typeof quboRes.iterations === 'number', 'solveQubo.iterations not numeric');
  assert(typeof quboRes.timeMs === 'number', 'solveQubo.timeMs not numeric');
  assert(Array.isArray(quboRes.state), 'solveQubo.state not array');

  // SA baseline on same QUBO
  const saRes = await simulatedAnnealingQubo(qubo, {
    maxSteps: 500,
    T0: 3.0,
    alpha: 0.995,
    recordTrace: false
  });
  assert(typeof saRes.bestEnergy === 'number', 'SA.bestEnergy not numeric');
  assert(typeof saRes.timeMs === 'number', 'SA.timeMs not numeric');

  // Greedy baseline on same QUBO
  const greedyRes = await greedyQubo(qubo, { maxPasses: 5 });
  assert(typeof greedyRes.bestEnergy === 'number', 'greedyQubo.bestEnergy not numeric');

  // Small Max-Cut instance
  const graph = {
    n: 4,
    edges: [
      [0, 1, 1.0],
      [1, 2, 0.8],
      [2, 3, 1.1],
      [3, 0, 0.9]
    ]
  };

  // Encode Max-Cut to QUBO (API presence)
  const maxcutQubo = encodeMaxCutToQubo(graph);
  assert(maxcutQubo && typeof maxcutQubo.n === 'number', 'encodeMaxCutToQubo returned invalid qubo');

  // Solve Max-Cut via spike
  const maxCutRes = await solveMaxCut(graph, {
    maxSteps: 300,
    trace: false
  });

  assert(typeof maxCutRes.cutValue === 'number', 'solveMaxCut.cutValue not numeric');
  assert(typeof maxCutRes.iterations === 'number', 'solveMaxCut.iterations not numeric');
  assert(typeof maxCutRes.timeMs === 'number', 'solveMaxCut.timeMs not numeric');
  assert(Array.isArray(maxCutRes.state), 'solveMaxCut.state not array');

  // Greedy Max-Cut
  const greedyCutRes = await greedyMaxCut(graph, { maxPasses: 5 });
  assert(typeof greedyCutRes.bestCut === 'number', 'greedyMaxCut.bestCut not numeric');

  // evaluateMaxCut consistency check
  const evalCut = evaluateMaxCut(graph, maxCutRes.state);
  assert(typeof evalCut === 'number', 'evaluateMaxCut did not return number');

  console.log(`[api-smoke] OK in mode="${mode}"`);
}

runSmoke().catch((err) => {
  console.error('[api-smoke] FAILED in mode="' + mode + '":', err);
  process.exit(1);
});

