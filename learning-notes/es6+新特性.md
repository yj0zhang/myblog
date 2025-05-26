# es6

- let/const
- 箭头函数
- 模版字符串
- 解构赋值
- 扩展运算符
- 函数默认参数、剩余参数
- class
- module
- Map/Set/WeakMap/WeakSet
  - Map 的键有顺序、键可以是任意值、Map 可以直接被迭代、频繁增删时性能更好、可以直接获取 size
  - Set 中的值会自动去重、元素按插入顺序排列、只能迭代访问（不能按索引）、查找(has)/删除(delete)元素更快
    - Array 是按照索引顺序，可以按索引访问
- Promise
- 迭代器与生成器 iterator yield
- Proxy/Reflect
- 二进制和八进制字面量：0b1100 0o733

# es7

- 指数运算符 `2 ** 3`等同于 Math.pow(2,3) === 8
- Array.prototype.includes

# es8

- Async/Await
- Object.values/Object.entries
- 字符串填充 padStart/padEnd

# es9(es2018)

- 异步迭代 for-await-of
- Promise.finally

# es10(es2019)

- Array.flat/Array.flatMap
- Object.fromEntries
- String.trimStart/trimEnd
- try catch 中，catch 可以不写 error：try{...}catch{...}

# es11(es2020)

- BigInt
- 动态导入 import()
- 空值合并运算符`??`
- 可选链操作符`?.`
- globalThis

# es12(es2021)

- 逻辑赋值运算符: `||=` `&&=` `??=`
- String.replaceAll
- Promise.any
- WeakRef
- FinalizationRegistry

# es13(es2022)

- Array.at
- 模块顶层可以直接使用 await
- 类的公共字段和私有字段
  ```js
  class Person {
    #privateField = 42; // 私有字段
    publicField = 0; // 公共字段
  }
  ```
- 静态块
  ```js
  class Config {
    static {
      // 类初始化时执行的代码
    }
  }
  ```

# es14(es2023)

- Symbol 作为 WeakMap 健
- Array.findLast/findLastIndex

# es15(es2024)

- Promise.withResolvers
- ArrayBuffer.prototype.transfer
- Object.groupBy/Map.groupBy
