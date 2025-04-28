# vue3

## vue3 的响应式原理

有四大部份：

- reactive， 使用 proxy 语法，实现对象的深层代理，在 get、has(in)、 ownKeys(getOwnPropertyNames,getOwnPropertySymbols)操作时，使用 track 方法，追踪依赖，在全局 weakMap 变量中存储响应式对象和副作用依赖的关系，在 set、deleteProperty(delete)操作时，用 trigger 方法触发 effect 的执行
- track 时，使用全局 weakMap 记录响应式对象与副作用的关联关系
- trigger 时，根据全局 weakMap 记录的依赖，执行副作用
- effect 上记录依赖的属性

## vue2 的响应式原理

- 数据劫持+观察者模式，使用 Object.defineProperty，拦截对象属性的 get 和 set 操作，get 时收集依赖(watcher)，set 时派发更新(执行 watcher)
  - 这种方式对于引用对象新增的属性无效，所以 vue 暴露出了一个静态 api: $set，新增属性时，使用这个 api，可以实现响应式
  - 数组操作也无法通过数据劫持实现响应式，vue 通过拦截数组原型上的方法实现响应式
- Observer，递归监测对象，用 walk 方法，访问对象的每个属性，触发数据劫持的 get，收集
- Watcher，相当于 vue3 的 effect

## vue3 和 vue2 的区别

- 响应式实现原理不同，vue2 使用数据劫持+观察者模式，vue3 使用 proxy+观察者模式
  - vue3 对数组不需要特殊处理，vue2 需要拦截数组原型方法实现响应式
  - 对响应式对象新增属性，vue2 需要用 Vue.set，vue3 直接添加
- patch 方法的优化
  - 静态节点提升到全局，不重新创建和渲染
  - 设置 patchFlag 标记标签，仅对比可能变化的部份
  - 优化对比算法：最长递增子序列，在节点顺序变化时，找出移动节点最小的方案
- vue3 支持 typescript，提供更好的类型判断
- vue3 模版可以支持多个根节点，但是与单个跟节点有些区别：
  - class、style、v-on 的自动继承上，
    - vue2 会自动继承到根节点，
    - vue3 多根节点需要手动指定继承到某个节点，否则不继承，且开发环境会有警告
- 组合式 api，setup 入口，可以更加灵活的组织业务逻辑
- vue3 生命周期有些变化：destroy 改成了 unmount，setup 入口下不需要 create 钩子
- setup 模式下，父组件不能通过 ref 访问子组件的方法，只能通过 expose 来暴露
- 新增了组件 teleport 和 suspense
  - teleport 传送门，可以把组件传送到根节点外部
  - suspense，包裹异步加载组件，可以处理 loading、fallback 状态
- 创建实例方式变了：vue3 变成了 createApp，vue2 是 new Vue
- v-model 变了，vue3 的组件支持多个 v-model，v-model:title、v-model:content

## vue3 和 react 的区别

- 响应式原理不同
  - vue3 基于 proxy 和观察者模式自动收集依赖
  - react 通过 useState 管理状态，手动调用 setState 改变状态，实现更新
- 模版语法不同
  - react 强制使用 jsx
  - vue3 支持 jsx 和 template 语法
    - 在 vue3 中使用 jsx，就没有模版编译优化了，比如静态提升，需要开发者自己优化
- 逻辑复用
  - vue3 使用 composition api
  - react 使用 hooks
- 性能优化
  - vue3 自动追踪依赖，减少无效渲染
  - react 需要开发时使用 react.memo、userMemo 等方法手动优化

# vuex4

- 基于 vue2 的响应式，兼容 vue3
- 对 typescript 有支持，但较弱
- api 包含 state，mutation，actions，getters

# pinia

- 基于 vue3 的 ref 和 reactive，是官方推荐的状态管理
- 完美支持 typescript
- api 包含 state，actions，getters
  - 使用 defineStore 定义状态管理模块
  - 组件中引入后，可直接使用 state，actions 和 getters，
  - 如需解构 state 和 getters，需要使用 storeToRefs 保持响应性
- 模块化：基于 esmodule 的模块化，无需像 vuex 一样手动注册

## vue3 的 api

- reactive
  - 把对象变成响应式的
- ref
  - 基于 reactive，把对象和基础类型的数据变成响应式的
- readonly
  - 把对象变成只读
- shallowRef
  - 浅层引用
- shallowReactive
  - 浅层响应式
- isRef
- isReactive
- toRef
  - 把原数据变成 ref
- toRefs
  - 将 reactive 对象，转换为普通对象，这个普通对象的每个属性，是对 reactive 对象属性的 ref
- toRaw
  - 返回 vue 代理的原始对象
- unref
  - 获取 ref.vue
- toValue
  - 在 unref 的基础上，增加了 getter 的规范化
- triggerRef
  - 触发某个 ref 的副作用
- effect
- computed
- watch
- watchEffect
- onWatcherCleanup、onCleanup
  - onWatherCleanup 是全局 api，可以直接调用，注册清理方法
  - onCleanup 是一个回调，在 watch 的监听方法中传入，注册清理方法
- effectScope
  - 批量管理响应式副作用的方法，可以一键停止所有副作用，api： scope.run，scope.stop
  - 支持嵌套
  - onScopeDispose 注册一个回调，在响应式作用域被停止时执行
- defineExpose
  - 在 setup 中，定义暴露出去的属性或方法
- defineProps
  - 定义组件接收的属性
