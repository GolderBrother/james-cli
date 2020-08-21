// 通过axios来获取结果
const axios = require('axios');
axios.interceptors.response.use(res => res.data);

// 获取git资源列表
async function fetchRepoList() {
    // 这边可以通过配置文件 拉取不同的仓库对应的用户下的文件
    return axios.get('https://api.github.com/orgs/zhu-cli/repos');
}

// 获取git tag列表
async function fetchTagList(repo) {
    return axios.get(`https://api.github.com/repos/zhu-cli/${repo}/tags`);
}

module.exports = {
    fetchRepoList,
    fetchTagList
}

