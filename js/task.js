const task = (function () {
  async function asy1() {
    console.log(1);
    await asy2();
    console.log(2);
  }
  const asy2 = async () => {
    await console.log(0);
    await Promise.resolve().then(() => {
      console.log(9);
    });
    await setTimeout(() => {
      Promise.resolve().then(() => {
        console.log(3);
      });
      console.log(4);
    }, 0);
  };
  const asy3 = async () => {
    Promise.resolve().then(() => {
      console.log(6);
    });
  };
  asy1();
  console.log(7);
  asy3();
})();
export default task;
//1. 主进程执行，asy1的第一行，输出1
//2. asy1第二行遇到了await，执行asy2，输出第一行的0，由于这里也有await，
// 执行完直接返回，回到主进程，此时微任务队列中有主进程、asy1的promise、asy2的promise
//3. 主进程输出7
//4. 主进程执行asy3，执行后，then中的回调（6）放入微任务，主进程结束
//5. asy1在等待asy2，接着执行asy2的第二行，把then中的回调（9）放入微任务，返回等待（重新入队，9后面）
//6. 输出6，输出9
//7. 此时接着执行ayn2的第三个await，把timeout的回调放入宏任务队列
//8. 至此asy2执行完毕，asy1接着往下执行，输出2
//9. 微任务队列已执行完毕，执行宏任务队列的第一个，把3放入微任务队列，输出4
//10. 最后输出3
