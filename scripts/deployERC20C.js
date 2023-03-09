const { ethers } = require("hardhat");

async function main() {
	const [deployer] = await ethers.getSigners();
	const TokenContractFactory = await ethers.getContractFactory("CToken");
	const token = await TokenContractFactory.connect(deployer).deploy(
		"My Token",
		"MTK",
		"1000000000000000000000000",
	);
	await token.deployed();

	console.log("CToken deployed to:", token.address);
	console.log("Check the token balance of the deployer:");
	const balance = await token.balanceOf(deployer.address);
	console.log("Balance:", balance.toString());
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
