# Rate Provider: `DSRBalancerRateProviderAdapter`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [base:0xeC0C14Ea7fF20F104496d960FDEBF5a0a0cC14D0](https://basescan.org/address/0xeC0C14Ea7fF20F104496d960FDEBF5a0a0cC14D0#code)
    - [optimism:0x15ACEE5F73b36762Ab1a6b7C98787b8148447898](https://optimistic.etherscan.io/address/0x15ACEE5F73b36762Ab1a6b7C98787b8148447898#code)
- Audit report(s):
    - [sDAI audits](https://github.com/makerdao/sdai/blob/master/audits/ChainSecurity_Oazo_Apps_Limited_Savings_Dai_audit_1.pdf)

## Context
The Rate Provider calculates and reports the exchange rate of 1sDAI in terms of DAI. Most parameters used in the rate calculation are bridged from Maker DAO contracts on the mainnet (`Pot`) to Optimism/base using the official message bridging approach.
## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [ ] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).

- [ ] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price).

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source: Data bridged from Ethereum Mainnet via Base messaging bridge ([ethereum:0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1](https://etherscan.io/address/0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1))
    - source address: [ethereum:0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7](https://etherscan.io/address/0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7)
    - any protections? YES: Since `setPotData()` on the Optimism receiver ([`DSROracleReceiverOptimism`](https://basescan.org/address/0xaDEAf02Ddb5Bed574045050B8096307bE66E0676#code)) & ([`DSROracleReceiverOptimism`](https://optimistic.etherscan.io/address/0xE206AEbca7B28e3E8d6787df00B010D4a77c32F3#code)) contract is `external` visibility the access control is achieved by implementing the `onlyCrossChainMessage` modifier. 
        ```solidity
        function _onlyCrossChainMessage() internal view {
            require(msg.sender == address(l2CrossDomain), "Receiver/invalid-sender");
            require(_getL1MessageSender() == l1Authority, "Receiver/invalid-l1Authority");
        }
        ```
        The receiver contract on base & optimism calls into the [`DSRAuthOracle`](https://basescan.org/address/0x2Dd2a2Fe346B5704380EfbF6Bd522042eC3E8FAe#code)'s & [`DSRAuthOracle`](https://optimistic.etherscan.io/address/0x33a3aB524A43E69f30bFd9Ae97d1Ec679FF00B64#code)'s `setPotData()` which is access gated to the current `DATA_PROVIDER_ROLE` being the `DSROracleReceiverOptimism` contract on the respective network.
        The RateProviders read the data from the `DSRAuthOracle` contract via `getConversionRateBinomialApprox()`. So naturally any dangerous storage updates to the Oracle contract influence the price provided by the Rate Provider. 
        Additionally the `DSRAuthOracle` contract performs sanity checks on the data being updated. Such as enforcing checking no stale data is being supplied in the form of `rho`, also that `dsr` is bound by a maximum and a minimum. Similarly `chi` is checked for proper bounds.
        These checks ensure accurate data is accessible from the Rate Provider.


- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

The Rate Providers are expected to integrate well with Balancer pools. The non-upgradeability of the pricing pipeline serves as an additional feature that helps minimize potential risks associated with supplying inaccurate data. To maintain data accuracy on L2, the `refresh` function on the L1  forwarder contracts [DSROracleForwarderBase](https://etherscan.io/address/0x8Ed551D485701fe489c215E13E42F6fc59563e0e#code) & [DSROracleForwarderOptimism](https://etherscan.io/address/0x4042127DecC0cF7cc0966791abebf7F76294DeF3#writeContract) should be invoked regularly.