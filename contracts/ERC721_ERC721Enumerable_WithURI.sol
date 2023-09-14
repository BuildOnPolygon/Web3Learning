// SPDX-License-Identifier: MIT    
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";   
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract UserAwards is ERC721{

  using Counters for Counters.Counter;
   Counters.Counter private _tokenIds;
   address public owner;
   
   // mapping for token URIs
   mapping(uint256 => string) private _tokenURIs;

   constructor () ERC721("UserAwards", "AWARD") {
       _tokenIds.increment();
       owner = msg.sender;
   }


  // For setting token URI
  function _setTokenURI(uint _tokenId, string memory _tokenURI) private {
      require(_exists(_tokenId), " URI set of nonexistent token");
      _tokenURIs[_tokenId] = _tokenURI;
      
  }

   function mintAward(address player, string memory _tokenURI)
        public
        returns (uint256)
    {
      require(msg.sender == owner,"Only owner can mint the token");
        uint256 newItemId = _tokenIds.current();
        _mint(player, newItemId);
        _setTokenURI(newItemId, _tokenURI);

        _tokenIds.increment();
        return newItemId;
    }
}