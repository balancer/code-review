# ERC4626 Vault: `MetaMorpho`

## Details
- Reviewed by: @mkflow27
- Checked by: @danielmkm
- Deployed at:
    - [ethereum:https://etherscan.io/address/0x2371e134e3455e0593363cBF89d3b6cf53740618](https://etherscan.io/address/0x2371e134e3455e0593363cBF89d3b6cf53740618)

- Audit report(s):
    - [Security Reviews & Formal Verifications](https://docs.morpho.org/security-reviews/)
    - [MetaMorpho Spearbit Audit](https://github.com/morpho-org/metamorpho/blob/main/audits/2023-11-14-metamorpho-cantina-managed-review.pdf)

## Context
A 4626 Vault which wrapps underlying tokens in MetaMorpho vaults in order for vault curators to earn liquidity providers additional yield on their assets.

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
- [ ] The ERC4626 Vault is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: USABLE**

The outlined ERC4626 Vaults should work well with Balancer pools. The Vaults implement the required interfaces with fork tests passing as can be seen at:
    - [Morpho's Gauntlet Weth](https://github.com/balancer/balancer-v3-erc4626-tests/blob/f6245bfe043759ea17d7282ada58871dc12f8fcc/test/mainnet/ERC4626MainnetMorphoGauntletWeth.t.sol#L20)
