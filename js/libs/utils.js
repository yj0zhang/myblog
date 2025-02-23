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
})(Function);

export default utilsModule;
