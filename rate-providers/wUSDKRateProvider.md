# Rate Provider: `RateProvider` for `wUSK`

## Details
- Reviewed by: @baileyspraggins
- Checked by: @gerrrg 
- Deployed at:
    - [eth:0xd8689E8740C23d73136744817347fd6aC464E842>](https://etherscan.io/address/0xd8689E8740C23d73136744817347fd6aC464E842)
- Audit report(s):
    - [Kuma Protocol](https://docs.kuma.bond/kuma-protocol/ressources/security-and-audits)

## Context
Wrapped USK (wUSK) is a wrapped asset of Kuma's USK interest-bearing token. USK is backed by Kuma NFTs which represent 12 month US T-Bills.

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
- [x] The Rate Provider is susceptible to donation attacks.

This Rate Provider calls `_convertToAssets()` within the `WrappedRebaseToken` contract. The return value of `getRate` is `1e18` multiplied by the `totalAssets()` within the contract divided by the `totalSupply()` of `wUSK`. This method of calculating the rate is susceptible to donation attacks. Below you can see the code snippet for `totalAssets()` which allows an attacker to manipulate the rate upwards by donating the underlying asset, [`USDK`](https://etherscan.io/address/0x01bF66BEcDcFD6D59A5Ca18869f494feA086cdfD), to the contract.

```solidity
// @audit totalAssets checks the balance of the underlying asset instead of the amount deposited. 
//  This allows anyone to manipulate the rate upwards by donating the underlying asset to the contract.
function totalAssets() public view virtual override returns (uint256) {
    return _asset.balanceOf(address(this));
} 
```

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

`RateProvider` by Kuma Protocol is safe to use in Balancer Pools. All minimum requirements are met. All contracts involved in pricing are non-upgradeable and don't rely on oracles or other external sources of data. However, users should be aware that this rate provider is susceptible to donation attacks. This will not impact Balancer Pool's, but could have negative affects on downstream integrations. Users must assess the unique risk this poses to their respective protocols.

This review also makes no determination as to the security of the wUSK token itself or the Kuma protocol, as it is laser-focused on Balancer integration with the `RateProvider` of wUSK. Before investing your funds in any DeFi protocol, please consult its source code, documentation, and historical audits.
