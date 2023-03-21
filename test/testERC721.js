const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");

describe("ERC721NFTMinter", function () {
	async function deployERC721NFTMinterFixture() {
		const [owner, user1, user2, user3] = await ethers.getSigners();

		const ERC721NFTMinter = await ethers.getContractFactory("NFTMinter");
		const token = await ERC721NFTMinter.deploy("My Token", "MTK");

		return { token, owner, user1, user2, user3 };
	}

	describe("NFT Minting", function () {
		it("Should be able to mint NFT", async function () {
			const { token, user1, user2 } = await loadFixture(
				deployERC721NFTMinterFixture,
			);
			await token.mintNFT(user1.address, "https://sample.ipfs/image.png");

			expect(await token.balanceOf(user1.address)).to.equal(1);
		});
	});

	describe("NFT Transfers", function () {
		it("Owner Should be able to transfer NFT", async function () {
			const { token, user1, user2 } = await loadFixture(
				deployERC721NFTMinterFixture,
			);
			await token.mintNFT(user1.address, "https://sample.ipfs/image.png");
			await token.connect(user1).transferFrom(user1.address, user2.address, 1);
			expect(await token.balanceOf(user1.address)).to.equal(0);
			expect(await token.balanceOf(user2.address)).to.equal(1);
		});
	});

	describe("NFT transfer by non-owner", function () {
		it("Should revert with the right error if called by a non-owner", async function () {
			const { token, user1, user2 } = await loadFixture(
				deployERC721NFTMinterFixture,
			);
			await token.mintNFT(user1.address, "https://sample.ipfs/image.png");
			await expect(
				token.connect(user2).transferFrom(user1.address, user2.address, 1),
			).to.be.revertedWith("ERC721: caller is not token owner or approved");
		});
		it("Should be able to transfer by other user or smart contract if the owner approved to transfer", async function () {
			const { token, user1, user2 } = await loadFixture(
				deployERC721NFTMinterFixture,
			);
			await token.mintNFT(user1.address, "https://sample.ipfs/image.png");
			await token.connect(user1).approve(user2.address, 1);
			await token.connect(user2).transferFrom(user1.address, user2.address, 1);
		});
	});
});
