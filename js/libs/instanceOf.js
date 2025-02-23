const myInstanceOf = (function () {
  function isSymbol(value) {
    return typeof value === "symbol";
  }
  function isPrimeValue(value) {
    if (isSymbol(value)) {
      return true;
    }
    const strType = Object.prototype.toString.call(value);
    const types = ["[object String]", "[object Number]", "[object Boolean]"];
    if (
      types.includes(strType) &&
      (value.toString() === value || value.valueOf() === value)
    ) {
      return true;
    }
  }
  const myInstanceOf = function (instance, constru) {
    if (
      typeof instance === "undefined" ||
      typeof instance === "null" ||
      isPrimeValue(instance)
    ) {
      return false;
    }
    if (typeof constru !== "function") {
      throw `Right-hand side of 'instanceof' is not callable`;
    }
    const consPrototype = constru?.prototype;
    let insProto = instance.__proto__;
    let ret = false;
    while (insProto) {
      if (insProto === consPrototype) {
        ret = true;
        break;
      }
      insProto = insProto.__proto__ || null;
    }
    return ret;
  };
  globalThis.myInstanceOf = myInstanceOf;
})();

class A {}
console.log(new A() instanceof A);
console.log(globalThis.myInstanceOf(new A(), A));

export default myInstanceOf;
