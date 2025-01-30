# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @franzns
- Checked by: 
- Deployed at:
    - [sonic:0xfbcee1fcaa2db776b4b575a8da3e8c93ea5eef53](https://sonicscan.org/address/0xfbcee1fcaa2db776b4b575a8da3e8c93ea5eef53#code)
- Audits:
    - [Origin Eth](https://github.com/beefyfinance/beefy-audits/blob/master/2023-08-03-Beefy-Zellic-4626-Wrapper-Audit.pdf)


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
    - Both [woS](https://sonicscan.org/address/0x9F0dF7799f6FDAd409300080cfF680f5A23df4b1) and [oS](https://sonicscan.org/address/0xb1e25689D55734FD3ffFc939c4C3Eb52DFf8A794) are upgradable:
        - admin address: [sonic:0x31a91336414d3B955E494E7d485a6B06b55FC8fB](https://sonicscan.org/address/0x31a91336414d3B955E494E7d485a6B06b55FC8fB)
        - admin type: Timelock (24 hrs) / 0xaddea7933db7d83855786eb43a238111c69b00b6
        - Timelock proposer/executor: 5/8 Multisig [sonic:0xaddea7933db7d83855786eb43a238111c69b00b6](https://sonicscan.org/address/0xaddea7933db7d83855786eb43a238111c69b00b6)


### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks.
    - comment: The ERC4626 wrapper calls the vaults balance for totalAssets() which is part of the `totalAssets` used in the `converToAssets` call and therefore in the `getRate` calculation.

    ```solidity
    /** @dev See {IERC4262-totalAssets} */
    function totalAssets() public view virtual override returns (uint256) {
        return _asset.balanceOf(address(this));
    }
    ```

    The underlying balance can be inflated by donating underlying assets to the vault.

## Additional Finding


## Conclusion
**Summary judgment: SAFE**

Overall this Rate Provider should work well in pool operations with Balancer pools. 
