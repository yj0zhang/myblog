# vue

## vue3 的响应式原理

有四大部份：

- reactive， 使用 proxy 语法，实现对象的深层代理，在 get、has(in)、 ownKeys(getOwnPropertyNames,getOwnPropertySymbols)操作时，使用 track 方法，追踪依赖，在全局 weakMap 变量中存储响应式对象和副作用依赖的关系，在 set、deleteProperty(delete)操作时，用 trigger 方法触发 effect 的执行
- track 时，使用全局 weakMap 记录响应式对象与副作用的关联关系
- trigger 时，根据全局 weakMap 记录的依赖，执行副作用
- effect 上记录依赖的属性

## vue2 的响应式原理

- Observer 类，数据劫持，递归监测对象，用 walk 方法，访问对象的每个属性，执行 defineReactive 方法。
  - defineReactive 方法中使用 Object.defineProperty，拦截对象属性的 get 和 set 操作，get 时收集依赖(watcher)，set 时派发更新(执行 watcher)
  - 这种方式对于引用对象新增的属性无效，所以 vue 暴露出了一个静态 api: $set，新增属性时，使用这个 api，可以实现响应式
  - 数组操作也无法通过数据劫持实现响应式，vue 通过拦截数组原型上的方法实现响应式
- Dep 类，实现观察者模式，每个响应式属性对应一个 Dep 实例，管理依赖和派发更新
- Watcher 类，相当于 vue3 的 effect，连接视图与数据的桥梁

## vue2 的 diff 算法

- 同层比较
- 双端比较
  优化方法：
- key 优化
- 静态节点提升到全局，不重新创建和渲染

## vue3 和 vue2 的区别

- 响应式实现原理不同，vue2 使用数据劫持+观察者模式，vue3 使用 proxy+观察者模式
  - vue3 对数组不需要特殊处理，vue2 需要拦截数组原型方法实现响应式
  - 对响应式对象新增属性，vue2 需要用 Vue.set，vue3 直接添加
- patch 方法的优化
  - 设置 patchFlag 标记标签，仅对比可能变化的部份
  - 优化对比算法：`最长递增子序列`，在节点顺序变化时，找出移动节点最小的方案
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
- vue3 中 v-for 可以渲染多根节点

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

## vue 和 react 在性能优化、状态管理、组件通信上有什么区别

### 性能优化

- React 使用 fiber 架构来最小化 DOM 更新操作，但默认情况下，父组件更新会触发所有子组件重新渲染，开发中的优化手段：
  - React.memo 记忆组件
  - useMemo/useCallback
  - shouldComponentUpdate/PureComponent（类组件）
  - 不可变数据 ？
  - 代码分割：React.lazy+Suspense 实现按需加载
- Vue 的响应式系统会自动跟踪哪些组件需要更新，更新范围小。优化手段：
  - v-once 只渲染一次静态内容
  - v-memo 记忆模版子树
  - 组件懒加载：defineAsyncomponent
  - keep-alive
- React 的优化特点：更多需要开发者手动干预，但优化粒度更细，可以精确控制
- Vue 的优化特点：更多有框架内部自己完成，提供了很多内置优化指令

### 状态管理

- React 使用 Redux，单一数据流，注重不可变性和纯函数
- Vuex 基于 vue2 的响应式，单一数据流，集中管理状态，与 Vue 响应式深度集成
- Pinia 基于 vue3 的响应式，比 Vuex 更简单直观，与 Vue3 的响应式深度集成

### 组件通信

- React
  - props 向下传递数据
  - 回调函数向上传递事件
  - 状态提升
  - context api
  - redux
- Vue
  - props 向下传递数据
  - $emit 触发父组件事件
  - Provide inject
  - eventBus

## provide 和 inject 的原理

- provides 原理：
  - 默认情况下，组件实例会继承其父组件的 provides 对象
  - 当自己需要提供 provides 时，会创建一个新的 provides 对象，并将父组件的 provides 对象作为原型
