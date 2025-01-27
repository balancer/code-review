# Rate Provider: LoopRateProvider

## Details
- Reviewed by: @brunoguerios
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0x1f037c849CF2448d67A120543EA4ec3CE5A95FcA](https://etherscan.io/address/0x1f037c849CF2448d67A120543EA4ec3CE5A95FcA)
    - [\<audit title\>](\<link to audit\>)

TODO: I found some audits on their site, but related to a different contract - seems like it would make more sense for them to fill out these links instead of us trying to find them?

## Context
\<Write a brief description of the intended functionality here.\>

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

TODO: getRate does return 18 decimals because the erc4626 provided is 18 decimals - if erc4626 was 6 decimals, getRate would return 6 decimals - is that a problem?

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [ ] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).

- [x] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price).
    - upgradeable component: `PoolV3` ([ethereum:0xa684EAf215ad323452e2B2bF6F817d4aa5C116ab](https://etherscan.io/address/0xa684EAf215ad323452e2B2bF6F817d4aa5C116ab))
    - admin address: [ethereum:0x9613E12A424B4CbaCF561F0ec54b418c76d6B26D](https://etherscan.io/address/0x9613E12A424B4CbaCF561F0ec54b418c76d6B26D)
    - admin type: EOA

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

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

TODO: should we mention anything about the behavior of the token? e.g. it has a cooldown period that makes it non-conforming with erc4626 standards
