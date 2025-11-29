// src/index.mjs
// Spike-based QUBO / Max-Cut solver (core API, no USL/USAD)

import { solveQubo as solveQuboCore } from './solver.mjs';
import { encodeMaxCutToQubo, evaluateMaxCut } from './encoders.mjs';
import { simulatedAnnealingQubo } from './baselines/sa.mjs';
import { greedyQubo, greedyMaxCut } from './baselines/greedy.mjs';

/**
 * Normalize QUBO input to array format.
 * Accepts:
 *   - Array of [i, j, weight]: [[0,0,-1], [1,1,-1], ...]
 *   - Object with { Q: [...] }: { Q: [[0,0,-1], ...] }
 *   - Object with { n, terms }: { n: 2, terms: [[0,0,-1], ...] }
 * 
 * @param {Array<[number, number, number]>|Object} problemOrQ - QUBO input
 * @returns {Array<[number, number, number]>} Normalized array format
 */
function normalizeQ(problemOrQ) {
  // If it's already an array, just return it
  if (Array.isArray(problemOrQ)) return problemOrQ;

  // If it's an object with .Q, use that
  if (problemOrQ && Array.isArray(problemOrQ.Q)) {
    return problemOrQ.Q;
  }

  // If it's an object with .terms (legacy format), use that
  if (problemOrQ && Array.isArray(problemOrQ.terms)) {
    return problemOrQ.terms;
  }

  throw new TypeError('Expected QUBO as array of [i,j,w], { Q: [...] }, or { n, terms: [...] }');
}

/**
 * Solve a QUBO problem.
 * 
 * @param {Array<[number, number, number]>|Object} problemOrQ - Array of [i, j, weight] terms or { Q: [...] }
 * @param {Object} options - Solver options
 * @returns {Promise<Object>} { bestEnergy, state, iterations, timeMs, trace? }
 */
export async function solveQubo(problemOrQ, options = {}) {
  const {
    maxSteps = 2000,
    seed = undefined,
    trace = false
  } = options;

  // Normalize input to array format
  const Q = normalizeQ(problemOrQ);

  // Convert Q array format to sparse QUBO format
  const qubo = arrayToSparseQubo(Q);
  const n = qubo.n;

  // Map options to solver options
  const solverOptions = {
    maxIterations: maxSteps,
    seed,
    recordTrace: trace,
    // Use minimal defaults - no advanced features
    plateauWindow: 300,
    warmupIters: 100,
    noiseStd: 0.15,
    softRestartInterval: 0, // Disable soft restarts for simplicity
    softRestartFraction: 0,
  };

  const result = await solveQuboCore(qubo, solverOptions);

  // Convert trace if present (solver returns array of energies)
  let traceArr = undefined;
  if (trace && result.trace && Array.isArray(result.trace)) {
    traceArr = result.trace.map((energy, idx) => ({
      step: idx * 10, // Approximate step (trace is decimated)
      energy
    }));
  }

  return {
    bestEnergy: result.bestEnergy,
    state: result.state,
    iterations: result.iterations,
    timeMs: result.timeMs,
    trace: traceArr
  };
}

/**
 * Solve a Max-Cut problem.
 * 
 * @param {Object} graph - { n: number, edges: Array<[i, j, weight]> }
 * @param {Object} options - Solver options (same as solveQubo)
 * @returns {Promise<Object>} { bestEnergy, state, cutValue, iterations, timeMs, trace? }
 */
export async function solveMaxCut(graph, options = {}) {
  // Convert graph to QUBO
  const qubo = encodeMaxCutToQubo(graph);
  
  // Convert QUBO to array format for solveQubo
  const Q = sparseQuboToArray(qubo);
  
  // Solve
  const res = await solveQubo(Q, options);
  
  // Evaluate the actual cut value
  const cutValue = evaluateMaxCut(graph, res.state);

  return {
    ...res,
    cutValue
  };
}

// --- Internal helpers ---

/**
 * Convert array format [i, j, weight] to sparse QUBO format { n, terms }
 */
function arrayToSparseQubo(Q) {
  let maxIndex = -1;
  for (const [i, j] of Q) {
    if (i > maxIndex) maxIndex = i;
    if (j > maxIndex) maxIndex = j;
  }
  const n = maxIndex + 1;
  
  // Convert to sparse format
  const terms = Q.map(([i, j, w]) => [i, j, w]);
  
  return { n, terms };
}

/**
 * Convert sparse QUBO format { n, terms } to array format [i, j, weight]
 */
function sparseQuboToArray(qubo) {
  return qubo.terms.map(([i, j, w]) => [i, j, w]);
}

// Re-export encoders and baselines
export {
  encodeMaxCutToQubo,
  evaluateMaxCut,
  simulatedAnnealingQubo,
  greedyQubo,
  greedyMaxCut
};
