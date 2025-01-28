# ERC4626 Vault: `StataTokenV2`

## Details
- Reviewed by: @mkflow27
- Checked by: @danielmkm
- Deployed at:
    - [gnosis:0x773cda0cade2a3d86e6d4e30699d40bb95174ff2](https://gnosisscan.io/address/0x773cda0cade2a3d86e6d4e30699d40bb95174ff2#code)
    - [gnosis:0x7c16f0185a26db0ae7a9377f23bc18ea7ce5d644](https://gnosisscan.io/address/0x7c16f0185a26db0ae7a9377f23bc18ea7ce5d644)
    - [gnosis:0x51350d88c1bd32cc6a79368c9fb70373fb71f375](https://gnosisscan.io/address/0x51350d88c1bd32cc6a79368c9fb70373fb71f375)
    - [gnosis:0x57f664882F762FA37903FC864e2B633D384B411A](https://gnosisscan.io/token/0x57f664882f762fa37903fc864e2b633d384b411a)
    - [ethereum:0xD4fa2D31b7968E448877f69A96DE69f5de8cD23E](https://etherscan.io/address/0xD4fa2D31b7968E448877f69A96DE69f5de8cD23E)
    - [ethereum:0x0bfc9d54Fc184518A81162F8fB99c2eACa081202](https://etherscan.io/address/0x0bfc9d54Fc184518A81162F8fB99c2eACa081202)
    - [ethereum:0x7Bc3485026Ac48b6cf9BaF0A377477Fff5703Af8](https://etherscan.io/address/0x7bc3485026ac48b6cf9baf0a377477fff5703af8#readProxyContract)
    - [ethereum:0x0FE906e030a44eF24CA8c7dC7B7c53A6C4F00ce9](https://etherscan.io/token/0x0fe906e030a44ef24ca8c7dc7b7c53a6c4f00ce9#readProxyContract)
    - [ethereum:0x775F661b0bD1739349b9A2A3EF60be277c5d2D29](https://etherscan.io/token/0x775f661b0bd1739349b9a2a3ef60be277c5d2d29#readProxyContract)
    - [base:0xe298b938631f750DD409fB18227C4a23dCdaab9b](https://basescan.org/address/0xe298b938631f750DD409fB18227C4a23dCdaab9b#code)
    - [base:0x6acD0a165fD70A84b6b50d955ff3628700bAAf4b](https://basescan.org/address/0x6acD0a165fD70A84b6b50d955ff3628700bAAf4b#readProxyContract)
    - [base:0xC768c589647798a6EE01A91FdE98EF2ed046DBD6](https://basescan.org/address/0xC768c589647798a6EE01A91FdE98EF2ed046DBD6#readProxyContract)
    - [base:0xFA2A03b6f4A65fB1Af64f7d935fDBf78693df9aF](https://basescan.org/address/0xFA2A03b6f4A65fB1Af64f7d935fDBf78693df9aF#readProxyContract)
    - [base:0x0830820D1A9aa1554364752d6D8F55C836871B74](https://basescan.org/address/0x0830820D1A9aa1554364752d6D8F55C836871B74#readProxyContract)
    - [base:0x5e8B674127B321DC344c078e58BBACc3f3008962](https://basescan.org/address/0x5e8B674127B321DC344c078e58BBACc3f3008962#readProxyContract)
    - [base:0x74D4D1D440c9679b1013999Bd91507eAa2fff651](https://basescan.org/address/0x74D4D1D440c9679b1013999Bd91507eAa2fff651#readProxyContract)
    - [base:0xF8F10f39116716e89498c1c5E94137ADa11b2BC7](https://basescan.org/address/0xF8F10f39116716e89498c1c5E94137ADa11b2BC7#readProxyContract)

- Audit report(s):
    - [StatATokenV2 audits](https://github.com/aave-dao/aave-v3-origin/blob/067d29eb75115179501edc4316d125d9773f7928/audits/11-09-2024_Certora_StataTokenV2.pdf)

## Context
A 4626 Vault which wraps aTokens in order to translate the rebasing nature of yield accrual into a non-rebasing value accrual.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Tests based on the [balancer-v3-monorepo](https://github.com/balancer/balancer-v3-monorepo/tree/main/pkg/vault/test/foundry/fork) pass for the given ERC4626 vaults, which can be found [here](https://github.com/balancer/balancer-v3-erc4626-tests/tree/main/test).
- [x] The required Vault implements the required operational ERC4626 Interface

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [x] The ERC4626 Vault is upgradeable. 

    #### Wrapped Aave Gnosis wstETH - 0x773CDA0CADe2A3d86E6D4e30699d40bB95174ff2
    - upgradeable component: `StataTokenV2` ([gnosis:0x773CDA0CADe2A3d86E6D4e30699d40bB95174ff2](https://gnosisscan.io/address/0x773CDA0CADe2A3d86E6D4e30699d40bB95174ff2#readProxyContract))
    - admin address: [gnosis:0x1dF462e2712496373A347f8ad10802a5E95f053D](https://gnosisscan.io/address/0x1dF462e2712496373A347f8ad10802a5E95f053D)
    - admin type: Aave governance system.
        - multisig timelock? YES: 24 hours.

    #### Wrapped Aave Gnosis GNO - 0x7c16F0185A26Db0AE7a9377f23BC18ea7ce5d644
    - upgradeable component: `StataTokenV2` ([gnosis:0x7c16F0185A26Db0AE7a9377f23BC18ea7ce5d644](https://gnosisscan.io/address/0x7c16F0185A26Db0AE7a9377f23BC18ea7ce5d644))
    - admin address: [gnosis:0x1dF462e2712496373A347f8ad10802a5E95f053D](https://gnosisscan.io/address/0x1dF462e2712496373A347f8ad10802a5E95f053D)
    - admin type: Aave governance system.
        - multisig timelock? YES: 24 hours.

    #### Wrapped Aave Gnosis USDCe - 0x51350d88c1bd32Cc6A79368c9Fb70373Fb71F375
    - upgradeable component: `StataTokenV2` ([gnosis:0x51350d88c1bd32Cc6A79368c9Fb70373Fb71F375](https://gnosisscan.io/address/0x51350d88c1bd32Cc6A79368c9Fb70373Fb71F375))
    - admin address: [gnosis:0x1dF462e2712496373A347f8ad10802a5E95f053D](https://gnosisscan.io/address/0x1dF462e2712496373A347f8ad10802a5E95f053D)
    - admin type: Aave governance system.
        - multisig timelock? YES: 24 hours.

    #### Wrapped Aave Gnosis WETH - 0x57f664882F762FA37903FC864e2B633D384B411A
    - upgradeable component: `StataTokenV2` ([gnosis:0x57f664882f762fa37903fc864e2b633d384b411a](https://gnosisscan.io/token/0x57f664882f762fa37903fc864e2b633d384b411a#readProxyContract))
    - admin address: [gnosis:0x1dF462e2712496373A347f8ad10802a5E95f053D](https://gnosisscan.io/address/0x1dF462e2712496373A347f8ad10802a5E95f053D)
    - admin type: Aave governance system.
        - multisig timelock? YES: 24 hours.

    #### Wrapped Aave Ethereum USDC - 0xD4fa2D31b7968E448877f69A96DE69f5de8cD23E
    - upgradeable component: `StataTokenV2` ([ethereum:0xD4fa2D31b7968E448877f69A96DE69f5de8cD23E](https://etherscan.io/address/0xD4fa2D31b7968E448877f69A96DE69f5de8cD23E#readProxyContract))
    - admin address: [ethereum:0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.

    #### Wrapped Aave Ethereum WETH - 0x0bfc9d54Fc184518A81162F8fB99c2eACa081202
    - upgradeable component: `StataTokenV2` ([ethereum:0x0bfc9d54Fc184518A81162F8fB99c2eACa081202](https://etherscan.io/address/0x0bfc9d54fc184518a81162f8fb99c2eaca081202#readProxyContract))
    - admin address: [ethereum:0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.

    #### Wrapped Aave Ethereum USDT - 0x7Bc3485026Ac48b6cf9BaF0A377477Fff5703Af8
    - upgradeable component: `StataTokenV2` ([ethereum:0x7Bc3485026Ac48b6cf9BaF0A377477Fff5703Af8](https://etherscan.io/address/0x7bc3485026ac48b6cf9baf0a377477fff5703af8#readProxyContract))
    - admin address: [ethereum:0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.

    #### Wrapped Aave Ethereum Lido WETH - 0x0FE906e030a44eF24CA8c7dC7B7c53A6C4F00ce9
    - upgradeable component: `StataTokenV2` ([ethereum:0x0FE906e030a44eF24CA8c7dC7B7c53A6C4F00ce9](https://etherscan.io/address/0x0FE906e030a44eF24CA8c7dC7B7c53A6C4F00ce9))
    - admin address: [ethereum:0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.

    #### Wrapped Aave Ethereum Lido wstETH - 0x775F661b0bD1739349b9A2A3EF60be277c5d2D29
    - upgradeable component: `StataTokenV2` ([ethereum:0x775F661b0bD1739349b9A2A3EF60be277c5d2D29](https://etherscan.io/address/0x775F661b0bD1739349b9A2A3EF60be277c5d2D29#code))
    - admin address: [ethereum:0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
    
    #### Wrapped Aave Ethereum USDe - 0x5F9D59db355b4A60501544637b00e94082cA575b
    - upgradeable component: `StataTokenV2` ([ethereum:0x5F9D59db355b4A60501544637b00e94082cA575b](https://etherscan.io/address/0x5F9D59db355b4A60501544637b00e94082cA575b#readProxyContract))
    - admin address: [ethereum:0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.

    #### Wrapped Aave Lido Ethereum GHO - 0xC71Ea051a5F82c67ADcF634c36FFE6334793D24C
    - upgradeable component: `StataTokenV2` ([ethereum:0xC71Ea051a5F82c67ADcF634c36FFE6334793D24C](https://etherscan.io/address/0xC71Ea051a5F82c67ADcF634c36FFE6334793D24C#readProxyContract))
    - admin address: [ethereum:0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.

    #### Wrapped Aave Base WETH - 0xe298b938631f750DD409fB18227C4a23dCdaab9b
    - upgradeable component: `StataTokenV2` ([base:0xe298b938631f750DD409fB18227C4a23dCdaab9b](https://basescan.org/address/0xe298b938631f750DD409fB18227C4a23dCdaab9b#readProxyContract))
    - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.

    #### Wrapped Aave Base weETH - 0x6acD0a165fD70A84b6b50d955ff3628700bAAf4b
    - upgradeable component: `StataTokenV2` ([base:0x6acD0a165fD70A84b6b50d955ff3628700bAAf4b](https://basescan.org/address/0x6acD0a165fD70A84b6b50d955ff3628700bAAf4b#readProxyContract))
    - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.

    #### Wrapped Aave Base USDC - 0xC768c589647798a6EE01A91FdE98EF2ed046DBD6
    - upgradeable component: `StataTokenV2` ([base:0x6acD0a165fD70A84b6b50d955ff3628700bAAf4b](https://basescan.org/address/0x6acD0a165fD70A84b6b50d955ff3628700bAAf4b#readProxyContract))
        - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.

    #### Wrapped Aave Base cbBTC - 0xFA2A03b6f4A65fB1Af64f7d935fDBf78693df9aF
    - upgradeable component: `StataTokenV2` ([base:0xFA2A03b6f4A65fB1Af64f7d935fDBf78693df9aF](https://basescan.org/address/0xFA2A03b6f4A65fB1Af64f7d935fDBf78693df9aF#readProxyContract))
        - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.

    #### Wrapped Aave Base wstETH - 0x0830820D1A9aa1554364752d6D8F55C836871B74
    - upgradeable component: `StataTokenV2` ([base:0x0830820D1A9aa1554364752d6D8F55C836871B74](https://basescan.org/address/0x0830820D1A9aa1554364752d6D8F55C836871B74#readProxyContract))
        - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.

    #### Wrapped Aave Base cbETH - 0x5e8B674127B321DC344c078e58BBACc3f3008962
    - upgradeable component: `StataTokenV2` ([base:0x5e8B674127B321DC344c078e58BBACc3f3008962](https://basescan.org/address/0x5e8B674127B321DC344c078e58BBACc3f3008962#readProxyContract))
        - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.

    #### Wrapped Aave Base USDbC - 0x74D4D1D440c9679b1013999Bd91507eAa2fff651
    - upgradeable component: `StataTokenV2` ([base:0x74D4D1D440c9679b1013999Bd91507eAa2fff651](https://basescan.org/address/0x74D4D1D440c9679b1013999Bd91507eAa2fff651#readProxyContract))
        - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.

    #### Wrapped Aave Base ezETH - 0xF8F10f39116716e89498c1c5E94137ADa11b2BC7
    - upgradeable component: `StataTokenV2` ([base:0xF8F10f39116716e89498c1c5E94137ADa11b2BC7](https://basescan.org/address/0xF8F10f39116716e89498c1c5E94137ADa11b2BC7))
        - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.

### Common Manipulation Vectors
- [ ] The ERC4626 Vault is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: USABLE**

The outlined ERC4626 Vaults should work well with Balancer pools. Upgradeability is guarded by Aave governance and the Vaults implement the required interfaces with fork tests passing as can be seen here:
- [gnosis:0x773cda0cade2a3d86e6d4e30699d40bb95174ff2](https://github.com/balancer/balancer-v3-erc4626-tests/blob/main/test/gnosis/ERC4626GnosisAaveGno.t.sol)
- [gnosis:0x7c16F0185A26Db0AE7a9377f23BC18ea7ce5d644](https://github.com/balancer/balancer-v3-erc4626-tests/blob/365ee17e8904f4654990434cc3bbc273478d95ef/test/gnosis/ERC4626GnosisAaveGno.t.sol#L20)
- [gnosis:0x51350d88c1bd32cc6a79368c9fb70373fb71f375](https://github.com/balancer/balancer-v3-erc4626-tests/blob/365ee17e8904f4654990434cc3bbc273478d95ef/test/gnosis/ERC4626GnosisAaveUsdce.t.sol#L20)
- [gnosis:0x57f664882F762FA37903FC864e2B633D384B411A](https://github.com/balancer/balancer-v3-erc4626-tests/blob/365ee17e8904f4654990434cc3bbc273478d95ef/test/gnosis/ERC4626GnosisAaveWeth.t.sol#L17)
- [ethereum:0xD4fa2D31b7968E448877f69A96DE69f5de8cD23E](https://github.com/balancer/balancer-v3-erc4626-tests/blob/365ee17e8904f4654990434cc3bbc273478d95ef/test/mainnet/ERC4626MainnetAaveUsdcV2.t.sol#L20)
- [ethereum:0x0bfc9d54Fc184518A81162F8fB99c2eACa081202](https://github.com/balancer/balancer-v3-erc4626-tests/blob/365ee17e8904f4654990434cc3bbc273478d95ef/test/mainnet/ERC4626MainnetAaveWeth.t.sol#L20)
- [ethereum:0x7Bc3485026Ac48b6cf9BaF0A377477Fff5703Af8](https://github.com/balancer/balancer-v3-erc4626-tests/blob/365ee17e8904f4654990434cc3bbc273478d95ef/test/mainnet/ERC4626MainnetAaveUsdt2.t.sol#L20)
- [ethereum:0x0FE906e030a44eF24CA8c7dC7B7c53A6C4F00ce9](https://github.com/balancer/balancer-v3-erc4626-tests/blob/365ee17e8904f4654990434cc3bbc273478d95ef/test/mainnet/ERC4626MainnetAaveLidoWeth.t.sol#L20)
- [ethereum:0x775F661b0bD1739349b9A2A3EF60be277c5d2D29](https://github.com/balancer/balancer-v3-erc4626-tests/blob/365ee17e8904f4654990434cc3bbc273478d95ef/test/mainnet/ERC4626MainnetAaveLidoWstEth.t.sol#L20)
- Weth [base:0xe298b938631f750DD409fB18227C4a23dCdaab9b](https://github.com/balancer/balancer-v3-erc4626-tests/blob/aave-base/test/base/ERC4626BaseAaveWeth.t.sol)
- weETH [base:0x6acD0a165fD70A84b6b50d955ff3628700bAAf4b](https://github.com/balancer/balancer-v3-erc4626-tests/blob/208e800c185f59d3e57f4f228932af59d0458b29/test/base/ERC4626BaseAaveWeETH.t.sol#L20)
- USDC [base:0xC768c589647798a6EE01A91FdE98EF2ed046DBD6](https://github.com/balancer/balancer-v3-erc4626-tests/blob/208e800c185f59d3e57f4f228932af59d0458b29/test/base/ERC4626BaseAaveUSDC.t.sol#L20)
- cbBTC [base:0xFA2A03b6f4A65fB1Af64f7d935fDBf78693df9aF](https://github.com/balancer/balancer-v3-erc4626-tests/blob/208e800c185f59d3e57f4f228932af59d0458b29/test/base/ERC4626BaseAaveCbBTC.t.sol#L20)
- wstETH [base:0x0830820D1A9aa1554364752d6D8F55C836871B74](https://github.com/balancer/balancer-v3-erc4626-tests/blob/208e800c185f59d3e57f4f228932af59d0458b29/test/base/ERC4626BaseAaveWstETH.t.sol#L20)
- cbETH [base:0x5e8B674127B321DC344c078e58BBACc3f3008962](https://github.com/balancer/balancer-v3-erc4626-tests/blob/208e800c185f59d3e57f4f228932af59d0458b29/test/base/ERC4626BaseAaveCbETH.t.sol#L20)
- USDbC [base:0x74D4D1D440c9679b1013999Bd91507eAa2fff651](https://github.com/balancer/balancer-v3-erc4626-tests/blob/208e800c185f59d3e57f4f228932af59d0458b29/test/base/ERC4626BaseAaveUSDbC.t.sol#L20)
- ezETH [base:0xF8F10f39116716e89498c1c5E94137ADa11b2BC7](https://github.com/balancer/balancer-v3-erc4626-tests/blob/208e800c185f59d3e57f4f228932af59d0458b29/test/base/ERC4626BaseAaveEzETH.t.sol#L20)


