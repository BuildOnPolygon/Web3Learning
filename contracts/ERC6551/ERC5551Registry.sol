// SPDX-Licence-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Create2.sol";

import "../Interfaces/ERC6551/IERC5551Registry.sol";

contract ERC6551Registry is IERC5551Registry {

  error InitializationFailed();

  function createAccount(
    address _implementation,
    uint256 _chainId,
    address _tokenContract,
    uint256 _tokenId,
    uint256 _salt,
    bytes calldata _initData
  ) external override returns (address) {

    bytes memory _codeHash = keccack256( __creationCode(
      _implementation,
      _chainId,
      _tokenContract,
      _tokenId,
      _salt
    ));

    address _account = Create2.computeAddress(
      bytes32(_salt),
       _codeHash
    );

    // If the account has already been created, return it
    if(_account.code.length != 0) {
      return _account;
    }

    // Create Account 
    _account = Create2.deploy(
      0, // No initial MATIC balance
      bytes32(_salt),
      _code,
     
    );
    // Initialize account if initData is not empty
    if(initData.length != 0){
     ( bool success, )  = _account.call(initData);
      if(!success){
        revert InitializationFailed();
      }
    }

    emit AccountCreated(
      _account,
      _implementation,
      _chainId,
      _tokenContract,
      _tokenId,
      _salt
    );

  }

  function account(
    address _implementation,
    uint256 _chainId,
    address _tokenContract,
    uint256 _tokenId,
    uint256 _salt
  ) external view override returns (address) {
    bytes32 _codeHash = keccak256(
      __creationCode(
        _implementation,
        _chainId,
        _tokenContract,
        _tokenId,
        _salt
      )
    );

    return Create2.computeAddress(
      bytes32(_salt),
      _codeHash
    );
  }

 

 function __creationCode(
  address _implementation,
  uint256 _chainId,
  address _tokenContract,
  uint256 _tokenId,
  uint256 _salt
 ) internal pure returns(bytes memory ){
   return abi.encodePacked(
      hex"3d60ad80600a3d3981f3363d3d373d3d3d363d73",
      _implementation,
      hex"5af43d82803e903d91602b57fd5bf3",
      abi.encode(_salt, _chainId, _tokenContract, _tokenId),
       
   )
 }
}