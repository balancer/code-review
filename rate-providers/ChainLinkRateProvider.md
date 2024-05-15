# Rate Provider: Rate Providers predating this repo

## Details
- Reviewed by: @mkflow27
- Checked by: N.A.
- Deployed at:
    See the `RateProviderCreated(address indexed rateProvider)` events emitted by the `ChainLinkRateProviderFactory` contracts deployed on
    - [Ethereum mainnet addresses](https://etherscan.io/address/0x1311Fbc9F60359639174c1e7cC2032DbDb5Cc4d1)
    - [Polygon mainnet addresses](https://polygonscan.com/address/0xa3b370092aeb56770B23315252aB5E16DAcBF62B#code)
    - [Arbitrum mainnet addresses](https://arbiscan.io/address/0x5DbAd78818D4c8958EfF2d5b95b28385A22113Cd#code)
    - [Optimism mainnet addresses](https://optimistic.etherscan.io/address/0x83E443EF4f9963C77bd860f94500075556668cb8)
    - [BSC mainnet addresses](https://bscscan.com/address/0x6817149cb753BF529565B4D023d7507eD2ff4Bc0#code)
    - [Gnosis mainnet addresses](https://gnosisscan.io/address/0xDB8d758BCb971e482B2C45f7F8a7740283A1bd3A#code)
    - [Avalanche mainnet addresses](https://snowtrace.dev/address/0x76578ecf9a141296Ec657847fb45B0585bCDa3a6/contract/43114/code)
    - [Polygon zkEVM mainnet addresses](https://zkevm.polygonscan.com/address/0x4132f7AcC9dB7A6cF7BE2Dd3A9DC8b30C7E6E6c8#code)
    - [Base mainnet addresses](https://basescan.org/address/0x0a973b6db16c2ded41dc91691cc347beb0e2442b#code)
    - [Goerli testnet addresses](https://goerli.etherscan.io/address/0xDB8d758BCb971e482B2C45f7F8a7740283A1bd3A#code)
    - [Sepolia testnet addresses](https://sepolia.etherscan.io/address/0xA8920455934Da4D853faac1f94Fe7bEf72943eF1#code)
- Audit report(s):
    - N.A.

## Context
ChainLink Rate Providers are Rate Providers that expose a Chainlink Pricefeed's data scaled to a fixed-point value with 18 decimals. 

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

### Oracles
- Chainlink Data Feeds provide data that is aggregated from many data sources by a [decentralized set of independent node operators](https://docs.chain.link/architecture-overview/architecture-decentralized-model?parent=dataFeeds). The Decentralized Data Model describes this in detail. However, there are some exceptions where data for a feed can come only from a single data source or where data values are calculated.

## Conclusion
**Summary judgment: SAFE**

Chainlink Rate Providers have been working well with Balancer pools for an extended amount of time. A specific review for the involved Rate Provider is not accessible as this review is applicable to all Chainlink Rate Providers.