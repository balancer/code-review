# Rate Provider: `CDCETHBalancerRateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0x3f032432f239d86D36ccF01Fb0c86399a33BD004](https://etherscan.io/address/0x3f032432f239d86d36ccf01fb0c86399a33bd004)
- Audit report(s):
    - [Wrapped Token contract audits](https://crypto.com/document/blocksec_securityaudit2024)

## Context
CDCETH provides an instant, efficient, and liquid way of participating in the Proof-of-Stake consensus mechanism on
Ethereum and maintaining the integrity of the network.

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
    - upgradeable component: `LiquidETHV1` ([ethereum:0xfe18aE03741a5b84e39C295Ac9C856eD7991C38e](https://etherscan.io/address/0xfe18ae03741a5b84e39c295ac9c856ed7991c38e#readProxyContract))
    - admin address: [ethereum:0x328a6715c5C0b4bc2b35FA2320b45605aB7b18bc](https://etherscan.io/address/0x328a6715c5c0b4bc2b35fa2320b45605ab7b18bc)
    - admin type: EOA

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source: Custom Oracle
    - source address: [ethereum:0x59B0189D1e5556c97637c505919518Bf25DF0Fc8](https://etherscan.io/address/0x59B0189D1e5556c97637c505919518Bf25DF0Fc8)
    - any protections? YES: There is one check done on the rate being pushed which is that the rate must be greater than 0.
    ```solidity
        function updateExchangeRate(uint256 newExchangeRate) external onlyOracle {
        require(
            newExchangeRate > 0,
            "LiquidETHV1: new exchange rate cannot be 0"
        );
        bytes32 position = _EXCHANGE_RATE_POSITION;
        assembly {
            sstore(position, newExchangeRate)
        }
        emit ExchangeRateUpdated(msg.sender, newExchangeRate);
    }
    ```

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: UNSAFE**

This rate provider currently bears risk of private key loss for upgradeability as well as data the oracle pushes. In the current form this rate provider is not suggested to be used.
