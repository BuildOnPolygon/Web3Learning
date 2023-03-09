// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MintableToken is Ownable, ERC20 {
    constructor(
      string memory name_, 
      string memory ticker_, 
      uint256 initialSupply_
      ) ERC20(name_, ticker_) {
        _mint(msg.sender, initialSupply_);
    }


  // Dynamically Mint new tokens

  function mint(address to, uint256 amount) public onlyOwner{
    _mint(to, amount);
  }


  // Dynamically Burn tokens
  function burn (address from, uint256 amount) public onlyOwner{
    _burn(from, amount);
  }
   
}