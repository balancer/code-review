# Rate Provider: `eBtcRateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0x81Be3526A71D9013A1a5bD38758e0f248231b523](https://etherscan.io/address/0x81be3526a71d9013a1a5bd38758e0f248231b523#code)
- Audit report(s):
    - [Protocol audits](https://github.com/Se7en-Seas/boring-vault/tree/main/audit)

## Context
eBTC is a Bitcoin-backed liquidty restaking token. eBTC is backed by LBTC. The staking portion of eBTC is done by Babylon. For more information see the [eBTC documentation](https://etherfi.gitbook.io/etherfi/lrts/ebtc-bitcoin-lrt). 

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [x] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).

- [ ] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price).
### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes). 
    - source: tbd.
    - source address: not set
    - any protections? NO
    - comment: The rate provider reads a state variable in the `AccountantWithRateProvider` contract [ethereum:0x1b293DC39F94157fA0D1D36d7e0090C8B8B8c13F](https://etherscan.io/address/0x1b293DC39F94157fA0D1D36d7e0090C8B8B8c13F#code). This state variable can by upgraded by authorized parties calling `updateExchangeRate(uint96 newExchangeRate)`, making the authorized parties the effective price oracles. Authorization is managed by assigning roles the right to call a particular function. This is managed by the `authority` contract deployed at [ethereum:0x6889E57BcA038C28520C0B047a75e567502ea5F6](https://etherscan.io/address/0x6889E57BcA038C28520C0B047a75e567502ea5F6#code). By inspecting [this](https://etherscan.io/tx/0xb21d447fbaa73159d20cc2ecc508e224cdd66e41378601001af09308f3df16c0) transaction, the right to call `updateExchangeRate` has been assigned to role 11. However upon inspection of all `UserRoleUpdated(address indexed user, uint8 indexed role, bool enabled)` events it turns out that currently no account is authorized to set the rate. Leading to the assumption that this will be done in a time after this review.

    Assuming this is the case in the future only the `owner` of the `authority` contract can assign new roles to users by calling `setUserRole` on the `authority` contract. This right currently lives within a gnosis safe multisig (4/6). 


- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: \<SAFE/UNSAFE\>**

This rate provider should work well with Balancer pools assuming that no wrong rates get pushed. The preferred option would be for the rate Provider to use `getRateSafe` of the `AccountantWithRateProviders` to ensure the transaction on Balancer reverts if the underlying system has been paused due to a above threshold price being pushed as part of a oracle price update transaction.
