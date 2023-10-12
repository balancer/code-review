# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @rabmarut
- Checked by: @baileyspraggins
- Deployed at:
    - [gnosis:0x89C80A4540A00b5270347E02e2E144c71da2EceD](https://gnosisscan.io/address/0x89c80a4540a00b5270347e02e2e144c71da2eced#code)
- Audit report(s):
    - [ChainSecurity - Savings Dai](https://github.com/makerdao/sdai/blob/0377fa3a3e8af846f7511fb7cfe18c2e276e9dfa/audits/ChainSecurity_Oazo_Apps_Limited_Savings_Dai_audit_1.pdf)

## Context
Savings DAI (`sDAI`) is a yield-bearing token representing `DAI` deposited in Maker's DAI Saving Rate (DSR) module. This review covers the Gnosis Chain deployment, so it uses `WXDAI` (wrapped xDAI) deposits and accrues yield via a bridge to Ethereum mainnet.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.
    - WARNING: This Rate Provider targets an ERC-4626 Vault whose underlying `asset` has 18 decimals. It will not work with any ERC-4626 Vault whose underlying `asset` has more or fewer than 18 decimals.
    - This particular deployment uses `WXDAI`, which has 18 decimals, so it is safe in its deployed configuration. The warning applies only to reuse of this source code with other tokens.

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
- [x] The Rate Provider is susceptible to donation attacks.

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

- N/A

## Conclusion
**Summary judgment: SAFE**

This is a minimal ERC-4626 Rate Provider that computes the exchange rate using a ratio of deposited assets to minted shares. There are no privileges, upgradeability, or oracles anywhere in the system.

There is a potential risk of donation attacks, but these only impact downstream integrations (not Balancer directly). Integrators should be wary of the underlying token's manipulability via donations, which will propagate into the BPT price itself, and assess the unique risk this poses to their respective protocols.

WARNING: This Rate Provider targets an ERC-4626 Vault whose underlying `asset` has 18 decimals. It will not work with any ERC-4626 Vault whose underlying `asset` has more or fewer than 18 decimals.
