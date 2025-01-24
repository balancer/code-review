# ERC4626 Vault: `BeefyWrapper`

## Details
- Reviewed by: @franzns
- Checked by: 
- Deployed at:
    - [sonic:0x7870ddFd5ACA4E977B2287e9A212bcbe8FC4135a](https://sonicscan.org/address/0x7870ddFd5ACA4E977B2287e9A212bcbe8FC4135a#code)
- Audits:
    - [4626 wrapper audit](https://github.com/beefyfinance/beefy-audits/blob/master/2023-08-03-Beefy-Zellic-4626-Wrapper-Audit.pdf)


## Context
A 4626 wrapper that can wrap the various Beefy vaults. Its created using their factory at [sonic:0x234f7f81434e340910a84f45f8e89d07fa86611a](https://sonicscan.org/address/0x234f7f81434e340910a84f45f8e89d07fa86611a). 

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the ERC4626. If any of these is unchecked, the the ERC4626 is unfit to use.

- [x] Tests based on the [balancer-v3-monorepo](https://github.com/balancer/balancer-v3-monorepo/tree/main/pkg/vault/test/foundry/fork) pass for the given ERC4626 vaults, which can be found [here](https://github.com/balancer/balancer-v3-erc4626-tests/blob/main/test/sonic/ERC4626BeefyUsdcSilo.sol).
- [x] The required Vault implements the required operational ERC4626 Interface

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in ERC4626 contracts.

If none of these is checked, then this might be a pretty great ERC4626! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a ERC4626 can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the ERC4626.

### Administrative Privileges
- [ ] The ERC4626 Vault is upgradeable. 


### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks.
    - comment: The rate can be influenced by donating to the vault as the vault's total assets are measured via
    ```solidity
    // 
    function totalAssets() public view virtual override returns (uint256) {
        return _asset.balanceOf(address(this));
    }
    ```
    which is part of the `totalAssets` used in the `getRate` calculation.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

The Wrapper is a minimal proxy which means that it has a hardcoded implementation address so by definition nothing can be upgraded.

## Conclusion
**Summary judgment: USABLE**

The outlined ERC4626 Vaults should work well with Balancer pools.