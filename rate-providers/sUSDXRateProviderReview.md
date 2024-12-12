# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @danielmkm
- Deployed at:
    - [arbitrum:0xDA967592898c584966AAf765C1acfd09F6e1aEAA](https://arbiscan.io/address/0xDA967592898c584966AAf765C1acfd09F6e1aEAA#code)

- Audit report(s):
    - [usdx audits](https://docs.usdx.money/informaiton/audit)

## Context
Staking is controlled by the StakedUSDX smart contract. Stakers can interact with it directly.
When staking, a user transfers USDX into the contract and receives sUSDX (staked USDX), another ERC20 token that represents a fractional interest in the USDX in the contract. Over time, a portion of protocol revenue accumulates in the staking contract as additional USDX is transferred in. When unstaking, sUSDX is burned in exchange for a proportionate USDX amount. Staking rewards accrual is a function of the protocol's generated yield from earning the funding and basis spread from the delta hedging derivatives position and BTC (re)staking yield in the future.

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

Part of the rate calculation depends on the vault' `asset`, where the balance is fetched. It is implemented as
```solidity
/**
* @notice Returns the amount of USDX tokens that are vested in the contract.
*/
function totalAssets() public view override returns (uint256) {
return IERC20(asset()).balanceOf(address(this)) - getUnvestedAmount();
}
```

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.


## Conclusion
**Summary judgment: Usable**

This rate provider should work well with Balancer pools. Role management which gives access to certain function is based on a 3/5 [multisig](https://arbiscan.io/address/0xe0d810FD0f40257F5dFAb72fd170a4800D847408#code).
