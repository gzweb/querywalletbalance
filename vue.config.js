module.exports = {
  publicPath: './',
  devServer: {
    port: 8081,
    open: true
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': require('path').resolve(__dirname, 'src')
      }
    }
  }
}