\<Template: Copy this file and replace all elements inside \<\> brackets. Delete this particular block.\>

# Rate Provider: `\<Name of Reviewed Contract\>`

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

- [ ] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [ ] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [ ] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address). \<Delete this hint: If unchecked, delete all of the bullets below.\>
    - admin address: [\<network:address\>](\<link to contract block explorer\>)
    - admin type: \<EOA/multisig\> \<Delete this hint: If EOA, delete the whole sub-section below.\>
        - multisig threshold/signers: \<X/Y\>
        - multisig timelock? \<YES: minimum duration/NO\>
        - trustworthy signers? \<YES/NO\> \<Delete this hint: Are the signers known entities such as Vitalik, Hudson, samczsun, or Fernando? Or are they random addresses?\>

- [ ] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price). \<Delete this hint: If unchecked, delete all of the bullets below.\>
    - upgradeable component: `\<contract name\>` ([\<network:address\>](\<link to contract block explorer\>))
    - admin address: [\<network:address\>](\<link to contract block explorer\>)
    - admin type: \<EOA/multisig\> \<Delete this hint: If EOA, delete the whole sub-section below.\>
        - multisig threshold/signers: \<X/Y\>
        - multisig timelock? \<YES: minimum duration/NO\>
        - trustworthy signers? \<YES: whom/NO\> \<Delete this hint: Are the signers known entities such as Vitalik, Hudson, samczsun, or Fernando? Or are they random addresses?\>

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes). \<Delete this hint: If unchecked, delete all of the bullets below.\>
    - source: \<Delete this hint: If Chainlink, just write "Chainlink". Otherwise, elaborate.\>
    - source address: [\<network:address\>](\<link to contract block explorer\>)
    - any protections? \<YES: elaborate/NO\> \<Delete this hint: e.g., maximum rate delta\>

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price). \<Delete this hint: If unchecked, delete all of the bullets below.\>
    - description: \<`X` in terms of `Y`\> \<Delete this hint: e.g., `wstETH` in terms of `ETH`\>
    - should be: \<`A` in terms of `B`\> \<Delete this hint: e.g., `wstETH` in terms of `stETH`\>

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

\<Delete this hint: If checked, elaborate here: is the donation public and atomic, or is it protected at all (privileged, bounded, distributed over time, etc.)?\>

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

### \<H-01: Example High-severity Finding\>
### \<H-02: Example High-severity Finding\>
### \<M-01: Example Medium-severity Finding\>
### \<M-02: Example Medium-severity Finding\>

## Conclusion
**Summary judgment: \<SAFE/UNSAFE\>**

\<Delete this hint: Formulate a nuanced conclusion here. Remember, it's okay if some of the boxes above are checked as long as reasonable protections are in place. If the Rate Provider is very obviously safe, say so. If it's very obviously not, say so: what specifically needs to change before it can be considered safe? If the conclusion is hazy, explain why, and leave the final determination up to the reader. Examples of completely unacceptable conditions include, but are not limited to: EOA admins, EOA price sources, market prices (instead of deposit/redemption prices).\>
