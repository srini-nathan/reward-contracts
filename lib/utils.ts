import { Signer, BigNumber, Contract } from 'ethers';
import { network, ethers } from 'hardhat';
import config from '../hardhat.config';
import { abi as erc20Abi } from '@openzeppelin/contracts/build/contracts/ERC20.json';
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
  owner: SignerWithAddress; // the ConveyorV2 owner
  relayer: SignerWithAddress;
  user: SignerWithAddress;
  geodeRelayer?: string; // only for !networkIsLocal
}

export async function getAccounts(): Promise<accountConfig> {
  const signers = await ethers.getSigners();
  if (networkIsLocal) {
    return {
      owner: signers[0],
      relayer: signers[1],
      user: signers[2],
      deployer: signers[3],
    };
  } else {
    return {
      owner: signers[0],
      relayer: signers[0], // irrelevant
      user: signers[0], // irrelevant
      geodeRelayer: RELAYER!,
      deployer: signers[1],
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

export function sinceNow(seconds: number | BigNumber): BigNumber {
  const delta = typeof seconds === 'number' ? BigNumber.from(seconds) : seconds;
  return BigNumber.from(Math.round(new Date().getTime() / 1000)).add(delta);
}

export async function impersonateSigner(address: string): Promise<Signer> {
  await network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [address],
  });

  return ethers.provider.getSigner(address);
}

/**
 * Converts input to amount with correct decimals.
 */
export function formatERC20Amount(amount: BigNumber, decimals = 18): BigNumber {
  const factor = BigNumber.from(10).pow(decimals);
  return amount.mul(factor);
}

export function parseERC20Amount(erc20Amount: BigNumber, decimals = 18): number {
  const str = erc20Amount.toString();
  const len = str.length;
  if (len < decimals) {
    const diff = decimals - len - 1;
    const adjusted = '0.' + '0'.repeat(diff) + str;
    return parseFloat(adjusted);
  } else {
    const diff = len - decimals;
    const adjusted = str.substring(0, diff) + '.' + str.substring(diff);
    return parseFloat(adjusted);
  }
}

export async function loadERC20instance(address: string, signer?: Signer): Promise<Contract> {
  if (!signer) {
    signer = (await getAccounts()).deployer;
  }
  return new ethers.Contract(address, erc20Abi, signer);
}
