# Rate Provider: `hTokenOracleBalancerAdaptor`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0x388BeD0F17Ad5752EBC5b4034226D4c5D33bAA9e](https://etherscan.io/address/0x388BeD0F17Ad5752EBC5b4034226D4c5D33bAA9e#code)
- Audit report(s):
    - [Hinkal audits](https://hinkal-team.gitbook.io/hinkal/hinkal/integrity-check-and-security)

## Context
Hinkal accepts ETH/ERC-20 tokens as deposits, which can be later discreetly swapped, staked, yield-farmed, transferred, or withdrawn without reference to the original deposit address. Each user holds a shielded address where tokens are stored after depositing. The rate provider reviewed reports the rate of hinkalETH via a totalAssets / totalSupply approach of the involved ERC4626 Vault. 

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).

- [x] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price).
    - upgradeable component: `hToken` ([ethereum:0x270B7748CdF8243bFe68FaCE7230ef0fCE695389](https://etherscan.io/address/0x270B7748CdF8243bFe68FaCE7230ef0fCE695389#code))
    - admin address: [ethereum:0x53a1EEB0c182144B27Ca0a2010939DA33ebc207d](https://etherscan.io/address/0x53a1EEB0c182144B27Ca0a2010939DA33ebc207d)
    - admin type: EOA
        - comment: Marked as upgradeable as the address which get's sent Ether from the `hToken` can be changed, thus potentially adding a unknown fallback function that get's called from the `hToken` contract during the `addReward` execution. 
### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price). 

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE

This rate provider should work well with Balancer pools. The rate will increase whenever `addReward` get's called leading to potentially spiking rates (as no reward smoothing is implemented). Depending on the amount of rewards added it could be worthwhile to try to frontrun this with a deposit -> addReward -> withdraw approach. However depositing into the ERC4626 Vault is permissioned. 
