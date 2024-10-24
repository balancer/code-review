# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum::0x7C53f86d9a6B01821F916802A7606E9255DfE4e2](https://etherscan.io/address/0x7C53f86d9a6B01821F916802A7606E9255DfE4e2)
- Audit report(s):
    - [Treehouse audits](https://github.com/treehouse-gaia/audit-report)

## Context
Treehouse is a decentralized application that introduces Treehouse Assets (tAssets) and Decentralized Offered Rates (DOR), new primitives that enable fixed income products in digital assets. Users who deposit ETH or liquid staking tokens (LST) into the protocol receive tETH and contribute to the convergence of fragmented on-chain ETH rates. The rate provider works based on reporting totalAssets / totalSupply. In contracts to usual ERC4626 Vaults, `totalAssets` are not based on the underlyings token balances but rather a "mirrored" accounting contract that has additional ways of having `totalAssets` of the Vault increased, the so called Accounting unit.

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
    - upgradeable component: `TAsset` ([ethereum:0xD11c452fc99cF405034ee446803b6F6c1F6d5ED8](https://etherscan.io/address/0xD11c452fc99cF405034ee446803b6F6c1F6d5ED8#readProxyContract))
    - admin address: [ethereum:0x22261B4D6F629D8cF946C3524df86bF7222901F6](https://etherscan.io/address/0x22261B4D6F629D8cF946C3524df86bF7222901F6)
    - admin type: multisig
        - multisig threshold/signers: 5/7

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source: Since the pricing data is based on a "mirrored" underlying, the various addresses which can function as an oracle are stated here
    - source address: 
        - [ethereum:0x22261B4D6F629D8cF946C3524df86bF7222901F6](https://etherscan.io/address/0x22261B4D6F629D8cF946C3524df86bF7222901F6). This 5/7 multisig has capabilities to mint underlying assets such that `totalAssets` can increase. 

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

This rate provider should work well with Balancer pools. Upgradeability mechanisms are secured by a multisig. It is important to note that technically the `asset` of this ERC4626 Vault is not wsteth, but a internal accounting contract which can report different assets held compared to wsteth in the Vault. Technically, the pool asset will be displayed as tETH [ethereum:0xD11c452fc99cF405034ee446803b6F6c1F6d5ED8](https://etherscan.io/address/0xD11c452fc99cF405034ee446803b6F6c1F6d5ED8#readProxyContract) in any respective pool, however it is notable that the actual asset is the underlying internal accounting unit [ethereum:0x1B6238E95bBCABEE58997c99BaDD4154ad68BA92](https://etherscan.io/address/0x1B6238E95bBCABEE58997c99BaDD4154ad68BA92).
