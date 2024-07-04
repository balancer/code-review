# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [arbitrum:0x7F55E509006C9Df7594C4819Ba7ebfE6EfE4854b](https://arbiscan.io/address/0x7F55E509006C9Df7594C4819Ba7ebfE6EfE4854b#code)
- Audit report(s):
    - [Mountain protocol audits](https://docs.mountainprotocol.com/reference/security-resources)

## Context
The wUSDM contract is an ERC-4626 (following the tokenized vault standard, leveraging the OpenZeppelin implementation), enabling users to deposit USDM in exchange for wUSDM tokens. The USDM tokens are rebasing, whereas the wUSDM tokens are non-rebasing, making wUSDM easier to integrate in DeFi protocols.

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
    - upgradeable component: `wUSDM` ([arbitrum:0x57F5E098CaD7A3D1Eed53991D4d66C45C9AF7812](https://arbiscan.io/address/0x57F5E098CaD7A3D1Eed53991D4d66C45C9AF7812#readProxyContract))
    - admin address: [arbitrum:0xfD0C148Dd9bfb196D70981b96e27a294e51bd50F](https://arbiscan.io/address/0xfD0C148Dd9bfb196D70981b96e27a294e51bd50F)
    - admin type: EOA
        - multisig threshold/signers: \<X/Y\>
        - multisig timelock? \<YES: minimum duration/NO\>
        - trustworthy signers? \<YES: whom/NO\> \<Delete this hint: Are the signers known entities such as Vitalik, Hudson, samczsun, or Fernando? Or are they random addresses?\>

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks.
    - comment: The rate the rate provider reports can be influenced by donating to the `wUSDM` contract.
    ```solidity
    /** @dev See {IERC4626-totalAssets}. */
    function totalAssets() public view virtual override returns (uint256) {
        return _asset.balanceOf(address(this));
    }
    ```


## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.


## Conclusion
**Summary judgment: UNSAFE**

The wUSDM contract leverages Openzeppelin's ERC4626 implementation with upgradeability functionality. The current account allowed to upgrade the contract is an EOA. In order to mark this rate provider safe, the upgradeability functionality should be moved to a multisig.
