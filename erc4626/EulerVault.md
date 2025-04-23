# ERC4626 Vault: `EulerVault`

## Details
- Reviewed by: @franzns
- Checked by: @danielmkm
- Deployed at:
    - [sonic:0x90a804D316A06E00755444D56b9eF52e5C4F4D73](https://sonicscan.org/address/0x90a804D316A06E00755444D56b9eF52e5C4F4D73#code)
    - [sonic:0x6832F3090867449c058e1e3088E552E12AB18F9E](https://sonicscan.org/address/0x6832F3090867449c058e1e3088E552E12AB18F9E#code)
- Audit report(s):
    - [EVK Audits](https://docs.euler.finance/security/audits)

## Context
Euler deploys various lending instances that are operated by curators. The markets in these so-called clusters are ERC4626 vaults than can be used for boosted pools.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Tests based on the [balancer-v3-monorepo](https://github.com/balancer/balancer-v3-monorepo/tree/main/pkg/vault/test/foundry/fork) pass for the given ERC4626 vaults, which can be found [here](https://github.com/balancer/balancer-v3-erc4626-tests/tree/main/test/sonic).
- [x] The required Vault implements the required operational ERC4626 Interface

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [x] The ERC4626 Vault is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address). Its a Beacon-Proxy setup. The Beacon is [here](https://sonicscan.org/address/0xf075cc8660b51d0b8a4474e3f47edac5fa034cfb#readContract) which can be upgraded by the [upgradeAdmin](https://sonicscan.org/address/0x9A75b862fD7fe841A946DC6850580b544988Ea70#code) which is a governor contract. The governor contract admin is:
    - admin address: [sonic:0x85678469e789fe90e051953b926b77d6e76cd571](https://sonicscan.org/address/0x85678469e789fe90e051953b926b77d6e76cd571#code)
    - admin type: multisig
        - multisig threshold/signers: 3/8
        - multisig timelock? Yes: 4 days

### Compatibility 
- [x] The reviewed ERC4626 Vault is compatible and wrapping/unwrapping can be used in swap paths. <Delete this hint: Does the ERC4626 pass the fork tests and we can use the buffer for swapping underlying to wrapped and vice versa?>
- [x] The reviewed ERC4626 Vault is compatible and wrapping/unwrapping can be used for add and remove. <Delete this hint: Does the ERC4626 pass the fork tests and we can (and want based on the initital issue request) to use underlying tokens to add or remove liquidity to pools?>

### Common Manipulation Vectors
- [ ] The ERC4626 Vault is susceptible to donation attacks.


## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.


## Conclusion
**Summary judgment: USABLE**