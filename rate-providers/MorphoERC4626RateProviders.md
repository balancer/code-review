# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @danielmkm
- Deployed at:
    - Steakhouse wUSDL - csUSDL [ethereum:0xbEc8a14233e68C02e803B999DbA3D0f9C5076394](https://etherscan.io/address/0xbEc8a14233e68C02e803B999DbA3D0f9C5076394#code)
    - Steakhouse v1.1 USDC - csUSDC [ethereum:0xB0926Cfc3aC047035b11d9afB85DC782E6D9d76A](https://etherscan.io/address/0xB0926Cfc3aC047035b11d9afB85DC782E6D9d76A#code)
    - Gauntlet wETH Ecosystem v1.1[ethereum:0xD231564648C94542C01e9a528c9cAa033bbf274C](https://etherscan.io/address/0xD231564648C94542C01e9a528c9cAa033bbf274C#code)
    - Steakhouse USDQ [ethereum:0xb42Ecf39FC9251f2B2F094e02e6cE4557f364436](https://etherscan.io/address/0xb42Ecf39FC9251f2B2F094e02e6cE4557f364436#code)
    - Steakhouse USDR [ethereum:0xc6465F11D8Db8DAcB5c94729c4F2b3Bd725a2392](https://etherscan.io/address/0xc6465F11D8Db8DAcB5c94729c4F2b3Bd725a2392#code)
    - Steakhouse USDT Lite [ethereum:0x23B315083e80804A696b26093974c61eBC78CC9a](https://etherscan.io/address/0x23B315083e80804A696b26093974c61eBC78CC9a#code)



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

    #### v1.1 Steakhouse Coinshift USDC 
    For [Steakhouse csUSDC](https://etherscan.io/address/0xB0926Cfc3aC047035b11d9afB85DC782E6D9d76A) some allocators are eoas.
    - 0xfeed46c11F57B7126a773EeC6ae9cA7aE1C03C9a
    - 0xfd32fA2ca22c76dD6E550706Ad913FC6CE91c75D
    - 0x29d4CDFee8F533af8529A9e1517b580E022874f7
    #### Gauntlet wETH Ecosystem v1.1
    For [Gauntlet wETH Ecosystem](https://etherscan.io/address/0x1e6ffa4e9F63d10B8820A3ab52566Af881Dab53c) some allocators are eoas.
    #### [Steakhouse USDQ](https://etherscan.io/address/0xA1b60d96e5C50dA627095B9381dc5a46AF1a9a42)
    - upgradeable component: [Quantoz USDQ](https://etherscan.io/address/0xc83e27f270cce0A3A3A29521173a83F402c1768b#code) ( the asset of the vault )
    - admin: [MultiSigWallet Contract](https://etherscan.io/address/0xa6724f792002d5677a7bc370986e1b580b8773e7#code) ( with 5 owners )
    - implementation: [HadronToken](https://etherscan.io/address/0xbae166f5e8b4b6735341446b1405fa779a92d7c7#code)
    #### [Steakhouse USDR](https://etherscan.io/address/0x30881baa943777f92dc934d53d3bfdf33382cab3)
    - upgradeable component: [StablR USD](https://etherscan.io/address/0x7B43E3875440B44613DC3bC08E7763e6Da63C8f8#code) ( the asset of the vault )
    - admin: [MultiSigWallet Contract](https://etherscan.io/address/0xbfff92d76b74cf8f0a56adde7c89aa671a22953c#code) ( with 5 owners )
    - implementation: [HadronToken](https://etherscan.io/address/0x8b98bcd9b1f8ae112fb2b58b45c3bc9a75cc4d0e#code)

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Conclusion
**Summary judgment: v1.1 is USABLE**

The Rate Providers should work well with Balancer pools. The underlying contracts have been audited and been in production for an extended period of time.
