#!/bin/bash

echo "🚀 BalanceWeb 快速部署脚本"
echo "=============================="

# 检查是否已构建
if [ ! -d "dist" ]; then
    echo "❌ 错误: dist目录不存在，请先运行 npm run build"
    exit 1
fi

echo "✅ 构建文件检查通过"

# 检查文件大小
DIST_SIZE=$(du -sh dist | cut -f1)
echo "📦 构建文件大小: $DIST_SIZE"

echo ""
echo "🌐 部署选项:"
echo "1. Netlify (推荐) - 访问 https://netlify.com 并拖拽 dist/ 文件夹"
echo "2. Vercel - 访问 https://vercel.com 并拖拽 dist/ 文件夹"
echo "3. 其他平台 - 上传 dist/ 文件夹中的所有文件"
echo ""

# 如果有zip命令，创建压缩包
if command -v zip &> /dev/null; then
    echo "📦 创建部署压缩包..."
    cd dist
    zip -r ../balanceweb-deploy.zip .
    cd ..
    echo "✅ 压缩包已创建: balanceweb-deploy.zip"
    echo "   可以直接上传此压缩包到托管平台"
fi

echo ""
echo "🎉 准备部署！"
echo "   1. 选择一个托管平台"
echo "   2. 上传 dist/ 目录中的文件"
echo "   3. 或者上传 balanceweb-deploy.zip"
echo "   4. 获取部署URL并分享！"
echo ""

echo "📖 详细部署指南: 查看 DEPLOYMENT.md"