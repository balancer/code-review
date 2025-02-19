# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0x8fC43e76874CaE40939eDeB90E5683258B63c508](https://etherscan.io/address/0x8fC43e76874CaE40939eDeB90E5683258B63c508#readContract)
    - [arbitrum:0xeAaf42989c294e2280eFbB0B0f368E806AD8cA69](https://arbiscan.io/address/0xeAaf42989c294e2280eFbB0B0f368E806AD8cA69)
    - [base:0x0bB7028D24b24424485E769bD44b936B315Cb8FC](https://basescan.org/address/0x0bB7028D24b24424485E769bD44b936B315Cb8FC)

- Audit report(s):
    - [Fluid audits](https://docs.fluid.instadapp.io/audits-and-security.html)

## Context
The rate provier provides exchange rates of fweth-weth. The rate provider reads from an ERC4626 Vault where user can deposit underlying assets and receive fweth in return.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be usable despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [ ] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).

- [ ] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price).

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - comment: There is no off-chain component updating the rate but rather a permissionless callable function to update the price
    ```solidity
    function updateRates() public returns (uint256 tokenExchangePrice_, uint256 liquidityExchangePrice_) {
        liquidityExchangePrice_ = _getLiquidityExchangePrice();
        tokenExchangePrice_ = _updateRates(liquidityExchangePrice_, true);
    }
    ```

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: Usable**

The rate providers should work well with Balancer pools.
