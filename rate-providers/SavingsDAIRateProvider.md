# Rate Provider: `SavingsDAIRateProvider`

## Details
- Reviewed by: @rabmarut
- Checked by: @baileyspraggins
- Deployed at:
    - [ethereum:0xc7177B6E18c1Abd725F5b75792e5F7A3bA5DBC2c](https://etherscan.io/address/0xc7177b6e18c1abd725f5b75792e5f7a3ba5dbc2c#code)
- Audit report(s):
    - [ChainSecurity - Savings Dai](https://github.com/makerdao/sdai/blob/0377fa3a3e8af846f7511fb7cfe18c2e276e9dfa/audits/ChainSecurity_Oazo_Apps_Limited_Savings_Dai_audit_1.pdf)

## Context
Savings DAI (`sDAI`) is a yield-bearing token representing `DAI` deposited in Maker's DAI Saving Rate (DSR) module.

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
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

- N/A

## Conclusion
**Summary judgment: SAFE**

This is a highly minimal Rate Provider that queries the exchange rate directly from the `sDAI` token, which computes/queries it directly from the DAI Savings Rate (DSR) module. There are no privileges, upgradeability, or oracles anywhere in the system, and prices are fetched from verifiable on-chain data. The largest "threat" lies in MakerDAO's ability to set the Savings Rate, but this is hardly a threat at all. MakerDAO is one of the largest and longest-standing DAOs in DeFi, and the Savings Rate is fundamental in governing the `DAI` token.

This Rate Provider sets the standard to which others should be measured.
