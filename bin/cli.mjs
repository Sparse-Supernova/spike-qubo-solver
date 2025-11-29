#!/usr/bin/env node
// bin/cli.mjs
// Simple CLI front-end for spike-qubo-solver.
//
// Usage:
//   spike-qubo-solver solve-qubo path/to/qubo.json
//   spike-qubo-solver solve-maxcut path/to/graph.json

import fs from 'node:fs';
import path from 'node:path';
import { solveQubo, solveMaxCut } from '../src/index.mjs';

const argv = process.argv.slice(2);

async function main() {
  const [cmd, filePath] = argv;

  if (!cmd || !filePath) {
    console.log('Usage:');
    console.log('  spike-qubo-solver solve-qubo path/to/qubo.json');
    console.log('  spike-qubo-solver solve-maxcut path/to/graph.json');
    process.exit(1);
  }

  const abs = path.resolve(process.cwd(), filePath);
  const raw = fs.readFileSync(abs, 'utf8');
  const obj = JSON.parse(raw);

  if (cmd === 'solve-qubo') {
    // Expect { n, terms } or any Q-format the library accepts.
    const res = await solveQubo(obj, { maxSteps: 1500, trace: false });
    console.log(JSON.stringify(res, null, 2));
  } else if (cmd === 'solve-maxcut') {
    // Expect { n, edges }
    const res = await solveMaxCut(obj, { maxSteps: 2000, trace: false });
    console.log(JSON.stringify(res, null, 2));
  } else {
    console.error(`Unknown command: ${cmd}`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('[spike-qubo-solver CLI] Fatal error:', err);
  process.exit(1);
});

