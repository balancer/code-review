# Rate Provider: Rate Providers predating this repo

## Details
- Reviewed by: N.A.
- Checked by: N.A.
- Deployed at:
    - See the respective entry in `registry.json`
- Audit report(s):
    - N.A.

## Context
This repo was initially established in July 2023 to make the Rate Provider review process more accessible. However Rate Provider usage predates this repo and these Rate Providers do not have a review which is included here. For completeness purposes any Rate Provider that predates this review process is considered a "legacy Rate Provider" and will be linked to this review file as part of the `registry.json`.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- Legacy Rate Providers can have administrative privileges such as a proxy architecture or `onlyOwner` functions which could update the pricing data. An LP is encouraged to investigate the Rate Provider address in the `registry.json`. 

- Legacy Rate Providers & downstream involved contracts (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price) can be upgradeable. An LP is encouraged to investigate the whole pricing pipeline starting from the Rate Provider mentioned in the `registry.json`.

### Oracles
- Legacy Rate Providers can have price data be provided by an off-chain source. (e.g., a Chainlink oracle, a multisig, or a network of nodes). An LP is encouraged to investigate the whole pricing pipeline starting from the Rate Provider mentioned in the `registry.json`.

- Legacy Rate Providers can have volatile price data (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price). An LP is encouraged to investigate the whole pricing pipeline starting from the Rate Provider mentioned in the `registry.json`.

### Common Manipulation Vectors
- Legacy Rate Providers can be susceptible to donation attacks, where a token donation to any of the involved pricing pipeline contracts can result in rate changes. An LP is encouraged to investigate the whole pricing pipeline starting from the Rate Provider mentioned in the `registry.json`.

## Conclusion
**Summary judgment: SAFE**

Legacy Rate Providers have been working well with Balancer pools for an extended amount of time. A specific review for the involved Rate Provider is not accessible.