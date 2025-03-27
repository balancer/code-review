# ERC4626 Vault: `VicunaWrapper`

## Details
- Reviewed by: @franzns
- Checked by: 
- Deployed at:
    - [sonic:0xdB1E39faC2EeeEdB49198735B12a8e598a84510c](https://sonicscan.org/address/0xdB1E39faC2EeeEdB49198735B12a8e598a84510c#code)
    - [sonic:0x6C2dadFfAB1714485aD87d1926f4c26E29a957b6](https://sonicscan.org/address/0x6C2dadFfAB1714485aD87d1926f4c26E29a957b6#code)
    - [sonic:0x711a93a8bD6803aF0a6122F2dE18c1a6AB7CB29C](https://sonicscan.org/address/0x711a93a8bD6803aF0a6122F2dE18c1a6AB7CB29C#code)
    - [sonic:0xd7c9f62622dB85545731F0E4e5D4556aC8a19832](https://sonicscan.org/address/0xd7c9f62622dB85545731F0E4e5D4556aC8a19832#code)
    - [sonic:0xef23FdCbd9b36Ed99A6C51CaA83Af549c36601CF](https://sonicscan.org/address/0xef23FdCbd9b36Ed99A6C51CaA83Af549c36601CF#code)
- Audits:
    - [Vicuna audits](https://github.com/VicunaFinance-com/Audits)


## Context
Vicuna is an Aave v3 and Beefy fork. They wrap the aTokens into compounding Beefy vaults to compound any rewards into the erc4626. 

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the ERC4626. If any of these is unchecked, the the ERC4626 is unfit to use.

- [x] Tests based on the [balancer-v3-monorepo](https://github.com/balancer/balancer-v3-monorepo/tree/main/pkg/vault/test/foundry/fork) pass for the given ERC4626 vaults, which can be found [here](https://github.com/balancer/balancer-v3-erc4626-tests/blob/main/test/sonic/).
- [x] The required Vault implements the required operational ERC4626 Interface

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in ERC4626 contracts.

If none of these is checked, then this might be a pretty great ERC4626! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a ERC4626 can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the ERC4626.

### Administrative Privileges
- [ ] The ERC4626 Wrapper Vault is upgradeable. 

### Common Manipulation Vectors
- [x] The ERC4626 Vault is susceptible to donation attacks.
    - comment: The ERC4626 wrapper calls the vaults balance for totalAssets() which is part of the `totalAssets` used in the `converToAssets` calculation.

    ```solidity
    /**
     * @notice Fetches the total assets held by the vault
     * @dev Returns the total assets held by the vault, not only the wrapper
     * @return totalAssets the total balance of assets held by the vault
     */
    function totalAssets() public view virtual override returns (uint256) {
        return IVault(vault).balance();
    }
    ```
    The vault calculates it based on underlying balance inside the vault plus the balance inside the strategy.
    ```solidity
    /**
     * @dev It calculates the total underlying value of {token} held by the system.
     * It takes into account the vault contract balance, the strategy contract balance
     *  and the balance deployed in other contracts as part of the strategy.
     */
    function balance() public view returns (uint) {
        return want().balanceOf(address(this)) + IStrategyV7(strategy).balanceOf();
    }
    ```

    The underlying balance can be inflated by donating underlying assets to the vault.


## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: USABLE**

The outlined ERC4626 Vaults should work well with Balancer pools.