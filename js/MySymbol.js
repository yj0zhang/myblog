function Symbol(key){
    // 如果使用了new 关键字，new.target是有值的，或者使用原型判断：
    if(this.__proto__ === arguments.callee.prototype) {
        console.log('22',des)
        throw new TypeError('不能使用new关键字')
    }
    const _o = {}
    Object.defineProperty(_o, 'key', {
        writable: false,
        value: key
    })
    return Object.create(_o)
}
Symbol.globalSymbolMap = new Map();
Symbol.for = function(key){
    if(Symbol.globalSymbolMap.has(key)) {
        return Symbol.globalSymbolMap.get(key)
    } else {
        const s = Symbol(key);
        Symbol.globalSymbolMap.set(key, s);
        return s;
    }
}
Symbol.keyFor = function(symbol){
    const entries = Symbol.globalSymbolMap.entries();
    let key = null;
    for (const element of entries) {
        if(element[1] === symbol){
            key = element[0]
            break;
        }
    }
    return key
}
// const t1 = Symbol('4')
// const t2 = Symbol('4')
// console.log(t1 === t2, typeof t1)

const t3 = Symbol.for(1)
const t4 = Symbol.for(1)
console.log(t3 === t4,  Symbol.keyFor(t3), Symbol())