export default function () {
    // unknown和any都是顶级类型
    type keys1 = keyof any;//string | number | symbol
    type keys2 = keyof unknown;//never

    type unionUnknown = unknown | string | true | false;// unknown
    type interUnknown = unknown & string;//string
    // unknown是any的安全类型
    let a: unknown = 1;
    // 如果标识为unknown类型，必须先使用类型保护

    function isNumber(val: unknown): val is number {
        return typeof val === 'number';
    }
    function isString(val: unknown): val is string {
        return typeof val === 'string';
    }
    if (isNumber(a)) {
        a.toFixed;
    } else if (isString(a)) {
        a.charAt;
    }


    // 自己实现常用类型
    // 内置类型 基于条件类型的 Extract Exclude
    //         基于映射的类型 Partial Required Readonly
    //         结构的 Pick Omit Record
    //         基于推断的(extends+infer 也叫模式匹配类型) InstanceType ReturnType Parameters
    type T1 = {
        name: string;
        age: number;
        address: string;
        a: 'a';
    };
    type T2 = {
        name: string;
        gender: number;
        address: number;
    };
    type Compute<T> = {
        [key in keyof T]: T[key]
    };

    type PartialPropsOptional<T extends object, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
    type PP = Compute<PartialPropsOptional<T1, 'name' | 'address'>>;

    type NoDistribution<T> = T & {};
    //判断两个类型是否完全相等，相等返回S，不等返回F
    type isEqual<T, K, S, F> = NoDistribution<T> extends K
        ? NoDistribution<K> extends T
        ? S
        : F
        : F;
    //never与其他类型联合，never就没了
    type x = string | never;
    //拿到类型为K的键值，最后的方括号`[keyof T]`，是按key取类型的值
    type PickKeysByValue<T, K> = {
        [key in keyof T]: isEqual<T[key], K, key, never>;
    }[keyof T];
    type PickString = Pick<T1, PickKeysByValue<T1, string>>;
    type PickNumber = Pick<T1, PickKeysByValue<T1, number>>;
    type OmitString = Omit<T1, PickKeysByValue<T1, string>>;
    {
        //优化
        type PickKeysByValue<T extends object, K> = {
            [key in keyof T as isEqual<T[key], K, key, never>]: T[key];
        };
        type PickNumber = PickKeysByValue<T1, number>;
        type PickString = PickKeysByValue<T1, string>;
    }



    {
        //merge 类型合并
        type T1 = {
            name: string;
            age: number;
            address: string;
        };
        type T2 = {
            name: string;
            gender: number;
            address: number;
        };
        //求两个对象相同key的交集，返回新对象
        type ObjectInter<T extends object, K extends object> = Pick<
            T,
            keyof T & keyof K
        >;
        type x1 = ObjectInter<T1, T2>;
        //求两个对象的差
        type ObjectDiff<T extends object, K extends object> = Omit<T, keyof K>;
        type x2 = ObjectDiff<T1, T2>;

        //合并T1，T2，相同的用T1的
        type OverWrite<T extends object, K extends object> = ObjectDiff<T, K>
            & ObjectDiff<K, T>
            & ObjectInter<T, K>;
        type x3 = Compute<OverWrite<T1, T2>>;

        //合并T1，T2，相同属性的类型变为联合类型
        type MergeType<T, K> = {
            [key in keyof T]: key extends keyof K ? T[key] | K[key] : T[key]
        };
        type MergeWrite<T extends object, K extends object> = ObjectDiff<K, T>
            & MergeType<T, K>;
        type x4 = Compute<MergeWrite<T1, T2>>;
    }

    {
        // 联合类型在赋值时互斥
        interface Man1 {
            fortune: string;
        }
        interface Man2 {
            funny: string;
        }
        interface Man3 {
            foreigh: string;
        }
        type ManType = Man1 | Man2 | Man3;
        //这里现在不互斥，man可以同时有3个类型的所有属性
        let man: ManType = {
            foreigh: '1',
            funny: '1'
        };

        type DiffType<T, U> = {
            [key in Exclude<keyof T, keyof U>]?: never;
        };
        type OrType<T, K> = (DiffType<T, K> & K) | (DiffType<K, T> & T);
        //现在可以互斥了
        let man2: OrType<Man2, OrType<Man1, Man2>> = {
            fortune: '1',
        };
        man2 = {
            funny: '1'
        };
    }
}