- inject 原理：
  - 直接从父组件的 provides 中查找需要的 key 值，因为组件树的 provides 创建了原型链，索引会逐级向上查找
  - 如果没有父组件，或者父组件没有 provides，则查找应用级别的 provides 对象
  - 如果上述都没有，使用默认值

## mitt useEventBus 的原理

- mitt
  - 返回 all, on, once, off, emit
  - 使用发布订阅模式，实现通信
  - 使用 map 实现事件总线
  - 事件类型可以传`*`，代表响应所有类型事件
  - 普通事件函数接收一个参数：事件函数参数，通配符事件接收：事件类型、事件函数参数
- useEventBus (VueUse 提供的)
  - 返回 on, once, off, emit, reset
  - 使用发布订阅方式，实现通信
  - 使用 map 实现事件总线，每个类型的事件存储在 Set 中
  - 使用了 getCurrentScope，获取当前 scope，并注册清理函数（当作用域销毁时，自动取消监听）
- 区别
  - mitt 不依赖 vue，useEventBus 依赖 vue
  - mitt 需要手动创建 emitter、手动移除监听，useEventBus 会自动处理

## nextTick 原理

基于 vue 的异步更新队列

- 数据变更流程如下
  - 数据变更（setter）
  - 将 watcher 加入队列
  - 使用 flushSchedulerQueue 放入 nextTick
  - 执行微任务（队列中有 flushSchedulerQueue）
  - DOM 更新
  - 执行用户的 nextTick 回调
  - 宏任务
- nextTick 首先使用微任务，降级使用宏任务
  - promise.then
  - MutationObserver
  - setTimeout

# vuex4

- 基于 vue2 的响应式，兼容 vue3
- 对 typescript 有支持，但较弱
- api 包含 state，mutation，actions，getters

# vuex 核心概念和工作原理

## 核心概念

- State 单一状态树，存储于应用层级的状态
- Getter 从 store 中派生出的一些状态（类似计算属性）
- Mutations 唯一更改 state 的方法（同步事物）
- Actions 提交 mutation，可以包含任何异步操作
- Modules 将 store 分割成模块

## 工作原理

# pinia

- 基于 vue3 的 ref 和 reactive，是官方推荐的状态管理
- 完美支持 typescript
- api 包含 state，actions，getters
  - 使用 defineStore 定义状态管理模块
  - 组件中引入后，可直接使用 state，actions 和 getters，
  - 如需解构 state 和 getters，需要使用 storeToRefs 保持响应性
- 模块化：基于 esmodule 的模块化，无需像 vuex 一样手动注册

# pinia 为什么去掉了 mutation

vuex 的 mutation 负责处理同步状态变更，并支持 devtools 追踪状态变化。
但现在的 devtools 可以追踪异步操作，同时 mutation 的严格同步限制与 vue3 的 composition api 理念冲突（鼓励更自由的代码组织方式），所以 mutation 被删除

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
  - watch(source, cb, options)
- watchEffect
  - watchEffect(effect,options)
  - 返回一个 stop 方法，用于停止侦听
- watchPostEffect
  - watchEffect() 使用 flush: 'post' 选项时的别名
- watchSyncEffect
  - watchEffect() 使用 flush: 'sync' 选项时的别名
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

# vue-router 相关

## history api 有哪些

- history.pushState 添加新的历史记录
- history.replaceState 替换当前历史记录
- history.go
- history.forward
- history.back
- history.state 获取当前历史记录关联的状态对象
- window.onpopstate 触发条件：用户点击浏览器前进后退按钮：back, go, forward

## hash 路由的 api 有哪些

- window.location.hash
- window.onhashchange
- history.replaceState 可用于初始化或静默更新 hash

## history 路由和 hash 路由的区别

- history 路由需要服务器支持：url 重定向
- history 路由没有`#`
- history 路由支持 state 对象
- history 路由需要 IE10 以上

