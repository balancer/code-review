# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @mattpereira
- Checked by: @mkflow27
- Deployed at:
    - [sepolia:0xB1B171A07463654cc1fE3df4eC05f754E41f0A65](https://sepolia.etherscan.io/address/0xB1B171A07463654cc1fE3df4eC05f754E41f0A65)
    - [sepolia:0x22db61f3a8d81d3d427a157fdae8c7eb5b5fd373](https://sepolia.etherscan.io/address/0x22db61f3a8d81d3d427a157fdae8c7eb5b5fd373)
    - [sepolia:0x34101091673238545De8a846621823D9993c3085](https://sepolia.etherscan.io/address/0x34101091673238545De8a846621823D9993c3085)
- Audit report(s):
    - [Scaffold Audits](https://github.com/balancer/scaffold-balancer-v3)

## Context
Testnet rate providers for the static AAVE tokens balancer is using to test boosted pools feature of v3 contracts

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use. @mendesfabio deployed these contracts

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
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.


## Conclusion
**Summary judgment: SAFE**

These are only testnet rate providers with a spoof audit report link to allow for pool creation UI development that is reliant on `priceRateProviderData` returned by the `tokenGetTokens` query of the Balancer API