# react 常见面试题

# 基础题

## react 如何创建工程环境(js, ts)，eject 的作用是什么？

- 使用`npx create-react-app demo-app`创建 js 项目
  - 如果全局未安装 create-react-app，需要使用 npx 临时去拉取
  - 或者先全局安装：`npm i create-react-app -g`，再`create-react-app demo-app`
- 使用`npx create-react-app demo-app-ts --template typescript`创建 ts 项目
- `npm run eject`可以把 webpack 配置显示出来，修改配置，这个过程是不可逆的
- `npx create-react-router@latest react-router-demo-app`创建一个带 router 的项目

## 除了 eject，还有什么方式可以修改 react 项目的打包配置

- 使用@craco/craco，根目录创建 craco.config.js，在内部修改 webpack 配置
- 如果使用 vite，直接在 vite.config.js 中修改

## react 组件有哪些声明方式

- 两种方式：函数式组件和类组件
  - 函数式组件用 hook 管理状态，返回 jsx 作为渲染模版，没有生命周期钩子（可以使用 useEffect 模拟生命周期）；
  - 类组件的状态是实例属性，使用返回 jsx 的 render 方法渲染模版，有生命周期钩子
- 函数式组件
  ```js
  import React, {Component} from 'react';
  function FuncCom () {
      const [num, setState] = useState(0);
      handleClick = useCallback(() => {
          setState(num => num - 1)
      })
      return
          <>
              <div>{state.num}</div>
              <button onClick={handleClick.bind(this)}>+</div>
          </>
  }
  ```
- 类组件
  ```js
  import React, {Component} from 'react';
  class ClassCom extends Component {
    state = {
        num: 0
    }
    handleClick = () => {
        this.setState({
            num: this.state.num - 1
        })
    }
    render() {
        return (
            <>
                <div>{this.state.num}</div>
                <button onClick={this.handleClick}>+</div>
            </>
        )
    }
  }
  ```

## react 常见的 hook 有哪些

### 官方的 hooks：

- useState
- useRef
  - 引用一个可变的对象，返回{current: value}
- useInsertionEffect
  - 比 useLayoutEffect 的时机提前一点，也是同步的，主要用于 css-in-js 库
- useLayoutEffect
  - 比 useEffect 的时机提前一点，是同步的
- useEffect
  - 是异步的，根据依赖值的变化执行
  - 模拟各种生命周期
- useCallback
  - 返回一个可缓存的函数
- useMemo
  - 返回一个可缓存的值，作为一种优化手段
- useReducer
  - 管理复杂的状态，通过 action 定义状态变化，更加可控
- useContext
  - 构建上下文，生产消费的模式
- useImpretiveHandle
  - 一般和 forwardRef 使用，把子组件的方法转发给父组件，让父组件可以调用子组件的方法(功能类似 vue3 的 defineExpose)

### 第三方的 hook 库

- ahook
- react-use

### 第三方库提供的 hook

#### react-router-dom

- useLocation
- useNavigate

## react 常见的生命周期有哪些

### 初始化阶段

- `constructor`
- `getDerivedStateFromProps`
  - 静态函数，当作一个纯函数使用
  - 传入 props 和 State，返回值会合并之前的 state，作为一个新的 State
- `componentWillMount`
  - 在此阶段可以预请求接口
  - 如果组件中已经有了`getDerivedStateFromProps`，那么则不会执行`componentWillMount`
- `componentDidMount`

### 更新阶段

- `componentWillReceiveProps`
  - props 发生变化的时候，这里会执行
  - 如果组件中已经有了`getDerivedStateFromProps`，那么则不会执行`componentWillReceiveProps`
  - 组件更新的时候，如果被执行时，同时进行了 setState，是不会再次重新执行的
- `shouldComponentUpdate`
  - 相当于一个拦截器，返回值是一个 bool，决定组件要不要更新
  - `shouldComponentUpdate`的 nextSatte，是能够拿到`getDerivedStateFromProps`生命周期所更新的内容
- `componentWillUpdate`
- `render`
- `getSnapShotBeforeUpdate`
  - 更新之前的快照，参数有 prevProps, prevState
- `componentDidUpdate`
  - 如果在这个生命周期中进行 setState，会造成组件死循环

### 销毁阶段

- `componentWillUnmount`
  - 对闭包，定时器，事件管理做销毁

