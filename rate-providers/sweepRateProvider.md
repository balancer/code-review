# Rate Provider: `BalancerAMM`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0x9cE2837d6d84bb521A5a3002a2132B9E9E9cc4C8](https://etherscan.io/address/0x9cE2837d6d84bb521A5a3002a2132B9E9E9cc4C8#code)
    - [arbitrum:0x3bB6861c0Be6673809D55b9D346b6774B634a9D7](https://arbiscan.io/address/0x3bB6861c0Be6673809D55b9D346b6774B634a9D7)
    - [optimism:0x33A48e4aA79A66fc4f7061f5D9E274528C213029](https://optimistic.etherscan.io/address/0x33A48e4aA79A66fc4f7061f5D9E274528C213029)
    - [avalanche:0x709d075147a10495e5c3bBF3dfc0c138F34C6E72](https://snowtrace.dev/address/0x709d075147a10495e5c3bBF3dfc0c138F34C6E72/contract/43114/code)
- Audit report(s):
    - [Sweep protocol audit report](https://github.com/SweeprFi/sweepr-contracts/blob/main/audits/sublime/Sweep%20Protocol%20Audit%20Report.pdf)

## Context
SWEEP is a dollar-denominated coin for savers. Stablecoin holders can swap into SWEEP to get improved interest pass-through, proof of reserves, and asset protection. Sweep pays interest through an increase in the value of the SWEEP coin. The interest rate is modified once per week in order to balance the demand for savings with the supply of investment. The Rate Provider reports a target price the Sweep protocol intends to build the peg of SWEEP around. 


## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.
    - comment: the underlying decimals are assumed to be fixed to 6 decimals as outlined in the SWEEP codebase. 

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [ ] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).

- [x] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price).
    - upgradeable component: `SweepCoin` ([ethereum:0xB88a5Ac00917a02d82c7cd6CEBd73E2852d43574](https://etherscan.io/address/0xB88a5Ac00917a02d82c7cd6CEBd73E2852d43574#readProxyContract))
    - admin address: [ethereum:0x3afd8feED6Bbd1D8254d92eAFA1F695Dce16387a](https://etherscan.io/address/0x70dd60bc899675abae27623fd5a508f8a28e7c91#readContract)
    - admin type: multisig
        - multisig threshold/signers: 2/3
    - upgradeable component `SweepCoin` ([arbitrum:0xB88a5Ac00917a02d82c7cd6CEBd73E2852d43574](https://arbiscan.io/address/0xB88a5Ac00917a02d82c7cd6CEBd73E2852d43574))
    - admin address: [arbitrum:0x23Ab3E2954Ec5577730B7674f4bA9e78Eb96C4d1](https://arbiscan.io/address/0x23Ab3E2954Ec5577730B7674f4bA9e78Eb96C4d1#code)
    - admin type: multisig
        - multisig threshold/signers: 2/3
    - upgradeable component: `SweepCoin` ([optimism:0xB88a5Ac00917a02d82c7cd6CEBd73E2852d43574](https://etherscan.io/address/0xB88a5Ac00917a02d82c7cd6CEBd73E2852d43574#readProxyContract))
    - admin address: [optimism:0xE0585bDaee364deAd2683c5Aa1520B87F1d2FBAD](https://optimistic.etherscan.io/address/0xE0585bDaee364deAd2683c5Aa1520B87F1d2FBAD#readContract)
    - admin type: multisig
        - multisig threshold/signers: 2/3
    - upgradeable component: `SweepCoin` ([avalanche:0xB88a5Ac00917a02d82c7cd6CEBd73E2852d43574](https://snowtrace.dev/address/0xB88a5Ac00917a02d82c7cd6CEBd73E2852d43574/contract/43114/code))
    - admin address: [avalanche:0x04997790D83C9f8021c63f6f613458507B73056c](https://snowtrace.dev/address/0x04997790D83C9f8021c63f6f613458507B73056c/contract/43114/code)
    - admin type: multisig
        - multisig threshold/signers: 2/3

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source: The `Balancer` contracts acts as a passthrough of some pricing data. The price provided by the Rate Provider can be influenced by calling either `setInterestRate` or `setTargetPrice` on `SweepCoin`. Both functions are guarded behind an `onlyBalancer` modifier. The `Balancer` contract exposes both functions with the same name. These functions can only be accessed by a multisig or governance (modifier `onlyMultisigOrGov`). 
    - source address:
        - owner: [ethereum:0x3afd8feED6Bbd1D8254d92eAFA1F695Dce16387a](https://etherscan.io/address/0x3afd8feED6Bbd1D8254d92eAFA1F695Dce16387a)
        - fast multisig: [ethereum:0x3afd8feED6Bbd1D8254d92eAFA1F695Dce16387a](https://etherscan.io/address/0x3afd8feED6Bbd1D8254d92eAFA1F695Dce16387a)
    - any protections? `setTargetPrice` has zero input checks and variance protection via a threshold.
    - source address:
        - owner: [arbitrum:0x23Ab3E2954Ec5577730B7674f4bA9e78Eb96C4d1](https://arbiscan.io/address/0x23Ab3E2954Ec5577730B7674f4bA9e78Eb96C4d1)
        - fast multisig: [arbitrum:0x23Ab3E2954Ec5577730B7674f4bA9e78Eb96C4d1](https://arbiscan.io/address/0x23Ab3E2954Ec5577730B7674f4bA9e78Eb96C4d1)
    - any protections? `setTargetPrice` has zero input checks and variance protection via a threshold.
    - source address:
        - owner: [optimism:0xE0585bDaee364deAd2683c5Aa1520B87F1d2FBAD](https://optimistic.etherscan.io/address/0xE0585bDaee364deAd2683c5Aa1520B87F1d2FBAD)
        - fast multisig: [optimism:0xE0585bDaee364deAd2683c5Aa1520B87F1d2FBAD](https://optimistic.etherscan.io/address/0xE0585bDaee364deAd2683c5Aa1520B87F1d2FBAD)
    - any protections? `setTargetPrice` has zero input checks and variance protection via a threshold.
    - source address:
        - owner: [avalanche:0x04997790D83C9f8021c63f6f613458507B73056c](https://snowtrace.dev/address/0x04997790D83C9f8021c63f6f613458507B73056c)
        - fast multisig: [avalanche:0x04997790D83C9f8021c63f6f613458507B73056c](https://snowtrace.dev/address/0x04997790D83C9f8021c63f6f613458507B73056c)
    - any protections? `setTargetPrice` has zero input checks and variance protection via a threshold.

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

This Rate Provider system is based on a multisig supplying price data. Protections against this multisig supplying bad prices are in place. Input validation has been added in the form of protecting against `0` (zero) price input and against prices outside the allowed threshold being supplied. This Rate Provider should work well with Balancer Pools.