/* eslint-disable max-classes-per-file */
import React, {
  HTMLAttributes, useCallback, useEffect, useMemo, useState,
} from "react"
import { Dispatch } from "redux"
import { useDispatch } from "react-redux"
import { message } from "antd"

import { SyncAction } from "@Src/store"
import { ShortcutType } from "@Src/@types/preload"
import { joinSpace } from "@Src/utils"

import bgFile from "@Src/assets/images/shortcut-file.png"
import bgFolder from "@Src/assets/images/shortcut-folder.png"
import bgLink from "@Src/assets/images/shortcut-link.png"
import bgUnknown from "@Src/assets/images/shortcut-unknown.png"
import bgGroup from "@Src/assets/images/shortcut-group.png"

import Styles from "./index.module.less"

export const shortcutTypeList: ShortcutType[] = ["FILE", "FOLDER", "LINK", "UNKNOWN", "GROUP"]

export const shortcutTypeTitleMap: {
  [key in ShortcutType]: string;
} = {
  FILE: "文件",
  FOLDER: "文件夹",
  LINK: "超链接",
  UNKNOWN: "未知",
  GROUP: "快捷方式组",
}

const bgImageMap: {
  [key in ShortcutType]: string;
} = {
  FILE: bgFile,
  FOLDER: bgFolder,
  LINK: bgLink,
  UNKNOWN: bgUnknown,
  GROUP: bgGroup,
}

export interface ShortcutProps {
  id: string;
  type: ShortcutType;
  title: string;
  target: string;
  children: string[];
  /**
   * 版本号
   */
  _rev?: string;
}

function geneDefaultShortcutData(id: string): ShortcutProps {
  return {
    id,
    type: "UNKNOWN",
    title: "未知",
    target: "",
    children: [],
  }
}

export function getShortcutData(id: string): ShortcutProps {
  try {
    const { data: dataStr, _rev } = window.utools.db.get(id)
    const data = JSON.parse(dataStr) as ShortcutProps
    data._rev = _rev
    if (shortcutTypeList.includes(data?.type)) {
      return data
    }
  } catch (err) {
    // pass
  }
  return geneDefaultShortcutData(id)
}

/**
 * @param deferred 为负数时不延迟, 其他则延迟
 */
export function useShortcutData(id: string, delay = -1): ShortcutProps {
  const [data, setData] = useState(() => geneDefaultShortcutData(id))

  useEffect(() => {
    let timer = -1
    if (delay < 0) {
      setData(getShortcutData(id))
    } else {
      timer = window.setTimeout(() => {
        setData(getShortcutData(id))
      }, delay)
    }

    return () => {
      window.clearTimeout(timer)
    }
  }, [delay, id])

  return data
}

export function saveShortcutData(shortcut: ShortcutProps) {
  if (!shortcut.id) {
    throw new Error("id 为空")
  }
  if (shortcut.type === "UNKNOWN" || (shortcut.type === "GROUP" && shortcut.id !== "root")) {
    throw new Error(`不支持该类型, 可能是地址有误: ${shortcut.target}`)
  }
  window.utools.db.put({
    _id: shortcut.id,
    data: JSON.stringify({
      ...shortcut,
      // 移除 _rev 属性
      _rev: undefined,
    }),
    _rev: shortcut._rev,
  })
}

export function appendIdsTo(parentId: string, ...childIds: string[]) {
  const availableChildIds = childIds.filter(Boolean)
  if (!parentId || availableChildIds.length === 0) {
    return
  }
  const parentData = getShortcutData(parentId)
  if (parentData.type === "GROUP" || parentData.id === "root") {
    saveShortcutData({
      ...parentData,
      type: "GROUP",
      children: [...parentData.children, ...availableChildIds],
    })
  }
}

export function removeIdsFrom(parentId: string, ...childIds: string[]) {
  const availableChildIds = childIds.filter(Boolean)
  if (!parentId || availableChildIds.length === 0) {
    return
  }
  const parentData = getShortcutData(parentId)
  if (parentData.type === "GROUP") {
    saveShortcutData({
      ...parentData,
      children: parentData.children.filter((id) => !availableChildIds.includes(id)),
    })
  }
}

export function removeIdsFromStorage(...ids: string[]) {
  ids.filter(Boolean).forEach((id) => {
    window.utools.db.remove(id)
  })
}

/**
 * @param id 可以为空字符串, 表示新建
 */
export function geneOnContextMenu(dispatch: Dispatch<SyncAction>, id: string) {
  return function onContextMenu(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation()
    dispatch({
      type: "@shortcutEditor/set",
      value: {
        contextMenu: {
          id,
          x: e.clientX,
          y: e.clientY,
        },
      },
    })
  }
}

export function Shortcut({
  active = false,
  idx, shortcutId, className, ...props
}: ({
  idx: number;
  shortcutId: string;
  active?: boolean;
} & HTMLAttributes<HTMLDivElement>)) {
  const dispatch = useDispatch<Dispatch<SyncAction>>()
  const data = useShortcutData(shortcutId)
  const backgroundImage = useMemo(() => `url("${bgImageMap[data.type]}")`, [data])

  const onContextMenu = useMemo(() => geneOnContextMenu(dispatch, shortcutId), [dispatch, shortcutId])

  const onClick = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    dispatch({
      type: "@shortcutEditor/set",
      value: {
        selected: {
          idx,
        },
      },
    })
  }, [dispatch, idx])

  const onDoubleClick = useCallback(() => {
    try {
      // 实际上这里是不会抛出错误的
      // 不知道是 electron 还是 utools 处理的(忘了 electron 是否会处理了)
      // 但是保险起见, 放在 try catch 里面吧
      window.openShortcut({
        type: data.type,
        target: data.target,
      })
    } catch (err) {
      message.error(err.message)
    }
  }, [data])

  return <div
    className={joinSpace("unselectable", Styles.wrapper, className, active && Styles.active)}
    {...props}
    onContextMenu={onContextMenu}
    onClick={onClick}
    onDoubleClick={onDoubleClick}
    title={props.title || data.title}
  >
    <div
      className={Styles.body}
      style={{
        backgroundImage,
      }}
    />
    <div className={Styles.title}>{data.title}</div>
  </div>
}
