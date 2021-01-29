export interface State {
  /**
   * contextMenu 为 undefined 则表示菜单未弹出
   */
  contextMenu?: {
    /**
     * id 为空字符串表示创建
     */
    id: string;
    x: number;
    y: number;
  };
  /**
   * selected 为 undefined 表示没有 shortcut 处于选中状态
   */
  selected?: {
    idx: number;
  };
  /**
   * editing 为 undefined 表示没有 shortcut 处于编辑状态
   */
  editing?: {
    id: string;
  };
}

export const initState: State = {}

export type Action = {
  type: "@shortcutEditor/set";
  value: State;
}

export function reducer(state = initState, action: Action): State {
  switch (action.type) {
  case "@shortcutEditor/set": {
    return {
      ...state,
      ...action.value,
    }
  }
  default:
    // @ts-ignore
    if (/^@shortcutEditor/g.test(action.type)) {
      const neverAction: never = action.type
      console.error("wrong action: ", neverAction)
    }
    return state
  }
}
