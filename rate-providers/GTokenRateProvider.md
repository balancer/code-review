# Rate Provider: `GTokenRateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @danielmkm
- Deployed at:
    - [arbitrum:0x601A3bC1A24d209A2C08D2d54eC3f3aa39c3a40A](https://arbiscan.io/address/0x601A3bC1A24d209A2C08D2d54eC3f3aa39c3a40A#code)
- Audit report(s):
    - [Gains audits](https://github.com/pashov/audits/blob/master/team/pdf/GainsNetwork-security-review.pdf)

## Context
The rate provider reports the exchange rate for the gUSDC Vault. Deposit USDC in exchange for gUSDC, an ERC-20 representing your ownership in the vault. Stakers receive fees from each trade placed on the gains.trade platform in exchange for serving as the counterparty to all trades. gUSDC accumulates these fees in real-time.

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
    - upgradeable component: `GToken` ([arbitrum:0xd3443ee1e91aF28e5FB858Fbd0D72A63bA8046E0](https://arbiscan.io/address/0xd3443ee1e91aF28e5FB858Fbd0D72A63bA8046E0#readProxyContract))
    - admin address: [arbitrum:0x80fd0accC8Da81b0852d2Dca17b5DDab68f22253](https://arbiscan.io/address/0x80fd0accC8Da81b0852d2Dca17b5DDab68f22253)
    - admin type: EOA
        - multisig timelock? YES, 14 days. The admin mentioned above is the "executor", which can execute once the timelock has expired.

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes). 

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks.
    - comment: Anyone can "donate" assets to the `GToken` contract. The donation here exists not in the form of simply sending erc20 Tokens to a contract but in this particular case calling `distributeReward`. The `GToken` contract calls `transferFrom` on the sender and the amount sent is used for a new rate calculation.
    ```solidity
    // Distributes a reward evenly to all stakers of the vault
    function distributeReward(uint256 assets) external {
        address sender = _msgSender();
        SafeERC20Upgradeable.safeTransferFrom(_assetIERC20(), sender, address(this), assets);

        accRewardsPerToken += (assets * collateralConfig.precisionDelta * collateralConfig.precision) / totalSupply();
        updateShareToAssetsPrice();

        totalRewards += assets;
        totalDeposited += assets;

        emit RewardDistributed(sender, assets);
    }
    ```  

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.


## Conclusion
**Summary judgment: SAFE**

This rate provider should work well with Balancer pools. While the pool is expected to trade in accordance to the rate read from the rate provider, it is important to mention that LPs cannot immediately withdraw their assets from the Vault as withdrawls follow an epoch system. This can have an impact on the pool in case of market volatility or issues with the gains protocol. 