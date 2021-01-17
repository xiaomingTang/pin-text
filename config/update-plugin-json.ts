import { Json } from "tang-base-node-utils"
import chalk from "chalk"

import {
  isProduction, Paths,
} from "./constants"

const pluginJson = new Json(Paths.resolve("public/plugin.json"))
const pluginConfig = pluginJson.readSync()

if (isProduction) {
  pluginConfig.development.main = pluginConfig.main
} else {
  pluginConfig.development.main = "http://localhost:8080/index.html"
}

pluginJson.writeSync(pluginConfig, 2)

console.log(chalk.green(`plugin.json 已更新为 ${isProduction ? "production" : "development"} 模式`))
