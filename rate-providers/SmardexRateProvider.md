# Rate Provider: `WusdnBalancerAdaptor`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0x829de46686cd24edfcd28763a70034b3b9b4d7cd](https://etherscan.io/address/0x829de46686cd24edfcd28763a70034b3b9b4d7cd#code)
- Audit report(s):
    - [Smardex audits](https://docs.smardex.io/ultimate-synthetic-delta-neutral/audits)

## Context
WUSDN an ERC-20 value-accruing token wrapper for USDN. Its balance does not change with each oracle report, but its value in USDNdoes. Internally, it represents the user's share of the total supply of USDNtokens. The rate provider reports the WUSDN rate. 

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be usable despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [ ] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).

- [x] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price).
    - upgradeable component: `UsdnProtocolImpl` ([ethereum:0x656cB8C6d154Aad29d8771384089be5B5141f01a](https://etherscan.io/address/0x656cB8C6d154Aad29d8771384089be5B5141f01a#readProxyContract))
    - admin address: [ethereum:0x1E3e1128F6bC2264a19D7a065982696d356879c5](https://etherscan.io/address/0x1E3e1128F6bC2264a19D7a065982696d356879c5)
    - admin type: multisig
        - multisig threshold/signers: 2/3
    - comment: The safe address has the DEFAULT_ADMIN_ROLE, which allows it to grant all roles by calling grantRole(bytes32 role, address account). For now, they do not plan to upgrade the protocol, but when they do, they plan to grant the role at that time.

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes). 
    - source: Smardex Protocol implementation
    - source address: [ethereum:0x656cB8C6d154Aad29d8771384089be5B5141f01a](https://etherscan.io/address/0x656cB8C6d154Aad29d8771384089be5B5141f01a#readProxyContract)
    The rate is dependant on a state variable called `_divisor`.
    ```solidity
    /// @inheritdoc IUsdn
    function convertToTokens(uint256 amountShares) external view returns (uint256 tokens_) {
        tokens_ = _convertToTokens(amountShares, Rounding.Closest, _divisor);
    }
    ``` which is set as part of the `rebase` function
    ```solidity
    function rebase(uint256 newDivisor)
    external
    onlyRole(REBASER_ROLE)
    returns (bool rebased_, uint256 oldDivisor_, bytes memory callbackResult_) {...}
    ```

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: USABLE**

This rate provider should work well with Balancer pools. 
