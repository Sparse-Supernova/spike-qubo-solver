# GitHub Setup Instructions

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `spike-qubo-solver`
3. Description: `A spike-driven QUBO and Max-Cut solver for medium-scale combinatorial optimization in pure JavaScript`
4. Choose **Public** or **Private**
5. **Do NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 2: Connect and Push

### Option A: Using the helper script

```bash
./setup-github.sh
```

Follow the prompts to enter your GitHub username and repository name.

### Option B: Manual commands

Replace `YOUR_USERNAME` with your GitHub username:

```bash
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/spike-qubo-solver.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 3: Verify

Visit your repository on GitHub:
```
https://github.com/YOUR_USERNAME/spike-qubo-solver
```

You should see all files including:
- README.md
- src/ directory
- examples/ directory
- tests/ directory
- package.json
- LICENSE

## Next Steps

After pushing to GitHub, you can:

1. **Add topics/tags** on GitHub for discoverability:
   - `qubo`
   - `max-cut`
   - `optimization`
   - `combinatorial`
   - `javascript`
   - `solver`

2. **Set up GitHub Actions** (optional) for CI/CD

3. **Publish to npm**:
   ```bash
   npm login
   npm publish
   ```

