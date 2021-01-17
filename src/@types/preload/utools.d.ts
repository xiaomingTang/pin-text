import Electron from "electron"

import {
  CmdType, Database, Feature, PayloadOf, Ubrowser, User,
} from "./utools-base"

type NoneArgCallback = () => void

type PluginEnterCallback = (obj: PayloadOf<CmdType>, optional?: PayloadOf<CmdType>[]) => void

declare class Utools {
  /**
   * 当插件装载成功，uTools将会主动调用这个方法（生命周期内仅调用一次）
   */
  onPluginReady(callback: NoneArgCallback): void;
  /**
   * 每当插件从后台进入到前台时，uTools将会主动调用这个方法
   */
  onPluginEnter(callback: PluginEnterCallback): void;
  /**
   * 每当插件从前台进入到后台时，uTools将会主动调用这个方法
   */
  onPluginOut(callback: NoneArgCallback): void;
  /**
   * 用户对插件进行分离操作时，uTools将会主动调用这个方法
   */
  onPluginDetach(callback: NoneArgCallback): void;
  /**
   * 当此插件的数据在其他设备上被更改后同步到此设备时，uTools将会主动调用这个方法
   */
  onDbPull(callback: NoneArgCallback): void;
  /**
   * 执行该方法将会隐藏uTools主窗口，包括此时正在主窗口运行的插件，分离的插件不会被隐藏
   * @param isRestorePreWindow 是否焦点回归到前面的活动窗口, 默认为 true
   */
  hideMainWindow(isRestorePreWindow?: boolean): boolean;
  /**
   * 执行该方法将会显示uTools主窗口，包括此时正在主窗口运行的插件
   */
  showMainWindow(): boolean;
  /**
   * 执行该方法将会修改插件窗口的高度
   */
  setExpendHeight(height: number): boolean;
  /**
   * 设置子输入框，进入插件后，原本uTools的搜索条主输入框将会变成子输入框，子输入框可以为插件所使用
   * @param onChange 子输入框文本修改时触发
   * @param placeholder 子输入框占位符
   * @param isFocus 子输入框是否获得焦点, 默认为 true
   */
  setSubInput(onChange?: (e: { text: string }) => void, placeholder?: string, isFocus?: boolean): boolean;
  /**
   * 移出先前设置的子输入框，在插件切换到其他页面时可以重新设置子输入框为其所用
   */
  removeSubInput(): boolean;
  /**
   * 直接对子输入框的值进行设置
   */
  setSubInputValue(value: string): boolean;
  /**
   * 子输入框获得焦点
   */
  subInputFocus(): boolean;
  /**
   * 子输入框获得焦点并选中
   */
  subInputSelect(): boolean;
  /**
   * 子输入框失去焦点，插件获得焦点
   */
  subInputBlur(): boolean;
  /**
   * 执行该方法将会退出当前插件
   */
  outPlugin(): boolean;
  /**
   * 该方法可以携带数据，跳转到另一个插件进行处理，如果用户未安装对应的插件，uTools会弹出提醒并引导进入插件中心下载
   * @param label feature.cmd.label 名称
   * @param payload feature.cmd.type 对应的数据
   */
  redirect(label: string, payload: {
    type: CmdType;
    data?: string | string[];
  }): boolean;
  /**
   * 弹出文件选择框
   * @returns 返回选择的文件数组，用户取消返回 undefined
   */
  showOpenDialog(options: Electron.OpenDialogOptions): string[] | undefined;
  /**
   * 弹出文件保存框
   * @returns 返回选择的路径，用户取消返回 undefined
   */
  showSaveDialog(options: Electron.SaveDialogOptions): string | undefined;
  /**
   * 弹出消息框
   * @returns 返回点击按钮的索引
   */
  showMessageBox(options: Electron.MessageBoxOptions): number;
  /**
   * 插件页面中查找内容
   * @returns 未查证, 根据 Electron.findInPage 返回值猜测
   */
  findInPage(text: string, options?: Electron.FindInPageOptions): number;
  /**
   * 停止插件页面中查找
   * @param action 默认 clearSelection
   */
  stopFindInPage(action?: "clearSelection" | "keepSelection" | "activateSelection"): void;
  /**
   * 原生拖拽文件到其他窗口
   * @param file 文件路径 或 文件路径集合
   */
  startDrag(file: string | string[]): void;
  /**
   * 创建浏览器窗口
   * @param url 相对路径的html文件 例如: test.html?param=xxx
   * @param options 注意: preload 需配置相对位置
   * @param callback url 加载完成时回调
   */
  createBrowserWindow(url: string, options: Electron.BrowserWindowConstructorOptions, callback?: NoneArgCallback): number;
  /**
   * 是否深色模式
   */
  isDarkColors(): boolean;
  /**
   * 返回本插件所有动态增加的功能
   */
  getFeatures(): Feature[];
  /**
   * 为本插件动态新增某个功能
   */
  setFeature(feature: Feature): boolean;
  /**
   * 动态删除本插件的某个功能
   */
  removeFeature(code: string): boolean;
  /**
   * 获取当前用户，未登录帐号返回 null
   */
  getUser(): User | null;
  /**
   * 屏幕取色
   * @param callback 取色结束回调
   */
  screenColorPick(callback: (color: { hex: string; rgb: string }) => void): void;
  /**
   * 屏幕截图
   * @param callback 截图结束回调
   */
  screenCapture(callback: (base64Str: string) => void): void;
  /**
   * 模拟键盘按键
   * 
   * ```
   * // 模拟 Ctrl + Alt + A
   * // utools.simulateKeyboardTap('a', 'ctrl', 'alt')
   * ```
   */
  simulateKeyboardTap(key: string, ...modifier: string[]): void;
  /**
   * 模拟鼠标移动
   */
  simulateMouseMove(x: number, y: number): void;
  /**
   * 模拟鼠标左键单击
   */
  simulateMouseClick(x: number, y: number): void;
  /**
   * 模拟鼠标右键单击
   */
  simulateMouseRightClick(x: number, y: number): void;
  /**
   * 模拟鼠标双击
   */
  simulateMouseDoubleClick(x: number, y: number): void;
  /**
   * 获取鼠标绝对位置
   */
  getCursorScreenPoint(): { x: number; y: number };
  /**
   * 获取主显示器
   */
  getPrimaryDisplay(): Electron.Display;
  /**
   * 获取所有显示器
   */
  getAllDisplays(): Electron.Display[];
  /**
   * 获取位置所在的显示器
   */
  getDisplayNearestPoint(point: Electron.Point): Electron.Display;
  /**
   * 获取矩形所在的显示器
   */
  getDisplayMatching(rect: Electron.Rectangle): Electron.Display;
  /**
   * 复制文件到系统剪贴板
   */
  copyFile(file: string | string[]): boolean;
  /**
   * 复制图片到系统剪贴板
   */
  copyImage(img: string | Buffer): boolean;
  /**
   * 复制文本到系统剪贴板
   */
  copyText(text: string): boolean;
  /**
   * 显示系统通知
   * @param body 猜测是通知内容
   * @param clickFeatureCode plugin.json 配置的 feature.code, 点击通知进入插件功能(该 feature.cmds 至少包含一个搜索字符串关键字)
   */
  showNotification(body: string, clickFeatureCode?: string): void;
  /**
   * 系统默认方式打开给定的文件
   */
  shellOpenPath(fullPath: string): void;
  /**
   * 系统文件管理器中显示给定的文件
   */
  shellShowItemInFolder(fullPath: string): void;
  /**
   * 系统默认的协议打开URL
   */
  shellOpenExternal(url: string): void;
  /**
   * 播放哔哔声
   */
  shellBeep(): void;
  /**
   * 获取本地ID
   */
  getLocalId(): string;
  /**
   * 获取软件版本
   */
  getAppVersion(): string;
  /**
   * 获取路径, 你可以通过名称请求以下的路径:
   * - home 用户的 home 文件夹（主目录）
   * - appData 当前用户的应用数据文件夹，默认对应：
   * -- %APPDATA% Windows 中
   * -- ~/Library/Application Support macOS 中
   * - userData 储存你应用程序设置文件的文件夹，默认是 appData 文件夹附加应用的名称
   * - temp 临时文件夹
   * - exe 当前的可执行文件
   * - desktop 当前用户的桌面文件夹
   * - documents 用户文档目录的路径
   * - downloads 用户下载目录的路径
   * - music 用户音乐目录的路径
   * - pictures 用户图片目录的路径
   * - videos 用户视频目录的路径
   * - logs 应用程序的日志文件夹
   */
  getPath(name: "home" | "appData" | "userData" | "temp" | "exe" | "desktop" | "documents" | "downloads" | "music" | "pictures" | "videos" | "logs"): string;
  /**
   * 获取文件图标
   * @param filePath 文件路径、文件扩展名、"folder"
   * @example 
   * ```
   * // 获取扩展名为 "txt" 的文件图标
   * utools.getFileIcon('.txt')
   * // 获取文件夹图标
   * utools.getFileIcon('folder')
   * // 获取文件图标
   * utools.getFileIcon('D:\\test.url')
   * ```
   */
  getFileIcon(filePath: string): string;
  /**
   * 获取当前文件管理器路径(linux 不支持)，呼出uTools前的活动窗口为资源管理器才能获取
   */
  getCurrentFolderPath(): string;
  /**
   * 获取当前浏览器URL(linux 不支持), 呼出uTools前的活动窗口为浏览器才能获取
   * 
   * MacOs 支持浏览器 Safari、Chrome、Microsoft Edge、Opera、Vivaldi、Brave
   * 
   * Windows 支持浏览器 Chrome、Firefox、Edge、IE、Opera、Brave
   */
  getCurrentBrowserUrl(): string;
  /**
   * 是否 MacOs 操作系统
   */
  isMacOs(): boolean;
  /**
   * 是否 Windows 操作系统
   */
  isWindows(): boolean;
  /**
   * 是否 Linux 操作系统
   */
  isLinux(): boolean;
  getIdleUBrowsers(): {
    id: number;
    title: string;
    url: string;
  }[];
  setUBrowserProxy(config: Electron.Config): boolean;
  db: Database;
  /**
   * 使用方式(示例)
   * ```
   * utools.ubrowser.goto("https://www.baidu.com/")
   *   .cookies()
   *   .run({ width: 1000, height: 800 })
   *   .then(([cookies]) => {
   *     console.log(cookies)
   *   })
   * ```
   */
  ubrowser: Ubrowser;
}

declare const utools: Utools

export default utools
