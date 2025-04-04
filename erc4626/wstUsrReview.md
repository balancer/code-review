# ERC4626 Vault: `Wrapped stUSR (wstUSR)`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0x1202F5C7b4B9E47a1A484E8B270be34dbbC75055](https://etherscan.io/address/0x1202F5C7b4B9E47a1A484E8B270be34dbbC75055#readProxyContract)
- Audit report(s):
    - [Resolv audits](https://docs.resolv.xyz/litepaper/resources/security)

## Context
Users can stake USR to receive allocation of Resolv collateral pool profits. Value of stUSR is equal to value of USR. Quantity of stUSR accrues over time (rebasing) from staking rewards. StUSR has a wrapper token, wstUSR. It is a non-rebasing version of staked USR, value of which accrues over time from staking rewards.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Tests based on the [balancer-v3-monorepo](https://github.com/balancer/balancer-v3-monorepo/tree/main/pkg/vault/test/foundry/fork) pass for the given ERC4626 vaults, which can be found [here](https://github.com/balancer/balancer-v3-erc4626-tests/tree/main/test).
- [x] The required Vault implements the required operational ERC4626 Interface

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [x] The ERC4626 Vault is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address). 
    - admin address: [ethereum:0xD6889F307BE1b83Bb355d5DA7d4478FB0d2Af547](https://etherscan.io/address/0xD6889F307BE1b83Bb355d5DA7d4478FB0d2Af547)
    - admin type: multisig
        - multisig threshold/signers: 3/5
        - multisig timelock? 1 day


### Compatibility 
- [ ] The reviewed ERC4626 Vault is compatible and wrapping/unwrapping can be used in swap paths. <Delete this hint: Does the ERC4626 pass the fork tests and we can use the buffer for swapping underlying to wrapped and vice versa?>
- [ ] The reviewed ERC4626 Vault is compatible and wrapping/unwrapping can be used for add and remove. <Delete this hint: Does the ERC4626 pass the fork tests and we can (and want based on the initital issue request) to use underlying tokens to add or remove liquidity to pools?>

### Common Manipulation Vectors
- [x] The ERC4626 Vault is susceptible to donation attacks.

In [`StUSR`](https://etherscan.io/address/0xba1600735a039e2b3bf1d1d2f1a7f80f45973da7#code) balances are read.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: USABLE**

passing fork tests can be found at: https://github.com/balancer/balancer-v3-erc4626-tests/pull/44