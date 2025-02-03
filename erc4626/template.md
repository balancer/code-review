\<Template: Copy this file and replace all elements inside \<\> brackets. Delete this particular block.\>

# ERC4626 Vault: `\<Name of Reviewed Contract\>`

## Details
- Reviewed by: @\<GitHub handle of primary reviewer\>
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [\<network:address\>](\<link to contract on block explorer\>)
    - [\<network:address\>](\<link to contract on block explorer\>)
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
- [ ] The ERC4626 Vault is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address). \<Delete this hint: If unchecked, delete all of the bullets below.\>
    - admin address: [\<network:address\>](\<link to contract block explorer\>)
    - admin type: \<EOA/multisig\> \<Delete this hint: If EOA, delete the whole sub-section below.\>
        - multisig threshold/signers: \<X/Y\>
        - multisig timelock? \<YES: minimum duration/NO\>
        - trustworthy signers? \<YES/NO\> \<Delete this hint: Are the signers known entities such as Vitalik, Hudson, samczsun, or Fernando? Or are they random addresses?\>

### Buffer blocklist
- [ ] The reviewed ERC4626 Vault should be added to the blocked buffers metadata list. 

### Common Manipulation Vectors
- [ ] The ERC4626 Vault is susceptible to donation attacks.

\<Delete this hint: If checked, elaborate here: is the donation public and atomic, or is it protected at all (privileged, bounded, distributed over time, etc.)?\>

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

### \<H-01: Example High-severity Finding\>
### \<H-02: Example High-severity Finding\>
### \<M-01: Example Medium-severity Finding\>
### \<M-02: Example Medium-severity Finding\>

## Conclusion
**Summary judgment: \<USABLE/UNUSABLE\>**

\<Delete this hint: Formulate a nuanced conclusion here. Remember, it's okay if some of the boxes above are checked as long as reasonable protections are in place. If the ERC4626 Vault is very obviously safe, say so. If it's very obviously not, say so: what specifically needs to change before it can be considered safe? If the conclusion is hazy, explain why, and leave the final determination up to the reader. \>