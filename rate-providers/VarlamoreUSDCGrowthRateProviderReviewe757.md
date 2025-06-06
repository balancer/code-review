
# Rate Provider: VarlamoreUSDC Growth rate provider

## Details
This report was autogenerated on 28/05/2025.

- Deployed at:
    - [Sonic:0x7481373be81ad9bff00dfb03717cf9854a4ff077](https://sonicscan.org//address/0x7481373be81ad9bff00dfb03717cf9854a4ff077)
- Audit report(s):
    - [<audit title>](<link to audit>)

## Context
<Write a brief description of the intended functionality here.>

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [ ] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

### Administrative Privileges
- [ ] The Rate Provider is upgradeable** (e.g., via a proxy architecture).
- [ ] Other contracts which are part of the `getRate` callchain are upgradeable**. You can find more information
   about the involved contracts in this [tenderly simulation](https://www.tdly.co/shared/simulation/09a40c6e-c5da-4961-95fc-aa4e02afd24b)

## Conclusion
**Summary judgment: UNUSABLE**

** upgradeable in this context means that:
- The contract is a proxy contract with an implementation sourced from Etherscan and the proxy emitted an "Upgraded" event.
    
