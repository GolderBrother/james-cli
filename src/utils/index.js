// 用来在执行命令中创建loading效果的模块
const ora = require('ora');
async function sleep(n = 0) {
    return new Promise((resolve, reject) => setTimeout(resolve, n));
}
// 在执行命令中创建loading效果
async function wrapLoading(fn, message, ...args) {
    const spinner = ora(message);
    //开启加载
    spinner.start();
    try {
        const repos = await fn(...args);
        spinner.succeed();
        return repos;
    } catch (error) {
        // 资源下载失败，隔1秒后重新下载
        spinner.fail('request failed, refetch...');
        await sleep(1000);
        return wrapLoading(fn, message, ...args);
    }
}

module.exports = {
    sleep,
    wrapLoading
}

