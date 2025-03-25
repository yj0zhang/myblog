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

    const typeAsserts = function () {
        // 断言
        let strOrNum;
        // 在使用联合类型的时候，通常会先赋值，再使用
        // strOrNum = 1;
        // strOrNum.toFixed();
        // strOrNum = '1';
        // strOrNum.charCodeAt(0);
        // 对于某些情况下，变量的值已确定，可以使用断言，同时使用非空断言!，此时ts不会进行类型检测了
        strOrNum.toFixed(1);
        strOrNum.toFixed(1);
        let ele = document.getElementById('app');
        ele.style.background = '';
    };

    function functionType () {
        // 参数this问题
        // 尽量不采用this来作为函数的上下文，this的缺陷就是类型推导问题
        // 如果想限制this类型，那么需要手动置顶this类型
        const person = { name: 'z', age: 30 };
        // this放在第一个参数，定义类型；不是形参
        function getValue(key) {
            return this[key];
        }
        getValue.call(person, 'name');
        // 参数不定项
        function sum6(...args) {
            return args.reduce((memo, cur) => (memo += cur, memo), 0);
        }
        sum6(1, 2, 3);
        //上面的声明仅仅是类型重载
        function toArray(value) {
            if (typeof value === 'number') {
                return value.toString().split('').map(Number);
            }
            if (typeof value === 'string') {
                return value.split('');
            }
            return [];
        }
        toArray('aaa');
        toArray(111);
    }

    function classType () {
        class Animal {
            constructor(name) {
                this.name = name;
                //实例属性
                this.name = name;
            }
            // 原型方法 这里的void表示不关心返回值
            changeName(value, age) {
                this.name = value;
            }
            // 原型属性，需要通过访问器实现
            get aliasName() {
                return '$' + this.name;
            }
            set aliasName(name) {
                this.name = name;
            }
            static getA() {
                // 静态方法中的this，指的是类本身
                return this.a;
            }
        }
        //静态属性
        Animal.a = 1;
        // super在构造函数中，指向父类；在原型方法中，指向的是父类的原型
        class Cat extends Animal {
            constructor(name, age) {
                super(name); //Animal.call(this)
                this.age = age;
                this.age = age;
                // this.name = '3'
            }
            // 重写父类的方法，参数类型要兼容，保证子类调用父类的时候参数一致
            changeName(value) {
                super.changeName(value, 10);
                // this.name = value;
                return 'a';
            }
        }
        const tom = new Cat('tom', 3);
        tom.changeName('jerry');
        // private constructor可以在单例模式中使用，不在外部使用new关键字创建实例：
        class Singleton {
            constructor() { }
            ;
            static getInstance() {
                return this.instance;
            }
        }
        Singleton.instance = new Singleton();
        Singleton.getInstance();
    }

    baseType();
    typeAsserts();
    functionType();
    classType();

})();
//# sourceMappingURL=bundle.js.map
