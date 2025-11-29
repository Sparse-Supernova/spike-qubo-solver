// src/solver.mjs
// Spike-based QUBO optimizer for sparse QUBOs.

function buildAdjacency(qubo) {
  const { n, terms } = qubo;
  const byVar = Array.from({ length: n }, () => []);
  for (let idx = 0; idx < terms.length; idx++) {
    const [i, j] = terms[idx];
    byVar[i].push(idx);
    if (j !== i) byVar[j].push(idx);
  }
  return byVar;
}

function energyOf(qubo, x) {
  const { terms } = qubo;
  let E = 0;
  for (let k = 0; k < terms.length; k++) {
    const [i, j, q] = terms[k];
    E += q * x[i] * x[j];
  }
  return E;
}

function deltaEnergyForFlip(qubo, x, k, adj) {
  const { terms } = qubo;
  const oldxk = x[k];
  const newxk = 1 - oldxk;
  let delta = 0;
  const list = adj[k];
  for (let idx = 0; idx < list.length; idx++) {
    const tIndex = list[idx];
    const [i, j, q] = terms[tIndex];
    if (i === k && j === k) {
      delta += q * (newxk - oldxk);
    } else if (i === k) {
      const jx = x[j];
      delta += q * (newxk * jx - oldxk * jx);
    } else if (j === k) {
      const ix = x[i];
      delta += q * (ix * newxk - ix * oldxk);
    }
  }
  return delta;
}

/**
 * Solve a sparse QUBO using spike-based dynamics.
 * 
 * @param {Object} qubo - QUBO problem: { n: number, terms: Array<[i, j, q]> }
 * @param {Object} options - Solver options
 * @param {number} options.maxIterations - Maximum iterations (default: 1500)
 * @param {number} options.plateauWindow - Steps without improvement before early termination (default: 300)
 * @param {number} options.warmupIters - Warmup iterations before plateau detection (default: 300)
 * @param {number} options.noiseStd - Base noise standard deviation (default: 0.2)
 * @param {number} options.softRestartInterval - Interval for soft restarts (default: 250, 0 to disable)
 * @param {number} options.softRestartFraction - Fraction of spins to flip on restart (default: 0.02)
 * @param {boolean} options.recordTrace - Record energy trace (default: false)
 * @param {number} options.seed - RNG seed for reproducibility
 * @returns {Promise<Object>} Solution with energy, state, metrics, and optional trace
 */
export async function solveQubo(qubo, options = {}) {
  const {
    maxIterations = 1500,
    plateauWindow = 300,
    warmupIters = 300,
    noiseStd = 0.2,
    softRestartInterval = 250,
    softRestartFraction = 0.02,
    recordTrace = false,
    seed
  } = options;

  const { n } = qubo;
  const adj = buildAdjacency(qubo);

  // Seeded RNG
  let rngState = (seed ?? 1234567) | 0;
  const rand = () => {
    rngState = (1103515245 * rngState + 12345) & 0x7fffffff;
    return rngState / 0x80000000;
  };
  const randomChoice = (max) => Math.floor(rand() * max);

  // Initialize state
  const x = new Array(n);
  for (let i = 0; i < n; i++) x[i] = rand() < 0.5 ? 0 : 1;

  let E = energyOf(qubo, x);
  let bestEnergy = E;
  const bestSolution = x.slice();

  const energies = recordTrace ? [E] : null;

  const t0 = Date.now();

  let noImprovementCount = 0;
  let iterations = 0;
  let earlyTermination = false;
  let plateauResets = 0;

  // Two-phase temperature schedule
  const temperatureSchedule = Array.from({ length: maxIterations }, (_, i) => {
    const t = i / (maxIterations - 1 || 1);
    if (t < 0.4) {
      const alpha = t / 0.4;
      return 1.0 - 0.5 * alpha; // 1.0 → 0.5
    } else {
      const beta = (t - 0.4) / 0.6;
      return 0.5 - 0.49 * beta; // 0.5 → ~0.01
    }
  });

  // Two-phase noise schedule
  const noiseSchedule = Array.from({ length: maxIterations }, (_, i) => {
    const t = i / (maxIterations - 1 || 1);
    if (t < 0.4) {
      const alpha = t / 0.4;
      return 0.2 - 0.12 * alpha; // 0.2 → 0.08
    } else {
      const beta = (t - 0.4) / 0.6;
      return 0.08 - 0.07 * beta; // 0.08 → ~0.01
    }
  });

  for (let it = 0; it < maxIterations; it++) {
    iterations = it + 1;

    // Soft restart after warmup
    if (
      iterations > warmupIters &&
      softRestartInterval > 0 &&
      iterations % softRestartInterval === 0
    ) {
      const flips = Math.max(1, Math.floor(softRestartFraction * n));
      for (let f = 0; f < flips; f++) {
        const k = randomChoice(n);
        const dE = deltaEnergyForFlip(qubo, x, k, adj);
        x[k] = 1 - x[k];
        E += dE;
      }
      if (E < bestEnergy) {
        bestEnergy = E;
        for (let i = 0; i < n; i++) bestSolution[i] = x[i];
      }
      noImprovementCount = 0;
    }

    const k = randomChoice(n);
    let dE = deltaEnergyForFlip(qubo, x, k, adj);

    // Add Gaussian noise
    const sigma = noiseSchedule[it] * noiseStd;
    if (sigma > 0) {
      const u1 = rand() || 1e-9;
      const u2 = rand();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      dE += sigma * z;
    }

    const T = temperatureSchedule[it];
    let accept = false;

    if (dE < 0) {
      accept = true;
    } else if (T > 1e-9) {
      const p = Math.exp(-dE / T);
      const extra = iterations < warmupIters ? 0.25 : 0.0;
      if (rand() < Math.min(1, p + extra)) accept = true;
    }

    if (accept) {
      x[k] = 1 - x[k];
      E += dE;

      if (E < bestEnergy) {
        bestEnergy = E;
        for (let i = 0; i < n; i++) bestSolution[i] = x[i];
        noImprovementCount = 0;
      } else {
        noImprovementCount++;
      }
    } else {
      noImprovementCount++;
    }

    if (recordTrace) {
      energies.push(E);
    }

    // Plateau detection with reheat
    if (iterations > warmupIters && noImprovementCount >= plateauWindow) {
      // Reheat: increase noise temporarily
      const currentNoise = noiseSchedule[it] * noiseStd;
      if (currentNoise < noiseStd * 0.3) {
        // Temporarily increase noise for a few iterations
        for (let reheat = 0; reheat < 10 && it + reheat < maxIterations; reheat++) {
          noiseSchedule[it + reheat] = Math.min(0.3, noiseSchedule[it + reheat] * 1.5);
        }
        noImprovementCount = 0;
        plateauResets++;
      } else {
        earlyTermination = true;
        break;
      }
    }
  }

  const t1 = Date.now();
  const timeMs = t1 - t0;

  const result = {
    bestEnergy,
    state: bestSolution,
    iterations,
    timeMs,
    earlyTermination,
    plateauResets
  };

  if (recordTrace) {
    result.trace = energies;
  }

  return result;
}

