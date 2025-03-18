# react常见面试题

# 基础题
## react如何创建工程环境(js, ts)，eject的作用是什么？
+ 使用`npx create-react-app demo-app`创建js项目
  + 如果全局未安装create-react-app，需要使用npx临时去拉取
  + 或者先全局安装：`npm i create-react-app -g`，再`create-react-app demo-app`
+ 使用`npx create-react-app demo-app-ts --template typescript`创建ts项目
+ `npm run eject`可以把webpack配置显示出来，修改配置，这个过程是不可逆的

## react组件有哪些声明方式
+ 两种方式：函数式组件和类组件，函数式组件用hook管理状态，返回jsx作为渲染模版；类组件的状态是实例属性，使用返回jsx的render方法渲染模版
  
+ 函数式组件
    ```js
    import React, {Component} from 'react';
    function FuncCom () {
        const [num, setState] = useState(0);
        handleClick = useCallback(() => {
            setState(num => num + 1)
        })
        return 
            <>
                <div>{state.num}</div>
                <button onClick={handleClick.bind(this)}>+</div>
            </>
    }
    ```
+ 类组件
  ```js
  import React, {Component} from 'react';
  class ClassCom extends Component {
    state = {
        num: 0
    }
    handleClick = () => {
        this.setState({
            num: this.state.num + 1
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

## react常见的hook有哪些
### 官方的hooks：
  + useState
  + useRef
    + 引用一个可变的对象，返回{current: value}
  + useLayoutEffect
    + 比useEffect的时机提前一点，是同步的
  + useEffect
    + 是异步的，根据依赖值的变化执行
    + 模拟各种生命周期
  + useCallback
    + 返回一个可缓存的函数
  + useMemo
    + 返回一个可缓存的值，作为一种优化手段
  + useReducer
    + 管理复杂的状态，通过action定义状态变化，更加可控
  + useContext
    + 构建上下文，生产消费的模式
  + useImpretiveHandle
    + 一般和forwardRef使用，把子组件的方法转发给父组件，让父组件可以调用子组件的方法(功能类似vue3的defineExpose)
### 第三方的hook库
  + ahook
  + react-use
### 第三方库提供的hook
#### react-router-dom
  + useLocation
  + useNavigate

## react常见的生命周期有哪些
### 初始化阶段
+ `constructor`
+ `getDerivedStateFromProps`
  + 静态函数，当作一个纯函数使用
  + 传入props和State，返回值会合并之前的state，作为一个新的State
+ `componentWillMount`
  + 在此阶段可以预请求接口
  + 如果组件中已经有了`getDerivedStateFromProps`，那么则不会执行`componentWillMount`
+ `componentDidMount`
### 更新阶段
+ `componentWillReceiveProps`
  + props发生变化的时候，这里会执行
  + 如果组件中已经有了`getDerivedStateFromProps`，那么则不会执行`componentWillReceiveProps`
  + 组件更新的时候，如果被执行时，同时进行了setState，是不会再次重新执行的
+ `shouldComponentUpdate`
  + 相当于一个拦截器，返回值是一个bool，决定组件要不要更新
  + `shouldComponentUpdate`的nextSatte，是能够拿到`getDerivedStateFromProps`生命周期所更新的内容
+ `componentWillUpdate`
+ `render`
+ `getSnapShotBeforeUpdate`
  + 更新之前的快照，参数有prevProps, prevState
+ `componentDidUpdate`
  + 如果在这个生命周期中进行setState，会造成组件死循环
### 销毁阶段
+ `componentWillUnmount`
  + 对闭包，定时器，事件管理做销毁


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
## 如果使用hooks，通过数据接口访问数据
```js
const [state, setState] = useState([])
useEffect(() => {
    axios(`url`).then(res=> setState(res))
}, [])
```

## hooks的使用，有哪些注意事项
+ 只能在函数式组件顶层使用，不能写在循环、条件或者其他普通函数中
  + 因为react内部hook是存储在链表中的，每次更新要求顺序一致
+ 不能在普通的js函数中使用，只能在函数式组件和use开头的函数(useXXX)中使用（自定义hook）

## 为什么会有hooks
+ 解决组件之间复用状态逻辑的问题
+ 复杂组件会变得难以理解
  + 类组件会有很多复杂的生命周期等问题
+ 难以理解的class（this）?
  + 事件绑定时的函数，如果是用function定义，this需要重新绑定

## react是如何获取组件对应的DOM元素的
+ 函数式组件使用useRef
+ 类组件使用createRef

## 什么是状态提升，父子组件如何通信
+ 把状态和修改状态的方式通过props的形式，从父组件传递到子组件，就是把状态提升到了父组件，此时父组件的其他子组件也可以获取到这个状态及其修改方法
+ 通过props通信

# 中等题
## 你用的react是哪个版本，react的版本有什么区别？
###  16.8以前
+ react内部是stack reconciler，组件更多是class写法
### 17
+ 引入了fiber reconciler
  + 解决了递归产生的爆栈问题
+ 17.0.2为主的版本下
  + legacy模式，create-react-app创建的项目默认的模式
    + 没有高优先级任务打断低优先级的机制
  + concurrent模式，支持高优先级任务打断低优先级的机制
### 18
+ 支持高优先级任务打断低优先级的机制

## setState是同步的还是异步的
```js
import React from 'react';
class AsyncState extends React.Component {
    state = {
        count: 0,
    }
    //React有个概念叫batchUpdate（批量更新）
    //在17中，settimeout不在批量更新队列中，它是落后于外部的批处理的
    handleClick = () => {
        // 版本17中输出的都是0，是异步的
        // 版本18中输出的都是0，是异步的
        this.setState({count: 1});
        console.log('this.state.count: ',this.state.count);
        this.setState({count: 2});
        console.log('this.state.count: ',this.state.count);
        setTimeout(() => {
            // 版本17中输出的是3、 4，是同步的
            // 版本18中输出的都是2，是异步的
            this.setState({count: 3});
            console.log('this.state.count: ',this.state.count);
            this.setState({count: 4});
            console.log('this.state.count: ',this.state.count);
        }, 0)
    }
}
```

## 如何实现vue中的expose的能力？
+ 比如某一个状态需要父子组件同时控制
  + use props for state
  + child components expose
  ```js
  import { useRef, useImperativeHandle, forwardRef } from 'react';
  //ref是父组件传递过来的
  const MyInput = (props, ref) => {
    const inputRef = useRef();
    const focus = () => {
        inputRef.current.focus();
    }
    const changeText = (val) => {
        inputRef.target.value = val;
    }
    useImperativeHandle(ref, () => ({
        //暴露给父组件
        focus, changeText
    }))
    return (
        <div>
            <input ref={inputRef} />
        </div>
    )
  }
  const FancyInput = forwardRef(MyInput);
  function Expose() {
    const exposeRef = useRef(null);
    return (
        <div>
            <button onClick={() => exposeRef.current.changeValue('cc')}>changeText</button>
            <button onClick={() => exposeRef.current.focus()}>focusInput</button>
            <FancyInput ref={exposeRef}/>
        </div>
    )
  }
  ```

## useLayoutEffect
### useLayoutEffect和useEffect有什么区别
+ useEffect的cb是异步调用的，会等主线程任务执行完成：DOM更新，JS执行完成，试图绘制完成，才执行
+ useLayoutEffect的cb是同步执行的，执行时机时DOM更新之后，试图绘制完成之前；这个时间可以更方便的修改DOM，但是会导致重新绘制。
如果要改DOM，用useLayoutEffect，否则用useEffect

### useInsertionEffect
+ useInsertionEffect比useLayoutEffect更早，useInsertionEffect是在DOM更新前执行的。
+ 本质上useInsertionEffect主要解决css-in-js在渲染中注入样式的问题，确保在useLayoutEffect之前插入样式规则。
  
### 从执行时机来看，哪个和componentDidMount、componentDidUpdate更接近
+ componentDidMount、componentDidUpdate是同步的，所有useLayoutEffect更接近

## 什么是HOC，以及常用的方式？
hoc(High-Order Component) 高阶组件，是react中复用组件逻辑的高级技术，它是一个函数，接收一个组件作为参数，返回一个新组件；
适用于复用组件，增强组件功能，渲染劫持等。

## 如何实现一个withRouter