// SPDX-License-Identifier: MIT    
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";   
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract LoyaltyMembershipNFT is ERC721{

  using Counters for Counters.Counter;
   Counters.Counter private _tokenIds;
   address public owner;
   // mapping for token URIs
   mapping(uint256 => uint256) private _membershipTimestamp;
   mapping(address => uint256) private _userNFTID;
   mapping(address => bool) private _isUserMintedNFT;
   string  public IPFS_IMAGE_STRING;

   constructor (string memory _image) ERC721("LoyaltyMembershipNFT", "$NFT") {
       _tokenIds.increment();
       IPFS_IMAGE_STRING = _image;
       owner = msg.sender;
   }
  // if loyalty Image need to be changed 
  function updateImageIPFSHash(string memory _hash) public {
    require(msg.sender == owner, "LoyaltyMembershipNFT: Only Owner can change image data");
    require(bytes(_hash).length > 10, "LoyaltyMembershipNFT: IPFS hash length is too small");
    IPFS_IMAGE_STRING = _hash;
  }

  function getUserNFTID() public view returns(uint256){
      return _userNFTID[msg.sender];
  }


// For returning token URI
function tokenURI(uint _tokenId) public view override  returns (string memory){

    return getTokenURI(_tokenId);
}

function getNFTTimestamp(uint256 _id) public view returns(string memory){
    return Strings.toString(_membershipTimestamp[_id]);
}

function getTokenURI(uint256 _id) public view returns (string memory){
    string memory timeSince = getNFTTimestamp(_id);
    bytes memory dataURI = abi.encodePacked(
        '{',
            '"name": "Loyalty Membership NFT",',
            '"description": "Loyalty Membership NFT",',
            '"image": "', IPFS_IMAGE_STRING, '"',',',
            '"date": "', timeSince,'"',
            
        '}'
    );

    return string(
        abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(dataURI)
        )
    );
}
  // For preventing transfer of the NFT
  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual override(ERC721) {
    require(from == address(0), "LoyaltyMembershipNFT: This NFT cannot be transferred ");
    super._beforeTokenTransfer(from, to, tokenId,1);
   }

  function supportsInterface(bytes4 interfaceId) public view override(ERC721) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
  
  // Mint NFT only if the user haven't minted already
   function mintNFT()
        public
        returns (uint256)
    {
      require(!_isUserMintedNFT[msg.sender] ,"LoyaltyMembershipNFT:NFT should be minted only once ");
        _isUserMintedNFT[msg.sender] = true;
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _membershipTimestamp[newItemId] = block.timestamp;
        _tokenIds.increment();
        return newItemId;
    }

    
}