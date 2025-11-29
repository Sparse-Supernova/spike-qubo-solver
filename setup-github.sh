#!/bin/bash
# setup-github.sh
# Helper script to connect local repo to GitHub and push

set -e

REPO_NAME="spike-qubo-solver"
GITHUB_USER="${GITHUB_USER:-yourusername}"
# Set GITHUB_USER environment variable or replace 'yourusername' above  # Replace with your GitHub username

echo "Setting up GitHub repository for $REPO_NAME"
echo ""

# Check if remote already exists
if git remote get-url origin >/dev/null 2>&1; then
    echo "Remote 'origin' already exists:"
    git remote get-url origin
    read -p "Do you want to update it? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
    else
        echo "Keeping existing remote."
        exit 0
    fi
fi

# Add remote
echo "Adding GitHub remote..."
echo "Note: Make sure you've created the repository on GitHub first!"
echo "You can create it at: https://github.com/new"
echo ""
read -p "Enter your GitHub username: " GITHUB_USER
read -p "Enter repository name (default: $REPO_NAME): " REPO_NAME_INPUT

if [ -n "$REPO_NAME_INPUT" ]; then
    REPO_NAME="$REPO_NAME_INPUT"
fi

git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"

echo ""
echo "Remote added:"
git remote -v
echo ""

# Push to GitHub
read -p "Ready to push to GitHub? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Pushing to GitHub..."
    git branch -M main
    git push -u origin main
    echo ""
    echo "✓ Successfully pushed to GitHub!"
    echo "Repository URL: https://github.com/$GITHUB_USER/$REPO_NAME"
else
    echo "Skipping push. Run 'git push -u origin main' when ready."
fi

