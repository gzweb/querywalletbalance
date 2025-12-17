<template>
  <div class="balance-checker">
    <!-- 地址输入区域 -->
    <div class="address-input-section">
      <div class="container">
        <h2>查询地址余额</h2>
        <p class="description">输入钱包地址，OKX Web3 SDK将查询该地址在多条链上的余额</p>

        <!-- API 配置提示 -->
        <div class="api-notice">
          <el-alert
            title="OKX Web3 SDK 已配置"
            description="已配置OKX API密钥，将通过OKX Web3 SDK查询任意地址的真实余额数据"
            type="success"
            :closable="false"
            show-icon>
            <template slot="description">
              <div>
                <p>✅ OKX Web3 SDK: 已配置并可以使用</p>
                <p>🔄 查询类型: 多链地址余额查询</p>
                <p>🌐 支持链: Ethereum、BSC、Polygon、Arbitrum、Optimism、Avalanche、Fantom、Base (8条主流EVM链)</p>
                <p>📊 数据来源: 直接从区块链获取的实时数据</p>
                <p>⚠️ 注意: 需要配置PROJECT_ID才能正常使用</p>
              </div>
            </template>
          </el-alert>
        </div>

        <div class="input-group">
          <textarea
            v-model="addressInput"
            placeholder="输入钱包地址，每行一个地址&#10;支持：ETH、BSC、Polygon、Arbitrum等链&#10;例如：&#10;0x1234567890abcdef...&#10;0xabcdef1234567890..."
            class="address-textarea"
            :rows="6"
          ></textarea>

          <div class="actions">
            <el-button
              type="primary"
              :loading="loading"
              @click="checkBalances"
              :disabled="!hasValidAddresses"
            >
              <i class="el-icon-search"></i>
              查询余额
            </el-button>

            <el-button
              type="info"
              @click="testApiConnection"
              :loading="testingApi"
            >
              <i class="el-icon-connection"></i>
              测试API连接
            </el-button>

            <el-button @click="clearAll">
              <i class="el-icon-delete"></i>
              清空
            </el-button>
          </div>
        </div>

        <!-- 地址预览 -->
        <div v-if="parsedAddresses.length > 0" class="address-preview">
          <h3>已输入 {{ parsedAddresses.length }} 个地址：</h3>
          <div class="address-tags">
            <el-tag
              v-for="(address, index) in parsedAddresses"
              :key="index"
              size="small"
              closable
              @close="removeAddress(index)"
            >
              {{ formatAddress(address) }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- 结果显示区域 -->
    <div v-if="results.length > 0" class="results-section">
      <div class="container">
        <!-- 总余额概览 -->
        <div class="total-overview">
          <h2>总余额概览</h2>
          <div class="overview-cards">
            <div class="overview-card">
              <div class="card-title">总价值</div>
              <div class="card-value">{{ formatUSD(totalValue) }}</div>
            </div>
            <div class="overview-card">
              <div class="card-title">地址数量</div>
              <div class="card-value">{{ results.length }}</div>
            </div>
            <div class="overview-card">
              <div class="card-title">代币种类</div>
              <div class="card-value">{{ uniqueTokensCount }}</div>
            </div>
            <div class="overview-card">
              <div class="card-title">活跃链数</div>
              <div class="card-value">{{ activeChainsCount }}</div>
            </div>
          </div>
        </div>

        <!-- 详细结果 -->
        <div class="detailed-results">
          <h2>地址余额详情</h2>

          <div v-for="(result, index) in results" :key="index" class="address-result">
            <div class="address-row" @click="toggleAddressExpansion(index)">
              <div class="address-info">
                <i class="el-icon-wallet"></i>
                <span class="address-text">{{ formatAddress(result.address) }}</span>
              </div>
              <div class="address-summary">
                <span class="total-balance">{{ formatUSD(result.totalValue) }}</span>
                <span class="token-count">{{ result.tokenCount || 0 }} 代币</span>
                <i :class="isExpanded(index) ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="expand-icon"></i>
              </div>
            </div>

            <!-- 展开的详细内容 -->
            <div v-show="isExpanded(index)" class="address-details">
                <div v-if="result.success && result.tokensByChain" class="chains-list">
                  <div
                    v-for="(chainData, chainId) in result.tokensByChain"
                    :key="chainId"
                    class="chain-section"
                    v-show="chainData.tokens && chainData.tokens.length > 0"
                  >
                    <div class="chain-header">
                      <h4>
                        <i :class="getChainIcon(chainId)"></i>
                        {{ chainData.chainName }}
                        <span class="chain-id">({{ chainId }})</span>
                      </h4>
                      <div class="chain-value">{{ formatUSD(chainData.totalValue) }}</div>
                    </div>

                    <div class="chain-tokens">
                      <div
                        v-for="token in sortTokensByValue(chainData.tokens)"
                        :key="`${token.symbol}-${token.contractAddress}-${chainId}`"
                        class="token-item"
                      >
                        <div class="token-info">
                          <div class="token-symbol">{{ token.symbol }}</div>
                          <div class="token-name">{{ token.name }}</div>
                        </div>
                        <div class="token-balance">
                          <div class="balance-amount">{{ formatTokenBalance(token.balance, 4) }}</div>
                          <div class="balance-value">{{ formatUSD(token.usdValue) }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else-if="!result.success" class="error-message">
                  <i class="el-icon-warning"></i>
                  查询失败: {{ result.error }}
                </div>

                <div v-else class="no-tokens">
                  <i class="el-icon-info"></i>
                  该地址暂无代币余额
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <i class="el-icon-loading loading-icon"></i>
        <p>正在查询余额... {{ loadingStatus }}</p>
        <p class="loading-tip">每查询一个地址间隔1秒，避免API限制</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getAddressBalance, getAddressTokenBalances, formatBalanceData } from '@/api/okx'
import { formatUSD, formatAddress, formatTokenBalance, sortTokensByValue } from '@/utils/formatters'

export default {
  name: 'BalanceChecker',
  data() {
    return {
      addressInput: '',
      results: [],
      expandedStates: {}, // 存储展开状态
      loading: false,
      loadingProgress: 0,
      currentLoadingAddress: '',
      testingApi: false
    }
  },
  computed: {
    parsedAddresses() {
      return this.addressInput
        .split('\n')
        .map(addr => addr.trim())
        .filter(addr => addr.length > 0)
    },
    hasValidAddresses() {
      return this.parsedAddresses.length > 0
    },
    totalValue() {
      return this.results.reduce((total, result) => {
        return total + (result.totalValue || 0)
      }, 0)
    },
    uniqueTokensCount() {
      const tokenSet = new Set()
      this.results.forEach(result => {
        if (result.tokens) {
          result.tokens.forEach(token => {
            tokenSet.add(token.symbol)
          })
        }
      })
      return tokenSet.size
    },
    chainStats() {
      const chainMap = new Map()

      this.results.forEach(result => {
        if (result.tokensByChain) {
          Object.values(result.tokensByChain).forEach(chainData => {
            const chainId = chainData.chainId
            const chainName = chainData.chainName

            if (!chainMap.has(chainId)) {
              chainMap.set(chainId, {
                chainId,
                chainName,
                totalValue: 0,
                tokenCount: 0,
                addressCount: 0
              })
            }

            const chain = chainMap.get(chainId)
            chain.totalValue += chainData.totalValue
            chain.tokenCount += chainData.tokens.length
            chain.addressCount += 1
          })
        }
      })

      return Array.from(chainMap.values()).sort((a, b) => b.totalValue - a.totalValue)
    },
    activeChainsCount() {
      const chains = new Set()
      this.results.forEach(result => {
        if (result.tokensByChain) {
          Object.keys(result.tokensByChain).forEach(chainId => {
            if (result.tokensByChain[chainId].tokens && result.tokensByChain[chainId].tokens.length > 0) {
              chains.add(chainId)
            }
          })
        }
      })
      return chains.size
    },

    loadingStatus() {
      if (!this.currentLoadingAddress) return ''
      const currentIndex = this.results.length + 1
      // 使用当前查询的总地址数估算
      const estimatedTotal = Math.max(currentIndex, this.parsedAddresses.length)
      const shortAddress = this.currentLoadingAddress.length > 10
        ? `${this.currentLoadingAddress.substring(0, 6)}...${this.currentLoadingAddress.substring(this.currentLoadingAddress.length - 4)}`
        : this.currentLoadingAddress
      return `第 ${currentIndex}/${estimatedTotal} 个地址 (${shortAddress})`
    }
  },
  methods: {
    formatUSD,
    formatAddress,
    formatTokenBalance,
    sortTokensByValue,

    async checkBalances() {
      if (!this.hasValidAddresses) {
        this.$message.warning('请至少输入一个有效的钱包地址')
        return
      }

      this.loading = true
      this.loadingProgress = 0
      this.results = []

      // 设置最大超时时间（30秒），防止无限loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('查询超时，请稍后重试')), 30000)
      })

      try {
        const addresses = this.parsedAddresses

        // 创建主要的查询逻辑
        const queryPromise = this.performBatchQuery(addresses)

        // 使用Promise.race确保不会无限等待
        await Promise.race([queryPromise, timeoutPromise])

        this.$message.success(`查询完成，共处理 ${addresses.length} 个地址`)

      } catch (error) {
        console.error('查询余额失败:', error)
        this.$message.error('查询失败，请稍后重试')
      } finally {
        this.loading = false
        this.loadingProgress = 100 // 确保完成时显示100%
        this.currentLoadingAddress = ''
      }
    },

    async performBatchQuery(addresses) {
      const totalAddresses = addresses.length
      let processedCount = 0

      // 设置初始进度
      this.loadingProgress = 0

      // 逐个查询地址，每个地址间隔1秒
      for (let i = 0; i < addresses.length; i++) {
        const address = addresses[i]
        this.currentLoadingAddress = address

        try {
          const result = await getAddressBalance(address)

          if (result && result.balance) {
            const formattedData = formatBalanceData(result)
            const tokenCount = formattedData.tokens.length
            this.results.push({
              address: address,
              success: true,
              tokens: formattedData.tokens,
              tokensByChain: formattedData.tokensByChain,
              totalValue: formattedData.totalValue,
              tokenCount
            })
          } else {
            this.results.push({
              address: address,
              success: false,
              error: '无余额数据',
              tokens: [],
              tokensByChain: {},
              totalValue: 0,
              tokenCount: 0
            })
          }
        } catch (error) {
          console.error(`查询地址失败:`, error.message)
          this.results.push({
            address: address,
            success: false,
            error: error.message,
            tokens: [],
            tokensByChain: {},
            totalValue: 0,
            tokenCount: 0
          })
        }

        processedCount++
        // 更新进度
        const progress = Math.min(100, Math.max(0, Math.round((processedCount / totalAddresses) * 100)))
        this.loadingProgress = Number(progress)

        // 除了最后一个地址，都要等待1秒
        if (i < addresses.length - 1) {
          await this.sleep(1000)
        }
      }
    },

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },

    clearAll() {
      this.addressInput = ''
      this.results = []
    },

    removeAddress(index) {
      const addresses = this.parsedAddresses
      addresses.splice(index, 1)
      this.addressInput = addresses.join('\n')
    },

    getChainIcon(chainId) {
      const icons = {
        '1': 'el-icon-coin',      // Ethereum
        '56': 'el-icon-s-shop',   // BSC
        '137': 'el-icon-s-grid',  // Polygon
        '42161': 'el-icon-s-data', // Arbitrum
        '10': 'el-icon-s-platform', // Optimism
        '43114': 'el-icon-s-finance', // Avalanche
        '250': 'el-icon-s-custom', // Fantom
        '8453': 'el-icon-s-order' // Base
      }
      return icons[chainId] || 'el-icon-coin'
    },

    toggleAddressExpansion(index) {
      this.$set(this.expandedStates, index, !this.expandedStates[index])
    },

    isExpanded(index) {
      return this.expandedStates[index] || false
    },

    async testApiConnection() {
      this.testingApi = true
      try {
        // 使用一个已知的地址测试API连接（这里用一个测试地址）
        const testAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' // vitalik.eth
        await getAddressTokenBalances(testAddress, '1') // 只测试Ethereum链
        this.$message.success('OKX Web3 SDK 连接成功！可以查询地址余额')
      } catch (error) {
        console.error('API 测试失败:', error)
        this.$message.error(`API 连接失败: ${error.message}`)
      } finally {
        this.testingApi = false
      }
    }
  }
}
</script>

