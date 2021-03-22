// const CompressionWebpackPlugin = require('compression-webpack-plugin') // 开启gzip压缩
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // 可视化分析包大小
const TerserPlugin = require('terser-webpack-plugin')
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// 生成gzip文件规则配置
// const compress = new CompressionWebpackPlugin({
//   filename: info => {
//     return `${info.path}.gz${info.query}`
//   },
//   algorithm: 'gzip',
//   threshold: 10240,
//   test: new RegExp('\\.(' + ['js'].join('|') + ')$'),
//   minRatio: 0.8,
//   deleteOriginalAssets: false
// })

module.exports = {
  publicPath: './',
  productionSourceMap: false,
  lintOnSave: 'warning', // 是否在开发环境下每次保存代码时都启用 eslint验证。

  devServer: {
    host: '0.0.0.0',
    port: 8085,
    proxy: {
      '/athena': {
        target: 'http://x.wego168.com/',
        changeOrigin: true,
        pathRewrite: {
          '/athena': 'athena'
        }
      },
      '/hyzs': {
        target: 'http://x.wego168.com/',
        // target: 'http://192.168.1.16:8080/',
        changeOrigin: true,
        pathRewrite: {
          '/hyzs': 'hyzs'
        }
      },
      '/wghjy': {
        target: 'http://x.wego168.com/',
        changeOrigin: true,
        pathRewrite: {
          '/wghjy': 'wghjy'
        }
      },
      '/lbxyh': {
        target: 'http://x.wego168.com/',
        changeOrigin: true,
        pathRewrite: {
          '/lbxyh': 'lbxyh'
        }
      },
      '/accelerator_test': {
        target: 'http://abs.wego168.com/',
        pathRewrite: {
          '/accelerator_test': 'accelerator_test'
        }
      }
    }
  },

  css: {
    // 将组件内的css提取到一个单独文件（只在生产环境使用，因为会和热重载冲突）
    extract: process.env.NODE_ENV === 'production' ? true : false,
    loaderOptions: {
      sass: {
        data: `@import "@/theme/element.scss";`
      }
    }
  },

  configureWebpack: config => {
    // config.plugins.push(new BundleAnalyzerPlugin()), // 可视化分析包大小

    // config.plugins.push(compress) 启用gizp压缩文件
    // if (process.env.NODE_ENV === 'production') {
    //   // 正式环境去除console
    //   config.plugins.push(
    //     new TerserPlugin({
    //       terserOptions: {
    //         compress: {
    //           drop_console: true
    //         }
    //       }
    //     })
    //   )
    // }

    config.optimization = {
      minimizer: [
        // 多进程多实例并行压缩
        new TerserPlugin({
          parallel: 4
        })
      ]
    }
    // config.module = {
    //   rules: [
    //     {
    //       test: /\.js$/,
    //       use: ['thread-loader'] // 多进程多实例构建，资源并行解析
    //     }
    //   ]
    // }
  },

  chainWebpack: config => {
    config.entry('index').add('babel-polyfill')
    // 开启外部扩展，防止将某些 import的包(package)打包到 bundle 中
    config.externals({
      UE: 'UE'
    })
    // config.optimization.minimize(true);
    // config.optimization.splitChunks({
    //   chunks: 'all'
    // });
    // 修复HMR热更新; 启用时符号链接(symlink)的资源将解析为其真实路径，而不是其符号链接(symlink)的位置
    config.resolve.symlinks(true)
    // 配置别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('apiSchool', resolve('src/modules/school/api')) //社群2.0后要删除
      .set('jsSchool', resolve('src/modules/school/js'))
      .set('commonSchool', resolve('src/modules/school/components/common'))
  }
}
