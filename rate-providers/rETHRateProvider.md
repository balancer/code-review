# Rate Provider: `RocketBalancerRateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [arbitrum:0xd4e96ef8eee8678dbff4d535e033ed1a4f7605b7](https://arbiscan.io/address/0xd4e96ef8eee8678dbff4d535e033ed1a4f7605b7#readContract)
- Audit report(s):
    - [Protocol Audits](https://rocketpool.net/protocol/security)

## Context
rETH is a token that represents a regular user’s deposit into the staking pool. Users receive an equivalent value of rETH token for each ETH coin they deposit. As interest is earned by staking on the Ethereum network the value of the rETH token increases with respect to ETH. This token does not need to be locked within the network and it can be traded, sold or held as the user desires.

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
    - upgradeable component: `RocketStorage` ([ethereum:0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46](https://etherscan.io/address/0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46#code))
    - admin address: `RocketNetworkBalances` ([ethereum:0x07fcabcbe4ff0d80c2b1eb42855c0131b6cba2f4](https://etherscan.io/address/0x07fcabcbe4ff0d80c2b1eb42855c0131b6cba2f4#code))
    - admin type: Smart Contract
        - comment: While `RocketNetworkBalances` is allowed to call `rocketStorage.setAddress` it does not have this functionality implemented. 

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source: The `onlyTrustedNodes` modifiers ensures that the caller, which updates pricing data is a trusted `msg.sender`. A list of nodes which can successfully update `RocketStorage` via `RocketNetworkBalances.updateBalances` is out of scope here.
    - any protections? YES: Many protections are in place to ensure only valid core rocket pool protocol data is submitted. Such as: Timestamp protection, duplicate submissions, unique submitters, threshold protection.


### Common Manipulation Vectors
- [X] The Rate Provider is susceptible to donation attacks. As a precaution this is ticked, as the network of trusted nodes is allowed to submit a parameter called `_totalETH` that is used as payload for `setTotalETHBalance`. It is likely one trusted node might compute the `_totalETH` balance via checking `address.balance`. 



## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

### \<M-01: Owner of address(RocketArbitrumPriceMessenger) on Arbitrum can halt rate update of the oracle\>
The rETH - ETH exchange rate the rate Provider reads is based on a state variable of the `RocketArbitrumPriceOracle`. This rate can be updated via a message from L1 to L2 and `updateRate` verifies that the update originates from the correct address on the L1. However updating the `owner` state variable of the `RocketArbitrumPriceOracle` is based on the non-transformation of the L1 address. Meaning. The owner of the private key of address (0x312FcFB03eC9B1Ea38CB7BFCd26ee7bC3b505aB1) can update the `RocketArbitrumPriceOracle` `owner` variable and make the intended update of the rate (by message from L1->L2 fail). 
## Conclusion
**Summary judgment: SAFE**

Rocket Pool protocol has been operational for many years and it's protocol operations have been sound. The calculated rate gets bridged to Arbitrum via the suggested methods by Arbitrum (see: https://docs.arbitrum.io/arbos/l1-to-l2-messaging). The core check that determines who is allowed to update the rate on Arbitrum is implemented. This rate Provider should work well with Balancer pools. 
