import utools from "./utools"

export type ActionType = "OPEN_FILE" | "OPEN_FILE_IN_EXPLORER" | "OPEN_DIR" | "OPEN_URL" | "COPY_TO_CLIPBOARD"

declare global {
  interface Window {
    /**
     * 用到 electron 的功能都不能在 render 页面直接使用
     * 
     * 需要在 preload 文件中绑定到 window 中使用
     */
    utools: typeof utools;
    convertInput(inputVar: string, outputTemp: string): string;
    handleInput(inputVar: string, outputTemp: string, type: ActionType, options?: { [key in string]: any }): string;
  }  
}
