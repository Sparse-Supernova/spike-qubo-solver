# Test Summary

This document summarizes the test coverage and validation status for spike-qubo-solver.

## Test Status

✅ **All tests passing**

## Test Suites

### Unit Tests
- **Location:** `tests/test.mjs`
- **Status:** ✅ Passing
- **Coverage:** Core solver functionality, encoders, basic edge cases

### API Smoke Tests
- **Location:** `tests/api-smoke.mjs`
- **Status:** ✅ Passing
- **Coverage:** 
  - All public API exports verified
  - Function signatures validated
  - Basic QUBO and Max-Cut solving
  - Local and npm package modes

### Benchmark Tests
- **Location:** `tests/benchmark_compare.mjs`, `tests/benchmark_sweetspot.mjs`
- **Status:** ✅ Passing
- **Coverage:** Performance comparisons, scaling behavior

## CI Status

- **GitHub Actions:** ✅ Passing
- **Workflow:** `.github/workflows/ci.yml`
- **Runs:** Tests, benchmarks, API smoke tests

## Test Coverage

- ✅ QUBO solving (small to medium instances)
- ✅ Max-Cut solving (small to medium graphs)
- ✅ Encoder functions (`encodeMaxCutToQubo`, `evaluateMaxCut`)
- ✅ Baseline solvers (SA, greedy)
- ✅ Metrics helpers (`summarizeRuns`)
- ✅ CLI interface
- ✅ API exports (local and npm package modes)

## Known Limitations

- Large instances (n > 500) are research-only and may have longer runtimes
- Some edge cases in very sparse or very dense problems may need additional validation

## Running Tests

```bash
# Run all tests
npm test

# Run API smoke tests
npm run smoke:api

# Run benchmarks
npm run bench:compare
npm run bench:sweetspot
```

