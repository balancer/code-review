

# Rate Provider: `PriceFeed`

## Details
- Reviewed by: @mkflow27
- Checked by: @rabmarut
- Deployed at:
    - [ethereum:0x8023518b2192FB5384DAdc596765B3dD1cdFe471](https://etherscan.io/address/0x8023518b2192FB5384DAdc596765B3dD1cdFe471)
- Audit report(s):
    - [Stakewise audits](https://github.com/stakewise/v3-core/tree/main/audits)

## Context
StakeWise customers can participate in Ethereum's Proof-of-Stake consensus mechanism and receive ETH rewards in return. By introducing osETH StakeWise enabled liquid staking.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider!s checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [ ] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).

- [x] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price). 
    - upgradeable component: `OsTokenVaultController` ([ethereum:0x2A261e60FB14586B474C208b1B7AC6D0f5000306](https://etherscan.io/address/0x2A261e60FB14586B474C208b1B7AC6D0f5000306#code))
    - admin address: ([ethereum:0x144a98cb1CdBb23610501fE6108858D9B7D24934](https://etherscan.io/address/0x144a98cb1CdBb23610501fE6108858D9B7D24934#code))
    - admin type: multisig
        - multisig threshold/signers: 4/7
        - multisig timelock? NO
        - trustworthy signers? NO
    - context: the `avgRewardPerSecond` can be set by a `keeper`. This `keeper` can be changed by the `OsTokenVaultController`'s owner.

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source: `keeper` sets `avgRewardPerSecond` in the `osTokenVaultController` via `setAvgRewardPerSecond`. 
    - any protections? YES
        - guarded behind a time delay `canUpdateRewards`
        - bound by threshold `_maxAvgRewardPerSecond`
        - requires valid signatures
        - NOTE: these protections do not apply to the `owner` multisig, which has the power to completely replace the `keeper` contract (and should therefore be assumed to have complete authority over setting `avgRewardsPerSecond`.

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

- N/A


## Conclusion
**Summary judgment: SAFE**

This is a solid rateProvider that reports the osETH <> ETH exchange rate. While part of the price data is based on off-chain components, the off-chain component is guarded behind solid validity checks. The rate Provider should work well with pool operations. 
