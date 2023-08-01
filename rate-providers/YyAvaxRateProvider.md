# Rate Provider: `YyAvaxRateProvider`

**NOTE: An earlier version of this review pointed out some issues which have since been addressed. Please consult the git history for reference.**

## Details
- Reviewed by: @mkflow27
- Checked by: @rabmarut
- Deployed at:
    - [avalanche:0x13a80aBe608A054059CfB54Ef08809a05Fc07b82](https://snowtrace.io/address/0x13a80aBe608A054059CfB54Ef08809a05Fc07b82#code)

## Context
Yield Yak's yyAVAX is a liquid staking token which earns yield from aggregated validation on the Avalanche P-Chain.

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
    - upgradeable component: `Portal` ([avalanche:0x4fe8C658f268842445Ae8f95D4D6D8Cfd356a8C8](https://snowtrace.io/address/0x4fe8C658f268842445Ae8f95D4D6D8Cfd356a8C8#code))
        - admin address: [avalanche:0x893b32D796b95De2489900b1646cc30e9eF5337A](https://snowtrace.io/address/0x893b32d796b95de2489900b1646cc30e9ef5337a#code)
        - admin type: multisig
            - multisig threshold/signers: 3/4
            - multisig timelock? NO
            - trustworthy signers? NO (can't identify any)

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source: `gAVAX` accepts updates from an `ORACLE` via the `Portal`
        - `gAVAX` address: [avalanche:0x6026a85e11BD895c934Af02647E8C7b4Ea2D9808](https://snowtrace.io/address/0x6026a85e11BD895c934Af02647E8C7b4Ea2D9808#code)
        - `Portal` address: [avalanche:0xcF5162a33b05Bf45020A2f047d28C2E47E93958b](https://snowtrace.io/address/0x4fe8C658f268842445Ae8f95D4D6D8Cfd356a8C8#code)
        - `ORACLE` address: [avalanche:0xA30694d32533672EF0B9E2288f2b886AE5F949a2](https://snowtrace.io/address/0xa30694d32533672ef0b9e2288f2b886ae5f949a2#code)
            - 3/4 multisig (2 common signers with multisig above)
    - any protections? YES
        - update only once per day in a 30-minute window
        - price increases monotonically
        - maximum increase is 0.2%

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

No additional findings.

## Conclusion
**Summary judgment: SAFE**

Assuming a reasonable set of 3/4 multisig signers, the behavior of this Rate Provider can be deemed safe. Reasonable protections are placed upon oracle updates, so the only concern would be upgradeability, which falls to the multisig.
