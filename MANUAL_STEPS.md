# 📝 手动上传步骤（最可靠方法）

如果脚本有问题，你可以手动执行这些命令：

## 🎯 第一步：在GitHub创建仓库

1. 访问 https://github.com
2. 点击 "+" → "New repository"
3. 仓库名：`vocabulary-lookup-extension`
4. 描述：`A smart Chrome extension for vocabulary lookup`
5. 选择 Public
6. **不要勾选** README, .gitignore, License
7. 点击 "Create repository"

## 🚀 第二步：运行命令

在项目文件夹中逐个执行：

```bash
# 1. 删除可能存在的git文件夹
rm -rf .git

# 2. 初始化git仓库
git init

# 3. 添加所有文件
git add .

# 4. 创建提交
git commit -m "Initial commit: Vocabulary lookup extension with smart popup windows"

# 5. 添加远程仓库 (替换YOUR_USERNAME为你的GitHub用户名)
git remote add origin https://github.com/YOUR_USERNAME/vocabulary-lookup-extension.git

# 6. 设置主分支
git branch -M main

# 7. 推送到GitHub
git push -u origin main
```

## 📋 重要提示

- 将 `YOUR_USERNAME` 替换为你的实际GitHub用户名
- 如果要求密码，使用Personal Access Token而不是GitHub密码
- Personal Access Token获取：GitHub → Settings → Developer settings → Personal access tokens

## 🎉 完成后

访问：`https://github.com/YOUR_USERNAME/vocabulary-lookup-extension`

看到项目文件说明上传成功！