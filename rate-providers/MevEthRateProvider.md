# Rate Provider: `MevEthRateProvider`

## Details
- Reviewed by: @rabmarut
- Checked by: @baileyspraggins
- Deployed at:
    - [ethereum:0xf518f2EbeA5df8Ca2B5E9C7996a2A25e8010014b](https://etherscan.io/address/0xf518f2ebea5df8ca2b5e9c7996a2a25e8010014b#code)
- Audit report(s):
    - [Kebabsec - Manifold mevETH2 Audit](https://kebabsec.xyz/audits/manifold_finance_meveth2_audit/)

## Context
mevETH is an upcoming MEV-optimized, natively multichain liquid staking protocol.

It is designed capture MEV from sources unavailable to other liquid staking platforms, which are available to mevETH because Manifold operates the entire Ethereum validation stack—block builder, relay, and validators—thus unlocking novel and sophisticated MEV approaches that wouldn’t otherwise be possible. mevETH will also be the first natively multichain liquid staking token, leveraging LayerZero technology to maximize DeFi composability across chains.

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

There is no public donation vector in this contract. There is a privileged vector which this author does not consider to be particularly risky but is worth pointing out anyway.

The conversion rate is determined by the ratio between `fraction.elastic` and `fraction.base`, which are equivalent to `ERC4626#totalAssets()` and `ERC20#totalSupply()`. This looks very much like any other ERC-4626 conversion function, but in this case `totalAssets()` is not queried via the typical pattern of `balanceOf(address(this))`, so it is not vulnerable to public donation.

The `fraction.elastic` and `fraction.base` variables are typically updated during the deposit/withdrawal workflows and strictly represent assets that flow through the contract. There is only one other mechanism for updating one of these variables, and that is the `grantRewards()` function. This function increases, but never decreases, `fraction.elastic`, and it requires depositing an equivalent amount of ETH to the contract. So this can be considered a non-manipulable means of updating the conversion rate monotonically, and it is the only means of updating the conversion rate.

Nonetheless, this can be considered a form of donation, so the entities authorized to call this function can atomically increase the price of `mevETH` and potentially leverage the consequences on third-party platforms (not on Balancer). So, we point out here that these two entities are:
- The `stakingModule`, which is the `WagyuStaker` contract deployed at [eth:0xc5920c99d09E5444C079C01F06763b5d6AB09CbB](https://etherscan.io/address/0xc5920c99d09E5444C079C01F06763b5d6AB09CbB#code). Only a privileged `operator` can call `WagyuStaker#payRewards()` which sends the "donation" via `MevEth#grantRewards()`.
- The `mevEthShareVault`, which is a 5/8 Gnosis Safe deployed at [eth:0x617c8dE5BdE54ffbb8d92716CC947858cA38f582](https://etherscan.io/address/0x617c8dE5BdE54ffbb8d92716CC947858cA38f582#code), among whose signers are `0xMaki.eth` and `manifoldfinance.eth`.

``` solidity
/// @notice The total amount of assets controlled by the mevEth contract
/// @return totalManagedAssets The amount of eth controlled by the mevEth contract
function totalAssets() external view returns (uint256 totalManagedAssets) {
    // Should return the total amount of Ether managed by the contract
    totalManagedAssets = uint256(fraction.elastic);
}

/// @notice Function to convert a specified amount of shares to assets based on the elastic and base.
/// @param shares The amount of shares to convert to assets
/// @return assets The value of the given shares in assets
function convertToAssets(uint256 shares) public view returns (uint256 assets) {
    // So if there are no shares, then they will mint 1:1 with assets
    // Otherwise, shares will mint proportional to the amount of assets
    if (uint256(fraction.elastic) == 0 || uint256(fraction.base) == 0) {
        assets = shares;
    } else {
        assets = (shares * uint256(fraction.elastic)) / uint256(fraction.base);
    }
}

/// @notice Grants rewards updating the fraction.elastic.
/// @dev called from validator rewards updates
function grantRewards() external payable {
    if (!(msg.sender == address(stakingModule) || msg.sender == mevEthShareVault)) revert MevEthErrors.UnAuthorizedCaller();
    if (msg.value == 0) revert MevEthErrors.ZeroValue();

    fraction.elastic += uint128(msg.value);
    lastRewards = block.number;
    emit Rewards(msg.sender, msg.value);
}
```

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

- N/A


## Conclusion
**Summary judgment: SAFE.**

This is a minimal Rate Provider that computes the exchange rate using a ratio of protocol-owned assets to minted shares. The system is not upgradeable and does not utilize oracles; all price updates are accompanied by actual asset inflows. There are some privileged operators in the system who have the power to rehypothecate deposited ETH for staking purposes, but this is to be expected from an ETH staking system.

There is a potential risk of donation attacks, but these are privileged and only impact downstream integrations (not Balancer directly). Integrators should be wary of the underlying token's manipulability via donations, which will propagate into the BPT price itself, and assess the unique risk this poses to their respective protocols.
