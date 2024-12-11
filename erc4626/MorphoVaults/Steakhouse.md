# ERC4626 Vault: `MetaMorpho`

## Details
- Reviewed by: @mkflow27
- Checked by: @danielmkm
- Deployed at:
    - [ethereum:https://etherscan.io/address/0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB](https://etherscan.io/address/0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB)
    - [ethereum:https://etherscan.io/address/0xbEef047a543E45807105E51A8BBEFCc5950fcfBa](https://etherscan.io/address/0xbEef047a543E45807105E51A8BBEFCc5950fcfBa)
    - [ethereum:https://etherscan.io/address/0xbEEFC01767ed5086f35deCb6C00e6C12bc7476C1](https://etherscan.io/address/0xbEEFC01767ed5086f35deCb6C00e6C12bc7476C1)
- Audit report(s):
    - [Security Reviews & Formal Verifications](https://docs.morpho.org/security-reviews/)
    - [MetaMorpho Spearbit Audit](https://github.com/morpho-org/metamorpho/blob/main/audits/2023-11-14-metamorpho-cantina-managed-review.pdf)

## Context
A 4626 Vault which wraps underlying tokens in MetaMorpho vaults in order for vault curators to earn liquidity providers additional yield on their assets.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Tests based on the [balancer-v3-monorepo](https://github.com/balancer/balancer-v3-monorepo/tree/main/pkg/vault/test/foundry/fork) pass for the given ERC4626 vaults.
- [x] The required Vault implements the required operational ERC4626 Interface

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [] The ERC4626 Vault is upgradeable.
    - note: Upgradeability remarks for rate relevant aspects can be found in the corresponding rate provider review. 

### Common Manipulation Vectors
- [] The ERC4626 Vault is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: USABLE**

The outlined ERC4626 Vaults should work well with Balancer pools. The Vaults implement the required interfaces with fork tests passing as can be seen at:
- [Morpho's Steakhouse USDC](https://github.com/balancer/balancer-v3-erc4626-tests/blob/main/test/mainnet/ERC4626MainnetMorphoSteakhouseUSDC.t.sol)
- [Morpho's Steakhouse USDT](https://github.com/balancer/balancer-v3-erc4626-tests/blob/main/test/mainnet/ERC4626MainnetMorphoSteakhouseUSDT.t.sol)
- [Morpho's Steakhouse wUSDL](https://github.com/balancer/balancer-v3-erc4626-tests/blob/main/test/mainnet/ERC4626MainnetMorphoSteakhouseWUSDL.t.sol)

