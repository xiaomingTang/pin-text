import React, {
  useEffect, useMemo,
} from "react"

import { PinApp, PinData } from "@Src/utils/pin"
import PinText from "@Src/components/PinText"
import useList from "@Src/utils/useList"
import { render } from "@Src/pages/global"

const App = () => {
  const pinApp = useMemo(() => {
    const url = new URL(window.location.href)
    const pinFlag = url.searchParams.get("pinFlag")
    if (!pinFlag) {
      return null
    }
    return new PinApp(pinFlag)
  }, [])

  const [pinDatas, {
    set: setPinDatas,
  }] = useList<PinData>([])

  // 数据初始化
  useEffect(() => {
    if (pinApp) {
      setPinDatas(pinApp.getDatas())
    }
  }, [pinApp, setPinDatas])

  // Esc 退出
  // 退出时清理 pinApp 信息
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        window.close()
      }
    }

    const onBeforeUnload = () => {
      if (pinApp) {
        pinApp.setDatas([])
      }
    }

    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("beforeunload", onBeforeUnload)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("beforeunload", onBeforeUnload)
    }
  }, [pinApp])

  return <div>
    {
      pinDatas.map(({ type, value }, idx) => {
        switch (type) {
        case "text":
          return <PinText key={idx} text={value} />
        default:
          return <></>
        }
      })
    }
  </div>
}

render(<App />)
