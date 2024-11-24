# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [\<network:address\>](\<link to contract on block explorer\>)
    - [\<network:address\>](\<link to contract on block explorer\>)
- Audit report(s):
    - [Tainet audit](https://github.com/Assure-DeFi/Audits/blob/main/Tainet_ADV_10_14_24.pdf)

## Context
Users can deposit both native TAO and wTAO tokens into TaiNet, which will use AI-driven strategies to delegate them into the optimal validators on an ongoing basis. In return, the user will receive an equivalent quantity of yTAO tokens. yTAO tokens are fully tradable, meaning they remain liquid for deploying in additional yield-bearing DeFi activities, even whilst the underlying holdings remain staked. Therefore, yTAO solves the issue of unlocking liquidity for staked TAO tokens, whilst simultaneously continuously optimizing yields in the background. Yields are then further boosted compared to regular staking via TaiNet’s unique revenue generation strategies.

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
    - upgradeable component: `WyTAO` ([ethereum:0x84347374A9E1559BE3dC87BEd9FDFe6fE5236d95](https://etherscan.io/address/0x84347374A9E1559BE3dC87BEd9FDFe6fE5236d95))
    - admin address: [ethereum:0x9A9fA8Ebf489948E60db3C3De88b20EE4EfF5064](https://etherscan.io/address/0x9A9fA8Ebf489948E60db3C3De88b20EE4EfF5064)
    - admin type: EOA

    - upgradeable component: `YTAO` ([ethereum:0x9A9fA8Ebf489948E60db3C3De88b20EE4EfF5064](https://etherscan.io/address/0x9A9fA8Ebf489948E60db3C3De88b20EE4EfF5064))
    - admin address: [ethereum:0x9A9fA8Ebf489948E60db3C3De88b20EE4EfF5064](https://etherscan.io/address/0x9A9fA8Ebf489948E60db3C3De88b20EE4EfF5064)
    - admin type: EOA

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source: Custom EOA oracle providing profit data
    - source address: [ethereum:0x0bdf1cF3997b9148b5fc950759b4F6Ffb0Ee2b85](https://etherscan.io/address/0x0bdf1cF3997b9148b5fc950759b4F6Ffb0Ee2b85)
    - any protections? The oracle update happens during a `rebase` call.
    ```solidity
    function rebase(uint256 profit) external checkPaused hasManageStakingConfigRole {
        require(profit > 0, "Profit must be greater than zero");
        uint256 oldTotalSupply = totalSupply();
        require(oldTotalSupply > 0, "Total supply must be greater than zero to rebase");
        uint256 newTotalSupply = oldTotalSupply + profit;
        rebaseIndex = rebaseIndex.mulDivDown(newTotalSupply, oldTotalSupply);
        emit Rebase(oldTotalSupply, newTotalSupply, profit);
    }
    ```
    This call is guarded behind a specific role with the id "0xcdc459158320f1e5dc6a2790e6223a1fae30e193e0b9c0c623cd787aee91ddd3". However, there is no bound for profit. So any profit can be reported and the oracle rests on the assumption of no faulty entries and the oracle being trusted. 

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: UNSAFE**

This rate provider is currently not safe as upgradeability of the system rests on an eoa admin.
