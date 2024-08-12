# Rate Provider: `\<Name of Reviewed Contract\>`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0xF0207Ffa0b793E009DF9Df62fEE95B8FC6c93EcF](https://etherscan.io/address/0xf0207ffa0b793e009df9df62fee95b8fc6c93ecf#readProxyContract)
- Audit report(s):
    - [YieldNestProtocol](https://docs.yieldnest.finance/security/audits)

## Context
ynETH is an nLRT that exposes users to a dynamically curated Basket comprising AVSs across multiple industry verticals. The YieldNest DAO carefully selects and fully vets all of the operators and AVS within ynETH’s Basket to deliver an nLRT with the highest possible risk-adjusted yield.

Restakers deposit ETH into YieldNest’s restaking pool and receive ynETH back as a tradable and liquid “receipt” token representing the underlying yield-generating restaked ETH.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [x] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).
    - admin address: [ethereum:0xfcad670592a3b24869C0b51a6c6FDED4F95D6975](https://etherscan.io/address/0xfcad670592a3b24869C0b51a6c6FDED4F95D6975)
    - admin type: multisig
        - multisig threshold/signers: 3/5

- [x] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price). 
    - upgradeable component: `ynETH` ([ethereum:0x09db87A538BD693E9d08544577d5cCfAA6373A48](https://etherscan.io/address/0x09db87A538BD693E9d08544577d5cCfAA6373A48#readProxyContract))
    - admin address: [ethereum:0xfcad670592a3b24869C0b51a6c6FDED4F95D6975](https://etherscan.io/address/0xfcad670592a3b24869C0b51a6c6FDED4F95D6975)
    - admin type: multisig
        - multisig threshold/signers: 3/5

    - upgradeable component: `StakingNodesManager` ([ethereum:0x8C33A1d6d062dB7b51f79702355771d44359cD7d](https://etherscan.io/address/0x8C33A1d6d062dB7b51f79702355771d44359cD7d))
    - admin address: [ethereum:0xfcad670592a3b24869C0b51a6c6FDED4F95D6975](https://etherscan.io/address/0xfcad670592a3b24869C0b51a6c6FDED4F95D6975)
    - admin type: multisig
        - multisig threshold/signers: 3/5

    - upgradeable component: `StakingNode` ([ethereum:0x144dA5E59228E9C558B8F692Dde6c48f890D0d96](https://etherscan.io/address/0x144dA5E59228E9C558B8F692Dde6c48f890D0d96#code))
    - admin address: [ethereum:0xfcad670592a3b24869C0b51a6c6FDED4F95D6975](https://etherscan.io/address/0xfcad670592a3b24869C0b51a6c6FDED4F95D6975)
    - admin type: multisig
        - multisig threshold/signers: 3/5
    - comment: The rate calculations are based on iterating over a set of staking nodes. Each staking node is a Beacon based proxy contract. 
    
        
### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

This rate provider should work well with Balancer pools. Upgradeability mechanisms are properly guarded behind a multisig. This rate provider uses a total assets / total supply approach to calculate the rate. 
