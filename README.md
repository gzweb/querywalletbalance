# BalanceWeb - 多地址余额查询工具

基于 Vue.js 和 OKX Web3 SDK v6 构建的多地址钱包余额查询工具，界面设计参考 DeBank。

## 功能特性

- ✅ **多地址查询**: 支持同时查询多个钱包地址的余额
- ✅ **实时数据**: 使用 OKX API 获取最新的余额信息
- ✅ **美观界面**: 参考 DeBank 的现代化设计风格
- ✅ **总余额概览**: 显示所有地址的总价值汇总
- ✅ **按链分组显示**: 余额按不同区块链（Ethereum、BSC、Polygon等）分组展示
- ✅ **链统计概览**: 显示每个链的总价值、代币数量、地址数量
- ✅ **详细代币信息**: 展示每个代币的余额和美元价值
- ✅ **响应式设计**: 支持桌面端和移动端访问
- ✅ **顺序处理**: 逐个查询地址，间隔1秒避免API限制

## 支持的区块链

- Ethereum (ETH)
- Binance Smart Chain (BSC)
- Polygon (MATIC)
- Arbitrum
- 以及其他 OKX 支持的区块链

## 技术栈

- **前端框架**: Vue.js 2.x
- **UI 组件库**: Element UI
- **HTTP 客户端**: Axios
- **Web3 SDK**: OKX Web3 SDK
- **数字处理**: BigNumber.js
- **构建工具**: Vue CLI

## 项目结构

```
balanceweb/
├── public/
│   └── index.html          # HTML 模板
├── src/
│   ├── api/
│   │   └── okx.js         # OKX Web3 SDK 接口
│   ├── assets/
│   │   └── css/
│   │       └── global.css # 全局样式
│   ├── components/        # 组件目录
│   ├── router/
│   │   └── index.js       # 路由配置
│   ├── utils/
│   │   └── formatters.js  # 工具函数
│   ├── views/
│   │   └── BalanceChecker.vue # 主页面组件
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── package.json           # 项目配置
└── vue.config.js          # Vue CLI 配置
```

## 安装和运行

### 1. 配置 OKX API (重要)

**第一步: 获取 OKX API 密钥**

