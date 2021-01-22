import React from "react"
import Menu, { MenuProps } from "antd/lib/menu"

import { ActionType } from "@Src/@types/preload"

export interface Action {
  actionType: ActionType;
  template: string;
}

export const actionTypeTitleMap: { [key in ActionType]: string } = {
  COPY_TO_CLIPBOARD: "复制到剪贴板",
  OPEN_FILE: "打开文件(系统默认方式)",
  OPEN_FILE_IN_EXPLORER: "打开文件(资源管理器)",
  OPEN_DIR: "打开文件夹",
  OPEN_URL: "打开超链接",
}

export const actionTypeList: ActionType[] = [
  "COPY_TO_CLIPBOARD",
  "OPEN_FILE",
  "OPEN_FILE_IN_EXPLORER",
  "OPEN_DIR",
  "OPEN_URL",
]

export const defaultActions: Action[] = [
  {
    actionType: "COPY_TO_CLIPBOARD",
    template: "prefix-{INPUT}-suffix",
  },
  {
    actionType: "OPEN_FILE",
    template: "prefix-{INPUT}-suffix",
  },
  {
    actionType: "OPEN_FILE_IN_EXPLORER",
    template: "prefix-{INPUT}-suffix",
  },
  {
    actionType: "OPEN_DIR",
    template: "prefix-{INPUT}-suffix",
  },
  {
    actionType: "OPEN_URL",
    template: "https://www.baidu.com/s?wd={ENCODE_URI_COMPONENT_INPUT}",
  },
]

export function ActionTypeSelector({
  activeType, ...props
}: { activeType: ActionType } & MenuProps) {
  return <Menu {...props} selectedKeys={[activeType]}>
    {
      actionTypeList.map((actionType) => (<Menu.Item key={actionType}>
        {actionTypeTitleMap[actionType]}
      </Menu.Item>))
    }
  </Menu>
}
