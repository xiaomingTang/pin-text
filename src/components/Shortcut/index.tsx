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
import bgGroup from "@Src/assets/images/shortcut-group.png"
import bgLink from "@Src/assets/images/shortcut-link.png"
import bgUnknown from "@Src/assets/images/shortcut-unknown.png"

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
  GROUP: bgGroup,
  LINK: bgLink,
  UNKNOWN: bgUnknown,
}

interface ShortcutProps {
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
  console.log(shortcut.type, shortcut.type === "UNKNOWN")
  if (shortcut.type === "UNKNOWN") {
    throw new Error(`不支持该类型, 地址有误: ${shortcut.target}`)
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
  shortcutId, className, ...props
}: ({
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
          id: shortcutId,
        },
      },
    })
  }, [dispatch, shortcutId])

  const onDoubleClick = useCallback(() => {
    if (data.type === "GROUP") {
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.set("id", data.target)
      window.history.pushState(null, "", newUrl.toString())
      return
    }
    try {
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
  >
    <div
      className={Styles.body}
      style={{
        backgroundImage,
      }}
    />
    <div className={Styles.title} title={data.title}>{data.title}</div>
  </div>
}
