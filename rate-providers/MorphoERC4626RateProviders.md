# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @danielmkm
- Deployed at:
    - Steakhouse USDC [ethereum:0xc81D60E39e065146c6dE186fFC5B39e4CA2189Cf](https://etherscan.io/address/0xc81D60E39e065146c6dE186fFC5B39e4CA2189Cf#code)
    - Steakhouse USDT [ethereum:0x50A72232c5370321aa78036BaDe8e9d5eB89cbAF](https://etherscan.io/address/0x50A72232c5370321aa78036BaDe8e9d5eB89cbAF#code)
    - Steakhouse wUSDL - csUSDL [ethereum:0xbEc8a14233e68C02e803B999DbA3D0f9C5076394](https://etherscan.io/address/0xbEc8a14233e68C02e803B999DbA3D0f9C5076394#code)
    - Gauntlet Prime wETH [ethereum:0x0A25a2C62e3bA90F1e6F08666862df50cdAAB1F5](https://etherscan.io/address/0x0A25a2C62e3bA90F1e6F08666862df50cdAAB1F5#code)
    - Steakhouse v1.1 USDC - csUSDC [ethereum:0xB0926Cfc3aC047035b11d9afB85DC782E6D9d76A](https://etherscan.io/address/0xB0926Cfc3aC047035b11d9afB85DC782E6D9d76A#code)
    - Gauntlet wETH Ecosystem v1.1[ethereum:0xD231564648C94542C01e9a528c9cAa033bbf274C](https://etherscan.io/address/0xD231564648C94542C01e9a528c9cAa033bbf274C#code)
    - IndexCoop mhyETH v1.1[ethereum:0x3BD4B2174498b3Aa01be0acFa0F775472b2dC30b](https://etherscan.io/address/0x3BD4B2174498b3Aa01be0acFa0F775472b2dC30b#code)
    - Seamless USDC v1.1[base:0xc11082BbDBB8AaB12d0947EEAD2c8bc28E1b3B34](https://basescan.org/address/0xc11082BbDBB8AaB12d0947EEAD2c8bc28E1b3B34#code)
    - Spark USDC v1.1[base:0x9e0926C3c5D2F42845Bf4F980F926b60323872d7](https://basescan.org/address/0x9e0926C3c5D2F42845Bf4F980F926b60323872d7#code)
    - Ionic USDC v1.1[base:0xdCb03A77bB54E0a05D591e543FA39E9c46E8Febb](https://basescan.org/address/0xdCb03A77bB54E0a05D591e543FA39E9c46E8Febb#code)
    - Ionic Ecosystem WETH v1.1[base:0xcc028cF7F8fA7986001fa7063A2E26b3094b42fd](https://basescan.org/address/0xcc028cF7F8fA7986001fa7063A2E26b3094b42fd#code)



- Audit report(s):
    - [Security Reviews & Formal Verifications](https://docs.morpho.org/security-reviews/)
    - [MetaMorpho Spearbit Audit](https://github.com/morpho-org/metamorpho/blob/main/audits/2023-11-14-metamorpho-cantina-managed-review.pdf)
    - [MetaMorpho v1.1 Audits](https://github.com/morpho-org/metamorpho-v1.1/tree/main/audits)

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
    #### v1.1 Steakhouse Coinshift USDC 
    For [Steakhouse csUSDC](https://etherscan.io/address/0xB0926Cfc3aC047035b11d9afB85DC782E6D9d76A) some allocators are eoas.
    - 0xfeed46c11F57B7126a773EeC6ae9cA7aE1C03C9a
    - 0xfd32fA2ca22c76dD6E550706Ad913FC6CE91c75D
    - 0x29d4CDFee8F533af8529A9e1517b580E022874f7
    #### Gauntlet wETH Ecosystem v1.1
    For [Gauntlet wETH Ecosystem](https://etherscan.io/address/0x1e6ffa4e9F63d10B8820A3ab52566Af881Dab53c) some allocators are eoas.
    #### IndexCoop mhyETH (wETH) v1.1
    For [IndexCoop mhyETH](https://etherscan.io/address/0x701907283a57FF77E255C3f1aAD790466B8CE4ef) some allocators are eoas.
    - 0x622271CEC64F6106020F31773Ec5293F4677cb95
    #### Seamless USDC v1.1
    For [Seamless USDC](https://basescan.org/address/0x616a4e1db48e22028f6bbf20444cd3b8e3273738) some allocators are eoas.
    - 0x8a438a7fb092E5D074a7aDe03E7eD25015817c58
    #### Spark USDC v1.1
    For [Spark USDC](https://basescan.org/address/0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A) no allocators are eoas. Only one allocator exists, which is a multi-sig.
    #### Ionic USDC v1.1
    For [Ionic USDC](https://basescan.org/address/0x23479229e52Ab6aaD312D0B03DF9F33B46753B5e#events) some allocators are eoas.
    - 0x1f9A8c72327242b64bd21945E9750F5C5F50Eee1 
    #### Ionic WETH v1.1
    For [Ionic WETH](https://basescan.org/address/0x5A32099837D89E3a794a44fb131CBbAD41f87a8C) some allocators are eoas.
    - 0x5f0761eed6Cd7F0Bd91d847E955cD78Bb50B0647



### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Conclusion
**Summary judgment: v1.1 is USABLE**

The Rate Providers should work well with Balancer pools. The underlying contracts have been audited and been in production for an extended period of time.
