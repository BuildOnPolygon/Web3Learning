// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ERC1155NFTMinter is ERC1155 {
   

    constructor(string memory baseUri_) ERC1155(baseUri_) {
       
    }

    function mintNFT(uint256 _tokenId, uint256 _amount) public {
        _mint(msg.sender, _tokenId, _amount, "");
    }

    function mintBatchNFTs(
        uint256[] memory _tokenIds,
        uint256[] memory _amounts
    ) public {
        _mintBatch(msg.sender, _tokenIds, _amounts, "");
    }

    

    function uri (uint256 _id) public view override returns (string memory) {
        return string(abi.encodePacked(super.uri(_id), Strings.toString(_id)));
    }
}