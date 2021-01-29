import React, {
  useCallback, useEffect, useMemo, useState,
} from "react"
import {
  Button, Empty, Form, Input, Menu, message, Modal, notification,
} from "antd"
import { useKey, useSearchParam } from "react-use"
import { useDispatch, useSelector } from "react-redux"
import { Dispatch } from "redux"

import { State, SyncAction } from "@Src/store"
import { render } from "@Src/pages/global"
import {
  ShortcutProps, geneOnContextMenu, getShortcutData, saveShortcutData, Shortcut, shortcutTypeTitleMap, removeIdsFrom, removeIdsFromStorage, appendIdsTo,
} from "@Src/components/Shortcut"
import { ShortcutType } from "@Src/@types/preload"
import { PayloadOf } from "@Src/@types/preload/utools-base"

import Styles from "./index.module.less"

function ContextMenuFor({
  id, x, y,
}: {
  /**
   * id 为空字符串表示新建
   */
  id: string;
  x: number;
  y: number;
}) {
  const dispatch = useDispatch<Dispatch<SyncAction>>()

  const onClick = useCallback(() => {
    // 只有一个按钮, 所以不必判断 key 值
    dispatch({
      type: "@shortcutEditor/set",
      value: {
        editing: {
          id: id || (Date.now() + Math.random()).toString(),
        },
        selected: {
          idx: -1,
        },
      },
    })
  }, [dispatch, id])

  return <Menu onClick={onClick} className="unselectable" style={{
    position: "absolute",
    left: x,
    top: y,
  }}>
    <Menu.Item key="editOrCreate">{id ? "编辑" : "新建"} &nbsp;&nbsp;&nbsp;&nbsp;</Menu.Item>
  </Menu>
}

// @TODO 快捷添加文件、文件夹、超链接

/**
 * editingId 为 falsy 表示没有 shortcut 处于编辑状态
 */
function EditorFor({ editingId, parentId, onUpdate }: {
  editingId?: string;
  parentId: string;
  onUpdate?: () => void;
}) {
  const dispatch = useDispatch<Dispatch<SyncAction>>()
  const data = useMemo(() => getShortcutData(editingId || ""), [editingId])
  const [title, setTitle] = useState(data.title)
  const [target, setTarget] = useState(data.target)
  const noneInStorage = useMemo(() => data.type === "UNKNOWN", [data])
  const type: ShortcutType = useMemo(() => window.checkShortcutType(target), [target])

  // title 和 target 初始化的时候, getShortcutData 参数 id 为空字符串
  // 所以需要在 data 变化时重新初始化
  useEffect(() => {
    setTitle(data.title)
    setTarget(data.target)
  }, [data])

  if (!editingId) {
    return <></>
  }

  return <Modal
    visible
    title={noneInStorage ? "新建" : "编辑"}
    footer={false}
    onOk={() => dispatch({
      type: "@shortcutEditor/set",
      value: {
        editing: undefined,
      },
    })}
    onCancel={() => dispatch({
      type: "@shortcutEditor/set",
      value: {
        editing: undefined,
      },
    })}
  >
    <Form layout="vertical" onFinish={() => {
      try {
        const newData: ShortcutProps = {
          ...data,
          title,
          target,
          type,
        }
        saveShortcutData(newData)
        if (noneInStorage) {
          appendIdsTo(parentId, editingId)
        }
        message.success(`已保存到数据库: ${newData.title}`)
        setTimeout(() => {
          // 防止保存数据库是异步动作
          // 所以放到 setTimeout 里面来
          if (onUpdate) {
            onUpdate()
          }
          dispatch({
            type: "@shortcutEditor/set",
            value: {
              editing: undefined,
            },
          })
        }, 100)
      } catch (err) {
        notification.error({
          message: "错误",
          description: err.message,
          duration: null,
        })
      }
    }}>
      <Form.Item label="名称">
        <Input value={title} onChange={(e) => {
          const eventTarget = e.target as HTMLInputElement
          setTitle(eventTarget.value || "")
        }} />
      </Form.Item>
      <Form.Item label={`地址 (当前类型为 【${shortcutTypeTitleMap[type]}】)`}>
        <Input value={target} autoFocus onChange={(e) => {
          const eventTarget = e.target as HTMLInputElement
          setTarget(eventTarget.value || "")
        }} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          确认
        </Button>
      </Form.Item>
    </Form>
  </Modal>
}

