import utools from "./utools"

export type ShortcutType = "FILE" | "FOLDER" | "LINK" | "UNKNOWN" | "GROUP"

declare global {
  interface Window {
    /**
     * 用到 electron 的功能都不能在 render 页面直接使用
     * 
     * 需要在 preload 文件中绑定到 window 中使用
     */
    utools: typeof utools;
    /**
     * 根据输入路径判断资源类型(文件/文件夹/超链接/以上都不是)
     */
    checkShortcutType(str: string): ShortcutType;
    /**
     * 打开快捷方式
     */
    openShortcut(shortcut: {
      type: Exclude<ShortcutType, "GROUP">;
      target: string;
    }): void;
  }  
}
