# Rate Provider: `MstETHRateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0xCC701e2D472dFa2857Bf9AE24c263DAa39fD2C61](https://etherscan.io/address/0xcc701e2d472dfa2857bf9ae24c263daa39fd2c61#code)
- Audit report(s):
    - [Magpie Audit reports](https://docs.magpiexyz.io/security/audit-reports)

## Context
The Rate Provider returns he rate of 1 mstETH in terms of stETH.

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
    - upgradeable component: `MLRT` ([ethereum:0x49446A0874197839D15395B908328a74ccc96Bc0](https://etherscan.io/address/0x49446A0874197839D15395B908328a74ccc96Bc0#readProxyContract))
    - admin address: [ethereum:0xf433c2A2D6FACeCDd9Edd7B8cE9cEaaB96F41866](https://etherscan.io/address/0xf433c2A2D6FACeCDd9Edd7B8cE9cEaaB96F41866>)
    - admin type: multisig
        - multisig threshold/signers: 3/6

    - upgradeable component: `EigenpieConfig` ([ethereum:0x20b70E4A1883b81429533FeD944d7957121c7CAB](https://etherscan.io/address/0x20b70E4A1883b81429533FeD944d7957121c7CAB))
    - admin address: [ethereum:0xf433c2A2D6FACeCDd9Edd7B8cE9cEaaB96F41866](https://etherscan.io/address/0xf433c2A2D6FACeCDd9Edd7B8cE9cEaaB96F41866#code)
    - admin type: multisig
        - multisig threshold/signers: 3/6

    - upgradeable component: `PriceProvider` ([ethereum:0x9daA893D4Dfb96F46eA879f08ca46f39DaC07767](https://etherscan.io/address/0x9daA893D4Dfb96F46eA879f08ca46f39DaC07767#code))
    - admin address: [ethereum:0xf433c2A2D6FACeCDd9Edd7B8cE9cEaaB96F41866](https://etherscan.io/address/0xf433c2A2D6FACeCDd9Edd7B8cE9cEaaB96F41866#code)
    - admin type: multisig
        - multisig threshold/signers: 3/6

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source: Multisig
    - source address: [ethereum:0xf433c2A2D6FACeCDd9Edd7B8cE9cEaaB96F41866](https://etherscan.io/address/0xf433c2A2D6FACeCDd9Edd7B8cE9cEaaB96F41866)
    - any protections? YES:
    The function `function updateMLRTPrice(address asset, uint256 newExchangeRate) external onlyOracleAdmin {}` is implemented as a rate update fallback. The modifier `onlyOracleAdmin` checks for the `keccak256("ORACLE_ADMIN_ROLE")` role which is currently assigned to `0xf433c2A2D6FACeCDd9Edd7B8cE9cEaaB96F41866`. This rate is however checked for deviation and update frequency via:
    ```solidity
    function _checkNewRate(address mLRTReceipt, uint256 newRate) internal {
        if (block.timestamp - rateLastUpdate[mLRTReceipt] < rateChangeWindowLimit) revert UpdateTooFrequently();

        uint256 currentExchangeRate = IMLRT(mLRTReceipt).exchangeRateToLST();

        if (
            newRate * EigenpieConstants.DENOMINATOR
                > currentExchangeRate * (EigenpieConstants.DENOMINATOR + rateIncreaseLimit)
        ) {
            revert NewRateTooHigh();
        }

        if (
            newRate * EigenpieConstants.DENOMINATOR
                < currentExchangeRate * (EigenpieConstants.DENOMINATOR - rateIncreaseLimit)
        ) {
            revert NewRateTooLow();
        }

        rateLastUpdate[mLRTReceipt] = block.timestamp;
    }
    ```

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.


## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

This Rate Provider should work well with Balancer pools. The two options of price changes are either based on a fixed calculation logic based on stakedAsset value received from Eigenlayer or a price update via a multisig. Both price updates are checked for deviation and update frequency.

