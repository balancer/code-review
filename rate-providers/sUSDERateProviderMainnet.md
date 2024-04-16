# Rate Provider: `EthenaBalancerRateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0x3A244e6B3cfed21593a5E5B347B593C0B48C7dA1](https://etherscan.io/address/0x3a244e6b3cfed21593a5e5b347b593c0b48c7da1#code)
- Audit report(s):
    - [Ethena Audits](https://ethena-labs.gitbook.io/ethena-labs/resources/audits)

## Context
The sUSDE Rate Provider on Mainnet reports the exchangeRate of USDe per sUSDe. The chosen approach calculates the rate by dividing total assets over total Supply. 
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

Technically, any entity can donate the `asset()` - in this case USDe - to the USDe staking contract (sUSDE) to increase its `totalAssets()`. Ethena uses a donation as well to increase `totalAssets`. However their approach is to smooth the rateIncrease by deducting the donation as a `unvestedAmount` (`getUnvestedAmount()`).

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

This Rate Provider should work well with Balancer pools. It's approach towards handling protocol internal donations for rate increases has a smoothing effect. 
