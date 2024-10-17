# Rate Provider: `EzRVault`

## Details
- Reviewed by: @mkflow27
- Checked by: @danielmkm
- Deployed at:
    - [ethereum:0xd4fcde9bb1d746Dd7e5463b01Dd819EE06aF25db](https://etherscan.io/token/0xd4fcde9bb1d746dd7e5463b01dd819ee06af25db#readProxyContract)
- Audit report(s):
    - [Renzo audits](https://docs.renzoprotocol.com/docs/security/audits)

## Context
$ezEIGEN is a reward-bearing token similar to Compound’s cTokens. $ezEIGEN holders earn $EIGEN rewards that will be auto-compounded and reflected in the price of $ezEIGEN. As a result, the value of $ezEIGEN increases over time relative to the underlying $EIGEN as it accumulates more rewards. 

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [x] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).
    - admin address: [ethereum:0xD1e6626310fD54Eceb5b9a51dA2eC329D6D4B68A](https://etherscan.io/address/0xD1e6626310fD54Eceb5b9a51dA2eC329D6D4B68A#code)
    - admin type: multisig
        - multisig threshold/signers: 3/5
        - multisig timelock? [timelock](https://etherscan.io/address/0x81F6e9914136Da1A1d3b1eFd14F7E0761c3d4cc7) YES: 3 days

- [x] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price).
    - upgradeable component: `EigenStrategy` ([ethereum:0xaCB55C530Acdb2849e6d4f36992Cd8c9D50ED8F7](https://etherscan.io/address/0xaCB55C530Acdb2849e6d4f36992Cd8c9D50ED8F7#readProxyContract))
    - admin address: [ethereum:0x369e6F597e22EaB55fFb173C6d9cD234BD699111](https://etherscan.io/address/0x369e6F597e22EaB55fFb173C6d9cD234BD699111)
    - admin type: multisig
        - multisig threshold/signers: 1/2
        - comment: This contract is part of the Eigenlayer system and not part of the Renzo protocol domain.

    - upgradeable component: `StrategyManager` ([ethereum:0x858646372CC42E1A627fcE94aa7A7033e7CF075A](https://etherscan.io/address/0x858646372CC42E1A627fcE94aa7A7033e7CF075A))
    - admin address: [ethereum:0x369e6F597e22EaB55fFb173C6d9cD234BD699111](https://etherscan.io/address/0x369e6F597e22EaB55fFb173C6d9cD234BD699111)
    - admin type: multisig
        - multisig threshold/signers: 1/2
        - comment: This contract is part of the Eigenlayer system and not part of the Renzo protocol domain.

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks.
    - comment: The rate can be influenced via a token donation as part of th rate calculation requires the execution of the function 
    ```solidity
    function _tokenBalance() internal view virtual returns (uint256) {
        return underlyingToken.balanceOf(address(this));
    }
    ```

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

This rate provider should work well with Balancer pools. The upgradeability of the contracts in Renzo protocol's domain are guarded behind a multisig and a Timelock. However the callchain of the rate provider has downstream dependencies on Eigenlayer contracts which are upgradeable by a 1/2 Multisig. 
