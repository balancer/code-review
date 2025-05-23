# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @franzns
- Checked by: @mkflow27
- Deployed at:
    - [sonic:0x78557d8a83fe7c6d9f9983d00e5c0e08cc3335e6](https://sonicscan.org/address/0x78557d8a83fe7c6d9f9983d00e5c0e08cc3335e6#code)
    - [sonic:0x9d2d4351c1b3718d7a65ef21f54c86c665964670](https://sonicscan.org/address/0x9d2d4351c1b3718d7a65ef21f54c86c665964670#code)
    - [sonic:0xb86e2517caab8e7aecc7472f29c0cbdaaf28e5e5](https://sonicscan.org/address/0xb86e2517caab8e7aecc7472f29c0cbdaaf28e5e5#code)
    - [sonic:0x4f9ca3eb1f6ff09d3cc947d9020a9ba7bef55523](https://sonicscan.org/address/0x4f9ca3eb1f6ff09d3cc947d9020a9ba7bef55523#code)
    - [sonic:0xb86e2517caab8e7aecc7472f29c0cbdaaf28e5e5](https://sonicscan.org/address/0xb86e2517caab8e7aecc7472f29c0cbdaaf28e5e5#code)
    - [sonic:0x59c9262da57918557780e6010d15c01b59971c42](https://sonicscan.org/address/0x59c9262da57918557780e6010d15c01b59971c42#code)
    - [sonic:0x71453d205b1437f7f3057ce480cdb7a02c1568a0](https://sonicscan.org/address/0x71453d205b1437f7f3057ce480cdb7a02c1568a0#code)
    - [sonic:0x5f26085ad72aa51ed443d84c1f08bbaa7dd5425e](https://sonicscan.org/address/0x5f26085ad72aa51ed443d84c1f08bbaa7dd5425e#code)
    - [sonic:0xf9fe8c5009b1015363e4452e0ac1d45d3924b986](https://sonicscan.org/address/0xf9fe8c5009b1015363e4452e0ac1d45d3924b986#code)
    - [sonic:0x4A3eA10da3c422d31485585096CD00fB5e9F1019](https://sonicscan.org/address/0x4A3eA10da3c422d31485585096CD00fB5e9F1019#code)
    - [sonic:0x55613bbc6c383f3e73d48aaaa1bac14aae302771](https://sonicscan.org/address/0x55613bbc6c383f3e73d48aaaa1bac14aae302771#code)
    - [sonic:0xeab98cbe0c92721fd1c38cad0deebaf575a08239](https://sonicscan.org/address/0xeab98cbe0c92721fd1c38cad0deebaf575a08239#code)
    - [sonic:0xe508a70deef702d5cd1df120bf6936540c9a6b2d](https://sonicscan.org/address/0xe508a70deef702d5cd1df120bf6936540c9a6b2d#code)
    - [sonic:0xe6a932e53d759ff491c3f56c4e63609140d7c044](https://sonicscan.org/address/0xe6a932e53d759ff491c3f56c4e63609140d7c044#code)
- Audits:
    - [Silo V2 audits](https://docs.silo.finance/audits-and-tests)

## Context
The ERC4626 Rate Provider fetches the rate of the Silo V2 Market. The rate provider was created using the ERC4626 Rateprovider factory which calls convertToAssets on the ERC4626 to expose the rate. 

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
- [ ] The Rate Provider is susceptible to donation attacks.

## Conclusion
**Summary judgment: SAFE**

The Rate Providers should work well with Balancer pools. The underlying contracts have been audited. Computation of totalAssets do not rely on `balanceOf()` calls and also their audits do not indicate any risk of a donation attack vector.