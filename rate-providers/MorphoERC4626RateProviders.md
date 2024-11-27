# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: 
- Checked by: 
- Deployed at:
    - Steakhouse USDC [ethereum:0xc81D60E39e065146c6dE186fFC5B39e4CA2189Cf](https://etherscan.io/address/0xc81D60E39e065146c6dE186fFC5B39e4CA2189Cf#code)
    - Steakhouse USDT [ethereum:0x50A72232c5370321aa78036BaDe8e9d5eB89cbAF](https://etherscan.io/address/0x50A72232c5370321aa78036BaDe8e9d5eB89cbAF#code)
    - Gauntlet Prime wETH [ethereum:0x0A25a2C62e3bA90F1e6F08666862df50cdAAB1F5](https://etherscan.io/address/0x0A25a2C62e3bA90F1e6F08666862df50cdAAB1F5#code)


- Audit report(s):
    - [Security Reviews & Formal Verifications](https://docs.morpho.org/security-reviews/)
    - [MetaMorpho Spearbit Audit](https://github.com/morpho-org/metamorpho/blob/main/audits/2023-11-14-metamorpho-cantina-managed-review.pdf)

## Context
The ERC4626 RateProvider fetches the rate of MetaMorpho Vault tokens in terms of the underlying asset. The exchange rate is provided via the conversion between totalAssets and totalSupply. The Morpho contract only determines the potential market parameters, assets, collaterals, beneficiary, owner, fee, and cooldown periods related to the vault curator. There are no entry or exit fees, and no time locks for users to deposit and withdraw from this vault. 

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



### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Conclusion
**Summary judgment: **

The Rate Providers should work well with Balancer pools. The underlying contracts have been audited and been in production for an extended period of time. 
