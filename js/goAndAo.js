// function test() {
//   return a;
//   a = 1;
//   function a() {}
//   var a = 2;
// }
// console.log(test());

// function test() {
//   a = 1;
//   function a() {}
//   var a = 2;
//   return a;
// }
// console.log(test());

/**
 * 函数的活跃对象（activitation object）中的属性有函数的形参和内部声明的变量和函数，其建立步骤如下：
 * 1、找到形参和函数内部变量声明
 * 2、根据实参给形参赋值
 * 3、查找函数中的函数定义，声明和赋值提升
 * 4、执行函数
 */

a = 1;
function test(e) {
  function e() {}
  arguments[0] = 2;
  console.log(e); //2
  if (a) {
    var b = 3;
  }
  var c;
  a = 4;
  var a;
  console.log(b); //undefined
  f = 5;
  console.log(c); //undefined
  console.log(a); //4
}
var a;
test(1);

/**
 * GO {
 *  a: undefined
 *     1,
 *  test: function test,
 *  f: 5
 * }
 * AO {
 *  e: undefined
 *     1
 *     function e() { }
 *     2,
 *  b: undefined,
 *  c: undefined,
 *  a: undefined
 *     4,
 * }
 */
