# Rate Provider: `TollgateChronicleRateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [gnosis:0xdc90e2680094314CEaB45CE15100F6e02cEB7ceD](https://gnosisscan.io/address/0xdc90e2680094314ceab45ce15100f6e02ceb7ced#code)
    - [gnosis:0x92320D3C8Fd6BE59b22eB0eEe330901Fe4617f33](https://gnosisscan.io/address/0x92320D3C8Fd6BE59b22eB0eEe330901Fe4617f33#code)
- Audit report(s):
    - [Chronicle Oracles audits](\<link to audit\>)

## Context
This rate Provider bridges the eth/reth exchange rate & GBP/USD to gnosis chain. This is done via an oracle solution developed by chronicle. 

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
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - reth/eth:
        - source: Chronicle protocol Oracle
        - source address: [gnosis:0xE04a8f725b49c9D36C0fD3495F4a792056374847](https://gnosisscan.io/address/0xe04a8f725b49c9d36c0fd3495f4a792056374847)
        - any protections? YES
            - The rate data's supplied age must be greater than the timestamp of last successful update
            - the rate data's age must not be greater than current time
            - The rate data's integrity is verified by the supplied signature. Currently `bar` (7) signers verify the rate's integrity. For more information see `_poke` and `isAcceptableSchnorrSignatureNow` as part of the PriceFeed `Chronicle_RETH_ETH_1` contract deployed at [gnosis:0x7706A143c750aDfc2196c4Bf84e6BB012Aed1182](https://gnosisscan.io/address/0x7706a143c750adfc2196c4bf84e6bb012aed1182#code)
    - GBP/USD:
        - source: Chronicle protocol Oracle
        - source address: [gnosis:0x0E418d54863a3fAfeC9e96a358795f0f236f5f66](https://gnosisscan.io/address/0x0E418d54863a3fAfeC9e96a358795f0f236f5f66)
        - any protections? YES
            - The rate data's supplied age must be greater than the timestamp of last successful update
            - the rate data's age must not be greater than current time
            - The rate data's integrity is verified by the supplied signature. Currently `bar` (7) signers verify the rate's integrity. For more information see `_poke` and `isAcceptableSchnorrSignatureNow` as part of the PriceFeed `Chronicle_GBP_USD_1` contract deployed at [gnosis:0x0E418d54863a3fAfeC9e96a358795f0f236f5f66](https://gnosisscan.io/address/0x0E418d54863a3fAfeC9e96a358795f0f236f5f66#code)

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.


## Conclusion
**Summary judgment: **

This rate provider should work well with Balancer pools. The oracle providing the rate data has various guardrails in place ensuring the integrity of the rate being provided. The `owner` of the rate provider has the capability to revert the call to `getRate`. However this potential revert scenario is guarded behind a Multisig of [1/4] for reth and [2/6] for GBP.
