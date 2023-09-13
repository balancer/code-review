# Rate Provider: `BalancerRateProxy` (uniETH)

## Details
- Reviewed by: @rabmarut
- Checked by: @gerrrg
- Deployed at:
    - [ethereum:0x2c3b8c5e98A6e89AAAF21Deebf5FF9d08c4A9FF7](https://etherscan.io/address/0x2c3b8c5e98A6e89AAAF21Deebf5FF9d08c4A9FF7#code)
- Audit report(s):
    - [PeckShield - RockX ETH Staking - June 2022](https://github.com/Bedrock-Technology/docs/blob/7c262ad02f5e61411c5e7bfd6523c11c5f5c34e9/PeckShield%20Audit%20Report%20RockX%20Eth%20Staking.pdf)

## Context
uniETH is an ETH liquid staking token on Ethereum mainnet. It does not rebase; instead, it grows in value over time. The `BalancerRateProxy` provides a price feed for uniETH that can be used in Balancer pools.

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
    - upgradeable component `RockXStaking`
        - entry point: ([ethereum:0x4beFa2aA9c305238AA3E0b5D17eB20C045269E9d](https://etherscan.io/address/0x4beFa2aA9c305238AA3E0b5D17eB20C045269E9d#code))
        - implementation reviewed: ([ethereum:0x9Ba573D531b45521a4409f3D3e1bC0d7dfF7C757](https://etherscan.io/address/0x9ba573d531b45521a4409f3d3e1bc0d7dff7c757#code))
    - admin address: [ethereum:0xAeE017052DF6Ac002647229D58B786E380B9721A](https://etherscan.io/address/0xAeE017052DF6Ac002647229D58B786E380B9721A#code)
    - admin type: multisig
        - multisig threshold/signers: 2/3
        - multisig timelock? NO
        - trustworthy signers? NO (none recognized)

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks.
    - It seems possible to manipulate the exchange rate upward via a donation attack, though the result of the donation could only be propagated after a privileged oracle update. The workflow would be as follows:
        - (public) Send ETH to the `RockXStaking` contract -> trigger the empty `receive()` function, thereby accepting the donation.
        - (privileged) Call `RockXStaking#pushBeacon()` during the course of normal operation.
            - `RockXStaking#pushBeacon()` -> `RockXStaking#_pushBeacon()` -> `RockXStaking#_autocompound()`.
            - `RockXStaking#_autocompound()` updates `totalPending` based on `address(this).balance`, thereby consuming the newly donated balance.
        - (Balancer pool) Consume `BalancerRateProxy#getRate()` to price a trading pair.
            - `BalancerRateProxy#getRate()` -> `RockXStaking#exchangeRatio()` -> `RockXStaking#currentReserve()`.
            - `RockXStaking#currentReserve()` reads `totalPending`, which has been updated via donation.

```solidity
// @audit `totalPending` is updated to reflect changes in the contract's ETH balance.
function _autocompound() internal {
    if (autoCompoundEnabled) {
        if (address(this).balance > accountedManagerRevenue + totalPending) {
            uint256 maxCompound = accountedUserRevenue - rewardDebts;
            uint256 maxUsable = address(this).balance - accountedManagerRevenue - totalPending;
            uint256 effectiveEthers = maxCompound < maxUsable? maxCompound:maxUsable;
            totalPending += effectiveEthers;
            rewardDebts += effectiveEthers;
        }
    }
}

// @audit `totalPending` contributes to the total reserve amount.
function currentReserve() public view returns(uint256) {
    return totalPending + totalStaked + accountedUserRevenue - totalDebts - rewardDebts;
}

// @audit The total reserve amount is a major component of the exchange rate.
function exchangeRatio() external view returns (uint256) {
    uint256 xETHAmount = IERC20(xETHAddress).totalSupply();
    if (xETHAmount == 0) {
        return 1 * MULTIPLIER;
    }

    uint256 ratio = currentReserve() * MULTIPLIER / xETHAmount;
    return ratio;
}
```

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

- N/A

## Conclusion
**Summary judgment: SAFE**

The `BalancerRateProxy` for uniETH is deemed safe for usage. There is a potential risk of donation attacks, but these only impact downstream integrations (not Balancer directly). Integrators should be wary of the underlying token's manipulability via donations, which will propagate into the BPT price itself, and assess the unique risk this poses to their respective protocols.

It is worth noting that a 2/3 multisig has upgrade authority over the entire `RockXStaking` implementation, and a contract upgrade could completely modify the behavior of the pricing algorithm. Users should be careful to understand the trust they place in this multisig and try to identify and vet the signers if possible.

This review also makes no determination as to the security of the uniETH token itself or the RockX staking protocol, as it is laser-focused on Balancer integration with the `BalancerRateProxy`. Before investing your funds in any DeFi protocol, please consult its source code, documentation, and historical audits.
