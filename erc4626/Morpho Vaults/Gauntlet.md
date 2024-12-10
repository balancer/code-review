# ERC4626 Vault: `MetaMorpho`

## Details
- Reviewed by: 
- Checked by: @\<GitHub handle of secondary reviewer\>
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
- [x] The ERC4626 Vault is upgradeable. 

- [ ] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).

- [x] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price). 
    Part of the rate computation relies of `totalAssets` being calculated. This function iterates over a list of Ids. This list of Ids can be changed by the Allocator role. The potential impact has not been thoroughly investigated. There are however protections in place to protect against invalid changes such as
    - `revert ErrorsLib.DuplicateMarket(id);`
    - `revert ErrorsLib.InvalidMarketRemovalNonZeroCap(id);`
    - `revert ErrorsLib.PendingCap(id);`
    - `ErrorsLib.InvalidMarketRemovalNonZeroSupply(id);`
    - `ErrorsLib.InvalidMarketRemovalTimelockNotElapsed(id);`

    #### Gauntlet Prime wETH
    For [Gauntlet Prime wETH](https://etherscan.io/address/0x2371e134e3455e0593363cBF89d3b6cf53740618) some allocators are eoas.
    - 0xfd32fA2ca22c76dD6E550706Ad913FC6CE91c75D
    - 0x959d73CB5a1C1ad7EbCE3eC93FAD3b2f9a25432E
  
### Common Manipulation Vectors
- [ ] The ERC4626 Vault is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: USABLE**

The outlined ERC4626 Vaults should work well with Balancer pools. Upgradeability is guarded by Aave governance and the Vaults implement the required interfaces with fork tests passing as can be seen [here]().