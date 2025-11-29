// src/metrics.mjs
// Simple, generic metrics helpers (no USL/FRAI).

function mean(arr) {
  if (!arr.length) return null;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function std(arr) {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  const v = arr.reduce((acc, x) => acc + (x - m) ** 2, 0) / (arr.length - 1);
  return Math.sqrt(v);
}

/**
 * Summarize a set of runs with bestEnergy/time/iterations.
 *
 * @param {Array<{bestEnergy:number, timeMs?:number|null, iterations?:number}>} runs
 */
export function summarizeRuns(runs) {
  const energies = runs.map(r => r.bestEnergy).filter(v => typeof v === 'number');
  const times = runs.map(r => r.timeMs).filter(v => typeof v === 'number');
  const iters = runs.map(r => r.iterations).filter(v => typeof v === 'number');

  return {
    nRuns: runs.length,
    energy: {
      min: energies.length ? Math.min(...energies) : null,
      max: energies.length ? Math.max(...energies) : null,
      mean: mean(energies),
      std: std(energies)
    },
    timeMs: {
      min: times.length ? Math.min(...times) : null,
      max: times.length ? Math.max(...times) : null,
      mean: mean(times),
      std: std(times)
    },
    iterations: {
      min: iters.length ? Math.min(...iters) : null,
      max: iters.length ? Math.max(...iters) : null,
      mean: mean(iters),
      std: std(iters)
    }
  };
}

