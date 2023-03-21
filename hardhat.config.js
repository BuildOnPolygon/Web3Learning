require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");
require("dotenv/config");
module.exports = {
	solidity: {
		compilers: [
			{
				version: "0.8.1",
				settings: {},
			},
			{
				version: "0.8.9",
				settings: {},
			},
		],
	},

	networks: {
		ganache: {
			url: "http://127.0.0.1:7545",
			accounts: [
				process.env.PRIVATE_KEY1,
				process.env.PRIVATE_KEY2,
				process.env.PRIVATE_KEY3,
			],
		},
		polygonMainnet: {
			url: "https://polygon-rpc.com",
			accounts: [
				process.env.PRIVATE_KEY1,
				process.env.PRIVATE_KEY2,
				process.env.PRIVATE_KEY3,
			],
		},
		edgeS: {
			url: "https://rpc.supernets.link",
			accounts: [
				process.env.PRIVATE_KEY1,
				process.env.PRIVATE_KEY2,
				process.env.PRIVATE_KEY3,
			],
		},
		edgeT: {
			url: "https://rpc-edgenet.polygon.technology",
			accounts: [
				process.env.PRIVATE_KEY1,
				process.env.PRIVATE_KEY2,
				process.env.PRIVATE_KEY3,
			],
		},
	},

	gasReporter: {
		enabled: true,
		currency: "USD",
	},
};