1. 访问 [OKX API 管理页面](https://www.okx.com/account/my-api)
2. 登录您的 OKX 账户
3. 创建新的 API Key
4. 设置权限：
   - 读取权限: ✓ 开启
   - 交易权限: 根据需要开启
   - 提现权限: 根据需要开启
5. 设置 Passphrase（密码）
6. 配置 IP 白名单（建议设置您的服务器IP）

**第二步: 配置环境变量**

复制 `env-example.txt` 的内容，创建 `.env` 或 `.env.local` 文件：

```bash
cp env-example.txt .env.local
```

然后编辑文件，填入您的实际 API 信息：

```env
VUE_APP_OKX_API_KEY=your_actual_api_key
VUE_APP_OKX_API_SECRET=your_actual_secret
VUE_APP_OKX_PASSPHRASE=your_actual_passphrase
```

### 2. 安装依赖

```bash
cd public/web3/balanceweb
npm install
```

### 3. 开发模式运行

```bash
npm run serve
```

访问 `http://localhost:8081` 查看应用

### 4. 构建生产版本

```bash
npm run build
```

构建完成后，`dist/` 目录包含所有部署所需的文件。

### 5. 部署到第三方平台

详细的部署指南请查看 [`DEPLOYMENT.md`](DEPLOYMENT.md)

**快速部署选项**:

- **Netlify**: 拖拽 `dist/` 文件夹即可
- **Vercel**: 导入项目自动构建
- **GitHub Pages**: 使用 `gh-pages` 包部署
- **Firebase**: 使用 Firebase CLI 部署

## 🚀 部署状态

✅ **构建成功**: `npm run build` 已测试通过
✅ **静态文件**: `dist/` 目录已生成
✅ **第三方托管**: 支持 Netlify、Vercel、GitHub Pages 等
✅ **CDN优化**: 自动压缩和优化资源

## 使用说明

1. **输入地址**: 在文本框中输入钱包地址，每行一个地址
2. **查询余额**: 点击"查询余额"按钮开始查询
3. **查看结果**:
   - 总余额概览：显示总价值、地址数量、代币种类
   - 详细余额：每个地址的代币详情，按价值排序

## API 接口说明

### OKX Web3 SDK v6 接口

项目使用最新的 OKX Web3 SDK v6 的 Wallet API 来查询地址余额：

- **getAddressBalance(address)**: 查询单个地址的余额
- **getMultipleAddressBalances(addresses)**: 批量查询多个地址余额
- **getAddressTokenBalances(address, chains)**: 获取地址在指定链上的代币余额

```javascript
import { getAddressBalance, getMultipleAddressBalances } from '@/api/okx'

// 查询单个地址
const balance = await getAddressBalance('0x1234567890abcdef...')

// 批量查询多个地址
const results = await getMultipleAddressBalances(['0x1234...', '0xabcd...'])
```

**API Endpoint**: `POST /api/v6/dex/balance/token-balances-by-address`

### 格式化工具

```javascript
import { formatUSD, formatTokenBalance, formatAddress } from '@/utils/formatters'

// 格式化 USD 价值
formatUSD(123.456) // "$123.46"

// 格式化代币余额
formatTokenBalance('1000000000000000000', 18) // "1.000000"

// 格式化地址显示
formatAddress('0x1234567890abcdef1234567890abcdef12345678') // "0x1234...5678"
```

## API 说明

### 当前实现状态

**✅ OKX Web3 SDK v6 已完全配置并可用**

项目已配置最新的 OKX Web3 SDK v6，使用真实的 Wallet API 查询任意钱包地址在多条区块链上的余额。

**🎯 查询功能**

- ✅ **任意地址查询**: 通过OKX Web3 SDK查询任意钱包地址的余额
- ✅ **多链支持**: 支持13条主流EVM链 (Ethereum、Optimism、BSC、Polygon、zkSync、Arbitrum、Polygon zkEVM、Base、Linea、Mantle、Blast、Scroll、Avalanche)
- ✅ **多代币支持**: 显示地址在各链上的所有代币余额
- ✅ **美元估值**: 自动获取并显示代币美元价值
- ✅ **批量查询**: 支持同时查询多个地址
- ✅ **实时数据**: 获取最新的链上余额数据

**📝 使用说明**

1. 输入钱包地址（每行一个，支持ETH、BSC、Polygon等链地址）
2. 点击"查询余额"按钮
3. **查询过程**：
   - 系统逐个查询每个地址（间隔1秒）
   - 显示实时进度：第 X/Y 个地址
   - 每个地址查询完成后立即显示结果
4. **查看结果**：
   - 每个地址显示为一行，包含总余额和代币数量
   - 点击地址行可展开/收起详情
   - 查看该地址在各链上的具体代币余额（小数点后4位）

**🌐 支持的区块链**

**13条主流EVM链：**
- ✅ Ethereum (ETH) - 链ID: 1
- ✅ Optimism (OP) - 链ID: 10
- ✅ BSC (BNB) - 链ID: 56
- ✅ Polygon (MATIC) - 链ID: 137
- ✅ zkSync Era - 链ID: 324
- ✅ Arbitrum One - 链ID: 42161
- ✅ Polygon zkEVM - 链ID: 1101
- ✅ Base - 链ID: 8453
- ✅ Linea - 链ID: 59144
- ✅ Mantle - 链ID: 5000
- ✅ Blast - 链ID: 81457
- ✅ Scroll - 链ID: 534352
- ✅ Avalanche (AVAX) - 链ID: 43114

**界面特性：**
- 📱 响应式地址行布局
- 🔽 点击展开查看各链代币详情
- 💰 余额显示小数点后4位
- 📊 实时总价值和代币数量统计

**⚠️ 重要说明**

- **查询范围**: 可以查询任意公开地址的余额
- **API权限**: 需要有效的OKX API Key（读取权限）
- **数据来源**: 通过OKX Web3 SDK从区块链获取，数据实时准确
- **网络依赖**: 需要网络连接访问OKX API服务

### API 权限要求

确保您的OKX API Key已开启以下权限：
- ✅ 读取权限 (必需)
- 💡 交易权限 (可选)
- 💡 提现权限 (可选)

## 注意事项

1. **API 限制**: 各区块链浏览器 API 都有速率限制，请合理控制查询频率
2. **API Key**: 需要为每个使用的区块链浏览器申请 API Key
3. **数据准确性**: 余额数据可能有短暂延迟
4. **地址格式**: 确保输入正确的钱包地址格式
5. **网络连接**: 需要稳定的网络连接才能获取数据
6. **隐私安全**: 不要将 API 密钥提交到版本控制系统

## 自定义配置

### 修改支持的区块链

在 `src/api/okx.js` 中的 `getSupportedChains` 函数中添加新的区块链支持。

### 自定义样式

全局样式文件位于 `src/assets/css/global.css`，可以在这里自定义应用的样式。

### API 配置

在 `src/api/okx.js` 中可以配置 API 基础 URL 和其他参数。

## 浏览器兼容性

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。