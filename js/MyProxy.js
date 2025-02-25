// 操作对象的14种方法
// var obj = { a: 1, b: 2 };
//1. 获取原型
// console.log(Object.getPrototypeOf(obj));
//2. 设置原型
// Object.setPrototypeOf(obj, { c: 3, d: 4 });
// console.log(obj);
//3. 是否可扩展
// console.log(Object.isExtensible(obj));
// Object.freeze(obj);//冻结对象，不能在增加、删除、修改属性，可读
// console.log(Object.isExtensible(obj));
// Object.seal(obj);//封闭对象，不能再增加、删除属性，可修改 可读
// console.log(Object.isExtensible(obj));
//4. 获取自身属性
// console.log(Object.getOwnPropertyNames(obj));
// console.log(Object.getOwnPropertyDescriptor(obj, "a"));
// console.log(Object.getOwnPropertyDescriptors(obj));
// console.log(Object.getOwnPropertySymbols(obj));
//5. 禁止扩展对象
// Object.preventExtensions(obj);
// obj.r = 2; //preventExtensions执行后，这里会报错
//6. 拦截对象操作
// var val = 1;
// Object.defineProperty(obj, "f", {
//   get() {
//     return val;
//   },
//   set(v) {
//     val = v;
//   },
//   value: 1,
//   writable: true,
//   enumerable: true,
//   configurable: true,
// });
//7. 判断是否是自身属性
// console.log(obj.hasOwnProperty("a"));
//8. [[GET]]
// console.log("a" in obj);
// console.log(obj.a);
//9 [[SET]]
// obj.a = 2
// obj['b'] = 3
//10. [[Delete]]
// delete obj.a;
//11. [[Enumerate]]
// for (var k in obj) {
//   console.log(obj[k]);
// }
//12. 获取键集合 [[OwnPropertyKeys]]
// console.log(Object.keys(obj));
//13. 调用
// function test() { }
// test()
// test.call/apply
//14. 实例化new
// function Test() {}
// new Test();

//es6的内置方法，是基于以上14种对象操作实现的，包括proxy

import utilsModule from "./libs/utils";
function MyProxy(target, handler) {
  let _target = utilsModule.deepClone(target);
  Object.keys(_target).forEach((key) => {
    Object.defineProperty(_target, key, {
      get() {
        return handler.get && handler.get(target, key);
      },
      set(newVal) {
        handler.set && handler.set(target, key, newVal);
      },
    });
  });
  return _target;
}
let target = {
  a: 1,
  b: 2,
};
let myproxy = new MyProxy(target, {
  get(tar, prop) {
    return "GET:" + prop + " = " + tar[prop];
  },
  set(tar, prop, val) {
    tar[prop] = val;
    console.log("SET:" + prop + " = " + val);
  },
  //   has(tar, prop) {
  //     console.log(tar[prop]);
  //     return Reflect.has(tar, prop);
  //   },
  //   deleteProperty(tar, prop) {
  //     return Reflect.deleteProperty(tar, prop);
  //   },
  // ...
});
console.log(myproxy, myproxy.a);
myproxy.b = 3;
export default MyProxy;
