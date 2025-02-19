
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function isFunction(value) {
    return typeof value === 'function';
    // return Object.prototype.toString.call(value) === '[object Function]'
}
function isObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]'
}

function resolveResult(value, resolve, reject) {
    if(value instanceof MyPromise) {
        value.then(resolve, reject)
    } else {
        resolve(value)
    }
}


class MyPromise {
    constructor(fn) {
        if(!isFunction(fn)) {
            throw new Error('需要传回调')
        }
        this._state = PENDING;
        this._fulfilledCbs = [];
        this._rejectedCbs = [];
        this._value = void 0;
        this._reason = null;
        try {
            fn(this._resolve.bind(this), this._reject.bind(this))
        } catch (error) {
            queueMicrotask(() => {
                throw error;
            })
        }
    };

    _resolve(data){
        if(this._state === PENDING) {
            this._state = FULFILLED;
            this._value = data;
            this._fulfilledCbs.forEach(cb => {
                cb(data)
            });
            this._fulfilledCbs = []
        }
    };
    _reject(reason) {
        if(this._state === PENDING) {
            this._state = REJECTED;
            this._reason = reason;
            this._rejectedCbs.forEach(cb => {
                cb(reason)
            });
            this._rejectedCbs = []
        }
    }
    then(fulfilledCb, rejectedCb){
        fulfilledCb = isFunction(fulfilledCb) ? fulfilledCb : value => value;
        rejectedCb = isFunction(rejectedCb) ? rejectedCb : reason => {throw reason};
        //支持链式调用
        const innerPromise = new MyPromise((resolve, reject) => {
            switch(this._state) {
                case PENDING:
                    try {
                        this._fulfilledCbs.push(data => {
                            queueMicrotask(() => {
                                const v = fulfilledCb(data)
                                resolveResult(v, resolve, reject);
                            })
                        })
                    } catch (error) {
                        reject(error)
                    }
                    try {
                        this._rejectedCbs.push(reason => {
                            queueMicrotask(() => {
                                const r = rejectedCb(reason)
                                resolveResult(r, resolve, reject);
                            })
                        })
                    } catch (error) {
                        reject(error)
                    }
                    break;
                case FULFILLED:
                    queueMicrotask(() => {
                        try {
                            const v = fulfilledCb(this._value);
                            resolveResult(v, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    })
                    break;
                case REJECTED:
                    queueMicrotask(() => {
                        try {
                            const r = rejectedCb(this._reason);
                            resolveResult(r, resolve, reject);
                        } catch (error) {
                            reject(error)
                        }
                    })
                    break;
            }
        })
        return innerPromise;
    }

    static resolve(v) {
        return new MyPromise(resolve => resolve(v))
    }

    static reject(v) {
        return new MyPromise((_,reject) => {
            reject(v)
        })
    }

}


// const p = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve(1)
//     }, 1000);
// })
// 注册resolve和reject的方法
// p.then(data => {
//     console.log('resolve data',data)
// }, reason => {
//     console.log('reject', reason)
// })

const p = new MyPromise((resolve, reject) => {
    // setTimeout(() => {
    //     resolve(1)
    // }, 1000);
    reject(1);
})
p.then(data => {
    console.log('resolve data1',data)
    // return 2
    return MyPromise.reject(2)
}, reason => {
    console.log('reject1', reason)
    return MyPromise.resolve(2)
}).then(data => {
    console.log('resolve data2',data)
}, reason => {
    console.log('reject2', reason)
})
console.log('kkkk')