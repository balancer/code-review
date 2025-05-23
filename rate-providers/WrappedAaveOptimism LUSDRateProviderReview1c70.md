
# Rate Provider: WrappedAave Optimism LUSD rate provider

## Details
This report was autogenerated on 12/05/2025.

- Deployed at:
    - [OP Mainnet:0x477b39f88dc5dda8b525060d4b4aed582f22add3](https://optimistic.etherscan.io/address/0x477b39f88dc5dda8b525060d4b4aed582f22add3)
- Audit report(s):
    - [<audit title>](<link to audit>)

## Context
<Write a brief description of the intended functionality here.>

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

### Administrative Privileges
- [ ] The Rate Provider is upgradeable** (e.g., via a proxy architecture).
- [x] Other contracts which are part of the `getRate` callchain are upgradeable**. You can find more information
   about the involved contracts in this [tenderly simulation](https://www.tdly.co/shared/simulation/328efb08-145f-4857-8551-84a9655ddfad)

## Conclusion
**Summary judgment: USABLE**

** upgradeable in this context means that:
- The contract is a proxy contract with an implementation sourced from Etherscan and the proxy emitted an "Upgraded" event.
    
