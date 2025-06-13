# 什么是 css variable

css3 中可以定义变量，来规定统一的颜色、尺寸等样式

# 使用 css variable 实现主题色切换

## 定义 css 变量

在全局 css 中定义主题变量：

```css
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --bg-color: #ffffff;
  --text-color: #333333;
}
/**暗色主题，覆盖默认主题 */
[data-theme="dark"] {
  --primary-color: #9b59b6;
  --secondary-color: #1abc9c;
  --bg-color: #222222;
  --text-color: #ffffff;
}
```

在组件中使用变量：

```css
.header {
  color: var(--text-color);
}
```

用 javascript 切换主题，通过修改`document.dodumentElement`的 dataset 来切换主题：

```js
//切换到暗色主题
document.documentElement.setAttribute("data-theme", "dart");
//切换回默认主题
document.documentElement.removeAttribute("data-theme");
```
