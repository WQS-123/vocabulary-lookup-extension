@echo off
REM 🚀 Vocabulary Lookup Extension - 自动上传到GitHub脚本 (Windows版本)
REM 使用方法：双击运行或在命令行中执行 auto-upload.bat

echo 🎯 Vocabulary Lookup Extension - GitHub自动上传脚本
echo ==================================================
echo.

REM 检查是否安装了git
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Git未安装。请先安装Git：
    echo    下载地址: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo ✅ Git已安装
echo.

REM 检查Git配置
for /f "tokens=*" %%i in ('git config --global user.name 2^>nul') do set git_name=%%i
for /f "tokens=*" %%i in ('git config --global user.email 2^>nul') do set git_email=%%i

if "%git_name%"=="" (
    echo ⚠️  Git用户信息未配置
    set /p user_name="请输入你的姓名: "
    set /p user_email="请输入你的邮箱: "
    
    git config --global user.name "%user_name%"
    git config --global user.email "%user_email%"
    echo ✅ Git用户信息已配置
    echo.
)

REM 获取GitHub用户名和仓库名
echo 📝 GitHub仓库信息
set /p github_username="请输入你的GitHub用户名: "
set /p repo_name="请输入仓库名 (默认: vocabulary-lookup-extension): "
if "%repo_name%"=="" set repo_name=vocabulary-lookup-extension

echo.
echo 📋 确认信息：
echo    GitHub用户名: %github_username%
echo    仓库名: %repo_name%
echo    仓库URL: https://github.com/%github_username%/%repo_name%
echo.
set /p confirm="信息是否正确？(y/n): "

if /i not "%confirm%"=="y" (
    echo ❌ 操作已取消
    pause
    exit /b 1
)

REM 检查是否已经是Git仓库
if exist ".git" (
    echo ⚠️  检测到现有Git仓库，将重新初始化
    set /p continue_confirm="是否继续？(y/n): "
    if /i not "!continue_confirm!"=="y" (
        echo ❌ 操作已取消
        pause
        exit /b 1
    )
    rmdir /s /q .git
)

echo.
echo 🔧 步骤1: 初始化Git仓库
git init
if %errorlevel% neq 0 (
    echo ❌ Git仓库初始化失败
    pause
    exit /b 1
)
echo ✅ Git仓库初始化成功

echo.
echo 📁 步骤2: 添加项目文件
git add .
echo ✅ 文件添加成功

echo.
echo 📄 将要提交的文件：
git status --short

echo.
echo 💾 步骤3: 创建提交
git commit -m "Initial commit: Smart vocabulary lookup extension with popup windows" -m "✨ Features:" -m "- Smart popup window positioned on the right side" -m "- Intelligent positioning to avoid going off-screen" -m "- One-click vocabulary lookup via right-click menu" -m "- Full Vocabulary.com experience in popup" -m "- Non-intrusive design for seamless reading" -m "" -m "🛠️ Technical:" -m "- Chrome Manifest V3 extension" -m "- Service worker background script" -m "- Smart window positioning API" -m "- Minimal permissions: contextMenus, tabs, windows"

if %errorlevel% neq 0 (
    echo ❌ 提交创建失败
    pause
    exit /b 1
)
echo ✅ 提交创建成功

echo.
echo 🔗 步骤4: 连接GitHub仓库
set remote_url=https://github.com/%github_username%/%repo_name%.git
git remote add origin "%remote_url%"
echo ✅ 远程仓库已添加: %remote_url%

echo.
echo 🌿 步骤5: 设置主分支
git branch -M main
echo ✅ 主分支设置为 main

echo.
echo 🚀 步骤6: 推送到GitHub
echo ⚠️  这一步需要你的GitHub认证
echo    如果要求密码，请使用Personal Access Token
echo    Token生成：GitHub Settings → Developer settings → Personal access tokens
echo.

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo 🎉 恭喜！项目已成功上传到GitHub！
    echo.
    echo 📋 重要链接：
    echo    🏠 仓库主页: https://github.com/%github_username%/%repo_name%
    echo    📥 Clone链接: %remote_url%
    echo    🐛 Issues: https://github.com/%github_username%/%repo_name%/issues
    echo    📦 Releases: https://github.com/%github_username%/%repo_name%/releases
    echo.
    echo 🔧 下一步建议：
    echo    1. 访问仓库页面确认文件已上传
    echo    2. 在Settings中添加Topics标签
    echo    3. 创建第一个Release版本
    echo    4. 更新README中的用户名链接
    echo.
    echo 🎯 项目发布完成！
) else (
    echo.
    echo ❌ 推送失败
    echo 💡 可能的解决方案：
    echo    1. 确认GitHub仓库已创建
    echo    2. 检查用户名和仓库名是否正确
    echo    3. 确认已有仓库访问权限
    echo    4. 使用Personal Access Token而不是密码
    echo    5. 检查网络连接
    echo.
    echo 📖 详细帮助请查看 GITHUB_SETUP.md
)

echo.
pause