# Rate Provider: `RateProvider` (wFRK)

## Details
- Reviewed by: @rabmarut
- Checked by: @baileyspraggins
- Deployed at:
    - [polygon:0x76D8B79Fb9afD4dA89913458C90B6C09676628E2](https://polygonscan.com/address/0x76D8B79Fb9afD4dA89913458C90B6C09676628E2#code)
- Audit report(s):
    - [Kuma Protocol audits](https://docs.kuma.bond/kuma-protocol/ressources/security-and-audits)

## Context
`FRK` is a KUMA interest-bearing token backed by KUMA NFTs, themselves backed by French 360 days T-Bills. The majority of DeFi protocols do not support rebasing tokens, so an ERC-4626 wrapper called `wFRK` has been deployed. This Rate Provider covers the exchange rate between the wrapped `wFRK` and the underlying `FRK`.

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
    - upgradeable component: `KIBToken`
        - entry point: [polygon:0x2cb7285733A30BB08303B917A7a519C88146C6Eb](https://polygonscan.com/address/0x2cb7285733A30BB08303B917A7a519C88146C6Eb#readProxyContract)
        - implementation reviewed: [polygon:0xEdb20e3cD8C7c149Ea57fe470fb9685c4b1B8703](https://polygonscan.com/address/0xedb20e3cd8c7c149ea57fe470fb9685c4b1b8703#code)
        - admin: any account possessing the `KUMA_MANAGER_ROLE` via the `KUMAAccessController` contract.
            - Currently, the `KUMA_MANAGER_ROLE` belongs only to one account: a 4/7 multisig at [polygon:0x1A1A402746FBe8bcFE0f7992AE27c4eD81A70156](https://polygonscan.com/address/0x1a1a402746fbe8bcfe0f7992ae27c4ed81a70156#readProxyContract).
            - The `KUMA_MANAGER_ROLE` can be granted or revoked by any account possessing the `DEFAULT_ADMIN_ROLE`.
                - Currently, the `DEFAULT_ADMIN_ROLE` belongs only to one account: the same 4/7 multisig.
                - The `DEFAULT_ADMIN_ROLE` can be granted or revoked by any account possessing the `DEFAULT_ADMIN_ROLE`.
            - The `KUMAAccessController` contract is defined by the `KUMAAddressProvider` contract, which is also upgradeable.
    - upgradeable component: `KUMAAddressProvider`
        - entry point: [polygon:0x4dBA794671B891D2Ee2E3E7eA9E993026219941C](https://polygonscan.com/address/0x4dBA794671B891D2Ee2E3E7eA9E993026219941C#readProxyContract)
        - implementation reviewed: [polygon:0x7714fcFe0d9C4726F6C1E3B1275C2951B9B54F65](https://polygonscan.com/address/0x7714fcfe0d9c4726f6c1e3b1275c2951b9b54f65#code)
        - admin: any account possessing the `KUMA_MANAGER_ROLE` via the `KUMAAccessController` contract.
            - The configuration of roles is described above.
    - upgradeable component: `KUMASwap`
        - entry point: [polygon:0x0aC2E3Cd1E9b2DA91972d2363e76B5A0cE514e73](https://polygonscan.com/address/0x0aC2E3Cd1E9b2DA91972d2363e76B5A0cE514e73#readProxyContract)
        - implementation reviewed: [polygon:0x41d4D26F70951a2134DC862ea6248fFBE2a516bb](https://polygonscan.com/address/0x41d4d26f70951a2134dc862ea6248ffbe2a516bb#code)
        - admin: any account possessing the `KUMA_MANAGER_ROLE` via the `KUMAAccessController` contract.
            - The configuration of roles is described above.
    - upgradeable component: `MCAGRateFeed`
        - entry point: [polygon:0x173EB1d561CcEFd8e83a3741483a8Bd76dF827Ef](https://polygonscan.com/address/0x173EB1d561CcEFd8e83a3741483a8Bd76dF827Ef#readProxyContract)
        - implementation reviewed: [polygon:0x72e923047245D2B58D87f311a2b5b487620EE60A](https://polygonscan.com/address/0x72e923047245d2b58d87f311a2b5b487620ee60a#code)
        - admin: any account possessing the `KUMA_MANAGER_ROLE` via the `KUMAAccessController` contract.
            - The configuration of roles is described above.

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source: the `wFRK` price depends on the rebase rate of `FRK`, which depends on bond rates provided by bond oracles.
        - NOTE: The bond system is complex and outside the scope of this review. Users holding `wFRK` in Balancer pools implicitly trust the underlying `FRK` and its bond logic. Neither the wrapper nor the Rate Provider introduces any additional off-chain risk. To enable independent verification, we will do our best to highlight the most relevant source code below.

```solidity
////////////////////////////////////////
// Context: RateProvider
////////////////////////////////////////
/**
 * @return Value of token in terms of underlying asset in 18 decimal
 */
function getRate() external view override returns (uint256) {
    return token.convertToAssets(_ONE);
}

////////////////////////////////////////
// Context: ERC4626
////////////////////////////////////////
/**
 * @dev See {IERC4626-convertToAssets}.
 */
function convertToAssets(uint256 shares) public view virtual override returns (uint256) {
    // @audit See `_convertToAssets()` implemenation below.
    return _convertToAssets(shares, Math.Rounding.Down);
}

/**
 * @dev Internal conversion function (from shares to assets) with support for rounding direction.
 */
function _convertToAssets(uint256 shares, Math.Rounding rounding) internal view virtual returns (uint256) {
    uint256 supply = totalSupply();
    // @audit See `totalAssets()` implementation below.
    return (supply == 0) ? _initialConvertToAssets(shares, rounding) : shares.mulDiv(totalAssets(), supply, rounding);
}

/**
 * @dev See {IERC4626-totalAssets}.
 */
function totalAssets() public view virtual override returns (uint256) {
    // @audit See `balanceOf()` implementation below.
    return _asset.balanceOf(address(this));
}

////////////////////////////////////////
// Context: KIBToken
////////////////////////////////////////
/**
 * @dev See {ERC20-balanceOf}
 * @dev Calculates the rewards at the last epoch
 * @param account The address to query the balance of
 * @return The amount of KIBT owned by account, formatted as a uint256 WAD
 */
function balanceOf(address account) public view override(ERC20Upgradeable, IERC20Upgradeable) returns (uint256) {
    // @audit See `_calculatePreviousEpochCumulativeYield()` implementation below.
    return WadRayMath.rayToWad(_baseBalances[account].rayMul(_calculatePreviousEpochCumulativeYield()));
}

/**
 * @notice Helper function to calculate previousEpochCumulativeYield at call timestamp
 * @return Updated previous epoch cumulative yield, in a uint256 RAY
 */
function _calculatePreviousEpochCumulativeYield() private view returns (uint256) {
    uint256 previousEpochTimestamp = _getPreviousEpochTimestamp();
    if (previousEpochTimestamp < _lastRefresh) {
        return _previousEpochCumulativeYield;
    }
    uint256 timeElapsedToEpoch = previousEpochTimestamp - _lastRefresh;
    // @audit See `_yield` updates below.
    return _yield.rayPow(timeElapsedToEpoch).rayMul(_cumulativeYield);
}

// @audit This is called on every mint and burn, and can also be invoked directly via a public entrypoint.
/**
 * @notice Updates _yield based on the minimum bond coupon of the KUMASwap and the oracle reference rate
 */
function _refreshYield() private {
    IKUMASwap KUMASwap = IKUMASwap(_KUMAAddressProvider.getKUMASwap(_riskCategory));
    uint256 yield_ = _yield;
    if (KUMASwap.isExpired() || KUMASwap.isDeprecated()) {
        _yield = MIN_YIELD;
        emit YieldUpdated(yield_, MIN_YIELD);
        return;
    }

    // @audit One potential source of `_yield`: the `KumaSwap` contract.
    uint256 lowestYield = KUMASwap.getMinCoupon();

    // @audit Another potential source of `_yield`: the `MCAGRateFeed` contract.
    try IMCAGRateFeed(_KUMAAddressProvider.getRateFeed()).getRate(_riskCategory) returns (uint256 rate) {
        if (rate < lowestYield) {
            lowestYield = rate;
        }
    } catch {}

    if (lowestYield != yield_) {
        // @audit `_yield` is updated here: the source is either `KUMASwap#getMinCoupon()` or `MCAGRateFeed#getRate()`.
        _yield = lowestYield;
        emit YieldUpdated(yield_, lowestYield);
    }
}

////////////////////////////////////////
// Context: KUMASwap
////////////////////////////////////////
/**
 * @return Lowest coupon of bonds currently held in reserve by this KUMASwap contract
 */
function getMinCoupon() external view returns (uint256) {
    // @audit This is set below.
    return _minCoupon;
}

/**
 * @notice _update the minimum coupon of bonds in reserve after a bond has been bought from this contract
 * @return minCoupon Lowest coupon of bonds in reserve, in RAY
 */
function _updateMinCoupon() private returns (uint256) {
    uint256 currentMinCoupon = _minCoupon;

    if (_coupons.length() == 0) {
        _minCoupon = MIN_ALLOWED_COUPON;
        emit MinCouponUpdated(currentMinCoupon, MIN_ALLOWED_COUPON);
        return MIN_ALLOWED_COUPON;
    }

    if (_couponInventory[currentMinCoupon] != 0) {
        return currentMinCoupon;
    }

    uint256 minCoupon = _coupons.at(0);

    uint256 couponsLength = _coupons.length();

    // @audit This iterates through all coupons to find the minimum. Coupons are created by bond sellers.
    for (uint256 i = 1; i < couponsLength;) {
        uint256 coupon = _coupons.at(i);

        if (coupon < minCoupon) {
            minCoupon = coupon;
        }

        unchecked {
            ++i;
        }
    }

    _minCoupon = minCoupon;

    emit MinCouponUpdated(currentMinCoupon, minCoupon);

    return minCoupon;
}

////////////////////////////////////////
// Context: MCAGRateFeed
////////////////////////////////////////
/**
 * @dev The riskCategory hash is computed with keccack256(abi.encode(currency, issuer, term))
 * @param riskCategory Hash of the risk category of the rate to retrieve data for
 * @return rate Central bank coupon of the most recently issued bond in 27 decimals, formatted as a per-second cumulative rate
 */
function getRate(bytes32 riskCategory) external view returns (uint256) {
    // @audit Oracles are configured below by accounts possessing `KUMA_MANAGER_ROLE`.
    MCAGAggregatorInterface oracle = _oracles[riskCategory];
    (, int256 answer,, uint256 updatedAt,) = oracle.latestRoundData();

    if (block.timestamp - updatedAt > _stalenessThreshold) {
        revert Errors.ORACLE_ANSWER_IS_STALE();
    }

    if (answer < 0) {
        return _MIN_RATE_COUPON;
    }

    uint256 rate = uint256(answer);
    uint8 oracleDecimal = oracle.decimals();

    if (_DECIMALS < oracleDecimal) {
        rate = uint256(answer) / (10 ** (oracleDecimal - _DECIMALS));
    } else if (_DECIMALS > oracleDecimal) {
        rate = uint256(answer) * 10 ** (_DECIMALS - oracleDecimal);
    }

    if (rate < _MIN_RATE_COUPON) {
        return _MIN_RATE_COUPON;
    }

    return rate;
}

/**
 * @notice Sets an MCAGAggregator for a specific risk category
 * @dev This function can only be called by the MCAG manager
 * @param currency Currency of the bond in bytes4 (e.g. 0x555344 for USD); cannot be 0x
 * @param issuer Issuer example (e.g. 0x5553 for USD); cannot be 0x
 * @param term Lifetime of the bond in seconds (e.g. 31449600 for a 52 week bond); cannot be 0
 * @param oracle MCAGAggregator address to set as the oracle; cannot be 0x
 */
function setOracle(bytes4 currency, bytes32 issuer, uint32 term, MCAGAggregatorInterface oracle)
    external
    onlyManager
{
    if (currency == bytes4(0) || issuer == bytes32(0) || term == 0) {
        revert Errors.WRONG_RISK_CATEGORY();
    }
    if (address(oracle) == address(0)) {
        revert Errors.CANNOT_SET_TO_ADDRESS_ZERO();
    }

    bytes32 riskCategory = keccak256(abi.encode(currency, issuer, term));
    _oracles[riskCategory] = oracle;

    emit OracleSet(address(oracle), currency, issuer, term);
}
```

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks.

This is a standard ERC-4626 implementation which is susceptible to donation attacks via live `balanceOf()` queries:

```solidity
////////////////////////////////////////
// Context: RateProvider
////////////////////////////////////////
/**
 * @return Value of token in terms of underlying asset in 18 decimal
 */
function getRate() external view override returns (uint256) {
    return token.convertToAssets(_ONE);
}

////////////////////////////////////////
// Context: ERC4626
////////////////////////////////////////
/**
 * @dev See {IERC4626-convertToAssets}.
 */
function convertToAssets(uint256 shares) public view virtual override returns (uint256) {
    // @audit See `_convertToAssets()` implemenation below.
    return _convertToAssets(shares, Math.Rounding.Down);
}

/**
 * @dev Internal conversion function (from shares to assets) with support for rounding direction.
 */
function _convertToAssets(uint256 shares, Math.Rounding rounding) internal view virtual returns (uint256) {
    uint256 supply = totalSupply();
    // @audit See `totalAssets()` implementation below.
    return (supply == 0) ? _initialConvertToAssets(shares, rounding) : shares.mulDiv(totalAssets(), supply, rounding);
}

/**
 * @dev See {IERC4626-totalAssets}.
 */
function totalAssets() public view virtual override returns (uint256) {
    // @audit Donations are included in this balance query.
    return _asset.balanceOf(address(this));
}
```

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

- N/A

## Conclusion
**Summary judgment: SAFE**

This is a minimal ERC-4626 Rate Provider that computes the exchange rate using a ratio of deposited assets to minted shares. The Rate Provider and ERC-4626 Vault are not upgradeable, but the underlying rebasing token (`FRK`) is upgradeable by a 4/7 multisig.

There is a potential risk of donation attacks, but these only impact downstream integrations (not Balancer directly). Integrators should be wary of the underlying token's manipulability via donations, which will propagate into the BPT price itself, and assess the unique risk this poses to their respective protocols.

Parts of the underlying `FRK` system have not been thoroughly vetted, but the `wFRK` wrapper and Rate Provider do not introduce any additional price complexity. Before investing your funds in any DeFi protocol, please consult its source code, documentation, historical audits, and be aware of the risks when interacting with upgradable smart contracts.
