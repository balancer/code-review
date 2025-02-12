# ERC4626 Vault: `SavingsXDai`

## Details
- Reviewed by: @mkflow27
- Checked by: @danielmkm
- Deployed at:
    - [gnosis:0xaf204776c7245bF4147c2612BF6e5972Ee483701](https://gnosisscan.io/address/0xaf204776c7245bf4147c2612bf6e5972ee483701)
- Audit report(s):
    - [ChainSecurity - Savings Dai](https://github.com/makerdao/sdai/blob/0377fa3a3e8af846f7511fb7cfe18c2e276e9dfa/audits/ChainSecurity_Oazo_Apps_Limited_Savings_Dai_audit_1.pdf)

## Context
Savings DAI (`sDAI`) is a yield-bearing token representing `DAI` deposited in Maker's DAI Saving Rate (DSR) module. This review covers the Gnosis Chain deployment, so it uses `WXDAI` (wrapped xDAI) deposits and accrues yield via a bridge to Ethereum mainnet.
## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Tests based on the [balancer-v3-monorepo](https://github.com/balancer/balancer-v3-monorepo/tree/main/pkg/vault/test/foundry/fork) pass for the given ERC4626 vaults, which can be found [here](https://github.com/balancer/balancer-v3-erc4626-tests/tree/main/test).
- [x] The required Vault implements the required operational ERC4626 Interface

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [] The ERC4626 Vault is upgradeable. 

### Compatibility 
- [x] The reviewed ERC4626 Vault shall be used for swaps. 
- [x] The reviewed ERC4626 Vault shall be used to add and remove liquidity to pools using wrapped tokens. 
- [ ] The reviewed ERC4626 Vault shall be used to add and remove liquidity to pools using underlying tokens.

### Common Manipulation Vectors
- [x] The ERC4626 Vault is susceptible to donation attacks.

The Ethereum mainnet deployment of `sDAI` is not susceptible to donation attacks because it utilizes on-chain pricing logic from the DSR (DAI Savings Rate) module. However, the Gnosis Chain deployment is indeed susceptible to donation attacks because it utilizes a standard ERC-4626 implementation that calls `_asset.balanceOf(address(this))`.

```solidity
/** @dev See {IERC4626-totalAssets}. */
function totalAssets() public view virtual returns (uint256) {
    return _asset.balanceOf(address(this));
}

/** @dev See {IERC4626-convertToShares}. */
function convertToShares(uint256 assets) public view virtual returns (uint256) {
    return _convertToShares(assets, Math.Rounding.Floor);
}

/** @dev See {IERC4626-convertToAssets}. */
function convertToAssets(uint256 shares) public view virtual returns (uint256) {
    return _convertToAssets(shares, Math.Rounding.Floor);
}
```

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: USABLE**

The outlined ERC4626 Vaults should work well with Balancer pools.The Vault implements the required interfaces. Fork tests passing as can be seen [here](https://github.com/balancer/balancer-v3-erc4626-tests/blob/main/test/gnosis/ERC4626GnosisSDai.t.sol). Users should take into account the developers comments as part of the test-pr which state
> sDAI requires a special ERC4626 test, due to the token unusual behavior: every deposit devalues a bit the wrapped tokens, so a user may not be able to withdraw the amount that it deposited, only part of it. When interacting with boosted pools, this behavior is ok, but it's a warning when initializing a buffer or adding liquidity to a buffer: that buffer may leak value.
