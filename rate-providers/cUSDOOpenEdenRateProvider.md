# Rate Provider: cUSDO OpenEden Rate Provider

## Details
- Reviewed by: @brunoguerios
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0x05E956cb3407b1B22F4ed8568F3C28644Da28B85](https://etherscan.io/address/0x05E956cb3407b1B22F4ed8568F3C28644Da28B85#readContract)
- Audit report(s):
    - [Protocol Audits](https://docs.openeden.com/treasury-bills-vault/risks)
    - [ChainSecurity Audit](https://github.com/OpenEdenHQ/audit-reports/blob/main/ChainSecurity/ChainSecurity_OpenEden_USDO_audit.pdf)
    - [Additional Active Audit](https://audits.hacken.io/openeden/)

## Context
Rate provider is a standard ERC4626RateProvider that relies on totalAssets/totalSupply.

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
    - upgradeable component: `cUSDO` ([ethereum:0xad55aebc9b8c03fc43cd9f62260391c13c23e7c0](https://etherscan.io/address/0xad55aebc9b8c03fc43cd9f62260391c13c23e7c0/))
    - admin address: [ethereum:0x5eaff7af80488033bc845709806d5fae5291eb88](https://etherscan.io/address/0x5eaff7af80488033bc845709806d5fae5291eb88)
    - admin type: EOA

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks.

This is a standard ERC-4626 implementation which is susceptible to donation attacks via live `balanceOf()` queries.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: UNUSABLE**

Rate provider is a standard ERC4626RateProvider that relies on totalAssets/totalSupply, but cUSDO is upgradeable and managed by an EOA. We should be able to consider it USABLE in case cUSDO admin is updated to a multisig.