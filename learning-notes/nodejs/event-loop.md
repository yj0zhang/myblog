node event loop 阶段：

![image](https://github.com/yj0zhang/myblog/blob/master/learning-notes/images/1557737245000.jpg)

*主要理解timers、poll和check阶段*

* timers阶段，执行setTimeout() 和 setInterval()的回调
* pending calbacks阶段，执行延迟到下一个循环迭代的 I/O 回调(对某些系统操作（如 TCP 错误类型）执行回调)
* idle, prepare阶段，node内部调用
* poll阶段，轮询阶段，执行close callbacks的异常，timers阶段产生的异步任务和setImmediate()
* check阶段，执行setImmediate()的回调
* close callbacks阶段，执行一些close callbacks

每个阶段都有一个FIFO（先进先出）队列，event loop在进入一个阶段后，先按照顺序执行这个队列的操作，直到队列耗尽或者达到了node的回调限制，就进入下个阶段。
在每次运行的event loop之间，Node.js 检查它是否在等待任何异步 I/O 或计时器，如果没有的话，则关闭干净（关闭什么？）。原文如下：
> Between each run of the event loop, Node.js checks if it is waiting for any asynchronous I/O or timers and shuts down cleanly if there are not any.

*****

轮询 阶段有两个重要的功能：

+ 计算应该阻塞和轮询 I/O 的时间。
+ 然后，处理 轮询 队列里的事件。

当事件循环进入 轮询 阶段且 _没有计划计时器时_，将发生以下两种情况之一：

- _如果 轮询 队列 不是空的_，事件循环将循环访问其回调队列并同步执行它们，直到队列已用尽，或者达到了与系统相关的硬限制。
- _如果 轮询 队列 是空的_，还有两件事发生：

> - 如果脚本已按 setImmediate() 排定，则事件循环将结束 轮询 阶段，并继续 检查 阶段以执行这些计划脚本。
> - 如果脚本 尚未 按 setImmediate()排定，则事件循环将等待回调添加到队列中，然后立即执行。

一旦 轮询 队列为空，事件循环将检查 _已达到时间阈值的计时器_。如果一个或多个计时器已准备就绪，则事件循环将绕回计时器阶段以执行这些计时器的回调。


参考：https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/
