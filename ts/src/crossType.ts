//交叉类型
//联合类型是并集，交叉类型是交集
export default function () {
    {
        interface Person1 {
            handsome: string;
        }
        interface Person2 {
            high: string;
        }
        //联合类型，值可以是任一类型
        let person: Person1 | Person2 = {
            handsome: '1'
        }

        //交叉类型，值同时是两个类型的子类型，可以赋值给予任何一个类型
        let p1: Person1 & Person2 = {
            handsome: '1',
            high: '1'
        }
    }
    {
        // 如果交叉类型有冲突
        interface Person1 {
            handsome: string;
            gender: number;
        }
        interface Person2 {
            high: string;
            gender: string;
        }
        type Person3 = Person1 & Person2;
        type IGender = Person3['gender'];//never
        //交叉类型，值同时是两个类型的子类型，可以赋值给予任何一个类型
        let p1: Person3 = {
            handsome: '1',
            high: '1',
            gender: (function () { throw Error() })(),//gender的类型是never
        }
    }
}