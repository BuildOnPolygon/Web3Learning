// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTMinter is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_){
    // nextTokenId is initialized to 1, since starting at 0 leads to higher gas cost for the first minter
    //TOKENS IDS starts from 1(not 0)
    _tokenIds.increment();

   }

    function mintNFT(address _player, string memory _tokenURI)
        public
        returns (uint256)
    {
        uint256 newItemId = _tokenIds.current();
        _mint(_player, newItemId);
        _setTokenURI(newItemId, _tokenURI);

        _tokenIds.increment();
        return newItemId;
    }

    //@dev: For burning token
  //@note: Only owner can burn the token
  function burn(uint256 _tokenId) public  {
    require(msg.sender != address(0), "ERC721NFTMinter#burn: ZERO_ADDRESS");
    require(ownerOf(_tokenId) == msg.sender,  "ERC721NFTMinter#burn: ONLY_OWNER");
    _burn(_tokenId);
  }
 /**
    @dev Returns the total tokens minted so far.
    1 is always subtracted from the Counter since it tracks the next available tokenId.
  */
  function totalSupply() public view returns (uint256) {
      return _tokenIds.current() - 1;
  }
}