export default function () {
    //基于对象类型keys的内置类型
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

    // 内置类型 Partial Required Pick Omit Record...
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
    //Pick
    type Pick<T, K extends keyof T> = {
        [P in K]: T[P]
    };
    type PickPerson = Pick<ICompany, 'person' | 'age'>;
    //Omit
    type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
    type OmitPerson = Omit<ICompany, 'person' | 'age'>;

    //Record 取代object
    //K,V,R是在执行时，自动推导的
    function map<K extends keyof any, V, R>(obj: Record<K, V>, cb: (item: V, key: K) => R) {
        let result = {} as Record<K, R>;
        for (let key in obj) {
            result[key] = cb(obj[key], key);
        }
        return result;
    }
    map({ name: 'a', age: 20 }, (item, key) => item + key);
}