//内置类型

export default function () {

    // 条件类型 if/else 三元表达式
    type StatusCode<T> = T extends 200 | 201 | 204 | 304 ? 'success' : 'fail';
    type IReturnMessage = StatusCode<300>;

    // 类型级别（从小到大）：
    // never -> 字面量类型 -> 基础类型 -> 包装类型 -> any unknown
    type T1 = never extends 'str' ? true : false;
    type T2 = 'str' extends string ? true : false;
    type T3 = string extends String ? true : false;
    type T4 = String extends object ? true : false;
    {
        // {} Object表示任何非null和undefined的值，但Object还包含了Object原型上的方法
        // object表示所有引用类型
    }
    type T5 = object extends any ? true : false;
    type T6 = object extends unknown ? true : false;


    // any自带分发机制，这里any会分为两部分：1+除了1的部份，分别比较，返回true or false
    // 所以T7是boolean
    type T7 = any extends 1 ? true : false;
    //never如果通过泛型传入，只会返回never，所以T9是never
    type T8<T> = T extends 1 ? true : false;
    type T9 = T8<never>;


    // 联合类型的子类型，是联合类型中的某个类型
    interface Fish {
        name: '鱼';
    }
    interface Bird {
        name: '鸟';
    }
    interface Sky {
        name: '天';
    }
    interface Water {
        name: '海';
    }

    // 联合类型（A3）通过泛型传入，并通过extends判断，会通过分发机制，分别判断
    // 前提是泛型泛型需要是裸类型
    // 如果不是裸类型，则不会分发
    // type A1<T extends Fish | Bird> = T extends Fish ? Water : Sky;//裸类型
    // 以下的A1中的泛型，都不是裸类型
    // type A1<T extends Fish | Bird> = T[] extends Fish ? Water : Sky;//裸类型
    type A1<T extends Fish | Bird> = T & {} extends Fish ? Water : Sky;//裸类型
    type A2 = A1<Fish>;
    type A3 = A1<Fish | Bird>;

    type NoDistribute<T> = T & {};
    type UnionAssets<T, K> = NoDistribute<T> extends K ? true : false;
    type U1 = UnionAssets<1 | 2, 1 | 2 | 3>;
    type U2 = UnionAssets<1 | 2 | 3, 1 | 2>;

    //判断两个类型是否一致
    type isEqual<T, K, S, F> = NoDistribute<T> extends K ? NoDistribute<K> extends T ? S : F : F;
    type E1 = isEqual<1 | 2, 1 | 2, true, false>;


    type FormatVal<T> = T extends string ? string : T extends number ? number : never;
    function sum<T extends string | number>(a: T, b: T): FormatVal<T> {
        return a + (b as any);
    }
    let r1 = sum(1, 2);
    let r2 = sum('a', 'b');



    //内置类型中有很多类型是基于条件类型的
    //Extract Exclude NoNullable...
    //抽离相同的类型
    type Extract<T, U> = T extends U ? T : never;
    type Exclude<T, U> = T extends U ? never : T;
    type ExtractRes = Extract<1 | 2 | 3 | 4, 1 | 2>;
    type ExcludeRes = Exclude<1 | 2 | 3 | 4, 1 | 2>;

    type NoNullable<T> = T extends null | undefined ? never : T;
    // type NoNullable<T> = T & {};
    const ele = document.getElementById('app');
    type Ele = NoNullable<typeof ele>;
}