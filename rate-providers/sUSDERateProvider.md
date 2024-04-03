# Rate Provider: `MergedAdapterWithoutRoundsSusdeRateProviderV1`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [arbitrum:0x3A236F67Fce401D87D7215695235e201966576E4](https://arbiscan.io/address/0x3A236F67Fce401D87D7215695235e201966576E4#readProxyContract)
- Audit report(s):
    - [Redstone Finance audits](https://redstone.finance/audits)

## Context
Redstone Finance provides Oracle functionality to report the exchange Rate of sUSDE in terms of USDE. The Rate is fetched from mainnet and stored on Arbitrum to be accessible via the RateProviders `getRate()` function.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [x] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).
    - admin address: [arbitrum:0x3C8b3a92B5AC28561ac313Ba934558B52580Fe4F](https://arbiscan.io/address/0x3C8b3a92B5AC28561ac313Ba934558B52580Fe4F)
    - admin type: multisig
        - multisig threshold/signers: 2/3

- [ ] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price).

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source: Redstone Oracle. 
    - source address: 
        - [arbitrum:0x67419bA2B658fd063Ebf6f4e28e94027f1837A23](https://arbiscan.io/address/0x67419bA2B658fd063Ebf6f4e28e94027f1837A23)
        - [arbitrum:0xB26555dD01B8178042D6976024E7f5d15b87Cd74](https://arbiscan.io/address/0xB26555dD01B8178042D6976024E7f5d15b87Cd74)
        - [arbitrum:0xeffDA49bC494536387FA980893337c6A5943aAcF](https://arbiscan.io/address/0xeffDA49bC494536387FA980893337c6A5943aAcF)
        - [arbitrum:0xc4D1AE5E796E6d7561cdc8335F85e6B57a36e097](https://arbiscan.io/address/0xc4D1AE5E796E6d7561cdc8335F85e6B57a36e097)
        - [arbitrum:0xCD6BfDA4D95d5C0f3f2882dC221D792392c99714](https://arbiscan.io/address/0xCD6BfDA4D95d5C0f3f2882dC221D792392c99714)

    - any protections? YES: The Rate that is being written to the Rate Providers storage has checks that need to be passed. This includes: 
        - A new Rate must have a timestamp more recent than the last one written to storage.
        - A new Rate cannot be updated more frequent than 12 hours.
        - A new Rate cannot be changed more than 2% compared to the last stored Rate.
        - A new returned rate cannot be 0.

        The checks for valid data ingestion happen during the call to `updateDataFeedsValues(uint256 dataPackagesTimestamp)` which is a **public** function. The two following snippets are partial excerpts of these checks.

        ```solidity
        //@review PRECISION = 10000;
        //uint256 MAX_ALLOWED_DEVIATION_PERCENT = 2 * PRECISION;
        function _validateDeviationFromLatestAnswer(
            uint256 proposedValue,
            bytes32 dataFeedId
        ) internal view virtual {
            uint256 latestAnswer = getValueForDataFeedUnsafe(dataFeedId);
            if (latestAnswer != 0) {
                uint256 deviation = DeviationLib.calculateAbsDeviation(
                    proposedValue,
                    latestAnswer,
                    PRECISION
                );
                if (deviation > MAX_ALLOWED_DEVIATION_PERCENT) {
                    revert ProposedValueIsDeviatedTooMuch(
                    latestAnswer,
                    proposedValue,
                    deviation,
                    MAX_ALLOWED_DEVIATION_PERCENT
                    );
                }
            }
        }
        ```

        ```solidity
        //@review interval is set at : MIN_UPDATE_INTERVAL = 12 hours;
        function _assertMinIntervalBetweenUpdatesPassed() private view {
            uint256 currentBlockTimestamp = getBlockTimestamp();
            uint256 blockTimestampFromLatestUpdate = getBlockTimestampFromLatestUpdate();
            uint256 minIntervalBetweenUpdates = getMinIntervalBetweenUpdates();
            if (currentBlockTimestamp < blockTimestampFromLatestUpdate + minIntervalBetweenUpdates) {
                revert MinIntervalBetweenUpdatesHasNotPassedYet(
                    currentBlockTimestamp,
                    blockTimestampFromLatestUpdate,
                    minIntervalBetweenUpdates
                );
            }
        }
        ```

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

This Rate Provider is expected to work well with Balancer Pools. While the Price data can be updated by various EOAs the checks for data validity are essential and are what protects against malicious price data being provided.
