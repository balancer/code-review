# Rate Provider: `InstETHRateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @danielmkm
- Deployed at:
    - [ethereum:0x343281Bb5029C4b698fE736D800115ac64D5De39](https://etherscan.io/address/0x343281bb5029c4b698fe736d800115ac64d5de39#code)
    - [ethereum:0x8bC73134A736437da780570308d3b37b67174ddb](https://etherscan.io/address/0x8bC73134A736437da780570308d3b37b67174ddb#readContract)
- Audit report(s):
    - [InceptionLRT](https://docs.inceptionlrt.com/security/audit-reports)

  

## Context
The RateProvider reports the exchangeRate of stETH - InstETH based on the protocol functionality outlined by the [Veridise audit](https://docs.inceptionlrt.com/security/audit-reports) below.

> The vault
contract acts as a "pool" of assets, where users can deposit a specific token ("asset") into the vault.
In turn, the vault will deposit those assets into a specific EigenLayer strategy contract and then
grant vault-specific ERC20 tokens ("Inception tokens") to the user. Users may exchange their
Inception tokens with the vault to queue a withdrawal. A special account called the "operator"
can then send a withdrawal request to the EigenLayer smart contracts. Once a withdrawal has
been processed, users can then "redeem" their withdrawal to obtain assets from the vault.

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
    - [ethereum:0x343281Bb5029C4b698fE736D800115ac64D5De39](https://etherscan.io/address/0x343281Bb5029C4b698fE736D800115ac64D5De39#code)
        - upgradeable component: `InceptionVault` ([ethereum:0x814CC6B8fd2555845541FB843f37418b05977d8d](https://etherscan.io/address/0x814CC6B8fd2555845541FB843f37418b05977d8d))
        - admin address: [ethereum:0x8e6C8799B542E507bfDDCA1a424867e885D96e79](https://etherscan.io/address/0x8e6C8799B542E507bfDDCA1a424867e885D96e79#readProxyContract)
        - comment: The admin address has the `EXECUTOR`role on the [`TimeLockController`](https://etherscan.io/address/0x650bD9Dee50E3eE15cbb49749ff6ABcf55A8FB1e#code) which can upgrade the `InceptionVault`
        - admin type: multisig
            - multisig threshold/signers: 3/5
            - multisig timelock? YES: 24 hours
        - upgradeable component: `InceptionToken` ([ethereum:0x7FA768E035F956c41d6aeaa3Bd857e7E5141CAd5](https://etherscan.io/address/0x7FA768E035F956c41d6aeaa3Bd857e7E5141CAd5#readProxyContract))
        - admin address: [ethereum:0x8e6C8799B542E507bfDDCA1a424867e885D96e79](https://etherscan.io/address/0x8e6C8799B542E507bfDDCA1a424867e885D96e79#readProxyContract)
        - comment: The admin address has the `EXECUTOR` role on the [`TimeLockController`](https://etherscan.io/address/0x650bD9Dee50E3eE15cbb49749ff6ABcf55A8FB1e#code) which can upgrade the `InceptionVault`
        - admin type: multisig
            - multisig threshold/signers: 3/5
            - multisig timelock? YES: 24 hours

    - [ethereum:0x8bC73134A736437da780570308d3b37b67174ddb](https://etherscan.io/address/0x8bC73134A736437da780570308d3b37b67174ddb#readContract)
        - upgradeable component: `InVault_E1` ([ethereum:0x36B429439AB227fAB170A4dFb3321741c8815e55](https://etherscan.io/address/0x36B429439AB227fAB170A4dFb3321741c8815e55#readProxyContract))
        - admin address: [ethereum:0x8e6C8799B542E507bfDDCA1a424867e885D96e79](https://etherscan.io/address/0x8e6C8799B542E507bfDDCA1a424867e885D96e79)
        - comment: The admin address has the `EXECUTOR`role on the [`TimeLockController`]() which can upgrade the `InceptionVault`
        - admin type: multisig
            - multisig threshold/signers: 3/5
            - multisig timelock? YES: 24 hours
        - upgradeable component: `InceptionToken` ([ethereum:0xfa2629B9cF3998D52726994E0FcdB750224D8B9D](https://etherscan.io/address/0xfa2629B9cF3998D52726994E0FcdB750224D8B9D#readProxyContract))
        - admin address: [ethereum:0x8e6C8799B542E507bfDDCA1a424867e885D96e79](https://etherscan.io/address/0x8e6C8799B542E507bfDDCA1a424867e885D96e79)
        - comment: The admin address has the `EXECUTOR`role on the [`TimeLockController`]() which can upgrade the `InceptionVault`
        - admin type: multisig
            - multisig threshold/signers: 3/5
            - multisig timelock? YES: 24 hours
  
### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks.

The pricing calculations take into account the evaluation of a `ratio()`. Part of this calculation reads the `totalAssets()`
```solidity
//@audit relevant part of the `ratio()` calculation uses `getTotalDeposited()`
function getTotalDeposited() public view returns (uint256) {
    return
        strategy.userUnderlyingView(address(this)) +
        totalAssets() +
        _pendingWithdrawalAmount;
}

// and `totalAssets()` is implemented as
/// @dev returns the balance of iVault in the asset
function totalAssets() public view override returns (uint256) {
    return _asset.balanceOf(address(this));
}
```

# Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

These RateProviders are expected to work well with Balancer pools. Especially the concerns around upgradeability of part of the pricing pipeline is guarded behind a TimeLock of 24 hours, which allows LPs to take action in case they do not agree with the to be executed upgrades.