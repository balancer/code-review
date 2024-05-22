# Rate Provider: `csETHRateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0xaC18187f90Bab1081d08dE076a62D1314AAA07C5](https://etherscan.io/address/0xaC18187f90Bab1081d08dE076a62D1314AAA07C5#code)
- Audit report(s):
    - [Claystack audits](https://docs.claystack.com/resources/security#audits)

## Context
csETH is an ERC-20 token, that represents a user's restaked ETH within the Ethereum blockchain, encompassing accumulated rewards, penalties from the consensus layer, as well as MEV and 'tips' from the execution layer.  

While the quantity of csETH remains constant over time, the intrinsic value of the token escalates as on-chain rewards accumulate. Full realization of total gains occurs only upon the token's exchange on the secondary market (e.g. decentralized exchange) or when withdrawals. This type of token is commonly known as a reward-bearing token, and its underlying value is monitored through an exchange rate.

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
    - upgradeable component: `ClayMain` ([ethereum:0x331312DAbaf3d69138c047AaC278c9f9e0E8FFf8](https://etherscan.io/address/0x331312DAbaf3d69138c047AaC278c9f9e0E8FFf8#readProxyContract))
    - admin address: [ethereum:0x36e655069464Be6202e0e4D5Ee9f76034c0ad9b6](https://etherscan.io/address/0x36e655069464Be6202e0e4D5Ee9f76034c0ad9b6)
    - admin type: EOA 
        - timelock? YES: 24 hours.
        - comment: The EOA has a proposer role for the Timelock. 
    - upgradeable component: `NodeManager` ([ethereum:0x349405b80C8bAfd74DA9d4308F3c7b60B4Bf10E5](https://etherscan.io/address/0x349405b80C8bAfd74DA9d4308F3c7b60B4Bf10E5))
    - admin address: [ethereum:0x36e655069464Be6202e0e4D5Ee9f76034c0ad9b6](https://etherscan.io/address/0x36e655069464Be6202e0e4D5Ee9f76034c0ad9b6)
    - admin type: EOA 
        - timelock? YES: 24 hours.
        - comment: The EOA has a proposer role for the Timelock.
    - upgradeable component: `StrategiesManager` ([ethereum:0x93b7a777D333c4F8dce3135bCd3Dac85aD14D708](https://etherscan.io/address/0x93b7a777D333c4F8dce3135bCd3Dac85aD14D708))
    - admin address: [ethereum:0x36e655069464Be6202e0e4D5Ee9f76034c0ad9b6](https://etherscan.io/address/0x36e655069464Be6202e0e4D5Ee9f76034c0ad9b6)
    - admin type: EOA 
        - timelock? YES: 24 hours.
        - comment: The EOA has a proposer role for the Timelock. 
    
    

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source: Part of csETH value accrual depends on reward data being sent to the `NodeManager` & `StrategiesManager` contract. This is done by calling `oracleReport`
    - source address: [ethereum:0xe1Cb60Daba9C625113F7E98c784Dd9839f1334fc](https://etherscan.io/address/0xe1Cb60Daba9C625113F7E98c784Dd9839f1334fc)
    - any protections? There are several protections in place. Since `oracleReport` is an external function, the passed along signatures are validated and various other input data is compared against internal thresholds. 


- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

### \<M-01: Unverified `StrategiesManager` contract>
The pricing pipeline depends on an external call to the `StrategiesManager` contract, which is currently unverified. The same function signature of `getBalance` being called on the `NodeManager` suggests that possibly also oracle data is supplied to the `StrategiesManager` which can currently not be verified.


## Conclusion
**Summary judgment: \<SAFE/UNSAFE\>**

The contract upgradeability risk is guarded behind a 24 hour timelock, which gives LPs time to act if a upgrade is scheduled on the Timelock. While upgrades originating from an EOA are riskier than from properly set up Multisigs, this scenario of a Timelock included suffices as a measure against unwanted upgrades in case of a private key leak. 
However this the impact of the `strategiesManger.getBalance()` cannot be verified at this time, this contract cannot be marked as safe yet.
