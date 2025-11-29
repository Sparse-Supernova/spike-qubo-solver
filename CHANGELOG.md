# Changelog

All notable changes to this project will be documented in this file.

The format is based on **Keep a Changelog**,  
and this project adheres to **Semantic Versioning**.

---

## [Unreleased]

### Added

- (Placeholder) Upcoming features will go here.

### Changed

- (Placeholder) Improvements will go here.

### Fixed

- (Placeholder) Bug fixes will go here.

---

## [1.0.1] - 2025-11-29

### Added

- Initial public release of `spike-qubo-solver`.
- Pure ESM spike-based solver for QUBO and Max-Cut.
- Baselines: Simulated Annealing + Greedy heuristics.
- CLI tool: `spike-qubo-solver` for running JSON instances.
- Metrics toolkit (`summarizeRuns`).
- Example JSON instances (`examples/qubo.json`, `examples/graph.json`).
- Benchmark scripts (`bench` and `bench:compare`).
- GitHub Actions CI workflow (`ci.yml`).
- Documentation: README, CONTRIBUTING, LICENSE, publishing guide.

---

### How to update this file

- Add changes under `[Unreleased]` as you make them.
- Before publishing to npm, rename `[Unreleased]` → `[x.y.z]` with the date.
- Create a new empty `[Unreleased]` section at the top.

