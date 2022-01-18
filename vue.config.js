//代理路径
const proxy = require('./build/proxy.js').proxyObj;
const TerserPlugin = require('terser-webpack-plugin')
//打包分析工具
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const IS_PROD = process.env.NODE_ENV === 'production'
module.exports = {
    publicPath: './',
    productionSourceMap: false,
    configureWebpack(config) {

        if (IS_PROD) {
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
        }
        /**
         * element-plus 报错处理
         */
        config.module.rules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: "javascript/auto"
        })
        return require('./build/aliasNames')
    },
    chainWebpack(config) {

        if (IS_PROD) {
            //如果是生产环境

            // config.optimization.minimizer([new TerserPlugin({
            //     terserOptions: {
            //         mangle: true, // 混淆，默认也是开的，mangle也是可以配置很多选项的，具体看后面的链接
            //         compress: {
            //             drop_console: true,//传true就是干掉所有的console.*这些函数的调用.
            //             drop_debugger: true, //干掉那些debugger;
            //             pure_funcs: ['console.log'] // 如果你要干掉特定的函数比如console.info ，又想删掉后保留其参数中的副作用，那用pure_funcs来处理
            //         }
            //     }
            // })])

            //打包分析
            config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
                {
                    analyzerMode: 'static',
                },
            ])
        }

    },
    devServer: {
        host: '0.0.0.0',
        port: 9000, // 端口号
        https: false, // https:{type:Boolean}
        open: true, //配置自动启动浏览器
        hotOnly: true, // 热更新
        overlay: {
            warnings: false,
            errors: false,
        },
        proxy: proxy
    },
}