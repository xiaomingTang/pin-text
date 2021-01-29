import Electron from "electron"

export type Platform = "win32" | "darwin" | "linux"

export type CmdType = "text" | "regex" | "img" | "files" | "window" | "over"

export type FileType = "file" | "directory"

type DeviceOption = "iPhone 11"
  | "iPhone X"
  | "iPad"
  | "iPhone 6/7/8 Plus"
  | "iPhone 6/7/8"
  | "iPhone 5/SE"
  | "HUAWEI Mate10"
  | "HUAWEI Mate20"
  | "HUAWEI Mate30"
  | "HUAWEI Mate30 Pro"
  | {
    size: {
      width: number;
      height: number;
    };
    useragent: string;
  }

export type Cmd = string | {
  type: "regex";
  label: string;
  /**
   * 正则表达式字符串
   * @example "/xxx/i"
   */
  match: string;
  minLength?: number;
  maxLength?: number;
} | {
  type: "img";
  label: string;
} | {
  type: "files";
  label: string;
  fileType?: FileType;
  /**
   * 文件名称正则匹配
   * @example "/xxx/i"
   */
  match?: string;
  minLength?: number;
  maxLength?: number;
} | {
  type: "window";
  label: string;
  match: {
    app?: string[];
    /**
     * 匹配窗口标题的正则 (有配置时应用也必须配置)
     * @example "/xxx/i"
     */
    title?: string;
    class?: string[];
  };
} | {
  type: "over";
  label: string;
  /**
   * 排除的正则
   * @example "/xxx/i"
   */
  exclude?: string;
  minLength?: number;
  maxLength?: number;
}

export interface Feature {
  icon?: string;
  platform?: Platform[];
  code: string;
  explain: string;
  cmds: Cmd[];
}

type BasePayloadMap = {
  [key in CmdType]: any;
}

export interface PayloadMap extends BasePayloadMap {
  text: string;
  regex: string;
  over: string;
  /**
   * base64
   */
  img: string;
  files: {
    isFile: boolean;
    isDirectory: boolean;
    name: string;
    path: string;
  }[];
  window: {
    id: number;
    class: string;
    title: string;
    x: number;
    y: number;
    width: number;
    height: number;
    appPath: string;
    pid: number;
    app: string;
  };
}

export interface PayloadOf<T extends CmdType> {
  code: string;
  type: T;
  payload: PayloadMap[T];
}

export interface User {
  avatar: string;
  nickname: string;
  /**
   * 猜测 member 应该是会员
   */
  type: "member" | "user";
}

interface DbOption {
  /**
   * _id 已存在时将会更新, 不存在则将会新建
   */
  _id: string;
  /**
   * _rev 表示版本号
   * 更新时必须带有 _rev, 否则更新失败
   */
  _rev?: string;
  data: string;
}

interface DbReturn {
  id: string;
  /**
   * rev 表示版本号
   */
  rev: string;
  ok: boolean;
}

export interface Database {
  /**
   * 执行该方法将会创建或更新数据库文档
   */
  put(data: DbOption): DbReturn;
  /**
   * 执行该方法将会根据文档ID获取数据
   */
  get(id: string): DbOption;
  /**
   * 执行该方法将会删除数据库文档，可以传入文档对象或文档id进行操作
   * 
   * @warning 这里文档对象是什么东西我不清楚, 猜测其类型是 DbOption
   */
  remove(doc: string | DbOption): DbReturn;
  /**
   * 执行该方法将会批量更新数据库文档，传入需要更改的文档对象合并成数组进行批量更新
   * @example
   * ```
   * utools.db.bulkDocs([
   *   {
   *    _id: "demo1",
   *    data: "demo",
   *    _rev: "1-c8817a74e292eda4cba1a45924853af6"
   *   },
   *   {
   *     _id: "demo2",
   *     data: "demo",
   *     _rev: "1-f0399b42cc6123a9cc8503632ba7b3a7"
   *   }
   * ])
   * 
   * // 返回值:
   * [
   *   {
   *     id: "demo1", ok: true, rev: "2-7857b2801bc0303d2cc0bb82e8afd796"
   *   },
   *   {
   *     id: "demo2", ok: true, rev: "2-7857b2801bc0303d2cc0bb82e8afd796"
   *   }
   * ]
   * ```
   */
  bulkDocs(docs: DbOption[]): DbReturn[];
  /**
   * 执行该方法将会获取所有数据库文档
   * 
   * 如果传入字符串, 则会返回以字符串开头的文档
   * 
   * 也可以传入指定ID的数组
   * 
   * 不传入则为获取所有文档
   */
  allDocs(key: string | string[]): DbOption[];
  /**
   * 存储附件到文档
   * @param docId 文档 ID
   * @param attachmentId 附件 ID
   * @param rev 文档版本
   * @param attachment 附件，最大 20M
   * @param type 附件类型，比如：image/png, text/plain
   */
  putAttachment(docId: string, attachmentId: string, rev: string, attachment: Buffer | Uint8Array, type: string): DbReturn;
  /**
   * 获取附件
   * @param docId 文档 ID
   * @param attachmentId 附件 ID
   */
  getAttachment(docId: string, attachmentId: string): Uint8Array;
  /**
   * 删除附件
   * @warning 返回值类型(DbReturn)文档中并未说明, 是我猜测的
   * @param docId 文档 ID
   * @param attachmentId 附件 ID
   * @param rev 文档版本
   */
  removeAttachment(docId: string, attachmentId: string, rev: string): DbReturn;
}

