# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @danielmkm
- Deployed at:
    - [mode:0xac8fae65008cbb22a27103160452418aa3c84128](https://explorer.mode.network/address/0xac8fae65008cbb22a27103160452418aa3c84128?tab=read_contract)
- Audit report(s):
    - [No audit](no audits were provided for this review)

## Context
stUSD is a staked version of USDA earning a native USD yield paid in USDA. It is a yield-bearing ERC-20 token that can be freely transferred and that is always redeemable for an ever-growing amount of USDA. The value of 1 stUSD is not meant to be $1: it increases over time as yield continuously accrues to it.

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
    - upgradeable component: `CoreBorrow` (Access control manager) ([mode:0xA61BeB4A3d02decb01039e378237032B351125B4](https://explorer.mode.network/address/0xA61BeB4A3d02decb01039e378237032B351125B4))
    - admin address: [mode:0x0a393fd662C17cDC08882Ab02D0Db777AF9b5805](https://explorer.mode.network/address/0x0a393fd662C17cDC08882Ab02D0Db777AF9b5805?tab=contract)
    - admin type: multisig
        - multisig threshold/signers: 4/6

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes). 
    - source: The essential part of computing the rate is based on a storage variable called `rate`. which can be updated by various members.
    ```solidity
    /// @inheritdoc ERC4626Upgradeable
    function totalAssets() public view override returns (uint256) {
        return _computeUpdatedAssets(super.totalAssets(), block.timestamp - lastUpdate);
    }

    /// @notice Computes how much `currentBalance` held in the contract would be after `exp` time following
    /// the `rate` of increase
    function _computeUpdatedAssets(uint256 currentBalance, uint256 exp) internal view returns (uint256) {
        uint256 ratePerSecond = rate;
        if (exp == 0 || ratePerSecond == 0) return currentBalance;
        uint256 expMinusOne = exp - 1;
        uint256 expMinusTwo = exp > 2 ? exp - 2 : 0;
        uint256 basePowerTwo = (ratePerSecond * ratePerSecond + HALF_BASE_27) / BASE_27;
        uint256 basePowerThree = (basePowerTwo * ratePerSecond + HALF_BASE_27) / BASE_27;
        uint256 secondTerm = (exp * expMinusOne * basePowerTwo) / 2;
        uint256 thirdTerm = (exp * expMinusOne * expMinusTwo * basePowerThree) / 6;
        return (currentBalance * (BASE_27 + ratePerSecond * exp + secondTerm + thirdTerm)) / BASE_27;
    }
    ```
    Depending on what values this `rate` is set at, the rate provider reports different rates due to the pricing approach being totalAssets / totalSupply. The rate can be set via 
    ```solidity
    function setRate(uint208 newRate) external onlyTrustedOrGuardian {
    if (newRate > maxRate) revert InvalidRate();
    _accrue();
    rate = newRate;
    emit RateUpdated(newRate);
    }
    ```
    - source address: 
        - 2/3 Multisig [mode:0x7DE8289038DF0b89FFEC71Ee48a2BaD572549027](https://explorer.mode.network/address/0x7DE8289038DF0b89FFEC71Ee48a2BaD572549027)
        - 4/6 Multisig [mode:0x0a393fd662C17cDC08882Ab02D0Db777AF9b5805](https://explorer.mode.network/address/0x0a393fd662C17cDC08882Ab02D0Db777AF9b5805)
        - Timelock minDelay 86400 [mode:0x9a5b060Bd7b8f86c4C0D720a17367729670AfB19](https://explorer.mode.network/address/0x9a5b060Bd7b8f86c4C0D720a17367729670AfB19) which receives proposals via LayerZero from Mainnet. The remote sender for this process is the Angle governance system at [ethereum:0x748bA9Cd5a5DDba5ABA70a4aC861b2413dCa4436](https://etherscan.io/address/0x748bA9Cd5a5DDba5ABA70a4aC861b2413dCa4436#code). More information about the Angle onchain governance system can be found in the [docs](https://docs.angle.money/governance/angle-dao#angle-onchain-governance-system).
    - any protections? YES: the max rate is set by admins
    ```solidity
    /// @notice Updates the maximum rate settable
    function setMaxRate(uint256 newMaxRate) external onlyGovernor {
        maxRate = newMaxRate;
        emit MaxRateUpdated(newMaxRate);
    }
    ```
    Currently [mode:](https://explorer.mode.network/address/0x0a393fd662C17cDC08882Ab02D0Db777AF9b5805) 4/6 Multisig and the Timelock [mode:0x9a5b060Bd7b8f86c4C0D720a17367729670AfB19](https://explorer.mode.network/address/0x9a5b060Bd7b8f86c4C0D720a17367729670AfB19) ( minDelay = 86400 ) can set these max rates.

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks.

The rate can be changed via a donation as implied by the `totalAssets()` function implemented as
```solidity
/** @dev See {IERC4262-totalAssets}. */
function totalAssets() public view virtual override returns (uint256) {
    return _asset.balanceOf(address(this));
}
```

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

This rate provider should work well with Balancer pools. The rate computation approach is a widely used approach of totalAssets / totalSupply and the oracle data required for the increasing rate is guarded behind various multisigs and checks. 