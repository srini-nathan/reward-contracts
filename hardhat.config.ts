import { HardhatUserConfig } from 'hardhat/types';
import '@nomiclabs/hardhat-ethers';
import '@typechain/hardhat';

// env
import dotenv from 'dotenv';
dotenv.config();

const { ALCHEMY_API, DEPLOYER_PRIVATE_KEY, OWNER_PRIVATE_KEY } = process.env;

const mnemonic = 'system sure trial grape behind powder west panther strike response lunar follow'; // test mnenomic. DO NOT SEND REAL ETHERS TO THIS WALLET.

const config: HardhatUserConfig = {
    solidity: {
        compilers: [{ version: '0.8.2', settings: {} }],
        overrides: {
            "contracts/ConveyorV2Router01.sol" : {
                version: '0.8.2',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200
                    }
                }
            }
        }
    },

    defaultNetwork: 'hardhat',

    networks: {
        // local unit-testing forks Ethereum mainnet
        hardhat: {
            // accounts: [{privateKey: DEPLOYER_PRIVATE_KEY!, balance: '1000000000000000000000'}], // comment out for local unit testing
            forking: {
                // url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API}`,
                url: 'https://eth-mainnet.alchemyapi.io/v2/o8o01CAVcQUHo-z0v4jtIHGfbFp7s8F2',
                blockNumber: 13002160 // pinned August 11th, 2021, 13:58 UTC +08:00,
            },
            accounts: {mnemonic: mnemonic},
            chainId: 1,
        },
        localhost: {
            url: 'http://localhost:8545',
        },
        // bsc_tenderly: {
        //     url: 'https://rpc.tenderly.co/fork/73a3fe43-9054-4606-842d-9f85a9bb3b12'
        // },
        // eth_tenderly: {
        //     url: 'https://rpc.tenderly.co/fork/4f3bf762-7876-49a4-92b1-ba5d92e1aaa6',
        //     accounts: [OWNER_PRIVATE_KEY!, DEPLOYER_PRIVATE_KEY!],
        // },
        // matic_tenderly: {
        //     url: 'https://rpc.tenderly.co/fork/218abf8b-28c9-423b-a446-7d1bc8ad0587',
        //     accounts: [OWNER_PRIVATE_KEY!, DEPLOYER_PRIVATE_KEY!],
        // },
        // bsc: {
        //     url: 'https://bsc-dataseed1.defibit.io/',
        //     accounts: [OWNER_PRIVATE_KEY!, DEPLOYER_PRIVATE_KEY!]
        // },
        // eth: {
        //     url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API}`,
        //     accounts: [OWNER_PRIVATE_KEY!, DEPLOYER_PRIVATE_KEY!]
        // },
        // matic: {
        //     url:`https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API}`,
        //     accounts: [OWNER_PRIVATE_KEY!, DEPLOYER_PRIVATE_KEY!]
        // },
    },

    mocha: {
        timeout: 0
    }
}

export default config;