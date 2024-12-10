# ERC4626 Vault: `MetaMorpho`

## Details
- Reviewed by: 
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:https://etherscan.io/address/0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB](https://etherscan.io/address/0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB)
    - [ethereum:https://etherscan.io/address/0xbEef047a543E45807105E51A8BBEFCc5950fcfBa](https://etherscan.io/address/0xbEef047a543E45807105E51A8BBEFCc5950fcfBa)
    - [ethereum:https://etherscan.io/address/0xbEEFC01767ed5086f35deCb6C00e6C12bc7476C1](https://etherscan.io/address/0xbEEFC01767ed5086f35deCb6C00e6C12bc7476C1)
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
- [x] The ERC4626 Vault is upgradeable. 

- [ ] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).

- [x] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price). 
    Part of the rate computation relies of `totalAssets` being calculated. This function iterates over a list of Ids. This list of Ids can be changed by the Allocator role. The potential impact has not been thoroughly investigated. There are however protections in place to protect against invalid changes such as
    - `revert ErrorsLib.DuplicateMarket(id);`
    - `revert ErrorsLib.InvalidMarketRemovalNonZeroCap(id);`
    - `revert ErrorsLib.PendingCap(id);`
    - `ErrorsLib.InvalidMarketRemovalNonZeroSupply(id);`
    - `ErrorsLib.InvalidMarketRemovalTimelockNotElapsed(id);`

    #### Steakhouse USDC 
    For [Steakhouse USDC](https://etherscan.io/address/0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB) some allocators are eoas.
    - 0x0D61C8b6CA9669A36F351De3AE335e9689dd9C5b
    - 0xcC771952fdE840E30C6802734e5ad20479c2959f
    - 0xfd32fA2ca22c76dD6E550706Ad913FC6CE91c75D
    - 0xfeed46c11F57B7126a773EeC6ae9cA7aE1C03C9a
    #### Steakhouse USDT
    For [Steakhouse USDT](https://etherscan.io/address/0xbEef047a543E45807105E51A8BBEFCc5950fcfBa) some allocators are eoas.
    - 0xfeed46c11F57B7126a773EeC6ae9cA7aE1C03C9a
    - 0xfd32fA2ca22c76dD6E550706Ad913FC6CE91c75D
    - 0x29d4CDFee8F533af8529A9e1517b580E022874f7
  
### Common Manipulation Vectors
- [ ] The ERC4626 Vault is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: USABLE**

The outlined ERC4626 Vaults should work well with Balancer pools. Upgradeability is guarded by Aave governance and the Vaults implement the required interfaces with fork tests passing as can be seen [here]().