const App = () => {
  const dispatch = useDispatch<Dispatch<SyncAction>>()
  /**
   * 当前页 id
   */
  const id = useSearchParam("id") || "root"
  const shortcutEditor = useSelector<State, State["shortcutEditor"]>((state) => state.shortcutEditor)
  const [shortcuts, _setShortcuts] = useState<string[]>([])
  const editingId = useMemo(() => shortcutEditor.editing?.id, [shortcutEditor.editing])
  const selectedIdx = useMemo(() => shortcutEditor.selected?.idx ?? -1, [shortcutEditor.selected])
  const selectedId = useMemo(() => shortcuts[selectedIdx], [selectedIdx, shortcuts])
  const [updateTime, setUpdateTime] = useState(Date.now())

  const setShortcuts = useCallback((config: React.SetStateAction<string[]>) => {
    _setShortcuts(config)
    setUpdateTime(Date.now())
  }, [])

  const updateShortcuts = useCallback(() => {
    setShortcuts(getShortcutData(id).children)
  }, [id, setShortcuts])

  // 数据初始化
  useEffect(() => {
    window.utools.onPluginReady(() => {
      updateShortcuts()
    })
    updateShortcuts()
  }, [updateShortcuts])

  // 绑定事件: 从 utools 首页输入框输入 直接添加快捷方式
  useEffect(() => {
    window.utools.onPluginEnter((obj) => {
      // 有bug, 执行一次命令后, 重新打开配置页时, 配置页白屏, 需要执行一次 resize 才会出现内容
      // window.utools.setExpendHeight(600)
      const childId = (Date.now() + Math.random()).toString()
      let newShortcut: ShortcutProps | undefined
      try {
        switch (obj.type) {
        case "files": {
          const { payload: [fileOrDir] } = obj as PayloadOf<"files">
          if (fileOrDir) {
            const type = window.checkShortcutType(fileOrDir.path)
            newShortcut = {
              id: childId,
              type,
              title: fileOrDir.name,
              target: fileOrDir.path,
              children: [],
            }
          }
          break
        }
        case "regex": {
          const { payload } = obj as PayloadOf<"regex">
          const type = window.checkShortcutType(payload)
          if (type === "LINK") {
            const url = new URL(payload)
            const title = url.hostname.replace(/^www\./i, "")
            newShortcut = {
              id: childId,
              type,
              title,
              target: payload,
              children: [],
            }
          }
          break
        }
        default:
          break
        }
        if (newShortcut) {
          saveShortcutData(newShortcut)
          appendIdsTo(id, childId)
          updateShortcuts()
        }
      } catch (err) {
        window.utools.showNotification(`出错了: ${err.message}`)
      }
    })
  }, [id, updateShortcuts])

  // 绑定删除事件
  useKey("Delete", () => {
    if (selectedId) {
      removeIdsFrom(id, selectedId)
      removeIdsFromStorage(selectedId)
      updateShortcuts()
    }
  }, {}, [selectedId, updateShortcuts])

  useKey("ArrowLeft", () => {
    let newIdx = selectedIdx - 1
    if (newIdx < 0) {
      newIdx = shortcuts.length - 1
    }
    dispatch({
      type: "@shortcutEditor/set",
      value: {
        selected: {
          idx: newIdx,
        },
      },
    })
  }, {}, [selectedIdx, shortcuts])

  useKey("ArrowRight", () => {
    let newIdx = selectedIdx + 1
    if (newIdx >= shortcuts.length) {
      newIdx = 0
    }
    dispatch({
      type: "@shortcutEditor/set",
      value: {
        selected: {
          idx: newIdx,
        },
      },
    })
  }, {}, [selectedIdx, shortcuts])

  useKey("Enter", () => {
    if (selectedIdx < 0) {
      return
    }
    const selectedData = getShortcutData(selectedId)
    try {
      // 实际上这里是不会抛出错误的
      // 不知道是 electron 还是 utools 处理的(忘了 electron 是否会处理了)
      // 但是保险起见, 放在 try catch 里面吧
      window.openShortcut({
        type: selectedData.type,
        target: selectedData.target,
      })
    } catch (err) {
      message.error(err.message)
    }
  }, {}, [selectedIdx, selectedId])

  // 取消 contextmenu
  useEffect(() => {
    function cancelContextMenu() {
      setTimeout(() => {
        // document.body 上单击时取消 contextmenu
        // 但是需要延迟取消, 因为 "取消的动作" 和 "contextmenu点击动作" 冲突了
        dispatch({
          type: "@shortcutEditor/set",
          value: {
            contextMenu: undefined,
            selected: undefined,
          },
        })
      }, 100)
    }

    window.addEventListener("click", cancelContextMenu)

    return () => {
      window.removeEventListener("click", cancelContextMenu)
    }
  }, [dispatch])

  return <div className={Styles.wrapper} onContextMenu={geneOnContextMenu(dispatch, "")}>
    {
      shortcuts.length === 0 && <Empty description="暂无数据, 请【鼠标右键】单击新建快捷方式" />
    }
    {
      shortcuts.map((shortcutId, idx) => (<Shortcut
        key={`${shortcutId}-${updateTime}`}
        idx={idx}
        active={selectedId === shortcutId}
        shortcutId={shortcutId}
      />))
    }
    {
      shortcutEditor.contextMenu && <ContextMenuFor {...shortcutEditor.contextMenu} />
    }
    <EditorFor editingId={editingId} parentId={id} onUpdate={updateShortcuts} />
  </div>
}

render(<App />)
