export default function () {
    //基于对象类型的内置类型
    interface Person1 {
        handsome: string;
    }
    interface Person2 {
        high: string;
    }
    type IKeys1 = keyof any;//string | number | symbol
    type IKeys2 = keyof unknown;//never
    type Compute<T extends object> = {
        [key in keyof T]: T[key]
    };
    type Person3 = Compute<Person1 & Person2>;

    // 内置类型 Partial Required Pick Omit...
    interface IPerson {
        name?: string;
        age?: number;
    }
    interface ICompany {
        name?: string;
        age: number;
        address: string;
        person: IPerson;
    }
    type Partial<T> = {
        [key in keyof T]?: T[key]
    };
    type PartialRes = Partial<ICompany>;
    let company1: PartialRes = {
        //person如果有，属性是必须有的
        person: {
            name: '1',
            age: 20
        }
    };
    type DeepPartial<T> = {
        [key in keyof T]?: T[key] extends object ? DeepPartial<T[key]> : T[key]
    };
    type DeepPartialRes = DeepPartial<ICompany>;
    let company2: DeepPartialRes = {
        person: {}
    };

    type Required<T> = {
        [key in keyof T]-?: T[key]
    };
    type DeepRequired<T> = {
        [key in keyof T]-?: T[key] extends object ? DeepRequired<T[key]> : T[key];
    };
    type DeepRequiredRes = DeepRequired<ICompany>;
    let company3: DeepRequiredRes = {
        name: '1',
        age: 20,
        address: '1',
        person: {
            name: '1',
            age: 30
        }
    };
}