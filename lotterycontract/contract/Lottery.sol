pragma solidity ^0.4.23;
// 智能合约
contract Lottery {
  address public manager;

  address[] public players;

  constructor() public {
    manager = msg.sender;
  }

  function getPlayers() public view returns(address[]){
    return players;
  }

  function enter() public payable {
    require(msg.value > 0.01 ether);
    players.push(msg.sender);
  }
  // 根据区块难度，当前时间，玩家数组列表 这三个信息，产生 256位长度的hash 值
  function random() private view returns(uint) {
    return uint(keccak256(block.difficulty,now,players));
  }
  // 加入权限控制
  modifier restricted {
    require(msg.sender == manager);
    _;
  }

  // 模拟 玩家获胜
  function pickwinner() public restricted {
    // 通过对 玩家数量的 取模运算，得到 0 -- (玩家数量-1) 之家的随机数，
    // 例如 玩家数量为 3，则随机得到 0，1，2，将该值作为下标，随机一位 玩家
    uint index = random() % players.length;
    // 对随机抽取的玩家，进行转账（这位玩家 赢得了这次金钱）
    players[index].transfer(address(this).balance);

    // 通过 new address[](0)  清空玩家列表
    players = new address[](0);
  }

}
