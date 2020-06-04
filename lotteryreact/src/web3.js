
// 导入在本地下载好的 web3 包
import Web3 from 'web3';
// 当前浏览器 web3 中的provider (metamask 内置web3，与 本地下载的 web3 版本不同)
const web3 = new Web3(window.web3.currentProvider);

// 导出 web3 实例，让其他文件获取 web3
export default web3;
