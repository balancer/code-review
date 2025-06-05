# Rate Provider: `RingsStakedWrapperRateProvider`

## Details
- Reviewed by: @franzns
- Checked by: @danielmkm
- Deployed at:
    - [sonic:0xadc94c7b7b333e3e2de317edcc4173a6ffa5b20f](https://sonicscan.org/address/0xadc94c7b7b333e3e2de317edcc4173a6ffa5b20f#code)
    - [sonic:0xf2a6aa2b5285b5381ccd5a81bc3ea27af1b27ffa](https://sonicscan.org/address/0xf2a6aa2b5285b5381ccd5a81bc3ea27af1b27ffa#code)
- Audits:
    - [Veda Vaults audits](https://github.com/Se7en-Seas/boring-vault/tree/main/audit)


## Context
Staked Rings asset leverage Veda vaults for their staking. The wrapped version of these vaults accrue value over time and are therefore yield bearing. They expose a ERC4626 interface and can be used with the ERC4626 rate provider.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

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
    - comment: In the ERC4626 wrapper, `totalAssets` is used in the `converToAssets` call and therefore in the `getRate` calculation which uses `balanceOf()`.

    ```solidity
    /// @dev Returns the total amount of the underlying asset managed by the Vault.
    ///
    /// - SHOULD include any compounding that occurs from the yield.
    /// - MUST be inclusive of any fees that are charged against assets in the Vault.
    /// - MUST NOT revert.
    function totalAssets() public view virtual returns (uint256 assets) {
        assets = SafeTransferLib.balanceOf(asset(), address(this));
    }
    ```

    The underlying balance can be inflated by donating underlying assets to the vault.

## Conclusion
**Summary judgment: SAFE**

The Rate Providers should work well with Balancer pools. The underlying contracts have been audited.