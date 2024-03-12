
# Rate Provider: `xRenzoDeposit`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [arbitrum:0xf25484650484DE3d554fB0b7125e7696efA4ab99](https://arbiscan.io/address/0xf25484650484de3d554fb0b7125e7696efa4ab99#readProxyContract)
- Audit report(s):
    - [Renzo Protocol audit](https://github.com/HalbornSecurity/PublicReports/blob/master/Solidity%20Smart%20Contract%20Audits/Renzo_Protocol_EVM_Contracts_Smart_Contract_Security_Assessment_Report_Halborn_Final.pdf)

## Context
Renzo is a Liquid Restaking Token (LRT) and Strategy Manager for EigenLayer. It is the interface to the EigenLayer ecosystem securing Actively Validated Services (AVSs) and offering a higher yield than ETH staking.
ezETH is the liquid restaking token representing a user’s restaked position at Renzo. Users can deposit stETH, rETH, cbETH or native ETH and accordingly receive ezETH. ezETH is a reward bearing token where the underlying restaking positions earn rewards which are reflected in the price of ezETH.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [x] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).
    - admin address: [arbitrum:0x0e60fd361fF5b90088e1782e6b21A7D177d462C5](https://arbiscan.io/address/0x0e60fd361fF5b90088e1782e6b21A7D177d462C5#readProxyContract)
    - admin type: multisig
        - multisig threshold/signers: 3/5

- [x] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price). 
    - upgradeable component: `xRenzoBridge` ([ethereum:0xc1036D6bBa2FE24c65823110B348Ee80D3386ACd](https://etherscan.io/address/0xc1036D6bBa2FE24c65823110B348Ee80D3386ACd#readProxyContract))
    - admin address: [ethereum:0xD1e6626310fD54Eceb5b9a51dA2eC329D6D4B68A](https://etherscan.io/address/0xD1e6626310fD54Eceb5b9a51dA2eC329D6D4B68A#code)
    - admin type: multisig
        - multisig threshold/signers: 3/5

    - upgradeable component: `BalancerRateProvider` ([ethereum:0x387dBc0fB00b26fb085aa658527D5BE98302c84C](https://etherscan.io/address/0x387dBc0fB00b26fb085aa658527D5BE98302c84C#readProxyContract))
    - admin address: [ethereum:0xD1e6626310fD54Eceb5b9a51dA2eC329D6D4B68A](https://etherscan.io/address/0xD1e6626310fD54Eceb5b9a51dA2eC329D6D4B68A#code)
    - admin type: multisig
        - multisig threshold/signers: 3/5

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source: Multisig (3/5)
    - source address: [arbitrum:0x0e60fd361fF5b90088e1782e6b21A7D177d462C5](https://arbiscan.io/address/0x0e60fd361fF5b90088e1782e6b21A7D177d462C5#code)
    - any protections? YES: The oracle price update functionality is assumed to be used as a backup functionality if CCIP cross chain rate messaging needs to be changed or some manual intervention is required. Meaning: Updating the rate via an an Oracle is not the primary price update mechanism. There are protections in place against arbitrarily submitted price data as part of an internal `_updatePrice` function. This includes a deviation threshold and timestamp protections.

    ```solidity
    function _updatePrice(uint256 _price, uint256 _timestamp) internal {
        // Check for 0
        if (_price == 0) {
            revert InvalidZeroInput();
        }

        // Check for price divergence - more than 10%
        if (
            (_price > lastPrice && (_price - lastPrice) > (lastPrice / 10)) ||
            (_price < lastPrice && (lastPrice - _price) > (lastPrice / 10))
        ) {
            revert InvalidOraclePrice();
        }

        // Do not allow older price timestamps
        if (_timestamp <= lastPriceTimestamp) {
            revert InvalidTimestamp(_timestamp);
        }

        // Do not allow future timestamps
        if (_timestamp > block.timestamp) {
            revert InvalidTimestamp(_timestamp);
        }

        // Update values and emit event
        lastPrice = _price;
        lastPriceTimestamp = _timestamp;

        emit PriceUpdated(_price, _timestamp);
    }
    ```

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price). 

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.



## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.


## Conclusion
**Summary judgment: SAFE**

This RateProvider is expected to work well with Balancer pools. The main pricing data is bridged from mainnet via CCIP and can be updated by a 3/5 multisig on Arbitrum if required. 
