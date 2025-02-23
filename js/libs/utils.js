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
})(Function);

//ES6模块中自动使用严格模式
// function test() {
//   console.log(this, arguments);
//   return [].slice.call(arguments);
// }

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

// const bindTest = test.myBind(
//   {
//     a: 133,
//     b: 2,
//   },
//   "bind",
//   [1]
// );
// const b2 = test.myBind(
//   {
//     a: 44,
//   },
//   "bind",
//   [1]
// );
//bind只执行一次
// bindTest(["bindCall"], 2);
// b2(["bindCall"], 2);

export default utilsModule;
