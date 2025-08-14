#!/bin/bash

# Vocabulary Lookup Extension - GitHub Auto Upload Script
echo "🎯 Vocabulary Lookup Extension - GitHub Auto Upload"
echo "================================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git not installed${NC}"
    echo "Please install Git first:"
    echo "  Windows: https://git-scm.com/download/win"
    echo "  macOS:   brew install git"
    echo "  Linux:   sudo apt install git"
    exit 1
fi

echo -e "${GREEN}✅ Git is installed${NC}"

# Check Git configuration
if [[ -z $(git config --global user.name) ]] || [[ -z $(git config --global user.email) ]]; then
    echo -e "${YELLOW}⚠️ Git user info not configured${NC}"
    read -p "Enter your name: " user_name
    read -p "Enter your email: " user_email
    
    git config --global user.name "$user_name"
    git config --global user.email "$user_email"
    echo -e "${GREEN}✅ Git user info configured${NC}"
fi

# Get GitHub info
echo ""
echo -e "${BLUE}📝 GitHub Repository Info${NC}"
read -p "Enter your GitHub username: " github_username
read -p "Enter repository name (default: vocabulary-lookup-extension): " repo_name
repo_name=${repo_name:-vocabulary-lookup-extension}

# Confirm info
echo ""
echo -e "${YELLOW}📋 Confirm Info:${NC}"
echo "  GitHub username: $github_username"
echo "  Repository name: $repo_name"
echo "  Repository URL: https://github.com/$github_username/$repo_name"
echo ""
read -p "Is this correct? (y/n): " confirm

if [[ $confirm != "y" && $confirm != "Y" ]]; then
    echo -e "${RED}❌ Cancelled${NC}"
    exit 1
fi

# Remove existing git repo if exists
if [ -d ".git" ]; then
    echo -e "${YELLOW}⚠️ Existing Git repo detected${NC}"
    read -p "Continue and reinitialize? (y/n): " continue_confirm
    if [[ $continue_confirm != "y" && $continue_confirm != "Y" ]]; then
        echo -e "${RED}❌ Cancelled${NC}"
        exit 1
    fi
    rm -rf .git
fi

# Step 1: Initialize git repo
echo ""
echo -e "${BLUE}🔧 Step 1: Initialize Git repository${NC}"
git init
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Git repo initialized${NC}"
else
    echo -e "${RED}❌ Failed to initialize Git repo${NC}"
    exit 1
fi

# Step 2: Add files
echo ""
echo -e "${BLUE}📁 Step 2: Add files${NC}"
git add .
echo -e "${GREEN}✅ Files added${NC}"

# Show files to be committed
echo ""
echo -e "${YELLOW}📄 Files to be committed:${NC}"
git status --short

# Step 3: Create commit
echo ""
echo -e "${BLUE}💾 Step 3: Create commit${NC}"
git commit -m "Initial commit: Smart vocabulary lookup extension with popup windows

✨ Features:
- Smart popup window positioned on the right side
- Intelligent positioning to avoid going off-screen
- One-click vocabulary lookup via right-click menu
- Full Vocabulary.com experience in popup
- Non-intrusive design for seamless reading

🛠️ Technical:
- Chrome Manifest V3 extension
- Service worker background script
- Smart window positioning API
- Minimal permissions: contextMenus, tabs, windows"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Commit created${NC}"
else
    echo -e "${RED}❌ Failed to create commit${NC}"
    exit 1
fi

# Step 4: Add remote repository
echo ""
echo -e "${BLUE}🔗 Step 4: Connect to GitHub repository${NC}"
remote_url="https://github.com/$github_username/$repo_name.git"
git remote add origin "$remote_url"
echo -e "${GREEN}✅ Remote repository added: $remote_url${NC}"

# Step 5: Set main branch
echo ""
echo -e "${BLUE}🌿 Step 5: Set main branch${NC}"
git branch -M main
echo -e "${GREEN}✅ Main branch set${NC}"

# Step 6: Push to GitHub
echo ""
echo -e "${BLUE}🚀 Step 6: Push to GitHub${NC}"
echo -e "${YELLOW}⚠️ This step requires GitHub authentication${NC}"
echo "  If asked for password, use Personal Access Token"
echo "  Generate token: GitHub Settings → Developer settings → Personal access tokens"
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 Success! Project uploaded to GitHub!${NC}"
    echo ""
    echo -e "${BLUE}📋 Important Links:${NC}"
    echo "  🏠 Repository: https://github.com/$github_username/$repo_name"
    echo "  📥 Clone URL: $remote_url"
    echo "  🐛 Issues: https://github.com/$github_username/$repo_name/issues"
    echo "  📦 Releases: https://github.com/$github_username/$repo_name/releases"
    echo ""
    echo -e "${YELLOW}🔧 Next Steps:${NC}"
    echo "  1. Visit repository page to confirm upload"
    echo "  2. Add topics in Settings"
    echo "  3. Create first Release"
    echo "  4. Update README with your username"
    echo ""
    echo -e "${GREEN}🎯 Project published successfully!${NC}"
else
    echo ""
    echo -e "${RED}❌ Push failed${NC}"
    echo -e "${YELLOW}💡 Possible solutions:${NC}"
    echo "  1. Make sure GitHub repository exists"
    echo "  2. Check username and repository name"
    echo "  3. Use Personal Access Token instead of password"
    echo "  4. Check network connection"
    echo ""
    echo "📖 See GITHUB_SETUP.md for detailed help"
fi