export default function () {
    // 类型兼容性 有两种情况
    // 1.子 extends 父
    // 2.结构角度
    let str: string = 'a';//字面量赋值给基础类型（子类型赋值给父类型）
    let obj!: { toString: () => string; };
    obj = str;//从结构角度，str可以赋值给obj


    let sum1 = (a: number, b: number) => a + b;
    let sum2 = (a: number) => a;
    type x = typeof sum2 extends typeof sum2 ? true : false;// true
    sum1 = sum2;

    class A {
        a = 1;
        private b = 9;
    }
    class B {
        // private b = 9;
    }
    // private和protected的属性，一定不一样，不能互相赋值
    const b: B = new A();


    // 给基本类型做区分
    type WithType<T, K> = T & { readonly _tag: K; };
    type BTC = WithType<number, "BTC">;
    type USDT = WithType<number, "USDT">;
    let c1 = 100 as BTC;
    let c2 = 100 as USDT;
    // c1 = c2;


    // 逆变
    // 如果两个函数的参数是父与子的关系，那么函数的关系是反过来的，叫逆变
    // 例如：如果类型 A 是类型 B 的子类型，那么接受 B 的函数就是接受 A 的函数的子类型
    class Parent {
        car() { }
    }
    class Child extends Parent {
        house() { }
    }
    class Grandson extends Child {
        sleep() { }
    }
    // 安全性考虑
    // 1）内部调用函数的时候，可以传递Child和Grandson，但是在使用属性时，只能调用child有的属性
    // 2）函数的返回值，需要返回子类，因为内部代码在访问属性的时候要保证可以访问到
    function fn(cb: (ctr: Child) => Child) {
        let r = cb(new Grandson());
        r.house;
    }
    // 参数child不能是Grandson类型，返回值不能是Parent类型
    fn((child: Parent): Child => {
        return new Grandson();
    });
    //函数参数
    type Arg<T> = (arg: T) => void;
    type ArgReturn = Arg<Parent> extends Arg<Child> ? true : false;//基于函数参数的逆变
    //函数返回值
    type Return<T> = (arg: any) => T;
    type ReturnReturn = Return<Grandson> extends Return<Child> ? true : false;//返回值是协变

    // 协变
    // 如果A是B的子，那么T<A>也是T<B>的子
    {
        class B { };
        class A {
            a = 1;
        }
        type x1 = A extends B ? true : false;
        type x2 = A[] extends B[] ? true : false;
    }

    // 逆变带来的问题
    interface MyArray<T> {
        // 这两种的区别：是否进行逆变检测
        concat(...args: T[]): T[];//这种写法不进行逆变检测，所以在描述对象的方法时，全部采用这种方式
        // concat: (...args: T[]) => T[];
    };

    let parentArr!: MyArray<Parent>;
    let childArr!: MyArray<Child>;
    // 由于concat: (...args: T[]) => T[];函数参数逆变，这里不能赋值
    // 需要换成concat(...args: T[]): T[]; 就不进行逆变检测了
    parentArr = childArr;
    // childArr = parentArr;



    //其他的兼容性
    enum E1 { }
    enum E2 { }
    let e1: E1;
    let e2: E2;
    // e1 = e2;//两个枚举之间 不能兼容


    {
        // 泛型兼容性，如果生成的结果一致 类型就兼容
        type II<T> = { name: T; };
        type x1 = II<string> extends II<string> ? true : false;
        type x2 = II<string> extends II<number> ? true : false;
    }


    // 对象的兼容性，子可以赋值给父
    // 类型层级兼容性 never -> 字面量 -> 基础类型 -> 包装类型 -> any / unknown

}