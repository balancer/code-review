# Rate Provider: `OrbETHRateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [arbitrum:0xb0a3f194bf6dad4409e861c48cbba9f41e870be7](https://arbiscan.io/address/0xb0a3f194bf6dad4409e861c48cbba9f41e870be7#code)
- Audit report(s):
    - [Audits](https://github.com/dinero-protocol/audits/tree/master/dinero-pirex-eth/branded-lst)

## Context
> The LiquidStakingToken contract is the extension of the Pirex protocol for the Mode Layer 2 (L2). Instead of holding the AutoPxEth vault shares on Layer 1 (L1), users can hold the Liquid Staking Token (LST) on L2 and benefit from the same apxETH yield. The LST can be obtained by performing a deposit on either L1 or L2. On L1, the accepted tokens include Ether, pxETH, and apxETH, while on L2, only the Layer 2 Ether is accepted. Unlike deposits, the withdrawals can be initiated exclusively from the L2 side. In exchange for the LST, users receive an appropriate amount of pxETH tokens on L1 based on the conversion ratio from the AutoPxEth vault. 
The Rate Provider reads from the wrapped version of the LiquidStaking token and reports the value of orbETH in terms of rorbETH.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be usable despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [ ] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).

- [x] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price).
    - upgradeable component: `orbEth` ([arbitrum:0xcF6C2bb97a8978321C9e207afE8A2037fa9be45C](https://arbiscan.io/address/0xcF6C2bb97a8978321C9e207afE8A2037fa9be45C))
    - admin address: [arbitrum:0x64769c53Ff91b83FE9830776a4b85a1f4e1eDAAD](https://arbiscan.io/address/0x64769c53Ff91b83FE9830776a4b85a1f4e1eDAAD)
    - admin type: multisig
        - multisig threshold/signers: 4/8

    - upgradeable component: `rorbEth` ([arbitrum:0x8a6e8E584b415352f7aAef2304945E1772f80378](https://arbiscan.io/address/0x8a6e8E584b415352f7aAef2304945E1772f80378))
    - admin address: [arbitrum:0x64769c53Ff91b83FE9830776a4b85a1f4e1eDAAD](https://arbiscan.io/address/0x64769c53Ff91b83FE9830776a4b85a1f4e1eDAAD)
    - admin type: multisig
        - multisig threshold/signers: 4/8

    - comment: Due to system complexity there might be other upgradeable contracts which could potentially influence the rate. Readers should investigate 
        - `_handleMessageReceived`
        - `_mint`
        - `_withdrawPendingDeposit`
        - `_updateSyncQueue`
        - `withdraw`
        - `_addToSyncQueue`
    For further details or upgradeable contracts in the `getRate` callchain. 

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.
## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.


## Conclusion
**Summary judgment: USABLE**

This rate provider should work with Balancer pools. The two reviewed upgradeable contracts are guarded behind multisigs for upgradeability. Due to system complexity this review did not investigate the whole `getRate` callchain. The linked documentation in the introduction is a great resource to further understand the technical details of the system.
