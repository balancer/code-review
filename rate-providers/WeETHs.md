# Rate Provider: `AccountantWithRateProviders`

## Details
- Reviewed by: @mkflow27
- Checked by: @danielmkm
- Deployed at:
    - [ethereum:0x64c04442c4bc85c49782525abe92c8a6fb714b50](https://etherscan.io/address/0x64c04442c4bc85c49782525abe92c8a6fb714b50#code)
- Adaptor to:
    - [ethereum:0xbe16605B22a7faCEf247363312121670DFe5afBE](https://etherscan.io/address/0xbe16605B22a7faCEf247363312121670DFe5afBE#code)
- Audit report(s):
    - [Symbiotic](https://docs.symbiotic.fi/security)
    - [Ether Fi](https://www.ether.fi/)

## Context
With the new Super Symbiotic LRT vault restaking in @symbioticfi is enabled. When a user deposits, $weETHs is minted, the Super Symbiotic LRT. Users will be able to use $weETHs in DeFi.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [x] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).
    - admin address: [ethereum:https://etherscan.io/address/0x0000000000000000000000000000000000000000](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
    - admin type: EOA
        - comment: the `owner` can change the `authority` which is the contract managing function access. If the authority were changed the possibility of an unintended account setting the rate would be possible. However as part of [this tx](https://etherscan.io/tx/0xa7ead57c956a7e8ac333088a024060fd8e7119c4088d4575e63a14c80a67cb08) ownership was transfered to the zero address. 

- [ ] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price).

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source: Multisig 2/3
    - source address: [ethereum:0x41dfc53b13932a2690c9790527c1967d8579a6ae](https://etherscan.io/address/0x41dfc53b13932a2690c9790527c1967d8579a6ae)
    - any protections? NO: The rate provider contract has the following `getRate` implementation.
        ```solidity
        function getRate() public view returns (uint256 rate) {
        rate = accountantState.exchangeRate;
        }
        ````
        and the `accountantState` is updated by:
        ```solidity
        function updateExchangeRate(uint96 newExchangeRate) external requiresAuth {
        AccountantState storage state = accountantState;
        if (state.isPaused) revert AccountantWithRateProviders__Paused();
        uint64 currentTime = uint64(block.timestamp);
        uint256 currentExchangeRate = state.exchangeRate;
        uint256 currentTotalShares = vault.totalSupply();
        if (
            currentTime < state.lastUpdateTimestamp + state.minimumUpdateDelayInSeconds
                || newExchangeRate > currentExchangeRate.mulDivDown(state.allowedExchangeRateChangeUpper, 1e4)
                || newExchangeRate < currentExchangeRate.mulDivDown(state.allowedExchangeRateChangeLower, 1e4)
        ) {
            // Instead of reverting, pause the contract. This way the exchange rate updater is able to update the exchange rate
            // to a better value, and pause it.
            state.isPaused = true;
        } else {
            _calculateFeesOwed(state, newExchangeRate, currentExchangeRate, currentTotalShares, currentTime);
        }

        state.exchangeRate = newExchangeRate;
        state.totalSharesLastUpdate = uint128(currentTotalShares);
        state.lastUpdateTimestamp = currentTime;

        emit ExchangeRateUpdated(uint96(currentExchangeRate), newExchangeRate, currentTime);
        }
        ```
        Which effectively pauses the contract if a rate is send which is outside of the allowed deviation bounds. However this does not stop `getRate` from being called. Meaning the pool would still trade on "bad" price data. However a possible alternative would be to have `getRatae` work the same way as `getRateSafe` which checks for the rate provider being paused.
        ```solidity
        function getRateSafe() external view returns (uint256 rate) {
        if (accountantState.isPaused) revert AccountantWithRateProviders__Paused();
        rate = getRate();
        }
        ```


- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.


## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.


## Conclusion
**Summary judgment: SAFE**

This rate provider should work well with Balancer pools. The rate Provider calls `getRateSafe` of the underlying rate Provider and now ensures that if the system gets paused the call to `getRate` reverts. 
