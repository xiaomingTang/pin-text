import React, { useEffect, useState } from "react"

import { PayloadOf } from "@Src/@types/preload/utools-base"
import { PinApp } from "@Src/utils/pin"
import { render } from "@Src/pages/global"
import { Button } from "antd"

const App = () => {
  const [pinPage, setPinPage] = useState("")

  useEffect(() => {
    window.utools.onPluginEnter((_obj) => {
      const pinFlag = new Date().getTime().toString()
      const pinApp = new PinApp(pinFlag)
      const newPinPage = `./pin.html?pinFlag=${pinFlag}`
      setPinPage(newPinPage)

      // 为了使 ts 更好识别类型
      const obj = _obj as PayloadOf<"over">
      if (obj.type === "over" && !!obj.payload) {
        pinApp.push({
          type: "text",
          value: obj.payload,
        })
        window.openPage(newPinPage)
      }
    })
  }, [])

  return <div>
    {
      !pinPage ? "等待 utools 应用加载" : <>
        即将为您加载
        <Button type="link" onClick={() => {
          window.openPage(pinPage)
        }}>【钉住页】{pinPage}--</Button>
      </>
    }
  </div>
}

render(<App />)
