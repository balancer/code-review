# Rate Provider: `Api3AggregatorAdaptor`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [mode:0x054Ca7F10D555A0A34E35E6d95af9569468E40c0](https://explorer.mode.network/address/0x054Ca7F10D555A0A34E35E6d95af9569468E40c0?tab=read_contract)
- Audit report(s):
    - [API3 security](https://dapi-docs.api3.org/reference/dapis/understand/security.html)

## Context
This RateProvider is updated via the API3 product. It reports the exchangeRate of ETH/ezETH on mainnet. It is read on mainnet and available as an Oracle on mode. 

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
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source: API3. 
    - source address: The data is sourced from multiple so called "beacons" which are a set of nodes which provide the rate data to be aggregated by the `Api3ServerV1` [mode:0x709944a48cAf83535e43471680fDA4905FB3920a](https://modescan.io/address/0x709944a48cAf83535e43471680fDA4905FB3920a/contract/34443/code)
    - any protections? The rate is calculated as the median of all the rate data "fetched" from beacons. For more information about more protections see [api3 docs](https://docs.api3.org/reference/dapis/understand/deviations.html) and consult the `updateBeaconSetWithBeacons` & `updateOevProxyDataFeedWithSignedData` functions.

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

This rate provider should work well with Balancer pools. API3 updates the rate on mode regularly and has various protections in place to ensure the correct values are bridged accurately. 
