#!/bin/bash

echo "🚀 BalanceWeb 发布到GitHub脚本"
echo "================================="

# 检查git是否可用
if ! command -v git &> /dev/null; then
    echo "❌ 错误: git 未安装"
    exit 1
fi

# 初始化git仓库
echo "📝 初始化git仓库..."
git init

# 配置用户信息（请根据实际情况修改）
echo "👤 配置用户信息..."
git config user.name "gzweb"
git config user.email "gzweb@example.com"

# 添加远程仓库
echo "🔗 添加远程仓库..."
git remote add origin git@github.com:gzweb/querywalletbalance.git

# 添加文件到暂存区
echo "📦 添加文件到暂存区..."
git add .

# 提交代码
echo "💾 提交代码..."
git commit -m "Initial commit: BalanceWeb - 多地址余额查询工具

✨ 功能特性:
- 🔍 多地址查询: 支持同时查询多个钱包地址的余额
- 🌐 多链支持: 支持Ethereum、BSC、Polygon、Arbitrum等13条主流链
- 📊 实时数据: 通过OKX Web3 SDK获取区块链实时数据
- 🎨 优雅界面: 参考DeBank设计，支持展开查看详情
- ⚡ 性能优化: 逐个查询地址，间隔1秒避免API限制
- 📱 响应式设计: 支持桌面端和移动端

🛠️ 技术栈:
- Vue.js 2.x + Element UI
- OKX Web3 SDK v6
- Axios + BigNumber.js
- 支持第三方托管平台部署

📦 部署就绪:
- 构建脚本: npm run build
- 部署指南: 查看DEPLOYMENT.md
- 支持Netlify、Vercel等平台"

# 推送代码
echo "⬆️ 推送代码到GitHub..."
git push -u origin master

echo ""
echo "🎉 代码发布成功!"
echo "📋 GitHub仓库: https://github.com/gzweb/querywalletbalance"
echo ""
echo "📖 下一步:"
echo "1. 在GitHub上确认代码已推送"
echo "2. 添加README.md和项目描述"
echo "3. 配置GitHub Pages (可选)"
echo "4. 设置Actions进行自动部署 (可选)"