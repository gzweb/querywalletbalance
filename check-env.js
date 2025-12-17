// 检查运行环境
console.log('=== BalanceWeb 环境检查 ===')

// 检查Node版本
console.log('Node版本:', process.version)

// 检查当前目录
console.log('当前目录:', process.cwd())

// 检查关键文件是否存在
const fs = require('fs')

const checkFile = (filePath) => {
  try {
    fs.accessSync(filePath, fs.constants.F_OK)
    console.log('✅', filePath, '存在')
  } catch (err) {
    console.log('❌', filePath, '不存在')
  }
}

console.log('\n=== 检查关键文件 ===')
checkFile('package.json')
checkFile('src/main.js')
checkFile('src/App.vue')
checkFile('src/views/BalanceChecker.vue')
checkFile('src/config/api.js')
checkFile('src/api/okx.js')

// 检查package.json内容
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  console.log('\n=== package.json 检查 ===')
  console.log('项目名称:', packageJson.name)
  console.log('版本:', packageJson.version)
  console.log('依赖数量:', Object.keys(packageJson.dependencies || {}).length)
  console.log('开发依赖数量:', Object.keys(packageJson.devDependencies || {}).length)
} catch (error) {
  console.log('❌ package.json 读取失败:', error.message)
}

// 检查API配置
try {
  const apiConfig = require('./src/config/api.js')
  console.log('\n=== API配置检查 ===')
  console.log('BASE_URL:', apiConfig.OKX_CONFIG.BASE_URL)
  console.log('API_VERSION:', apiConfig.OKX_CONFIG.API_VERSION)
  console.log('API_KEY已配置:', !!apiConfig.OKX_CONFIG.API_KEY)
  console.log('PROJECT_ID已配置:', !!apiConfig.OKX_CONFIG.PROJECT_ID)
} catch (error) {
  console.log('❌ API配置检查失败:', error.message)
}

console.log('\n=== 环境检查完成 ===')