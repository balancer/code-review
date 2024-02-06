# Rate Provider: `svETHRateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @danielmkm
- Deployed at:
    - [ethereum:0xad4bFaFAe75ECd3fED5cFad4E4E9847Cd47A1879](https://etherscan.io/address/0xad4bFaFAe75ECd3fED5cFad4E4E9847Cd47A1879#code)
- Audit report(s):
    - [Vector Reserve security review](https://github.com/JacoboLansac/audits/blob/main/solo/vector-reserve.md)

## Context
staked Vector ETH is a staked version of Vector ETH. Vector eth is a token designed to follow the price of ETH. A user deciding to stake vETH for svETH earns rewards accrued by the collateral backing vETH.
## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.
    - comment: This assumption only holds true if `vETH` & `svETH` have the same decimals. Which is given for this Rate Provider.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [ ] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).

- [x] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price).
    - upgradeable component: `VectorETH` ([ethereum:0x38D64ce1Bdf1A9f24E0Ec469C9cAde61236fB4a0](https://etherscan.io/address/0x38D64ce1Bdf1A9f24E0Ec469C9cAde61236fB4a0#code))
    - admin address: [ethereum:0xe0EB63B4E18FF1e646ab7E37510E6EaF287AdE3D](https://etherscan.io/address/0xe0EB63B4E18FF1e646ab7E37510E6EaF287AdE3D)
    - admin type: multisig
        - multisig threshold/signers: 3/5

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks.

The price computation is based on the balance of vETH in the svETH contract. Minting vETH against a `_restakedLST` is also based on a internal exchange rate which the vETH contract owner has access to. Meaning a donation attack is cost efficient by the owner since the owner has access to set the exchangeRate of `_restakedLST` for vETH by setting `vETHPerRestakedLST` via `updatevETHPerLST()`. 

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

This light review of the svETH Rate Provider concludes that the svETH Rate Provider is fit to be used with Balancer pools.
