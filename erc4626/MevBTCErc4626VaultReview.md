# ERC4626 Vault: `ERC-20: MEV BTC (mevBTC)`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [avalanche:0x1f8E769B5B6010B2C2BBCd68629EA1a0a0Eda7E3](https://snowscan.xyz/address/0x1f8E769B5B6010B2C2BBCd68629EA1a0a0Eda7E3)
- Audit report(s):
    - [Silo finance audits](github.com/balancer/code-review/issues/510)

## Context
This ERC4626 rate provider tracks the embedded yield within the MEV Silo BTC.b Vault.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Tests based on the [balancer-v3-monorepo](https://github.com/balancer/balancer-v3-monorepo/tree/main/pkg/vault/test/foundry/fork) pass for the given ERC4626 vaults, which can be found [here](https://github.com/balancer/balancer-v3-erc4626-tests/tree/main/test).
- [x] The required Vault implements the required operational ERC4626 Interface

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [x] The ERC4626 Vault is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).

### Compatibility 
- [x] The reviewed ERC4626 Vault is compatible and wrapping/unwrapping can be used in swap paths.
- [x] The reviewed ERC4626 Vault is compatible and wrapping/unwrapping can be used for add and remove.

### Common Manipulation Vectors
- [ ] The ERC4626 Vault is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: USABLE**
Passing fork tests can be found here: https://github.com/balancer/balancer-v3-erc4626-tests/pull/90 
