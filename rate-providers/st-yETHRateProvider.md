# Rate Provider: `styETHRateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @danielmkm
- Deployed at:
    - [ethereum:0x748d749c6Cd0cCA8f53F66A3A0D75a91E2978d65](https://etherscan.io/address/0x748d749c6cd0cca8f53f66a3a0d75a91e2978d65#code)
- Audit report(s):
    - [yETH audits](https://github.com/yearn/yETH/blob/main/audits/01-chainsecurity.pdf)

## Context
Users stake their yETH to mint st-yETH, accrue yield, and later unstake st-yETH to receive yETH back according to their earnings. Stakers receive all yield and slashings from the beacon chain (Ethereum proof-of-stake validators) and earn incentives if they participate and vote in yETH governance.
By bundling LSTs, st-yETH aims to generate the best risk-adjusted yield from ETH staking. Through protocol governance, st-yETH users can readjust pool weights to maximize yield while mitigating catastrophic scenarios where one or several LSTs in the yETH composition suffer adverse events like de-pegging or security incidents.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [ ] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).

- [x] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price). \<Delete this hint: If unchecked, delete all of the bullets below.\>
    - upgradeable component: `yETH` ([ethereum:0x1BED97CBC3c24A4fb5C069C6E311a967386131f7](https://vscode.blockscan.com/ethereum/0x1BED97CBC3c24A4fb5C069C6E311a967386131f7))
    - admin address: [ethereum:0xbBBBBbbB6B942883EAd4976882C99201108c784d](https://etherscan.io/address/0xbBBBBbbB6B942883EAd4976882C99201108c784d#readProxyContract)
    - admin type: multisig 3/5
    - comment: The `yETH` `management` can assign the minter role.
        

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks.
    - comment: The rate can be influenced by sending `asset` to the staking contract. and triggering the `if current > last:` execution path of `_get_amounts`, increasing the value of `unlocked` which is used as part of the rate calculation. For more information see the code [here](https://vscode.blockscan.com/ethereum/0x583019fF0f430721aDa9cfb4fac8F06cA104d0B4).


## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

This rate provider should work well with Balancer pools. While the downstream system can be paused, upgradeability is not part of the onchain deployments. 
