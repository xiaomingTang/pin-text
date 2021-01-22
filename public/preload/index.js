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

window.handleInput = function handleInput(inputVar, outputTemp, type, options) {
  const output = convertInput(inputVar, outputTemp)
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
  utools.outPlugin()
}

window.copyText = utools.copyText

window.showNotification = utools.showNotification
