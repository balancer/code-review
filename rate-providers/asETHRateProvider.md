# Rate Provider: `Aspida asETH Rate Provider`

## Details
- Reviewed by: @wei3erHase
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - `saETH(Proxy)` [eth:0xF1617882A71467534D14EEe865922de1395c9E89](https://etherscan.io/address/0xF1617882A71467534D14EEe865922de1395c9E89)
    - `saETH(Implementation)` [eth:0xD9F64Ee3DD6F552c1BcfC8862dbD130bc6697a66](https://etherscan.io/address/0xD9F64Ee3DD6F552c1BcfC8862dbD130bc6697a66)
    - `aETH(Proxy)` [eth:0xFC87753Df5Ef5C368b5FBA8D4C5043b77e8C5b39](https://etherscan.io/address/0xFC87753Df5Ef5C368b5FBA8D4C5043b77e8C5b39)
    - `aETH(Implementation)` [eth:0x5f898DC62d699ecBeD578E4A9bEf46009EA8424b](https://etherscan.io/address/0x5f898DC62d699ecBeD578E4A9bEf46009EA8424b)
- Audit report(s):
    - [MixBytes - Aspida Network Contracts Security Audit Report](https://github.com/aspidanet/documents/blob/main/audits/Aspida%20Network%20Contracts%20Security%20Audit%20Report.pdf)

## Context
Aspida's LSD mechanism operates in a dual-token mechanism, saETH is an ERC4626 compliant token that represents a unit of aETH staked in the protocol, while aETH (tradeable, but with no yield) should hold a 1:1 relation with the underlying staked ETH. The staking yield is distributed between the saETH holders, in the form of newly minted aETH.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

### Administrative Privileges
- [ ] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).

- [x] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price). \<Delete this hint: If unchecked, delete all of the bullets below.\>
    - upgradeable component: saETH `ERC4626Upgradeable` [eth:0xF1617882A71467534D14EEe865922de1395c9E89](https://etherscan.io/address/0xF1617882A71467534D14EEe865922de1395c9E89#code)
        - admin address: [eth:0xEC852538b5b6A62390fEE1432756a61834B7D79A](https://etherscan.io/address/0xEC852538b5b6A62390fEE1432756a61834B7D79A)
        - admin type: multisig
            - multisig threshold/signers: 3/5
            - multisig timelock? **NO**
            - trustworthy signers? **NO**, all signers where funded around the multisig creation time, no other relevant activity.
    - upgradeable component: aETH `ERC20PermitUpgradeable` [eth:0xFC87753Df5Ef5C368b5FBA8D4C5043b77e8C5b39](https://etherscan.io/address/0xFC87753Df5Ef5C368b5FBA8D4C5043b77e8C5b39#code)
        - admin address: [eth:0xEC852538b5b6A62390fEE1432756a61834B7D79A](https://etherscan.io/address/0xEC852538b5b6A62390fEE1432756a61834B7D79A)
        - admin type: multisig (same as saETH)

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks.
    - It is possible to inflate the rate through a donation attack, since the rate is read using `aETH.balanceOf(address(this))`. Moreover, the attack would require aETH, and not ETH, considering their respective 1:1 relation another trust assumption. This doesn't mean per-se an exploitable vulnerability, as the rate may be susceptible to being modified, but it keeps a trustfully quote (the rate is increased when more aETH tokens are redeemable per saETH).

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

While the rate pipeline depends exclusively on `saETH` supply and the `aETH` underlying balance, this rate represents `saETH:aETH`, while the ultimate `saETH:ETH` rate incorporates other agents and mechanisms in the pipeline (i.e. RewardOracle).

### L-01: aETH:ETH relation depends on owner actions and treasury solvency
The dual-token mechanism assumes a 1:1 relation between aETH:ETH, yet in the event of slashing, the owner (multisig) needs to call `_recapLoss` specifying the slashed amount, to make the Treasury burn `aETH` tokens to maintain the relation. This action may be subject to frontrunning, as people may be aware about the actual rate before is executed, or it can even revert in an insolvent Treasury scenario (leaving the rate calculation unsynced to reality).

## Conclusion
**Summary judgment: SAFE**

The upgradeability of the whole protocol involves no extra risk on the LPer, who chooses to hold or trade this token, in this sense, the rate provider pipeline can be understood as risk-neutral.

The risk profile could be improved if the signers of the multisig where associated with some identity (X or Github user) or some funds (reduces possibility of sybil attack), instead of being 5 anonymous EOAs.

Both donation susceptibility, and predictable drops in rate (because of slashing) are quite common in all LSDs, which results in no extra safety assumption being made for this particular one.

As a strict "rate provider" between the wrapped `saETH` and underlying token `aETH`, the pipeline presented (despite upgradeable) is overall standard, and doesn't involve external oracles. Yet, the ultimate rate (when compared to `ETH`) may be dependant in more factors, that are not being considered in this review.