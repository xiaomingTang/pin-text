import * as path from "path"

import plugin from "../public/plugin.json"

const appRoot = path.resolve(__dirname, "../")

export const Paths = {
  Root: appRoot,
  Public: path.resolve(appRoot, "public"),
  Dist: path.resolve(appRoot, "public/dist"),
  NodeModule: path.resolve(appRoot, "node_modules"),
  Src: path.resolve(appRoot, "src"),
  resolve: (...p: string[]) => path.resolve(appRoot, ...p),
}

export const now = Date.now()
export const isProduction = process.env.NODE_ENV !== "development"
export const appName = plugin.pluginName
export const appVersion = plugin.version
