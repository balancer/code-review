# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @danielmkm
- Deployed at:
    - [ethereum:0xf47c506C293319B3bC517Acc371F86B87B03DD5D](https://etherscan.io/address/0xf47c506C293319B3bC517Acc371F86B87B03DD5D#code)
- Audit report(s):
    - [hgETH audit](https://kelpdao.xyz/audits/smartcontracts/Sigma_Prime_hgETH.pdf)

## Context
The rate provider reports the rate of hgETH relative to rsETH. This includes an totalAssets / totalSupply approach, where totalAssets are calculated as a combination of a `globalLoansAmount` + assets held in the vault + reserved amount of rsETH as part of the `gainAdapter`. 

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

    #### hgETH
    - upgradeable component: `GainLendingPool` ([ethereum:0xc824A08dB624942c5E5F330d56530cD1598859fD](https://etherscan.io/address/0xc824A08dB624942c5E5F330d56530cD1598859fD#readProxyContract))
    - admin address: [ethereum:0xFD96F6854bc73aeBc6dc6E61A372926186010a91](https://etherscan.io/address/0xFD96F6854bc73aeBc6dc6E61A372926186010a91#code)
    - admin type: multisig 
        - multisig threshold/signers: 3/5

    #### GainAdapterETH
    - upgradeable component: `GainAdapterETH` ([ethereum:0xB185D98056419029daE7120EcBeFa0DbC12c283A](https://etherscan.io/address/0xB185D98056419029daE7120EcBeFa0DbC12c283A))
    - admin address: [ethereum:0xb9577E83a6d9A6DE35047aa066E3758221FE0DA2](https://etherscan.io/address/0xb9577E83a6d9A6DE35047aa066E3758221FE0DA2)
    - admin type: multisig
        - multisig threshold/signers: 3/5

    #### EthXPriceOracle
    - upgradeable component: `EthXPriceOracle` ([ethereum:0x3D08ccb47ccCde84755924ED6B0642F9aB30dFd2](https://etherscan.io/address/0x3D08ccb47ccCde84755924ED6B0642F9aB30dFd2#readProxyContract))
    - admin address: [ethereum:0xb3696a817D01C8623E66D156B6798291fa10a46d](https://etherscan.io/address/0xb3696a817D01C8623E66D156B6798291fa10a46d#code)
    - admin type: multisig
        - multisig threshold/signers: 6/8
        - multisig timelock? 10 day


### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks.
    Part of the rate calculation depends on the following implementation snippet.
    ```solidity
        function _getTotalAssets() internal view virtual override returns (uint256) {
        // [Liquidity] + [the delta of all ACTIVE loans managed by this pool]
        return globalLoansAmount + _underlyingAsset.balanceOf(address(this));
    }
    ````
    Where the Vault's `asset`'s balance is used.


## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

### M-01: Unverified contracts potentially allowed to influence the rate.

The rate can be changed by unverified contracts. The state variable `globalLoansAmount` (which is a factor of the rate calculation) can be
changed by authorized (currently unverified contracts) calling `notifyPrincipalRepayment`. 

```solidity
    function notifyPrincipalRepayment(
        uint256 effectiveLoanAmount, 
        uint256 principalRepaid
    ) external override nonReentrant ifConfigured onlyKnownLoanContract {
        uint256 newDelta = (principalRepaid < effectiveLoanAmount) ? effectiveLoanAmount - principalRepaid : 0;

        if (_deployedLoans[msg.sender].activeDelta > 0) globalLoansAmount -= _deployedLoans[msg.sender].activeDelta;
        _deployedLoans[msg.sender].activeDelta = newDelta;

        if (newDelta > 0) globalLoansAmount += newDelta;
    }
```

The amount of loanContracts potentially being allowed to call this functions are accessible via `getTotalLoansDeployed` and then iterating through the indexes via `loansDeployed`. The current `globalLoansAmount` is `1253053000000000000000`. 

## Conclusion
**Summary judgment: USABLE**

This rate provider should work will Balancer pools. Users should however take into account that there are currently unverified contracts potentially influencing the rate calculation as outlined above. Besides that upgradeability is guarded behind multisigs. 
