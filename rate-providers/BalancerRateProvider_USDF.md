# Rate Provider: `BalancerRateProvider` (USDF)

## Details
- Reviewed by: @rabmarut
- Checked by: @gerrrg
- Deployed at:
    - [arbitrum:0xD438f19b1Dd47EbECc5f904d8Fd44583CbFB7c85](https://arbiscan.io/address/0xd438f19b1dd47ebecc5f904d8fd44583cbfb7c85#code)
- Audit report(s):
    - [Zellic - Fractal Protocol - April 2023](https://docs.fractalprotocol.org/smart-contracts/risks-and-audits#zellic-audit-august-2023)

## Context
Lenders can deposit USDC into Fractal's permissionless pool to earn stable yield. Assets deposited in the pool are used to extend margin loans to borrowers. Deposits are represented by the yield-bearing USDF token, whose price is tracked by the `BalancerRateProvider`.

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
    - upgradeable component `Vault`
        - entry point: ([arbitrum:0x80e1a981285181686a3951B05dEd454734892a09](https://arbiscan.io/address/0x80e1a981285181686a3951b05ded454734892a09#code))
        - implementation reviewed: ([arbitrum:0x038C8535269E4AdC083Ba90388f15788174d7da7](https://arbiscan.io/address/0x038c8535269e4adc083ba90388f15788174d7da7#code))
    - admin address: [arbitrum:0x26c29AEa290eA21f7c44BD38B6c2F5C4C7E6A241](https://arbiscan.io/address/0x26c29aea290ea21f7c44bd38b6c2f5c4c7e6a241#code)
    - admin type: multisig
        - multisig threshold/signers: 3/4
        - multisig timelock? NO
        - trustworthy signers? NO (none recognized)

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source: `Vault` accepts updates from a multisig `owner` (same as proxy admin).
        - source address: ([arbitrum:0x80e1a981285181686a3951B05dEd454734892a09](https://arbiscan.io/address/0x80e1a981285181686a3951b05ded454734892a09#code))
        - multisig address: [arbitrum:0x26c29AEa290eA21f7c44BD38B6c2F5C4C7E6A241](https://arbiscan.io/address/0x26c29aea290ea21f7c44bd38b6c2f5c4c7e6a241#code)
            - multisig threshold/signers: 3/4
            - multisig timelock? NO
            - trustworthy signers? NO (none recognized)
    - any protections? YES
        - Maximum 1% price fluctuation on each update.
        - Update frequency capped to once every 24 hours.

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

- N/A

## Conclusion
**Summary judgment: SAFE**

The `BalancerRateProvider` for USDF is deemed safe for usage. Although price updates come from a trusted entity, they are reasonably constrained (1% max delta every 24 hours). Currently, that entity is a 3/4 Gnosis Safe with unclear signers, but even an EOA would be quite limited in its price update powers.

It is worth noting that the same 3/4 multisig has upgrade authority over the entire USDF `Vault` implementation, and any protections could be rendered moot by a contract upgrade. Users should be careful to understand the trust they place in this multisig and try to identify and vet the signers if possible.

This review also makes no determination as to the security of the USDF token itself or the Fractal protocol, as it is laser-focused on Balancer integration with the `BalancerRateProvider`. Before investing your funds in any DeFi protocol, please consult its source code, documentation, and historical audits.
