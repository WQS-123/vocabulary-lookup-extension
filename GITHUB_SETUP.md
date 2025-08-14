# 📤 GitHub发布指南

完整的步骤指导，帮你把项目上传到GitHub。

## 🎯 准备工作

### 步骤 1：确认项目已准备就绪

确保你的项目文件夹包含以下文件：
```
vocabulary-lookup-extension/
├── README.md              ✅ 项目说明
├── LICENSE                ✅ MIT许可证
├── .gitignore            ✅ 忽略文件配置
├── manifest.json          ✅ 扩展配置
├── background.js          ✅ 核心功能
├── test.html             ✅ 测试页面
├── icons/                ✅ 扩展图标
└── docs/                 ✅ 文档文件夹
```

### 步骤 2：安装 Git（如果还没有）

**Windows:**
- 下载并安装 [Git for Windows](https://git-scm.com/download/win)

**macOS:**
```bash
# 使用 Homebrew
brew install git

# 或使用官方安装包
# 下载：https://git-scm.com/download/mac
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install git
```

## 🚀 GitHub发布步骤

### 步骤 1：创建GitHub仓库

1. **登录GitHub** - 访问 [github.com](https://github.com)
2. **创建新仓库**：
   - 点击右上角的 "+" → "New repository"
   - **Repository name**: `vocabulary-lookup-extension`
   - **Description**: `A smart Chrome extension for vocabulary lookup with popup windows`
   - **Visibility**: Public（推荐）或 Private
   - **不要勾选** "Add a README file"（我们已经有了）
   - **不要勾选** "Add .gitignore"（我们已经有了）
   - **License**: None（我们已经有LICENSE文件）
   - 点击 "Create repository"

### 步骤 2：初始化本地Git仓库

在项目文件夹中打开终端/命令提示符：

**Windows (在项目文件夹中):**
```bash
# 右键点击文件夹 → "Git Bash Here" 或 "在终端中打开"
```

**macOS/Linux:**
```bash
cd /path/to/vocabulary-lookup-extension
```

然后运行：
```bash
# 初始化Git仓库
git init

# 添加所有文件
git add .

# 查看将要提交的文件
git status

# 创建第一个提交
git commit -m "Initial commit: Smart vocabulary lookup extension with popup windows"
```

### 步骤 3：连接到GitHub仓库

```bash
# 添加远程仓库（替换成你的GitHub用户名）
git remote add origin https://github.com/你的用户名/vocabulary-lookup-extension.git

# 设置主分支名称
git branch -M main

# 推送到GitHub
git push -u origin main
```

### 步骤 4：验证上传成功

1. 刷新你的GitHub仓库页面
2. 确认所有文件都已上传
3. README.md应该自动显示在仓库首页

## 🔧 Git配置（首次使用）

如果这是你第一次使用Git，需要设置用户信息：

```bash
# 设置用户名
git config --global user.name "你的名字"

# 设置邮箱（使用GitHub账号邮箱）
git config --global user.email "your-email@example.com"

# 验证配置
git config --list
```

## 📝 更新项目的步骤

以后修改项目后，使用以下命令更新GitHub：

```bash
# 添加修改的文件
git add .

# 或添加特定文件
git add manifest.json background.js

# 提交更改
git commit -m "描述你的更改"

# 推送到GitHub
git push
```

## 🎨 优化GitHub仓库

### 添加标签和主题

1. **在仓库首页点击设置齿轮图标**
2. **添加Topics标签**：
   - `chrome-extension`
   - `vocabulary`
   - `dictionary`
   - `popup`
   - `javascript`
   - `manifest-v3`
   - `education`

### 创建Release版本

1. **在仓库页面点击 "Releases"**
2. **点击 "Create a new release"**
3. **标签版本**: `v1.0.0`
4. **Release title**: `v1.0.0 - Smart Popup Vocabulary Lookup`
5. **描述发布内容**：
   ```markdown
   ## 🎉 首个发布版本
   
   ### ✨ 主要功能
   - 智能弹窗显示词汇定义
   - 右侧定位，不遮挡内容
   - 一键右键查询
   - 完整Vocabulary.com体验
   
   ### 📦 安装方法
   1. 下载ZIP文件
   2. 解压到本地
   3. 在Chrome中加载扩展
   4. 开始使用！
   ```
6. **点击 "Publish release"**

## 🔗 有用的GitHub链接

创建完成后，记住这些重要链接：

- **仓库主页**: `https://github.com/你的用户名/vocabulary-lookup-extension`
- **Issues页面**: `https://github.com/你的用户名/vocabulary-lookup-extension/issues`
- **Releases页面**: `https://github.com/你的用户名/vocabulary-lookup-extension/releases`
- **Clone URL**: `https://github.com/你的用户名/vocabulary-lookup-extension.git`

## 🎯 下一步

1. **更新README中的链接** - 将 `yourusername` 替换为你的GitHub用户名
2. **推广项目** - 分享给朋友，发布到社交媒体
3. **收集反馈** - 鼓励用户提交Issues和建议
4. **持续更新** - 添加新功能，修复bug

## 🚨 常见问题

### 认证问题
如果推送时要求密码，可能需要：
1. 使用 Personal Access Token 而不是密码
2. 在GitHub设置中生成 Token
3. 使用 Token 作为密码

### 文件太大
如果某些文件被拒绝：
1. 检查 .gitignore 是否正确配置
2. 移除不必要的大文件
3. 使用 `git rm --cached filename` 移除已跟踪的文件

### 同步问题
如果本地和远程不同步：
```bash
git pull origin main
git push origin main
```

## 🎉 恭喜！

你的项目现在已经在GitHub上了！🚀

记得定期更新代码，回应用户反馈，让你的扩展越来越好！