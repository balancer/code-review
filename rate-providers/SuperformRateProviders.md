\<Template: Copy this file and replace all elements inside \<\> brackets. Delete this particular block.\>

# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @mattpereira
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0x9fA39387D479fd456367190c82739eD6dC86491D](https://etherscan.io/address/0x9fA39387D479fd456367190c82739eD6dC86491D#code)
    - [base:0x829Be222f36C6B7D48a7e1270b3c070BA2Ee98C4](https://basescan.org/address/0x829Be222f36C6B7D48a7e1270b3c070BA2Ee98C4#code)
- Audit report(s):
    - [yAudit Superform Router Plus and Super Vaults Review](https://github.com/superform-xyz/SuperVaults/blob/main/audits/yAudit_report.pdf)

## Context
The ERC4626 RateProvider fetches the rate of SuperVault tokens in terms of the underlying asset. The exchange rate is provided via the conversion between totalAssets and totalSupply.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
The ERC4626 RateProvider fetches the rate of SuperVault tokens in terms of the underlying asset. The exchange rate is provided via the conversion between totalAssets and totalSupply. The SuperVault contract leverages Yearn v3's `TokenizedStrategy` as a proxy implementation that handles core ERC4626 vault logic. It extends this foundation by adding specialized functionality for managing multiple Superform positions through weight-based allocation, rebalancing capabilities, and whitelist controls.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [ ] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address). 

- [ ] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price). 

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes). 

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price). 

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.


## Conclusion
**Summary judgment: USABLE**

The Rate Providers should work as expected with Balancer pools. No portion of the price pipeline is upgradeable, and common manipulation vectors are mitigated by SuperVaults deleagating most of their core ERC-4626 vault functionality to the Yearn V3 TokenizedStrategy contract.
