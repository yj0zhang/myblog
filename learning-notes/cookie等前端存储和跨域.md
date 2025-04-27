# cookie 是什么

cookie 是浏览器保存的一小块数据，一般不超过 4kb 大小，可以长期有效

# cookie 有哪些属性

- Name 和 Value，键值对
- Domain，所属域名
- Path，所属路径
- Expires 过期时间
- HttpOnly 禁止脚本访问，只能在 http 请求头上
- Secure 仅能通过 https 传输
- SameSite 限制跨站请求时，cookie 的发送

# 如何实现跨域

cookie 遵循同源策略，只能由设置它的域名及其子路径访问
同源：协议、域名、端口都一样才是同源

- 服务端要设置:
  - Access-Control-Allow-Origin 域名
  - Access-Control-Allow-Method 方法
  - Access-Control-Allow-Credential 需要带 cookie
- 前端设置
  - credentials

# localstorage

- 数据永久有效，除非手动清除
- 同一浏览器的所有同源标签页共享
- 大小限制约 5MB，不同浏览器不一样

# sessionstorage

- 数据仅在当前会话期间有效，关闭或退出登录后，数据被清除
- 仅对当前标签页有效，其他同源标签页也无法访问
- 大小限制约 5MB，不同浏览器不一样
