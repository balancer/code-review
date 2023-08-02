# Rate Provider: `GGAVAXRateProvider`

**NOTE: An earlier version of this review pointed out some issues which have since been addressed. Please consult the git history for reference.**

## Details
- Reviewed by: @mkflow27
- Checked by: @rabmarut
- Deployed at:
    - [avalanche:0x1bB74eC551cCd9FE416C71F904D64f42079A0a7f](https://snowtrace.io/address/0x1bb74ec551ccd9fe416c71f904d64f42079a0a7f#code)

## Context
GoGoPool is a permissionless staking protocol built for Avalanche Subnets. When using GoGoPool to liquid-stake `AVAX`, users receive the `ggAVAX` token, a new staking token representing their staked `AVAX` plus any rewards it has accrued in real-time. The `ggAVAX` token implements the `ERC4626` standard. A user deposits `AVAX` and receives `ggAVAX` in return. the exchange rate of `ggAVAX` in terms of `AVAX` is being reported by the Rate Provider.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [ ] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).

- [x] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price).
    - upgradeable component: `ggAVAX` ([avalanche:0xA25EaF2906FA1a3a13EdAc9B9657108Af7B703e3](https://snowtrace.io/address/0xa25eaf2906fa1a3a13edac9b9657108af7b703e3))
        - admin address: [avalanche:0x6C104D5b914931BA179168d63739A297Dc29bCF3](https://snowtrace.io/address/0x6c104d5b914931ba179168d63739a297dc29bcf3#code)
        - admin type: multisig
            - multisig threshold/signers: 2/4
            - multisig timelock? NO
            - trustworthy signers? NO (can't identify any)

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes). 
- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price)

### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks.

The Rate Provider calls `convertToAssets(1e18)` on the `ggAVAX` contract. The return value (`rate`) is a function of the `totalSupply` of `ERC4626` Vault shares and `totalAssets()` - the amount of `AVAX` available.

After a `rewardCycle`, anyone can call `syncRewards()` to distribute rewards to `ggAVAX` holders. As part of this call the variable `nextRewardsAmt` reads the `ggAVAX`'s balance of `wrappedAVAX`. This storage operation eventually influences the call to `convertToAssets()`.

```solidity
function syncRewards() public {
    ...
    uint256 nextRewardsAmt = (asset.balanceOf(address(this)) + stakingTotalAssets_) - totalReleasedAssets_ - lastRewardsAmt_;
    ...
    lastRewardsAmt = nextRewardsAmt.safeCastTo192();
    ...
}

function totalAssets() public view override returns (uint256) {
    ...
    uint192 lastRewardsAmt_ = lastRewardsAmt;
    ...
    if (block.timestamp >= rewardsCycleEnd_) {
        // no rewards or rewards are fully unlocked
        // entire reward amount is available
        return totalReleasedAssets_ + lastRewardsAmt_;
    }

    // rewards are not fully unlocked
    // return unlocked rewards and stored total
    uint256 unlockedRewards = (lastRewardsAmt_ * (block.timestamp - lastSync_)) / (rewardsCycleEnd_ - lastSync_);
}
```

Since `syncRewards()` is publicly callable, it is trivial for anyone to trigger a donation attack, given the right timing of `syncRewards()` being executable.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

No additional findings.

## Conclusion
**Summary judgment: SAFE FOR BALANCER, POTENTIALLY UNSAFE FOR DOWNSTREAM INTEGRATIONS**

Assuming a reasonable set of 2/4 multisig signers, the behavior of this Rate Provider can be deemed safe. All current system components are fully on-chain and cannot be arbitrarily influenced by any actor, even a privileged one. As such, upgradeability would be the only concern, and that falls to the multisig.

The risk of donation attacks is also worth pointing out; this won't directly impact Balancer pools, but it can have consequences for downstream integrations. Integrators should be wary of the underlying token's manipulability via donations, which will propagate into the BPT price itself.
