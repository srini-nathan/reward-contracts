import { BigNumber } from 'ethers';
import { network, ethers } from 'hardhat';
import config from '../hardhat.config';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

// env
import dotenv from 'dotenv';
dotenv.config();

const { RELAYER } = process.env;

export const networkIsLocal = network.name === 'hardhat' || network.name === 'localhost';
export const networkIsTenderly =
  network.name === 'eth_tenderly' || network.name === 'bsc_tenderly' || network.name === 'matic_tenderly';
export const networkIsMain = network.name === 'eth' || network.name === 'bsc' || network.name === 'matic';

interface accountConfig {
  deployer: SignerWithAddress; // the create2 deployer
  owner: SignerWithAddress; // the dev/owner
  testTokenProvider?: SignerWithAddress; // only for !networkIsLocal
  geodeRelayer?: string; // only for !networkIsLocal
}

export async function getAccounts(): Promise<accountConfig> {
  const signers = await ethers.getSigners();
  if (networkIsLocal) {
    return {
      owner: signers[0],
      deployer: signers[1],
      testTokenProvider: signers[2],
    };
  } else {
    return {
      owner: signers[0],
      deployer: signers[1],
      geodeRelayer: RELAYER!,
    };
  }
}

export function printDeploymentLogs(name: string, address: string, hash: string): void {
  console.log(`${name} deployed successfully at ${address} \n (tx: ${hash})`);
}

export async function resetNetwork(jsonRpcUrl?: string, useLatestBlock = false): Promise<void> {
  await network.provider.request({
    method: 'hardhat_reset',
    params: [
      {
        forking: {
          jsonRpcUrl: jsonRpcUrl ? jsonRpcUrl : config!.networks!.hardhat!.forking!.url,
          blockNumber: useLatestBlock ? undefined : config!.networks!.hardhat!.forking!.blockNumber,
        },
      },
    ],
  });
}

export async function sendEth(from: SignerWithAddress, to: SignerWithAddress, amount: BigNumber) {
  await from.sendTransaction({
    to: to.address,
    value: amount,
  });
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function sinceNow(seconds: number | BigNumber): BigNumber {
  const delta = typeof seconds === 'number' ? BigNumber.from(seconds) : seconds;
  return BigNumber.from(Math.round(new Date().getTime() / 1000)).add(delta);
}
