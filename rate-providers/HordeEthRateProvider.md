# Rate Provider: `HETHRateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0x5A2295f0b8A1f2b9bF26b9549Ce808c68e1a3F5f](https://etherscan.io/address/0x5A2295f0b8A1f2b9bF26b9549Ce808c68e1a3F5f#readProxyContract)
- Audit report(s):
    - [Horde Eth audits](https://docs.hord.fi/security/smart-contract-audits)

## Context
In doing so, you will be given a token called hETH. hETH is an ERC-20 standard token based on Ethereum. hETH represents both how much ETH you deposited and when you deposited it combined with rewards. The ratio includes rewards that Hord node operators earn from:
- The Beacon Chain itself
- Priority fees from block proposals
- MEV rewards from block proposals

More specifically, the value of hETH is determined by the following ratio:
hETH price in ETH = (amount of ETH deposited + ETH rewards generated) / amount of hETH minted.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [x] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).
    - admin address: [ethereum:0x086A6d9FD61758096CF4F394AE7C1F9B6b4EEC14](https://etherscan.io/address/0x086A6d9FD61758096CF4F394AE7C1F9B6b4EEC14)
    - admin type: multisig
        - multisig threshold/signers: 2/3 (Hord governance)
        

- [x] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price).
    - upgradeable component: `HordETHStakingManager` ([ethereum:0x5bBe36152d3CD3eB7183A82470b39b29EedF068B](https://etherscan.io/address/0x5bBe36152d3CD3eB7183A82470b39b29EedF068B))
    - admin address: [ethereum:0x086A6d9FD61758096CF4F394AE7C1F9B6b4EEC14](https://etherscan.io/address/0x086A6d9FD61758096CF4F394AE7C1F9B6b4EEC14)
    - admin type: multisig
        - multisig threshold/signers: 2/3 (Hord governance)


### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source:
    - source address:
    - any protections?
    - comment: impossible to verify as a downstream contract is not verified on Etherscan.

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).
    - description:
    - should be:
    - comment: impossible to verify as a downstream contract is not verified on Etherscan.


### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.
    - comment: impossible to verify as a downstream contract is not verified on Etherscan.


## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: UNSAFE**

It is impossible to verify the functionality of this rate provider as an essential rate calculation component is unverified on Etherscan.
