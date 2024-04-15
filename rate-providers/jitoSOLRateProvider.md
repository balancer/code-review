# Rate Provider: `StakePoolRate`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [arbitrum:0x8aa73EC870DC4a0af6b471937682a8FC3b8A21f8](https://arbiscan.io/address/0x8aa73ec870dc4a0af6b471937682a8fc3b8a21f8#code)
- Audit report(s):
    - [Wormhole audits](https://github.com/wormhole-foundation/wormhole/blob/main/SECURITY.md#3rd-party-security-audits)

## Context
The oracle contract at is an immutable QueryResponse processor, which accepts valid queries for the designated Stake Pool account via updatePool() and provides the last totalActiveStake and poolTokenSupply via getRate() as long as the last update is not older than the configured allowedStaleness.

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
    - upgradeable component: `Wormhole` ([arbitrum:0xa5f208e072434bC67592E4C49C1B991BA79BCA46](https://arbiscan.io/address/0xa5f208e072434bC67592E4C49C1B991BA79BCA46#code))
    - admin address: Wormhole governance - Any valid VAA (Verified action approval) can upgrade the contract
    - admin type: multisig 
        - multisig threshold/signers: A 2/3 super-majority of the Guardians (currently 19 guardians). Read more on contract upgradeability at https://docs.wormhole.com/wormhole/explore-wormhole/security.


### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source: Wormhole 
    - any protections? Various protections are in place. Most importantly the signature of the guardians that signed the data since the `updatePool` function is public. Other important validations are if data is being updated consistently (otherwise the call to `validateBlockTime` of `updatePool` would fail.). 

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).
### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.


## Conclusion
**Summary judgment: SAFE**

The conclusion of this review rests on the assumption that the guardians signing the data have come to consensus on the correctness of it. Similar to how Chainlink data consumption works. One important caveat to mention as part of this review is that consistent reporting of rates via Wormhole is **required**. If no new report has come it, the call to `getRate` will revert and once the CSPs rates need to be cached anew, the pool interaction will revert, requiring a recovery mode for LPs to withdraw their funds.