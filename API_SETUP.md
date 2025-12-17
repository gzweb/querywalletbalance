# OKX Web3 SDK v6 配置状态

## ✅ SDK v6 已完全配置

您的OKX Web3 SDK v6信息已经正确配置在 `src/config/api.js` 中：

```javascript
API_KEY: 'b6cfa5e0-7fc9-4cf5-8860-ddb0131eceba',
API_SECRET: '9120E4677A7B93C854833487854665D9',
PASSPHRASE: '0E28F54f09d93EF89F8f91#',
PROJECT_ID: 'your_project_id_here', // ⚠️ 需要从OKX开发者门户获取
API_VERSION: 'v6', // 已更新到最新版本
BASE_URL: 'https://web3.okx.com', // v6 API域名
```

## 🚨 重要：配置PROJECT_ID

**v6 API必需**: 您需要从 [OKX Web3 开发者门户](https://web3.okx.com/) 获取PROJECT_ID：

1. 登录OKX账户
2. 创建新项目 (Create Project)
3. 复制生成的Project ID
4. 在 `src/config/api.js` 中设置 `PROJECT_ID` 字段

## 🧪 测试API连接

1. **启动应用**：
   ```bash
   cd /Users/D/htdocs/chain/public/web3/balanceweb
   npm run serve
   ```

2. **测试连接**：
   - 打开浏览器访问应用
   - 点击"测试API连接"按钮
   - 如果成功，会显示"OKX Web3 SDK 连接成功！"

3. **查询余额**：
   - 输入钱包地址（如：0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045）
   - 点击"查询余额"
   - 查看该地址在8条主流EVM链上的真实余额

## 📋 v6版本特性

- **改进的路由算法**: 使用有向无环图(DAG)进行更智能的订单路由
- **更好的性能**: 优化的API响应速度
- **增强的安全性**: 更严格的身份验证机制
- **扩展性**: 支持更多区块链网络

**重要**: v5版本将在未来几个月内被弃用，建议尽快升级到v6。

## 📋 API 权限要求

确保您的OKX API Key已开启以下权限：
- ✅ **读取权限** (必需) - 查询账户余额
- 💡 **交易权限** (可选) - 执行交易操作
- 💡 **提现权限** (可选) - 提现操作

## 📋 API 权限说明

### 必需权限
- **读取权限**: 用于查询账户余额和交易记录

### 可选权限
- **交易权限**: 如果需要执行交易操作
- **提现权限**: 如果需要提现操作

## 🔒 安全建议

1. **不要分享 API 密钥**: 任何人都能用您的 API Key 访问您的账户
2. **设置 IP 白名单**: 限制只有特定 IP 能使用 API
3. **使用强密码**: Passphrase 至少 8 位，包含字母和数字
4. **定期更换**: 建议定期更换 API Key
5. **版本控制**: 不要将 `.env.local` 文件提交到 Git

## 🐛 常见问题

### Q: 配置了 API Key 但还是显示模拟数据？
A: 检查 `.env.local` 文件是否在项目根目录，变量名是否正确，重启开发服务器。

### Q: API 请求失败？
A: 检查网络连接、API Key 是否正确、IP 白名单设置。

### Q: 如何集成其他区块链 API？
A: 查看 `src/api/okx.js` 文件，参考现有的函数结构添加新的 API 调用。

## 🔗 相关链接

- [OKX API 文档](https://www.okx.com/docs-v5/en/)
- [OKX API 管理](https://www.okx.com/account/my-api)
- [Etherscan API](https://etherscan.io/apis)
- [BSCScan API](https://bscscan.com/apis)