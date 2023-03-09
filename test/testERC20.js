const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");
const TOKEN_SUPPLY = "1000000000000000000000000";

describe("MintableToken", function () {
	// We define a fixture to reuse the same setup in every test.
	// We use loadFixture to run this setup once, snapshot that state,
	// and reset Hardhat Network to that snapshot in every test.
	async function deployMintableTokenFixture() {
		const [owner, user1, user2, user3] = await ethers.getSigners();

		const MintableToken = await ethers.getContractFactory("MintableToken");
		const token = await MintableToken.deploy("My Token", "MTK", TOKEN_SUPPLY);

		return { token, owner, user1, user2, user3 };
	}

	describe("Deployment", function () {
		it("Should set the right owner", async function () {
			const { token, owner } = await loadFixture(deployMintableTokenFixture);

			expect(await token.owner()).to.equal(owner.address);
		});
	});

	describe("Minting", function () {
		describe("Validations", function () {
			it("Should revert with the right error if called by a non-owner", async function () {
				const { token, user1 } = await loadFixture(deployMintableTokenFixture);

				await expect(
					token.connect(user1).mint(user1.address, 100),
				).to.be.revertedWith("Ownable: caller is not the owner");
			});
		});

		describe("Owner Minting", function () {
			it("Should mint the right amount of tokens if the owner is calling", async function () {
				const { token, user1 } = await loadFixture(deployMintableTokenFixture);

				await token.mint(user1.address, 100);
				expect(await token.balanceOf(user1.address)).to.equal(100);
			});
		});
	});

	describe("Transfers", function () {
		describe("Validations", function () {
			it("Should revert with the right error if called by a non-owner", async function () {
				const { token, user1 } = await loadFixture(deployMintableTokenFixture);

				await expect(
					token.connect(user1).transfer(user1.address, 100),
				).to.be.revertedWith("ERC20: transfer amount exceeds balance");
			});
		});

		describe("Owner Transfers", function () {
			it("Should transfer the right amount of tokens if the owner is calling", async function () {
				const { token, user1 } = await loadFixture(deployMintableTokenFixture);

				await token.transfer(user1.address, 100);
				expect(await token.balanceOf(user1.address)).to.equal(100);
			});
		});
	});

	describe("Burns", function () {
		describe("Validations", function () {
			it("Should revert with the right error if called by a non-owner", async function () {
				const { token, user1 } = await loadFixture(deployMintableTokenFixture);

				// const error = await token.connect(user1).burn(100);
				// console.log(error);

				await expect(
					token.connect(user1).burn(user1.address, 100),
				).to.be.revertedWith("Ownable: caller is not the owner");
			});

			it("Given user should have required amount of tokens", async function () {
				const { token, user1 } = await loadFixture(deployMintableTokenFixture);

				expect(token.burn(100)).to.be.revertedWith(
					"ERC20: burn amount exceeds balance",
				);
			});
		});

		describe("Owner Burns", function () {
			it("Should burn the right amount of tokens if the owner is calling", async function () {
				const { token, user1 } = await loadFixture(deployMintableTokenFixture);
				await token.transfer(user1.address, 100);
				//console.log("100 tokens transferd to user1");
				expect(await token.balanceOf(user1.address)).to.equal(100);
				await token.burn(user1.address, 100);
				expect(await token.balanceOf(user1.address)).to.equal(0);
			});
		});
	});

	describe("Approvals", function () {
		describe("Validations", function () {
			it("Should revert with the error if approved for zero address", async function () {
				const { token } = await loadFixture(deployMintableTokenFixture);

				await expect(
					token.approve(ethers.constants.AddressZero, 100),
				).to.be.revertedWith("ERC20: approve to the zero address");
			});
		});

		describe("Owner Approvals", function () {
			it("Should approve the right amount of tokens if the token owner is calling", async function () {
				const { owner, token, user1 } = await loadFixture(
					deployMintableTokenFixture,
				);

				await token.approve(user1.address, 100);
				expect(await token.allowance(owner.address, user1.address)).to.equal(
					100,
				);
			});
			it("Approved user can transfer tokens to thirdparty users", async function () {
				const { token, user1, user2 } = await loadFixture(
					deployMintableTokenFixture,
				);
				await token.approve(user1.address, 100);
				await token
					.connect(user1)
					.transferFrom(token.address, user2.address, 100);
				expect(await token.balanceOf(user2.address)).to.equal(100);
			});
		});
	});
});
