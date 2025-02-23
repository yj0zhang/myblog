import utilsModule from "./libs/utils"; // call apply bind
// import myTypeOf from "./libs/typeOf";
// import myInstanceOf from "./libs/instanceOf";

/**
 * call 第一个参数指定this，第二个参数开始，是函数的参数列表
 *
 */

function C(a, b) {
  this.a = a;
  this.b = b;
}
C.prototype.add = function () {
  return this.a + this.b;
};
const newC = utilsModule.myNew(C, 1, 2);
console.log(newC.add());

console.log(newC);

console.log(new C(1, 2));
