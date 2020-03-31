### 问题

　　> 浏览器机制的原因，在 iframe 导航变化后手动点击浏览器的后退按钮也依然只是后退 iframe 中的导航。
　　> 但是我只想让父页面后退，并不想让 iframe 后退，但在改变了 iframe 的 src 后就达不到这样的效果。

### 解决
　　> 不要修改 iframe.src，而是删除旧 iframe 元素，新建一个 iframe 元素并替换它，这样不会产生 history。
　　> 直接 createElement，替换原来的 iframe。
