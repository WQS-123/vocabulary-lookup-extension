#!/bin/bash

echo "🚀 GitHub Upload Script"
echo "======================"

read -p "GitHub username: " username
read -p "Repository name [vocabulary-lookup-extension]: " repo
repo=${repo:-vocabulary-lookup-extension}

echo ""
echo "Uploading to: https://github.com/$username/$repo"
echo ""

rm -rf .git
git init
git add .
git commit -m "Initial commit: Vocabulary lookup extension"
git remote add origin "https://github.com/$username/$repo.git"
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Success! Visit: https://github.com/$username/$repo"
else
    echo ""
    echo "❌ Failed. Check:"
    echo "1. Repository exists on GitHub"
    echo "2. Use Personal Access Token as password"
fi
