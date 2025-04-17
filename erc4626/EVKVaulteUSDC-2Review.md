# ERC4626 Vault: `EVK Vault eUSDC-2`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [:0x39dE0f00189306062D79eDEC6DcA5bb6bFd108f9](https://snowtrace.io/token/0x39dE0f00189306062D79eDEC6DcA5bb6bFd108f9/contract/readProxyContract?chainid=43114)
- Audit report(s):
    - [\<audit title\>](\<link to audit\>)

## Context
\<Write a brief description of the intended functionality here.\>

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [ ] Tests based on the [balancer-v3-monorepo](https://github.com/balancer/balancer-v3-monorepo/tree/main/pkg/vault/test/foundry/fork) pass for the given ERC4626 vaults, which can be found [here](https://github.com/balancer/balancer-v3-erc4626-tests/tree/main/test).
- [ ] The required Vault implements the required operational ERC4626 Interface

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [x] The ERC4626 Vault is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).
    - admin address: [avalanche:0x9506a63e5f1C595f58Ef1e1D9788Eb5A47722ee8](https://snowtrace.io/address/0x9506a63e5f1C595f58Ef1e1D9788Eb5A47722ee8/contract/43114/code)
    - admin type: multisig
        - multisig threshold/signers: 4/8
        - multisig timelock? 4 days


### Compatibility 
- [ ] The reviewed ERC4626 Vault is compatible and wrapping/unwrapping can be used in swap paths. <Delete this hint: Does the ERC4626 pass the fork tests and we can use the buffer for swapping underlying to wrapped and vice versa?>
- [ ] The reviewed ERC4626 Vault is compatible and wrapping/unwrapping can be used for add and remove. <Delete this hint: Does the ERC4626 pass the fork tests and we can (and want based on the initital issue request) to use underlying tokens to add or remove liquidity to pools?>

### Common Manipulation Vectors
- [ ] The ERC4626 Vault is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: \<USABLE/UNUSABLE\>**

\<Delete this hint: Formulate a nuanced conclusion here. Remember, it's okay if some of the boxes above are checked as long as reasonable protections are in place. If the ERC4626 Vault is very obviously safe, say so. If it's very obviously not, say so: what specifically needs to change before it can be considered safe? If the conclusion is hazy, explain why, and leave the final determination up to the reader. \>