## 函数式组件是如何模拟生命周期的

    ```js
    import React, {Component} from 'react';
    function LifeCycle (props) {
        const [state, setState] = useState(() => {
            console.log('getDerivedStateFromProps');
            return ''
        });
        //依赖是空数组，只在挂载时执行
        useEffect(() => {
            console.log('componentDidMount');
            //数据请求等异步操作

            //销毁函数
            return () => {
                console.log('componentWillUnMount')
            }
        }, []);
        useEffect(() => {
            console.log('componentWillReceiveProps')
        }, [props]);
        const prevPropRef = useRef();
        //没有依赖，每次更新时执行（包括挂载）
        useLayoutEffect(() => {
            prevPropRef.current = props;
            console.log('componentDidUpdate')
        });
        //使用useRef获取上一次的props
        const prevProp = prevPropRef.current;
        return
            <div>
                LifeCycle
            </div>
    }
    ```

## 如果使用 hooks，通过数据接口访问数据

```js
const [state, setState] = useState([]);
useEffect(() => {
  axios(`url`).then((res) => setState(res));
}, []);
```

## hooks 的使用，有哪些注意事项

- 只能在函数式组件顶层使用，不能写在循环、条件或者其他普通函数中
  - 因为 react 内部 hook 是存储在链表中的，每次更新要求顺序一致
- 不能在普通的 js 函数中使用，只能在函数式组件和 use 开头的函数(useXXX)中使用（自定义 hook）

## 为什么会有 hooks

- 解决组件之间复用状态逻辑的问题
- 复杂组件会变得难以理解
  - 类组件会有很多复杂的生命周期等问题
- 难以理解的 class（this）?
  - 事件绑定时的函数，如果是用 function 定义，this 需要重新绑定

## react 是如何获取组件对应的 DOM 元素的

- 函数式组件使用 useRef
- 类组件使用 createRef

## 什么是状态提升，父子组件如何通信

- 把状态和修改状态的方式通过 props 的形式，从父组件传递到子组件，就是把状态提升到了父组件，此时父组件的其他子组件也可以获取到这个状态及其修改方法
- 通过 props 通信

# 中等题

## 你用的 react 是哪个版本，react 的版本有什么区别？

### 16.8 以前

- react 内部是 stack reconciler，组件更多是 class 写法

### 17

- 引入了 fiber reconciler
  - 解决了递归产生的爆栈问题
- 17.0.2 为主的版本下
  - legacy 模式，create-react-app 创建的项目默认的模式
    - 没有高优先级任务打断低优先级的机制
  - concurrent 模式，支持高优先级任务打断低优先级的机制

### 18

- 支持高优先级任务打断低优先级的机制

## setState 是同步的还是异步的

```js
import React from "react";
class AsyncState extends React.Component {
  state = {
    count: 0,
  };
  //React有个概念叫batchUpdate（异步批量更新）
  //在17中，settimeout不在批量更新队列中，它是同步执行的
  handleClick = () => {
    // 版本17中输出的都是0，是异步的
    // 版本18中输出的都是0，是异步的
    this.setState({ count: 1 });
    console.log("this.state.count: ", this.state.count);
    this.setState({ count: 2 });
    console.log("this.state.count: ", this.state.count);
    setTimeout(() => {
      // 版本17中输出的是3、 4，是同步的
      // 版本18中输出的都是2，是异步的
      this.setState({ count: 3 });
      console.log("this.state.count: ", this.state.count);
      this.setState({ count: 4 });
      console.log("this.state.count: ", this.state.count);
    }, 0);
  };
}
```

## 如何实现 vue 中的 expose 的能力？

- 比如某一个状态需要父子组件同时控制
  - use props for state
  - child components expose
  ```js
  // forwardRef允许子组件接收ref属性，并传递给内部的方法，
  // useImperativeHandle定义需要暴露给父组件的方法和属性
  // forwardRef在19版本中已经弃用，ref作为一个prop传递
  import { useRef, useImperativeHandle, forwardRef } from "react";
  //ref是父组件传递过来的
  const MyInput = (props, ref) => {
    const inputRef = useRef();
    const focus = () => {
      inputRef.current.focus();
    };
    const changeText = (val) => {
      inputRef.target.value = val;
    };
    useImperativeHandle(ref, () => ({
      //暴露给父组件
      focus,
      changeText,
    }));
    return (
      <div>
        <input ref={inputRef} />
      </div>
    );
  };
  const FancyInput = forwardRef(MyInput);
  function Expose() {
    const exposeRef = useRef(null);
    return (
      <div>
        <button onClick={() => exposeRef.current.changeValue("cc")}>
          changeText
        </button>
        <button onClick={() => exposeRef.current.focus()}>focusInput</button>
        <FancyInput ref={exposeRef} />
      </div>
    );
  }
  ```

## useLayoutEffect

### useLayoutEffect 和 useEffect 有什么区别

