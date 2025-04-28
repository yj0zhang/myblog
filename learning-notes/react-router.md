# react-router 是什么？它的核心作用是什么？

react-router 是 react 应用中实现客户端路由的库，作用是保持 UI 与页面同步，实现无刷新页面导航

# react-router 的三种主要包是什么

- react-router 核心库
- react-router-dom 用于 web 应用
- react-router-native 用于 react-native 应用

# react-router v6 相比于 v5 有哪些重大变化？

- <Switch>替换为<Routes>
- 添加 useRoutes，支持基于 JS 对象配置路由
- 路由定义方式更简洁
- useNavigate 替换 useHistory
  - 新增了导航配置
  ```js
  navigate("/path", {
    replace: true, //替换当前历史记录
    state: { date }, //传递状态
  });
  ```
- 路由嵌套语法变化
  - 子路由嵌套语法更直观，父路由组件中使用 Outlet 渲染子路由
- 相对路径和链接
  - 子路由路径自动相对于父路由
- 新增 useSearchParams
- useParams 更严格，未匹配的参数回返回 undefined 而不是空对象
- Redirect 组件替换为 Navigate 组件

# BrowserRouter 和 HashRouter 的区别

- BrowserRouter 使用 html5 的 history api(pushState/replaceState)，url 更干净
- HashRouter 使用 URL hash，兼容性更好但不够优雅

# <Link>和<NavLink>的区别

- Link 是基本的导航链接
- NavLink 是特殊样式的导航链接，可添加 activeClassName 或 activeStyle

# Routes 组件的作用是什么？

- 取代 v5 中的 Switch 组件
- 自动选择最佳匹配路由
- 必须包裹所有的 Route 组件

# 如何在 react-router v6 中配置动态路由？

```js
<Route path="users/:userId" element={<UserProfile />} />
```

# 如何实现嵌套路由

Route 组件中嵌套子 Route，并在父路由组件中使用 Outlet 组件渲染子路由

```js
// 父路由
<Route path="/dashboard" element={<Dashboard />}>
  {/* 子路由 */}
  <Route path="stats" element={<Stats />} />
  <Route path="settings" element={<Settings />} />
</Route>

// 在 Dashboard 组件中使用 <Outlet /> 渲染子路由
```

# 如何实现 404 页面？

path 可以用通配符，element 是 404 组件

```js
<Route path="*" element={<NotFoundPage />} />
```

# react-router 提供了哪些 hook

- useRoutes 用 JS 对象形式定义路由
- useLocation 访问当前 location 对象
- useNavigate 编程式导航
- useParams 获取路由参数
- useSearchParams 处理 URL 查询参数

# 什么是路由守卫？如何在 react router 中实现？

通过高阶组件或包装 <Route> 实现

```js
// 高阶组件拦截渲染 推荐方式
// 可以实现权限校验，loading效果，错误重定向等功能
function PrivateRoute({ children }) {
  const auth = useAuth();
  const location = useLocation();
  // 重定向时，记录跳转来源
  return auth ? children : <Navigate to="/login" state={{ from: location }} />;
}

// 使用
<Route
  path="/dashboard"
  element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  }
/>;
```

```js
// 包裹Route组件，是v5的风格
function PrivateRoute({ element: Element, ...rest }) {
  const auth = useAuth();

  return (
    <Route
      {...rest}
      element={auth ? <Element /> : <Navigate to="/login" replace />}
    />
  );
}

// 使用方式 (v5风格，v6中不推荐)
<Routes>
  <PrivateRoute path="/profile" element={<Profile />} />
</Routes>;
```

# 如何实现路由懒加载？

使用 React.lazy 和 React.Suspense 组件实现，提供 fallback 和 ErrorBoundary 处理错误

```js
const About = React.lazy(() => import("./About"));

<Route
  path="/about"
  element={
    <React.Suspense fallback={<Loading />}>
      <ErrorBoundary>
        <About />
      </ErrorBoundary>
    </React.Suspense>
  }
/>;
```

# react-router 如何处理滚动恢复？

- 使用<ScrollRestoration>组件
- 手动处理 useLocation 变化

  ```js
  import { useEffect } from "react";
  import { useLocation } from "react-router-dom";
  //自定义hook，unmount时记录每个页面的位置，回归时恢复位置
  export function useScrollMemory() {
    const location = useLocation();
    const scrollPositions = useRef({});
    useEffect(() => {
      const key = location.key;

      // 离开页面时保存位置
      return () => {
        scrollPositions.current[key] = window.scrollY;
      };
    }, [location]);
    useEffect(() => {
      // 返回页面时恢复位置
      const savedPosition = scrollPositions.current[location.key];
      if (savedPosition !== undefined) {
        window.scrollTo(0, savedPosition);
      } else {
        window.scrollTo(0, 0);
      }
    }, [location]);
  }
  // 使用方式
  function App() {
    useScrollMemory();
    // ...
  }
  ```

## vue-router 如何实现滚动恢复？

- 使用类似 react-router 的 scrollBehavior

# 如何实现多语言路由

- 在根路由的 params 中添加 lang 参数，根路由组件中根据参数切换语言环境，路由形式如下：/en/home、/zh/home
