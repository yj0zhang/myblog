import utilsModule from "./libs/utils";
/**
 * call 第一个参数指定this，第二个参数开始，是函数的参数列表
 *
 */
//ES6模块中自动使用严格模式
function test() {
  console.log(this, arguments);
  return [].slice.call(arguments);
}

// test.myCall(
//   {
//     a: 1,
//     b: 2,
//   },
//   "z",
//   "s"
// );

// test.myApply(
//   {
//     a: 1,
//     b: 2,
//   },
//   ["z", [2]]
// );

const bindTest = test.myBind(
  {
    a: 133,
    b: 2,
  },
  "bind",
  [1]
);
const b2 = test.myBind(
  {
    a: 44,
  },
  "bind",
  [1]
);
//bind只执行一次
// bindTest(["bindCall"], 2);
b2(["bindCall"], 2);
