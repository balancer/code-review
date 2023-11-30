# Rate Provider: `PlsRdntTokenV2`

## Details
- Reviewed by: @rabmarut
- Checked by: @baileyspraggins
- Deployed at:
    - [arbitrum:0x6dbF2155B0636cb3fD5359FCcEFB8a2c02B6cb51](https://arbiscan.io/address/0x6dbf2155b0636cb3fd5359fccefb8a2c02b6cb51#readProxyContract)
- Audit report(s):
    - [PlvGLP audit by SourceHat](https://sourcehat.com/audits/PlvGLP/)

## Context
Users may deposit `RDNT` into Plutus, which is locked forever as `RDNT dLP`. Plutus returns a tokenized version of the asset, `plsRDNT`.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [x] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).
    - implementation reviewed: [arbitrum:0xF7eB1efc5A3fD02399aC82aa983962280324F9b7](https://arbiscan.io/address/0xf7eb1efc5a3fd02399ac82aa983962280324f9b7#code)
    - admin address: [arbitrum:0xa5c1c5a67Ba16430547FEA9D608Ef81119bE1876](https://arbiscan.io/address/0xa5c1c5a67Ba16430547FEA9D608Ef81119bE1876#readProxyContract)
    - admin type: multisig
        - multisig threshold/signers: 3/6
        - multisig timelock? NO
        - trustworthy signers? NO

- [ ] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price).

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks.

This is a standard ERC-4626 implementation which is susceptible to donation attacks via live `balanceOf()` queries:

```solidity
// Context: PlsRdntTokenV2
/**
 * @return value of plsRDNT in terms of dLP
 */
function getRate() external view returns (uint) {
    // @audit See `convertToAssets()` implementation below.
    return convertToAssets(1e18);
}

// Context: ERC4626Upgradeable
/** @dev See {IERC4626-convertToAssets}. */
function convertToAssets(uint256 shares) public view virtual returns (uint256) {
    // @audit See `_convertToAssets()` implemenation below.
    return _convertToAssets(shares, Math.Rounding.Floor);
}

/**
 * @dev Internal conversion function (from shares to assets) with support for rounding direction.
 */
function _convertToAssets(uint256 shares, Math.Rounding rounding) internal view virtual returns (uint256) {
    // @audit See `totalAssets()` implementation below.
    return shares.mulDiv(totalAssets() + 1, totalSupply() + 10 ** _decimalsOffset(), rounding);
}

/** @dev See {IERC4626-totalAssets}. */
function totalAssets() public view virtual returns (uint256) {
    ERC4626Storage storage $ = _getERC4626Storage();
    // @audit Donations are included in this balance query.
    return $._asset.balanceOf(address(this));
}
```

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

- N/A

## Conclusion
**Summary judgment: SAFE**

This is a minimal ERC-4626 Rate Provider that computes the exchange rate using a ratio of deposited assets to minted shares. It is upgradeable by a 3/6 Gnosis Safe multisig.

There is a potential risk of donation attacks, but these only impact downstream integrations (not Balancer directly). Integrators should be wary of the underlying token's manipulability via donations, which will propagate into the BPT price itself, and assess the unique risk this poses to their respective protocols.
