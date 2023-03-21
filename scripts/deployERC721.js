const { ethers } = require("hardhat");

async function main() {
	const [deployer] = await ethers.getSigners();
	const NFTContractFactory = await ethers.getContractFactory("NFTMinter");
	const token = await NFTContractFactory.connect(deployer).deploy(
		"My Token",
		"MTK",
	);
	await token.deployed();

	console.log("Token deployed to:", token.address);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
