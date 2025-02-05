\<Template: Copy this file and replace all elements inside \<\> brackets. Delete this particular block.\>

# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @mattpereira
- Checked by: @mkflow27
- Deployed at:
    - [ethereum:0x9fA39387D479fd456367190c82739eD6dC86491D](https://etherscan.io/address/0x9fA39387D479fd456367190c82739eD6dC86491D#code)
    - [base:0x829Be222f36C6B7D48a7e1270b3c070BA2Ee98C4](https://basescan.org/address/0x829Be222f36C6B7D48a7e1270b3c070BA2Ee98C4#code)
- Audit report(s):
    - [yAudit Superform Router Plus and Super Vaults Review](https://github.com/superform-xyz/SuperVaults/blob/main/audits/yAudit_report.pdf)

## Context
The ERC4626 RateProvider fetches the rate of SuperVault tokens in terms of the underlying asset. The exchange rate is provided via the conversion between totalAssets and totalSupply. Each SuperVault manages multiple "Superforms", which are positions linked to other vaults. A `SuperVaultManager` role controls a whitelist of vaults where funds can be allocated. A `SuperVaultStrategist` role is allowed to rebalance the allocation of assets amongst whitelisted vaults.

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
  Part of the rate computation relies on how `totalAssets` is calculated, and `totalAssets` can be changed by the `SuperVaultStrategist` calling `rebalance` to shift assets into any of the whitelisted vaults. The whitelist is controlled by the `SuperVaultManager`.
  
  #### [ethereum:0x9fA39387D479fd456367190c82739eD6dC86491D](https://etherscan.io/address/0x9fA39387D479fd456367190c82739eD6dC86491D#code)
  The relevant [vault](https://etherscan.io/address/0xF7DE3c70F2db39a188A81052d2f3C8e3e217822a#readContract) roles are both EoAs
  - `SuperVaultManager` : [0x701aE9c540ba2144b669F22e650882e7e07cB11F](https://etherscan.io/address/0x701aE9c540ba2144b669F22e650882e7e07cB11F)
  - `SuperVaultStrategist` : [0xFa476C5ec7A43a68e081fD5a33f668f0BD09e126](https://etherscan.io/address/0xFa476C5ec7A43a68e081fD5a33f668f0BD09e126)
  
  #### [base:0x829Be222f36C6B7D48a7e1270b3c070BA2Ee98C4](https://basescan.org/address/0x829Be222f36C6B7D48a7e1270b3c070BA2Ee98C4#code)
  The relevant vault roles are both EoAs
  - `SuperVaultManager` : [0x701aE9c540ba2144b669F22e650882e7e07cB11F](https://basescan.org/address/0x701aE9c540ba2144b669F22e650882e7e07cB11F)
  - `SuperVaultStrategist` : [0xFa476C5ec7A43a68e081fD5a33f668f0BD09e126](https://basescan.org/address/0xFa476C5ec7A43a68e081fD5a33f668f0BD09e126)

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes). 

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price). 

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.


## Conclusion
**Summary judgment: USABLE**

The Rate Providers should work as expected with Balancer pools. No portion of the price pipeline is upgradeable, and common manipulation vectors are mitigated by SuperVaults deleagating most of their core ERC-4626 vault functionality to the Yearn V3 TokenizedStrategy contract.
