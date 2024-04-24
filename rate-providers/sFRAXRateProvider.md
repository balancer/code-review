# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @danielmkm
- Deployed at:
    - [ethereum:0x033E20068Db853Fa6C077F38faa4670423FC55fF](https://etherscan.io/address/0x033E20068Db853Fa6C077F38faa4670423FC55fF#code)
- Audit report(s):
    - [FRAX audits](https://docs.frax.finance/other/audits)

## Context
Staked FRAX (sFRAX) is an ERC4626 staking vault that distributes part of the Frax Protocol yield weekly to stakers denominated in FRAX stablecoins. The sFRAX token represents pro rata deposits within the vault and is always withdrawable for FRAX stablecoins at the pro rata rate at all times.

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

The value increase of a share happens via a transfer of FRAX to the sFRAX contract and an eventual call to `syncRewardsAndDistribution`. This call updates the reward data `rewardCycleAmount`. Whenever the rate is being fetched the rewards are vested over time to smoothen out the rate increase due to the donation.

```solidity
// Calculate rewards for next cycle
uint256 _newRewards = asset.balanceOf(address(this)) - storedTotalAssets;
```

During `syncRewardsAndDistribution` the FRAX balance in the sFRAX contract is read which opens up the possibility of donation attacks. 


## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

This rate provider should work well with Balancer pools. No part of the pricing pipeline is upgradeable, reducing the surface for inaccurate rate data being supplied. Also a spiking rate due to reward donations does not happen as it scales with time passed as can be seen in `calculateRewardsToDistribute`. 