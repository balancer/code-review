
# Rate Provider: WrappedHLP rate provider

## Details
This report was autogenerated on 29/07/2025.

- Deployed at:
    - [HyperEVM:0x083961C864cfB44B5B772341659587357acF21E6](https://hyperevmscan.io/address/0x083961C864cfB44B5B772341659587357acF21E6)
- Audit report(s):
    - [Looping collective audits](https://docs.loopingcollective.org/liquid-looping-products/wrapped-hlp/security-and-risk-managemet)

## Context
 HLP is a USD-denominated token that automatically deposits into HLP. Initially valued at 1.00 USD per WHLP, its value appreciates over time as HLP rewards accrue. WHLP is a tokenized representation of HyperLiquidity Provider (HLP), that enables holders to earn HLP’s yield while retaining full liquidity and DeFi composability on HyperEVM.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

### Administrative Privileges
- [ ] The Rate Provider is upgradeable** (e.g., via a proxy architecture).
- [ ] Other contracts which are part of the `getRate` callchain are upgradeable**.

## Conclusion
**Summary judgment: USABLE**

** upgradeable in this context means that:
- The contract is a proxy contract with an implementation sourced from Etherscan and the proxy emitted an "Upgraded" event.
    
