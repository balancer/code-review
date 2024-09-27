# Rate Provider: `PriceFeed`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0x4E4C0ea425bacc68cD2Acbf1cdaa234bE9Dd8742](https://etherscan.io/address/0x4E4C0ea425bacc68cD2Acbf1cdaa234bE9Dd8742)
    - [ethereum:0x3e47F17725628Fde5330C2310B799545ef40C93e](https://etherscan.io/address/0x3e47F17725628Fde5330C2310B799545ef40C93e)
- Audit report(s):
    - [Affine audits](https://docs.affinedefi.com/security/audit-reports)

## Context
Affine ultraLRTs are Symbiotic and Eigenlayer Liquid Restaking Tokens (LRTs). Affine UltraLRT vaults expose an exchange rate of affine vault share <-> affine vault asset via a rate provider. The approach to computing the rate is based on an totalAssets / totalShares approach.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges

#### UltraEthS
- [x] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address). 
    - admin address: [ethereum:0x67Ec3Bb25a5DB6eB7Ba74f6C0b2bA193A3983FB8](https://etherscan.io/address/0x67Ec3Bb25a5DB6eB7Ba74f6C0b2bA193A3983FB8#code)
    - admin type: Multisig
        - multisig threshold/signers: 2/4
        - multisig timelock? YES: 24 hours minDelay. 
        - timelock address: [ethereum:0x4B21438ffff0f0B938aD64cD44B8c6ebB78ba56e](https://etherscan.io/address/0x4B21438ffff0f0B938aD64cD44B8c6ebB78ba56e)
       
- [x] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price).
    - upgradeable component: `UltraLRT` ([ethereum:0xF0a949B935e367A94cDFe0F2A54892C2BC7b2131](https://etherscan.io/address/0xF0a949B935e367A94cDFe0F2A54892C2BC7b2131))
    - admin address: [ethereum:0x67Ec3Bb25a5DB6eB7Ba74f6C0b2bA193A3983FB8](https://etherscan.io/address/0x67Ec3Bb25a5DB6eB7Ba74f6C0b2bA193A3983FB8#code)
    - admin type: Multisig
        - multisig threshold/signers: 2/4
        - multisig timelock? YES: 24 hours minDelay. 
        - timelock address: [ethereum:0x4B21438ffff0f0B938aD64cD44B8c6ebB78ba56e](https://etherscan.io/address/0x4B21438ffff0f0B938aD64cD44B8c6ebB78ba56e)

#### UltraETH
- [x] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address). 
    - admin address: [ethereum:0x551B8c62F961640278506b408a751CC29A3f4471](https://etherscan.io/address/0x551B8c62F961640278506b408a751CC29A3f4471)
    - admin type: EOA
        - multisig threshold/signers: N.A
        - multisig timelock? YES: 24 hours minDelay. 
        - timelock address: [ethereum:0x4B21438ffff0f0B938aD64cD44B8c6ebB78ba56e](https://etherscan.io/address/0x4B21438ffff0f0B938aD64cD44B8c6ebB78ba56e)
       
- [x] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price).
    - upgradeable component: `UltraLRT` ([ethereum:0xF0a949B935e367A94cDFe0F2A54892C2BC7b2131](https://etherscan.io/address/0xF0a949B935e367A94cDFe0F2A54892C2BC7b2131))
    - admin address: [ethereum:0x551B8c62F961640278506b408a751CC29A3f4471](https://etherscan.io/address/0x551B8c62F961640278506b408a751CC29A3f4471)
    - admin type: EOA
        - multisig threshold/signers: N.A
        - multisig timelock? YES: 24 hours minDelay. 
        - timelock address: [ethereum:0x4B21438ffff0f0B938aD64cD44B8c6ebB78ba56e](https://etherscan.io/address/0x4B21438ffff0f0B938aD64cD44B8c6ebB78ba56e)


### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source: Chainlink 
    - source address: [ethereum:0x86392dC19c0b719886221c78AB11eb8Cf5c52812](https://etherscan.io/address/0x86392dC19c0b719886221c78AB11eb8Cf5c52812)
    - any protections? No, the CL feed is only used to price steth.

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [x] The Rate Providers are susceptible to donation attacks.
    - comment: `vaultAssets()` uses a `balanceOf`.
    ```solidity
    /**
     * @notice Get the total assets
     */
    function totalAssets() public view override returns (uint256) {
        return vaultAssets() + delegatorAssets - lockedProfit();
    }

    /**
     * @notice Get the vault liquid assets
     */
    function vaultAssets() public view returns (uint256) {
        return IERC20MetadataUpgradeable(asset()).balanceOf(address(this));
    }
    ```
    Part of the rate depends on the balance of the Vault's asset, which is a common occurrence.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

These rate providers should work well with Balancer pools.  
