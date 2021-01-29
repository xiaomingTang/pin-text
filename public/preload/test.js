const { checkShortcutType } = require("./utils")

function showFlag(value) {
  return value ? "[ √ ]" : "- X -"
}

const fileList = [
  "E:\\Microsoft VS Code\\Code.exe",
  "E:/Microsoft VS Code/ffmpeg.dll",
  "C:\\Program Files (x86)\\Internet Explorer\\ExtExport.exe",
  "C:/Program Files (x86)/Internet Explorer/iexplore.exe",
  "F:\\tang\\中文  路径  测试\\测试  文件.txt",
  "F:/tang/中文  路径  测试/测试  文件.txt",
  "C:/none-exist-path/file.txt",
]

const folderList = [
  "E:\\Microsoft VS Code\\",
  "E:\\Microsoft VS Code",
  "E:/Microsoft VS Code/",
  "E:/Microsoft VS Code",
  "C:\\Program Files (x86)\\Internet Explorer\\",
  "C:\\Program Files (x86)\\Internet Explorer",
  "C:/Program Files (x86)/Internet Explorer/",
  "C:/Program Files (x86)/Internet Explorer",
  "F:\\tang\\中文  路径  测试\\",
  "F:\\tang\\中文  路径  测试",
  "F:/tang/中文  路径  测试/",
  "F:/tang/中文  路径  测试",
  "C:/none-exist-path/",
  "C:/none-exist-path",
]

/**
 * 必须包含完整协议 (如 https)
 */
const linkList = [
  "https://u.tools/docs/developer/api.html?query=1#%E7%B3%BB%E7%BB%9F",
  "https://www.中文.com/又是中文",
  "https://www.baidu.com/",
  "https://www.baidu.com",
  "http://www.baidu.com/",
  "http://www.baidu.com",
  "https://not-link/",
  "http://not-link",
  "not-link",
]

function main() {
  fileList.forEach((p) => {
    console.log(`${showFlag(checkShortcutType(p) === "FILE")} file: ${p}`)
  })

  folderList.forEach((p) => {
    console.log(`${showFlag(checkShortcutType(p) === "FOLDER")} folder: ${p}`)
  })

  linkList.forEach((p) => {
    console.log(`${showFlag(checkShortcutType(p) === "LINK")} link: ${p}`)
  })

  console.log("【end】")
}

main()
