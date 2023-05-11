const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true, 
  devServer: {
    // proxy: 'http://127.0.0.1:8080',
    proxy: 'https://127.0.0.1:8083',
    https: true
  },
})
