#!/bin/bash

# 🚀 Vocabulary Lookup Extension - 自动上传到GitHub脚本
# 使用方法：bash auto-upload.sh

echo "🎯 Vocabulary Lookup Extension - GitHub自动上传脚本"
echo "=================================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查是否安装了git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git未安装。请先安装Git：${NC}"
    echo "   Windows: https://git-scm.com/download/win"
    echo "   macOS:   brew install git"
    echo "   Linux:   sudo apt install git"
    exit 1
fi

echo -e "${GREEN}✅ Git已安装${NC}"

# 检查Git配置
if [[ -z $(git config --global user.name) ]] || [[ -z $(git config --global user.email) ]]; then
    echo -e "${YELLOW}⚠️  Git用户信息未配置${NC}"
    read -p "请输入你的姓名: " user_name
    read -p "请输入你的邮箱: " user_email
    
    git config --global user.name "$user_name"
    git config --global user.email "$user_email"
    echo -e "${GREEN}✅ Git用户信息已配置${NC}"
fi

# 获取GitHub用户名和仓库名
echo ""
echo -e "${BLUE}📝 GitHub仓库信息${NC}"
read -p "请输入你的GitHub用户名: " github_username
read -p "请输入仓库名 (默认: vocabulary-lookup-extension): " repo_name
repo_name=${repo_name:-vocabulary-lookup-extension}

# 确认信息
echo ""
echo -e "${YELLOW}📋 确认信息：${NC}"
echo "   GitHub用户名: $github_username"
echo "   仓库名: $repo_name"
echo "   仓库URL: https://github.com/$github_username/$repo_name"
echo ""
read -p "信息是否正确？(y/n): " confirm

if [[ $confirm != "y" && $confirm != "Y" ]]; then
    echo -e "${RED}❌ 操作已取消${NC}"
    exit 1
fi

# 检查是否已经是Git仓库
if [ -d ".git" ]; then
    echo -e "${YELLOW}⚠️  检测到现有Git仓库，将重新初始化${NC}"
    read -p "是否继续？(y/n): " continue_confirm
    if [[ $continue_confirm != "y" && $continue_confirm != "Y" ]]; then
        echo -e "${RED}❌ 操作已取消${NC}"
        exit 1
    fi
    rm -rf .git
fi

# 步骤1: 初始化Git仓库
echo ""
echo -e "${BLUE}🔧 步骤1: 初始化Git仓库${NC}"
git init
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Git仓库初始化成功${NC}"
else
    echo -e "${RED}❌ Git仓库初始化失败${NC}"
    exit 1
fi

# 步骤2: 添加文件
echo ""
echo -e "${BLUE}📁 步骤2: 添加项目文件${NC}"
git add .
echo -e "${GREEN}✅ 文件添加成功${NC}"

# 显示将要提交的文件
echo ""
echo -e "${YELLOW}📄 将要提交的文件：${NC}"
git status --short

# 步骤3: 创建提交
echo ""
echo -e "${BLUE}💾 步骤3: 创建提交${NC}"
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
    echo -e "${GREEN}✅ 提交创建成功${NC}"
else
    echo -e "${RED}❌ 提交创建失败${NC}"
    exit 1
fi

# 步骤4: 添加远程仓库
echo ""
echo -e "${BLUE}🔗 步骤4: 连接GitHub仓库${NC}"
remote_url="https://github.com/$github_username/$repo_name.git"
git remote add origin "$remote_url"
echo -e "${GREEN}✅ 远程仓库已添加: $remote_url${NC}"

# 步骤5: 设置主分支
echo ""
echo -e "${BLUE}🌿 步骤5: 设置主分支${NC}"
git branch -M main
echo -e "${GREEN}✅ 主分支设置为 main${NC}"

# 步骤6: 推送到GitHub
echo ""
echo -e "${BLUE}🚀 步骤6: 推送到GitHub${NC}"
echo -e "${YELLOW}⚠️  这一步需要你的GitHub认证${NC}"
echo "   如果要求密码，请使用Personal Access Token"
echo "   Token生成：GitHub Settings → Developer settings → Personal access tokens"
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 恭喜！项目已成功上传到GitHub！${NC}"
    echo ""
    echo -e "${BLUE}📋 重要链接：${NC}"
    echo "   🏠 仓库主页: https://github.com/$github_username/$repo_name"
    echo "   📥 Clone链接: $remote_url"
    echo "   🐛 Issues: https://github.com/$github_username/$repo_name/issues"
    echo "   📦 Releases: https://github.com/$github_username/$repo_name/releases"
    echo ""
    echo -e "${YELLOW}🔧 下一步建议：${NC}"
    echo "   1. 访问仓库页面确认文件已上传"
    echo "   2. 在Settings中添加Topics标签"
    echo "   3. 创建第一个Release版本"
    echo "   4. 更新README中的用户名链接"
    echo ""
    echo -e "${GREEN}🎯 项目发布完成！${NC}"
else
    echo ""
    echo -e "${RED}❌ 推送失败${NC}"
    echo -e "${YELLOW}💡 可能的解决方案：${NC}"
    echo "   1. 确认GitHub仓库已创建"
    echo "   2. 检查用户名和仓库名是否正确"
    echo "   3. 确认已有仓库访问权限"
    echo "   4. 使用Personal Access Token而不是密码"
    echo "   5. 检查网络连接"
    echo ""
    echo "📖 详细帮助请查看 GITHUB_SETUP.md"
fi