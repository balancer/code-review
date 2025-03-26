# Rate Provider: `tETH CombinedRateProvider`

## Details
- Reviewed by: @Zen-Maxi
- Checked by: @mkflow27
- Deployed at:
    - tETH [ethereum:0x7Aee5f039da2891BF02414bc6ADA1B53c0C3902a](https://etherscan.io/address/0x7Aee5f039da2891BF02414bc6ADA1B53c0C3902a#code)
    - waEURe [gnosis:0xdDDF909076B641C51f22ACD4b134C54adad51e68](https://gnosisscan.io/address/0xdDDF909076B641C51f22ACD4b134C54adad51e68#code)
    - fwstETH [ethereum: 0x8Be2e3D4b85d05cac2dBbAC6c42798fb342aef45](https://etherscan.io/address/0x8be2e3d4b85d05cac2dbbac6c42798fb342aef45#code)
- Audit report(s):
    - [No audits provided]

## Context
This rate provider combines the rate of two underlying rate providers. These rates can vary from any source on chain, as long the IRateProvider interface is respected. For the purpose of these contracts and their respective factory, the intention is that only reviewed rate providers can be utilized in the CombinedRateProviderFactory to create a new rate when necessary.

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

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price). The rate is based on an open market exchange rate of BRL/USD.

#### Underlying Rate Providers

- tETH Mainnet [ethereum:0x7Aee5f039da2891BF02414bc6ADA1B53c0C3902a](https://etherscan.io/address/0x7Aee5f039da2891BF02414bc6ADA1B53c0C3902a#code)
    - [rateProvider1 tETH](https://etherscan.io/address/0x7C53f86d9a6B01821F916802A7606E9255DfE4e2): [TreehouseRateProvider](https://github.com/balancer/code-review/blob/main/rate-providers/TreehouseRateProvider.md) review deemed SAFE
    - [rateProvider2 wsteth](https://etherscan.io/address/0x72D07D7DcA67b8A406aD1Ec34ce969c90bFEE768): [wstETHRateProvider](https://github.com/balancer/code-review/blob/main/rate-providers/wstethRateProvider.md) review deemed SAFE.
    
- waEURe Gnosis [gnosis:0xdDDF909076B641C51f22ACD4b134C54adad51e68](https://gnosisscan.io/address/0xdDDF909076B641C51f22ACD4b134C54adad51e68#code)
    - [rateProvider1 EURe](https://gnosisscan.io/address/0xe7511f6e5c593007ea8a7f52af4b066333765e03): [ChainlinkRateProvider](https://github.com/balancer/code-review/blob/main/rate-providers/ChainLinkRateProvider.md) review deemed SAFE
    - [rateProvider2 Aave EURe](https://gnosisscan.io/address/0x79FE0750bE76913E83a0f0EB60ba1Ab7FA6FdA5D#code): [statATokenv2RateProvider](https://github.com/balancer/code-review/blob/main/rate-providers/statATokenv2RateProvider.md) review deemed SAFE.
 
- fwstETH Mainnet [ethereum: 0x8Be2e3D4b85d05cac2dBbAC6c42798fb342aef45](https://etherscan.io/address/0x8be2e3d4b85d05cac2dbbac6c42798fb342aef45#code)
    - [rateProvider1 fwstETH](https://etherscan.io/address/0x73a9fc5173d211F0D264Af4E816cb44F61E5f4a2): [FluidRateProvider](https://github.com/balancer/code-review/blob/main/rate-providers/FluidRateProvider.md) review deemed SAFE
    - [rateProvider2 wsteth](https://etherscan.io/address/0x72D07D7DcA67b8A406aD1Ec34ce969c90bFEE768): [wstETHRateProvider](https://github.com/balancer/code-review/blob/main/rate-providers/wstethRateProvider.md) review deemed SAFE.

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: USABLE**

This rate provider is a combination of previously investigated rate providers, which were deemed usable. This investigated rate provider should work well with Balancer pools. 
