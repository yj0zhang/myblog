;(async () => {
    for(let i = 0; i < 10; i ++) {
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(i)
                resolve()
            }, 1000);
        })
        console.log('等了')
    }
})();