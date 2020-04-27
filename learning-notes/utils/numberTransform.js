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
  if (numberInterDigit < interDigit) {
    throw Error(`interDigit ${interDigit} must be less or equal than digit of number ${number}`)
  }
  const decimal = number.toString().split(".")[1] || ""
 
  if (numberInterDigit <= interDigit) {
    return integer + getDecimal(decimal, decimalDigit)
  } else {
    const unit = ["", "十", "百", "千", "万", "十万", "百万", "千万", "亿", "十亿", "百亿", "千亿"]
    const fUnit = unit[numberInterDigit - interDigit]
    if (typeof fUnit !== "string") {
      throw Error(`${number} is too large`)
    }
    const remainNum = integer.toString().substr(interDigit) + decimal
    return integer.toString().substr(0, interDigit) + getDecimal(remainNum, decimalDigit) + fUnit
  }
}


console.log(transformNumber(3.4, 1, 2)) //3.4
console.log(transformNumber(31.4, 2, 2)) //31.4
console.log(transformNumber(311.4, 2, 2)) //31.14十
console.log(transformNumber(3111.4, 2, 2)) //31.11百
console.log(transformNumber(31111.4, 2, 2)) //31.11千
console.log(transformNumber(311111.4, 2, 2)) //31.11万
console.log(transformNumber(3111111.4, 2, 2)) //31.11十万
console.log(transformNumber(31111111.4, 2, 2)) //31.11百万
console.log(transformNumber(311111111.4, 2, 2)) //31.11千万
console.log(transformNumber(315555111.4, 2, 2)) //31.56千万
