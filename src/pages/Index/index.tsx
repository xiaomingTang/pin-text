import React, {
  useCallback, useEffect, useMemo, useState,
} from "react"
import {
  Button, Form, Input, Menu, message, Modal, Radio,
} from "antd"
import { useSearchParam } from "react-use"
import { MenuInfo } from "rc-menu/lib/interface"
import { useDispatch, useSelector } from "react-redux"
import { Dispatch } from "redux"

import { State, SyncAction } from "@Src/store"
import { render } from "@Src/pages/global"
import {
  geneOnContextMenu, getShortcutData, saveShortcutData, Shortcut, shortcutTypeList, shortcutTypeTitleMap, useShortcutData,
} from "@Src/components/Shortcut"
import { ShortcutType } from "@Src/@types/preload"

import Styles from "./index.module.less"

function ContextMenuFor({
  id, x, y,
}: {
  id: string;
  x: number;
  y: number;
}) {
  const dispatch = useDispatch<Dispatch<SyncAction>>()
  const onClick = useCallback(({ key }: MenuInfo) => {
    // 只有一个按钮, 所以不必判断 key 值
    // 空字符串时无动作
    if (!id) {
      return
    }
    dispatch({
      type: "@shortcutEditor/set",
      value: {
        editing: {
          id,
        },
      },
    })
  }, [dispatch, id])

  return !id ? <></> : <Menu onClick={onClick} className="unselectable" style={{
    position: "absolute",
    left: x,
    top: y,
  }}>
    <Menu.Item key="editOrCreate">{id ? "编辑" : "新建"} &nbsp;&nbsp;&nbsp;&nbsp;</Menu.Item>
  </Menu>
}

function EditorFor({ editingId, parentId }: {
  editingId?: string;
  parentId: string;
}) {
  const dispatch = useDispatch<Dispatch<SyncAction>>()
  const data = useShortcutData(editingId || "")
  const [title, setTitle] = useState(data.title)
  const [target, setTarget] = useState(data.target)

  const type: ShortcutType = useMemo(() => {
    if (!target) {
      return "GROUP"
    }
    return window.checkShortcutType(target)
  }, [target])

  if (editingId === undefined) {
    return <></>
  }

  return <Form layout="vertical" onFinish={() => {
    try {
      saveShortcutData({
        ...data,
        title,
        target,
        type,
      })
      message.success(`已保存到数据库: ${title} ${JSON.stringify(data)}`)
    } catch (err) {
      message.error(err.message)
    }
    setTimeout(() => {
      dispatch({
        type: "@shortcutEditor/set",
        value: {
          editing: undefined,
        },
      })
    }, 100)
  }}>
    <Form.Item label="名称">
      <Input value={title} autoFocus onChange={(e) => {
        const eventTarget = e.target as HTMLInputElement
        setTitle(eventTarget.value || "")
      }} />
    </Form.Item>
    <Form.Item label="地址">
      <Input placeholder="为空时将会新建【快捷方式组】" title="为空时将会新建【快捷方式组】" value={target} onChange={(e) => {
        const eventTarget = e.target as HTMLInputElement
        setTarget(eventTarget.value || "")
      }} />
    </Form.Item>
    <Form.Item label="类别">
      <Radio.Group disabled value={type}>
        {
          shortcutTypeList.map((shortcutType) => (<Radio key={shortcutType} value={shortcutType}>{shortcutTypeTitleMap[shortcutType]}</Radio>))
        }
      </Radio.Group>
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit">
        确认
      </Button>
    </Form.Item>
  </Form>
}

const App = () => {
  const dispatch = useDispatch<Dispatch<SyncAction>>()
  /**
   * 当前 id
   */
  const id = useSearchParam("id") || "root"
  const shortcutEditor = useSelector<State, State["shortcutEditor"]>((state) => state.shortcutEditor)
  const [shortcuts, setShortcuts] = useState<string[]>([])
  const editingId = useMemo(() => shortcutEditor.editing?.id, [shortcutEditor.editing])

  // 数据初始化
  useEffect(() => {
    // window.utools.onPluginReady(() => {
    //   const { children } = getShortcutData(id)
    //   console.log(children)
    //   setShortcuts(children)
    // })
    const { children } = getShortcutData(id)
    console.log(id, children)
    setShortcuts(children)
    // window.utools.onPluginEnter((_obj) => {
    //   // 有bug, 执行一次命令后, 重新打开配置页时, 配置页白屏, 需要执行一次 resize 才会出现内容
    //   window.utools.setExpendHeight(600)
    //   const obj = _obj as PayloadOf<"over">
    //   // if (obj.type === "over" && obj.payload && activeAction) {
    //   //   window.handleInput(obj.payload, activeAction.template, activeAction.actionType)
    //   // }
    //   console.log(obj)
    // })
  }, [id])

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

  return <div className={Styles.wrapper} onContextMenu={geneOnContextMenu(dispatch, (Date.now() + Math.random()).toString())}>
    {
      shortcuts.map((shortcutId) => (<Shortcut
        key={shortcutId}
        active={shortcutEditor.selected?.id === shortcutId}
        shortcutId={shortcutId}
      />))
    }
    {
      shortcutEditor.contextMenu && <ContextMenuFor {...shortcutEditor.contextMenu} />
    }
    <Modal
      visible={editingId !== undefined}
      title={editingId ? "编辑" : "新建"}
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
      footer={false}
    >
      <EditorFor editingId={editingId} parentId={id} />
    </Modal>
  </div>
}

render(<App />)
