# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @danielmkm
- Deployed at:
    - wETH [ethereum:0xBe7bE04807762Bc433911dD927fD54a385Fa91d6](https://etherscan.io/address/0xBe7bE04807762Bc433911dD927fD54a385Fa91d6#code)
    - USDC [ethereum:0x8f4E8439b970363648421C692dd897Fb9c0Bd1D9](https://etherscan.io/address/0x8f4E8439b970363648421C692dd897Fb9c0Bd1D9#code)
    - USDT [ethereum:0xEdf63cce4bA70cbE74064b7687882E71ebB0e988](https://etherscan.io/address/0xEdf63cce4bA70cbE74064b7687882E71ebB0e988#code)
    - Lido wETH [ethereum:0xf4b5D1C22F35a460b91edD7F33Cefe619E2fAaF4](https://etherscan.io/address/0xf4b5D1C22F35a460b91edD7F33Cefe619E2fAaF4#code)
    - USDe [ethereum:0xdB44A0223604ABAD704C4bCDDAAd88b101953246](https://etherscan.io/address/0xdB44A0223604ABAD704C4bCDDAAd88b101953246#code)
    - Lido GHO [ethereum:0x851b73c4BFd5275D47FFf082F9e8B4997dCCB253](https://etherscan.io/address/0x851b73c4BFd5275D47FFf082F9e8B4997dCCB253#code)    

    - wETH [gnosis:0x0008A59C1d2E5922790C929ea432ed02D4D3323A](https://gnosisscan.io/address/0x0008A59C1d2E5922790C929ea432ed02D4D3323A#readContract)
    - GNO [gnosis:0xbbb4966335677Ea24F7B86DC19a423412390e1fb](https://gnosisscan.io/address/0xbbb4966335677Ea24F7B86DC19a423412390e1fb#code)
    - USDC.e [gnosis:0x1529f6Af353E180867F257820843425B49B1b478](https://gnosisscan.io/address/0x1529f6Af353E180867F257820843425B49B1b478#code)
    - Wrapped Aave Arbitrum WETH [arbitrum:0xE3dF105DB16282E5ce5cDa2d15391b04A408BcCf](https://arbiscan.io/address/0xE3dF105DB16282E5ce5cDa2d15391b04A408BcCf#readContract)
    - Wrapped Aave Arbitrum WBTC [arbitrum:0xDEA44786E61fd5475B35869586737D99B5e6dB59](https://arbiscan.io/address/0xDEA44786E61fd5475B35869586737D99B5e6dB59#readContract)
    - USDCn [arbitrum:0xDAff80737b23A6E40F77Aa28957a10c9Af5dff45](https://arbiscan.io/address/0xDAff80737b23A6E40F77Aa28957a10c9Af5dff45)
    - Wrapped Aave Arbitrum USDT [arbitrum:0xc6B25ba4c028Cb238AB7CaC7a2ee59Ed4F1E96d4](https://arbiscan.io/address/0xc6B25ba4c028Cb238AB7CaC7a2ee59Ed4F1E96d4)
    - Wrapped Aave Arbitrum LINK [arbitrum:0x957914d31912194911365D644F008E537C0150eb](https://arbiscan.io/address/0x957914d31912194911365D644F008E537C0150eb)
    - Wrapped Aave Arbitrum ARB [arbitrum:0xc7c5820E210dAc087faCD1692A7E66b5fEdA1C75](https://arbiscan.io/address/0xc7c5820E210dAc087faCD1692A7E66b5fEdA1C75)
    - Wrapped Aave Arbitrum DAI [arbitrum:0x788dab521C4607C99F879f327894cC6fAcd217E3](https://arbiscan.io/address/0x788dab521C4607C99F879f327894cC6fAcd217E3#readContract)
    - Wrapped Aave Arbitrum USDC [arbitrum:0x30A225b9e9989bEd9C3e473686a29C9106E4393e](https://arbiscan.io/address/0x30A225b9e9989bEd9C3e473686a29C9106E4393e)
    - Wrapped Aave Arbitrum GHO [arbitrum:0xb866b055D0F970FD48DEA5dB28FdEa5BcAE3EA67](https://arbiscan.io/address/0xb866b055D0F970FD48DEA5dB28FdEa5BcAE3EA67#code)
    - Wrapped Aave Ethereum PYUSD [ethereum:0xb51EDdDD8c47856D81C8681EA71404Cec93E92c6](https://etherscan.io/address/0xb51EDdDD8c47856D81C8681EA71404Cec93E92c6#readProxyContract)

- Audit report(s):
    - [Formal Verification Report For StaticAToken](https://github.com/aave-dao/aave-v3-origin/blob/067d29eb75115179501edc4316d125d9773f7928/audits/11-09-2024_Certora_StataTokenV2.pdf)

## Context
The ERC4626 RateProvider fetches the rate of Static Aave Tokens in terms of USDC or USDT. The exchange rate is provided by the Aave V3 `POOL` and fetched via `getReserveNormalizedIncome` from the pool and wrapped as part of the `convertToAsset` call to the `StataTokenV2`. 

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
    - [ethereum:0xBe7bE04807762Bc433911dD927fD54a385Fa91d6](https://etherscan.io/address/0xBe7bE04807762Bc433911dD927fD54a385Fa91d6#code)
        - upgradeable component: `StataTokenV2` ([ethereum:0x0bfc9d54Fc184518A81162F8fB99c2eACa081202](https://etherscan.io/address/0x0bfc9d54Fc184518A81162F8fB99c2eACa081202#readProxyContract))
        - admin address: [ethereum:0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `Pool` ([ethereum:0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2](https://etherscan.io/address/0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2#readProxyContract))
        - admin address: [ethereum:0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours

    - [ethereum:0x8f4E8439b970363648421C692dd897Fb9c0Bd1D9](https://etherscan.io/address/0x8f4E8439b970363648421C692dd897Fb9c0Bd1D9#code)
        - upgradeable component: `StataTokenV2` ([ethereum:0xD4fa2D31b7968E448877f69A96DE69f5de8cD23E](https://etherscan.io/address/0xD4fa2D31b7968E448877f69A96DE69f5de8cD23E#readProxyContract))
        - admin address: [ethereum:0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `Pool` ([ethereum:0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2](https://etherscan.io/address/0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2#readProxyContract))
        - admin address: [ethereum:0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours

    - [ethereum:0xEdf63cce4bA70cbE74064b7687882E71ebB0e988](https://etherscan.io/address/0xEdf63cce4bA70cbE74064b7687882E71ebB0e988#code)
        - upgradeable component: `StataTokenV2` ([ethereum:0x7Bc3485026Ac48b6cf9BaF0A377477Fff5703Af8](https://etherscan.io/address/0x7Bc3485026Ac48b6cf9BaF0A377477Fff5703Af8#readProxyContract))
        - admin address: [ethereum:0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `Pool` ([ethereum:0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2](https://etherscan.io/address/0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2#readProxyContract))
        - admin address: [ethereum:0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours

    - [ethereum:0xf4b5D1C22F35a460b91edD7F33Cefe619E2fAaF4](https://etherscan.io/address/0xf4b5D1C22F35a460b91edD7F33Cefe619E2fAaF4#code)
        - upgradeable component: `StataTokenV2` ([ethereum:0x0FE906e030a44eF24CA8c7dC7B7c53A6C4F00ce9](https://etherscan.io/address/0x0FE906e030a44eF24CA8c7dC7B7c53A6C4F00ce9#readProxyContract))
        - admin address: [ethereum:0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `Pool` ([ethereum:0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2](https://etherscan.io/address/0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2#readProxyContract))
        - admin address: [ethereum:0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours

   - [ethereum:0xdB44A0223604ABAD704C4bCDDAAd88b101953246](https://etherscan.io/address/0xdB44A0223604ABAD704C4bCDDAAd88b101953246#code)
        - upgradeable component: `StataTokenV2` ([ethereum:0x5F9D59db355b4A60501544637b00e94082cA575b](https://etherscan.io/address/0x5F9D59db355b4A60501544637b00e94082cA575b#readProxyContract))
        - admin address: [ethereum:0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `Pool` ([ethereum:0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2](https://etherscan.io/address/0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2#readProxyContract))
        - admin address: [ethereum:0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours

    - [ethereum:0x851b73c4BFd5275D47FFf082F9e8B4997dCCB253](https://etherscan.io/address/0x851b73c4BFd5275D47FFf082F9e8B4997dCCB253#code)
        - upgradeable component: `StataTokenV2` ([ethereum:0xC71Ea051a5F82c67ADcF634c36FFE6334793D24C](https://etherscan.io/address/0xC71Ea051a5F82c67ADcF634c36FFE6334793D24C#readProxyContract))
        - admin address: [ethereum:0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `Pool` ([ethereum:0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2](https://etherscan.io/address/0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2#readProxyContract))
        - admin address: [ethereum:0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours

    - [gnosis:0x0008A59C1d2E5922790C929ea432ed02D4D3323A](https://gnosisscan.io/address/0x0008A59C1d2E5922790C929ea432ed02D4D3323A#readProxyContract)
        - upgradeable component: `StataTokenV2` ([gnosis:0x57f664882F762FA37903FC864e2B633D384B411A](https://gnosisscan.io/address/0x57f664882F762FA37903FC864e2B633D384B411A#readProxyContract))
        - admin address: [gnosis:0x1dF462e2712496373A347f8ad10802a5E95f053D](https://gnosisscan.io/address/0x1dF462e2712496373A347f8ad10802a5E95f053D)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2Pool` ([gnosis:0xb50201558B00496A145fE76f7424749556E326D8](https://gnosisscan.io/address/0xb50201558B00496A145fE76f7424749556E326D8#code))
        - admin address: [gnosis:0x1dF462e2712496373A347f8ad10802a5E95f053D](https://gnosisscan.io/address/0x1dF462e2712496373A347f8ad10802a5E95f053D#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours

    - [gnosis:0xbbb4966335677Ea24F7B86DC19a423412390e1fb](https://gnosisscan.io/address/0xbbb4966335677Ea24F7B86DC19a423412390e1fb#readProxyContract)
        - upgradeable component: `StataTokenV2` ([gnosis:0x7c16F0185A26Db0AE7a9377f23BC18ea7ce5d644](https://gnosisscan.io/address/0x7c16F0185A26Db0AE7a9377f23BC18ea7ce5d644#readProxyContract))
        - admin address: [gnosis:0x1dF462e2712496373A347f8ad10802a5E95f053D](https://gnosisscan.io/address/0x1dF462e2712496373A347f8ad10802a5E95f053D)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2Pool` ([gnosis:0xb50201558B00496A145fE76f7424749556E326D8](https://gnosisscan.io/address/0xb50201558B00496A145fE76f7424749556E326D8#code))
        - admin address: [gnosis:0x1dF462e2712496373A347f8ad10802a5E95f053D](https://gnosisscan.io/address/0x1dF462e2712496373A347f8ad10802a5E95f053D#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours

    - [gnosis:0x1529f6Af353E180867F257820843425B49B1b478](https://gnosisscan.io/address/0x1529f6Af353E180867F257820843425B49B1b478#readProxyContract)
        - upgradeable component: `StataTokenV2` ([gnosis:0x51350d88c1bd32Cc6A79368c9Fb70373Fb71F375](https://gnosisscan.io/address/0x51350d88c1bd32Cc6A79368c9Fb70373Fb71F375.#readProxyContract))
        - admin address: [gnosis:0x1dF462e2712496373A347f8ad10802a5E95f053D](https://gnosisscan.io/address/0x1dF462e2712496373A347f8ad10802a5E95f053D)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2Pool` ([gnosis:0xb50201558B00496A145fE76f7424749556E326D8](https://gnosisscan.io/address/0xb50201558B00496A145fE76f7424749556E326D8#code))
        - admin address: [gnosis:0x1dF462e2712496373A347f8ad10802a5E95f053D](https://gnosisscan.io/address/0x1dF462e2712496373A347f8ad10802a5E95f053D#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours

    - [arbitrum:0xE3dF105DB16282E5ce5cDa2d15391b04A408BcCf](https://arbiscan.io/address/0xE3dF105DB16282E5ce5cDa2d15391b04A408BcCf#readContract)
        - upgradeable component: `StataTokenV2` ([arbitrum:0x4cE13a79f45C1Be00BdABD38B764aC28C082704E](https://arbiscan.io/address/0x4cE13a79f45C1Be00BdABD38B764aC28C082704E#readProxyContract))
        - admin address: [arbitrum:0xFF1137243698CaA18EE364Cc966CF0e02A4e6327](https://arbiscan.io/address/0xFF1137243698CaA18EE364Cc966CF0e02A4e6327#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2PoolInstance` ([arbitrum:0x794a61358D6845594F94dc1DB02A252b5b4814aD](https://arbiscan.io/address/0x794a61358D6845594F94dc1DB02A252b5b4814aD))
        - admin address: [arbitrum:0xFF1137243698CaA18EE364Cc966CF0e02A4e6327](https://arbiscan.io/address/0xFF1137243698CaA18EE364Cc966CF0e02A4e6327#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.

    - [arbitrum:0xDEA44786E61fd5475B35869586737D99B5e6dB59](https://arbiscan.io/address/0xDEA44786E61fd5475B35869586737D99B5e6dB59#readContract)
        - upgradeable component: `StataTokenV2` ([arbitrum:0x52Dc1FEeFA4f9a99221F93D79da46Ae89b8c0967](https://arbiscan.io/address/0x52Dc1FEeFA4f9a99221F93D79da46Ae89b8c0967))
        - admin address: [arbitrum:0xFF1137243698CaA18EE364Cc966CF0e02A4e6327](https://arbiscan.io/address/0xFF1137243698CaA18EE364Cc966CF0e02A4e6327#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2PoolInstance` ([arbitrum:0x794a61358D6845594F94dc1DB02A252b5b4814aD](https://arbiscan.io/address/0x794a61358D6845594F94dc1DB02A252b5b4814aD))
        - admin address: [arbitrum:0xFF1137243698CaA18EE364Cc966CF0e02A4e6327](https://arbiscan.io/address/0xFF1137243698CaA18EE364Cc966CF0e02A4e6327#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.

    - [arbitrum:0xDAff80737b23A6E40F77Aa28957a10c9Af5dff45](https://arbiscan.io/address/0xDAff80737b23A6E40F77Aa28957a10c9Af5dff45)
        - upgradeable component: `StataTokenV2` ([arbitrum:0x7F6501d3B98eE91f9b9535E4b0ac710Fb0f9e0bc](https://arbiscan.io/address/0x7F6501d3B98eE91f9b9535E4b0ac710Fb0f9e0bc))
        - admin address: [arbitrum:0xFF1137243698CaA18EE364Cc966CF0e02A4e6327](https://arbiscan.io/address/0xFF1137243698CaA18EE364Cc966CF0e02A4e6327#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2PoolInstance` ([arbitrum:0x794a61358D6845594F94dc1DB02A252b5b4814aD](https://arbiscan.io/address/0x794a61358D6845594F94dc1DB02A252b5b4814aD))
        - admin address: [arbitrum:0xFF1137243698CaA18EE364Cc966CF0e02A4e6327](https://arbiscan.io/address/0xFF1137243698CaA18EE364Cc966CF0e02A4e6327#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.

    - [arbitrum:0xc6B25ba4c028Cb238AB7CaC7a2ee59Ed4F1E96d4](https://arbiscan.io/address/0xc6B25ba4c028Cb238AB7CaC7a2ee59Ed4F1E96d4)
        - upgradeable component: `StataTokenV2` ([arbitrum:0xa6D12574eFB239FC1D2099732bd8b5dC6306897F](https://arbiscan.io/address/0xa6D12574eFB239FC1D2099732bd8b5dC6306897F#readProxyContract))
        - admin address: [arbitrum:0xFF1137243698CaA18EE364Cc966CF0e02A4e6327](https://arbiscan.io/address/0xFF1137243698CaA18EE364Cc966CF0e02A4e6327#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2PoolInstance` ([arbitrum:0x794a61358D6845594F94dc1DB02A252b5b4814aD](https://arbiscan.io/address/0x794a61358D6845594F94dc1DB02A252b5b4814aD))
        - admin address: [arbitrum:0xFF1137243698CaA18EE364Cc966CF0e02A4e6327](https://arbiscan.io/address/0xFF1137243698CaA18EE364Cc966CF0e02A4e6327#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.

    - [arbitrum:0x957914d31912194911365D644F008E537C0150eb](https://arbiscan.io/address/0x957914d31912194911365D644F008E537C0150eb)
        - upgradeable component: `StataTokenV2` ([arbitrum:0xEAB84053B99f2ec4433F5121A1CB1524c8c998F8](https://arbiscan.io/address/0xEAB84053B99f2ec4433F5121A1CB1524c8c998F8#readProxyContract))
        - admin address: [arbitrum:0xFF1137243698CaA18EE364Cc966CF0e02A4e6327](https://arbiscan.io/address/0xFF1137243698CaA18EE364Cc966CF0e02A4e6327#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2PoolInstance` ([arbitrum:0x794a61358D6845594F94dc1DB02A252b5b4814aD](https://arbiscan.io/address/0x794a61358D6845594F94dc1DB02A252b5b4814aD))
        - admin address: [arbitrum:0xFF1137243698CaA18EE364Cc966CF0e02A4e6327](https://arbiscan.io/address/0xFF1137243698CaA18EE364Cc966CF0e02A4e6327#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.

    - [arbitrum:0xc7c5820E210dAc087faCD1692A7E66b5fEdA1C75](https://arbiscan.io/address/0xc7c5820E210dAc087faCD1692A7E66b5fEdA1C75)
        - upgradeable component: `StataTokenV2` ([arbitrum:0xf09EDbF2655B2A56753bD60D22CeAB2AC5D04188](https://arbiscan.io/address/0xf09EDbF2655B2A56753bD60D22CeAB2AC5D04188#readProxyContract))
        - admin address: [arbitrum:0xFF1137243698CaA18EE364Cc966CF0e02A4e6327](https://arbiscan.io/address/0xFF1137243698CaA18EE364Cc966CF0e02A4e6327#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2PoolInstance` ([arbitrum:0x794a61358D6845594F94dc1DB02A252b5b4814aD](https://arbiscan.io/address/0x794a61358D6845594F94dc1DB02A252b5b4814aD))
        - admin address: [arbitrum:0xFF1137243698CaA18EE364Cc966CF0e02A4e6327](https://arbiscan.io/address/0xFF1137243698CaA18EE364Cc966CF0e02A4e6327#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.

    - [arbitrum:0x788dab521C4607C99F879f327894cC6fAcd217E3](https://arbiscan.io/address/0x788dab521C4607C99F879f327894cC6fAcd217E3#readContract)
        - upgradeable component: `StataTokenV2` ([arbitrum:0xf253BD61aEd0E9D62523eA76CD6F38B4a51dA145](https://arbiscan.io/address/0xf253BD61aEd0E9D62523eA76CD6F38B4a51dA145))
        - admin address: [arbitrum:0xFF1137243698CaA18EE364Cc966CF0e02A4e6327](https://arbiscan.io/address/0xFF1137243698CaA18EE364Cc966CF0e02A4e6327#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2PoolInstance` ([arbitrum:0x794a61358D6845594F94dc1DB02A252b5b4814aD](https://arbiscan.io/address/0x794a61358D6845594F94dc1DB02A252b5b4814aD))
        - admin address: [arbitrum:0xFF1137243698CaA18EE364Cc966CF0e02A4e6327](https://arbiscan.io/address/0xFF1137243698CaA18EE364Cc966CF0e02A4e6327#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.

    - [arbitrum:0x30A225b9e9989bEd9C3e473686a29C9106E4393e](https://arbiscan.io/address/0x30A225b9e9989bEd9C3e473686a29C9106E4393e)
        - upgradeable component: `StataTokenV2` ([arbitrum:0xE6D5923281c89DC989D00817387292387552d5C1](https://arbiscan.io/address/0xE6D5923281c89DC989D00817387292387552d5C1#readProxyContract))
        - admin address: [arbitrum:0xFF1137243698CaA18EE364Cc966CF0e02A4e6327](https://arbiscan.io/address/0xFF1137243698CaA18EE364Cc966CF0e02A4e6327#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2PoolInstance` ([arbitrum:0x794a61358D6845594F94dc1DB02A252b5b4814aD](https://arbiscan.io/address/0x794a61358D6845594F94dc1DB02A252b5b4814aD))
        - admin address: [arbitrum:0xFF1137243698CaA18EE364Cc966CF0e02A4e6327](https://arbiscan.io/address/0xFF1137243698CaA18EE364Cc966CF0e02A4e6327#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.

    - [arbitrum:0xb866b055D0F970FD48DEA5dB28FdEa5BcAE3EA67](https://arbiscan.io/address/0xb866b055D0F970FD48DEA5dB28FdEa5BcAE3EA67#code)
        - upgradeable component: `StataTokenV2` ([arbitrum:0xD089B4cb88Dacf4e27be869A00e9f7e2E3C18193](https://arbiscan.io/address/0xD089B4cb88Dacf4e27be869A00e9f7e2E3C18193#readProxyContract))
        - admin address: [arbitrum:0xFF1137243698CaA18EE364Cc966CF0e02A4e6327](https://arbiscan.io/address/0xFF1137243698CaA18EE364Cc966CF0e02A4e6327#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2PoolInstance` ([arbitrum:0x794a61358D6845594F94dc1DB02A252b5b4814aD](https://arbiscan.io/address/0x794a61358D6845594F94dc1DB02A252b5b4814aD))
        - admin address: [arbitrum:0xFF1137243698CaA18EE364Cc966CF0e02A4e6327](https://arbiscan.io/address/0xFF1137243698CaA18EE364Cc966CF0e02A4e6327#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.

    - [ethereum:0xdd8AEBC13B3DFaF85e3B512d26681987aD2c43b2](https://etherscan.io/address/0xdd8AEBC13B3DFaF85e3B512d26681987aD2c43b2#readContract)
        - upgradeable component: `StataTokenV2` ([arbitrum:0xb51EDdDD8c47856D81C8681EA71404Cec93E92c6](https://etherscan.io/address/0xb51EDdDD8c47856D81C8681EA71404Cec93E92c6#readProxyContract))
        - admin address: [ethereum:0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `PoolInstance` ([ethereum:0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2](https://etherscan.io/address/0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2))
        - admin address: [ethereum:0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
    

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Conclusion
**Summary judgment: SAFE**

The Rate Providers should work well with Balancer pools. The underlying contracts have been audited and been in production for an extended period of time. The upgradeability of the underlying Aave protocol is guarded behind decentralized governance and has a minimum execution delay of 24 hours. 
