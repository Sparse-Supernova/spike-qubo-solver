// src/baselines/greedy.mjs
// Simple greedy / hill-climbing baselines for QUBO and Max-Cut.
// No private / sparse logic, just vanilla heuristics.

function energyOfQubo(qubo, x) {
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
 * Greedy hill-climber for QUBO.
 *
 * @param {{n:number, terms:[number,number,number][]}} qubo
 * @param {Object} [options]
 * @param {number} [options.maxPasses=10]
 */
export async function greedyQubo(
  qubo,
  { maxPasses = 10 } = {}
) {
  const n = qubo.n;
  const terms = qubo.terms;
  const x = new Array(n);

  for (let i = 0; i < n; i++) {
    x[i] = Math.random() < 0.5 ? 0 : 1;
  }

  let E = energyOfQubo(qubo, x);
  let bestE = E;
  const bestX = x.slice();
  let improved = true;
  let passes = 0;

  while (improved && passes < maxPasses) {
    improved = false;
    passes++;

    for (let i = 0; i < n; i++) {
      const dE = deltaEnergyForFlip(terms, x, i);
      if (dE < 0) {
        x[i] = 1 - x[i];
        E += dE;
        if (E < bestE) {
          bestE = E;
          for (let k = 0; k < n; k++) bestX[k] = x[k];
        }
        improved = true;
      }
    }
  }

  return {
    bestEnergy: bestE,
    bestState: bestX,
    passes,
    timeMs: null
  };
}

/**
 * Simple greedy Max-Cut improver:
 *   - Start random cut
 *   - Flip any node that improves cut value
 *
 * @param {{n:number, edges:[number,number,number][]}} graph
 * @param {Object} [options]
 * @param {number} [options.maxPasses=10]
 */
export async function greedyMaxCut(
  graph,
  { maxPasses = 10 } = {}
) {
  const { n, edges } = graph;
  const x = new Array(n);
  for (let i = 0; i < n; i++) {
    x[i] = Math.random() < 0.5 ? 0 : 1;
  }

  const cutValue = () => {
    let v = 0;
    for (let k = 0; k < edges.length; k++) {
      const [i, j, w] = edges[k];
      if (x[i] !== x[j]) v += w;
    }
    return v;
  };

  let current = cutValue();
  let best = current;
  const bestX = x.slice();
  let passes = 0;
  let improved = true;

  while (improved && passes < maxPasses) {
    improved = false;
    passes++;

    for (let i = 0; i < n; i++) {
      x[i] = 1 - x[i];
      const next = cutValue();
      if (next > current) {
        current = next;
        if (next > best) {
          best = next;
          for (let k = 0; k < n; k++) bestX[k] = x[k];
        }
        improved = true;
      } else {
        x[i] = 1 - x[i]; // revert
      }
    }
  }

  return {
    bestCut: best,
    bestState: bestX,
    passes
  };
}

