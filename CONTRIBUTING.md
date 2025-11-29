# Contributing to spike-qubo-solver

Thanks for your interest in contributing!  
This repository is a **public optimisation sandbox** for QUBO and Max-Cut experiments.  
It intentionally contains only self-contained spike/SA/greedy solvers with *no* private or proprietary components.

Please read these guidelines before opening a PR or issue.

---

## What you *can* contribute

We welcome contributions that improve the public solver framework without expanding scope beyond generic optimisation.

### ✔ Algorithms & heuristics

- Additional *classical* baselines (tabu search, hill-climbing variants, local search, randomised heuristics)
- Improvements to the spike solver **as long as they remain generic**
- Public-domain annealing schedules

### ✔ Benchmarks

- New QUBO / Max-Cut instances (JSON format)
- Benchmark scripts
- CSV/JSON output tools
- Visualisation utilities

### ✔ Documentation

- README improvements
- Code comments
- Tutorials and examples
- Usage guides
- Public comparison notes

### ✔ Tooling

- TypeScript type definitions
- CLI improvements
- GitHub Actions CI (tests/benchmarks)
- Packaging refinements

---

## What is *out of scope*

The following topics belong to separate internal/private projects and **must not** appear in this repository:

### ❌ Sparse encoders

(e.g. sparse signatures, structured embeddings, indexing logic, median/MAD transforms)

### ❌ USL / FRAI / asymmetry metrics

(no Universal Saturation Law, no FRAI calculations, no dynamic asymmetry estimators)

### ❌ USAD anomaly detection

(no conformal prediction, no anomaly kernels, no calibration pools)

### ❌ Proprietary Q-HAL / neuromorphic components

(no device abstraction, no TTFS, no encoder kernels, no "real" spiking hardware logic)

### ❌ Any code copied from private/internal repos

(even small fragments)

### ❌ Any "advanced" dimensionality or physics-derived scaling heuristics

(keep this repo algorithmically simple)

This boundary keeps the project safe, stable, and open for community contribution without exposing private technology.

---

## Development workflow

1. Fork the repo  
2. Create a feature branch  
3. Ensure `npm test` and `npm run bench` pass  
4. Submit a PR with a clear summary of changes

Small, focused PRs are preferred over large multi-feature changes.

---

## Code style

- Pure ESM (`.mjs`) modules
- No external dependencies unless clearly justified
- Keep code readable, well-commented, and generic
- Write functions that are easy to benchmark and test
- Prefer small modules over multi-thousand-line files

---

## License

By contributing, you agree that your contributions will be licensed under the repository's open-source license (Apache 2.0).

---

Thanks again for helping improve this project!

