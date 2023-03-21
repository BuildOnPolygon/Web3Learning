const { ethers } = require("hardhat");

async function main() {
	const [deployer] = await ethers.getSigners();
	const NFTContractFactory = await ethers.getContractFactory(
		"ERC1155NFTMinter",
	);
	const token = await NFTContractFactory.connect(deployer).deploy(
		"https://sample.ipfs/api/item/",
	);
	await token.deployed();

	console.log("Token deployed to:", token.address);
	console.log("minting sample NFT");
	await token.mintNFT(1, 1);
	const uri = await token.uri(1);
	console.log(uri);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
