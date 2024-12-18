# ERC4626 Vault: `GainLendingPool`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0xc824A08dB624942c5E5F330d56530cD1598859fD](https://etherscan.io/address/0xc824a08db624942c5e5f330d56530cd1598859fd#readProxyContract)
- Audit report(s):
    - [Kelp DAO audits](https://kelp.gitbook.io/kelp/audits)

## Context
The High Growth Vault is designed to maximize your returns through DeFi on Ethereum. Assets are deposited in AAVE, Compound, Usual, and Elixir among other strategies to generate top-tier rewards. Upon depositing, the vault issues a liquid token, hgETH, representing a claim on the deposited assets. This ERC-20 token is a tradable and usable representation of your staked assets within the vault. The deposited assets are then moved to different DeFi opportunities.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [ ] Tests based on the [balancer-v3-monorepo](https://github.com/balancer/balancer-v3-monorepo/tree/main/pkg/vault/test/foundry/fork) pass for the given ERC4626 vaults, which can be found [here](https://github.com/balancer/balancer-v3-erc4626-tests/tree/main/test).
    - note: The failing tests can be found [here](https://github.com/balancer/balancer-v3-erc4626-tests/pull/3) with the custom error signature: WithdrawalRequestRequired: 75ed2e3e
- [ ] The required Vault implements the required operational ERC4626 Interface

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [x] The ERC4626 Vault is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address). 
    - admin address: [ethereum:0xFD96F6854bc73aeBc6dc6E61A372926186010a91](https://etherscan.io/address/0xFD96F6854bc73aeBc6dc6E61A372926186010a91)
    - admin type: multisig
        - multisig threshold/signers: 3/5

### Buffer blocklist
- [x] The reviewed ERC4626 Vault should be added to the blocked buffers metadata list. 

### Common Manipulation Vectors
- [x] The ERC4626 Vault is susceptible to donation attacks.
    Part of the rate calculation depends on the following implementation snippet.
    ```solidity
        function _getTotalAssets() internal view virtual override returns (uint256) {
        // [Liquidity] + [the delta of all ACTIVE loans managed by this pool]
        return globalLoansAmount + _underlyingAsset.balanceOf(address(this));
    }
    ````
    Where the Vault's `asset`'s balance is used.


## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: ALLOWED

This ERC4626 Vault token should work well with Balancer pools in the "token only" capacity. Meaning the usage of buffer functionality should be restricted. 
