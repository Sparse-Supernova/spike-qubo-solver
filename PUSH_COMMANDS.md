# Quick Push to GitHub

## If you've already created the GitHub repository:

Replace `YOUR_USERNAME` with your GitHub username and run:

```bash
cd "/path/to/spike-qubo-solver"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/spike-qubo-solver.git

# Ensure branch is main
git branch -M main

# Push
git push -u origin main
```

## If you haven't created the repository yet:

1. **Create the repo on GitHub:**
   - Go to: https://github.com/new
   - Name: `spike-qubo-solver`
   - Description: `A spike-driven QUBO and Max-Cut solver for medium-scale combinatorial optimization in pure JavaScript`
   - Choose Public or Private
   - **Do NOT** initialize with README, .gitignore, or license
   - Click "Create repository"

2. **Then run the commands above**

## Or use the interactive script:

```bash
./push-to-github.sh
```

