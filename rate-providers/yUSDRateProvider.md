# Rate Provider: ERC4626RateProvider

## Details
- Reviewed by: @brunoguerios
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0xa65ffBa1CD05414df3fD24Bf5dc319B47450Fbf4](https://etherscan.io/address/0xa65ffBa1CD05414df3fD24Bf5dc319B47450Fbf4)
- Audit report(s):
    - [Protocol Audits](https://docs.yield.fi/resources/audits)

## Context
This rate provider works with a standard approach of `totalAssets/totalSupply`.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be usable despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [ ] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).

- [x] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price).
    
    - upgradeable component: `YToken` ([ethereum:0x1CE7D9942ff78c328A4181b9F3826fEE6D845A97](https://etherscan.io/address/0x1CE7D9942ff78c328A4181b9F3826fEE6D845A97#code))
    - admin address: [ethereum:0x7CF37712eb0b50644e70828d5F5c3CE5B054c479](https://etherscan.io/address/0x7CF37712eb0b50644e70828d5F5c3CE5B054c479)
    - admin type: EOA
    ---
    - upgradeable component: `Administrator` ([ethereum:0x9305a0cc13293b69deE0B9d281D21144b029BdFf](https://etherscan.io/address/0x9305a0cc13293b69deE0B9d281D21144b029BdFf#code))
    - admin address: [ethereum:0x7CF37712eb0b50644e70828d5F5c3CE5B054c479](https://etherscan.io/address/0x7CF37712eb0b50644e70828d5F5c3CE5B054c479)
    - admin type: EOA
    ---
    - upgradeable component: `Yield` ([ethereum:0xf4eF3ba63593dfD0967577B2bb3C9ba51D78427b](https://etherscan.io/address/0xf4eF3ba63593dfD0967577B2bb3C9ba51D78427b#code))
    - admin address: [ethereum:0x7CF37712eb0b50644e70828d5F5c3CE5B054c479](https://etherscan.io/address/0x7CF37712eb0b50644e70828d5F5c3CE5B054c479)
    - admin type: EOA


### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

No additional findings.

## Conclusion
**Summary judgment: UNUSABLE**

Rate provider is a standard ERC4626RateProvider that relies on totalAssets/totalSupply, but all other contracts in the pipeline are upgradeable and managed by an EOA, such as, the erc4626 asset `yUSD` and the `yield` contract that can directly influence the rate by updating `totalAssets`.
