# Publishing spike-qubo-solver to npm

This document describes the minimal steps to publish a new version of
`@sparse-supernova/spike-qubo-solver` to npm.

It assumes:

- You have publish rights for the package scope.
- You have `npm` configured with the correct account.
- You are on the default branch (e.g. `main`) and your local tree is clean.

---

## 1. Update version

Edit `package.json` and bump the version using semantic versioning:

- **Patch**: bugfixes, internal changes only  
- **Minor**: new features, backwards-compatible  
- **Major**: breaking API changes  

Example:

```json
"version": "0.1.0"
→
"version": "0.1.1"
```

## 2. Sanity checks

Install dependencies:

```bash
npm install
```

Run tests:

```bash
npm test
```

Run benchmarks (optional but recommended):

```bash
npm run bench
npm run bench:compare
```

If any of these fail, fix them before publishing.

## 3. Build step (if you add one later)

Currently this package is pure ESM JavaScript and does not require a build step.

If a build step is added in the future, document it here (e.g. `npm run build`),
and ensure the compiled artifacts are included in the published package.

## 4. Dry-run publish (optional)

You can see what would be published without actually pushing to npm:

```bash
npm publish --dry-run
```

Check:

- Included files
- Entry points (`main`, `exports`)
- License and README

## 5. Publish

When you are satisfied:

```bash
npm publish --access public
```

If using a scoped package (e.g. `@sparse-supernova/spike-qubo-solver`),
`--access public` may be required on the first publish.

## 6. Tag the release (optional but recommended)

Create a git tag that matches the version:

```bash
VERSION=$(node -p "require('./package.json').version")
git tag "v$VERSION"
git push origin "v$VERSION"
```

This makes it easy to correlate npm versions with source code.

## 7. CI verification

After publishing:

- Check GitHub Actions (CI workflow) is green on the tag.
- Optionally add the changelog entry in a `CHANGELOG.md` (if you introduce one).

---

## Notes

- This package is intended as a **public optimisation sandbox**.
- Keep the published surface minimal and generic.
- Do not add private or proprietary modules to the published package.

