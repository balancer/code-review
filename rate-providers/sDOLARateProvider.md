# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0xD02011C6C8AEE310D0aA42AA98BFE9DCa547fCc0](https://etherscan.io/address/0xd02011c6c8aee310d0aa42aa98bfe9dca547fcc0#code)
- Audit report(s):
    - [sDOLA audit](https://www.inverse.finance/audits/sDOLA-yAudit.pdf)

## Context
sDOLA is a yield-bearing stablecoin structured as an ERC-4626 wrapper around a DOLA Savings Account (DSA) contract that continuously streams DOLA Borrowing Rights rewards to staked DOLA and auto-compounds them. The Rate provider exposes the `convertToAssets` of sDOLA via a `getRate()` function and makes the rate consumable by Balancer pools.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [ ] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).

- [ ] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price).

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks.

The price is dependent on evaluation of `totalAssets()` which also evaluates the balance of [`DolaSavings`](https://etherscan.io/address/0xE5f24791E273Cb96A1f8E5B67Bc2397F0AD9B8B4#code) in the [`sDOLA`] contract by reading it via `balanceOf()`. 
```solidity
uint actualAssets = savings.balanceOf(address(this)) - remainingLastRevenue - weeklyRevenue[week];
```
By sending `DolaSavings` to the `sDOLA` contract, the price can be influenced by a donation.


## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.


## Conclusion
**Summary judgment: SAFE**

This Rate Provider should work well with Balancer pools. The Rate Provider and downstream contracts not being upgradeable decrease the potential attack surface and make the Rate Provider immutable. 