## vue-router 中 params 可以不配置在路由配置中吗

可以，但有以下不同：

- 不显示在 url 中
- 刷新浏览器后，不保留
- 不是必传的参数
- 必须使用命名路由
- 对 seo 不可见

## params 不配置在路由配置中，有什么适用场景？

- 传递敏感数据，不适合暴露在 url 中
- 传递复杂的数据结构
- 向导式多步骤表单中，传递表单数据到下一步
- 传递仅本次导航有效的临时参数
- 传递开发调试信息

## vue-router 中 params 和 query 的区别

- params 是路径的一部分，query 跟在？后面
- params 需要在路由配置中预先声明，query 不需要
- params 一般是必须传的，query 是可选的
- 刷新后，params 只会保留在路由配置中有的，而 query 一直在

- 函数式导航中，当使用 path 跳转时，params 参数 会被忽略，必须使用 name 跳转才能传递 params
  ```js
  // 情况1：使用name + params - 正常工作
  this.$router.push({
    name: "user",
    params: { id: 123 },
  }); // → /user/123
  // 情况 2：使用 path + params - params 被忽略
  this.$router.push({
    path: "/user",
    params: { id: 123 }, // 这个 params 会被忽略
  }); // → /user
  // 情况 3：使用完整 path - 正常工作
  this.$router.push({
    path: "/user/123",
  }); // → /user/123
  ```

## vue-router 的 install 方法做了什么？

- 使用 mixin，给所有组件添加 `beforeCreate` 钩子，钩子中做下列事情
  - 添加`_routerRoot`和`_router`变量
  - 使用`defineReactive`把当前匹配的路由记录 `current`，变成响应式变量，存储在`_route`上
- 使用数据拦截，在 vue 原型上获取`$router`和`$route` 时，返回实例的`_routerRoot_routerRoot._router`和`_routerRoot._route`
- 注册全局组件 `RouterView`和`RouterLink`

## vue-router 中，addRoutes 的原理是什么

vue-router 内部有个路由映射表，在初始化时会把 path 和路由配置映射，存储在 map 中
addRoutes 方法就是递归的把传入的 routes 放入路由映射表中
路由映射表结构如下：

```js
{
  '/about/a': {
    parent: {
      parent:null,path:'/about',component: About
    },
    path: '/about/a',
    component: A
  }
}
```

## vue-router 是如何根据路径渲染对应组件的？

vue-router 中有个 transitionTo 方法，做组件查找和渲染

- 基于路由映射表，可以根据 path 获取到组件链，从根组件到叶子组件，一层一层渲染
  - path: '/about/a', matched: [About,A]
- 更新 current，current 保存当前匹配的路由配置

## 组件中可以有多个 router-view 吗

可以，这叫命名视图，路由配置如下：

```js
[
  {
    name: "index",
    path: "/",
    components: {
      default: componentA,
      b: componentB,
    },
  },
];
```

router-view 如下：

```html
<router-view></router-view> <router-view name="b"></router-view>
```

## router-view 是如何渲染组件的

## 从一个路由，切换到另一个路由的时候，会发生什么？

- 当前组件先离开，调用 beforeRouteLeave
- 触发全局的 beforeEach 守卫
- 如果是组件更新，触发 beforeUpdate；如果不是更新，触发 beforeEnter
- 进入组件后，触发组件的钩子 beforeRouteEnter
- 切换完毕后，触发全局的 beforeResolve
- 最后执行全局的 afterEach
- 触发 dom 更新
- 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入

## scrollBehavior 的实现原理及使用方法

在创建 VueRouter 实例时，传入 scrollBehavior 函数选项

```js
const router = new VueRouter({
  routes: [],
  scrollBehavior(to, from, savedPosition) {
    // 返回滚动位置信息
    if (savedPosition) {
      return savedPosition; // 后退时恢复位置
    }
    if (to.hash) {
      return { selector: to.hash }; // 锚点链接
    }
    // return { x: 0, y: 0 }; // 默认滚动到顶部
    return { el: "#main", top: -10 }; //滚动到某个元素位置，top和left视为对这个元素的偏移量
  },
});
```

