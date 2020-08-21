console.log('james-cli~~');
// (1) 配置可执行命令
const program = require('commander');
// 用粉笔画出五颜六色的世界~
const chalk = require('chalk');
const { name, version } = require('./utils/constants');

cli的核心功能:
// 1. 创建项目 2. 更改配置文件 3. ui界面: @vue/cli

const cleanArgs = cmd => {
    const args = {};
    cmd.options.forEach(option => {
        // option.long: '--force',
        const key = option.long.slice(2);
        if (cmd[key]) args[key] = cmd[key];
    });
    return args;
}
const actionsMap = {
    create: { // 创建模板
        description: "create project",
        alias: "cr",
        examples: [
            'james-cli create <template-name>'
        ]
    },
    config: { // 配置配置文件
        description: 'config info',
        alias: 'c',
        examples: [
            //  [] 数组是可选 <> 是必填
            'james-cli config get <key>',
            'james-cli config set <key> <value>'
        ]
    },
    // 什么都匹配不到走这里
    '*': {
        description: 'command not found',
        alias: 'not found',
    }
};

// 循环创建命令
// Object.keys(actionsMap).forEach(action => {
//     program
//         .command(action)  // 命令的名称
//         .alias(actionsMap[action].alias)  // 命令的别名
//         .description(actionsMap[action].description) // 命令的描述
//         .action(() => { // 命令行的动作
//             console.log(action);

//         });
// });

// 万一重名了呢？  那就强制创建的模式
program.command('create <app-name>')
    .description('create a new project')
    .option('-f, --force', 'overwrite target directory if it exists')
    .action((name, cmd) => {
        // 这边使用策略模式， 调用create模块去创建
        const create = require('../lib/create');
        create(name, cleanArgs(cmd));
    });


program.command('config [value]')
    .description('inspect and modify the config')
    .option('-g, --get <path>', 'get value from option')
    .option('-s, --set <path> <value>')
    .option('-d, --delete <path>', 'delete option from config')
    .action((value, cmd) => {
        console.log(value, cleanArgs(cmd));
    });

program.command('ui')
    .description('start and open james-cli ui')
    .option('-p, --port <port>', 'Port used for the UI Server')
    .action((cmd) => {
        // 这边可以调用UI模块来实现
        console.log(cleanArgs(cmd));
    });

program.on('--help', () => {
    console.log('Examples');
    // Object.keys(actionsMap).forEach(action => {
    //     (actionsMap[action].examples || []).forEach(example => {
    //         console.log(` ${example}`);
    //     })
    // });
    console.log();
    console.log(`Run ${chalk.cyan(`james-cli <command> --help`)} show details`);
    console.log();
});

// 这个版本号应该使用的是当前cli项目的版本号，我们需要动态获取
program.version(`${name}@${version}`)
    // process.argv就是用户在命令行中传入的参数
    .parse(process.argv);


// 解析用户执行命令传入的参数
program.parse(process.argv);