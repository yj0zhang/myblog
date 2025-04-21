# 什么是 redux，redux 的三大基础原则是什么

- redux 是用于 javascript 的状态可预测的管理库。
- 三大基础原则如下
  - 单一数据源，整个应用的状态存储在单个 store 中
  - 数据是只读的，只能通过 actions 修改
  - 只能使用纯函数修改状态，reducer 是纯函数，接收 action 和旧的 state，返回新的 state

# redux 核心概念有哪些

- action
  - 描述操作类型，和 payload
- reducer
  - 纯函数，接收 action 和旧的 state，返回新的 state
- store
  - 保存应用的状态，提供 dispatch、getState 等方法
- subscribe
  - 订阅状态更新
- middleware
  - 中间件扩展，执行时机在 action 发起后，到达 reducer 之前

# redux 数据流

- 用户点击 UI
- 调用 dispatch 触发 action
- redux store 调用 reducer，传入 action 和旧的 state
- reducer 处理后返回新的 state
- store 保存新的 state
- UI 组件通过订阅 store，获取更新并重新渲染

# 你用过哪些 middleware？

- redux-thunk 用于处理异步 action
  - redux-thunk 允许 action 是函数，当 action 是函数时，参数是 dispatch，可以实现异步调用 dispatch
- redux-logger 日志记录

# 为什么 reducer 必须是纯函数

因为 redux 依赖 reducer 的纯函数特性来实现以下功能：

- 时间旅行调试（可预测的状态变化）
- 状态比较（避免不必要的重新渲染）
- 测试方便（相同的输入总是产生相同的输出）

# react-redux 中，connect 的作用是什么

connect 是高阶组件，封装了如下功能

- 将 store 中的 state 和 action 作为 props 传递给子组件
- 自动处理 store 的订阅和取消订阅

# useSelector 和 useDispatch 的作用？

- useSelector 从 store 中提取 state
- useDispatch 获取对 dispatch 的引用

# redux 的性能优化

- 避免不必要的重复渲染
  - 用 React.memo 包裹组件
  - 在 mapStateToProps 时，只选择需要的 state
  - 使用 reselect 创建记忆化的 selector
- 状态规范化：避免嵌套数据结构
