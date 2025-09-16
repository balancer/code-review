# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [avalanche:0x0646cD7FfD52044BbD5b07Ce14448FbeEb707E4c](https://snowscan.xyz/address/0x0646cd7ffd52044bbd5b07ce14448fbeeb707e4c#code)
- Audit report(s):
    - [Silo finance audits](https://docs.silo.finance/docs/audits/)

## Context
This ERC4626 rate provider tracks the embedded yield within the MEV Silo BTC.b Vault.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be usable despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [ ] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).

- [x] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price).
    - Part of the call to `getRate` involve unverified contracts where it cannot be determined as of now if they are upgradeable
    - Contract is unverified for address 0x9266afd239c81bb9352b87ff2c33601bf79f5f8e
    - Contract is unverified for address 0xdfbe99defd80dd5412723c6a8a083bec733ceaa6
    - Contract is unverified for address 0x0261d1f2b6436b54cbe23fa11af34331741a90d3
    - Contract is unverified for address 0x6137dc2e437747e51dd786a9f350063c6189cdeb
    - Contract is unverified for address 0xac37353980e614d9e6c13c862ee36c38cb4b4afc

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.
    - comment: as of the time of this review, this cannot be determined due to the unverified nature of the `asset` implementation contract deployed [0x48766776d56D429e6BEb426cCcA3FAe31cace06D](https://snowscan.xyz/address/0x48766776d56d429e6beb426ccca3fae31cace06d#code)

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: USABLE**

This rate provider is deemed safe due to a fast track request, but a further review should be done, once all the requirements for autmated review are given.
