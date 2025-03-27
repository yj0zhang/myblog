const typeAsserts = function () {
    // 声明变量时，如果没有标识类型，它是any类型，值是undefined
    let a;

    // const时常量，意味着值不会改变，它的类型是字面量
    const c = 1;
    const c1: 1 = 1;
    const str: 'a' = 'a';


    // 断言
    let strOrNum: string | number;
    // 在使用联合类型的时候，通常会先赋值，再使用
    // strOrNum = 1;
    // strOrNum.toFixed();
    // strOrNum = '1';
    // strOrNum.charCodeAt(0);
    // 对于某些情况下，变量的值已确定，可以使用断言，同时使用非空断言!，此时ts不会进行类型检测了
    (strOrNum! as number).toFixed(1);
    (<number>strOrNum!).toFixed(1);

    let ele = document.getElementById('app');
    ele!.style.background = '';
    //js中`?`是取值操作，不能赋值
    // ele?.style.background = '';

    // 值 as xxx 或者 <xxx>值 一般用于联合类型断言，将大范围的类型，断言成子类型

    // 双重断言，一般不建议使用，可以断言为任意类型
    (strOrNum! as unknown as boolean);


    // 类型别名，构建可复用类型
    type Direction = 'up' | 'down';
    let d: Direction = 'up';
    let up: 'down' = d as 'down';
};
export default typeAsserts;