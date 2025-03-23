export const template = `
# Rate Provider: {{rateProvider}}

## Details
This report was autogenerated on {{date}}.

- Deployed at:
    - [{{network}}:{{rateProviderAddress}}]({{chainExplorer}})
- Audit report(s):
    - [<audit title>](<link to audit>)

## Context
<Write a brief description of the intended functionality here.>

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [{{hasInterface}}] Implements the [\`IRateProvider\`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [{{isScale18}}] \`getRate\` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

### Administrative Privileges
- [{{isUpgradeable}}] The Rate Provider is upgradeable** (e.g., via a proxy architecture).
- [{{hasUpgradeableElements}}] Other contracts which are part of the \`getRate\` callchain are upgradeable**. You can find more information
   about the involved contracts in this [tenderly simulation]({{tenderlySimUrl}})

## Conclusion
**Summary judgment: {{isUsable}}**

** upgradeable in this context means that:
- The contract is a proxy contract with an implementation sourced from Etherscan and the proxy emitted an "Upgraded" event.
    
`
