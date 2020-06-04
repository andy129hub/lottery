const path = require("path");

const fs = require("fs");

// 单引号，双引号 都可以
const solc = require('solc');

// __dirname 表示当前项目根路径  (不同平台下的目录 都能打印)
const filepath = path.resolve(__dirname,"contract","Lottery.sol");
//console.log("__dirname : "+__dirname);  // E:\我的工作\区块链课程\以太坊技术\dapp学习\myproject

//console.log("filepath : "+filepath);  // E:\我的工作\区块链课程\以太坊技术\dapp学习\myproject\contract\Lottery.sol

// 读取 .sol 文件
const source = fs.readFileSync(filepath, "utf-8");
// console.log("file content : "+source);

// 使用 solc 包编译 .sol 文件， 解析.sol 所有内容（合约，接口，库 等）
// console.log(solc.compile(source,1));    // 1 代表只有一个 .sol 文件

// 从 sol 解析文件中 获取指定合约的内容
// console.log(solc.compile(source,1).contracts[':HelloWorld']);

// 导出合约 （其他文件 通过 const {bytecode,interface} = require("../compile"); 获取合约的二进制文件以及接口）
// // 注意：require("../compile");  导入 compile.js 文件(js 后缀可省略，但名字要名字要一致)
module.exports = solc.compile(source,1).contracts[':Lottery'];
