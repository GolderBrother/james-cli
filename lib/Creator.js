const Util = require('util');
const Inquirer = require('inquirer');
const path = require('path');
const { fetchRepoList, fetchTagList } = require('./request');
const { wrapLoading } = require('../src/utils');
// 用来下载git资源，不支持promise
const downloadGitRepo = require('download-git-repo');
class Creator {
    constructor(projectName, targetDir) {
        this.name = projectName;
        this.target = targetDir;
        // 此时这个方法就是一个promise方法了
        this.downloadGitRepo = Util.promisify(downloadGitRepo);
    }
    async fetchRepo() {
        // 失败重新拉取
        const repos = await wrapLoading(fetchRepoList, 'waiting fetch template');
        if (!repos) return;
        repos = repos.map(item => item.name);
        const { repo } = Inquirer.prompt({
            name: 'repo',
            type: 'list',
            choices: repos,
            message: 'please choose a template to create project'
        });
        return repo;
    }
    async fetchTag(tag) {
        const tags = await wrapLoading(fetchTagList, 'waiting fetch tag', repo);
        if (!tags) return;
        tags = tags.map(item => item.name);
        const { tag } = Inquirer.prompt({
            name: 'tag',
            type: 'list',
            choices: tags,
            message: 'please choose a template to create project'
        });
        return tags;
    }
    async download(repo, tag) {
        // 这里我们将文件下载到当前用户下的.template文件中,由于系统的不同目录获取方式不一样,process.platform 在windows下获取的是 win32 我这里是mac 所有获取的值是 darwin,在根据对应的环境变量获取到用户目录
        // const downloadDirectory = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.template`;
        // 1. 需要拼接出下载路径出来
        const requestURL = `zhu-cli/${repo}${tag ? `#${tag}` : ''}`;
        // 2. 把资源下载到某个路径上(后续可以增加缓存功能，应该是下载到系统目录中，稍后可以在使用 ejs、handlebar 去渲染模板 最后生成结果 再写入)

        // 放入到系统目录中 -> 模板和用户的其他选择 -> 生成结果放到当前目录下
        await wrapLoading(downloadGitRepo(requestURL, path.resolve(process.cwd(), `${repo}@${tag}`)));
        return this.target;
    }
    async create() {
        // 真实开始创建了
        // (1) 先去拉取当前组织下的模板
        const repo = await this.fetchRepo();
        // (2) 在通过模板找到版本号
        const tag = await this.fetchTag();
        // (3) 下载
        await this.download();

    }
}
module.exports = Creator;