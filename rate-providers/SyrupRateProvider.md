# Rate Provider: `SyrupRateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0xd2C59781F1Db84080A0592CE83Fe265642A4a8Eb](https://etherscan.io/address/0xd2c59781f1db84080a0592ce83fe265642a4a8eb#code)
- Audit report(s):
    - [Maple Finance audits](https://maplefinance.gitbook.io/maple/technical-resources/security/security)

## Context
A Maple pool is a contract that acts similar to an ERC4626 Vault and has the full ERC4626 Interface implemented. The Rate Provider reports assets over totalSupply as the rate.

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
    - upgradeable component: `MaplePoolManager` ([ethereum:0x0055c00ba4Dec5ed545A5419C4d430daDa8cb1CE](https://etherscan.io/address/0x0055c00ba4dec5ed545a5419c4d430dada8cb1ce#code))
    - admin address: [ethereum:0xd6d4Bcde6c816F17889f1Dd3000aF0261B03a196](https://etherscan.io/address/0xd6d4Bcde6c816F17889f1Dd3000aF0261B03a196)
    - admin type: multisig 
        - multisig threshold/signers: 4/7

    - upgradeable component: `MapleGlobals` ([ethereum:0x804a6F5F667170F545Bf14e5DDB48C70B788390C](https://etherscan.io/address/0x804a6F5F667170F545Bf14e5DDB48C70B788390C#readProxyContract))
    - admin address: [ethereum:0xd6d4Bcde6c816F17889f1Dd3000aF0261B03a196](https://etherscan.io/address/0xd6d4Bcde6c816F17889f1Dd3000aF0261B03a196)
    - admin type: multisig 
        - multisig threshold/signers: 4/7

    - upgradeable component: `LoanManager` ([ethereum:0x6ACEb4cAbA81Fa6a8065059f3A944fb066A10fAc](https://etherscan.io/address/0x6ACEb4cAbA81Fa6a8065059f3A944fb066A10fAc))
    - admin address: [ethereum:0xd6d4Bcde6c816F17889f1Dd3000aF0261B03a196](https://etherscan.io/address/0xd6d4Bcde6c816F17889f1Dd3000aF0261B03a196)
    - admin type: multisig 
        - multisig threshold/signers: 4/7

    - upgradeable component: `LoanManager` ([ethereum:0x4A1c3F0D9aD0b3f9dA085bEBfc22dEA54263371b](https://etherscan.io/address/0x4A1c3F0D9aD0b3f9dA085bEBfc22dEA54263371b#code))
    - admin address: [ethereum:0xd6d4Bcde6c816F17889f1Dd3000aF0261B03a196](https://etherscan.io/address/0xd6d4Bcde6c816F17889f1Dd3000aF0261B03a196)
    - admin type: multisig 
        - multisig threshold/signers: 4/7
    
### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes). 
    - source: Approved callers set as part of the Maple contract system. There are various functions which influence the rate. These are `triggerDefault()`, `fund()` and `claim()`. These set parameters on the `LoanManager` contracts. All of these callable functions are access control protected to be only callable by the `poolManager` role, `fund()` and `claim()` checks if the caller is a valid loan. 

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks.
Part of the pricing pipeline depends on the balance of an ERC20Token being read. This opens up the opportunity to influence the rate via a token donation.
```solidity
function totalAssets() public view override returns (uint256 totalAssets_) {
    totalAssets_ = IERC20Like(asset).balanceOf(pool);

    uint256 length_ = loanManagerList.length;

    for (uint256 i_; i_ < length_;) {
        totalAssets_ += ILoanManagerLike(loanManagerList[i_]).assetsUnderManagement();
        unchecked { ++i_; }
    }
}
```

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

This Rate Provider should work well with Balancer pools. Risk of upgradeability is guarded behind a 4/7 multisig and callable functions which influence the rate are access controlled. 
