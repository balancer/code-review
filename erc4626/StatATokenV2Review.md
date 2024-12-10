# ERC4626 Vault: `StataTokenV2`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [gnosis:0x773cda0cade2a3d86e6d4e30699d40bb95174ff2](https://gnosisscan.io/address/0x773cda0cade2a3d86e6d4e30699d40bb95174ff2#code)
    - [gnosis:0x7c16f0185a26db0ae7a9377f23bc18ea7ce5d644](https://gnosisscan.io/address/0x7c16f0185a26db0ae7a9377f23bc18ea7ce5d644)
    - [gnosis:0x51350d88c1bd32cc6a79368c9fb70373fb71f375](https://gnosisscan.io/address/0x51350d88c1bd32cc6a79368c9fb70373fb71f375)
- Audit report(s):
    - [StatATokenV2 audits](https://github.com/aave-dao/aave-v3-origin/blob/067d29eb75115179501edc4316d125d9773f7928/audits/11-09-2024_Certora_StataTokenV2.pdf)

## Context
A 4626 Vault which wrapps aTokens in order to translate the rebasing nature of yield accrual into a non-rebasing value accrual.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Tests based on the [balancer-v3-monorepo](https://github.com/balancer/balancer-v3-monorepo/tree/main/pkg/vault/test/foundry/fork) pass for the given ERC4626 vaults, which can be found [here](https://github.com/balancer/balancer-v3-monorepo/pull/1171).
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

### Common Manipulation Vectors
- [ ] The ERC4626 Vault is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: USABLE**

The outlined ERC4626 Vaults should work well with Balancer pools. Upgradeability is guarded by Aave governance and the Vaults implement the required interfaces with fork tests passing as can be seen [here](https://github.com/balancer/balancer-v3-monorepo/pull/1171).
