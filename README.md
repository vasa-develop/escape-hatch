# L2 escape hatches

| L2 | Escape Hatch Mechanism | Support Status | Withdrawal Wait Time | Notes |
| --- | --- | --- | --- | --- |
| Arbitrum One | Transact using L1 |  |  | Sequencer Failure scenario: In the event of a sequencer failure, users can force transactions to be included in the project's chain by sending them to L1. There is a 1d delay on this operation. Proposer Failure scenario: Anyone can become a Proposer after 6d 8h 43m 36s of inactivity from the currently whitelisted Proposers. Docs: https://arbitrumfoundation.zendesk.com/hc/en-gb/articles/18213843096091 |
| OP Mainnet | Transact using L1 | ⏳ (ETH/ERC20) |  | Sequencer Failure scenario: In the event of a sequencer failure, users can force transactions to be included in the project's chain by sending them to L1. There is a 12h delay on this operation. Proposer Failure scenario: Only the whitelisted proposers can publish state roots on L1, so in the event of failure the withdrawals are frozen. Docs: https://stack.optimism.io/docs/security/forced-withdrawal/# |
| Base |  | ⏳ (ETH/ERC20) |  | Sequencer Failure scenario: In the event of a sequencer failure, users can force transactions to be included in the project's chain by sending them to L1. There is a 12h delay on this operation. Proposer Failure scenario: Only the whitelisted proposers can publish state roots on L1, so in the event of failure the withdrawals are frozen. |
| zkSync Era |  |  |  | Sequencer Failure scenario: Users can submit transactions to an L1 queue, but can't force them. The sequencer cannot selectively skip transactions but can stop processing the queue entirely. In other words, if the sequencer censors or is down, it is so for everyone. Proposer Failure scenario: Only the whitelisted proposers can publish state roots on L1, so in the event of failure the withdrawals are frozen. |
| dYdX | Force exit to L1 |  |  | Sequencer Failure scenario: Users can force the sequencer to include a trade or a withdrawal transaction by submitting a request through L1. If the sequencer censors or is down for 14d, users can use the exit hatch to withdraw their funds. Users are required to find a counterparty for the trade by out of system means. Proposer Failure scenario: Users are able to trustlessly exit by submitting a Merkle proof of funds. Positions will be closed using the average price from the last batch state update. |
| Starknet | None |  |  | Sequencer Failure scenario: There is no mechanism to have transactions be included if the sequencer is down or censoring. Proposer Failure scenario: Only the whitelisted proposers can publish state roots on L1, so in the event of failure the withdrawals are frozen. |
| Immutable X | Force Exit to L1 |  |  | Sequencer Failure scenario: Users can force the sequencer to include a withdrawal transaction by submitting a request through L1. If the sequencer censors or is down for for more than 7d, users can use the exit hatch to withdraw their funds. Proposer Failure scenario: Users are able to trustlessly exit by submitting a Merkle proof of funds. NFTs will be minted on L1 to exit. |
| Mantle |  |  |  | Sequencer Failure scenario: Users can submit transactions to an L1 queue, but can't force them. The sequencer cannot selectively skip transactions but can stop processing the queue entirely. In other words, if the sequencer censors or is down, it is so for everyone. The operators can also reset the batch index, effectively removing transactions from the chain from a certain point onwards. Proposer Failure scenario: Only the whitelisted proposers can publish state roots on L1, so in the event of failure the withdrawals are frozen. |
| Loopring | Force Exit to L1 |  |  | Sequencer Failure scenario: Users can force the sequencer to include a withdrawal transaction by submitting a request through L1 with a 0.02 ETH fee. If the sequencer is down for more than 15d, users can use the exit hatch to withdraw their funds. The sequencer can censor individual deposits, but in such case after 15d users can get their funds back. Proposer Failure scenario: Users are able to trustlessly exit by submitting a Merkle proof of funds. |
| zkSync Lite | Force Exit to L1 |  |  | Sequencer Failure scenario: Users can force the sequencer to include a withdrawal transaction by submitting a request through L1. If the sequencer censors or is down for for more than 14d, users can use the exit hatch to withdraw their funds. Proposer Failure scenario: Users are able to trustlessly exit by submitting a zero knowledge proof of funds. |
| Metis Andromeda | Transact using L1 |  |  | Sequencer Failure scenario: Users can submit transactions to an L1 queue, but can't force them. The sequencer cannot selectively skip transactions but can stop processing the queue entirely. In other words, if the sequencer censors or is down, it is so for everyone. Proposer Failure scenario: Only the whitelisted proposers can publish state roots on L1, so in the event of failure the withdrawals are frozen. |
| Linea |  |  |  | Sequencer Failure scenario: There is no mechanism to have transactions be included if the sequencer is down or censoring. Proposer Failure scenario: Only the whitelisted proposers can publish state roots on L1, so in the event of failure the withdrawals are frozen. |
| Polygon zkEVM | Force Exit to L1* |  |  | Sequencer Failure scenario: There is no mechanism to have transactions be included if the sequencer is down or censoring. Although the functionality exists in the code, it is currently disabled. Proposer Failure scenario: If the Proposer fails, users can leverage the source available prover to submit proofs to the L1 bridge. There is a 5d delay for proving and a 5d delay for finalizing state proven in this way. These delays can only be lowered except during the emergency state. |
| ApeX |  |  |  | Sequencer Failure scenario: Users can force the sequencer to include a trade or a withdrawal transaction by submitting a request through L1. If the sequencer censors or is down for 7d, users can use the exit hatch to withdraw their funds. Users are required to find a counterparty for the trade by out of system means. Proposer Failure scenario: Users are able to trustlessly exit by submitting a Merkle proof of funds. Positions will be closed using the average price from the last batch state update. |
| ZKSpace | Force Exit to L1 |  |  | Sequencer Failure scenario: Users can force the sequencer to include a withdrawal transaction by submitting a request through L1. If the sequencer censors or is down for for more than 3d, users can use the exit hatch to withdraw their funds. Proposer Failure scenario: Users are able to trustlessly exit by submitting a zero knowledge proof of funds. |
| Arbitrum Nova | Transact using L1 |  |  | Sequencer Failure scenario: In the event of a sequencer failure, users can force transactions to be included in the project's chain by sending them to L1. There is a 1d delay on this operation. Proposer Failure scenario: Anyone can become a Proposer after 6d 8h 43m 36s of inactivity from the currently whitelisted Proposers. |
| Sorare | Force Exit to L1 |  |  | Sequencer Failure scenario: Users can force the sequencer to include a withdrawal transaction by submitting a request through L1. If the sequencer censors or is down for for more than 7d, users can use the exit hatch to withdraw their funds. Proposer Failure scenario: Users are able to trustlessly exit by submitting a Merkle proof of funds. NFTs will be minted on L1 to exit. |
| http://rhino.fi/ | Force Exit to L1 |  |  | Sequencer Failure scenario: Users can force the sequencer to include a withdrawal transaction by submitting a request through L1. If the sequencer censors or is down for for more than 7d, users can use the exit hatch to withdraw their funds. Proposer Failure scenario: Users are able to trustlessly exit by submitting a Merkle proof of funds. |
| Boba Network | Transact using L1 | ⏳ (ETH/ERC20) |  | Sequencer Failure scenario: Users can submit transactions to an L1 queue, but can't force them. The sequencer cannot selectively skip transactions but can stop processing the queue entirely. In other words, if the sequencer censors or is down, it is so for everyone. Proposer Failure scenario: Only the whitelisted proposers can publish state roots on L1, so in the event of failure the withdrawals are frozen. |
| Aevo |  | ⏳ (ETH/ERC20) |  | Sequencer Failure scenario: In the event of a sequencer failure, users can force transactions to be included in the project's chain by sending them to L1. There is a 12h delay on this operation. Proposer Failure scenario: Only the whitelisted proposers can publish state roots on L1, so in the event of failure the withdrawals are frozen. |
| Zora Network |  | ⏳ (ETH/ERC20) |  | Sequencer Failure scenario: In the event of a sequencer failure, users can force transactions to be included in the project's chain by sending them to L1. There is a 12h delay on this operation. Proposer Failure scenario: Only the whitelisted proposers can publish state roots on L1, so in the event of failure the withdrawals are frozen. |
| Aztec Connect | Propose Blocks* |  |  | Sequencer Failure scenario: In the event of a sequencer failure, users can force transactions to be included in the project's chain by sending them to L1. Proposing new blocks requires creating ZK proofs. Proposer Failure scenario: Only the whitelisted proposers can publish L2 state roots on L1 within ~136 years from the last posted root, so in the event of failure the withdrawals are frozen. |
| Aztec | Propose Blocks* |  |  | Sequencer Failure scenario: In the event of a sequencer failure, users can force transactions to be included in the project's chain by sending them to L1. Proposing new blocks requires creating ZK proofs. Proposer Failure scenario: If the Proposer fails, users can leverage the source available prover to submit proofs to the L1 bridge. |
| DeGate V2 |  |  |  | Sequencer Failure scenario: Users can force the sequencer to include a withdrawal transaction by submitting a request through L1 with a 0.01 ETH fee. If the sequencer is down for more than 15d, users can use the exit hatch to withdraw their funds. The sequencer can censor individual deposits, but in such case after 15d users can get their funds back. Proposer Failure scenario: Users are able to trustlessly exit by submitting a Merkle proof of funds. |
| Brine |  |  |  | Sequencer Failure scenario: Users can force the sequencer to include a withdrawal transaction by submitting a request through L1. If the sequencer censors or is down for for more than 7d, users can use the exit hatch to withdraw their funds. Proposer Failure scenario: Users are able to trustlessly exit by submitting a Merkle proof of funds. |
| Manta Pacific |  | ⏳ (ETH/ERC20) |  | Sequencer Failure scenario: In the event of a sequencer failure, users can force transactions to be included in the project's chain by sending them to L1. There is a 12h delay on this operation. Proposer Failure scenario: Only the whitelisted proposers can publish state roots on L1, so in the event of failure the withdrawals are frozen. |
| DeGate V1 |  |  |  | Sequencer Failure scenario: Users can force the sequencer to include a withdrawal transaction by submitting a request through L1 with a 0.01 ETH fee. If the sequencer is down for more than 15d, users can use the exit hatch to withdraw their funds. The sequencer can censor individual deposits, but in such case after 15d users can get their funds back. Proposer Failure scenario: Users are able to trustlessly exit by submitting a Merkle proof of funds. |
| Public Goods Network |  | ⏳ (ETH/ERC20) |  | Sequencer Failure scenario: In the event of a sequencer failure, users can force transactions to be included in the project's chain by sending them to L1. There is a 12h delay on this operation. Proposer Failure scenario: Only the whitelisted proposers can publish state roots on L1, so in the event of failure the withdrawals are frozen. |
| Layer2.Finance | None |  |  | - |
| Layer2.Finance-zk | Force Exit to L1 |  |  | - |
| Myria |  |  |  | Sequencer Failure scenario: Users can force the sequencer to include a withdrawal transaction by submitting a request through L1. If the sequencer censors or is down for for more than 7d, users can use the exit hatch to withdraw their funds. Proposer Failure scenario: Users are able to trustlessly exit by submitting a Merkle proof of funds. NFTs will be minted on L1 to exit. |
| Kroma |  | ⏳ (ETH/ERC20) |  | Sequencer Failure scenario: In the event of a sequencer failure, users can force transactions to be included in the project's chain by sending them to L1. There is a 12h delay on this operation. Proposer Failure scenario: Anyone can be a Proposer and propose new roots to the L1 bridge. |
| Canvas Connect |  |  |  | Sequencer Failure scenario: Users can force the sequencer to include a withdrawal transaction by submitting a request through L1. If the sequencer censors or is down for for more than 7d, users can use the exit hatch to withdraw their funds. Proposer Failure scenario: Users are able to trustlessly exit by submitting a Merkle proof of funds. NFTs will be minted on L1 to exit. |
| Fuel v1 | Propose Blocks |  |  | Sequencer Failure scenario: In the event of a sequencer failure, users can force transactions to be included in the project's chain by sending them to L1. Proposer Failure scenario: Anyone can be a Proposer and propose new roots to the L1 bridge. |
| Eclipse |  |  |  | - |
| Neon evm |  |  |  | - |                                                        |




