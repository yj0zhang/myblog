const baseType = function () {
    //基本类型：string number boolean
    const name: string = 'zz';
    const age: number = 20;
    const isMale: boolean = false;


    //类型推导：这里ts会推导类型
    let gender = 'female';
    // gender = 1; //gender被推导为string类型，此处类型不对
    console.log(name, age);


    // 父子关系：子集可以赋值给父集
    let s1: string = 'a';
    // let s2: string = new String('a');//new String是class类型，不能赋值给string类型
    let s3: String = '1';//子集可以赋值给父集
    let s4: String = new String('1');

    //数组
    //强类型中，数组中元素的类型需要一致，但js可以随意
    let arr1: number[] = [1, 2, 3];
    let arr2: Array<number> = [1, 2, 3];//泛型方式
    let arr3: (number | string)[] = [1, '1'];//使用联合类型，实现数组元素可以有多种类型
    // arr3.push(true);//报类型错误


    //元组 tuple
    //元组与数组的区别是，元组限制了特定位置的类型，顺序、位置和数量都必须与类型定义一致
    let tuple1: [string, number] = ['1', 1]
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
    enum STATUS1 {
        'OK',
        'NO_OK',
    };
    enum STATUS2 {
        'OK' = 2,
        'NO_OK',
    };
    enum STATUS3 {
        'OK',
        'NO_OK' = 'no_ok',
        'NOT_FOUND' = 2
    };
    // 上面几个枚举会被编译成对象
    // 但常量枚举不会被编译成对象，rollup在编译时，只会把用到的枚举值直接取出
    // 常量枚举更常用，更加节省空间
    const enum STATUS4 {
        'OK',
        'NO_OK',
        'NOT_FOUND'
    }
    const r = STATUS4['OK'];
    console.log(r);


    // null undefined
    // tsconfig.json中"strictNullChecks"设置为false时，null undefined类型可以赋值给任何类型
    const u: undefined = undefined;
    const n: null = null;



    // void 空类型 一般表示函数的返回值
    // undefined可以赋值给void（undefined是void的子类型）
    function a(): void {
        // return undefined;
        return;
    }


    // never 永远达到不了的地方
    function whileTrue(): never {
        while (true) { }//函数无法达到执行完毕的状态
    }
    function throwError(): never {
        throw Error();//出错无法执行完毕
    }
    //如果if/else条件都走完了，没有遗漏的，后面的类型就是never（完整性保护）
    // 111 [1,1,1]
    // '111' ['1','1','1']
    // true ['t','r','u','e']
    function toArray(val: number | string | boolean) {
        if (typeof val === 'number') {
            return val.toString().split('').map(Number)
        }
        if (typeof val === 'string') {
            return val.split('')
        }
        if (typeof val === 'boolean') {
            return val.toString().split('')
        }
        //如果上述条件没有枚举玩，这里会报错
        const n: never = val;
        // 可以改为一个校验方法
        validateCheck(val);//代码的完整性保护
    }
    function validateCheck(v: never) { }


    // any 任何类型，只在迫不得已的情况下用，会导致类型检测丧失
    let a1: any = 1;
    a1 = '1';

    //unknown 未知类型

    //object 引用类型
    function create(val: object) { }
    create({});
    create([]);
    create(function () { });
    // create(1);//报错


    // symbol bigInt
    const s: symbol = Symbol();
    const b = BigInt(1);//需要把target改为"ES2020"之后，或者添加lib: ["ES2020", "DOM"]，（console.log属于DOM）


}
export default baseType