const fs = require("fs")

/**
 * 测试输入值类型
 * @param {string} str 可以是文件、文件夹本地(绝对)路径, 也可以是超链接(必须http(s)开头)
 * @returns {string} "FOLDER" | "FILE" | "LINK" | "UNKNOWN" | "GROUP"
 */
module.exports.checkShortcutType = function checkShortcutType(str) {
  if (!str) {
    return "GROUP"
  }
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
  // https://regexr.com/37i6s
  // 原文是 \.[a-z]{2,10}, 但是估计那篇文章比较早, 那时候域名后缀比较短, 现在已经有些很长了, 比如说 ant.design
  if (/^((https?:\/\/)|(\/\/))?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,10}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i.test(str)) {
    return "LINK"
  }
  return "UNKNOWN"
}
