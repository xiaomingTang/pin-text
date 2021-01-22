import React, {
  useCallback, useEffect, useMemo, useState,
} from "react"
import {
  Button, Card, Col, Collapse, Dropdown, Input, List, Menu, Modal, Popover, Radio, Row, Space, Switch, Tooltip,
} from "antd"
import {
  CaretDownOutlined, PlusOutlined, QuestionOutlined,
} from "@ant-design/icons"
import { MenuProps } from "antd/lib/menu"
import { useLocalStorage } from "react-use"

import { render } from "@Src/pages/global"
import { ActionType } from "@Src/@types/preload"
import { ColProps } from "antd/lib/col"
import { joinSpace } from "@Src/utils"

import Styles from "./index.module.less"

window.convertInput = function convertInput(inputVar, outputTemp) {
  return outputTemp.replace(/{(INPUT|ENCODE_URI_INPUT|DECODE_URI_INPUT|ENCODE_URI_COMPONENT_INPUT|DECODE_URI_COMPONENT_INPUT)}/g, (match, p1) => {
    switch (p1) {
    case "INPUT":
      return inputVar
    case "ENCODE_URI_INPUT":
      return encodeURI(inputVar)
    case "DECODE_URI_INPUT":
      return decodeURI(inputVar)
    case "ENCODE_URI_COMPONENT_INPUT":
      return encodeURIComponent(inputVar)
    case "DECODE_URI_COMPONENT_INPUT":
      return decodeURIComponent(inputVar)
    default:
      return match
    }
  })
}
interface Action {
  actionType: ActionType;
  template: string;
}

const actionTypeTitleMap: { [key in ActionType]: string } = {
  COPY_TO_CLIPBOARD: "复制到剪贴板",
  OPEN_FILE: "打开文件(系统默认方式)",
  OPEN_FILE_IN_EXPLORER: "打开文件(资源管理器)",
  OPEN_DIR: "打开文件夹",
  OPEN_URL: "打开超链接",
}

const actionTypeList: ActionType[] = [
  "COPY_TO_CLIPBOARD",
  "OPEN_FILE",
  "OPEN_FILE_IN_EXPLORER",
  "OPEN_DIR",
  "OPEN_URL",
]

const defaultActions: Action[] = []

function ActionTypeSelector({
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

const App = () => {
  const [actions = defaultActions, setActions] = useLocalStorage("activeAction", defaultActions)
  const [activeIdx = 0, setActiveIdx] = useLocalStorage("activeIdx", -1)

  const spliceAction = useCallback((start: number, deleteCount: number, ...items: Action[]) => {
    const newActions = [...actions]
    newActions.splice(start, deleteCount, ...items)
    setActions(newActions)
  }, [actions, setActions])

  // useEffect(() => {
  //   window.utools.onPluginEnter((_obj) => {
  //     // if (_obj.type === "text" && _obj.payload === "配置下一步") {

  //     // }
  //   })
  // }, [])

  return <div className={Styles.wrapper}>
    <List
      dataSource={actions}
      renderItem={({ actionType, template }, idx) => (<div className={Styles.actionListItem}>
        <Space wrap>
          <span>{idx + 1}.</span>
          <Switch checkedChildren="启用" unCheckedChildren="关闭" checked={idx === activeIdx} onChange={(checked) => {
            if (checked) {
              setActiveIdx(idx)
            } else {
              setActiveIdx(-1)
            }
          }} />
          <Dropdown
            trigger={["click"]}
            overlay={<ActionTypeSelector activeType={actionType} onClick={({ key }) => {
              const newActionType: ActionType = actionTypeList.includes(key as ActionType) ? key as ActionType : "COPY_TO_CLIPBOARD"
              spliceAction(idx, 1, {
                actionType: newActionType,
                template,
              })
            }} />}
          >
            <Button title="动作">
              {actionTypeTitleMap[actionType]}
              <CaretDownOutlined />
            </Button>
          </Dropdown>
          <Button danger onClick={() => {
            if (idx === activeIdx) {
              setActiveIdx(-1)
            } else if (idx < activeIdx) {
              setActiveIdx(activeIdx - 1)
            }
            spliceAction(idx, 1)
          }}>
            移除
          </Button>
          <Popover title={<List header={<strong>内置变量</strong>}>
            <List.Item>{"{INPUT}: 输入文本"}</List.Item>
            <List.Item>以下变量为对 输入文本 执行相关函数后的结果:</List.Item>
            <List.Item>{"{ENCODE_URI_INPUT}"}</List.Item>
            <List.Item>{"{DECODE_URI_INPUT}"}</List.Item>
            <List.Item>{"{ENCODE_URI_COMPONENT_INPUT}"}</List.Item>
            <List.Item>{"{DECODE_URI_COMPONENT_INPUT}"}</List.Item>
          </List>} trigger={["click"]}>
            <Button shape="circle" icon={<QuestionOutlined />} />
          </Popover>
        </Space>
        <Input.TextArea
          placeholder="请输入转换模板"
          className={Styles.textArea}
          defaultValue={template}
          onChange={(e) => {
            const target = e.target as HTMLTextAreaElement
            spliceAction(idx, 1, {
              actionType,
              template: target.value || "",
            })
          }}
        />
      </div>)}
    />
    <Button type="primary" onClick={() => {
      setActions([
        ...actions,
        {
          actionType: "COPY_TO_CLIPBOARD",
          template: "{INPUT}",
        },
      ])
    }}>
      <PlusOutlined />
      添加动作
    </Button>
  </div>
}

render(<App />)
