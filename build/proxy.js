/**
 * 根据url 生成对应代理地址
 * 转发地址为配置信息 VUE_APP_URL_** ==> **
 */
const baseUrlKeys = Object.keys(process.env);
let baseUrls = baseUrlKeys.filter(v => v.includes('VUE_APP_URL'));
let proxyObj = {}
baseUrls.forEach(v => {
    //生成代理
    let proxyTba = '/' + v.split('_').pop().toLowerCase()
    proxyObj[proxyTba] = {
        target: process.env[v], //配置动态代理
        changeOrigin: true,
        secure: false,
    }
    proxyObj[proxyTba].pathRewrite = {
        ['^' + proxyTba]: ""
    }
})

module.exports = {
    proxyObj: proxyObj
}