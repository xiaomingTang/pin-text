import React, {
  useCallback, useEffect, useMemo,
} from "react"
import {
  Button, Dropdown, Input, List, message, Popover, Space, Switch,
} from "antd"
import {
  CaretDownOutlined, PlusOutlined, QuestionOutlined,
} from "@ant-design/icons"
import { useLocalStorage } from "react-use"

import { render } from "@Src/pages/global"
import { ActionType } from "@Src/@types/preload"
import { PayloadOf } from "@Src/@types/preload/utools-base"

import {
  Action, actionTypeList, ActionTypeSelector, actionTypeTitleMap, defaultActions,
} from "./actions"

import Styles from "./index.module.less"

const App = () => {
  const [actions = defaultActions, setActions] = useLocalStorage("activeAction", defaultActions)
  const [activeIdx = 0, setActiveIdx] = useLocalStorage("activeIdx", -1)

  const activeAction = useMemo(() => actions[activeIdx] || null, [actions, activeIdx])

  const spliceAction = useCallback((start: number, deleteCount: number, ...items: Action[]) => {
    const newActions = [...actions]
    newActions.splice(start, deleteCount, ...items)
    setActions(newActions)
  }, [actions, setActions])

  useEffect(() => {
    const DynamicFeatureName = "dynamic-feature-next:open"
    if (activeAction) {
      const actionTitle = actionTypeTitleMap[activeAction.actionType]
      window.utools.setFeature({
        code: DynamicFeatureName,
        explain: actionTitle,
        cmds: [
          {
            type: "over",
            label: actionTitle,
          },
        ],
      })
    } else {
      window.utools.removeFeature(DynamicFeatureName)
    }
  }, [activeAction])

  useEffect(() => {
    window.utools.onPluginEnter((_obj) => {
      // 有bug, 执行一次命令后, 重新打开配置页时, 配置页白屏, 需要执行一次 resize 才会出现内容
      window.utools.setExpendHeight(600)
      const obj = _obj as PayloadOf<"over">
      if (obj.type === "over" && obj.payload && activeAction) {
        window.handleInput(obj.payload, activeAction.template, activeAction.actionType)
      }
    })
  }, [activeAction])

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
            spliceAction(idx, 1)
            if (idx === activeIdx) {
              setActiveIdx(-1)
            } else if (idx < activeIdx) {
              setActiveIdx(activeIdx - 1)
            }
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
          value={template}
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