工作流程如下：

- 路由切换时，先记录页面当前滚动位置，存储在 history.state 中
- 在全局钩子 afterEach 执行后，执行 scrollBehavior，获取滚动位置
- 等待 dom 更新之后(nexttick)，再滚动

# vite

# vitest

## 基本使用

- 安装 `pnpm install -D vitest`
- 基本配置：
  ```js
  import { defineConfig } from "vitest/config";
  export default defineConfig({
    test: {
      // 测试配置项
      environment: "jsdom", // 或 'happy-dom' 用于 DOM 测试
      globals: true, // 启用全局 API 如 describe/test/expect
      coverage: {
        // 覆盖率配置
        provider: "c8", // 或 'istanbul'
        reporter: ["text", "json", "html"],
      },
    },
  });
  ```

## 基本测试示例

```js
import { describe, it, expect } from "vitest";

// 测试套件
describe("math operations", () => {
  // 测试用例
  it("should add two numbers", () => {
    expect(1 + 1).toBe(2);
  });

  it("should work with async code", async () => {
    const result = await Promise.resolve(1 + 2);
    expect(result).toBe(3);
  });
});
```

## 组件测试示例

```js
import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import MyComponent from "./MyComponent.vue";

describe("MyComponent", () => {
  it("renders properly", () => {
    const wrapper = mount(MyComponent, {
      props: { msg: "Hello Vitest" },
    });
    expect(wrapper.text()).toContain("Hello Vitest");
  });
});
```

## 常用测试功能

### 测试生命周期

```js
import { beforeAll, beforeEach, afterEach, afterAll } from "vitest";

beforeAll(() => {
  // 整个测试套件前执行
});

beforeEach(() => {
  // 每个测试用例前执行
});

afterEach(() => {
  // 每个测试用例后执行
});

afterAll(() => {
  // 整个测试套件后执行
});
```

# vue3 源码

## 简易响应式

```js
let activeEffect = null;
let targetMap = new WeakMap();

function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      track(target, key);
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      const oldValue = target[key];
      const result = Reflect.set(target, key, value, receiver);
      if (value !== oldValue) {
        trigger(target, key);
      }
      return result;
    },
  });
}

function track(target, key) {
  if (!activeEffect) {
    return;
  }
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let deps = depsMap.get(key);
  if (!deps) {
    deps = new Set();
    depsMap.set(key, deps);
  }
  deps.add(activeEffect);
}

function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  const deps = depsMap.get(key);
  if (deps) {
    deps.forEach((effect) => {
      effect();
    });
  }
}

function effect(fn) {
  activeEffect = fn;
  fn();
  activeEffect = null;
}
```

# vue 的性能优化手段有哪些

- v-once 只渲染一次，永远不会更新
- v-memo 由于记住模版子树，依赖变化时才重新渲染，类似 react 的 useMemo，但是作用域模版
  - 可以与 v-for 一起使用
    ```js
    <div v-for="item in list" :key="item.id" v-memo="[item.value]">
      {{ item.text }}
    </div>
    ```
- keep-alive
- shallowRef/shallowReactive
- markRaw
- computed
- 组件懒加载
  - vue3 中 defineAsyncComponent
  - vue2 使用 import()动态加载

# v-for 和 v-if 的优先级

- Vue 2：v-for > v-if
- Vue 3：v-if > v-for
  最佳实践是不同时使用，而是用 computed 替代

# vue3 的组合式 api 有很多优秀的工具库，你用过哪些？

- VueUse
  - useAxios，axios+vue 封装
  - useLocalStorage
  - useAnimate
  - useTimeoutFn
  - useIntervalFn
  - useMouse
  - watchDebounced
  - watchOnce
  - refDebounced
