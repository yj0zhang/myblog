const utilsModule = ((Function) => {
  //给Function原型添加myCall
  Function.prototype.myCall = function (ctx) {
    //ctx 是用户传入的要使用的this
    //函数内的this，指向调用myCall的方法
    // 处理ctx，必须是对象，没传的话默认为window
    ctx = ctx ? Object(ctx) : window;
    //把原始函数保存在ctx.rawFn上
    ctx.__rawFn = this;
    const args = [];
    // for (let i = 1; i < arguments.length; i++) {
    //   args.push(arguments[i]);
    // }
    // const res = ctx.__rawFn(...args);
    //不使用解构

    for (let i = 1; i < arguments.length; i++) {
      args.push(`arguments[${i}]`);
    }
    // console.log(args, `ctx.__rawFn(${args})`);
    const res = eval(`ctx.__rawFn(${args})`);
    delete ctx.__rawFn;
    return res;
  };

  Function.prototype.myApply = function (ctx) {
    ctx = ctx ? Object(ctx) : window;
    ctx.__rawFn = this;
    const argsArr = arguments[1] ? arguments[1] : [];
    // const res = ctx.__rawFn(...argsArr); //解构方式
    const args = [];
    for (let i = 0; i < argsArr.length; i++) {
      args.push(`argsArr[${i}]`);
    }
    const res = eval(`ctx.__rawFn(${args})`);
    delete ctx.__rawFn;
    return res;
  };

  Function.prototype.myBindList = {};

  Function.prototype.myBind = function (ctx) {
    const rawFn = this;
    const args = [].slice.call(arguments, 1);
    const retFn = function () {
      const newArgs = args.concat([...arguments]);
      //如果用户使用new retFn实例化执行，this改为实例，否则是ctx
      return rawFn.apply(this instanceof retFn ? new rawFn() : ctx, newArgs);
    };
    //retFn继承原函数的原型(圣杯模式)
    const _tempFn = function () {};
    _tempFn.prototype = rawFn.prototype;
    retFn.prototype = new _tempFn();
    return retFn;
  };

  function myNew() {
    var constructor = [].shift.call(arguments);
    var _this = {};
    _this.__proto__ = constructor.prototype;
    var res = constructor.apply(_this, arguments);

    return typeof res === "object" ? res : _this;
  }
  function isArray(val) {
    return Object.prototype.toString.call(val) === "[object Array]";
  }
  function deepClone(origin) {
    if (origin == undefined || typeof origin !== "object") {
      return origin;
    }
    let target = isArray(origin) ? [] : {};
    for (let k in origin) {
      if (origin.hasOwnProperty(k)) {
        if (typeof origin[k] === "object") {
          target[k] = deepClone(origin[k]);
        } else {
          target[k] = origin[k];
        }
      }
    }
    return target;
  }

  function quickSort(list) {
    if (!list || list.length < 2) {
      return list;
    }
    let baseVal = list[0];
    let leftList = [];
    let rightList = [];
    let equalList = [];
    for (let i = 1; i < list.length; i++) {
      if (list[i] < baseVal) {
        leftList.push(list[i]);
      } else if (list[i] === baseVal) {
        equalList.push(list[i]);
      } else {
        rightList.push(list[i]);
      }
    }
    leftList = quickSort(leftList);
    rightList = quickSort(rightList);
    return leftList.concat([...equalList, baseVal, ...rightList]);
  }

  //触发后，过了time后执行，但重复触发，以最后一次开始计时
  function debounce(cb, time) {
    let timer;
    return function () {
      clearTimeout(timer);
      const ctx = this;
      const args = arguments;
      timer = setTimeout(() => {
        cb.apply(ctx, args);
      }, time);
    };
  }

  //触发了就执行，但固定时间内，只执行一次
  function throttle(cb, time) {
    let timer;
    return function () {
      if (timer) {
        return;
      }
      const ctx = this,
        args = arguments;
      cb.apply(ctx, args);
      timer = setTimeout(() => {
        timer = null;
      }, time);
    };
  }

  return {
    myNew,
    isArray,
    deepClone,
    quickSort,
    debounce,
    throttle,
  };
})(Function);

//ES6模块中自动使用严格模式
// function test() {
//   console.log(this, arguments);
//   return [].slice.call(arguments);
// }
// test.prototype.name = "test";

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

// var t1 = test.myBind({ a: 1 }, "hello");
// t1(" world");
// // var newT1 = new t1(" world");
// // console.log(newT1);

// console.log("-----------------bind");
// var t2 = test.bind({ a: 1 }, "hello");
// t2(" world");
// // var newT2 = new t2(" world");
// // console.log(newT2);

// function C(a, b) {
//   this.a = a;
//   this.b = b;
// }
// C.prototype.add = function () {
//   return this.a + this.b;
// };
// const newC = utilsModule.myNew(C, 1, 2);
// console.log(newC.add());

// console.log(newC);

// console.log(new C(1, 2));

// const a = { a: 2, b: { c: [1, { f: 3 }] } };
// const ac = utilsModule.deepClone(a);
// ac.b.c[1].f = 888;
// console.log(a, ac);
// const b = [1, { a: 1, b: { c: [1, { d: 4 }] } }];
// const bb = utilsModule.deepClone(b);
// bb[1].b.c[1].d = 888;
// console.log(b, bb);

// console.log(utilsModule.quickSort([5, 3, 6, 3, 0, 72, 43, 3, 74, 4, 2]));

export default utilsModule;
