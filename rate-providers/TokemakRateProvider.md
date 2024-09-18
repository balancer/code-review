# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0xd4580a56e715F14Ed9d340Ff30147d66230d44Ba](https://etherscan.io/address/0xd4580a56e715F14Ed9d340Ff30147d66230d44Ba#readContract)
- Audit report(s):
    - [Tokemak audits](https://docs.tokemak.xyz/developer-docs/security-and-audits)

## Context
An Autopool, which use the highly composable ERC-4626 standard and can be configured with a set of destinations (pools and DEXs) to which assets may be deployed to. In this particular rate provider the Autopool's assets are distributed accross the Balancer ecosystem where the base asset is Ether. For more information see also the [tokemak app](https://app.tokemak.xyz/autopool?id=0x6dC3ce9C57b20131347FDc9089D740DAf6eB34c5). 
Assets deposited into an Autopool are not subject to any lock ups or cooldown periods, meaning that users can withdraw their funds at any time.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [ ] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).
    - comment: The system uses a minimal proxy architecture, which simply forwards all calls. While the vault is not upgradeable by the usual upgradeable-proxy pattern it needs to be noted that additional downstream components may be upgradeable but were not part of the first review.

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

This rate provider should work with Balancer pools. However due to the time-boxed nature of this review and the high complexity of the underlying Tokemak Autopool product, this review could not cover the total path of how the rate is computed. The approach used to rate calculation is the common totalAssets / totalSupply approach usually used by yield-bearing vault type products. One thing to mention is that for a user, there are essentially two ways to exit an Autopool. Either, by withdrawing the ERC4626 vault's `asset` or selling balETH into the the pool where this rate provider is used. Depending on withdraw size, the rate the pool uses can differ between the rate used on `withdraw` (hint:slippage) from the Vault. For more information also see the developer comments in `AutopoolDebt.sol:withdraw()`.

Additionally During initial Autopool deployment rates are expected to be more dynamic. For more context see the developers comments
> Right now the the balETH Autopool has done two rebalances and there is value loss associated with that... slippage and fee's swapping from WETH to wstETH/ETHx/rsETH.  Since its so early in the deployment, it also hasn't performed any reward claiming and auto-compounds so it hasn't had a chance to make up lost value yet. We'd expect this on every Autopool for the first few days after the first rebalances.


The suggestions is to revisit this rate provider review once the pool has gained traction and conduct a more thorough review of the underlying Tokemak system. 