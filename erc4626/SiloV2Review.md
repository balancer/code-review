# ERC4626 Vault: `Silo V2`

## Details
- Reviewed by: @franzns
- Checked by: @mkflow27
- Deployed at:
    - [sonic:0x52Fc9E0a68b6a4C9b57b9D1d99fB71449A99DCd8](https://sonicscan.org/address/0x52Fc9E0a68b6a4C9b57b9D1d99fB71449A99DCd8#code)
    - [sonic:0x87178fe8698C7eDa8aA207083C3d66aEa569aB98](https://sonicscan.org/address/0x87178fe8698C7eDa8aA207083C3d66aEa569aB98#code)
    - [sonic:0x016C306e103FbF48EC24810D078C65aD13c5f11B](https://sonicscan.org/address/0x016C306e103FbF48EC24810D078C65aD13c5f11B#code)
- Audits:
    - [Silo V2 audits](https://docs.silo.finance/audits-and-tests)


## Context
All Silo V2 markets are ERC4626 vaults be default. 

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the ERC4626. If any of these is unchecked, the the ERC4626 is unfit to use.

- [x] Tests based on the [balancer-v3-monorepo](https://github.com/balancer/balancer-v3-monorepo/tree/main/pkg/vault/test/foundry/fork) pass for the given ERC4626 vaults, which can be found [here](https://github.com/balancer/balancer-v3-erc4626-tests/blob/main/test/sonic/).
- [x] The required Vault implements the required operational ERC4626 Interface

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in ERC4626 contracts.

If none of these is checked, then this might be a pretty great ERC4626! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a ERC4626 can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the ERC4626.

### Administrative Privileges
- [ ] The ERC4626 Vault is upgradeable. 

### Common Manipulation Vectors
- [ ] The ERC4626 Vault is susceptible to donation attacks.

## Additional Findings

## Conclusion
**Summary judgment: USABLE**

The outlined ERC4626 Vaults should work well with Balancer pools. The underlying contracts have been audited. Computation of totalAssets do not rely on `balanceOf()` calls and also their audits do not indicate any risk of a donation attack vector.