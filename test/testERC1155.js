const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");

describe("My ERC1155 Token", function () {
	async function deployERC721NFTMinterFixture() {
		const [owner, user1, user2, user3] = await ethers.getSigners();

		const ERC721NFTMinter = await ethers.getContractFactory("ERC1155NFTMinter");
		const token = await ERC721NFTMinter.deploy("https://sample.ipfs/");

		return { token, owner, user1, user2, user3 };
	}

	it("Should mint and get balances", async function () {
		const { token, owner, user1, user2, user3 } = await loadFixture(
			deployERC721NFTMinterFixture,
		);
		await token.mintNFT(1, 100);
		await token.mintNFT(2, 200);
		await token.connect(user1).mintNFT(1, 50);
		const balance1 = await token.balanceOf(owner.address, 1);
		const balance2 = await token.balanceOf(owner.address, 2);
		const balance3 = await token.balanceOf(user1.address, 1);
		expect(balance1).to.equal(100);
		expect(balance2).to.equal(200);
		expect(balance3).to.equal(50);
	});

	it("Should transfer tokens", async function () {
		const { token, owner, user1, user2, user3 } = await loadFixture(
			deployERC721NFTMinterFixture,
		);
		await token.mintNFT(1, 100);
		await token.connect(user1).mintNFT(1, 50);
		await token
			.connect(owner)
			.safeTransferFrom(owner.address, user1.address, 1, 20, "0x");
		const balance1 = await token.balanceOf(owner.address, 1);
		const balance2 = await token.balanceOf(user1.address, 1);
		expect(balance1).to.equal(80);
		expect(balance2).to.equal(70);
	});

	it("Should batch transfer tokens", async function () {
		const { token, owner, user1, user2, user3 } = await loadFixture(
			deployERC721NFTMinterFixture,
		);
		await token.mintNFT(1, 100);
		await token.mintNFT(2, 100);
		await token.safeBatchTransferFrom(
			owner.address,
			user1.address,
			[1, 2],
			[30, 40],
			"0x",
		);
		const balance1_1 = await token.balanceOf(owner.address, 1);
		const balance1_2 = await token.balanceOf(owner.address, 2);
		const balance2_1 = await token.balanceOf(user1.address, 1);
		const balance2_2 = await token.balanceOf(user1.address, 2);
		expect(balance1_1).to.equal(70);
		expect(balance1_2).to.equal(60);
		expect(balance2_1).to.equal(30);
		expect(balance2_2).to.equal(40);
	});

	it("Should approve and transfer tokens", async function () {
		const { token, owner, user1, user2, user3 } = await loadFixture(
			deployERC721NFTMinterFixture,
		);
		await token.mintNFT(1, 100);
		await token.setApprovalForAll(user1.address, true);
		await token
			.connect(user1)
			.safeTransferFrom(owner.address, user1.address, 1, 20, "0x");
		const balance1 = await token.balanceOf(owner.address, 1);
		const balance2 = await token.balanceOf(user1.address, 1);
		expect(balance1).to.equal(80);
		expect(balance2).to.equal(20);
	});

	it("Should approve and batch transfer tokens", async function () {
		const { token, owner, user1, user2, user3 } = await loadFixture(
			deployERC721NFTMinterFixture,
		);
		await token.mintNFT(1, 100);
		await token.mintNFT(2, 200);
		await token.setApprovalForAll(user1.address, true);
		await token.safeBatchTransferFrom(
			owner.address,
			user1.address,
			[1, 2],
			[20, 40],
			"0x",
		);
		const balance1_1 = await token.balanceOf(owner.address, 1);
		const balance1_2 = await token.balanceOf(owner.address, 2);
		expect(balance1_1).to.equal(80);
		expect(balance1_2).to.equal(160);
	});

	it("Should revert when trying to transfer more tokens than balance", async function () {
		const { token, owner, user1, user2, user3 } = await loadFixture(
			deployERC721NFTMinterFixture,
		);
		await token.mintNFT(1, 100);
		await token.setApprovalForAll(user1.address, true);
		await expect(
			token
				.connect(user1)
				.safeTransferFrom(owner.address, user2.address, 1, 200, "0x"),
		).to.be.revertedWith("ERC1155: insufficient balance for transfer");
	});
});
