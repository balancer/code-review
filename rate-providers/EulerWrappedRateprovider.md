# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @franzns
- Checked by: @danielmkm
- Deployed at:
    - [sonic:0xad597fce59dbbd13bcd5bcc1a6fd654acfa92eff](https://sonicscan.org/address/0xad597fce59dbbd13bcd5bcc1a6fd654acfa92eff#code)
    - [sonic:0x7a5a8bece4c24c0c903f6adbc866a42c1799926d](https://sonicscan.org/address/0x7a5a8bece4c24c0c903f6adbc866a42c1799926d#code)
- Audit report(s):
    - [EVK Audits](https://docs.euler.finance/security/audits)

## Context
The ERC4626 Rate Provider fetches the rate of an Euler Market. The rate provider was created using the ERC4626 Rateprovider factory which calls convertToAssets on the ERC4626 to expose the rate. 

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
The Beacon is [here](https://sonicscan.org/address/0xf075cc8660b51d0b8a4474e3f47edac5fa034cfb#readContract) which can be upgraded by the [upgradeAdmin](https://sonicscan.org/address/0x9A75b862fD7fe841A946DC6850580b544988Ea70#code) which is a governor contract. The governor contract admin is:
    - admin address: [sonic:0x85678469e789fe90e051953b926b77d6e76cd571](https://sonicscan.org/address/0x85678469e789fe90e051953b926b77d6e76cd571#code)
    - admin type: multisig
        - multisig threshold/signers: 3/8
        - multisig timelock? Yes: 4 days
    

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Conclusion
**Summary judgment: SAFE**

The Rate Providers should work well with Balancer pools. The underlying contracts have been audited. Computation of totalAssets do not rely on `balanceOf()` calls and also their audits do not indicate any risk of a donation attack vector.