import webpack from "webpack"
import webpackMerge from "webpack-merge"
import { Configuration } from "webpack-dev-server"

import { Paths } from "./constants"
import webpackConfig from "./webpack.config"

const config: Configuration = webpackMerge(webpackConfig, {
  devServer: {
    contentBase: Paths.Dist,
    // https: true,
    // useLocalIp: false,
    host: "localhost",
    port: 8080,
    hot: true,
  },
})

export default config
