import utools from "./utools"

declare global {
  interface Window {
    /**
     * 用到 electron 的功能都不能在 render 页面直接使用
     * 
     * 需要在 preload 文件中绑定到 window 中使用
     */
    utools: typeof utools;
    /**
     * 打开新的 BrowserWindow
     * 输入路径直接填 webpackConfig.output.publicPath 内的相对路径(如 ./index.html)
     * @param {string} p
     */
    openPage(p: string): string;
    copyText: typeof utools.copyText;
    showNotification: typeof utools.showNotification;
  }  
}
