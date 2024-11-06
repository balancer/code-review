# Rate Provider: `ChainlinkRateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @danielmkm
- Deployed at:
    - [mode:0xFAD2f1b6B24d475BAA79DfA625073981bCD82A0e](https://modescan.io/address/0xFAD2f1b6B24d475BAA79DfA625073981bCD82A0e/contract/34443/code )
- Audit report(s):
    - [Pyth security](https://docs.pyth.network/home/security)

## Context
Pyth Network price feeds provide real-time financial market data to smart contract applications on 50+ blockchains. Pyth's market data is contributed by over 95 reputable first-party data providers, including some of the biggest exchanges and market making firms in the world. Each price feed publishes a robust aggregate of these prices multiple times per second.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [ ] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).

- [x] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price).
    - upgradeable component: `PythUpgradable` ([mode:0xA2aa501b19aff244D90cc15a4Cf739D2725B5729](https://modescan.io/address/0xA2aa501b19aff244D90cc15a4Cf739D2725B5729/contract/34443/readProxyContract))
    - admin address: [mode:0x0000000000000000000000000000000000000000](https://modescan.io/address/0x0000000000000000000000000000000000000000)
    - admin type: Burned
        - comment: The upgradeability admin is set to the zero address. See for this also the code comments
        ```solidity
        // Only allow the owner to upgrade the proxy to a new implementation.
        // The contract has no owner so this function will always revert
        // but UUPSUpgradeable expects this method to be implemented.
        function _authorizeUpgrade(address) internal override onlyOwner {}
        ```

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source: Pyth network signed data
    - source address: Any address that has access to signed price data, which can be fetched from the pyth network api. 
    - any protections? YES: price data must be signed by the python network. More information can be found in the pyth [api docs](https://api-reference.pyth.network/price-feeds/evm/updatePriceFeeds)
    > This method updates the on-chain price feeds using the provided updateData, which contains serialized and signed price update data from Pyth Network. You can retrieve the latest price updateData for a given set of price feeds from the Hermes API.


- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.


## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

This rate provider should work well with Balancer pools. It is important to note that this pricefeed does not have a staleness check and the underlying pyth price data can return a price from arbitrarily in the past. Additional upgradeability powers are considered burned.
