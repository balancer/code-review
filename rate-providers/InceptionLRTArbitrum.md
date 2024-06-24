# Rate Provider: `InceptionRatioFeed`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [arbitrum:0x971b35225361535D04828F16442AAA54009efE1a](https://arbiscan.io/address/0x971b35225361535D04828F16442AAA54009efE1a#code)
    - [arbitrum:0x57a5a0567187FF4A8dcC1A9bBa86155E355878F2](https://arbiscan.io/address/0x57a5a0567187FF4A8dcC1A9bBa86155E355878F2#code)
- Audit report(s):
    - [InceptionLRT audits](https://docs.inceptionlrt.com/security/audit-reports)

## Context
inETH, previously known as genETH under InceptionLRT, is InceptionLRT v2's native liquid restaking token. This token reflects a user's staked ETH on the network, allowing for flexible participation in a variety of DeFi activity without having to unstake or transfer the underlying assets.

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
    - upgradeable component: `InceptionRatioFeed` ([arbitrum:0xfE715358368416E01d3A961D3a037b7359735d5e](https://arbiscan.io/address/0xfE715358368416E01d3A961D3a037b7359735d5e#readProxyContract))
    - admin address: [arbitrum:0xa83b095cd14A89717e52718c7244885255e83223](https://arbiscan.io/address/0xa83b095cd14A89717e52718c7244885255e83223)
    - admin type: EOA
        - multisig threshold/signers: N.A

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source: Unknown source.
    - source address: [arbitrum:0xd87D15b80445EC4251e33dBe0668C335624e54b7](https://arbiscan.io/address/0xd87D15b80445EC4251e33dBe0668C335624e54b7)
    - any protections? YES: The price data is updated via `updateRatioBatch` which includes checks for the sent price data in `_checkRatioRules` and can only be called by an address designated as operator. This is protected via the `onlyOperator` modifier. Checks include:
        - zero price checks
        - validity of price update time
        - price growth direction
        - price deviation via a threshold check
    - comment: However, the price data can also be updated from a different EOA which does circumvent the price data validity checks. The `owner` can call `repairRatioFor` and update price data without any validity checks of data. This is dangerous particularly as the `owner` is an EOA and private key leakage can have severe effects. The owner is currently [arbitrum:0xa83b095cd14A89717e52718c7244885255e83223](https://arbiscan.io/address/0xa83b095cd14A89717e52718c7244885255e83223).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.


## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: UNSAFE**

The rate Provider has its price data updated by oracles, which are fed via EOAs. The normal operating procedure of updating prices via a call to `updateRatioBatch` has protections against bad price data. However the upgradeability of the ratio feed and an EOA being able to supply repaired price data without any validity checks does not make these rate providers fit for purpose. 