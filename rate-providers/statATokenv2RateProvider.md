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

    - weETH [base:0x4FE32815684C54bB779359A99ff3a7Ef424079E3](https://basescan.org/address/0x4FE32815684C54bB779359A99ff3a7Ef424079E3)
    - USDC [base:0x0368b79b6A173a5aD589594E3227153D8cC7Cecc](https://basescan.org/address/0x0368b79b6A173a5aD589594E3227153D8cC7Cecc)
    - cbBTC [base:0xbF21251c74208771e25De5C08971cE586236EE89](https://basescan.org/address/0xbF21251c74208771e25De5C08971cE586236EE89)
    - wstETH [base:0xcb1f29103F710A0A562de7f0e9DDE223D0860674](https://basescan.org/address/0xcb1f29103F710A0A562de7f0e9DDE223D0860674)
    - cbETH [base:0x940748d30315276362f594ECcCb648A4f9aB7629](https://basescan.org/address/0x940748d30315276362f594ECcCb648A4f9aB7629)
    - USDbC [base:0xBa0Fd0f3B019e8aBA61FEA2ac4Eb56b29F6808c0](https://basescan.org/address/0xBa0Fd0f3B019e8aBA61FEA2ac4Eb56b29F6808c0)
    - ezETH [base:0xFF4B2CE4131E0Fb6b8A40447B4dF96Bdc83f759a](https://basescan.org/address/0xFF4B2CE4131E0Fb6b8A40447B4dF96Bdc83f759a)

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
        - upgradeable component: `StataTokenV2` ([gnosis:0x51350d88c1bd32Cc6A79368c9Fb70373Fb71F375](https://gnosisscan.io/address/0x51350d88c1bd32Cc6A79368c9Fb70373Fb71F375#readProxyContract))
        - admin address: [gnosis:0x1dF462e2712496373A347f8ad10802a5E95f053D](https://gnosisscan.io/address/0x1dF462e2712496373A347f8ad10802a5E95f053D)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2Pool` ([gnosis:0xb50201558B00496A145fE76f7424749556E326D8](https://gnosisscan.io/address/0xb50201558B00496A145fE76f7424749556E326D8#code))
        - admin address: [gnosis:0x1dF462e2712496373A347f8ad10802a5E95f053D](https://gnosisscan.io/address/0x1dF462e2712496373A347f8ad10802a5E95f053D#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours

    - weETH [base:0x4FE32815684C54bB779359A99ff3a7Ef424079E3](https://basescan.org/address/0x4FE32815684C54bB779359A99ff3a7Ef424079E3)
        - upgradeable component: `StataTokenV2` ([base:0x6acD0a165fD70A84b6b50d955ff3628700bAAf4b](https://basescan.org/address/0x6acD0a165fD70A84b6b50d955ff3628700bAAf4b#readProxyContract))
        - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a#code)
            - admin type: Aave governance system.
                - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2Pool` ([base:0xA238Dd80C259a72e81d7e4664a9801593F98d1c5](https://basescan.org/address/0xA238Dd80C259a72e81d7e4664a9801593F98d1c5#code))
        - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a#code)
            - admin type: Aave governance system.
                - multisig timelock? YES: 24 hours.

    - USDC [base:0x0368b79b6A173a5aD589594E3227153D8cC7Cecc](https://basescan.org/address/0x0368b79b6A173a5aD589594E3227153D8cC7Cecc)
        - upgradeable component: `StataTokenV2` ([base:0xC768c589647798a6EE01A91FdE98EF2ed046DBD6](https://basescan.org/address/0xC768c589647798a6EE01A91FdE98EF2ed046DBD6#code))
        - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a#code)
            - admin type: Aave governance system.
                - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2Pool` ([base:0xA238Dd80C259a72e81d7e4664a9801593F98d1c5](https://basescan.org/address/0xA238Dd80C259a72e81d7e4664a9801593F98d1c5))
        - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a#code)
            - admin type: Aave governance system.
                - multisig timelock? YES: 24 hours.

    - cbBTC [base:0xbF21251c74208771e25De5C08971cE586236EE89](https://basescan.org/address/0xbF21251c74208771e25De5C08971cE586236EE89)
        - upgradeable component: `StataTokenV2` ([base:0xFA2A03b6f4A65fB1Af64f7d935fDBf78693df9aF](https://basescan.org/address/0xFA2A03b6f4A65fB1Af64f7d935fDBf78693df9aF#code))
        - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a#code)
            - admin type: Aave governance system.
                - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2Pool` ([base:0xA238Dd80C259a72e81d7e4664a9801593F98d1c5](https://basescan.org/address/0xA238Dd80C259a72e81d7e4664a9801593F98d1c5))
        - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a#code)
            - admin type: Aave governance system.
                - multisig timelock? YES: 24 hours.

    - wstETH [base:0xcb1f29103F710A0A562de7f0e9DDE223D0860674](https://basescan.org/address/0xcb1f29103F710A0A562de7f0e9DDE223D0860674)
        - upgradeable component: `StataTokenV2` ([base:0x0830820D1A9aa1554364752d6D8F55C836871B74](https://basescan.org/address/0x0830820D1A9aa1554364752d6D8F55C836871B74))
        - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a#code)
            - admin type: Aave governance system.
                - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2Pool` ([base:0xA238Dd80C259a72e81d7e4664a9801593F98d1c5](https://basescan.org/address/0xA238Dd80C259a72e81d7e4664a9801593F98d1c5))
        - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a#code)
            - admin type: Aave governance system.
                - multisig timelock? YES: 24 hours.

    - cbETH [base:0x940748d30315276362f594ECcCb648A4f9aB7629](https://basescan.org/address/0x940748d30315276362f594ECcCb648A4f9aB7629)
        - upgradeable component: `StataTokenV2` ([base:0x5e8B674127B321DC344c078e58BBACc3f3008962](https://basescan.org/address/0x5e8B674127B321DC344c078e58BBACc3f3008962))
        - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a#code)
            - admin type: Aave governance system.
                - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2Pool` ([base:0xA238Dd80C259a72e81d7e4664a9801593F98d1c5](https://basescan.org/address/0xA238Dd80C259a72e81d7e4664a9801593F98d1c5))
        - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a#code)
            - admin type: Aave governance system.
                - multisig timelock? YES: 24 hours.

    - USDbC [base:0xBa0Fd0f3B019e8aBA61FEA2ac4Eb56b29F6808c0](https://basescan.org/address/0xBa0Fd0f3B019e8aBA61FEA2ac4Eb56b29F6808c0)
        - upgradeable component: `StataTokenV2` ([base:0x74D4D1D440c9679b1013999Bd91507eAa2fff651](https://basescan.org/address/0x74D4D1D440c9679b1013999Bd91507eAa2fff651))
        - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a#code)
            - admin type: Aave governance system.
                - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2Pool` ([base:0xA238Dd80C259a72e81d7e4664a9801593F98d1c5](https://basescan.org/address/0xA238Dd80C259a72e81d7e4664a9801593F98d1c5))
        - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a#code)
            - admin type: Aave governance system.
                - multisig timelock? YES: 24 hours.

    - ezETH [base:0xFF4B2CE4131E0Fb6b8A40447B4dF96Bdc83f759a](https://basescan.org/address/0xFF4B2CE4131E0Fb6b8A40447B4dF96Bdc83f759a)
        - upgradeable component: `StataTokenV2` ([base:0xF8F10f39116716e89498c1c5E94137ADa11b2BC7](https://basescan.org/address/0xF8F10f39116716e89498c1c5E94137ADa11b2BC7))
        - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a#code)
            - admin type: Aave governance system.
                - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2Pool` ([base:0xA238Dd80C259a72e81d7e4664a9801593F98d1c5](https://basescan.org/address/0xA238Dd80C259a72e81d7e4664a9801593F98d1c5))
        - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a#code)
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
