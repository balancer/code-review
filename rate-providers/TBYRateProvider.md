# Rate Provider: `TBYRateProvider`

## Details
- Reviewed by: @baileyspraggins
- Checked by: @rabmarut
- Deployed at:
    - `TBYRateProviderFactory`: [ethereum:0x97390050B63eb56C0e39bB0D8d364333Eb3AFD12](https://etherscan.io/address/0x97390050B63eb56C0e39bB0D8d364333Eb3AFD12)
- Audit report(s):
    - [Bloom-security-review](https://github.com/pashov/audits/blob/master/solo/Bloom-security-review.md): Protocol audit completed by [pashov](https://github.com/pashov).
## Context
The `TBYRateProvider` is a RateProvider for Blueberrey's Bloom Protocol. This RateProvider will be used for future Balancer pools that are created for TBY. TBYs are Term Bound Yield Tokens, which are treasury-backed debt tokens that accrue interest at the same rate as Blackrock's ib01 1-year treasury bond.

This RateProvider will be used to calculate the price of TBYs using Bloom's `ExchangeRateRegistry`. The registry keeps track of all TBYs in circulation and provides current exchange rates for each token in terms of USD. The exchange rate is calculated using `BPSFeed` and the time to maturity for a given token.

`BPSFeed` stores the current interest rate of ib01 as well as a weighted average of all interest rates over time. The current interest rate is calculated off-chain, using Chainlink's [ib01 oracle](https://data.chain.link/ethereum/mainnet/indexes/ib01-usd) scaled down to four decimals, and is provided by `BPSFeed`'s owner. The weighted average can be queried using `getWeightedRate`.

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
    - source: `BPSFeed` accepts updates from a multisig `owner`
        - source address: [ethereum:0xDe1f5F2d69339171D679FB84E4562febb71F36E6](https://etherscan.io/address/0xDe1f5F2d69339171D679FB84E4562febb71F36E6#code)
        - multisig address: [ethereum:0x91797a79fEA044D165B00D236488A0f2D22157BC](https://etherscan.io/address/0x91797a79fEA044D165B00D236488A0f2D22157BC#code)
            - multisig threshold/signers: 2/3
            - multisig timelock? NO
            - trustworthy signers? NO - All non-ENS addresses
                - [ethereum:0x21c2bd51f230D69787DAf230672F70bAA1826F67](https://etherscan.io/address/0x21c2bd51f230D69787DAf230672F70bAA1826F67)
                - [ethereum:0x4850D609D34389F5E3d8A61c41091f2f3de595C3](https://etherscan.io/address/0x4850D609D34389F5E3d8A61c41091f2f3de595C3)
                - [ethereum:0xCe64ACD38C96c3C8ed0522Af01B4fAd082BEaCeF](https://etherscan.io/address/0xCe64ACD38C96c3C8ed0522Af01B4fAd082BEaCeF)
        - any protections? YES
            - Interest rate cannot be less than 0% or more than 50%.
            - Time-weighted average greatly dampens impact of any manipulation by the owner.

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).
    - While `BPSFeed` tracks the average interest rate of ib01, the token's exchange rate will monotonically increase until its maturity date.
    
### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

- N/A

## Conclusion
**Summary judgment: SAFE**

The `TBYRateProvider` has been confirmed to be safe given some fundamental trust assumptions. The rateProvider satisfies the minimum requirements and there are reasonable protections in place on rate updates, but due to interest rate calculations occuring off-chain, the user must assume that the Bloom team's multisig correctly calculates this average rate off-chain, using Chainlink's price feed, and accurately updates the rate.

