# Spike QUBO Solver

[![CI](https://github.com/Sparse-Supernova/spike-qubo-solver/actions/workflows/ci.yml/badge.svg)](https://github.com/Sparse-Supernova/spike-qubo-solver/actions/workflows/ci.yml)
![USL Repo-Sat Audit](https://img.shields.io/badge/USL%20Repo--Sat-Passed-skyblue?style=flat-square)

> _USL repo-saturation audit passed — no proprietary algorithms or high-dimensional signatures detected._

**Status:** experimental but tested (see [TEST_SUMMARY.md](./TEST_SUMMARY.md)).

A lightweight, spike-based solver for QUBO and Max-Cut problems, designed for **medium-scale combinatorial optimisation** in pure JavaScript.

This package gives you:

- A spike-style QUBO / Max-Cut solver.
- Baseline algorithms (Simulated Annealing, greedy hill-climbing).
- Simple metrics and benchmark scripts.
- A small CLI for running JSON instances from the command line.

It is intended as a **public optimisation sandbox** – suitable for experiments, benchmarks, and teaching – without exposing any private sparse encoders, anomaly detectors, or advanced diagnostics.

---

## Security / IP Notice

This repository contains **only public, non-proprietary code** intended for experimentation, benchmarking, and education.

No private algorithms, internal research components, or proprietary logic are included in this package.

Specifically, this repository **does not** include:

- any Sparse Supernova encoders or signature kernels
- any USAD (Universal Sparse Anomaly Detector) components
- any USL (Universal Saturation Law) or FRAI asymmetry metrics
- any Quantum-HAL, hardware abstraction, or neuromorphic stack logic
- any optimisation engines, kernels, or data structures used in private systems
- any code copied from private or internal repositories

All optimisation routines provided here (spike, simulated annealing, greedy) are **generic classical heuristics** implemented solely for public use.

This project is published under an open-source license for transparency and community experimentation.

The maintainers make **no commitment** that it reflects, approximates, or reveals any functionality of the private Sparse/USAD/USL/Q-HAL systems.

---

## Features

- ✅ **Spike-based solver** for QUBO and Max-Cut.
- ✅ **Baselines included**:
  - Simulated Annealing (`simulatedAnnealingQubo`)
  - Greedy QUBO / Max-Cut (`greedyQubo`, `greedyMaxCut`)
- ✅ **Pure ESM**, no native dependencies.
- ✅ **Metrics helpers** (`summarizeRuns`) for quick benchmarking.
- ✅ **Examples + test scripts** for small and medium problems.
- ✅ **CLI** (`spike-qubo-solver`) for running JSON instances.

This repo contains **only** the core spike solver, simple baselines, and generic metrics.  
Advanced diagnostics (e.g. USL/FRAI, auto-tuning, custom sparse encoders, or neuromorphic backends) live in separate internal tools and **are not part of this package**.

---

## USL Repo-Sat Audit

This repository has been checked using a *USL repo-saturation audit*, a safety scan designed to ensure that **no proprietary high-dimensional algorithms, internal research kernels, or signature-based optimisation components** are present in the public codebase.

The audit verifies that the repository contains:

- no sparse signature encoders
- no anomaly-detection kernels
- no universal scaling or asymmetry modules
- no neuromorphic, quantum, or hardware abstraction logic
- no high-dimensional patterns characteristic of internal systems

The current version of this package **passed the audit**, indicating that it contains only the intended **public, generic optimisation heuristics** and no private or sensitive IP.

---

## Installation

```bash
npm install @sparse-supernova/spike-qubo-solver

# or

pnpm add @sparse-supernova/spike-qubo-solver
```

Node.js >= 20 is recommended.

## API Demo

Try the solver without installing anything! The package is deployed as a Cloudflare Worker with a simple REST API.

**Live endpoint:** `https://spike-qubo-solver-worker.sparsesupernova.workers.dev/api/solve`

> ⚠️ **Important:** The endpoint only accepts **POST** requests. Browsers will send GET requests by default, so use `curl`, `fetch`, or a REST client.

### Example: Solve a QUBO

**Using curl:**
```bash
curl -X POST https://spike-qubo-solver-worker.sparsesupernova.workers.dev/api/solve \
  -H "Content-Type: application/json" \
  -d '{
    "problem": {
      "kind": "qubo",
      "payload": [
        [0, 0, -1],
        [1, 1, -1],
        [2, 2, -1],
        [0, 1, 2]
      ]
    },
    "options": {
      "maxIterations": 1000
    }
  }'
```

**Using JavaScript fetch:**
```javascript
const response = await fetch('https://spike-qubo-solver-worker.sparsesupernova.workers.dev/api/solve', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    problem: {
      kind: 'qubo',
      payload: [[0, 0, -1], [1, 1, -1], [2, 2, -1], [0, 1, 2]]
    },
    options: { maxIterations: 1000 }
  })
});
const result = await response.json();
console.log(result);
```

### Example: Solve Max-Cut

**Using curl:**
```bash
curl -X POST https://spike-qubo-solver-worker.sparsesupernova.workers.dev/api/solve \
  -H "Content-Type: application/json" \
  -d '{
    "problem": {
      "kind": "maxcut",
      "payload": {
        "n": 4,
        "edges": [
          [0, 1, 1],
          [1, 2, 1],
          [2, 3, 1],
          [3, 0, 1]
        ]
      }
    },
    "options": {
      "maxIterations": 1000
    }
  }'
```

**Response format:**
```json
{
  "bestEnergy": -2.5,
  "state": [1, 0, 1],
  "iterations": 1000,
  "timeMs": 12.5
}
```

## Basic usage

### QUBO

```javascript
import { solveQubo } from '@sparse-supernova/spike-qubo-solver';

const qubo = {
  n: 3,
  terms: [
    [0, 0, -1],
    [1, 1, -1],
    [2, 2, -1],
    [0, 1, 2],
    [1, 2, 2]
  ]
};

const result = await solveQubo(qubo, {
  maxSteps: 1200,
  trace: true
});

console.log('Best energy:', result.bestEnergy);
console.log('Iterations:', result.iterations);
console.log('Time (ms):', result.timeMs);
```

### Max-Cut

```javascript
import { solveMaxCut } from '@sparse-supernova/spike-qubo-solver';

const graph = {
  n: 4,
  edges: [
    [0, 1, 1],
    [1, 2, 1],
    [2, 3, 1],
    [3, 0, 1]
  ]
};

const result = await solveMaxCut(graph, {
  maxSteps: 1500,
  trace: false
});

console.log('Cut value:', result.cutValue);
console.log('Iterations:', result.iterations);
console.log('Time (ms):', result.timeMs);
```

## Baselines

You can compare the spike solver against the built-in baselines.

### Simulated Annealing (QUBO)

```javascript
import { simulatedAnnealingQubo } from '@sparse-supernova/spike-qubo-solver';

const res = await simulatedAnnealingQubo(qubo, {
  maxSteps: 3000,
  T0: 5.0,
  alpha: 0.995,
  recordTrace: false
});

console.log('SA best energy:', res.bestEnergy);
console.log('SA time (ms):', res.timeMs);
```

### Greedy hill-climbing

```javascript
import { greedyQubo, greedyMaxCut } from '@sparse-supernova/spike-qubo-solver';

const quboGreedy = await greedyQubo(qubo, { maxPasses: 10 });
const maxCutGreedy = await greedyMaxCut(graph, { maxPasses: 10 });

console.log('Greedy QUBO energy:', quboGreedy.bestEnergy);
console.log('Greedy Max-Cut value:', maxCutGreedy.bestCut);
```

## CLI

After installation, you can use the CLI:

```bash
# QUBO: JSON file with { n, terms }
spike-qubo-solver solve-qubo examples/qubo_example.json

# Max-Cut: JSON file with { n, edges }
spike-qubo-solver solve-maxcut examples/graph_example.json
```

The CLI prints a JSON result (energy, iterations, time, etc.) to stdout.

## Public API (Supported Surface)

This section defines the complete supported API surface for spike-qubo-solver.

**No other functions, modules, or behaviours are considered public or stable.**

Anything not listed here is internal and may change without notice.

---

### 1. QUBO Solver

**`solveQubo(qubo, options?) → Promise<ResultQubo>`**

Solve a Quadratic Unconstrained Binary Optimisation problem.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `qubo` | `{ n: number, terms: [i,j,q][] }` | QUBO instance in sparse triplet format |
| `options.maxSteps` | `number` | Max iterations (default: 2000) |
| `options.seed` | `number` | Optional seed for reproducibility |
| `options.trace` | `boolean` | If true, return energy trace |

**Returns:**

```typescript
interface ResultQubo {
  bestEnergy: number;
  state: number[];        // 0/1 assignment
  iterations: number;
  timeMs: number;
  trace?: { step: number; energy: number }[];
}
```

---

### 2. Max-Cut Solver

**`solveMaxCut(graph, options?) → Promise<ResultMaxCut>`**

Solve Max-Cut using the same spike optimiser.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `graph` | `{ n: number, edges: [i,j,w][] }` | Undirected weighted graph |
| `options.maxSteps` | `number` | Max steps (default: 2000) |
| `options.seed` | `number` | Optional seed |
| `options.trace` | `boolean` | Trace toggle |

**Returns:**

```typescript
interface ResultMaxCut {
  cutValue: number;
  state: number[];        // 0/1 cut membership
  iterations: number;
  timeMs: number;
  trace?: { step: number; energy: number }[];
}
```

---

### 3. Encoders

**`encodeMaxCutToQubo(graph) → { n, terms }`**

Convert a Max-Cut instance to an equivalent QUBO.

**`evaluateMaxCut(graph, state) → number`**

Compute the cut value of a given 0/1 state.

---

### 4. Baselines (Included for Comparison)

All baselines are generic classical heuristics — safe to expose publicly and not related to private algorithms.

**`simulatedAnnealingQubo(qubo, options?) → Promise<ResultSA>`**

**Parameters:**
- `maxSteps` (default: 3000)
- `T0` (initial temperature, default: 5.0)
- `alpha` (cooling factor, default: 0.995)
- `recordTrace` (boolean)

**Returns:**
```typescript
{
  bestEnergy: number;
  bestState: number[];
  iterations: number;
  timeMs: number;
  acceptedMoves: number;
  trace?: { step: number; energy: number }[];
}
```

**`greedyQubo(qubo, options?) → Promise<{ bestEnergy: number, bestState: number[], passes: number }>`**

Simple hill-climber.

**Parameters:**
- `maxPasses` (default: 10)

**`greedyMaxCut(graph, options?) → Promise<{ bestCut: number, bestState: number[], passes: number }>`**

Greedy Max-Cut improvement.

**Parameters:**
- `maxPasses` (default: 10)

---

### 5. Metrics

**`summarizeRuns(results[]) → Summary`**

Aggregate statistics over multiple runs:

- `min` / `max` / `mean` / `std` best energy
- `min` / `max` / `mean` / `std` timeMs
- `min` / `max` / `mean` / `std` iterations

Safe, generic statistics only.

---

### 6. CLI

**`spike-qubo-solver solve-qubo <path | url>`**

Run solver on a QUBO JSON file.

**`spike-qubo-solver solve-maxcut <path | url>`**

Run solver on a Max-Cut JSON file.

---

## ❌ Explicitly Out of Scope (Not Supported, Never Exported)

This table is the important safety guarantee.

| Area | Status | Reason |
|------|--------|--------|
| Sparse encoders / signature kernels | ❌ Not public | Proprietary IP |
| USAD anomaly detection | ❌ Not public | Proprietary IP |
| Universal Saturation Law (USL) | ❌ Not public | Proprietary physics layer |
| FRAI / asymmetry metrics | ❌ Not public | Private research |
| Q-HAL / neuromorphic device abstraction | ❌ Not public | Internal only |
| Any file under private repos | ❌ Never exported | Safety/IP boundary |
| Quantum-driven kernels | ❌ Not included | Private research |

---

## Benchmarks & metrics

There are simple benchmark scripts under `tests/`:

- `npm run bench` – small, illustrative benchmark.
- `npm run bench:compare` – compare spike vs SA vs greedy on random QUBO/Max-Cut instances.

The `summarizeRuns` helper in `src/metrics.mjs` lets you quickly compute min/mean/std summaries over multiple runs.

There is also a generator for ready-to-run benchmark instances:

```bash
npm run gen:bench-instances
```

This populates `examples/benchmarks/` with QUBO and Max-Cut problems at different sizes
(e.g. 50, 100, 300 variables). In our own experiments, the 300-variable regime is often
a practical "sweet spot" for spike-style heuristics: rich dynamics at millisecond-scale runtimes.

### Why ~300 variables?

In our internal experiments, problems around **300 variables** often emerge as a practical
sweet spot for this spike-style solver:

- They are **large enough** to be interesting (non-trivial structure, real combinatorial difficulty).
- They are still **small enough** to solve in **milliseconds** on a laptop or edge runtime.
- The solver's search dynamics remain **rich**:
  - frequent improvements early on,
  - meaningful refinements later in the run,
  - without getting stuck too quickly.
- The **energy-per-millisecond efficiency** tends to peak in this regime.

By contrast:

- Much smaller instances (e.g. n=10–50) are usually "too easy" – everything works, but
  there is not much to learn about the algorithm's behaviour.
- Much larger instances (n>300) are **still solvable**, but:
  - runtimes grow,
  - improvements become more front-loaded,
  - and the marginal benefit per unit of compute drops.

For that reason, the examples and generated benchmark instances focus on sizes up to
around 300 variables as a good balance between **realism** and **runtime/energy cost**.

## Carbon & efficiency note

This library is designed for medium-scale experiments.  
The spike solver typically runs in milliseconds for problems in the tens–low thousands of variables on a laptop or edge runtime, which keeps both compute and energy use modest.

For very large or production-critical deployments, you should treat this package as a prototype / research tool, not as an energy-optimised production engine.

As a rough rule of thumb:

- Instances up to **~300 variables** are a good fit for everyday experiments and
  small-scale benchmarking (millisecond runtimes on typical hardware).
- Instances significantly larger than this (e.g. **n > 300**) are better treated as
  **research-only or heavy analysis cases**:
  - they may consume noticeably more time and energy,
  - they are more sensitive to solver settings,
  - and the marginal improvement per unit of compute tends to diminish.

If you work with higher-dimensional problems, it is recommended to measure runtime
and energy use explicitly and to treat those runs as **occasional heavy jobs**
rather than default workloads.

## JSON Formats

This library accepts simple JSON formats for QUBO and Max-Cut instances.
These formats are intentionally minimal and easy to create by hand.

---

### QUBO Format (`qubo.json`)

A QUBO is described as:

- `n`: number of variables
- `terms`: array of `[i, j, q]` entries representing the quadratic matrix Q  
  (only non-zero terms need to be listed)

#### Example

```json
{
  "n": 5,
  "terms": [
    [0, 0, -1.0],
    [1, 1, -1.0],
    [2, 2, -1.0],
    [0, 1, 2.0],
    [1, 2, -0.5],
    [3, 4, 1.2]
  ]
}
```

**Meaning:**

Minimise the quadratic form  
E(x) = Σ Q[i][j] × x[i] × x[j]

Terms may be upper-triangular or full; the solver handles duplicates cleanly.

Values may be floats or integers.

---

### Max-Cut Format (`graph.json`)

A Max-Cut graph is described as:

- `n`: number of nodes
- `edges`: list of `[i, j, weight]`

#### Example

```json
{
  "n": 6,
  "edges": [
    [0, 1, 1.0],
    [1, 2, 0.8],
    [2, 3, 1.1],
    [3, 4, 0.9],
    [4, 5, 1.0],
    [5, 0, 1.0]
  ]
}
```

**Meaning:**

Maximise Σ weight × 1_{x[i] ≠ x[j]}

Weights may be float or integer.

Edges are undirected; only one direction is needed.

---

### Expected CLI Usage

After installing:

```bash
spike-qubo-solver solve-qubo examples/qubo.json
spike-qubo-solver solve-maxcut examples/graph.json
```

The CLI prints:

- best energy / cut value
- iterations
- time in ms
- (optional) trace data

## Status and roadmap

**Status:** experimental, API may evolve.

**Near-term roadmap:**
- Additional public problem instances (QUBO / Max-Cut).
- Optional TypeScript type definitions.
- More benchmarking tools (JSON/CSV output for plotting).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on contributing to this project.

## License

This project is licensed under the Apache License 2.0 – see the [LICENSE](./LICENSE) file for details.