- useEffect 的 cb 是异步调用的，会等主线程任务执行完成：DOM 更新，JS 执行完成，视图绘制完成，才执行
- useLayoutEffect 的 cb 是同步执行的，执行时机时 DOM 更新之后，视图绘制完成之前；这个时间可以更方便的修改 DOM，但是会导致重新绘制。
  如果要改 DOM，用 useLayoutEffect，否则用 useEffect

### useInsertionEffect

- useInsertionEffect 是在 DOM 更新前执行的。
- 本质上 useInsertionEffect 主要解决 css-in-js 在渲染中注入样式的问题，确保在 useLayoutEffect 之前插入样式规则。

顺序： useInsertionEffect -> DOM 更新 ->useLayoutEffect -> 视图绘制 -> useEffect

### 从执行时机来看，哪个和 componentDidMount、componentDidUpdate 更接近

- componentDidMount、componentDidUpdate 是同步的，所以 useLayoutEffect 更接近

## 什么是 HOC，以及常用的方式？

hoc(High-Order Component) 高阶组件，是 react 中复用组件逻辑的高级技术，它是一个函数，接收一个组件作为参数，返回一个新组件；适用于复用组件，增强组件功能，渲染劫持等。

- 日志输出
- 权限校验

## 如何实现一个 withRouter

HOC 结合 useContext 实现

```js
import { createContext } from "react";
const NavContext = createContext(null);
const history = window.history;

const withRouter = (Component) => {
  return function WithRouterComponent() {
    const history = useContext(NavContext);
    return <Component history={history} />;
  };
};
const Child = () => {
  return (
    <div>
      <button onClick={() => history.pushState({}, undefined, "/hello")}>
        {" "}
        to hello
      </button>
    </div>
  );
};
const ChildRouter = withRouter(Child);
function FuncComRouter() {
  return (
    <NavContext.provider value={history}>
      <ChildRouter />
    </NavContext.provider>
  );
}
```

## react-router-dom v6 提供了哪些新的 API

- Route 添加了新语法，v5 的 component 或者 render，变成了 element
- Routes 替代了 Switch
- 添加了 Outlet 用于渲染子路由
- useNavigate 替代了 useHistory
- ...

## render props 是什么？

render props 是一个函数属性，通常命名为 render，可以把父组件中的状态通过 render 传递到子组件，实现逻辑复用，把逻辑和渲染分离，父组件负责计算，子组件负责根据计算结果渲染

## 为什么现在 react 组件中不需要写`import React from 'react'`了

对于 react 来说，解析 jsx 语法，主要依靠 babel
@babel/preset-react

- @babel/plugin-syntax-jsx
- @babel/plugin-transform-react-jsx

@babel/preset-react 的`runtime: classic`模式中，在编译 react 代码时，最终会把 jsx 转换成 React.createElement 方法，这里 React 需要引入才能用。
现在@babel/preset-react 新增了`runtime: automatic`模式，在编译时，会自动引入 jsx 的处理方法，所以写代码时不需要再手动引入了

# react Fiber 架构

## 什么是 Fiber

- Fiber 是 react17.x 引入的一个数据结构，本质上是为了把 stack reconciler 替换为 fiber reconsiler
- 每个 React 元素都对应一个 Fiber 节点，本质是一个对象
- 核心特性是：
  - 可中断工作，使用时间切片切分任务
  - 双缓存机制
  - 链表结构
- Fiber 让 react 可以：
  - 跳过不必要的渲染：通过优先级调度
  - 批量更新：合并多个 setState 调用
  - 后台预渲染：在不阻塞主线程的情况下准备更新

```js
const FiberNode = {
    tag,//标识是什么类型的Fiber
    key,
    type,//dom元素的节点
    //构建链表的节点
    return,//指向父节点
    child,//指向第一个子节点
    sibling,//指向右边的第一个兄弟节点
    //判断是否要更新的属性
    pendingProps,//新props
    memorizeProps,//当前props
    updateQueue,//状态更新队列
    memorizedState,//当前state
    //effect副作用链
    effectTag,
    nextEffect,
    firstEffect,
    lastEffect,
    //双缓存属性
    alternate,
    //对应真实的DOM节点
    stateNode,
    //调度优先级
    Lanes,
    childLanes
}
```

## 说说 stack reconciler 和 fiber reconsiler

dom 是一颗树，stack reconciler 是使用递归方式遍历这颗树的，而 fiber reconciler 是通过 child, return,sibling 建立了节点间的关系完成遍历的，不需要递归

## react 中有哪几种数据结构，分别是干什么的？

