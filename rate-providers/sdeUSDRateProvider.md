# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @danielmkm
- Deployed at:
    - [ethereum:0x414aB7081D3C2d0BA75703A465744DF99c9f9B22](https://etherscan.io/address/0x414aB7081D3C2d0BA75703A465744DF99c9f9B22#readContract)
- Audit report(s):
    - [Elixir audits](https://docs.elixir.xyz/audit)

## Context
deUSD ("decentralized US Dollar") is a fully collateralized synthetic dollar powered by the Elixir Network. Minted by stETH and sDAI, deposited collateral will be used to short ETH, creating a delta neutral position. Through leveraging this funding rate basis trade on Ethereum, the Elixir network creates a synthetic dollar capturing positive funding rates. Even in a negative funding rate environment however, deUSD is built to be resilient.

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
    - upgradeable component: `stdeUSD` ([ethereum:0x5C5b196aBE0d54485975D1Ec29617D42D9198326](https://etherscan.io/address/0x5C5b196aBE0d54485975D1Ec29617D42D9198326#code))
    - admin address: [ethereum:0xD7CDBde6C9DA34fcB2917390B491193b54C24f24](https://etherscan.io/address/0xD7CDBde6C9DA34fcB2917390B491193b54C24f24)
    - admin type: multisig
        - multisig threshold/signers: 3/5
        

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks.
    - comment: The rate can be changed by sending the vault's asset to the vault.
    ```solidity
        /// @notice Returns the amount of deUSD tokens that are vested in the contract.
    function totalAssets() public view override returns (uint256) {
        return IERC20(asset()).balanceOf(address(this)) - getUnvestedAmount();
    }
    ```

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

This rate provider should work well with Balancer pools. The vault implementation uses key functionality of the openzeppelin contract suite with some modifications. 
