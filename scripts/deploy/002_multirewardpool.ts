import { ethers } from 'hardhat';
import { printDeploymentLogs, getAccounts } from '../../lib/utils';
import { MultiRewardPool__factory, MultiRewardPool } from '../../typechain';

export async function deployMultiRewardPool(stakingTokenAddress: string, verbose = false): Promise<MultiRewardPool> {
  const name = 'MultiRewardPool';
  const { deployer, owner } = await getAccounts();
  const multiRewardPoolContract = (await ethers.getContractFactory(name)) as MultiRewardPool__factory;
  const instance = (await multiRewardPoolContract.connect(deployer).deploy(stakingTokenAddress)) as MultiRewardPool;
  await instance.deployed();
  await instance.transferOwnership(owner.address);
  const deploymentTx = instance.deployTransaction;
  if (verbose) {
    printDeploymentLogs(name, instance.address, deploymentTx.hash);
  }
  return instance;
}

// ----- Parameters for creating a reward pool ------ //
// token address for the token to be staked - ie. an LP token address
// const stakingTokenAddress = '';
//
// // ----- Run the script ------ //
// deployMultiRewardPool(stakingTokenAddress, true)
//   .then(() => process.exit(0))
//   .catch((e) => {
//     console.log(e);
//     process.exit(1);
//   });
