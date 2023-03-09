// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

//@dev: With this tokens we can restrict the transfer of tokens to a whitelist of addresses
contract CToken is Ownable, ERC20 {

   mapping(address => bool) public whitelist;
    constructor(
      string memory name_, 
      string memory ticker_, 
      uint256 initialSupply_
      ) ERC20(name_, ticker_) {
        _mint(msg.sender, initialSupply_);
    }
    
  //@dev: For updating whitelist
  function addToWhitelist(address _address) public onlyOwner {
      whitelist[_address] = true;
  }

  function removeFromWhitelist(address _address) public onlyOwner {
      whitelist[_address] = false;
  }

//@dev: For returning whitelist status
  function isWhitelisted(address _address) public view returns (bool) {
      return whitelist[_address];
  }

  // Dinamically Mint new tokens
  function mint(address _to, uint256 _amount) public onlyOwner{
    _mint(_to, _amount);
  }


  // Dinamically Burn tokens
  function burn (address _from, uint256 _amount) public onlyOwner{
    _burn(_from, _amount);
  }

  //@dev: overriding _beforeTokenTransfer function to restrict transfer of tokens to a whitelist of addresses
  function _beforeTokenTransfer(address _from, address _to, uint256 _amount) internal virtual override {

    if (_from == address(0)) { // When minting tokens
        super._beforeTokenTransfer(_from, _to, _amount);
    }
      require(whitelist[_from] || whitelist[_to], "Not whitelisted");
      super._beforeTokenTransfer(_from, _to, _amount);
  }

 
   
}