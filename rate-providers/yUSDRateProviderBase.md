# Rate Provider: `ChainlinkRateProvider`

## Details
- Reviewed by: @brunoguerios
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [base:0xD47c15CDD7c734db321F07CB9AB1f852aE9A0b83](https://basescan.org/address/0xD47c15CDD7c734db321F07CB9AB1f852aE9A0b83)
- Audit report(s):
    - [Protocol Audits](https://docs.yield.fi/resources/audits)

## Context
This RateProvider is updated via the API3 product. It reports the exchangeRate of yUSD/USD on mainnet. It is read on mainnet and available as an Oracle on base.

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
    - upgradeable component: `Api3ReaderProxyV1` ([base:0xE88DA976479461080072D6461128fd401B6D4Dcb](https://basescan.org/address/0xE88DA976479461080072D6461128fd401B6D4Dcb#code))
    - admin address: [base:0x2AAE699ed04BBbD068f67a5b3C813eBB35f2c9E8](https://basescan.org/address/0x2AAE699ed04BBbD068f67a5b3C813eBB35f2c9E8)
    - admin type: multisig
        - multisig threshold/signers: 4/8
        - multisig timelock? NO
        - trustworthy signers? NO

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source: API3. 
    - source address: The data is sourced from multiple so called "beacons" which are a set of nodes which provide the rate data to be aggregated by the `Api3ServerV1` [base:0x709944a48cAf83535e43471680fDA4905FB3920a](https://basescan.org/address/0x709944a48cAf83535e43471680fDA4905FB3920a#code)
    - any protections? The rate is calculated as the median of all the rate data "fetched" from beacons. For more information about more protections see [api3 docs](https://docs.api3.org/reference/dapis/understand/deviations.html) and consult the `updateBeaconSetWithBeacons` & `updateOevProxyDataFeedWithSignedData` functions.

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

This rate provider should work well with Balancer pools. API3 updates the rate on base regularly and has various protections in place to ensure the correct values are bridged accurately.
