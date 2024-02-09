\<Template: Copy this file and replace all elements inside \<\> brackets. Delete this particular block.\>

# Rate Provider: `\<Name of Reviewed Contract\>`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0xFAe103DC9cf190eD75350761e95403b7b8aFa6c0](https://etherscan.io/token/0xFAe103DC9cf190eD75350761e95403b7b8aFa6c0#readProxyContract)
- Audit report(s):
    - [Swell Liquid Restaking Token](https://github.com/SwellNetwork/v3-core-public/blob/master/Audit%20Reports/Marlin/Sigma_Prime_Swell_Liquid_Restaking_Token_Security_Assessment_Report_v2_0.pdf)

## Context
Swell LRT is an Ethereum liquid restaking protocol. Users have the ability to get access to liquid restaking via a token called rswETH. rswETH is built on Eigenlayer. rswETH reports an exchange rate of ETH - rswETH, which is exposed via a `getRate()` function. The rwsETH Token contract is the Rate Provider.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [x] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address). \<Delete this hint: If unchecked, delete all of the bullets below.\>
    - admin address: [ethereum:0x20fDF47509C5eFC0e1101e3CE443691781C17F90](https://etherscan.io/address/0x20fDF47509C5eFC0e1101e3CE443691781C17F90)
    - admin type: multisig
        - multisig threshold/signers: 3/5

- [x] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price). \<Delete this hint: If unchecked, delete all of the bullets below.\>
    - upgradeable component: `RepricingOracle name` ([ethereum:0xd5A73c748449a45CC7D9f21c7ed3aB9eB3D2e959](https://etherscan.io/address/0xd5A73c748449a45CC7D9f21c7ed3aB9eB3D2e959))
        - admin address: [ethereum:0x20fDF47509C5eFC0e1101e3CE443691781C17F90](https://etherscan.io/address/0x20fDF47509C5eFC0e1101e3CE443691781C17F90)
        - admin type: multisig
            - multisig threshold/signers: 3/5
    
    - upgradeable component: `AccessControlManager` ([ethereum:0x796592b2092F7E150C48643dA19Dd2F28be3333F](https://etherscan.io/address/0x796592b2092F7E150C48643dA19Dd2F28be3333F#readProxyContract))
        - admin address: [ethereum:0x20fDF47509C5eFC0e1101e3CE443691781C17F90](https://etherscan.io/address/0x20fDF47509C5eFC0e1101e3CE443691781C17F90)
        - admin type: multisig
            - multisig threshold/signers: 3/5

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes). \<Delete this hint: If unchecked, delete all of the bullets below.\>
    - source: An offchain component that submits the pricing data as part of a call of `submitSnapshot` to the `RepricingOracle` which has the `BOT` role 
    - source address: [ethereum:0xB29f1af8720e5fd23aA745559d1DEAAe3D9cda17](https://etherscan.io/address/0xB29f1af8720e5fd23aA745559d1DEAAe3D9cda17)
    - any protections? YES: 
        - The `RepricingOracle` does initial checks on the validity of the submitted snapshot data confirming correctly passed metadata.
        - The `reprice()` function of `RswETH` ensures reported prices are within a certain threshold of the old price and reverts if out of bound prices would be reported. This is currently set to 1%.
        ```solidity
        uint256 repriceDiff = _absolute(
        updatedRswETHToETHRateFixed,
        rswETHToETHRateFixed
        );

        uint256 maximumRepriceDiff = wrap(rswETHToETHRateFixed)
            .mul(wrap(maximumRepriceDifferencePercentage))
            .unwrap();

        if (repriceDiff > maximumRepriceDiff) {
            revert RepriceDifferenceTooLarge(repriceDiff, maximumRepriceDiff);
        }
        ```
        - The `reprice()` & ensures time delays are enforced between repricing calls and is currently set to 1 hour.
        ```solidity
        uint256 timeSinceLastReprice = block.timestamp - lastRepriceUNIX;
        if (timeSinceLastReprice < minimumRepriceTime) {
        revert NotEnoughTimeElapsedForReprice(
            minimumRepriceTime - timeSinceLastReprice
        );
        }
        ```

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.


## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

The reviewed Rate Provider can be considered safe for operations with Balancer pools. This however rests on the built in protections of the `reprice()` function which guard against potentially malicious price data reported by the `BOT` role. Reason being that the `BOT` role currently is given to an EOA where private key leak is a risk factor.
