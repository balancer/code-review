# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0x479306411084bD75b8Ce9Dd488e64f212b8336b2](https://etherscan.io/address/0x479306411084bD75b8Ce9Dd488e64f212b8336b2#readContract)
- Audit report(s):
    - [Acre audits](https://acre.fi/assets/stbtc-smart-contracts-audit.pdf)

## Context
Users deposit BTC and receive stBTC representing their deposited BTC. The deposited BTC is deployed to Bitcoin layers that use BTC as their Proof-of-Stake asset, generating rewards for stBTC holders.

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
    - upgradeable component: `stBTC` ([ethereum:0xdF217EFD8f3ecb5E837aedF203C28c1f06854017](https://etherscan.io/address/0xdF217EFD8f3ecb5E837aedF203C28c1f06854017))
    - admin address: [ethereum:0x790Dda4c56b3c45d0e4514eDbAaBa30D7129c857](https://etherscan.io/address/0x790Dda4c56b3c45d0e4514eDbAaBa30D7129c857#code)
    - admin type: multisig
        - multisig threshold/signers: 3/7


    - upgradeable component: `Portal` ([ethereum:0xAB13B8eecf5AA2460841d75da5d5D861fD5B8A39](https://etherscan.io/address/0xAB13B8eecf5AA2460841d75da5d5D861fD5B8A39#code))
    - admin address: [ethereum:0x98D8899c3030741925BE630C710A98B57F397C7a](https://etherscan.io/address/0x98D8899c3030741925BE630C710A98B57F397C7a#code)
    - admin type: multisig
        - multisig threshold/signers: 5/9

    #### A note on pricing approach.
    The price is calculated via a totalAssets / totalSupply approach. totalAssets is calculated via
    ```solidity
    function totalAssets() public view override returns (uint256) {
        return
            IERC20(asset()).balanceOf(address(this)) +
            dispatcher.totalAssets() +
            totalDebt;
    }
    ``` 
    Where debt can be publicly minted by anyone if his `allowedDebt[msg.sender]` is not exceeded. The admin who can set this limit for any account is a 3/7 Multisig at [ethereum:0x790Dda4c56b3c45d0e4514eDbAaBa30D7129c857](https://etherscan.io/address/0x790Dda4c56b3c45d0e4514eDbAaBa30D7129c857).


### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks. 
    Various token balances are being read throughout the rate calculation. 

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

This rate provider should work well with Balancer pools. A common mechanism to calculate share price is chosen (totalAssets / totalSupply) and any external contracts which influence the rate or callable functions which influence the rate are properly guarded by multisigs.
