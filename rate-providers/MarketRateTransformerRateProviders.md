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

    - csUSDL v1.1 (Steakhouse) [ethereum:0x9062a576D3e6Cf6999e99e405608063033c4CFF6](https://etherscan.io/address/0x9062a576D3e6Cf6999e99e405608063033c4CFF6#code)
        - ERC4626RateProvider: MetaMorphoV1_1
        - ERC4626Vault's `asset` rate provider: Wrapped USDL (wUSDL) ERC4626 Rate Provider

    - WeETH [base:0x4FE32815684C54bB779359A99ff3a7Ef424079E3](https://basescan.org/address/0x4FE32815684C54bB779359A99ff3a7Ef424079E3)
        - ERC4626RateProvider: Wrapped Aave Base weETH
        - ERC4626Vault's `asset` rate provider: ChainlinkRateProvider

    - weETH [arbitrum:0xcdAa68ce322728FE4185a60f103C194F1E2c47BC](https://arbiscan.io/address/0xcdAa68ce322728FE4185a60f103C194F1E2c47BC)
        - ERC4626RateProvider: Wrapped Aave Arbitrum weETH
        - ERC4626Vault's `asset` rate provider: ChainlinkRateProvider

    - Wrapped Aave Arbitrum wstETH [arbitrum:0xcdAa68ce322728FE4185a60f103C194F1E2c47BC](https://arbiscan.io/address/0x9CC54cb63E61c7D5231c506e4206Eb459250D2A7)
        - ERC4626RateProvider: Wrapped Aave Arbitrum wstETH
        - ERC4626Vault's `asset` rate provider: ChainlinkRateProvider

    - Wrapped Aave Arbitrum rETH [arbitrum:0x9062a576D3e6Cf6999e99e405608063033c4CFF6](https://arbiscan.io/address/0x9062a576D3e6Cf6999e99e405608063033c4CFF6)
        - ERC4626RateProvider: Wrapped Aave Arbitrum rETH 
        - ERC4626Vault's `asset` rate provider: Rocket pool custom rate provider

    - Wrapped Aave Arbitrum ezETH [arbitrum:0xfa5D15F15bC1BeBf3B413d9373E27586ac799dB6](https://arbiscan.io/address/0xfa5D15F15bC1BeBf3B413d9373E27586ac799dB6)
        - ERC4626RateProvider: Wrapped Aave Arbitrum ezETH 
        - ERC4626Vault's `asset` rate provider: Renzo's custom rate provider
    
    - Fluid wstETH [ethereum: 0x8Be2e3D4b85d05cac2dBbAC6c42798fb342aef45](https://etherscan.io/address/0x8be2e3d4b85d05cac2dbbac6c42798fb342aef45)
        - ERC4626RateProvider: Fluid Wrapped Staked Eth 
        - ERC4626Vault's `asset` rate provider: Fluid's custom rate provider

- Audit report(s):
    - [Formal Verification Report For StaticAToken](https://github.com/aave-dao/aave-v3-origin/blob/067d29eb75115179501edc4316d125d9773f7928/audits/11-09-2024_Certora_StataTokenV2.pdf)
    - [Security Reviews & Formal Verifications](https://docs.morpho.org/security-reviews/)
    - [MetaMorpho Spearbit Audit](https://github.com/morpho-org/metamorpho/blob/main/audits/2023-11-14-metamorpho-cantina-managed-review.pdf)

## Context
Aave markets Lido a-wstETH & a-wstETH
The ERC4626 RateProvider fetches the rate of Static Aave Tokens in terms of USDC or USDT. The exchange rate is provided by the Aave V3 `POOL` and fetched via `getReserveNormalizedIncome` from the pool and wrapped as part of the `convertToAsset` call to the `StataTokenV2`. 

csUSDL & v1.1
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

    #### Coinshift USDL (csUSDL) v1.1
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

    #### Wrapped Aave Base weETH 
    - [base:0x4FE32815684C54bB779359A99ff3a7Ef424079E3](https://basescan.org/address/0x4FE32815684C54bB779359A99ff3a7Ef424079E3#readContract)
        - upgradeable component: `StataTokenV2` ([base:0x6acD0a165fD70A84b6b50d955ff3628700bAAf4b](https://basescan.org/address/0x6acD0a165fD70A84b6b50d955ff3628700bAAf4b#readProxyContract))
        - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2PoolInstance` ([base:0xA238Dd80C259a72e81d7e4664a9801593F98d1c5](https://basescan.org/address/0xA238Dd80C259a72e81d7e4664a9801593F98d1c5#readProxyContract))
        - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.

    #### Wrapped Aave Base wstETH
    - [base:0xcb1f29103F710A0A562de7f0e9DDE223D0860674](https://basescan.org/address/0xcb1f29103F710A0A562de7f0e9DDE223D0860674#readContract)
        - upgradeable component: `StataTokenV2` ([base:0x0830820D1A9aa1554364752d6D8F55C836871B74](https://basescan.org/address/0x0830820D1A9aa1554364752d6D8F55C836871B74))
        - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2PoolInstance` ([base:0xA238Dd80C259a72e81d7e4664a9801593F98d1c5](https://basescan.org/address/0xA238Dd80C259a72e81d7e4664a9801593F98d1c5#readProxyContract))
        - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.

    #### Wrapped Aave Base cbETH
    - [base:0x940748d30315276362f594ECcCb648A4f9aB7629](https://basescan.org/address/0x940748d30315276362f594ECcCb648A4f9aB7629#readContract)
        - upgradeable component: `StataTokenV2` ([base:0x5e8B674127B321DC344c078e58BBACc3f3008962](https://basescan.org/address/0x5e8B674127B321DC344c078e58BBACc3f3008962#readProxyContract))
        - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2PoolInstance` ([base:0xA238Dd80C259a72e81d7e4664a9801593F98d1c5](https://basescan.org/address/0xA238Dd80C259a72e81d7e4664a9801593F98d1c5))
        - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.

    #### Wrapped Aave Base ezETH
    - [base:0xFF4B2CE4131E0Fb6b8A40447B4dF96Bdc83f759a](https://basescan.org/address/0xFF4B2CE4131E0Fb6b8A40447B4dF96Bdc83f759a#readContract)
        - upgradeable component: `StataTokenV2` ([base:0xF8F10f39116716e89498c1c5E94137ADa11b2BC7](https://basescan.org/address/0xF8F10f39116716e89498c1c5E94137ADa11b2BC7#readProxyContract))
        - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2PoolInstance` ([base:0xA238Dd80C259a72e81d7e4664a9801593F98d1c5](https://basescan.org/address/0xA238Dd80C259a72e81d7e4664a9801593F98d1c5))
        - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.

    #### Wrapped Aave Arbitrum weETH
    - [arbitrum:0xcdAa68ce322728FE4185a60f103C194F1E2c47BC](https://arbiscan.io/address/0xcdAa68ce322728FE4185a60f103C194F1E2c47BC#readContract)
        - upgradeable component: `StataTokenV2` ([arbitrum:0xD9E3Ef2c12de90E3b03F7b7E3964956a71920d40](https://arbiscan.io/address/0xD9E3Ef2c12de90E3b03F7b7E3964956a71920d40#readProxyContract))
        - admin address: [arbitrum:0xFF1137243698CaA18EE364Cc966CF0e02A4e6327](https://arbiscan.io/address/0xFF1137243698CaA18EE364Cc966CF0e02A4e6327)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2PoolInstance` ([arbitrum:0x794a61358D6845594F94dc1DB02A252b5b4814aD](https://arbiscan.io/address/0x794a61358D6845594F94dc1DB02A252b5b4814aD#readProxyContract))
        - admin address: [arbitrum:0xFF1137243698CaA18EE364Cc966CF0e02A4e6327](https://arbiscan.io/address/0xFF1137243698CaA18EE364Cc966CF0e02A4e6327)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.

    #### Wrapped Aave Arbitrum wstETH
    - [arbitrum:0x9CC54cb63E61c7D5231c506e4206Eb459250D2A7](https://arbiscan.io/address/0x9CC54cb63E61c7D5231c506e4206Eb459250D2A7)
        - upgradeable component: `StataTokenV2` ([arbitrum:0xe98fc055c99DECD8Da0c111B090885d5d15C774E](https://arbiscan.io/address/0xe98fc055c99DECD8Da0c111B090885d5d15C774E))
        - admin address: [arbitrum:0xFF1137243698CaA18EE364Cc966CF0e02A4e6327](https://arbiscan.io/address/0xFF1137243698CaA18EE364Cc966CF0e02A4e6327)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2PoolInstance` ([arbitrum:0x794a61358D6845594F94dc1DB02A252b5b4814aD](https://arbiscan.io/address/0x794a61358D6845594F94dc1DB02A252b5b4814aD))
        - admin address: [arbitrum:0xFF1137243698CaA18EE364Cc966CF0e02A4e6327](https://arbiscan.io/address/0xFF1137243698CaA18EE364Cc966CF0e02A4e6327)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.

    #### Wrapped Aave Arbitrum rETH
    - [arbitrum:0xbB8A61425DFE172AA3a6f882aAFaBA00B32b7d59](https://arbiscan.io/address/0xbB8A61425DFE172AA3a6f882aAFaBA00B32b7d59)
        - upgradeable component: `StataTokenV2` ([arbitrum:0xbB8A61425DFE172AA3a6f882aAFaBA00B32b7d59](https://arbiscan.io/address/0xbB8A61425DFE172AA3a6f882aAFaBA00B32b7d59#readProxyContract))
        - admin address: [arbitrum:0xFF1137243698CaA18EE364Cc966CF0e02A4e6327](https://arbiscan.io/address/0xFF1137243698CaA18EE364Cc966CF0e02A4e6327)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2PoolInstance` ([arbitrum:0x794a61358D6845594F94dc1DB02A252b5b4814aD](https://arbiscan.io/address/0x794a61358D6845594F94dc1DB02A252b5b4814aD))
        - admin address: [arbitrum:0xFF1137243698CaA18EE364Cc966CF0e02A4e6327](https://arbiscan.io/address/0xFF1137243698CaA18EE364Cc966CF0e02A4e6327)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.

    #### Wrapped Aave Arbitrum ezETH
    - [arbitrum:0x4ff50C17df0D1b788d021ACd85039810a1aA68A1](https://arbiscan.io/address/0xbB8A61425DFE172AA3a6f882aAFaBA00B32b7d59)
        - upgradeable component: `StataTokenV2` ([arbitrum:0x4ff50C17df0D1b788d021ACd85039810a1aA68A1](https://arbiscan.io/address/0xbB8A61425DFE172AA3a6f882aAFaBA00B32b7d59#readProxyContract))
        - admin address: [arbitrum:0xFF1137243698CaA18EE364Cc966CF0e02A4e6327](https://arbiscan.io/address/0xFF1137243698CaA18EE364Cc966CF0e02A4e6327)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2PoolInstance` ([arbitrum:0x794a61358D6845594F94dc1DB02A252b5b4814aD](https://arbiscan.io/address/0x794a61358D6845594F94dc1DB02A252b5b4814aD))
        - admin address: [arbitrum:0xFF1137243698CaA18EE364Cc966CF0e02A4e6327](https://arbiscan.io/address/0xFF1137243698CaA18EE364Cc966CF0e02A4e6327)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.


### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

    #### Wrapped Aave Base weETH
    - The ERC4626 Vault utilises a Chainlink Rate Provider at [base:0x5a7A419C59eAAdec8Dc00bc93ac95612e6e154Cf](https://basescan.org/address/0x5a7A419C59eAAdec8Dc00bc93ac95612e6e154Cf#code)
    #### Wrapped Aave Base wstETH
    - The ERC4626 Vault utilises a Chainlink Rate Provider at [base:0x3b3dd5f913443bb5E70389F29c83F7DCA460CAe1](https://basescan.org/address/0x3b3dd5f913443bb5E70389F29c83F7DCA460CAe1)
    #### Wrapped Aave Base cbETH
    - The ERC4626 Vault utilises a Chainlink Rate Provider at [base:0x3786a6CAAB433f5dfE56503207DF31DF87C5b5C1](https://basescan.org/address/0x3786a6CAAB433f5dfE56503207DF31DF87C5b5C1)
    #### Wrapped Aave Base ezETH
    - The ERC4626 Vault utilises a Chainlink Rate Provider at [base:0x6ac3b3BeCE5AA61C6AB5d50ecd2D47b1f18ACe49](https://basescan.org/address/0x6ac3b3BeCE5AA61C6AB5d50ecd2D47b1f18ACe49)
    #### Wrapped Aave Arbitrum weETH
    - The ERC4626 Vault utilises a Chainlink Rate Provider at [base:0xCd9e3fb32c8F258555b8292531112bBb5B87E2F4](https://arbiscan.io/address/0xCd9e3fb32c8F258555b8292531112bBb5B87E2F4#code)
    #### Wrapped Aave Arbitrum wstETH 
    - The ERC4626 Vault utilises a Chainlink Rate Provider at [base:0xf7c5c26B574063e7b098ed74fAd6779e65E3F836](https://arbiscan.io/address/0xf7c5c26B574063e7b098ed74fAd6779e65E3F836)


- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Conclusion
**Summary judgment: USABLE**

The Rate Providers should work well with Balancer pools. The underlying contracts have been audited and been in production for an extended period of time. The upgradeability of the underlying Aave protocol is guarded behind decentralized governance and has a minimum execution delay of 24 hours. 

Morpho: The Rate Providers should work well with Balancer pools. The underlying contracts have been audited and been in production for an extended period of time.