- 四种
  - v-dom / element
    - 是函数组件执行的返回值，或者类组件 render 函数的返回值
    - 本质是一个大的对象
  - current fiber
    - 当前 react 内存中，表示当前数据状态的核心数据结构
  - workInProgress fiber
    - 状态更新时生成的，在 render 阶段完成调和，commit 阶段更新之后，会被切换成 current fiber
  - 真实的 DOM
- react 调和的过程，就是 current fiber 和 v-dom 对比，生成子组件的 workInProgresss fiber 的过程

## react 更新的流程

分为 render 阶段和 commit 阶段，render 阶段是异步可中断的

### beginWork

- 使用 v-dom 和 current fiber 去生成子节点的 workInProgress Fiber
  - 期间会执行函数组件，类组件，diff 子节点
  - 得到需要变更的节点，打上 effectTag
    - 增 palcement 0010
    - 删 deletion 1000
    - 改 update 0100
    - 增和改 placementAndUpdate 0110

### completeWork

- 向上走
- 把所有有 effectTag 的元素，串联成一个 effectList（从上到下）
- 在内存中，构建真实 DOM，不挂载在界面上

### commitWork

- commitBeforeMutationEffect
  - 执行副作用的卸载清理函数
  - getSnapshotBeforeUpdate 生命周期
- commitMutationEffects
  - 处理 effectList
  - 把 dom 更新应用到浏览器
  - 把 workInProgress Fiber 切换成 current Fiber
- commitLayoutEffects
  - 同步执行 useLayoutEffect, componentDidMount, componentDidUpdate
- scheduleEffectWork 异步调度 useEffect

## 什么是闭包陷阱？怎么解决？

闭包陷阱有一种情况是在 useEffect 中使用定时器或监听器，回调函数中拿到的状态是旧的。
因为 react 在每次渲染时，hook 都会创建一个新的闭包，如果函数组件内使用定时器等方法捕获了状态，这个状态可能不会更新，因此在异步操作或回调函数中，可能会遇到闭包陷阱。

- useEffect 闭包
  ```js
  const UseEffect = () => {
    const [num, setNum] = useState(0);
    const handleClick = () => {
      setNum(num + 1);
    };
    useEffect(() => {
      const timer = setInterval(() => {
        console.log(num); //始终是0，拿不到最新值
      }, 1000);
      return () => {
        clearInterval(timer);
        timer = null;
      };
    }, []); //只在挂载时执行
    return (
      <div>
        <span>{num}</span>
        <button onClick={handleClick}>+</button>
      </div>
    );
  };
  function Closure() {
    return (
      <div>
        闭包陷阱
        <UseEffect />
      </div>
    );
  }
  ```
  解决办法：
- 把状态添加到依赖数组中
- 使用 useRef 保存最新值
- 更新状态时，使用函数式更新：setState(state => state)
- 如果闭包陷阱出现在回调函数中，使用 useCallback 包裹函数，并正确设置依赖数组

## react 中如何实现渲染控制（useMemo）

```js
const Child = (num) => {
  console.log("子组件执行");
  return <div>this is child -- {num}</div>;
};
class Parent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      num: 0,
      count: 0,
    };
  }
  render() {
    const { num, count } = this.state;
    return (
      <div>
        {/* 不管点count还是num，子组件都会执行 */}
        <Child num={num} />
        <button onClick={() => this.setState({ num: num + 1 })}>+ num</button>
        <button onClick={() => this.setState({ count: count + 1 })}>
          + count
        </button>
      </div>
    );
  }
}

class RenderControlParent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      num: 0,
      count: 0,
    };
    this.component = <Child num={this.state.num} />;
  }
  // 这样控制后，count变化，子组件不会在执行
  controlRender = () => {
    const { props } = this.component;
    if (props.num !== this.state.num) {
      return (this.component = React.cloneElement(this.component, {
        num: this.state.num,
      }));
    }
    return this.component;
  };
  render() {
    const { num, count } = this.state;
    return (
      <div>
        {this.controlRender()}
        <button onClick={() => this.setState({ num: num + 1 })}>+ num</button>
        <button onClick={() => this.setState({ count: count + 1 })}>
          + count
        </button>
      </div>
    );
  }
}
```

## 如何实现一个 redux

