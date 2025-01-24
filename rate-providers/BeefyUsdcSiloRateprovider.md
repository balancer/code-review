# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @franzns
- Checked by: @danielmkm
- Deployed at:
    - [sonic:0x5fded3206608d3f33175a8865576431906cdb43b](https://sonicscan.org/address/0x5fded3206608d3f33175a8865576431906cdb43b#code)
- Audits:
    - [4626 wrapper audit](https://github.com/beefyfinance/beefy-audits/blob/master/2023-08-03-Beefy-Zellic-4626-Wrapper-Audit.pdf)


## Context
The ERC4626 Rate Provider fetches the rate of the Beefy vault for USDC deposited into Silo v2. The rate provider was created using the ERC4626 Rateprovider factory which calls convertToAssets on the ERC4626 to expose the rate. The rate of the ERC4626 is calculated by `shares.mulDiv(totalAssets() + 1, totalSupply() + 10 ** _decimalsOffset(), rounding)`.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [ ] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).


### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks.
    - comment: The rate can be influenced by donating to the vault as the vault's total assets are measured via
    ```solidity
    // 
    function totalAssets() public view virtual override returns (uint256) {
        return _asset.balanceOf(address(this));
    }
    ```
    which is part of the `totalAssets` used in the `getRate` calculation.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.


## Conclusion
**Summary judgment: SAFE**

Overall this Rate Provider should work well in pool operations with Balancer pools. 
