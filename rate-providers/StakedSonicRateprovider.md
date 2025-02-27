# Rate Provider: `StakedSonicRateProvider`

## Details
- Reviewed by: @franzns
- Checked by: 
- Deployed at:
    - [sonic:0xe5da20f15420ad15de0fa650600afc998bbe3955](https://sonicscan.org/address/0xe5da20f15420ad15de0fa650600afc998bbe3955#code)
- Audits:
    - [Beets Staked Sonic Audits](https://github.com/beethovenxfi/sonic-staking/tree/main/audits)

## Context
The Staked Sonic Rate Provider fetches the rate of staked Sonic. The rateprovider uses the convertToAssets() function in the stS contract to determine the rate.

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
    - [sonic:0xe5da20f15420ad15de0fa650600afc998bbe3955](https://sonicscan.org/address/0xe5da20f15420ad15de0fa650600afc998bbe3955#code)
        - upgradeable component: `StakedSonic` ([sonic:0xe5da20f15420ad15de0fa650600afc998bbe3955](https://sonicscan.org/address/0xe5da20f15420ad15de0fa650600afc998bbe3955#code))
        - owner address: [sonic:0xf750f4E0813898C544A4349526206e1165F0E5d0](https://sonicscan.org/address/0xf750f4E0813898C544A4349526206e1165F0E5d0)
        - admin owner: [sonic:0x7B782A460Def196149f8369BdeC30e3f2F2356EB](https://sonicscan.org/address/0x7B782A460Def196149f8369BdeC30e3f2F2356EB)
        - admin type: Multisig 5/7
            - multisig timelock? Yes, 3 weeks.


### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Conclusion
**Summary judgment: SAFE**

The Rate Providers should work well with Balancer pools. The underlying contracts have been audited. Computation of totalAssets do not rely on `balanceOf()` calls and also their audits do not indicate any risk of a donation attack vector.