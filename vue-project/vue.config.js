const { defineConfig } = require('@vue/cli-service')
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath:"/app/",
  outputDir: path.resolve(__dirname, '../client'),
})
