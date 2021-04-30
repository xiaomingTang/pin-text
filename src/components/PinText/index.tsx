import React, {
  useCallback, useEffect, useMemo, useState,
} from "react"
import {
  Button, Input, message,
} from "antd"
import { throttle } from "throttle-debounce"

import { joinSpace } from "@Src/utils"

import Styles from "./index.module.less"

export interface PinTextProps {
  text: string;
}

export default function PinText({ text: initText = "" }: PinTextProps) {
  const [expanded, setExpanded] = useState(false)
  const [text, setText] = useState("")

  useEffect(() => {
    setText(initText)
  }, [initText])

  const throttledSetText = useMemo(() => throttle(500, setText), [])

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev)
  }, [])

  const onInputChange = useCallback(({
    target: { value = "" },
  }: React.ChangeEvent<HTMLTextAreaElement>) => {
    throttledSetText(value)
  }, [throttledSetText])

  return <div className={joinSpace(Styles.wrapper, expanded ? Styles.expanded : Styles.collapsed)}>
    <Button
      className={joinSpace("unselectable", Styles.startBtn)}
      type={expanded ? "primary" : "default"}
      onClick={toggleExpanded}
    >
      {expanded ? "已展开" : "已折叠"}
    </Button>
    {
      expanded
        ? <Input.TextArea
          className={joinSpace(Styles.textWrapper, Styles.expanded)}
          autoSize={{
            maxRows: 20,
          }}
          defaultValue={text}
          onChange={onInputChange}
          spellCheck={false}
        />
        : <div className={joinSpace(Styles.textWrapper, Styles.collapsed)}>
          {text.trim()}
        </div>
    }
    <Button className={joinSpace("unselectable", Styles.endBtn)} type="primary" onClick={() => {
      try {
        if (window.copyText(text)) {
          message.success("成功复制到剪贴板", 0.5)
        } else {
          message.error("复制失败: 未知原因, 可能是权限不足", 1.5)
        }
      } catch (err) {
        message.error(`复制失败: ${err?.message}`, 3)
      }
    }}>
      点击复制
    </Button>
  </div>
}
