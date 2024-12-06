# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: 
- Deployed at:
    - Steakhouse USDC [ethereum:0xc81D60E39e065146c6dE186fFC5B39e4CA2189Cf](https://etherscan.io/address/0xc81D60E39e065146c6dE186fFC5B39e4CA2189Cf#code)
    - Steakhouse USDT [ethereum:0x50A72232c5370321aa78036BaDe8e9d5eB89cbAF](https://etherscan.io/address/0x50A72232c5370321aa78036BaDe8e9d5eB89cbAF#code)
     - Steakhouse wUSDL - csUSDL [ethereum:0xbEc8a14233e68C02e803B999DbA3D0f9C5076394](https://etherscan.io/address/0xbEc8a14233e68C02e803B999DbA3D0f9C5076394#code)
    - Gauntlet Prime wETH [ethereum:0x0A25a2C62e3bA90F1e6F08666862df50cdAAB1F5](https://etherscan.io/address/0x0A25a2C62e3bA90F1e6F08666862df50cdAAB1F5#code)


- Audit report(s):
    - [Security Reviews & Formal Verifications](https://docs.morpho.org/security-reviews/)
    - [MetaMorpho Spearbit Audit](https://github.com/morpho-org/metamorpho/blob/main/audits/2023-11-14-metamorpho-cantina-managed-review.pdf)

## Context
The ERC4626 RateProvider fetches the rate of MetaMorpho Vault tokens in terms of the underlying asset. The exchange rate is provided via the conversion between totalAssets and totalSupply. The Morpho contract only determines the potential market parameters, assets, collaterals, beneficiary, owner, fee, and cooldown periods related to the vault curator. There are no entry or exit fees, and no time locks for users to deposit and withdraw from this vault. 

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
    Part of the rate computation relies of `totalAssets` being calculated. This function iterates over a list of Ids. This list of Ids can be changed by the Allocator role. The potential impact has not been thoroughly investigated. There are however protections in place to protect against invalid changes such as
    - `revert ErrorsLib.DuplicateMarket(id);`
    - `revert ErrorsLib.InvalidMarketRemovalNonZeroCap(id);`
    - `revert ErrorsLib.PendingCap(id);`
    - `ErrorsLib.InvalidMarketRemovalNonZeroSupply(id);`
    - `ErrorsLib.InvalidMarketRemovalTimelockNotElapsed(id);`

    #### Steakhouse USDC 
    For [Steakhouse USDC](https://etherscan.io/address/0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB) some allocators are eoas.
    - 0x0D61C8b6CA9669A36F351De3AE335e9689dd9C5b
    - 0xcC771952fdE840E30C6802734e5ad20479c2959f
    - 0xfd32fA2ca22c76dD6E550706Ad913FC6CE91c75D
    - 0xfeed46c11F57B7126a773EeC6ae9cA7aE1C03C9a
    #### Steakhouse USDT
    For [Steakhouse USDT](https://etherscan.io/address/0xbEef047a543E45807105E51A8BBEFCc5950fcfBa) some allocators are eoas.
    - 0xfeed46c11F57B7126a773EeC6ae9cA7aE1C03C9a
    - 0xfd32fA2ca22c76dD6E550706Ad913FC6CE91c75D
    - 0x29d4CDFee8F533af8529A9e1517b580E022874f7
    #### Gauntlet Prime wETH
    For [Gauntlet Prime wETH](https://etherscan.io/address/0x2371e134e3455e0593363cBF89d3b6cf53740618) some allocators are eoas.
    - 0xfd32fA2ca22c76dD6E550706Ad913FC6CE91c75D
    - 0x959d73CB5a1C1ad7EbCE3eC93FAD3b2f9a25432E
    
### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Conclusion
**Summary judgment: USABLE**

The Rate Providers should work well with Balancer pools. The underlying contracts have been audited and been in production for an extended period of time.
