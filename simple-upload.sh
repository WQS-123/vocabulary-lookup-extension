#!/bin/bash

echo "🚀 Simple GitHub Upload Script"
echo "=============================="

# Get user info
read -p "GitHub username: " username
read -p "Repository name (default: vocabulary-lookup-extension): " repo
repo=${repo:-vocabulary-lookup-extension}

echo ""
echo "Uploading to: https://github.com/$username/$repo"
echo ""

# Clean and initialize
rm -rf .git
git init

# Add and commit
git add .
git commit -m "Initial commit: Vocabulary lookup extension with smart popup windows"

# Connect and push
git remote add origin "https://github.com/$username/$repo.git"
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Success! Visit: https://github.com/$username/$repo"
else
    echo ""
    echo "❌ Failed. Make sure:"
    echo "1. Repository exists on GitHub"
    echo "2. You have access permissions"
    echo "3. Use Personal Access Token if asked for password"
fi