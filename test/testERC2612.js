const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");
const TOKEN_SUPPLY = "1000000000000000000000000";

describe(" ERC2612 Token Testing", async function () {
	async function deployERC2612Fixture() {
		const [owner, user1, user2, user3] = await ethers.getSigners();
		const MintableToken = await ethers.getContractFactory("ERC20P");
		const token = await MintableToken.deploy("My Token", "MTK", TOKEN_SUPPLY);

		return { token, owner, user1, user2, user3 };
	}

	it("should allow the spender to transfer tokens", async function () {
		const { token, owner, user1 } = await loadFixture(deployERC2612Fixture);

		const tokenAmount = ethers.utils.parseUnits("10", 18);
		const deadline = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // set the deadline to 24 hours from now

		const permitMessage = {
			owner: owner.address,
			spender: user1.address,
			value: tokenAmount,
			nonce: await token.nonces(owner.address),
			deadline: deadline,
		};

		const permitSignature = await owner._signTypedData(
			await token.DOMAIN_SEPARATOR(),
			[
				{ name: "owner", type: "address" },
				{ name: "spender", type: "address" },
				{ name: "value", type: "uint256" },
				{ name: "nonce", type: "uint256" },
				{ name: "deadline", type: "uint256" },
			],
			permitMessage,
		);
		console.log(`permitSignature : ${permitSignature}`);

		await token.permit(
			owner.address,
			user1.address,
			tokenAmount,
			deadline,
			permitSignature.v,
			permitSignature.r,
			permitSignature.s,
		);

		await token
			.connect(user1)
			.transferFrom(owner.address, user1.address, tokenAmount);

		it("token balance should be increased", async function () {
			const balance = await token.balanceOf(user1.address);
			expect(balance).to.equal(tokenAmount);
		});
	});
});
