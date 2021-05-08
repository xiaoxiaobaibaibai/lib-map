const path = require('path');
const config = require('./package.json');
const projectName = config.name;

function resolve(dir) {
  return path.resolve(__dirname,dir)
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/gwstatic/static/company_web/company_lib/' : '',
  runtimeCompiler: true,
  configureWebpack: {

  },
  devServer: {
    port: 8080,
    overlay: {
      warnings: false,
      errors: false
    },
    proxy: {
      "api/baidu/get/address": {
        changeOrigin: true,
        target: 'https://api.map.baidu.com/geocoding/v3/'
      }
    }
  },
  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ]
}
