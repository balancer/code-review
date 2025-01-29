# Rate Provider: LoopRateProvider

## Details
- Reviewed by: @brunoguerios
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0x1f037c849CF2448d67A120543EA4ec3CE5A95FcA](https://etherscan.io/address/0x1f037c849CF2448d67A120543EA4ec3CE5A95FcA)
    - [Protocol Audits](https://docs.loopfi.xyz/extras/security)

## Context
This rate provider works with a standard approach of `totalAssets/totalSupply`.

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

Rate is calculated as `totalAssets/totalSupply`. If a user donates a large amount of `PoolV3` tokens to `StakingLPEth` contract, the rate will increase. This could be used to manipulate the rate in a way that benefits the attacker.
```
    /** @dev See {IERC4626-totalAssets}. */
    function totalAssets() public view virtual override returns (uint256) {
        return _asset.balanceOf(address(this));
    }
```

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

No additional findings.

## Conclusion
**Summary judgment: SAFE**