```js
const createStore = function (reducer, initState) {
  let state = initState;
  let listeners = [];
  function subscribe(handler) {
    listeners.push(handler);
  }
  function dispatch(action) {
    const currentState = reducer(state, action);
    state = currentState;
    listeners.forEach((handler) => {
      handler();
    });
  }
  function getState() {
    return state;
  }
  return {
    subscribe,
    dispatch,
    getState,
  };
};
// const reducer = combineReducer({
//   a: AReducer,
//   b: BReducer
// })
// const state = {
//   a: XXX,
//   b: XXX
// }
const combineReducer = (reducers) => {
  const keys = Object.keys(reducers);
  return function (state = {}, action) {
    const nextState = {};
    keys.forEach((key) => {
      const reducer = reducers[key];
      const next = reducer(state[key], action);
      nextState[key] = next;
    });
    return nextState;
  };
};
```

## useRoutes 的原理是什么？

useRoutes 是把一堆 jsx 转换为用配置，使用该配置返回原来的 jsx

```js
import React from 'react'
import {BrowserRouter} from 'react-router'

const createRoutesFromChildren = children => {
  let routes = [];
  React.Children.forEach(children, node => {
    let route = {
      path: node.props.path,
      element: node.props.element
    }
    if(node.children) {
      route.children = createRoutesFromChildren(node.children)
    }
    routes.push(route)
  })
  return routes;
}
const useRoutes = (routes) => {
  let location = useLocation();
  let currentPath = location.pathname || '/';
  let ret = [];
  functio matchRoutes(list) {
    for(let i = 0; i < routes.length; i++) {
      let {path, element} = routes[i];
      let match = currentPath.match(new RegExp(`^${path}`));
      if(match) {
        ret.push(element);
        if(element.children) {
          const childMatch = matchRoutes(element.children);
          childMatch && ret.push();
        }
        return element;
      }
    }
  }
  matchRoutes(routes);
  return ret[ret.length - 1];
}

const Routes = ({children}) => useRoutes(createRoutesFromChildren(children));

return <BrowserRouter>
  <Routes>
    <Route/>
  </Routes>
</BrowserRouter>
```

## react18 为什么选择 messageChannel 来让出执行权？

### 浏览器

- 帧率：动画或视频或页面，是一帧一帧的图片组合得到的
- 一般浏览器是 60 帧，即 1 秒切换 60 次，16.666ms 一帧
- 人的眼睛，一般 20 帧左右，就可以感觉到比较流畅的动画了，

### 浏览器在一帧里，做了哪些事情呢？

| ------------------------------ 16.666ms ------------------------------ |
| 宏任务 | 微任务 | requestAnimationFrame | layout | requestIdleCallback
这些任务在一帧里完成，但是前面宏任务可能前面的任务时间太长，layout 不执行，就会卡顿

### messageChannel

假设宏任务可以做时间切片，每片占用的时间不长，就不会影响 layout 执行，解决卡顿问题。
后续的切片交给谁呢？

- promise 是微任务，还是会占用当前帧的时间
- setTimeout 如果处于递归循环的话，会有 4ms 的延迟
- requestIdleCallback 有兼容性问题，和 50ms 渲染问题
  - 即使浏览器处于空闲状态，单个 requestIdleCallback 任务的执行时间也不应超过 50ms。如果超过这个时间，浏览器可能会中断任务执行以确保主线程不被长时间阻塞。
  - requestIdleCallback 执行时间不可靠，最多 50ms，可能不到
    综上，不占用当前帧的时间，且无副作用的，就是用 messageChannel 交给下一个宏任务

## react 性能优化的方式

- React.memo，用于函数式组件，避免在 props 不变的时候重新渲染
- PureComponent，用于类组件，自动对 props 和 state 进行浅比较（也可自定义渲染），避免不必要的渲染
- 在修改引用类型的状态时，避免直接修改状态，需要通过 setState 设置一个新的状态
- 使用 useCallback 和 useMemo
- 使用 useEffect 的销毁方法，清理副作用
- 使用 key 优化列表
- 避免内联函数和对象，在 jsx 中直接定义函数或者对象，会导致每次渲染时创建新的引用，导致不必要的渲染
- 使用 Context 时，如果 Provider 的值发生变化，所有消费该 Context 的组件都会重新渲染，
  - 需要拆分成小的 Context
  - 使用 useMemo 或 useCallback 优化 Context 的值
- 渲染长列表时，使用虚拟滚动技术
- 懒加载组件，React.lazy 和 Suspense
- 避免不必要的 dom 操作，使用 css 动画代替 js 动画
- 代码分割
  - 通过 import 结合 webpack，实现代码分割
  - 路由懒加载，结合 React.lazy、Suspense 和 React router 实现路由级别的代码分割
- Tree Shaking
- 压缩图片和资源
- 性能分析工具
  - React DevTools Profiler: 分析组件的渲染性能
  - Chrome DevTools Performance: 分析 js 执行性能
  - Lighthouse: 分析应用的加载性能
