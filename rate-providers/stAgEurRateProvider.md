

# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @rabmarut
- Deployed at:
    - [gnosis:0xff315299C4d3FB984b67e31F028724b6a9aEb077](https://gnosisscan.io/address/0xff315299c4d3fb984b67e31f028724b6a9aeb077#code)
- Audit report(s):
    - [Angle Protocol Audits](https://docs.angle.money/resources/audits)

## Context
The Staked agEUR rate Provider reports on the exchangeRate of 1 staked agEUR (stEUR) for 1 agEUR (agEUR). agEUR is a Euro stablecoin developed by Angle Labs and governed by the Angle DAO. 

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

While this particular rate Provider returns the rate as an 18-decimal fixed point number, this rateProvider will only do so, if the ERC4626's Vault's `asset` has 18 decimals, as this rateProvider returns the rate in the `asset`'s native decimals. 

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [ ] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).

- [x] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price). 
    - upgradeable component: `stEUR` ([gnosis:0x004626A008B1aCdC4c74ab51644093b155e59A23](https://gnosisscan.io/address/0x004626a008b1acdc4c74ab51644093b155e59a23))
        - admin address: [gnosis:0x0F70EeD1Bb51d5eDB1a2E46142638df959bAFD69](https://gnosisscan.io/address/0x0f70eed1bb51d5edb1a2e46142638df959bafd69)
        - admin type: Multisig 
            - multisig threshold/signers: 4/6
            - multisig timelock? NO
    - upgradeable component: `agEUR` ([gnosis:0x4b1E2c2762667331Bc91648052F646d1b0d35984](https://gnosisscan.io/address/0x4b1e2c2762667331bc91648052f646d1b0d35984))
        - admin: same 4/6 multisig as above

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks.

`totalAssets()` which is used during the computation of `convertToAssets()` depends on `_asset.balanceOf(address(this))` making this rateProvider also susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

- N/A

## Conclusion
**Summary judgment: SAFE**

The rateProvider can be used in production. While the entity who has upgrading power is a 4/6 Multisig, an additional Timelock could protect users additionally from malicious admin power. Since this rateProvider'S source-code is created to interact with any ERC4626 Vault, it will only work correctly with ERC4626 Vault's which `asset` have 18 decimals. Care is therefor to be taken.