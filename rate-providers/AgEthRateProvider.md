# Rate Provider: `AgEthRateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0xc276db339e551ecbe0ac323a7c4a5c6ca61813fe](https://etherscan.io/address/0xc276db339e551ecbe0ac323a7c4a5c6ca61813fe#code)

- Audit report(s):
    - [August institutional loan audits](https://institutional-docs.fractalprotocol.org/o6pxRk8iuJtUnSajR9d6/smart-contracts/risks-and-audits)

## Context
The Airdrop Gain vault is designed to maximize your airdrops through a dual strategy: Earning Layer 2 (L2) airdrops and accessing mainnet DeFi opportunities. Here’s how it works:
Upon depositing, the vault issues a liquid token agETH that represents a claim on the deposited assets. This is an ERC-20 token which is a tradable and usable representation of your staked assets within the vault. The deposited assets are then bridged to partner L2 networks. This bridging allows the assets to be used in L2 ecosystems, which are eligible for various airdrop opportunities.

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
    - upgradeable component: `LendingPool` ([ethereum:0xe1B4d34E8754600962Cd944B535180Bd758E6c2e](https://etherscan.io/address/0xe1B4d34E8754600962Cd944B535180Bd758E6c2e))
    - admin address: [ethereum:0x87ff94bB7709c70c6B2018FED12E4Ce0ABbf30Ce](https://etherscan.io/address/0x87ff94bB7709c70c6B2018FED12E4Ce0ABbf30Ce)
    - admin type: multisig
        - multisig threshold/signers: 3/5
    
    - upgradeable component: `LRTOracle` ([ethereum:0x349A73444b1a310BAe67ef67973022020d70020d](https://etherscan.io/address/0x349A73444b1a310BAe67ef67973022020d70020d))
    - admin address: [ethereum:0xb3696a817D01C8623E66D156B6798291fa10a46d](https://etherscan.io/address/0xb3696a817D01C8623E66D156B6798291fa10a46d#code)
    - admin type: multisig
        - multisig threshold/signers: 6/8
        - timelock: 10 days

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    #### Lending Pool
    - source: All whitelisted loans (as of this review 5) can call `notifyPrincipalRepayment` with `effectiveLoanAmount` & `principalRepaid`. Depending on what parameters are supplied, the `globalLoansAmount` is changed. This function does not have any token transfers associated with it. 
    - source address: 
        - [ethereum:0x0014F00f0C9cF179F932Ae15A62d095F8B41349F](https://etherscan.io/address/0x0014F00f0C9cF179F932Ae15A62d095F8B41349F)
        - [ethereum:0xB3862123c98c96bd49Cd456604C45BFb347977De](https://etherscan.io/address/0xB3862123c98c96bd49Cd456604C45BFb347977De#code)
        - [ethereum:0xEeE4414151de8BE6b537a33d57380461d63EE680](https://etherscan.io/address/0xEeE4414151de8BE6b537a33d57380461d63EE680)
        - [ethereum:0x694BdB833224cE459c098915100ef776f2ab2BeB](https://etherscan.io/address/0x694BdB833224cE459c098915100ef776f2ab2BeB)
        - [ethereum:0x38FcA3F85FD01b06b3555FAAac8C3fF38a50e56e](https://etherscan.io/address/0x38FcA3F85FD01b06b3555FAAac8C3fF38a50e56e)
    - any protections? NO: currently these loan contracts are not verified

    #### RsEthPriceOracle
    - source: Custom RsEthPrice calculates price based on stakedAsset value received from Eigenlayer.
    - Source address: [ethereum:0x349A73444b1a310BAe67ef67973022020d70020d](https://etherscan.io/address/0x349A73444b1a310BAe67ef67973022020d70020d)



- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks.
    The rate can be changed by sending `_underlyingAsset` to the vault.
    ```solidity
    function _getTotalAssets() internal view virtual override returns (uint256) {
        // [Liquidity] + [the delta of all ACTIVE loans managed by this pool]
        return globalLoansAmount + _underlyingAsset.balanceOf(address(this));
    }
    ```

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: UNSAFE**
It is impossible to verify the functionality of this rate provider as an essential rate calculation component is unverified on Etherscan.

