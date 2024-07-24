# Rate Provider: `krETHRateProvider` & `ksETHRateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0x8fDDab48DD17dDCeD87730020F4213528042dba3](https://etherscan.io/address/0x8fDDab48DD17dDCeD87730020F4213528042dba3#code)
    - [ethereum:0x1A9fA10CA260387314185B9D7763164FD3D51226](https://etherscan.io/address/0x1A9fA10CA260387314185B9D7763164FD3D51226#code)
- Audit report(s):
    - [Kernel audits](https://drive.google.com/file/d/1MqenDKmDDb6OcsG-0YTlQAwlfFndSk7J/view)

## Context
Kernel Protocol will be offering a suite of Karak Native LRTs that allow users to restake assets on Karak and receive LRT tokens that can be deployed in further yield-bearing DeFi activities. The rate providers in this review are essentially wrappers of downstream LST/LRT rate providers. krETHRateProvider calls weETHRateProvider which calls `WeETH`. The same is true for ksETHRateProvider, which calls into a wstETHRateProvider, which calls into wsteth.

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
    #### krETHRateProvider
    - upgradeable component: `WeETH` ([ethereum:0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee](https://etherscan.io/address/0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee))
    - admin address: [ethereum:0xcdd57D11476c22d265722F68390b036f3DA48c21](https://etherscan.io/address/0xcdd57D11476c22d265722F68390b036f3DA48c21#readProxyContract)
    - admin type: multisig
        - multisig threshold/signers: 4/7
        - multisig timelock? YES: 3 days

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - comment: The explanation of how oracles are involved in the rate setting can be found in the review for `WeETH` [here](./WeETH.md). 

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

### M-01: Missing rate exposure of LSTs used to mint LRTs.
> ksETH: Restake any ETH-denominated LST accepted by Karak (eg Lido’s stETH, Rocket Pool’s rETH etc) via Kernel Protocol to receive our ksETH LRT that can be deployed in further yield-bearing activities. [source](https://medium.com/@vectorreserve/introducing-kernel-protocol-the-first-suite-of-karak-native-lrts-unlocking-liquidity-yields-for-993f4995249d).

For the example of ksETH, the rateProvider exposes the rate based on wsteth's rate. Since the documentation for Kernel states that multiple LSTs can be used to mint ksETH (apxETH, cbETH, rETH, swETH, wstETH), the rate reported by the ksETHRateProvider does not take into account the distribution of LSTs backing ksETH. The same logic applies to krETH.

### M-02: Missing rate exposure of LSTs used to mint LRTs.
Kernel protocol uses Karak to mint LRTs to the user. Karak is a restaking protocol with the intention to generate yield for depositors. However this yield source is not accounted for in the rate providers. This means there is a deviation in rate reported by the rate provider and true rate generated. This will generate arbitrage opportunities between the pool and the protocol around the mint/redeem price.

## Conclusion
**Summary judgment: **

The Kernel protocol rate providers should work well with Balancer pools on a technical. They are essentially wrappers around downstream rate computations and expose this data as part of their onchain scope. However, the rate reported might be inaccurate if multiple LSTs/LRTs are used as deposit assets and if Karak generates yield, the rate reported and the true rate will deviate. 
