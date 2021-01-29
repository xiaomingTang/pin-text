const fs = require("fs")

/**
 * 测试输入值类型
 * @param {string} str 可以是文件、文件夹本地(绝对)路径, 也可以是超链接(必须http(s)开头)
 * @returns {string} "FOLDER" | "FILE" | "LINK" | "UNKNOWN"
 */
module.exports.checkShortcutType = function checkShortcutType(str) {
  if (/^([a-z]:)?[\\\/]\w+/i.test(str)) { // 可能是文件、文件夹
    try {
      const stat = fs.statSync(str)
      if (stat.isFile()) {
        return "FILE"
      } else if (stat.isDirectory()) {
        return "FOLDER"
      }
    } catch (err) {
      // pass
    }
  }
  /**
   * 必须包含完整协议 (如 https)
   */
  if (/^((https?|ftp|smtp):\/\/)(www\.)?([\u4e00-\u9fa5\w%+-~@]+\.)+[\u4e00-\u9fa5\w%+-~@]+(\/[\u4e00-\u9fa5\w%+-~@]+)*\/?/i.test(str)) {
    return "LINK"
  }
  return "UNKNOWN"
}
