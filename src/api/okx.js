import axios from 'axios'
import CryptoJS from 'crypto-js'
import { OKX_CONFIG } from '@/config/api'

// 创建axios实例
const apiClient = axios.create({
  baseURL: OKX_CONFIG.BASE_URL,
  timeout: OKX_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'OK-ACCESS-KEY': OKX_CONFIG.API_KEY,
    'OK-ACCESS-PASSPHRASE': OKX_CONFIG.PASSPHRASE
  }
})

/**
 * 生成 OKX API 签名
 * @param {string} method - HTTP 方法
 * @param {string} requestPath - 请求路径
 * @param {string} body - 请求体
 * @param {string} timestamp - 时间戳
 * @returns {string} HMAC SHA256 签名
 */
const generateSignature = (method, requestPath, body = '', timestamp) => {
  // OKX API v6 签名格式：timestamp + method + requestPath + body
  // 注意：时间戳格式需要匹配API要求
  const message = timestamp + method + requestPath + body
  console.log('签名消息:', message)

  const signature = CryptoJS.HmacSHA256(message, OKX_CONFIG.API_SECRET)
  const base64Signature = CryptoJS.enc.Base64.stringify(signature)

  console.log('生成的签名:', base64Signature.substring(0, 30) + '...')
  return base64Signature
}

