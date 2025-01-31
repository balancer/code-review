# Rate Provider: `InwstETHsRateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0xae48b92cbc0882a7d70d878e42cc121a62ceb632](https://etherscan.io/address/0xae48b92cbc0882a7d70d878e42cc121a62ceb632#readContract)
- Audit report(s):
    - [InceptionLRT audits](https://docs.inceptionlrt.com/security/audit-reports)

## Context
The InceptionRateProvider is used to build a rate provider for inwstETHs LRT.

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
    - upgradeable component: `RatioFeed` ([ethereum:0xFd73Be536503B5Aa80Bf99D1Fd65b1306c69B191](https://etherscan.io/address/0xFd73Be536503B5Aa80Bf99D1Fd65b1306c69B191#code))
    - admin address: [ethereum:0xa83b095cd14A89717e52718c7244885255e83223](https://etherscan.io/address/0xa83b095cd14A89717e52718c7244885255e83223)
    - admin type: EOA
        - comment: It appears the authorised entity is the `owner` of a ProxyAdmin 

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source: Multisig [ethereum:0x8e6C8799B542E507bfDDCA1a424867e885D96e79](https://etherscan.io/address/0x8e6C8799B542E507bfDDCA1a424867e885D96e79)
    & EOA [ethereum:0xd87D15b80445EC4251e33dBe0668C335624e54b7](https://etherscan.io/address/0xd87D15b80445EC4251e33dBe0668C335624e54b7)
    - any protections? The Multisig is allowed to call `repairRatioFor` which is an update of the rate. The EOA has an Operator role and is allowed to call `updateRatioBatch`.
    Whenever the operator role updates there are sanity checks done on the rate
    ```solidity
    function _checkRatioRules(
        uint256 lastUpdated,
        uint256 newRatio,
        uint256 oldRatio
    ) internal view returns (bool valid, string memory reason) {
        // initialization of the first ratio -> skip checks
        if (oldRatio == 0) return (valid = true, reason);

        if (block.timestamp - lastUpdated < 12 hours)
            return (valid, reason = "update time range exceeds");

        // new ratio should be not greater than a previous one
        if (newRatio > oldRatio)
            return (valid, reason = "new ratio is greater than old");

        // new ratio should be in the range (oldRatio - threshold , oldRatio]
        uint256 threshold = (oldRatio * ratioThreshold) / MAX_THRESHOLD;
        if (newRatio < oldRatio - threshold)
            return (valid, reason = "new ratio too low");

        return (valid = true, reason);
    }
    ```


- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.


## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.


## Conclusion
**Summary judgment: \<SAFE/UNSAFE\>**

\<Delete this hint: Formulate a nuanced conclusion here. Remember, it's okay if some of the boxes above are checked as long as reasonable protections are in place. If the Rate Provider is very obviously safe, say so. If it's very obviously not, say so: what specifically needs to change before it can be considered safe? If the conclusion is hazy, explain why, and leave the final determination up to the reader. Examples of completely unacceptable conditions include, but are not limited to: EOA admins, EOA price sources, market prices (instead of deposit/redemption prices).\>
