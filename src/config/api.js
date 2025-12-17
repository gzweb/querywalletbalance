/**
 * OKX API 配置
 * 请在 OKX 官网申请 API Key: https://www.okx.com/account/my-api
 */

// OKX API 配置
export const OKX_CONFIG = {
  // API 基础信息
  BASE_URL: 'https://web3.okx.com', // v6 API基础URL

  // 🔑 OKX API 信息 (已配置)
  API_KEY: 'b6cfa5e0-7fc9-4cf5-8860-ddb0131eceba',
  API_SECRET: '9120E4677A7B93C854833487854665D9',
  PASSPHRASE: '0E28F54f09d93EF89F8f91#',

  // 项目ID (v6 API需要，必须从OKX开发者门户获取)
  // 在 https://web3.okx.com 创建项目后获取
  PROJECT_ID: process.env.VUE_APP_OKX_PROJECT_ID || '86a7ca67157faf60a68eaca7d979f58f',

  // API 版本和超时设置
  API_VERSION: 'v6', // 更新到最新版本
  TIMEOUT: 10000, // 10秒超时

  // 其他配置
  RETRY_TIMES: 3, // 重试次数
  RETRY_DELAY: 1000, // 重试延迟(ms)
}

// 环境变量配置说明
export const ENV_VARS_INFO = `
环境变量配置 (可选，更安全):
在项目根目录创建 .env 文件:

VUE_APP_OKX_API_KEY=your_api_key_here
VUE_APP_OKX_API_SECRET=your_api_secret_here
VUE_APP_OKX_PASSPHRASE=your_passphrase_here

或在 .env.local 文件中配置(不会提交到git)
`

// API 权限说明
export const PERMISSIONS_INFO = `
OKX API 权限设置:
1. 登录 OKX 官网
2. 进入 API 管理页面
3. 创建新的 API Key
4. 设置以下权限:
   - 读取: ✓ 开启
   - 交易: 根据需要开启
   - 提现: 根据需要开启

5. IP 白名单: 设置您的服务器IP或留空允许所有IP
6. Passphrase: 设置并记住您的密码
`

export default OKX_CONFIG