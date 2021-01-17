import React, { useCallback, useState } from "react"
import { Button, message } from "antd"
import { joinSpace } from "@Src/utils"

import Styles from "./index.module.less"

export interface PinTextProps {
  text: string;
}

export default function PinText({ text }: PinTextProps) {
  const [expanded, setExpanded] = useState(false)

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev)
  }, [])

  return <div className={joinSpace(Styles.wrapper, expanded ? Styles.expanded : Styles.collapsed)}>
    <Button className={joinSpace("unselectable", Styles.startBtn)} type={expanded ? "primary" : "default"} onClick={toggleExpanded}>{expanded ? "已展开" : "已折叠"}</Button>
    {
      expanded ? <pre className={joinSpace(Styles.text, Styles.expanded)}>{text}</pre> : <div className={joinSpace(Styles.text, Styles.collapsed)}>{text.trim()}</div>
    }
    <Button className={joinSpace("unselectable", Styles.endBtn)} type="primary" onClick={() => {
      try {
        if (window.copyText(text)) {
          message.success("成功复制到剪贴板", 1.5)
        } else {
          message.error("复制失败: 未知原因, 可能是权限不足", 1.5)
        }
      } catch (err) {
        message.error(`复制失败: ${err?.message}`)
      }
    }}>copy</Button>
  </div>
}
