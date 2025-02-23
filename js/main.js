import utilsModule from "./libs/utils";
/**
 * call 第一个参数指定this，第二个参数开始，是函数的参数列表
 *
 */
//ES6模块中自动使用严格模式
function test() {
  console.log(this, arguments);
}

test.myCall(
  {
    a: 1,
    b: 2,
  },
  "z",
  "s"
);
// test(1);