The escape hatch mechanism could change with time. Please refer to [L2Beat's sequencer failure column](https://l2beat.com/scaling/risk) for the latest information.

---
## What are escape hatches and why do we need them?

Here is a nice introductory talk about [escape hatches](https://www.youtube.com/watch?v=xjEK8PrH9kQ).

---

Checklist for L2 escape hatches for each L2:

- [ ] Show all the relevant assets that the user owns on a particular L2: native token, and alternative tokens (e.g. ERC20s, NFTs)
- [ ] Allow user to escape desired assets to L1 and show all the involved steps (with time duration and cost estimation)

---

## Installation

Clone this repo

```
git clone https://github.com/nitantchhajed/op-stack-bridge.git

yarn 
```

## Running the service

- Copy `.env.example` into a new file named `.env`, then set the environment variables listed there.

- Update the contract addresses of `USDT, DAI, USDC, wBTC` `(L1_Token_Address, L2_Token_Address)` https://github.com/nitantchhajed/op-stack-bridge/blob/be390d177cdb6bea0d1745830a2ee490b06ebe7e/src/components/Deposit.js#L138 in `src/components/Deposit.js` & `Withdraw.js` 
  or you can remove their functionality if you don't want to bridge tokens.

Once your environment variables or flags have been set, run the service via:

```
yarn start
```
