![CI](https://github.com/automata-network/reward-contracts/workflows/CI/badge.svg)

# reward-contracts

This repo contains the smart contract implementation for distributing rewards.

* `RewardPool.sol` is used for distributing ERC-20 tokens as rewards for staking ERC-20 tokens.
* `MultiRewardPool.sol` is an upgraded version of `RewardPool.sol` that can issue multiple ERC-20 rewards.

## Development

Run the following command to install all dependencies.

```shell
yarn install
```

To compile the contracts, run

```shell
yarn compile
```

This repository is developed using [hardhat](https://hardhat.org/) and more commands can be found through

```shell
yarn hardhat
```

To run tests from the `test/` directory, run

```shell
yarn test
```

To deploy the contracts to a network, run

```shell
yarn deploy --network <option>
```

Note: Store private keys in the `.env` file. Do not commit this file or you will be at risk of losing your funds.

---

## Network Configuration

### Local Unit Testing

|Network|Description|
|---|---|
|`hardhat`|Local ETH fork|

### Integrating Testing On Tenderly Forks

|Network|Description|
|---|---|
|`eth_tenderly`|Ethereum fork|
|`matic_tenderly`|Polygon PoS fork|
|`bsc_tenderly`|Binance Smart Chain fork|

### Main nets

Note: Infura/Alchemy API keys must be configured in the `.env` file.

|Network|Description|
|---|---|
|`eth`|Ethereum|
|`matic`|Polygon PoS|
|`bsc`|Binance Smart Chain|

---

## Contracts

Contracts are deployed to the following addresses.

|Contract|Address|
|---|---|
