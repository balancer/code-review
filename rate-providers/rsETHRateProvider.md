# Rate Provider: `RsETHRateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0x746df66bc1Bb361b9E8E2a794C299c3427976e6C](https://etherscan.io/address/0x746df66bc1Bb361b9E8E2a794C299c3427976e6C#code)
- Audit report(s):
    - [Kelp Liquid Restaking Token](https://kelp.gitbook.io/kelp/audits)

## Context
rsETH is a Liquid Restaked Token (LRT) issued by Kelp DAO designed to offer liquidity to illiquid assets deposited into restaking platforms, such as EigenLayer. It aims to address the risks and challenges posed by the current offering of restaking. The Rate Provider reports the exchange Rate of rsETH - ETH. 

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
- upgradeable component: `LRTOracle` ([ethereum:0x349A73444b1a310BAe67ef67973022020d70020d](https://etherscan.io/address/0x349A73444b1a310BAe67ef67973022020d70020d))
    - admin address: [ethereum:0xb9577E83a6d9A6DE35047aa066E3758221FE0DA2](https://etherscan.io/address/0xb9577E83a6d9A6DE35047aa066E3758221FE0DA2)
    - admin type: multisig
        - multisig threshold/signers: 3/5

- upgradeable component: `LRTOracle` ([ethereum:0x349A73444b1a310BAe67ef67973022020d70020d](https://etherscan.io/address/0x349A73444b1a310BAe67ef67973022020d70020d))
    - admin address: [ethereum:0x7aad74b7f0d60d5867b59dbd377a71783425af47](https://etherscan.io/address/0x7aad74b7f0d60d5867b59dbd377a71783425af47)
    - admin type: EOA
        - comment: This address is allowed to call `updatePriceOracleFor` changing the target of an external call and potentially forcing the return of a malicious bad pricing component.

- upgradeable component: `LRTConfig` ([ethereum:0x947Cb49334e6571ccBFEF1f1f1178d8469D65ec7](https://etherscan.io/address/0x947Cb49334e6571ccBFEF1f1f1178d8469D65ec7#code))
    - admin address: [ethereum:0xb9577E83a6d9A6DE35047aa066E3758221FE0DA2](https://etherscan.io/address/0xb9577E83a6d9A6DE35047aa066E3758221FE0DA2)
    - admin type: multisig
        - multisig threshold/signers: 3/5
    
- upgradeable component: `RSETH` ([ethereum:0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7](https://etherscan.io/address/0xa1290d69c65a6fe4df752f95823fae25cb99e5a7))
    - admin address: [ethereum:0xb9577E83a6d9A6DE35047aa066E3758221FE0DA2](https://etherscan.io/address/0xb9577E83a6d9A6DE35047aa066E3758221FE0DA2)
    - admin type: multisig
        - multisig threshold/signers: 3/5

- upgradeable component: `EthXPriceOracle` ([ethereum:0x3D08ccb47ccCde84755924ED6B0642F9aB30dFd2](https://etherscan.io/address/0x3D08ccb47ccCde84755924ED6B0642F9aB30dFd2#readProxyContract))
    - admin address: [ethereum:0xb9577E83a6d9A6DE35047aa066E3758221FE0DA2](https://etherscan.io/address/0xb9577E83a6d9A6DE35047aa066E3758221FE0DA2)
    - admin type: multisig
        - multisig threshold/signers: 3/5

- upgradeable component: `SfrxETHPriceOracle` ([ethereum:0x8546A7C8C3C537914C3De24811070334568eF427](https://etherscan.io/address/0x8546A7C8C3C537914C3De24811070334568eF427#readProxyContract))
    - admin address: [ethereum:0xb9577E83a6d9A6DE35047aa066E3758221FE0DA2](https://etherscan.io/address/0xb9577E83a6d9A6DE35047aa066E3758221FE0DA2)
    - admin type: multisig
        - multisig threshold/signers: 3/5

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - comment: Due to allocated time this was not investigated for unmentioned contracts in this review

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.
    - comment: An indication of donation attacks was not found in the investigated contracts but could exist further down the price-fetching contract calls. As a similar item was suggested by Sigma Prime in their [LRT-02](https://kelpdao.xyz/audits/smartcontracts/SigmaPrime.pdf) finding.


## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

### H-01: Part of the pricing pipeline can be upgraded by an EOA. 
The pricing calculation requires an external call to an oracle contract of the allowed assets. The `LRTOracle` reads an asset price via `getAssetPrice`. The target of the external call can be set by calling `updatePriceOracleFor`. Currently 0x7aad74b7f0d60d5867b59dbd377a71783425af47 is allowed to update the oracle target address. Since this is an EOA, the rate Provider is unfit for operations in Balancer pools. 
Recommendation: Set the LRTManager to be a multisig. 

### M-01: Hardcoded stETH price 
The rsETH pricing logic loops over the involved assets pricing oracles. This includes the [pricing oracle for stETH](https://etherscan.io/address/0x4cB8d6DCd56d6b371210E70837753F2a835160c4#code). The price of stETH in the Rate Provider pricing system is set to 1e18 which can pose a risk depending on LIDOs operational staking integrity. 
Recommendation: Consider replacing the hardcoded value to incorporate for example a stETH/ETH Chainlink price feed. 


## Conclusion
**Summary judgment: UNSAFE**

Currently this rateProvider is unfit to use as part of the pricing pipeline depends on an EOA that has administrative privileges to update the oracle address. The oracle address is relevant as it has a direct impact on price calculation.
Upgradeability further down the asset oracle contracts have not been investigated and can exist potentially adding more administrative controls.