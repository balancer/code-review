# Rate Provider: `BalancerRateProvider`

## Details

-   Reviewed by: @mkflow27
-   Checked by: @\<GitHub handle of secondary reviewer\>
-   Deployed at:
    -   [ethereum:0x387dBc0fB00b26fb085aa658527D5BE98302c84C](https://etherscan.io/address/0x387dBc0fB00b26fb085aa658527D5BE98302c84C#readProxyContract)
-   Audit report(s):
    -   [Renzo Protocol](https://github.com/HalbornSecurity/PublicReports/blob/master/Solidity%20Smart%20Contract%20Audits/Renzo_Protocol_EVM_Contracts_Smart_Contract_Security_Assessment_Report_Halborn_Final.pdf)

## Context

Renzo is a Liquid Restaking Token (LRT) and Strategy Manager for EigenLayer. It is the interface to the EigenLayer ecosystem securing Actively Validated Services (AVSs) and offering a higher yield than ETH staking.
ezETH is the liquid restaking token representing a user’s restaked position at Renzo. Users can deposit stETH, rETH, cbETH or native ETH and accordingly receive ezETH. ezETH is a reward bearing token where the underlying restaking positions earn rewards which are reflected in the price of ezETH.

## Review Checklist: Bare Minimum Compatibility

Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

-   [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
-   [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings

Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges

-   [x] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).

    -   admin address: [ethereum:0xD1e6626310fD54Eceb5b9a51dA2eC329D6D4B68A](https://etherscan.io/address/0xD1e6626310fD54Eceb5b9a51dA2eC329D6D4B68A)
        -   admin type: multisig
        -   multisig threshold/signers: 2/3

-   [x] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price).
    -   upgradeable component: `EzEthToken` ([ethereum:0xbf5495Efe5DB9ce00f80364C8B423567e58d2110](https://etherscan.io/address/0xbf5495Efe5DB9ce00f80364C8B423567e58d2110#readProxyContract))
        -   admin address: [ethereum:0xD1e6626310fD54Eceb5b9a51dA2eC329D6D4B68A](https://etherscan.io/address/0xD1e6626310fD54Eceb5b9a51dA2eC329D6D4B68A)
        -   admin type: multisig
            -   multisig threshold/signers: 2/3
    -   upgradeable component: `RestakeManager` ([ethereum:0x74a09653A083691711cF8215a6ab074BB4e99ef5](https://etherscan.io/address/0x74a09653A083691711cF8215a6ab074BB4e99ef5#readProxyContract))
        -   admin address: [ethereum:0xD1e6626310fD54Eceb5b9a51dA2eC329D6D4B68A](https://etherscan.io/address/0xD1e6626310fD54Eceb5b9a51dA2eC329D6D4B68A)
        -   admin type: multisig
            -   multisig threshold/signers: 2/3
    -   upgradeable component: `RoleManager` ([ethereum:0x4994EFc62101A9e3F885d872514c2dC7b3235849](https://etherscan.io/address/0x4994EFc62101A9e3F885d872514c2dC7b3235849#readProxyContract))
        -   admin type:
            -   multisig threshold/signers: 2/3
        -   admin address: [ethereum:0xD1e6626310fD54Eceb5b9a51dA2eC329D6D4B68A](https://etherscan.io/address/0xD1e6626310fD54Eceb5b9a51dA2eC329D6D4B68A)
    -   upgradeable component: `RenzoOracle` ([ethereum:0x5a12796f7e7EBbbc8a402667d266d2e65A814042](https://etherscan.io/address/0x5a12796f7e7EBbbc8a402667d266d2e65A814042#readProxyContract))
        -   admin address: [ethereum:0xD1e6626310fD54Eceb5b9a51dA2eC329D6D4B68A](https://etherscan.io/address/0xD1e6626310fD54Eceb5b9a51dA2eC329D6D4B68A)
        -   admin type: multisig
            -   multisig threshold/signers: 2/3
    -   upgradeable component: `OperatorDelegator` ([ethereum:0xbAf5f3A05BD7Af6f3a0BBA207803bf77e2657c8F](https://etherscan.io/address/0xbAf5f3A05BD7Af6f3a0BBA207803bf77e2657c8F#readProxyContract))
        -   admin address: [ethereum:0xD1e6626310fD54Eceb5b9a51dA2eC329D6D4B68A](https://etherscan.io/address/0xD1e6626310fD54Eceb5b9a51dA2eC329D6D4B68A)
        -   admin type: multisig
            -   multisig threshold/signers: 2/3
    -   upgradeable component: `OperatorDelegator` ([ethereum:0x0B1981a9Fcc24A445dE15141390d3E46DA0e425c](https://etherscan.io/address/0x0B1981a9Fcc24A445dE15141390d3E46DA0e425c))
        -   admin address: [ethereum:0xD1e6626310fD54Eceb5b9a51dA2eC329D6D4B68A](https://etherscan.io/address/0xD1e6626310fD54Eceb5b9a51dA2eC329D6D4B68A)
        -   admin type: multisig
            -   multisig threshold/signers: 2/3

### Oracles

-   [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    -   source: Chainlink
    -   source address: not determinable as LSTs will be added to the protocol in the future which are not available currently.
    -   any protections? Yes: protection against empty oracle address & protection ensuring oracle price is not older than 24 hours.

### Common Manipulation Vectors

-   [x] The Rate Provider is susceptible to donation attacks.

Part of the pricing logic requires the `OperatorDelegator` to read the Ether balance of an address via `address(eigenPod).balance`. Additionally the `RestakeManager` reads the Ether balance of a `depositQueue` via `totalTVL += address(depositQueue).balance;`. This makes the RateProvider susceptible to possible donation attacks.

## Additional Findings

To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion

**Summary judgment: SAFE**

The overall system is complex and the functionality when Renzo protocol is fully operational could not be determined. The reason for that is:
The `RestakeManager`'s `caclculateTVLs` function is involved in the pools price computation. As part of the execution of this function external calls to an `OperatorDelegator` is made to get a tokenBalance. The `OperatorDelegator` calls a to be certainly added in the future contract stored in a mapping called `tokenStrategyMapping` via `userUnderlyingView`. This is pointed out here as it represents a likely addition to the rateProvider scope in the near future that cannot be investigated as of now.

With that many upgradeable components involved in the rate computation a thorough review of the involved implementation contracts was not made and is assumed to be correct.

The current implementation of the rateProvider is considered safe and should work well with Balancer pools. However, this Rate Provider should continue to be monitored until Renzo protocol is fully operational and a majority of LSTs have been added to their system.
