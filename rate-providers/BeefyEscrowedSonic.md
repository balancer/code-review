# Rate Provider: `BeefyEscrowedSonic`

## Details
- Reviewed by: @franzns
- Checked by:
- Deployed at:
    - [sonic:0x871A101Dcf22fE4fE37be7B654098c801CBA1c88](https://sonicscan.org/address/0x871A101Dcf22fE4fE37be7B654098c801CBA1c88#code)
- Audits:
    - [Electisec Audit](https://github.com/beefyfinance/beefy-audits/blob/master/2025-04-05-Beefy-Electisec-beS-Audit.pdf)


## Context
Beefy-escrowed Sonic (beS) is an LST on Sonic. The Rate Provider fetches the rate of the beS against the underlying S. Depositing S into beS will automatically delegate it to a validator and update the totalAssets amount. beS already exposes a `getRate()` function which uses `convertToAssets(1e18)`, which is calculated by `shares.mulDiv(totalAssets() + 1, totalSupply() + 10 ** _decimalsOffset(), rounding)`. `totalAssets()` is calculated using  deposit and withdrawal amounts to mitigate any donation vector.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [x] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).
    - [sonic:0x871A101Dcf22fE4fE37be7B654098c801CBA1c88](https://sonicscan.org/address/0x871A101Dcf22fE4fE37be7B654098c801CBA1c88#code)
        - upgradeable component: `beS` ([sonic:0x871A101Dcf22fE4fE37be7B654098c801CBA1c88](https://sonicscan.org/address/0x871A101Dcf22fE4fE37be7B654098c801CBA1c88#code))
        - admin address: [sonic:0x73F97432Adb2a1c39d0E1a6e554c7d4BbDaFC316](https://sonicscan.org/address/0x73F97432Adb2a1c39d0E1a6e554c7d4BbDaFC316#code)
        - admin type: 
            - multisig timelock? YES: 6hrs
        - Timelock admin: [sonic:0x04db327e5d9A0c680622E2025B5Be7357fC757f0](https://sonicscan.org/address/0x04db327e5d9A0c680622E2025B5Be7357fC757f0#code)
            - 3/6 multisig


### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.


## Conclusion
**Summary judgment: SAFE**

Overall this Rate Provider should work well in pool operations with Balancer pools. 
