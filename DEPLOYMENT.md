# BalanceWeb 部署指南

本项目可以轻松部署到各种第三方托管平台。以下是详细的部署步骤。

## 🚀 构建项目

首先，构建生产版本的应用：

```bash
# 安装依赖
npm install

# 构建生产版本
npm run build
```

构建完成后，会在 `dist/` 目录生成静态文件。

## 🌐 推荐部署平台

### 1. Netlify (推荐)

**优点**: 免费、快速、支持自定义域名、自动HTTPS

**部署步骤**:

1. **注册账号**: https://netlify.com
2. **连接Git仓库**:
   - 上传 `dist/` 文件夹到Netlify
   - 或连接GitHub/GitLab仓库

3. **配置构建命令** (如果使用仓库):
   ```
   Build command: npm run build
   Publish directory: dist
   ```

4. **部署完成**: 获得自动生成的URL

### 2. Vercel

**优点**: 快速部署、全球CDN、支持自定义域名

**部署步骤**:

1. **注册账号**: https://vercel.com
2. **连接仓库**:
   - 导入GitHub仓库
   - 或拖拽 `dist/` 文件夹

3. **自动检测**: Vercel会自动识别Vue.js项目
4. **部署完成**: 获得 `.vercel.app` 域名

### 3. GitHub Pages

**优点**: 免费、使用GitHub仓库

**部署步骤**:

1. **安装gh-pages包**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **修改package.json**:
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```

3. **修改vue.config.js**:
   ```javascript
   module.exports = {
     publicPath: process.env.NODE_ENV === 'production'
       ? '/your-repo-name/'
       : '/'
   }
   ```

4. **部署**:
   ```bash
   npm run build
   npm run deploy
   ```

5. **在GitHub设置Pages**: Settings → Pages → Source → gh-pages

### 4. Firebase Hosting

**优点**: Google服务、快速、可靠

**部署步骤**:

1. **安装Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **登录Firebase**:
   ```bash
   firebase login
   ```

3. **初始化项目**:
   ```bash
   firebase init hosting
   ```

4. **选择dist目录**作为public目录

5. **部署**:
   ```bash
   firebase deploy
   ```

### 5. AWS S3 + CloudFront

**优点**: 企业级、全球CDN、可扩展

**部署步骤**:

1. **创建S3存储桶**
2. **启用静态网站托管**
3. **上传dist/文件**
4. **配置CloudFront分发**
5. **设置自定义域名 (可选)**

## ⚙️ 环境变量配置

如果需要配置环境变量：

### Netlify
- 在Netlify控制台设置环境变量
- 变量名: `VUE_APP_*`

### Vercel
- 在Vercel控制台设置环境变量
- 或在项目根目录创建 `.vercel.env`

### 其他平台
参考各平台的文档设置环境变量。

## 🔧 自定义域名

所有平台都支持自定义域名：

1. **购买域名**
2. **在平台控制台添加域名**
3. **配置DNS解析**
4. **启用HTTPS** (通常自动)

## 📊 性能优化

部署前可以进行以下优化：

1. **代码分割**:
   ```javascript
   // vue.config.js
   module.exports = {
     configureWebpack: {
       optimization: {
         splitChunks: {
           chunks: 'all'
         }
       }
     }
   }
   ```

2. **压缩资源**:
   ```javascript
   // vue.config.js
   module.exports = {
     productionSourceMap: false,
     configureWebpack: {
       optimization: {
         minimize: true
       }
     }
   }
   ```

## 🔍 故障排除

### 构建失败
```bash
# 检查Node.js版本
node --version

# 清理缓存
npm run lint
rm -rf node_modules package-lock.json
npm install
```

### 部署后白屏
- 检查 `vue.config.js` 中的 `publicPath` 配置
- 确保所有资源路径正确
- 检查浏览器控制台错误

### API调用失败
- 检查环境变量是否正确设置
- 确认CORS配置
- 检查API密钥权限

## 📞 支持

如果部署遇到问题，可以：

1. 查看平台官方文档
2. 检查Vue CLI文档: https://cli.vuejs.org/
3. 提交GitHub Issue

## 🎉 部署成功！

部署完成后，你将获得一个可访问的URL，可以分享给其他人使用BalanceWeb应用！