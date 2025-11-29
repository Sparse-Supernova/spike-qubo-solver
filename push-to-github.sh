#!/bin/bash
# push-to-github.sh
# Quick script to push spike-qubo-solver to GitHub

set -e

REPO_NAME="spike-qubo-solver"

echo "🚀 Pushing spike-qubo-solver to GitHub"
echo ""

# Check if remote exists
if git remote get-url origin >/dev/null 2>&1; then
    echo "✓ Remote 'origin' already configured:"
    git remote get-url origin
    echo ""
    read -p "Push to existing remote? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 0
    fi
else
    echo "⚠️  No GitHub remote configured yet."
    echo ""
    echo "First, create the repository on GitHub:"
    echo "  1. Go to: https://github.com/new"
    echo "  2. Repository name: $REPO_NAME"
    echo "  3. Description: A spike-driven QUBO and Max-Cut solver for medium-scale combinatorial optimization in pure JavaScript"
    echo "  4. Choose Public or Private"
    echo "  5. DO NOT initialize with README, .gitignore, or license"
    echo "  6. Click 'Create repository'"
    echo ""
    read -p "Have you created the repository? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Please create the repository first, then run this script again."
        exit 1
    fi
    
    echo ""
    read -p "Enter your GitHub username: " GITHUB_USER
    
    if [ -z "$GITHUB_USER" ]; then
        echo "Error: GitHub username required"
        exit 1
    fi
    
    echo ""
    echo "Adding remote: https://github.com/$GITHUB_USER/$REPO_NAME.git"
    git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
fi

# Ensure branch is main
git branch -M main 2>/dev/null || true

# Push
echo ""
echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Successfully pushed to GitHub!"
echo ""
git remote get-url origin | sed 's|https://github.com/|https://github.com/|' | sed 's|\.git$||' | xargs -I {} echo "Repository: {}"

