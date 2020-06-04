// 本地测试网络
const ganache = require("ganache-cli");

const web3 = require("web3");

const web3obj = new web3(ganache.provider());

const assert = require("assert");

// 注意：require("../compile");  导入 compile.js 文件(js 后缀可省略，但名字要名字要一致)
const {bytecode,interface} = require("../compile");

// 注意： beforeEach() 函数, 是跨文件，多个js 文件中的 it 函数都会先调用其他文件中的 beforeEach()
/*
beforeEach(()=>{
  //  web3obj.eth.getAccounts()异步操作(promise对象), then() 等待结果并用 accounts 变量接受结果
  web3obj.eth.getAccounts().then(accounts=>{

    console.log(accounts);
  });
});
*/

var lottery;
// js 新特性  (async 与 await )
beforeEach(async()=>{

  //  web3obj.eth.getAccounts()异步操作(promise对象)
  var accounts = await web3obj.eth.getAccounts();
  lottery = await new web3obj.eth.Contract(JSON.parse(interface)).deploy({data:bytecode}).send({from:accounts[0],gas:"1000000"});
  console.log(accounts);
});

//  beforeEach  调用流程说明
/*  调用外部 beforeEach
  该 it 虽然会先调用 mocha.test.js 中的 beforeEach(), 但是本文件中 没有声明  var p,
  所以导致 p 无法被实例化, 尝试定义一个 var p, 但又找不到 eat() 方法，所以还是会失败
*/

/*  多文件多个 beforeEach 的调用顺序
     执行顺序是 按照 .js 文件名的首字母 进行排序的(数字或者 首字母顺序，由小到大)
*/

describe("Lottery", ()=>{
  it("deploy contract", ()=>{
    // assert.ok() 判断对象是否存在 (非 undefine)
    assert.ok(lottery.options.address);
  });
});
