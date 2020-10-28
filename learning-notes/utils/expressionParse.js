/**
 * 解析关系表达式，并返回执行结果
 * 最简单的格式：[('字段名','操作符',值)]，例：[('a', '=', 1)]
 * 字段名支持属性路径: a.b.0.c
 * 值不支持undefined
 *
 * 操作符支持 =, !=, <, <=, >, >=, in, not in, include, not include.
 * 当值是数组或对象时，这几种操作符不支持：<, <=, >, >=, in, not in
 * 操作符<, <=, >, >=只支持Number类型比较，如果是比较日期，请传时间戳
 * 这两种操作符只支持值为数组的情况：include, not include.
 *
 * 关系符支持｜、&两种，写法是波兰表示法(前缀表示法：关系符前置)
 * 例子：这种关系：[(a || b) && (b || c)]即写成：[&, |, a, b, | b, c]
 * 其中的a, b, c表示一个简单运算：('字段名','操作符',值)
 * 导出的方法expressParse需要两个参数：关系表达式exp，数据源data
 *
 * 例：
 * // data结构如下：
 * const data = {
 *     a: 1,
 *     b: 0,
 *     c: '1',
 *     d: '2',
 *     e: '0',
 *     f: false,
 *     g: true,
 *     h: null,
 *     i: [1, false, null],
 *     j: { a: 1, b: [1, 2] }
 * }
 * 如下测试用例已通过：
    it('path arr', () => {
        expect(expressParse('[("j.b", "include", [1,2])]', data)).toBe(true)
    })
    it('path', () => {
        expect(expressParse('[("j.a", "<", 10)]', data)).toBe(true)
    })
    it('less', () => {
        expect(expressParse('[("a", "<", 10)]', data)).toBe(true)
    })
    it('lessEqual', () => {
        expect(expressParse('[("a", "<=", 1)]', data)).toBe(true)
    })
    it('equal', () => {
        expect(expressParse('[("a", "=", 1)]', data)).toBe(true)
    })
    it('greaterEqual', () => {
        expect(expressParse('[("a", ">=", 1)]', data)).toBe(true)
    })
    it('greater', () => {
        expect(expressParse('[("a", ">", -1)]', data)).toBe(true)
    })
    it('in', () => {
        expect(
            expressParse(`["&",("h", "=", null),("a", "in", ${JSON.stringify([1, '2'])})]`, data)
        ).toBe(true)
    })
    it('not in', () => {
        expect(
            expressParse(`[("a", "not in", ${JSON.stringify(['1', '2'])})]`, data)
        ).toBe(true)
    })
    it('include 1', () => {
        expect(expressParse('[("i", "include", [1, false, null, 2])]', data)).toBe(false)
    })
    it('include 2', () => {
        expect(expressParse('[("i", "include", ["1", false, null])]', data)).toBe(false)
    })
    it('include 3', () => {
        expect(expressParse('[("i", "include", [false, null])]', data)).toBe(true)
    })
    it('not include', () => {
        expect(expressParse('[("i", "not include", ["1"])]', data)).toBe(true)
    })
    it('not include multi', () => {
        expect(expressParse('[("i", "not include", ["1", false])]', data)).toBe(false)
    })
    it('boolean', () => {
        expect(expressParse('[("f", "!=", true)]', data)).toBe(true)
    })
    it('string', () => {
        expect(expressParse('[("c", "=", "1")]', data)).toBe(true)
    })
    it('number', () => {
        expect(expressParse('[("a", "=", 1)]', data)).toBe(true)
    })
    it('in str', () => {
        expect(
            expressParse('["&",("h", "=", null),("a", "in", "[1, \'2\']")]', data)
        ).toBe(true)
    })
    it('&', () => {
        expect(expressParse('["&",("h", "=", null),("a", "<", 10)]', data)).toBe(true)
    })
    it('|', () => {
        expect(expressParse('["|",("h", "=", 1),("a", "<", 10)]', data)).toBe(true)
    })
 */
import { isObject, isArray, isString, isUndefined, keys, get, isEqual, difference } from 'lodash'
// const { isObject, isArray, isString, isUndefined, keys, get, isEqual, difference } = require('lodash')

const operators:string[] = []
const relationOperators: string[] = []
const relationOpetatorMap = {
    equal: '=',
    notEqual: '!=',
    less: '<', // 不支持数组，对象
    lequal: '<=', // 不支持数组，对象
    greater: '>', // 不支持数组，对象
    gequal: '>=', // 不支持数组，对象
    in: 'in', // 不支持数组，对象
    notIn: 'not in', // 不支持数组，对象
    include: 'include', // 只支持数组，全部包括
    notInclude: 'not include'// 只支持数组，全部不包括
}
const operatorMap = {
    or: '|',
    and: '&'
}

keys(operatorMap).forEach(key => {
    operators.push(operatorMap[key])
})

keys(relationOpetatorMap).forEach(key => {
    relationOperators.push(relationOpetatorMap[key])
})

