const path = require("path")

/**
 * 打开新的 BrowserWindow
 * 输入路径直接填 webpackConfig.output.publicPath 内的相对路径(如 ./index.html)
 * @param {string} p
 */
window.openPage = function openPage(p) {
  const tarPath = path.join("./dist", p)
  utools.hideMainWindow()
  utools.createBrowserWindow(tarPath, {
    title: "钉住",
    width: 400,
    height: 100,
    useContentSize: true,
    alwaysOnTop: true,
    minimizable: true,
    maximizable: false,
    frame: true,
    backgroundColor: "#ffffff",
    webPreferences: {
      // preload 文件相对于 plugin.json 所在目录的路径
      preload: "./preload/index.js",
    },
  })
  utools.outPlugin()
}

window.copyText = utools.copyText

window.showNotification = utools.showNotification
