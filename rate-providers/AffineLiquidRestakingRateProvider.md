# Rate Provider: `UltraLRT`

## Details
- Reviewed by: @mkflow27
- Checked by: @danielmkm
- Deployed at:
    - [ethereum:0x47657094e3AF11c47d5eF4D3598A1536B394EEc4](https://etherscan.io/address/0x47657094e3AF11c47d5eF4D3598A1536B394EEc4#readProxyContract)
    - [ethereum:0x0D53bc2BA508dFdf47084d511F13Bb2eb3f8317B](https://etherscan.io/address/0x0D53bc2BA508dFdf47084d511F13Bb2eb3f8317B)
- Audit report(s):
    - [Affine LRT audits](https://docs.affinedefi.com/security/audit-reports)

## Context
Affine ultraLRTs are Symbiotic and Eigenlayer Liquid Restaking Tokens (LRTs). Affine UltraLRT vaults expose an exchange rate of affine vault share <-> affine vault asset via a rate provider.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [x] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).
    #### Affine ultraETH (ultraETH)
    - admin address: [ethereum:0x4B21438ffff0f0B938aD64cD44B8c6ebB78ba56e](https://etherscan.io/address/0x4B21438ffff0f0B938aD64cD44B8c6ebB78ba56e)
    - admin type: multisig 
        - multisig threshold/signers: 2/4
        - multisig timelock? YES: 1 second
        - comment: The multisig is the `PROPOSER` role of the TimeLockController. It's address is [ethereum:0x67Ec3Bb25a5DB6eB7Ba74f6C0b2bA193A3983FB8](https://etherscan.io/address/0x67Ec3Bb25a5DB6eB7Ba74f6C0b2bA193A3983FB8#readProxyContract)
    #### Affine ultraETHs (ultraETHs)
    - admin address: [ethereum:0x4B21438ffff0f0B938aD64cD44B8c6ebB78ba56e](https://etherscan.io/address/0x4B21438ffff0f0B938aD64cD44B8c6ebB78ba56e)
    - admin type: multisig 
        - multisig threshold/signers: 2/4
        - multisig timelock? YES: 1 second
        - comment: The multisig is the `PROPOSER` role of the TimeLockController. It's address is [ethereum:0x67Ec3Bb25a5DB6eB7Ba74f6C0b2bA193A3983FB8](https://etherscan.io/address/0x67Ec3Bb25a5DB6eB7Ba74f6C0b2bA193A3983FB8#readProxyContract)

- [ ] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price).

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks.
    - comment: The rate can be influenced by donating to the vault as the vault's total assets are measured via
    ```solidity
    // 
    function vaultAssets() public view returns (uint256) {
        return IERC20MetadataUpgradeable(asset()).balanceOf(address(this));
    }
    ```
    which is part of the `totalAssets` used in the `getRate` calculation.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

This rate Provider should work well with Balancer pools. Upgradeability of the system is guarded behind a multisig with a timelock of 1 second. The suggestion is to increase the timelock's `minDelay` to a higher duration like 24 hours.
