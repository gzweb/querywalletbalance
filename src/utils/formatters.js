import BigNumber from 'bignumber.js'

/**
 * 格式化数字，保留指定小数位
 * @param {number|string} value - 要格式化的值
 * @param {number} decimals - 保留的小数位数
 * @returns {string} 格式化后的字符串
 */
export const formatNumber = (value, decimals = 4) => {
  const num = new BigNumber(value || 0)
  if (num.isZero()) return '0'

  // 如果是整数，直接返回
  if (num.isInteger()) return num.toString()

  // 如果小于1，使用科学计数法显示
  if (num.lt(1)) {
    return num.toPrecision(decimals)
  }

  return num.toFixed(decimals).replace(/\.?0+$/, '')
}

/**
 * 格式化USD价值
 * @param {number|string} value - USD价值
 * @returns {string} 格式化后的USD字符串
 */
export const formatUSD = (value) => {
  const num = new BigNumber(value || 0)
  if (num.lt(0.01) && !num.isZero()) {
    return `< $0.01`
  }
  return `$${formatNumber(num, 2)}`
}

/**
 * 格式化代币数量
 * @param {number|string} balance - 代币数量（已经是格式化后的小数值）
 * @param {number} decimals - 小数位数
 * @returns {string} 格式化后的代币数量
 */
export const formatTokenBalance = (balance, decimals = 4) => {
  // OKX API返回的balance已经是小数值，直接格式化为指定小数位
  console.log('格式化代币余额:', balance, '小数位:', decimals)
  const num = new BigNumber(balance || 0)
  const result = formatNumber(num, decimals)
  console.log('格式化结果:', result)
  return result
}

/**
 * 格式化地址显示
 * @param {string} address - 钱包地址
 * @returns {string} 格式化后的地址
 */
export const formatAddress = (address) => {
  if (!address) return ''
  if (address.length <= 10) return address
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

/**
 * 按价值排序代币
 * @param {Array} tokens - 代币数组
 * @returns {Array} 排序后的代币数组
 */
export const sortTokensByValue = (tokens) => {
  return tokens.sort((a, b) => {
    const valueA = parseFloat(a.usdValue) || 0
    const valueB = parseFloat(b.usdValue) || 0
    return valueB - valueA
  })
}