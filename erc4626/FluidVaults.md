# ERC4626 Vault: `Fluid Wrapped Ether`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0x90551c1795392094FE6D29B758EcCD233cFAa260](https://etherscan.io/address/0x90551c1795392094FE6D29B758EcCD233cFAa260)
    - [arbitrum:0x45Df0656F8aDf017590009d2f1898eeca4F0a205](https://arbiscan.io/address/0x45Df0656F8aDf017590009d2f1898eeca4F0a205)
    - [base:0x9272d6153133175175bc276512b2336be3931ce9](https://basescan.org/address/0x9272d6153133175175bc276512b2336be3931ce9)
- Audit report(s):
    - [Fluid audits](https://docs.fluid.instadapp.io/audits-and-security.html)

## Context
The Lend Protocol within the Fluid ecosystem is a foundational component designed to facilitate lending activities with high efficiency and security. You can think of it as the 'Deposit and Earn' of Fluid. The lend protocol is your direct access into Fluid's Liquidity Layer.  Fluid Earn Deposits are ERC-4626 complaint making them easy to integrate and provides ease for protfolio managers to integrate the Lend Protocol.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Tests based on the [balancer-v3-monorepo](https://github.com/balancer/balancer-v3-monorepo/tree/main/pkg/vault/test/foundry/fork) pass for the given ERC4626 vaults, which can be found [here](https://github.com/balancer/balancer-v3-erc4626-tests/tree/main/test).
    - comment: The tests were run with a `minDeposit` of `2e6`.
- [x] The required Vault implements the required operational ERC4626 Interface

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [ ] The ERC4626 Vault is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).

### Compatibility 
- [ ] The reviewed ERC4626 Vault is compatible and wrapping/unwrapping can be used in swap paths. 

- [x] The reviewed ERC4626 Vault is compatible and wrapping/unwrapping can be used for add and remove. 

### Common Manipulation Vectors
- [ ] The ERC4626 Vault is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: USABLE**
Passing fork tests:
- [fluid weth mainnet](https://github.com/balancer/balancer-v3-erc4626-tests/blob/main/test/mainnet/ERC4626MainnetFluidWeth.t.sol) 
- [fluid weth base](https://github.com/balancer/balancer-v3-erc4626-tests/pull/32)
- [fluid weth arbitrum](https://github.com/balancer/balancer-v3-erc4626-tests/pull/32)