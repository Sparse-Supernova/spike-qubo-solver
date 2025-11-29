// src/encoders.mjs
// Encoders from combinatorial problems to QUBO form.

/**
 * Encode Max-Cut problem to QUBO.
 * @param {Object} graph - Graph: { n: number, edges: Array<[i, j, w]> }
 * @returns {Object} QUBO: { n: number, terms: Array<[i, j, q]> }
 */
export function encodeMaxCutToQubo(graph) {
  const { n, edges } = graph;
  const Q = new Map(); // key "i,j" with i<=j

  const addQ = (iIn, jIn, val) => {
    let i = iIn;
    let j = jIn;
    if (i > j) [i, j] = [j, i];
    const key = `${i},${j}`;
    const prev = Q.get(key) || 0;
    Q.set(key, prev + val);
  };

  for (const [i, j, w] of edges) {
    // Maximize cut = Σ w_ij (x_i + x_j - 2 x_i x_j)
    // Minimize E = -Σ w_ij (x_i + x_j - 2 x_i x_j)
    // => E = Σ w_ij (-x_i - x_j + 2 x_i x_j)
    addQ(i, i, -w);
    addQ(j, j, -w);
    addQ(i, j, 2 * w);
  }

  const terms = [];
  for (const [key, q] of Q.entries()) {
    const [iStr, jStr] = key.split(',');
    const i = parseInt(iStr, 10);
    const j = parseInt(jStr, 10);
    terms.push([i, j, q]);
  }

  return { n, terms };
}

/**
 * Evaluate Max-Cut value from solution.
 * @param {Object} graph - Graph: { n: number, edges: Array<[i, j, w]> }
 * @param {Array<number>} x - Binary solution vector
 * @returns {number} Cut value
 */
export function evaluateMaxCut(graph, x) {
  const { edges } = graph;
  let cut = 0;
  for (const [i, j, w] of edges) {
    if (x[i] !== x[j]) cut += w;
  }
  return cut;
}

