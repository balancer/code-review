# Rate Provider: `ConstantRateProvider`
## Details
- Reviewed by: @franzns
- Checked by: @Zen-Maxi
- Deployed at:
    - [sonic:0xECDfaa456a01c9804Fc8D11955CF4B54E0eA2Bd7](https://sonicscan.org/address/0xECDfaa456a01c9804Fc8D11955CF4B54E0eA2Bd7)
    - [sonic:0xEc722f8e430273EaC92017A0D7d7B272D043f747](https://sonicscan.org/address/0xEc722f8e430273EaC92017A0D7d7B272D043f747)
    - [sonic:0x635d8b3870ade127eb7ffc21753883f8f30e1051](https://sonicscan.org/address/0x635d8b3870ade127eb7ffc21753883f8f30e1051)
    - [arbitrum:0x3a216B01db971Bf28D171C9dA44Cc8C89867697F](https://arbiscan.io/address/0x3a216B01db971Bf28D171C9dA44Cc8C89867697F#code)
    - [arbitrum:0x72F6Da3b4bd0Ab7028F52339Ee3B1f94fffe2dD0](https://arbiscan.io/address/0x72F6Da3b4bd0Ab7028F52339Ee3B1f94fffe2dD0#code) 
    - [arbitrum:0xdcd8db2a23e21a4b9fa3d984d5a31fb554c70832](https://arbiscan.io/address/0xdcd8db2a23e21a4b9fa3d984d5a31fb554c70832#code) 
    - [ethereum:0xD43F5a722e8e7355D790adda4642f392Dfb820a1](https://etherscan.io/address/0xD43F5a722e8e7355D790adda4642f392Dfb820a1#code)
    - [base:0x5E10C2a55fB6E4C14c50C7f6B82bb28A813a4748](https://basescan.org/address/0x5E10C2a55fB6E4C14c50C7f6B82bb28A813a4748)
    - [base:0x3e89cc86307aF44A77EB29d0c4163d515D348313](https://basescan.org/address/0x3e89cc86307aF44A77EB29d0c4163d515D348313) 
    - [base:0x3fA516CEB5d068b60FDC0c68a3B793Fc43B88f15](https://basescan.org/address/0x3fA516CEB5d068b60FDC0c68a3B793Fc43B88f15)    
    - [base:0xd58338f102e8de2e3d9d54cc043c6d606826a790](https://basescan.org/address/0xd58338f102e8de2e3d9d54cc043c6d606826a790)    
    - [base:0x4a0f0012004bc22d4fdb818b9c539e78adc0c69d](https://basescan.org/address/0x4a0f0012004bc22d4fdb818b9c539e78adc0c69d)
    - [avalanche:0xd0C13867BeA969398370B2A2B9124e3b2E48743C](https://snowtrace.io/address/0xd0C13867BeA969398370B2A2B9124e3b2E48743C/contract/43114/code)
    - [gnosis:0x1E28a0450865274873bd5485A1E13A90F5f59CbD](https://gnosisscan.io/address/0x1e28a0450865274873bd5485a1e13a90f5f59cbd#code)
- Audit report(s):
    - [Gyro audits](https://docs.gyro.finance/gyroscope-protocol/audit-reports)

## Context
This rate provider reports a constant rate which scales the price of the asset to a specific area of the ellipsis pricing function.
> reason for the constant rate provider is to scale the prices that the pool does its math at to the part of the ellipse that is near 1:1. The reason is that this region is better tested (although in principle, the rounding analysis should apply to a much wider range of parameters and pool prices -- but feels slightly safer to use the scaling)

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [ ] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address). 

- [ ] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price).

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.


## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

The required `getRate` value for this particular case scales the balances to the required pricing point on the gyro pricing curve. For more information see also the [gauge proposal](https://forum.balancer.fi/t/bip-731-enable-several-e-clp-gauges-base/6148). Note: This rateProvider should not be used for other pools to provide rate data for WETH or any other assets. 
