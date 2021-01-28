const { checkShortcutType } = require("./utils")

window.checkShortcutType = checkShortcutType

/**
 * 
 * @param {string} shortcut.type "FOLDER" | "FILE" | "LINK" | "UNKNOWN"
 * @param {string} shortcut.target 相应目标地址
 */
window.openShortcut = function openShortcut(shortcut) {
  const { type, target } = shortcut || {}
  const errorMsg = `不受支持的快捷方式: type<${type}>, target<${target}>`
  if (!(type && target)) {
    throw new Error(errorMsg)
  }
  switch (type) {
    case "FOLDER":
      utools.shellOpenPath(target)
      break;
    case "FILE":
      utools.shellShowItemInFolder(target)
      break;
    case "LINK":
      utools.shellOpenExternal(target)
      break;
    default:
      throw new Error(errorMsg)
  }
  utools.outPlugin()
}
