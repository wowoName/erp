/**
 * 定义文件路径别名
 */
const path = require('path')
const resolve = (dir) => {
  return path.join(__dirname, '..\\' + dir)
}
module.exports = {
  resolve: {
    alias: {
      '@': resolve('src'),
      '@api': resolve('src/api'),
      '@temp': resolve('src/components'),
      '@charts': resolve('src/plugins/charts'),
    }
  }
}
