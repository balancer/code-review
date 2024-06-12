# Rate Provider: `PriceFeed`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [arbitrum:0xBA74737A078C05500dD98C970909e4A3b90c35C6](https://arbiscan.io/address/0xba74737a078c05500dd98c970909e4a3b90c35c6#code)
- Audit report(s):
    - [Stakewise audits](https://github.com/stakewise/contracts/tree/master/audits)

## Context
StakeWise customers can participate in Ethereum's Proof-of-Stake consensus mechanism and receive ETH rewards in return. By introducing osETH StakeWise enabled liquid staking.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [x] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).
    - admin address: [arbitrum:0xB24d11D64Af594cCf280b9985E02aA7F57b5687d](https://arbiscan.io/address/0xB24d11D64Af594cCf280b9985E02aA7F57b5687d)
    - admin type: multisig
        - multisig threshold/signers: 4/7
    - comment: The upgradeability is based on the `owner` being able to change the allowed address, which can can `setRate` by changing the allowed `rateReceiver` via:
    ```solidity
        function setRateReceiver(address newRateReceiver) external override onlyOwner {
        rateReceiver = newRateReceiver;
        emit RateReceiverUpdated(newRateReceiver);
    }
    ```

- [ ] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price).

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source: WormholeRelayer
    - source address: [arbitrum:0x27428DD2d3DD32A4D7f7C497eAaa23130d894911](https://arbiscan.io/address/0x27428dd2d3dd32a4d7f7c497eaaa23130d894911)
    - any protections? YES: The rate date is checked against the right sender (WormholeRelayer), if an identical message was already parsed, accurate sourceChain data origin and that no past data is sent. For more information see info on Wormhole's Verified Action approvals here: https://docs.wormhole.com/wormhole/explore-wormhole/vaa

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.


## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

This rate provider should work well with Balancer pools. The upgradeability of the price Source is protected behind a multisig and price Data is sent via an established Oracle service using receiving functionality as outlined in the [wormhole docs](https://docs.wormhole.com/wormhole/quick-start/tutorials/hello-wormhole/hello-wormhole-explained).
