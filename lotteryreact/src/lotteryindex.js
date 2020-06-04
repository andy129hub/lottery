import React,{Component} from 'react';
import lottery from './lottery';
// import Web3 from 'web3';
import web3 from './web3';


// 关于  web3.eth.getAccounts() 获取不到账户信息的问题
/*
    在旧版本的MetaMask中是可以获取到的，因为账号地址默认是公开的，
    在2018年11月2日后MetaMask做了更新默认情况下不公开任何帐户地址，
    所以要获取账号地址要先请求用户授权。

    参考文档：https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8

    window.addEventListener() 为解决方案：


window.addEventListener('load', async () => {
  var web3Provider;
   // Modern dapp browsers...
   if (window.ethereum) {
       web3Provider = window.ethereum;
       try {
           // 请求 账户授权
           await window.ethereum.enable();
           console.log('account access success.');
       } catch (error) {
           // 用户不授权时
           console.error("User denied account access")
       }
   }
   // Legacy dapp browsers...
   else if (window.web3) {   // 老版本 metamask 账户信息是公开的，2018-11之后，需要授权才能获取账户信息
       web3Provider = window.web3.currentProvider;
       console.log('!!!!!!!!!!!!!!!!!');
   }
   // Non-dapp browsers...
   else {
       console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
   }
   console.log('+++++++++++++++++');
   web3 = new Web3(web3Provider);
});

*/

class LotteryIndex extends Component {

  state = {
    manager : '',
    players:[],
    balance:'',
    value:'',
    message:''
  }

  // react 生命周期函数  componentDidMount()
  // render()  --> componentDidMount() --> 修改了state 的变量，则会重新 render()
  async componentDidMount() {
    // 获取 manager 地址，默认： manager == msg.sender , 也就是账户的地址
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    // 获取合约地址的 金额
    const balance = await web3.eth.getBalance(lottery.options.address); // 注意是 合约的地址，与 manager 区分开
    // setState
    // this.setState({managerAddress:manager});

    // 与 state同名则可以直接 设置 (简写)
    this.setState({manager,players,balance});
  }

  onSubmit = async event=> {
    event.preventDefault();

    if (this.state.value <= 0.01) {
      this.setState({message:'输入金额不正确！请重新输入。'});
      return;
    }
    const accounts = await web3.eth.getAccounts();

    console.log("accounts : ", accounts);

    /*
    web3.eth.getAccounts(function (error, result) {
    if (!error)
      console.log("accounts   ",result)//授权成功后result能正常获取到账号了
    });
    */
    this.setState({message:'等待交易完成...'});


    // web3.utils.toWei(this.state.value,'ether')   将 ether 转化为 wei
    await lottery.methods.enter().send({from:accounts[0],value:web3.utils.toWei(this.state.value,'ether')});
    this.setState({message:'入场成功！'});

  }

  onClick = async ()=> {
    const accounts = await web3.eth.getAccounts();
    this.setState({message:'等待交易完成......'})

    await lottery.methods.pickwinner().send({from:accounts[0]});
    this.setState({message:'赢家产生'});
  }

  render() {
    return (
      <div>
        <p>管理者地址: {this.state.manager}</p>
        <p>玩家数量: {this.state.players.length}</p>
        <p>当前总额: {web3.utils.fromWei(this.state.balance,'ether')} ether</p>

        <hr/>

        <form onSubmit={this.onSubmit}>
          <h4>参与到博彩项目</h4>
          <div>
            <label>你想参与的金额：</label>
            <input
              placeholder = '不小于0.01'
              value = {this.state.value}  // {/* input 框默认值 */}
            //  {/* onChange 事件，监听输入框的输入， 将 event.target.value 的值赋值给 state value */}
              onChange = {event=>{this.setState({value:event.target.value})}}
            /> ether
            {/* <p>value : {this.state.value}</p> */}
          </div>
          <button>提交</button>
        </form>
          <p>{this.state.message}</p>
        <hr/>
        <h4>判断输赢</h4>
        <button onClick={this.onClick}>开始博彩</button>
        <p>{this.state.message}</p>
      </div>
    );
  }
}
export default LotteryIndex;
