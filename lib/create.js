const path = require('path');
const fsExtra = require('fs-extra');
// 命令行交互专用
const Inquirer = require('Inquirer');
const Creator = require('./Creator');
const config = require('./config');
const repoUrl = config('getVal', 'repo');
module.exports = async function (projectName, options) {
    // 创建项目
    console.log(projectName);
    console.log(options);
    // { force: true }
    // 获取当前命令执行时的工作目录
    const cmd = process.cwd();
    // 目标目录
    const targetDir = path.join(cmd, projectName);
    if (fsExtra.existsSync(targetDir)) { // 如果目录已存在
        if (options.force) {  // 如果强制创建, 那就删除已有的
            await fsExtra.remove(targetDir);
        } else {
            // 提示用户是否确定要覆盖
            const { action } = await Inquirer.prompt([ // 配置询问的方式
                {
                    name: 'action',
                    type: 'list', // 类型非常丰富
                    message: 'Target directory already exists Pick an action:',
                    choices: [
                        {
                            name: 'Overwrite',
                            value: 'overwrite'
                        },
                        {
                            name: 'Cancel',
                            value: false
                        }
                    ]
                }
            ]);
            if (!action) return;
            else if (action === 'overwrite') {
                console.log(`\r\n Removing...`);
                // 删除目录
                await fsExtra.remove(targetDir);
            }
        }
    }
    // 创建项目
    const creator = new Creator(projectName, targetDir);
    // 开始创建项目 
    creator.create();
}