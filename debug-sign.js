// 调试OKX API签名生成
const CryptoJS = require('crypto-js')

const API_SECRET = '9120E4677A7B93C854833487854665D9'
const API_KEY = 'b6cfa5e0-7fc9-4cf5-8860-ddb0131eceba'
const PASSPHRASE = '0E28F54f09d93EF89F8f91#'
const PROJECT_ID = '86a7ca67157faf60a68eaca7d979f58f'

// 测试数据
const testData = {
  address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  tokenContractAddresses: [
    {
      chainIndex: "1",
      tokenContractAddress: ""
    }
  ],
  excludeRiskToken: "0"
}

function generateSignature(method, requestPath, body = '', timestamp) {
  const message = timestamp + method + requestPath + body
  console.log('签名消息:', message)

  const signature = CryptoJS.HmacSHA256(message, API_SECRET)
  const base64Signature = CryptoJS.enc.Base64.stringify(signature)

  console.log('生成的签名:', base64Signature)
  return base64Signature
}

// 测试签名生成
const timestamp = new Date().toISOString()
const method = 'POST'
const requestPath = '/api/v6/dex/balance/token-balances-by-address'
const body = JSON.stringify(testData)

console.log('=== OKX API v6 签名调试 ===')
console.log('时间戳:', timestamp)
console.log('方法:', method)
console.log('路径:', requestPath)
console.log('请求体:', body)

const signature = generateSignature(method, requestPath, body, timestamp)

console.log('\n=== 调试信息 ===')
console.log('API_KEY:', API_KEY)
console.log('PASSPHRASE:', PASSPHRASE)
console.log('PROJECT_ID:', PROJECT_ID)
console.log('签名长度:', signature.length)

console.log('\n=== curl 测试命令 ===')
console.log(`curl --location --request POST 'https://web3.okx.com/api/v6/dex/balance/token-balances-by-address' \\
--header 'Content-Type: application/json' \\
--header 'OK-ACCESS-PROJECT: ${PROJECT_ID}' \\
--header 'OK-ACCESS-KEY: ${API_KEY}' \\
--header 'OK-ACCESS-SIGN: ${signature}' \\
--header 'OK-ACCESS-TIMESTAMP: ${timestamp}' \\
--header 'OK-ACCESS-PASSPHRASE: ${PASSPHRASE}' \\
--data-raw '${JSON.stringify(testData)}'`
)