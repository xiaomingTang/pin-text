export interface PinData {
  type: "text";
  value: string;
}

export class PinApp {
  appKey: string;

  private _datas: PinData[] = [];

  private _getDataFromStorage(): PinData[] {
    try {
      const datas = JSON.parse(window.localStorage.getItem(this.appKey) || "[]") as PinData[]
      if (Array.isArray(datas)) {
        return datas.filter((item) => {
          if (!item) {
            return false
          }
          // 不为空字符串
          return item.type === "text" && !!item.value
        })
      }
    } catch (err) {
      window.showNotification(`获取本地存储信息失败: ${err.message}`)
    }
    return []
  }

  private _saveDataToStorage(datas: PinData[]): boolean {
    try {
      window.localStorage.setItem(this.appKey, JSON.stringify(datas))
      return true
    } catch (err) {
      window.showNotification(`本地存储失败: ${err.message}`)
    }
    return false
  }

  constructor(appKey: string) {
    this.appKey = appKey
    this._datas = this._getDataFromStorage()
  }

  getDatas(): PinData[] {
    return [...this._datas]
  }

  setDatas(datas: PinData[]): boolean {
    if (this._saveDataToStorage(datas)) {
      this._datas = [...datas]
      return true
    }
    return false
  }

  push(data: PinData): number {
    const newDatas = this.getDatas()
    newDatas.push(data)
    this.setDatas(newDatas)
    return this._datas.length
  }

  pop(): PinData | undefined {
    const newDatas = this.getDatas()
    const result = newDatas.pop()
    if (this.setDatas(newDatas)) {
      return result
    }
    return undefined
  }

  splice(start: number, deleteCount: number, ...datas: PinData[]): PinData[] {
    const newDatas = this.getDatas()
    const result = newDatas.splice(start, deleteCount, ...datas)
    if (this.setDatas(newDatas)) {
      return result
    }
    return []
  }

  remove(idx: number) {
    this.splice(idx, 1)
  }
}
