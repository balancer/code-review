# ERC4626 Vault: `SuperVault`

## Details
- Reviewed by: @mattpereira
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0xF7DE3c70F2db39a188A81052d2f3C8e3e217822a](https://etherscan.io/address/0xF7DE3c70F2db39a188A81052d2f3C8e3e217822a#code)
    - [base:0xe9F2a5F9f3c846f29066d7fB3564F8E6B6b2D65b](https://basescan.org/address/0xe9F2a5F9f3c846f29066d7fB3564F8E6B6b2D65b#code)
- Audit report(s):
    - [yAudit Report](https://github.com/superform-xyz/SuperVaults/tree/main/audits)

## Context
\<Write a brief description of the intended functionality here.\>

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [ ] Tests based on the [balancer-v3-monorepo](https://github.com/balancer/balancer-v3-monorepo/tree/main/pkg/vault/test/foundry/fork) pass for the given ERC4626 vaults, which can be found [here](https://github.com/balancer/balancer-v3-erc4626-tests/tree/main/test).
- [x] The required Vault implements the required operational ERC4626 Interface

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [ ] The ERC4626 Vault is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).

### Buffer blocklist
- [ ] The reviewed ERC4626 Vault should be added to the blocked buffers metadata list. 

### Common Manipulation Vectors
- [ ] The ERC4626 Vault is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: \<USABLE/UNUSABLE\>**

\<Delete this hint: Formulate a nuanced conclusion here. Remember, it's okay if some of the boxes above are checked as long as reasonable protections are in place. If the ERC4626 Vault is very obviously safe, say so. If it's very obviously not, say so: what specifically needs to change before it can be considered safe? If the conclusion is hazy, explain why, and leave the final determination up to the reader. \>