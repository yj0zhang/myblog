
export default function () {
    // 接口和泛型
    // 接口： 描述数据的结构或形状，定义好结构，再去实现

    // type 和 interface 区别
    // 一般情况下，描述对象，类，用interface更多
    // type可以快速声明类型： 联合类型，工具类型 只能用type
    // type 不能重名，interface可以
    // 开发中，能用type就用type，复杂类型采用type

    // 接口可以描述对象结构
    interface IPerson {
        username: 'abc',//字面量类型
        age: number,
    }
    let person: IPerson = {
        username: 'abc',
        age: 20
    };
    interface IDriver extends IPerson {
        driveAge: number;
    }
    let driver: IDriver = {
        username: 'abc',
        age: 30,
        driveAge: 4
    };
    // 赋值的时候，会产生兼容性，子类型可以赋值给父类型
    person = driver;
    // driver = person;//反过来不行


    // 接口可以描述函数
    interface ICounter {
        (): number;
        count: number;
    }
    // 函数有类型定义的时候，只能用const声明，表示此值不能被修改
    const counter: ICounter = () => {
        return counter.count++;
    };
    counter.count = 0;


    interface IVeg {
        readonly name: string;//readonly 只读属性
        taste: string;
        size: number;
    }
    // 同名的接口，会合并，在自定义类型的时候会使用
    // interface IVeg {
    //     color?: string;
    // }
    // 或者扩展一个新类型：
    interface IVegetable extends IVeg {
        color?: string;
        [key: string | number | symbol]: any;
    }
    const veg: IVegetable = {
        name: '西红柿',
        taste: '甜',
        size: 50,
        a: 1,
        0: 1,
        [Symbol()]: 'a'
    };
    interface IArray {
        [key: number]: any;
    }
    let arr1: IArray = [1, '2'];
    let arr2: IArray = { 1: 'a' };

    //接口组合
    interface ResData {
        username: string;
        token: string;
    }
    interface ReturnVal {
        code: number;
        data: ResData;
    }

    //通过索引访问符，来获取内部类型
    type ICode = ReturnVal['code'];//取 值的类型
    type IUsername = ReturnVal['data']['username'];//取 值的类型
    type values = ReturnVal[keyof ReturnVal];//获取所有 值的类型
    type keys = keyof ReturnVal;//获取类型的所有key
    let k1: keys = 'code';
    let k2: values = 1;
    let k3: values = {
        username: 'a',
        token: 'a'
    };



    // 接口可以被实现，通过类实现
    // 接口可以继承多个接口(extends)：interface a extends IB,IC
    // 类可以实现多个接口
    interface Speakable {
        // speak(): void;// 这是原型方法
        speak: () => void;// 这是实例方法
    }
    interface SpeakChinese {
        speakChinese(): void;
    }
    class Speaker implements Speakable, SpeakChinese {
        public speak: () => void;
        constructor() {
            this.speak = () => null;
        }
        speakChinese(): void {
            throw new Error("Method not implemented.");
        }
    }


    // 如何表示函数的参数是一个类
    class Dog {
        public a: number = 1;
    }
    class Cat {
        public a: number = 1;
        public b: number = 1;
    }
    {
        // 类类型，不能描述类本身，描述的是实例
        // 类的类型，需要通过typeof来取
        function createInstance(clazz: typeof Dog) {
            return new clazz();
        }
        const instance1 = createInstance(Dog);
        // instance2也是Dog类型（鸭子类型检测）
        const instance2 = createInstance(Cat);
    }
    {
        // 泛型，函数的形式参数，刚开始类型不确定，使用的时候才能确定
        // 描述一个构造函数，构造函数返回的类型是T： { new (): T }
        // interface IClazz<T> {
        //     new(): T
        // }
        // 用type描述构造函数
        type IClazz<T> = new () => T;
        // type IClazz<T> = new (name: string) => T
        function createInstance<T>(clazz: IClazz<T>) {
            return new clazz();
        }
        // function createInstance<T>(clazz: new () => T) {
        //     return new clazz()
        // }
        // const instance1 = createInstance<Dog>(Dog);
        // const instance2 = createInstance<Cat>(Cat);
        // 可以省略，ts会推导
        const instance1 = createInstance(Dog);
        const instance2 = createInstance(Cat);
    }





    // ------------------- generic 泛型 -------------------
    // 泛型可以用于 函数、接口、类、type
    // 刚开始类型不确定，使用的时候才能确定

    // const createArr = <T>(times: number, val: T) => {

    // }
    function createArr<T>(times: number, val: T) {
        return Array.from({ length: times }).fill(val) as T[];
    }

    let arr3 = createArr<string>(2, 'a');
    let arr4 = createArr<number>(2, 1);

    //值的交换
    function swap<T, K>(tuple: [T, K]): [K, T] {
        return [tuple[1], tuple[0]];
    }
    const r = swap([1, 'a']);

    // IForEach<T> 表示使用接口的时候确定类型
    // <T>():void 表示使用这个函数的时候确定类型
    // interface IForEach {
    //     <T>(arr: T[], cb: (val: T) => void): void
    // }
    // type方式
    type ICallback<T> = (val: T) => void;
    type IForEach = <T>(arr: T[], cb: ICallback<T>) => void;
    const forEach: IForEach = (arr, cb) => {
        for (let i = 0; i < arr.length; i++) {
            cb(arr[i]);
        }
    };
    forEach(['a', 2, 3], function (val) {
        console.log(val);
    });

    {
        // 泛型的默认值
        interface APIResponse<T = any> {
            error: number;
            message?: string;
            data: T;
        }
        interface LoginInfo {
            username: string;
            token: string;
        }
        function login(): APIResponse<LoginInfo> {
            return {
                error: 0,
                message: 'success',
                data: {
                    username: 'a',
                    token: 'a'
                }
            };
        }
        let r = login();


        // 联合类型中的泛型
        type IUnion<T = boolean> = T | string | number;
        type t1 = IUnion;
        type t2 = IUnion<string[] | number[]>;

        //泛型是用户传递的类型，但在使用泛型的时候，都要添加泛型约束
        function getVal<T>(val: T): T {
            // return val + val;//在使用泛型的时候，不能直接做运算，因为无法保证泛型的结果
            return val;
        }
        getVal(1);


        //如何限制调用getVal时，只能传string或number？
        //extends约束T需要是string | number的子类型
        function getVal1<T extends string | number>(val: T): T {
            // return val + val;//在使用泛型的时候，不能直接做运算，因为无法保证泛型的结果
            return val;
        }
        //getVal1限制泛型只能是string | number
        // getVal1(true)
        getVal1(1);
    }

    {
        //类中的泛型
        //求一个数组中的最大值
        class MyList<T extends string | number> {
            private arr: T[] = [];
            add(val: T) {
                this.arr.push(val);
            };
            getMax(): T {
                //业务逻辑
                return this.arr[0];
            }
        }

        const list = new MyList<number>;
        list.add(1);
        list.add(100);
        list.add(200);
        list.getMax();



        //泛型可以使用的场景： 函数，对象，类
        //泛型有约束和默认值
    }
}