// 请求拦截器 - 添加认证信息
apiClient.interceptors.request.use(
  config => {
    if (OKX_CONFIG.API_KEY && OKX_CONFIG.API_SECRET) {
      // OKX API时间戳格式：ISO 8601
      const timestamp = new Date().toISOString()
      const method = config.method.toUpperCase()
      const requestPath = config.url.replace(OKX_CONFIG.BASE_URL, '')
      const body = config.data ? JSON.stringify(config.data) : ''

      const signature = generateSignature(method, requestPath, body, timestamp)

      config.headers['OK-ACCESS-SIGN'] = signature
      config.headers['OK-ACCESS-TIMESTAMP'] = timestamp
      config.headers['OK-ACCESS-KEY'] = OKX_CONFIG.API_KEY
      config.headers['OK-ACCESS-PASSPHRASE'] = OKX_CONFIG.PASSPHRASE

      // v6 API可能需要PROJECT_ID
      if (OKX_CONFIG.PROJECT_ID) {
        config.headers['OK-ACCESS-PROJECT'] = OKX_CONFIG.PROJECT_ID
      }

      console.log('API请求详情:', {
        method,
        url: config.url,
        requestPath,
        timestamp,
        signature: signature.substring(0, 20) + '...', // 只显示前20个字符
        body
      })
    } else {
      console.warn('OKX API Key 未配置，使用公开接口（可能受限）')
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理响应
apiClient.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

/**
 * 查询账户余额 (需要API Key认证)
 * 注意: OKX API 目前主要用于交易账户余额查询
 * 对于钱包地址余额，建议使用区块链浏览器API或第三方服务
 * @param {string} address - 钱包地址 (如果有API权限)
 * @returns {Promise} 返回余额数据
 */
/**
 * 使用OKX Wallet API v6查询地址的代币余额
 * @param {string} address - 要查询的钱包地址
 * @param {string} chains - 要查询的链ID，多个用逗号分隔，默认为"1,56,137,42161"(ETH,BSC,Polygon,Arbitrum)
 * @returns {Promise} 返回地址在指定链上的代币余额
 */
export const getAddressTokenBalances = async (address, chains = '1,10,56,42161,324,1101,8453,59144,5000,81457,534352,43114,137') => {
  try {
    if (!OKX_CONFIG.API_KEY) {
      throw new Error('需要配置 OKX API Key 才能查询地址余额')
    }

    console.log(`调用OKX Wallet API v6查询地址余额: ${address}, 链: ${chains}`)

    // 准备请求参数 - v6 API使用POST请求和不同的参数结构
    const chainArray = chains.split(',').map(chainId => ({
      chainIndex: chainId.trim(),
      tokenContractAddress: "" // 查询原生代币
    }))

    const requestData = {
      address: address,
      tokenContractAddresses: chainArray,
      excludeRiskToken: "0" // 过滤风险代币
    }

    // 使用OKX Wallet API v6查询地址代币余额
    const response = await apiClient.post(`/api/${OKX_CONFIG.API_VERSION}/dex/balance/token-balances-by-address`, requestData)

    if (response.code !== '0') {
      throw new Error(`OKX Wallet API v6错误: ${response.msg || response.code}`)
    }

    console.log('OKX Wallet API v6响应成功:', response)
    // API返回的数据结构: { data: [{ tokenAssets: [...] }] }
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0].tokenAssets || []
    }
    return []
  } catch (error) {
    console.error('获取地址余额失败:', error)
    throw error
  }
}

export const getAccountBalance = async () => {
  try {
    if (!OKX_CONFIG.API_KEY) {
      throw new Error('需要配置 OKX API Key 才能查询账户余额')
    }

    console.log('调用OKX API查询账户余额...')
    const response = await apiClient.get(`/api/${OKX_CONFIG.API_VERSION}/account/balance`)

    if (response.code !== '0') {
      throw new Error(`OKX API错误: ${response.msg || response.code}`)
    }

    console.log('OKX API响应成功:', response)
    return response.data || []
  } catch (error) {
    console.error('获取账户余额失败:', error)
    throw error
  }
}

/**
 * 查询代币信息 (公开接口)
 * @param {string} chainId - 链ID，可选
 * @returns {Promise} 返回代币信息
 */
export const getTokenInfo = async (chainId = '') => {
  try {
    const params = chainId ? { chainId } : {}
    const response = await apiClient.get(`/api/${OKX_CONFIG.API_VERSION}/public/instruments`, {
      params: {
        instType: 'SPOT',
        ...params
      }
    })
    return response
  } catch (error) {
    console.error('获取代币信息失败:', error)
    throw error
  }
}

/**
 * 查询地址余额 - 使用OKX Web3 SDK/Wallet API
 * 通过OKX的Wallet API查询任意地址的代币余额
 * @param {string} address - 要查询的钱包地址
 * @returns {Promise} 返回地址的代币余额数据
 */
export const getAddressBalance = async (address) => {
  try {
    console.log('开始查询地址余额:', address)

    // 使用OKX Wallet API查询地址的所有代币余额
    const addressBalances = await getAddressTokenBalances(address)
    console.log('成功获取地址余额:', addressBalances)

    // 转换OKX API响应格式为应用期望的格式
    return formatOkxWalletBalanceToAddressBalance(addressBalances, address)
  } catch (error) {
    console.error('获取地址余额失败:', error)
    throw error
  }
}

/**
 * 批量查询多个地址余额
 * @param {Array} addresses - 地址数组
 * @param {string} chainId - 链ID
 * @returns {Promise} 返回所有地址的余额数据
 */
export const getMultipleAddressBalances = async (addresses, chainId = '') => {
  try {
    const promises = addresses.map(address =>
      getAddressBalance(address, chainId).catch(error => ({
        address,
        error: error.message,
        balance: []
      }))
    )

    const results = await Promise.allSettled(promises)

    return results.map((result, index) => ({
      address: addresses[index],
      success: result.status === 'fulfilled',
      data: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason.message : null
    }))
  } catch (error) {
    console.error('批量查询余额失败:', error)
    throw error
  }
}

/**
 * 获取支持的链列表
 * @returns {Promise} 返回支持的链信息
 */
export const getSupportedChains = async () => {
  try {
    const response = await apiClient.get('/api/v5/wallet/chains')
    return response
  } catch (error) {
    console.error('获取支持链失败:', error)
    // 返回默认的常用链
    return {
      chains: [
        { id: '1', name: 'Ethereum', symbol: 'ETH' },
        { id: '56', name: 'BSC', symbol: 'BNB' },
        { id: '137', name: 'Polygon', symbol: 'MATIC' },
        { id: '42161', name: 'Arbitrum', symbol: 'ETH' }
      ]
    }
  }
}

/**
 * 格式化余额数据
 * @param {Object} balanceData - 原始余额数据
 * @returns {Object} 格式化后的余额数据
 */
export const formatBalanceData = (balanceData) => {
  if (!balanceData || !balanceData.balance) {
    return {
      totalValue: 0,
      tokens: [],
      tokensByChain: {}
    }
  }

  const tokens = balanceData.balance.map(token => ({
    symbol: token.symbol || token.contractAddress,
    name: token.name || token.symbol,
    balance: parseFloat(token.balance || 0),
    usdValue: parseFloat(token.usdValue || 0),
    contractAddress: token.contractAddress,
    decimals: token.decimals || 18,
    chainId: token.chainId || '1',
    chainName: token.chainName || 'Ethereum'
  }))

  const totalValue = tokens.reduce((sum, token) => sum + token.usdValue, 0)

  // 按链分组
  const tokensByChain = tokens.reduce((acc, token) => {
    const chainId = token.chainId
    if (!acc[chainId]) {
      acc[chainId] = {
        chainId,
        chainName: token.chainName,
        tokens: [],
        totalValue: 0
      }
    }
    acc[chainId].tokens.push(token)
    acc[chainId].totalValue += token.usdValue
    return acc
  }, {})

  return {
    totalValue,
    tokens,
    tokensByChain
  }
}

/**
 * 将OKX Wallet API余额响应转换为地址余额格式
 * @param {Array} okxWalletBalances - OKX Wallet API返回的余额数据
 * @param {string} address - 查询的地址
 * @returns {Object} 转换后的余额数据
 */
const formatOkxWalletBalanceToAddressBalance = (okxWalletBalances, address) => {
  console.log('转换OKX Wallet余额数据:', okxWalletBalances)
  console.log('地址:', address)

  const tokens = []

  // OKX Wallet API返回的数据结构处理
  if (Array.isArray(okxWalletBalances)) {
    okxWalletBalances.forEach(tokenData => {
      // 只显示有余额的代币
      if (parseFloat(tokenData.balance) > 0) {
        const token = {
          symbol: tokenData.symbol || 'UNKNOWN',
          name: tokenData.symbol || 'Unknown Token',
          balance: tokenData.balance || '0',
          usdValue: parseFloat(tokenData.tokenPrice || 0) * parseFloat(tokenData.balance || 0),
          contractAddress: tokenData.tokenContractAddress || '',
          decimals: 18, // 默认18位小数，实际应该根据代币查询
          chainId: tokenData.chainIndex || '1',
          chainName: getChainNameByIndex(tokenData.chainIndex),
          rawBalance: tokenData.rawBalance || '0',
          tokenPrice: parseFloat(tokenData.tokenPrice || 0),
          tokenType: tokenData.tokenType || '1',
          isRiskToken: tokenData.isRiskToken || false
        }
        console.log('处理代币:', token.symbol, '余额:', token.balance, '价格:', token.tokenPrice, 'USD价值:', token.usdValue)
        tokens.push(token)
      }
    })
  }

  // 如果没有余额数据，返回空数组
  return {
    address,
    balance: tokens
  }
}

/**
 * 根据链索引获取链名称
 * @param {string} chainIndex - 链索引
 * @returns {string} 链名称
 */
const getChainNameByIndex = (chainIndex) => {
  const chainMap = {
    '1': 'Ethereum',
    '10': 'Optimism',
    '56': 'BSC',
    '137': 'Polygon',
    '324': 'ZKSync Era',
    '42161': 'Arbitrum One',
    '1101': 'Polygon zkEVM',
    '8453': 'Base',
    '59144': 'Linea',
    '5000': 'Mantle',
    '81457': 'Blast',
    '534352': 'Scroll',
    '43114': 'Avalanche',
    '250': 'Fantom',
    '128': 'HECO'
  }
  return chainMap[chainIndex] || `Chain ${chainIndex}`
}


export default {
  getAccountBalance,
  getTokenInfo,
  getAddressBalance,
  getMultipleAddressBalances,
  getSupportedChains,
  formatBalanceData,
  getAddressTokenBalances
}