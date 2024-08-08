# Rate Provider: `SolvBTCYieldTokenBalancerRateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0x99A77a36C9066b1e37cA87E9328eFB87FcFF7E2b](https://etherscan.io/address/0x99A77a36C9066b1e37cA87E9328eFB87FcFF7E2b#code)
    - [arbitrum:0xeA70471806667232f176eD5EeCCc7D606A3d2C39](https://arbiscan.io/address/0xeA70471806667232f176eD5EeCCc7D606A3d2C39#code)
- Audit report(s):
    - [SolvBTC audits](https://github.com/solv-finance/Audit)

## Context
SolvBTC.BBN is a liquid staking token (LST) for Bitcoin, representing the staked Bitcoin in Babylon. SolvBTC.BBN allows Bitcoin holders to earn staking yields it can be obtained by staking SolvBTC. SolvBTC.BBN will not produce yields initially but is designed in preparation for Babylon’s mainnet launch. When Babylon launches its mainnet, Solv will be among the first participants, positioning SolvBTC.bbn as a pioneering liquid staking token for Bitcoin.

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
    #### Mainnet SolvBTCYieldTokenBalancerRateProvider
    - upgradeable component: `SftWrappedToken` ([ethereum:0xd9D920AA40f578ab794426F5C90F6C731D159DEf](https://etherscan.io/address/0xd9D920AA40f578ab794426F5C90F6C731D159DEf#readProxyContract))
    - admin address: [ethereum:0x55C09707Fd7aFD670e82A62FaeE312903940013E](https://etherscan.io/address/0x55C09707Fd7aFD670e82A62FaeE312903940013E)
    - admin type: EOA

    - upgradeable component: `NavOracle` ([ethereum:0x8c29858319614380024093DBEE553F9337665756](https://etherscan.io/address/0x8c29858319614380024093DBEE553F9337665756#code))
    - admin address: [ethereum:0x55C09707Fd7aFD670e82A62FaeE312903940013E](https://etherscan.io/address/0x55C09707Fd7aFD670e82A62FaeE312903940013E)
    - admin type: EOA

    - upgradeable component: `AddressResolver` ([ethereum:0xc2f69541e3dC306777D260dC66bfD54fcb897100](https://etherscan.io/address/0xc2f69541e3dC306777D260dC66bfD54fcb897100#readProxyContract))
    - admin address: [ethereum:0x55C09707Fd7aFD670e82A62FaeE312903940013E](https://etherscan.io/address/0x55C09707Fd7aFD670e82A62FaeE312903940013E)
    - admin type: EOA
    - comment: the `owner` role of this contract is [ethereum:0x55C09707Fd7aFD670e82A62FaeE312903940013E](https://etherscan.io/address/0x55C09707Fd7aFD670e82A62FaeE312903940013E) and it is allowed of changing the oracle address, which is allowed to call `setSubscribeNavOnlyMarket` on the `NavOracle` contract.

    - upgradeable component: `OpenFundMarket` ([ethereum:0x57bB6a8563a8e8478391C79F3F433C6BA077c567](https://etherscan.io/address/0x57bb6a8563a8e8478391c79f3f433c6ba077c567#readProxyContract))
    - admin address: [ethereum:0x55C09707Fd7aFD670e82A62FaeE312903940013E](https://etherscan.io/address/0x55C09707Fd7aFD670e82A62FaeE312903940013E)
    - admin type: EOA

    #### Arbitrum SolvBTCYieldTokenBalancerRateProvider

    - upgradeable component: `SftWrappedToken` ([arbitrum:0x346c574C56e1A4aAa8dc88Cda8F7EB12b39947aB](https://arbiscan.io/address/0x346c574C56e1A4aAa8dc88Cda8F7EB12b39947aB#readProxyContract))
    - admin address: [arbitrum:0x55C09707Fd7aFD670e82A62FaeE312903940013E](https://arbiscan.io/address/0x55C09707Fd7aFD670e82A62FaeE312903940013E)
    - admin type: EOA

    - upgradeable component: `NavOracle` ([arbitrum:0x6ec1fEC6c6AF53624733F671B490B8250Ff251eD](https://arbiscan.io/address/0x6ec1fEC6c6AF53624733F671B490B8250Ff251eD#readProxyContract))
    - admin address: [arbitrum:0x9523d4054FDbBb9F65121f3A89faC0C8b258c9CB](https://arbiscan.io/address/0x9523d4054FDbBb9F65121f3A89faC0C8b258c9CB)
    - admin type: EOA

    - upgradeable component: `AddressResolver` ([:]())
    - admin address: [arbitrum:0x55C09707Fd7aFD670e82A62FaeE312903940013E](https://arbiscan.io/address/0x55C09707Fd7aFD670e82A62FaeE312903940013E)
    - admin type: EOA
    - comment: the `owner` role of this contract is [arbitrum:0x55C09707Fd7aFD670e82A62FaeE312903940013E](https://arbiscan.io/address/0x55C09707Fd7aFD670e82A62FaeE312903940013E) and it is allowed of changing the oracle address, which is allowed to call `setSubscribeNavOnlyMarket` on the `NavOracle` contract.

    - upgradeable component: `OpenFundMarket` ([arbitrum:0x629aD7Bc14726e9cEA4FCb3A7b363D237bB5dBE8](https://arbiscan.io/address/0x629aD7Bc14726e9cEA4FCb3A7b363D237bB5dBE8#readProxyContract))
    - admin address: [arbitrum:0x55C09707Fd7aFD670e82A62FaeE312903940013E](https://arbiscan.io/address/0x55C09707Fd7aFD670e82A62FaeE312903940013E)
    - admin type: EOA

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source: Custom oracle called "OpenFundMarket". 
    - source address: 
        #### Mainnet
        [ethereum:0x57bb6a8563a8e8478391c79f3f433c6ba077c567](https://etherscan.io/address/0x57bb6a8563a8e8478391c79f3f433c6ba077c567#readProxyContract)
        #### Arbitrum
        [arbitrum:0x629aD7Bc14726e9cEA4FCb3A7b363D237bB5dBE8](https://arbiscan.io/address/0x629aD7Bc14726e9cEA4FCb3A7b363D237bB5dBE8#readProxyContract)
    - any protections? YES: The nav is updated as part of the `setSubscribeNav` function on the `OpenFundMarket`. There is an access check which requires the sender to be `poolInfo.managerInfo.subscribeNavManager`. 
    ```solidity
    function setSubscribeNav(bytes32 poolId_, uint256 time_, uint256 nav_) external virtual override {
        PoolInfo storage poolInfo = poolInfos[poolId_];
        require(poolInfo.poolSFTInfo.openFundShareSlot != 0, "OFM: pool does not exist");
        require(_msgSender() == poolInfo.managerInfo.subscribeNavManager, "OFM: only subscribe nav manager");
        INavOracle(poolInfo.navOracle).setSubscribeNavOnlyMarket(poolId_, time_, nav_);
        emit SetSubscribeNav(poolId_, time_, nav_);
    }
    ```
    - comment: See comment on the `owner` role of the `AddressResolver` resolver top wrt. protections. 

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: \<SAFE/UNSAFE\>**

This contract should work with Balancer pools. However since this was a timeboxed review, the checks for downstream oracle (OpenFundMarket) data providers have not been done. Various contracts are upgradeable by EOAs which pose a risk for potentially drastic rate changes and further clarification is required.  
