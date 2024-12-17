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
    

### Common Manipulation Vectors
- [ ] The ERC4626 Vault is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: USABLE**

The outlined ERC4626 Vaults should work well with Balancer pools. Upgradeability is guarded by Aave governance and the Vaults implement the required interfaces with fork tests passing as can be seen here:
- [0x773cda0cade2a3d86e6d4e30699d40bb95174ff2](https://github.com/balancer/balancer-v3-erc4626-tests/blob/main/test/gnosis/ERC4626GnosisAaveGno.t.sol)
- [0x7c16F0185A26Db0AE7a9377f23BC18ea7ce5d644](https://github.com/balancer/balancer-v3-erc4626-tests/blob/365ee17e8904f4654990434cc3bbc273478d95ef/test/gnosis/ERC4626GnosisAaveGno.t.sol#L20)
- [0x51350d88c1bd32cc6a79368c9fb70373fb71f375](https://github.com/balancer/balancer-v3-erc4626-tests/blob/365ee17e8904f4654990434cc3bbc273478d95ef/test/gnosis/ERC4626GnosisAaveUsdce.t.sol#L20)
- [0x57f664882F762FA37903FC864e2B633D384B411A](https://github.com/balancer/balancer-v3-erc4626-tests/blob/365ee17e8904f4654990434cc3bbc273478d95ef/test/gnosis/ERC4626GnosisAaveWeth.t.sol#L17)
- [0xD4fa2D31b7968E448877f69A96DE69f5de8cD23E](https://github.com/balancer/balancer-v3-erc4626-tests/blob/365ee17e8904f4654990434cc3bbc273478d95ef/test/mainnet/ERC4626MainnetAaveUsdcV2.t.sol#L20)
- [0x0bfc9d54Fc184518A81162F8fB99c2eACa081202](https://github.com/balancer/balancer-v3-erc4626-tests/blob/365ee17e8904f4654990434cc3bbc273478d95ef/test/mainnet/ERC4626MainnetAaveWeth.t.sol#L20)
- [0x7Bc3485026Ac48b6cf9BaF0A377477Fff5703Af8](https://github.com/balancer/balancer-v3-erc4626-tests/blob/365ee17e8904f4654990434cc3bbc273478d95ef/test/mainnet/ERC4626MainnetAaveUsdt2.t.sol#L20)
- [0x0FE906e030a44eF24CA8c7dC7B7c53A6C4F00ce9](https://github.com/balancer/balancer-v3-erc4626-tests/blob/365ee17e8904f4654990434cc3bbc273478d95ef/test/mainnet/ERC4626MainnetAaveLidoWeth.t.sol#L20)
- [0x775F661b0bD1739349b9A2A3EF60be277c5d2D29](https://github.com/balancer/balancer-v3-erc4626-tests/blob/365ee17e8904f4654990434cc3bbc273478d95ef/test/mainnet/ERC4626MainnetAaveLidoWstEth.t.sol#L20)


