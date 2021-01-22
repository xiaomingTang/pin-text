/**
 * 将输入字符串, 按照模板, 替换掉内置变量后, 输出
 * @param {string} inputStr 输入字符串
 * @param {string} outputTemp 输出模板
 */
window.convertInput = function convertInput(inputStr, outputTemp) {
  return outputTemp.replace(/{(INPUT|ENCODE_URI_INPUT|DECODE_URI_INPUT|ENCODE_URI_COMPONENT_INPUT|DECODE_URI_COMPONENT_INPUT)}/g, (match, p1) => {
    switch (p1) {
    case "INPUT":
      return inputStr
    case "ENCODE_URI_INPUT":
      return encodeURI(inputStr)
    case "DECODE_URI_INPUT":
      return decodeURI(inputStr)
    case "ENCODE_URI_COMPONENT_INPUT":
      return encodeURIComponent(inputStr)
    case "DECODE_URI_COMPONENT_INPUT":
      return decodeURIComponent(inputStr)
    default:
      return match
    }
  })
}

/**
 * 将输入字符串, 按照模板, 替换掉内置变量后, 执行相应动作
 * @param {string} inputStr 输入字符串, 参照 window.convertInput 参数 inputStr
 * @param {string} outputTemp 输出模板, 参照 window.convertInput 参数 outputTemp
 * @param {string} type 执行的动作类型, 可取值见代码中的 switch case
 * @param {string} options 可能用到的更多配置, 目前没用到
 */
window.handleInput = function handleInput(inputStr, outputTemp, type, options) {
  const output = convertInput(inputStr, outputTemp)
  switch (type) {
  case "OPEN_FILE":
    utools.shellOpenPath(output)
    break
  case "OPEN_FILE_IN_EXPLORER":
    utools.shellShowItemInFolder(output)
    break
  case "OPEN_DIR":
    utools.shellOpenPath(output)
    break
  case "OPEN_URL":
    utools.shellOpenExternal(output)
    break
  case "COPY_TO_CLIPBOARD":
    utools.copyText(output)
    break
  default:
    break
  }
  // utools.hideMainWindow()
  utools.outPlugin()
}
