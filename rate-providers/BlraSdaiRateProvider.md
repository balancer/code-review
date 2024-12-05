# Rate Provider: `BlraSdaiRateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @danielmkm
- Deployed at:
    - [gnosis:0xCCfE43E5853C87225948317379ffD910039f6A14](https://gnosisscan.io/address/0xCCfE43E5853C87225948317379ffD910039f6A14#code)
- Audit report(s):
    - [No audits provided]

## Context
This rate provider fetches the BRLA (brasilian real) / USD exchange rate from a Chronicle Labs Oracle. It then divides by the `sDaiDaiRate` to calculate the `blraSdaiRate`.

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
    - source: Chronicle Labs
    - source address: [ethereum:0xEB2F9EF61A2174A4066CB36E265Ea6D5Dd0ADCFe](https://gnosisscan.io/address/0xEB2F9EF61A2174A4066CB36E265Ea6D5Dd0ADCFe#code)
    - any protections? YES
            The oracle is based on a previous review. For more information see the [review]("./TollgateChronicleRateProvider.md"). 

- [x] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price). The rate is based on an open market exchange rate of BRL/USD.

### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks. For details see the [review]("./SavingsDAIRateProviderGnosis.md").

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: USABLE**

This rate provider is a combination of previously investigated rate providers, which were deemed usable. This investigated rate provider should work well with Balancer pools. 
