const STATE_MAP = {
    pending: 'pending',
    rejected: 'rejected',
    resolved: 'resolved'
}
class MyPromise {
    constructor(executor) {
        if (typeof executor !== 'function') {
            throw 'SyntaxError'
        }
        //实例属性&方法
        this.state = STATE_MAP.pending;
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];
        // ------
        try {
            executor(this.resolve.bind(this), this.reject.bind(this))
        } catch (error) {
            queueMicrotask(() => {
                throw error;
            })
        }
    }
    // 原型方法
    resolve(v) {
        if (this.state === STATE_MAP.pending) {
            this.value = v;
            this.state = STATE_MAP.resolved;
            this.onResolvedCallbacks.forEach(callback => callback(this.value));
        }
    }
    reject(e) {
        if (this.state === STATE_MAP.pending) {
            this.reason = e;
            this.state = STATE_MAP.rejected;
            this.onRejectedCallbacks.forEach(callback => callback(this.reason));
        }
    }
    then(onResolveCallback, onRejectCallback) {
        onResolveCallback = typeof onResolveCallback === 'function' ? onResolveCallback : value => value;
        onRejectCallback = typeof onRejectCallback === 'function' ? onRejectCallback : reason => {throw reason};
        // 支持链式调用，需要返回一个promise
        // queueMicrotask 进入微任务队列，保证当前微任务执行完毕
        const innerPromise = new MyPromise((resolve, reject) => {
            switch (this.state) {
                case STATE_MAP.pending:
                    this.onResolvedCallbacks.push(value => {
                        queueMicrotask(() => {
                            try {
                                const x = onResolveCallback(value);
                                MyPromise.resolvePromise(innerPromise, x, resolve, reject);
                            } catch (error) {
                                reject(error)
                            }
                        })
                    });
                    this.onRejectedCallbacks.push(reason => {
                        queueMicrotask(() => {
                            try {
                                const x = onRejectCallback(reason);
                                MyPromise.resolvePromise(innerPromise, x, resolve, reject);
                            } catch (error) {
                                reject(error)
                            }
                        })
                    });
                    break;
                case STATE_MAP.resolved:
                    queueMicrotask(() => {
                        try {
                            const x = onResolveCallback(this.value);
                            MyPromise.resolvePromise(innerPromise, x, resolve, reject);
                        } catch (error) {
                            reject(error)
                        }
                    })
                    break;
                case STATE_MAP.rejected:
                    queueMicrotask(() => {
                        try {
                            const x = onRejectCallback(this.reason);
                            MyPromise.resolvePromise(innerPromise, x, resolve, reject);
                        } catch (error) {
                            reject(error)
                        }
                    })
                    break;
            }
        })
        return innerPromise;
    }
    toString() {
        function getResult() {
            let ret = 'undefined';
            switch(this.state) {
                case STATE_MAP.resolved:
                    ret = this.value;
                    break;
                case STATE_MAP.rejected:
                    ret = this.reason;
                    break;
                default: 
                    break;
            }
            return ret;
        }
        return `Promise<${state}>: ${getResult()}`
    }
    // catch
    // finally

    // 静态方法
    static resolve(v) {
        return new MyPromise(resolve => resolve(v))
    }
    static reject(e) {
        return new MyPromise((_, reject) => reject(e))
    }

    // resolvePromise用于处理then的返回值，支持链式调用
    static resolvePromise(thenPromise, x, resolve, reject) {
        if (thenPromise === x) {
            return reject(new Error('检测到循环引用'))
        }
        // 如果then方法的返回值x是个promise，则递归调用其then方法，最终返回普通值
        if (x instanceof MyPromise) {
            return x.then(resolve, reject)
        } else {
            // x是普通值，直接resolve
            resolve(x)
        }
    }
}

// 参考： https://blog.csdn.net/xiaowu5705/article/details/143249492

const p = new MyPromise((resolve) => {
    // setTimeout(() => {
    //     resolve(1)
    // }, 1000);
    resolve(1);
})
p.then(data => {
    console.log('resolve data1',data)
    return 2
}, reason => {
    console.log('reject1', reason)
}).then(data => {
    console.log('resolve data2',data)
}, reason => {
    console.log('reject2', reason)
})
console.log('kkkk')