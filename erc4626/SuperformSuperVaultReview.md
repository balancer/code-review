# ERC4626 Vault: `SuperVault`

## Details
- Reviewed by: @mattpereira
- Checked by: @mkflow27
- Deployed at:
    - [ethereum:0xF7DE3c70F2db39a188A81052d2f3C8e3e217822a](https://etherscan.io/address/0xF7DE3c70F2db39a188A81052d2f3C8e3e217822a#code)
    - [base:0xe9F2a5F9f3c846f29066d7fB3564F8E6B6b2D65b](https://basescan.org/address/0xe9F2a5F9f3c846f29066d7fB3564F8E6B6b2D65b#code)
- Audit report(s):
    - [SuperVaults Audits](https://github.com/superform-xyz/SuperVaults/tree/main/audits)

## Context
A SuperVault manages multiple Superforms (Superform positions linked to vaults) and incorporates mechanisms for rebalancing, whitelisting, and deposit limits. SuperVault contracts delegate most of their core ERC-4626 vault functionality to the Yearn V3 TokenizedStrategy contract.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [ ] Tests based on the [balancer-v3-monorepo](https://github.com/balancer/balancer-v3-monorepo/tree/main/pkg/vault/test/foundry/fork) pass for the given ERC4626 vaults, which can be found [here](https://github.com/balancer/balancer-v3-erc4626-tests/tree/main/test).
- [x] The required Vault implements the required operational ERC4626 Interface

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [ ] The ERC4626 Vault is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).

### Buffer blocklist
- [x] The reviewed ERC4626 Vault should be added to the blocked buffers metadata list. 

### Common Manipulation Vectors
- [ ] The ERC4626 Vault is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: USABLE**
The outlined ERC4626 Vaults should work with Balancer pools, but are not compatible with buffers since `testWithdraw` reverts with "too much loss", perhaps because SuperVaults leverage Yearn v3 `TokenizedStrategy` contract, which requires profits to be gradually unlocked over time, making it difficult to guarantee immediate withdrawals at the expected share price. Fork tests can be seen [here](https://github.com/balancer/balancer-v3-erc4626-tests/pull/24)