<style scoped>
.balance-checker {
  min-height: 100vh;
  padding-bottom: 50px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.address-input-section {
  padding: 40px 0;
  background: rgba(255, 255, 255, 0.05);
}

.address-input-section h2 {
  color: white;
  margin-bottom: 10px;
  font-size: 1.8rem;
}

.description {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 20px;
  font-size: 1rem;
}

.api-notice {
  margin-bottom: 30px;
}

.api-notice .el-alert {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  color: #666;
}

.api-notice .el-alert__title {
  color: #e6a23c;
  font-weight: bold;
}

.input-group {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.address-textarea {
  width: 100%;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  padding: 15px;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  transition: border-color 0.3s;
}

.address-textarea:focus {
  outline: none;
  border-color: #409eff;
}

.actions {
  margin-top: 20px;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.address-preview {
  margin-top: 30px;
}

.address-preview h3 {
  color: white;
  margin-bottom: 15px;
}

.address-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.results-section {
  padding: 40px 0;
}

.total-overview {
  margin-bottom: 40px;
}

.total-overview h2 {
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.overview-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.overview-card:hover {
  transform: translateY(-5px);
}

.card-title {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.card-value {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
}

.chain-overview {
  margin-top: 40px;
}

.chain-overview h2 {
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.chain-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.chain-stat-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.chain-stat-card:hover {
  transform: translateY(-5px);
}

.chain-name {
  font-size: 1.3rem;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 15px;
  text-align: center;
}

.chain-metrics {
  display: flex;
  justify-content: space-around;
  gap: 15px;
}

.metric {
  text-align: center;
  flex: 1;
}

.metric-value {
  display: block;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.metric-label {
  font-size: 0.85rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detailed-results h2 {
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.address-result {
  background: white;
  border-radius: 12px;
  margin-bottom: 15px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.address-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  cursor: pointer;
  transition: background-color 0.3s;
  border-bottom: 1px solid #f5f5f5;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.address-row:hover {
  background-color: #f8f9fa;
}

.address-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.address-info i {
  color: #409eff;
  font-size: 18px;
}

.address-text {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.address-summary {
  display: flex;
  align-items: center;
  gap: 20px;
}

.total-balance {
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
}

.token-count {
  color: #909399;
  font-size: 14px;
}

.expand-icon {
  color: #c0c4cc;
  font-size: 16px;
  transition: transform 0.3s;
}

.address-details {
  padding: 0;
  background-color: #fafafa;
}

.address-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.address-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.address-value {
  font-size: 1.3rem;
  font-weight: bold;
}

.chains-list {
  padding: 0;
}

.chain-section {
  margin-bottom: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
}

.chain-header {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e4e7ed;
}

.chain-header h4 {
  margin: 0;
  color: #303133;
  font-size: 1rem;
  font-weight: 600;
}

.chain-id {
  font-size: 0.8rem;
  color: #909399;
  font-weight: normal;
  margin-left: 5px;
}

.chain-value {
  font-weight: bold;
  color: #409eff;
}

.chain-tokens {
  background: white;
}

.chain-tokens .token-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f5f5f5;
  transition: background-color 0.3s;
}

.chain-tokens .token-item:hover {
  background-color: #f9f9f9;
}

.chain-tokens .token-item:last-child {
  border-bottom: none;
}

.token-info {
  flex: 1;
}

.token-symbol {
  font-weight: bold;
  font-size: 1.1rem;
  color: #333;
}

.token-name {
  color: #666;
  font-size: 0.9rem;
  margin-top: 2px;
}

.token-balance {
  text-align: right;
}

.balance-amount {
  font-weight: bold;
  font-size: 1.1rem;
  color: #333;
}

.balance-value {
  color: #666;
  font-size: 0.9rem;
  margin-top: 2px;
}

.error-message,
.no-tokens {
  padding: 40px 30px;
  text-align: center;
  color: #666;
}

.error-message {
  color: #f56c6c;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-content {
  background: white;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.loading-content p {
  margin-top: 20px;
  color: #666;
}

.loading-icon {
  color: #409eff;
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-tip {
  font-size: 14px !important;
  color: #909399 !important;
  margin-top: 10px !important;
}

@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }

  .overview-cards {
    grid-template-columns: 1fr;
  }

  .address-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .token-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .token-balance {
    text-align: left;
  }
}
</style>