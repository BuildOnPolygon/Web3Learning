// SPDX-Licence-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC1271.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

import "../lib/Bytecode.sol";
import "../Interfaces/ERC6551/IERC6551Account.sol";

contract ERC6551Account is IERC165, IERC1271, IERC6551Account{

  //@dev:For supporting ERC1271
  // bytes4(keccak256("isValidSignature(bytes32,bytes)")
  bytes4 constant internal MAGICVALUE = 0x1626ba7e;
  uint256 private _nonce;
  // Contrct should able to recive  MATIC

  receive() external payable {}

  function token() public view returns (uint256 chainId, address tokenContract, uint256 tokenId){
    uint256 length = address(this).code.length;
    
    return abi.decode(Bytecode.codeAt(address(this), length - 96, length), (uint256, address, uint256));
    // can also done like this
    // return abi.decode(address(this).code[length - 96:], (uint256, address, uint256));
  }

  function owner() public view returns (address){
    (uint256 _chainId, address _tokenContract, uint256 _tokenId) = this.token();
    if(_chainId != block.chainid){
      return address(0);
    }
    return IERC721(_tokenContract).ownerOf(_tokenId);
  }  
 
//@dev: Returns the current account state(no)
// Nonce is the number of times the account has changed state
function state() external view returns (uint256){
    return _nonce;
}

  function executeCall(address _to, uint256 _value, bytes calldata _data)external payable returns(bytes memory result){
    require(msg.sender == owner(), "ERC6551: caller is not the owner");
    require(_to != address(this), "ERC6551: cannot call self");
    require(_to != address(0), "ERC6551: cannot call zero address");
    bool success;
    (success, result) = _to.call{value: _value}(_data);
     if (!success) {
        assembly {
        revert(add(result, 32), mload(result))
        }
     }
    _nonce++;
  }
// For checking the user is a valid owner of the account
 function isValidSigner(address signer, bytes calldata context) external view returns (bytes4 magicValue){

    if(signer == owner()){
      return MAGICVALUE;
    }
    return bytes4(0);
  }
  function isValidSignature(
        bytes32 hash,
        bytes memory signature
    ) external view returns (bytes4 magicValue) {
      bool isValid = SignatureChecker.isValidSignatureNow(owner(), hash, signature);
      if(isValid){
        //if successfully verified return MAGICVALUE;
        return MAGICVALUE;
      }
      // if not valid return empty bytes4 value
      return bytes4(0);                              

    }

   function supportsInterface(bytes4 _interfaceId) public pure returns (bool) {
        return (_interfaceId == type(IERC165).interfaceId ||
            _interfaceId == type(IERC6551Account).interfaceId);
    }



}