import * as path from "path"
import webpack from "webpack"
import { CleanWebpackPlugin } from "clean-webpack-plugin"
import HtmlWebpackPlugin from "html-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"

import { envConfig } from "./env.local"
import "./update-plugin-json"

import {
  appName, isProduction, Paths,
} from "./constants"

import { resolve, rules } from "./common-loaders"

const definePluginOption = Object.entries(envConfig).reduce((prev, [key, val]) => {
  prev[`process.env.${key}`] = JSON.stringify(val)
  return prev
}, {})

const config: webpack.Configuration = {
  mode: isProduction ? "production" : "development",
  devtool: isProduction ? false : "inline-cheap-module-source-map",
  // 使输出更精简
  stats: "errors-warnings",
  entry: {
    // HtmlWebpackPlugin.Options.chunks 需要跟着entry一起改动, 指出该HtmlWebpackPlugin需要的chunks.
    index: ["react-hot-loader/patch", Paths.resolve("src/pages/Index/index.tsx")],
  },
  output: {
    // 许多插件依赖 publicPath, 且如果为空("" 或 undefined), webpack 会将该参数默认值设置为 "auto" (尤其丧心病狂地, 它竟然不是 "auto/"), 导致一系列的 bug
    // 单纯我碰上的就有 webpack-pwa-manifest, workbox-webpack-plugin 这两个插件因此存在 bug
    // 所以 publicPath 参数一定要设置
    // 别用 ".", 例如像 workbox-webpack-plugin, 路径拼接时不是使用的 path.join, 而是 arr.join(""), 丧心病狂... 导致会出现形如 .manifest/xxx 这样的路径
    // 所以不管什么路径, 都记得在结尾添加 "/"
    // 开发环境用 "./" 貌似会出错, 导致 index.html 都打不开, 估计又是路径拼接的问题(估计没使用 path.join, 而是用的其他的方法), 所以开发环境要使用 "/"
    publicPath: isProduction ? "./" : "/",
    path: Paths.Dist,
    filename: "static/scripts/[name].[hash:5].js",
  },
  resolve,
  module: {
    rules,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(Paths.Public, "template.html"),
      filename: `index.html`,
      title: appName,
      inject: "body",
      chunks: ["index"],
    }),
    new webpack.WatchIgnorePlugin([
      /\.d\.ts$/,
    ]),
    new webpack.ProgressPlugin({
      modules: true,
    }),
    isProduction && new CleanWebpackPlugin({
      verbose: true,
      // dry: true,
      // cleanOnceBeforeBuildPatterns: [
      //   "*.html",
      //   "static/scripts/*.js", "static/styles/*.css",
      // ],
    }),
    isProduction && new MiniCssExtractPlugin({
      filename: "static/styles/[name].[hash:5].css",
    }),
    new webpack.DefinePlugin(definePluginOption),
  ].filter(Boolean),
}

export default config