// 检查str是否为操作符，支持 | &
function isOperator (str) {
    return operators.includes(str)
}
// 去除前后引号
function trimQuotation (str) {
    str = str.trim()
    if (str.startsWith('\'') || str.startsWith('"')) {
        str = str.slice(1)
    }
    if (str.endsWith('\'') || str.endsWith('"')) {
        str = str.slice(0, -1)
    }
    return str
}
// 检查条件表达式是否合法，ex: ('key', 'in', [])
// 如果合法，返回数组：['key', 'in', []]
// 中间的关系操作符支持relationOperators数组中的所有
// 第三个参数支持number, string, boolean和这三种类型的数组
function getCondition (str: string): any[] {
    if (!isString(str) || !str) {
        throw new Error('str必须是字符串')
    }
    if (!str.trim().startsWith('(') || !str.trim().endsWith(')')) {
        throw new Error('语法错误')
    }
    // 去除括号
    str = str.trim().slice(1).slice(0, -1)
    let arr = str.valueOf().split(',')
    const val = arr.slice(2).join()
    arr = arr.slice(0, 2)
    arr.push(val)
    arr = arr.map((item, index) => {
        if (index < 2) {
            item = trimQuotation(item)
        }
        return index === 2 ? JSON.parse(item) : item
    })
    if (!relationOperators.includes(arr[1])) {
        throw new Error(`不支持的关系操作符：${arr[1]}`)
    }
    return arr
}
// 执行关系表达式
function excCondition (condition: any[], data: any): boolean {
    const [key, roperator, val] = condition
    const value = get(data, key)
    if (isUndefined(value)) {
        throw new Error('不支持undefined')
    }
    let ret = false
    if (isArray(value)) {
        switch (roperator) {
            case relationOpetatorMap.equal:
                ret = isEqual(value, val)
                break
            case relationOpetatorMap.notEqual:
                ret = !isEqual(value, val)
                break
            case relationOpetatorMap.include:
                if (!isArray(value) || !isArray(val)) {
                    throw new Error(`操作符${relationOpetatorMap.include}的对象必须是数组`)
                }
                ret = difference(val, value).length === 0
                break
            case relationOpetatorMap.notInclude:
                if (!isArray(value) || !isArray(val)) {
                    throw new Error(`操作符${relationOpetatorMap.include}的对象必须是数组`)
                }
                ret = difference(val, value).length === val.length
                break
            default:
                throw new Error(`不支持的操作符：${roperator}`)
        }
    } else if (isObject(value)) {
        switch (roperator) {
            case relationOpetatorMap.equal:
                ret = isEqual(value, val)
                break
            case relationOpetatorMap.notEqual:
                ret = !isEqual(value, val)
                break
            default:
                throw new Error(`不支持的操作符：${roperator}`)
        }
    } else {
        switch (roperator) {
            case relationOpetatorMap.equal:
                ret = value === val
                break
            case relationOpetatorMap.notEqual:
                ret = value !== val
                break
            case relationOpetatorMap.less:
                ret = Number(value) < Number(val)
                break
            case relationOpetatorMap.lequal:
                ret = Number(value) <= Number(val)
                break
            case relationOpetatorMap.greater:
                ret = Number(value) > Number(val)
                break
            case relationOpetatorMap.gequal:
                ret = Number(value) >= Number(val)
                break
            case relationOpetatorMap.in:
                ret = val.includes(value)
                break
            case relationOpetatorMap.notIn:
                ret = !val.includes(value)
                break
            default:
                throw new Error(`不支持的操作符：${roperator}`)
        }
    }
    return ret
}

function excOperator (op:string, arr: any[]):boolean {
    let ret = false
    switch (op) {
        case operatorMap.or:
            ret = arr[0] || arr[1]
            break
        case operatorMap.and:
            ret = arr[0] && arr[1]
            break
        default:
            ret = false
            break
    }

    return ret
}

function getExpArr (exp: string): string[] {
    const ret: string[] = []
    let tempErr = String(exp).valueOf().split(',')
    tempErr = tempErr.map(item => item.trim())
    while (tempErr.length > 0) {
        if (operators.includes(trimQuotation(tempErr[0]))) {
            ret.push(trimQuotation(tempErr[0]))
            tempErr.shift()
        } else if (tempErr[0].startsWith('(')) {
            let expArr: string = ''
            while (!tempErr[0].endsWith(')')) {
                expArr += expArr ? `,${tempErr[0]}` : tempErr[0]
                tempErr.shift()
            }
            expArr += expArr ? `,${tempErr[0]}` : tempErr[0]
            tempErr.shift()
            ret.push(expArr)
            expArr = ''
        }
    }
    return ret
}
// export default
// module.exports
export default function expressParse (exp: string, data: any): boolean {
    if (!exp || !data || !isObject(data)) {
        throw new Error('exp必须为数组，data必须为对象')
    }
    if (!String(exp).valueOf().startsWith('[') || !String(exp).valueOf().endsWith(']')) {
        throw new Error('exp格式不正确')
    }
    const operatorStack: string[] = []
    const valStack: boolean[] = []
    const arr = getExpArr(String(exp).valueOf().slice(1).slice(0, -1))
    arr.forEach(item => {
        item = item.trim()
        if (isOperator(item)) {
            // 操作符压栈
            operatorStack.push(item)
        } else {
            valStack.push(excCondition(getCondition(item), data))
            //
            if (operatorStack.length > 0 && valStack.length >= 2) {
                const tempVal = [valStack.pop(), valStack.pop()]
                const tempOperator = operatorStack.pop()
                if (tempOperator && tempVal) {
                    valStack.push(excOperator(tempOperator, tempVal))
                }
            }
        }
    })
    if (valStack.length > 1 || operatorStack.length > 0) {
        throw new Error(`${exp}格式不正确`)
    }
    return valStack[0]
}
