# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @danielmkm
- Deployed at:
    - Lido a-wstETH [ethereum:0xcdAa68ce322728FE4185a60f103C194F1E2c47BC](https://etherscan.io/address/0xcdAa68ce322728FE4185a60f103C194F1E2c47BC#code)
        - ERC4626RateProvider: aave wsteth market
        - ERC4626Vault's `asset` rate provider: Wrapped Staked Eth

    - csUSDL (Steakhouse) [ethereum:0x9CC54cb63E61c7D5231c506e4206Eb459250D2A7](https://etherscan.io/address/0x9CC54cb63E61c7D5231c506e4206Eb459250D2A7#code)
        - ERC4626RateProvider: MetaMorpho
        - ERC4626Vault's `asset` rate provider: Wrapped USDL (wUSDL) ERC4626 Rate Provider

    - a-wstETH [gnosis:0x30EAcEC6BD250589043De026e45dc9A158C65a1F](https://gnosisscan.io/address/0x30EAcEC6BD250589043De026e45dc9A158C65a1F#readContract)
        - ERC4626RateProvider: aave wsteth market
        - ERC4626Vault's `asset` rate provider: Wrapped Staked Eth

- Audit report(s):
    - [Formal Verification Report For StaticAToken](https://github.com/aave-dao/aave-v3-origin/blob/067d29eb75115179501edc4316d125d9773f7928/audits/11-09-2024_Certora_StataTokenV2.pdf)
    - [Security Reviews & Formal Verifications](https://docs.morpho.org/security-reviews/)
    - [MetaMorpho Spearbit Audit](https://github.com/morpho-org/metamorpho/blob/main/audits/2023-11-14-metamorpho-cantina-managed-review.pdf)

## Context
Aave markets Lido a-wstETH & a-wstETH
The ERC4626 RateProvider fetches the rate of Static Aave Tokens in terms of USDC or USDT. The exchange rate is provided by the Aave V3 `POOL` and fetched via `getReserveNormalizedIncome` from the pool and wrapped as part of the `convertToAsset` call to the `StataTokenV2`. 

csUSDL
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

    #### Wrapped Aave Ethereum Lido wstETH
    - [ethereum:0x775F661b0bD1739349b9A2A3EF60be277c5d2D29](https://etherscan.io/address/0x775F661b0bD1739349b9A2A3EF60be277c5d2D29#code)
        - upgradeable component: `StataTokenV2` ([ethereum:0xD4fa2D31b7968E448877f69A96DE69f5de8cD23E](https://etherscan.io/address/0xD4fa2D31b7968E448877f69A96DE69f5de8cD23E#readProxyContract))
        - admin address: [ethereum:0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `Pool` ([ethereum:0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2](https://etherscan.io/address/0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2#readProxyContract))
        - admin address: [ethereum:0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours

    #### Wrapped Aave Gnosis wstETH
    - [gnosis:0x773CDA0CADe2A3d86E6D4e30699d40bB95174ff2](https://gnosisscan.io/address/0x773CDA0CADe2A3d86E6D4e30699d40bB95174ff2#readProxyContract)
        - upgradeable component: `StataTokenV2` ([gnosis:0x51350d88c1bd32Cc6A79368c9Fb70373Fb71F375](https://gnosisscan.io/address/0x51350d88c1bd32Cc6A79368c9Fb70373Fb71F375.#readProxyContract))
        - admin address: [gnosis:0x1dF462e2712496373A347f8ad10802a5E95f053D](https://gnosisscan.io/address/0x1dF462e2712496373A347f8ad10802a5E95f053D)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2Pool` ([gnosis:0xb50201558B00496A145fE76f7424749556E326D8](https://gnosisscan.io/address/0xb50201558B00496A145fE76f7424749556E326D8#code))
        - admin address: [gnosis:0x1dF462e2712496373A347f8ad10802a5E95f053D](https://gnosisscan.io/address/0x1dF462e2712496373A347f8ad10802a5E95f053D#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours

    #### Coinshift USDL (csUSDL)
    The Metamorpho Vault
    - Part of the rate computation relies of `totalAssets` being calculated. This function iterates over a list of Ids. This list of Ids can be changed by the Allocator role. The potential impact has not been thoroughly investigated. There are however protections in place to protect against invalid changes such as
        - `revert ErrorsLib.DuplicateMarket(id);`
        - `revert ErrorsLib.InvalidMarketRemovalNonZeroCap(id);`
        - `revert ErrorsLib.PendingCap(id);`
        - `ErrorsLib.InvalidMarketRemovalNonZeroSupply(id);`
        - `ErrorsLib.InvalidMarketRemovalTimelockNotElapsed(id);`
    - Also take into account the vaultAssetPriceFeed. This was investigated as part of the [review](./wUSDLPaxosRateProvider.md) with the upgradeable component: `wYBSV1` ([ethereum:0x7751E2F4b8ae93EF6B79d86419d42FE3295A4559](https://etherscan.io/address/0x7751E2F4b8ae93EF6B79d86419d42FE3295A4559#readProxyContract))
    - admin address: [ethereum:0x60Be07b68214d49aF3Ec8fa89c7fc0970De0A94E](https://etherscan.io/address/0x60Be07b68214d49aF3Ec8fa89c7fc0970De0A94E#code)
    - admin type: multisig
        - multisig threshold/signers: 3/20
    - upgradeable component: `YBSV1` ([ethereum:0xbdC7c08592Ee4aa51D06C27Ee23D5087D65aDbcD](https://etherscan.io/address/0xbdC7c08592Ee4aa51D06C27Ee23D5087D65aDbcD#code))
    - admin address: [ethereum:0x65bcf790Cb8ADf60D5f54eC2E10DE8C83886E0AE](https://etherscan.io/address/0x65bcf790Cb8ADf60D5f54eC2E10DE8C83886E0AE#code)
    - admin type: multisig
        - multisig threshold/signers: 3/17

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Conclusion
**Summary judgment: USABLE**

The Rate Providers should work well with Balancer pools. The underlying contracts have been audited and been in production for an extended period of time. The upgradeability of the underlying Aave protocol is guarded behind decentralized governance and has a minimum execution delay of 24 hours. 

Morpho: The Rate Providers should work well with Balancer pools. The underlying contracts have been audited and been in production for an extended period of time.
