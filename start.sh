#!/bin/bash

echo "BalanceWeb - 多地址余额查询工具"
echo "=================================="

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "错误: Node.js 未安装，请先安装 Node.js"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "错误: npm 未安装，请先安装 npm"
    exit 1
fi

echo "正在安装依赖..."
npm install

if [ $? -eq 0 ]; then
    echo "依赖安装成功！"
    echo ""
    echo "启动开发服务器..."
    npm run serve
else
    echo "依赖安装失败，请检查网络连接"
    exit 1
fi