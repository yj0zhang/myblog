import utilsModule from "./libs/utils"; // call apply bind
// import myTypeOf from "./libs/typeOf";
// import myInstanceOf from "./libs/instanceOf";

/**
 * call 第一个参数指定this，第二个参数开始，是函数的参数列表
 *
 */
function test() {
  this.c = 0;
  console.log(this, arguments);
}
test.prototype.name = "test";

var t1 = test.myBind({ a: 1 }, "hello");
t1(" world");
// var newT1 = new t1(" world");
// console.log(newT1);

console.log("-----------------bind");
var t2 = test.bind({ a: 1 }, "hello");
t2(" world");
// var newT2 = new t2(" world");
// console.log(newT2);
