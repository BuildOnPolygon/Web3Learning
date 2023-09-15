const { ethers } = require("hardhat");

async function main() {
	const [deployer, user] = await ethers.getSigners();
	const network = await ethers.provider.getNetwork();
	const chainId = network.chainId;
	console.log("Chain ID:", chainId);
	// Deploy the all the contracts
	// 1. Get contract factories
	const NFTContractFactory = await ethers.getContractFactory("NFTMinter");
	const ERC6551RegistryFactory = await ethers.getContractFactory(
		"ERC6551Registry",
	);
	const ERC6551AccountFactory = await ethers.getContractFactory(
		"ERC6551Account",
	);
	// 2. Deploy contracts
	const ERC721_NFT = await NFTContractFactory.connect(deployer).deploy(
		"My Token",
		"MTK",
	);
	await ERC721_NFT.deployed();

	console.log("Token deployed to:", ERC721_NFT.address);

	const ERC6551Registry = await ERC6551RegistryFactory.connect(
		deployer,
	).deploy();
	await ERC6551Registry.deployed();
	console.log("Registry deployed to:", ERC6551Registry.address);

	const ERC6551Account = await ERC6551AccountFactory.connect(deployer).deploy();
	await ERC6551Account.deployed();
	console.log("Account deployed to:", ERC6551Account.address);
	console.log("Succeessfully deployed all contracts");

	// Mint some tokens
	console.log("Minting NFT with test IPFS url: https://example.com");
	const TokenId = await ERC721_NFT.mintNFT(user.address, "https://example.com");
	console.log("NFT minted", TokenId.toString());
	// Compute the new tokenbound account address
	console.log("Computing tokenbound account address");
	const computedAccountAddress = await ERC6551Registry.account(
		ERC6551Account.address, // Account Implementation address
		chainId, // Chain ID
		ERC721_NFT.address, // Token address
		1, // Token ID
		1, // salt
	);
	console.log("Computed account address", computedAccountAddress);
	// Create tokenbound Account for the
	console.log("Creating tokenbound account");
	const newAccountTx = await ERC6551Registry.createAccount(
		ERC6551Account.address, // Account Implementation address
		chainId, // Chain ID
		ERC721_NFT.address, // Token address
		1, // Token ID
		1, // salt
		"0x", // Initial calldata
	);
	console.log("Tokenbound account created");
	const newAccountTxReceipt = await newAccountTx.wait();
	console.log("Tokenbound account creation tx receipt", newAccountTxReceipt);
	// Check the balance of the tokenbound account
	console.log("Checking the balance of the tokenbound account");
	const ETHBalance = await ethers.provider.getBalance(computedAccountAddress);
	console.log("ETH Balance:", ETHBalance.toString());
	// Sending ETH to the tokenbound account
	console.log("Sending ETH to the tokenbound account");
	const sendEther = await deployer.sendTransaction({
		to: computedAccountAddress,
		value: ethers.utils.parseEther("0.1"),
	});
	console.log("ETH sent to the tokenbound account");
	// Check the balance of the tokenbound account
	const NewETHBalance = await ethers.provider.getBalance(
		computedAccountAddress,
	);
	console.log("ETH Balance:", NewETHBalance.toString());
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
