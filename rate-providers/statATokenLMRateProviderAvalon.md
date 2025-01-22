# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @franzns
- Checked by: @danielmkm
- Deployed at:
    - [sonic:0x00de97829d01815346e58372be55aefd84ca2457](https://sonicscan.org/address/0x00de97829d01815346e58372be55aefd84ca2457#code)
    - [sonic:0xa6c292d06251da638be3b58f1473e03d99c26ff0](https://sonicscan.org/address/0xa6c292d06251da638be3b58f1473e03d99c26ff0#code)

## Context
The ERC4626 RateProvider fetches the rate of Static Avalon Tokens. The exchange rate is provided by the Aave V3 `POOL` and fetched via `getReserveNormalizedIncome` from the pool and wrapped as part of the `convertToAsset` call to the `StaticATokenLM`. 

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
    - [sonic:0x00de97829d01815346e58372be55aefd84ca2457](https://sonicscan.org/address/0x00de97829d01815346e58372be55aefd84ca2457#code)
        - upgradeable component: `StaticATokenLM` ([sonic:0xA28d4dbcC90C849e3249D642f356D85296a12954](https://sonicscan.org/address/0xA28d4dbcC90C849e3249D642f356D85296a12954#code))
        - admin address: [sonic:0x0c7b588864db1d80365c579205e8618807c6ff01](https://sonicscan.org/address/0x0c7b588864db1d80365c579205e8618807c6ff01)
        - admin owner: [sonic:0x8E23A55B0275a57d6C7ac2922664a9BDbdbCb8D8](https://sonicscan.org/address/0x8E23A55B0275a57d6C7ac2922664a9BDbdbCb8D8)
        - admin type: Multisig.
            - multisig timelock? No.
        - upgradeable component: `Pool` ([sonic:0x974E2B16ddbF0ae6F78b4534353c2871213f2Dc9](https://sonicscan.org/address/0x974E2B16ddbF0ae6F78b4534353c2871213f2Dc9))
        - admin address: [sonic:0x0E2C096dE8b15A0A7E9504D49351f54b2F8C314e](https://sonicscan.org/address/0x0E2C096dE8b15A0A7E9504D49351f54b2F8C314e)
        - admin owner: [sonic:0x8E23A55B0275a57d6C7ac2922664a9BDbdbCb8D8](https://sonicscan.org/address/0x8E23A55B0275a57d6C7ac2922664a9BDbdbCb8D8)
        - admin type: Multisig.
            - multisig timelock? No.

    - [sonic:0xa6c292d06251da638be3b58f1473e03d99c26ff0](https://sonicscan.org/address/0xa6c292d06251da638be3b58f1473e03d99c26ff0#code)
        - upgradeable component: `StaticATokenLM` ([sonic:0xD31E89Ffb929b38bA60D1c7dBeB68c7712EAAb0a](https://sonicscan.org/address/0xD31E89Ffb929b38bA60D1c7dBeB68c7712EAAb0a#code))
        - admin address: [sonic:0xa47f40961b7ffeb68014c8119dbda827939fec1b](https://sonicscan.org/address/0xa47f40961b7ffeb68014c8119dbda827939fec1b#code
        - admin owner: [sonic:0x8E23A55B0275a57d6C7ac2922664a9BDbdbCb8D8](https://sonicscan.org/address/0x8E23A55B0275a57d6C7ac2922664a9BDbdbCb8D8#code)
        - admin type: Multisig.
            - multisig timelock? No.
        - upgradeable component: `Pool` ([sonic:0x974E2B16ddbF0ae6F78b4534353c2871213f2Dc9](https://sonicscan.org/address/0x974E2B16ddbF0ae6F78b4534353c2871213f2Dc9))
        - admin address: [sonic:0x0E2C096dE8b15A0A7E9504D49351f54b2F8C314e](https://sonicscan.org/address/0x0E2C096dE8b15A0A7E9504D49351f54b2F8C314e)
        - admin owner: [sonic:0x8E23A55B0275a57d6C7ac2922664a9BDbdbCb8D8](https://sonicscan.org/address/0x8E23A55B0275a57d6C7ac2922664a9BDbdbCb8D8)
        - admin type: Multisig.
            - multisig timelock? No.

    

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Conclusion
**Summary judgment: SAFE**

The Rate Providers should work well with Balancer pools. The underlying contracts have been audited and been in production for an extended period of time. The upgradeability of the underlying Aave protocol is guarded behind decentralized governance and has a minimum execution delay of 24 hours. 
