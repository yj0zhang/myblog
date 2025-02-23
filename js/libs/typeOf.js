const myTypeOf = (function () {
  const myTypeOf = function (value) {
    /**
     * '[object Undefined]'
     * '[object Symbol]'
     * '[object Function]'
     * '[object String]'
     * '[object Number]'
     * '[object Boolean]'
     * '[object Null]'
     * '[object Object]'
     * '[object Array]'
     * '[object Date]'
     * '[object RegExp]'
     */
    const strType = Object.prototype.toString.call(value);
    const objectTypes = [
      "[object Null]",
      "[object Object]",
      "[object Array]",
      "[object Date]",
      "[object RegExp]",
    ];
    if (objectTypes.includes(strType)) {
      return "object";
    }
    if (strType === "[object String]") {
      return value.toString() === value ? "string" : "object";
    } else if (strType === "[object Boolean]") {
      return value.valueOf() === value ? "boolean" : "object";
    } else if (strType === "[object Number]") {
      return value.valueOf() === value ? "number" : "object";
    } else {
      return strType.match(/\s(.*?)]/)[1].toLowerCase();
    }
  };
  globalThis.myTypeOf = myTypeOf;

  const str = "";
  const num = 1;
  const primeTrue = true;
  const symb = Symbol();
  const f = function () {};
  const objTrue = new Boolean(1);
  const objStr = new String("");
  const objNum = new Number("");
  const obj = {};
  const arr = [];
  const date = new Date();
  const reg = RegExp(/\*/);

  console.log(
    "typeof undefined:",
    typeof undefined,
    "\n",
    "__myTypeOf:",
    globalThis.myTypeOf(undefined)
  );
  console.log(
    "typeof null:",
    typeof null,
    "\n",
    "__myTypeOf:",
    globalThis.myTypeOf(null)
  );
  console.log(
    "typeof primeString:",
    typeof str,
    "\n",
    "__myTypeOf:",
    globalThis.myTypeOf(str)
  );
  console.log(
    "typeof primeNum:",
    typeof num,
    "\n",
    "__myTypeOf:",
    globalThis.myTypeOf(num)
  );
  console.log(
    "typeof primeTrue:",
    typeof primeTrue,
    "\n",
    "__myTypeOf:",
    globalThis.myTypeOf(primeTrue)
  );
  console.log(
    "typeof Symbol:",
    typeof symb,
    "\n",
    "__myTypeOf:",
    globalThis.myTypeOf(symb)
  );
  console.log(
    "typeof function:",
    typeof f,
    "\n",
    "__myTypeOf:",
    globalThis.myTypeOf(f)
  );
  console.log(
    "typeof objTrue:",
    typeof objTrue,
    "\n",
    "__myTypeOf:",
    globalThis.myTypeOf(objTrue)
  );
  console.log(
    "typeof objStr:",
    typeof objStr,
    "\n",
    "__myTypeOf:",
    globalThis.myTypeOf(objStr)
  );
  console.log(
    "typeof objNum:",
    typeof objNum,
    "\n",
    "__myTypeOf:",
    globalThis.myTypeOf(objNum)
  );
  console.log(
    "typeof obj:",
    typeof obj,
    "\n",
    "__myTypeOf:",
    globalThis.myTypeOf(obj)
  );
  console.log(
    "typeof arr:",
    typeof arr,
    "\n",
    "__myTypeOf:",
    globalThis.myTypeOf(arr)
  );
  console.log(
    "typeof date:",
    typeof date,
    "\n",
    "__myTypeOf:",
    globalThis.myTypeOf(date)
  );
  console.log(
    "typeof reg:",
    typeof reg,
    "\n",
    "__myTypeOf:",
    globalThis.myTypeOf(reg)
  );
})();
export default myTypeOf;
