function getDigit(integer) {
  return integer.toString().length
}
function getDecimal(decimal, digit) {
  if (!decimal) {
    return ""
  }
  if (getDigit(decimal) <= digit) {
    return "." + decimal
  }
  let arr = decimal.toString().split('')
  arr.splice(digit, 0, '.')
  decimal = Math.round(arr.join(''))
  return decimal ? "." + decimal : ""
}
function transformNumber(number, interDigit, decimalDigit) {
  if (isNaN(number)) {
    throw Error(`${number} is not number`)
  }
  interDigit = interDigit > 0 ? interDigit : 1
  const integer = Math.floor(number)
  const numberInterDigit = getDigit(integer)
  const decimal = number.toString().split(".")[1] || ""
 
  if (numberInterDigit <= interDigit) {
    return integer + getDecimal(decimal, decimalDigit)
  } else {
    const unit = ["", "十", "百", "千", "万", "十万", "百万", "千万", "亿", "十亿", "百亿", "千亿"]
    const fUnit = unit[numberInterDigit - 1]
    if (typeof fUnit !== "string") {
      throw Error(`${number} is too large`)
    }
    const remainNum = integer.toString().substr(1) + decimal
    return decimalDigit > 0 ? integer.toString().substr(0, 1) + getDecimal(remainNum, decimalDigit) + fUnit :
      Math.round(integer.toString().substr(0, 1) + getDecimal(remainNum, 2)) + fUnit
  }
}

console.log(transformNumber(3.4, 4, 2)) //3.4
console.log(transformNumber(31.4, 4, 2)) //31.4
console.log(transformNumber(3155.488, 4, 2)) //3155.49
console.log(transformNumber(31554.4, 4, 2)) //3.16万
console.log(transformNumber(3155433.4, 4, 2)) //3.16百万

function transformNumberV2(number, interDigit, decimalDigit) {
  const result = transformNumber(number, interDigit, decimalDigit + 4)

  const unit = result.substr(-1)
  const num = parseFloat(result);
  const pow =  {"十": 1, "百": 2, "千": 3}
  const secondaryPower = parseInt(pow[result.substr(-2, 1)]) || 0
 
  return (num * Math.pow(10, secondaryPower)).toFixed(decimalDigit) + unit
}

console.log(transformNumberV2(3155433.4, 4, 2)) //315.54万
transformNumberV2(31554333000.4, 4, 2) //"315.54亿"
