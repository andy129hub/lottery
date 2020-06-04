
// 官网示例： https://www.npmjs.com/package/truffle-hdwallet-provider
const HDWalletProvider = require("truffle-hdwallet-provider");

const web3 = require("web3");
const {bytecode,interface} = require("./compile");
// 参数1，metamask 中账户的 12个助记词
// 参数2，infura 账户中创建的项目的 网络
// 4d2fe19ec56d48dcb2fea4cf8b193416" 是 infura
// HDWalletProvider 的作用就是把 以太坊账户与 infura 网络绑定在一起
// 本示例中测试网络 使用的是 kovan (ropsten 测试网络经过测试，没有部署成功合约)
// "https://kovan.infura.io/v3/4d2fe19ec56d48dcb2fea4cf8b193416"
const provider = new HDWalletProvider(
  'strike live ladder jazz ripple raccoon unfold slogan congress dumb clog sugar',
  'https://ropsten.infura.io/v3/4d2fe19ec56d48dcb2fea4cf8b193416'
);

const web3obj = new web3(provider);

// web3 部署合约至 ropsten 测试网络上，传递的二进制代码，前面要加 0x （注意要加 单引号，不能加 双引号）
const deploy = async()=> {

  console.log(interface);
  // 通过 web3 获取 truffle 网络节点的信息 （这里指的是 metamask 账户）
  const accounts = await web3obj.eth.getAccounts();
  const lottery = await new web3obj.eth.Contract(JSON.parse(interface)).deploy({data:'0x'+bytecode}).send({from:accounts[0],gas:"2000000"});
  console.log("contract address : ", lottery.options.address);  // 注意 options 写法
  console.log("账户地址：",accounts);
}

// 执行部署合约
deploy();

// 合约部署成功，合约地址：0x7688d1DFA8fE7eAF0805Ca785296D70609e37649
// 点击查看： https://ropsten.etherscan.io/address/0x7688d1DFA8fE7eAF0805Ca785296D70609e37649
