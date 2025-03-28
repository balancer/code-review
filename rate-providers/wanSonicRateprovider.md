# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @franzns
- Checked by: @danielmkm
- Deployed at:
    - [sonic:0x2d087c0999223997b77cc33be5e7e8ec79396cea](https://sonicscan.org/address/0x2d087c0999223997b77cc33be5e7e8ec79396cea#code)
- Audits:
    - [Fork of Origin Eth](https://docs.originprotocol.com/security-and-risk/audits) (same code as Origin S)
    - [Angles Audit](https://angles.gitbook.io/angles/audits)


## Context
 The rate provider was created using the ERC4626 Rateprovider factory which calls convertToAssets on the wOS ERC4626 contract to expose the rate. The rate of the ERC4626 is calculated by `(supply == 0) ? (shares * 10**_asset.decimals()) / 10**decimals() : (shares * totalAssets()) / supply`.

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
    - Both [wanS](https://sonicscan.org/address/0xfA85Fe5A8F5560e9039C04f2b0a90dE1415aBD70) and [anS](https://sonicscan.org/address/0x0C4E186Eae8aCAA7F7de1315D5AD174BE39Ec987) are upgradable:
        - admin address: [sonic:0xE14e14CC32b939957742d7586E9DEBC9631282e7](https://sonicscan.org/address/0xE14e14CC32b939957742d7586E9DEBC9631282e7)
        - admin type: Timelock (48 hrs) / 7e431e5ff0ee4cad26347c0674afa9c30502b535
        - Timelock proposer/executor: 3/4 Multisig [sonic:7e431e5ff0ee4cad26347c0674afa9c30502b535](https://sonicscan.org/address/7e431e5ff0ee4cad26347c0674afa9c30502b535)



### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks.
    - comment: The ERC4626 uses `balancerOf(address(this))` to calculate `totalAssets()` which is used in the `converToAssets` call and therefore in the `getRate` calculation.

    ```solidity
    /** @dev See {IERC4626-totalAssets}. */
    function totalAssets() public view virtual override returns (uint256) {
        return _asset.balanceOf(address(this));
    }
    ```

    The underlying balance can be inflated by donating underlying assets to the wrapped asset.

## Additional Finding


## Conclusion
**Summary judgment: SAFE**

Overall this Rate Provider should work well in pool operations with Balancer pools. 
