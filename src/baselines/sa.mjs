// src/baselines/sa.mjs
// Simple Simulated Annealing baseline for QUBO problems.
// Standalone, does NOT depend on any private / sparse code.

function energyOf(qubo, x) {
  const { terms } = qubo;
  let E = 0;
  for (let k = 0; k < terms.length; k++) {
    const [i, j, q] = terms[k];
    E += q * x[i] * x[j];
  }
  return E;
}

function deltaEnergyForFlip(terms, x, idx) {
  const oldx = x[idx];
  const newx = 1 - oldx;
  let delta = 0;
  for (let k = 0; k < terms.length; k++) {
    const [i, j, q] = terms[k];
    if (i === idx && j === idx) {
      delta += q * (newx - oldx);
    } else if (i === idx) {
      const jx = x[j];
      delta += q * (newx * jx - oldx * jx);
    } else if (j === idx) {
      const ix = x[i];
      delta += q * (ix * newx - ix * oldx);
    }
  }
  return delta;
}

/**
 * Simulated Annealing baseline for QUBO.
 *
 * @param {{n:number, terms:[number,number,number][]}} qubo
 * @param {Object} [options]
 * @param {number} [options.maxSteps=3000]
 * @param {number} [options.T0=5.0]
 * @param {number} [options.alpha=0.995]
 * @param {boolean} [options.recordTrace=false]
 */
export async function simulatedAnnealingQubo(
  qubo,
  {
    maxSteps = 3000,
    T0 = 5.0,
    alpha = 0.995,
    recordTrace = false
  } = {}
) {
  const n = qubo.n;
  const terms = qubo.terms;

  const x = new Array(n);
  for (let i = 0; i < n; i++) {
    x[i] = Math.random() < 0.5 ? 0 : 1;
  }

  let E = energyOf(qubo, x);
  let bestE = E;
  const bestX = x.slice();

  const trace = recordTrace ? [{ step: 0, energy: E }] : null;
  const t0 = performance.now();
  let T = T0;
  let accepted = 0;

  for (let step = 1; step <= maxSteps; step++) {
    const idx = Math.floor(Math.random() * n);
    const dE = deltaEnergyForFlip(terms, x, idx);

    let accept = false;
    if (dE < 0) {
      accept = true;
    } else if (T > 1e-9) {
      const p = Math.exp(-dE / T);
      if (Math.random() < p) accept = true;
    }

    if (accept) {
      accepted++;
      x[idx] = 1 - x[idx];
      E += dE;
      if (E < bestE) {
        bestE = E;
        for (let k = 0; k < n; k++) bestX[k] = x[k];
      }
    }

    if (recordTrace && step % 10 === 0) {
      trace.push({ step, energy: E });
    }

    T *= alpha;
  }

  const t1 = performance.now();

  const result = {
    bestEnergy: bestE,
    bestState: bestX,
    iterations: maxSteps,
    timeMs: t1 - t0,
    acceptedMoves: accepted
  };

  if (recordTrace) {
    result.trace = trace;
  }

  return result;
}