export interface Ubrowser {
  /**
   * 设置 User-Agent
   */
  useragent(userAgent: string): Ubrowser;
  goto(url: string, headers?: { Referer: string; userAgent: string }): Ubrowser;
  /**
   * Markdown 转 Html 并显示
   * @param mdText Markdown 文本
   * @param title 窗口标题
   */
  goto(mdText: string, title?: string): Ubrowser;
  /**
   * 页面大小
   */
  viewport(width: number, height: number): Ubrowser;
  hide(): Ubrowser;
  show(): Ubrowser;
  /**
   * 注入样式
   */
  css(cssCode: string): Ubrowser;
  /**
   * 模拟键盘按键
   * 
   * ```
   * // 模拟 Ctrl + Alt + A
   * // press("a", "ctrl", "alt")
   * ```
   */
  press(key: string, ...modifire: string[]): Ubrowser;
  /**
   * 粘贴 文本字符串 | 图片base64
   */
  paste(text?: string): Ubrowser;
  /**
   * 部分网页截图
   * @param arg
   * - string 要截取的DOM元素
   * - Electron.Rectangle 截图位置和大小
   * - 为空 截取整个窗口
   * @param savePath 图片保存路径, 也可以是完整PNG文件路径。默认 存储在临时目录
   */
  screenshot(arg: string | Electron.Rectangle, savePath?: string): Ubrowser;
  /**
   * 保存页面为PDF
   * @param savePath 保存路径, 也可以是完整pdf文件路径。默认 存储在临时目录
   */
  pdf(options: Electron.PrintToPDFOptions, savePath?: string): Ubrowser;
  /**
   * 模拟设备
   */
  device(arg: DeviceOption): Ubrowser;
  /**
   * 获取cookie, 为空获取全部cookie
   */
  cookies(name?: string): Ubrowser;
  setCookies(name: string, value: string): Ubrowser;
  setCookies(cookies: { name: string; value: string }): Ubrowser;
  removeCookies(name: string): Ubrowser;
  /**
   * 如果在执行"goto"前执行, 则 url 必需
   */
  clearCookies(url?: string): Ubrowser;
  /**
   * 打开开发者工具
   * @param mode 默认 "detach"
   */
  devTools(mode?: "right" | "bottom" | "undocked" | "detach"): Ubrowser;
  /**
   * 执行JS函数 如果有返回值将加入到返回结果中
   * @param func 注意, 这个函数是在目标浏览器中执行, 所以注意, 不能使用大部分语法, ES6 以上的都要小心
   */
  evaluate<S extends any[]>(func: (...args: S) => unknown, ...params: S): Ubrowser;
  wait(ms: number): Ubrowser;
  /**
   * 等待DOM元素出现
   */
  wait(selector: string, timeout?: number): Ubrowser;
  /**
   * 在网页内执行的函数，返回 true 结束等待
   */
  wait<S extends any[]>(func: (...args: S) => boolean, timeout: number, ...params: S): Ubrowser;
  /**
   * 当元素存在时执行, 直到碰到 end() 方法
   */
  when(selector: string): Ubrowser;
  /**
   * 当JS函数执行返回 true 时执行, 直到碰到 end() 方法
   * @param func 在网页内执行的函数，返回 true 执行
   */
  when<S extends any[]>(func: (...args: S) => boolean, ...params: S): Ubrowser;
  /**
   * 与 when 配套使用
   */
  end(): Ubrowser;
  click(selector: string): Ubrowser;
  mousedown(selector: string): Ubrowser;
  mouseup(selector: string): Ubrowser;
  /**
   * 为网页中的file input 赋值
   * @param selector input type="file" 元素
   * @param payload 文件路径 或 路径集合 或 文件Buffer
   */
  file(selector: string, payload: string | string[] | Buffer): Ubrowser;
  /**
   * 为网页中的 input textarea select 元素赋值
   * @param selector input textarea select 元素
   */
  value(selector: string, val: string): Ubrowser;
  /**
   * checkbox radio 元素选中或取消选中
   * @param selector checkbox radio 元素
   */
  check(selector: string, checked: boolean): Ubrowser;
  focus(selector: string): Ubrowser;
  scroll(selector: string): Ubrowser;
  scroll(y: number): Ubrowser;
  scroll(x: number, y: number): Ubrowser;
  /**
   * 运行在闲置的 ubrowser 上
   * @param ubrowserId utools.getIdleUBrowsers() 中获得
   */
  run(ubrowserId: number): Promise<unknown[]>;
  /**
   * 启动一个 ubrowser 运行
   */
  run(options: Electron.BrowserWindowConstructorOptions): Promise<unknown[]>;
}
