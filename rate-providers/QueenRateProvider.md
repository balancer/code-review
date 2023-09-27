# Rate Provider: `QueenRateProvider`

## Details
- Reviewed by: @baileyspraggins
- Checked by: @gerrrg 
- Deployed at:
    - [eth:0xA6aeD7922366611953546014A3f9e93f058756a2](https://etherscan.io/address/0xA6aeD7922366611953546014A3f9e93f058756a2)
- Audit report(s):
    - [PeckShield-Audit-Report-TranchessV2.1](https://github.com/peckshield/publications/blob/master/audit_reports/PeckShield-Audit-Report-TranchessV2.1-v1.0.pdf)

## Context
Queen is an asset that represents ETH deposited into the Primary Market of Tranchess, which can be held long-term to gain liquid staking yield or converted to additional investment strategies such as BISHOP (safer) or ROOK (more aggressive).

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
    - It is possible to manipulate the excahnge rate upward via a donation attack. The workflow would be as follows:
        - (public) Send Wrapped Ether (WETH) to the Tranchess Fund contract.
        - (Balancer pool) Call `QueenRateProvider#getRate()` to get the current exchange rate.
            - `QueenRateProvider#getRate()` -> `FundV4#getTotalUnderlying()`.
            - `FundV4#getTotalUnderlying()` reads the balance of WETH in the Tranchess Fund contract, which has been updated via donation.
    ```solidity
    // @audit - Called by Balancer Pool to get the current exchange rate.
    function getRate() external view returns (uint256) {
        uint256 fundUnderlying = fund.getTotalUnderlying();
        uint256 fundEquivalentTotalQ = fund.getEquivalentTotalQ();
        return fundUnderlying.mul(_underlyingDecimalMultiplier).divideDecimal(fundEquivalentTotalQ);
    }

    // @audit - Lives in the Tranchess FundV4 contract.
    // @audit - The return value of this function is used for fundUnderlying and reflects changes in the contracts WETH balance.
    function getTotalUnderlying() public view override returns (uint256) {
        uint256 hot = IERC20(tokenUnderlying).balanceOf(address(this));
        return hot.add(_strategyUnderlying).sub(_totalDebt);
    }
    ```

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

- N/A

## Conclusion
**Summary judgment: SAFE**

The `QueenRateProvider` is confirmed to be safe for use in Balancer Pools. It implements the required bare minimum requirments, does not contain any oracles, and is not upgradeable.

There is a potential risk of donation attacks, but these only impact downstream integrations (not Balancer directly). Integrators should be wary of the underlying token's manipulability via donations, which will propagate into the BPT price itself, and assess the unique risk this poses to their respective protocols.

This review also makes no determination as to the security of the Queen token itself or the Tranchess protocol, as it is laser-focused on Balancer integration with the `QueenRateProvider`. Before investing your funds in any DeFi protocol, please consult its source code, documentation, and historical audits.