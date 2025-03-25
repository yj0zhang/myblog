(function () {
    'use strict';

    const baseType = function () {
        //基本类型：string number boolean
        const name = 'zz';
        const age = 20;
        // gender = 1; //gender被推导为string类型，此处类型不对
        console.log(name, age);
        // arr3.push(true);//报类型错误
        //元组 tuple
        //元组与数组的区别是，元组限制了特定位置的类型，顺序、位置和数量都必须与类型定义一致
        let tuple1 = ['1', 1];
        // let tuple2: [string, number] = ['1'];//数量不对
        // let tuple3: [string, number] = [2, 1];//类型不对
        //可以增加string, number类型的元素，但是访问时会报错
        tuple1.push(2);
        // tuple1[2];//Tuple type '[string, number]' of length '2' has no element at index '2'
        console.log('tuple', tuple1);
        // enum 枚举，自带类型的对象，维护一组常量
        // 约定一组格式：状态码 权限 数据格式 标志位
        // 枚举内的值，默认从0开始递增；可以赋予其他值，后面的变量值默认是上一个值加1
        // （异构枚举）如果上一个值不是数字，那需要重新给当前变量初始化一个值
        let STATUS1;
        (function (STATUS1) {
            STATUS1[STATUS1["OK"] = 0] = "OK";
            STATUS1[STATUS1["NO_OK"] = 1] = "NO_OK";
        })(STATUS1 || (STATUS1 = {}));
        let STATUS2;
        (function (STATUS2) {
            STATUS2[STATUS2["OK"] = 2] = "OK";
            STATUS2[STATUS2["NO_OK"] = 3] = "NO_OK";
        })(STATUS2 || (STATUS2 = {}));
        let STATUS3;
        (function (STATUS3) {
            STATUS3[STATUS3["OK"] = 0] = "OK";
            STATUS3["NO_OK"] = "no_ok";
            STATUS3[STATUS3["NOT_FOUND"] = 2] = "NOT_FOUND";
        })(STATUS3 || (STATUS3 = {}));
        const r = 0 /* STATUS4['OK'] */;
        console.log(r);
        BigInt(1); //需要把target改为"ES2020"之后，或者添加lib: ["ES2020", "DOM"]，（console.log属于DOM）
    };

    baseType();

})();
//# sourceMappingURL=bundle.js.map
