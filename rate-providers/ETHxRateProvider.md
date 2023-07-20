# Rate Provider: `ETHxRateProvider`

## Details
- Reviewed by: @rabmarut
- Checked by: @baileyspraggins, @gerrrg
- Deployed at:
    - [ethereum:0xAAE054B9b822554dd1D9d1F48f892B4585D3bbf0](https://etherscan.io/address/0xAAE054B9b822554dd1D9d1F48f892B4585D3bbf0#code)

## Context
[Stader Labs](https://www.staderlabs.com/) has developed this Rate Provider to price their `ETHx` liquid staking token in terms of `ETH`. At time of writing, `ETHx` has been [audited](https://www.staderlabs.com/docs-v1/Ethereum/Smart_Contract_audits) by Halborn and SigmaPrime.

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
    - upgradeable component: `StaderStakePoolsManager` ([ethereum:0xcf5EA1b38380f6aF39068375516Daf40Ed70D299](https://etherscan.io/address/0xcf5EA1b38380f6aF39068375516Daf40Ed70D299#code))
    - admin address: [ethereum:0x45B977CeCB9Dfaa17dFcBa88826ef684b8489fF6](https://etherscan.io/address/0x45B977CeCB9Dfaa17dFcBa88826ef684b8489fF6#code)
    - admin type: multisig
        - multisig threshold/signers: 6/9
        - multisig timelock? YES: 1 week
        - trustworthy signers? YES: defidad.eth, aavechan.eth (only two immediately recognizable)

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source: `StaderStakePoolsManager` accepts price update proposals from a majority of 7 (minimum 5) nodes
    - source address: [ethereum:0xcf5EA1b38380f6aF39068375516Daf40Ed70D299](https://etherscan.io/address/0xcf5EA1b38380f6aF39068375516Daf40Ed70D299#code)
    - any protections? YES: maximum rate delta is 1%

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

No additional findings.

## Conclusion
**Summary judgment: SAFE**

Upgradeable contracts sourcing price data from off-chain oracles is a pretty common design paradigm. It's not as reliable as immutable on-chain primitives, but as long as reasonable protections are in place, it can be close enough.

In this case, Stader offers lots of protection against manipulation, so I would personally conclude that this rate provider is safe. Rather than trusting my own conclusion, I encourage the reader to examine the data points above and draw their own.
