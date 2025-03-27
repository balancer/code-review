# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @franzns
- Checked by:
- Deployed at:
    - [sonic:0x6d73714c4b10c7585ba40cd5a92125e7db112eed](https://sonicscan.org/address/0x6d73714c4b10c7585ba40cd5a92125e7db112eed#code)
    - [sonic:0x39db3b2fa46e0c219d44aa28e2ed15eb7b386f5a](https://sonicscan.org/address/0x39db3b2fa46e0c219d44aa28e2ed15eb7b386f5a#code)
    - [sonic:0x1cede7f2f659e27d5f03e9cf8dcf3acca103b042](https://sonicscan.org/address/0x1cede7f2f659e27d5f03e9cf8dcf3acca103b042#code)
    - [sonic:0xd63cf9c8432f2347b53a450d724963696af80b0d](https://sonicscan.org/address/0xd63cf9c8432f2347b53a450d724963696af80b0d#code)
    - [sonic:0xc9b913a047285fbb9b7d7a417f68ec0fb45f272a](https://sonicscan.org/address/0xc9b913a047285fbb9b7d7a417f68ec0fb45f272a#code)
- Audits:
    - [Vicuna audits](https://github.com/VicunaFinance-com/Audits)


## Context
Vicuna is an Aave v3 and Beefy fork. They wrap the aTokens into compounding Beefy vaults to compound any rewards into the erc4626. 
The ERC4626 Rate Provider fetches the rate of the Vicuna vault for assets deposited into their Aave instance. The rate provider was created using the ERC4626 Rateprovider factory which calls convertToAssets on the ERC4626 to expose the rate. The rate of the ERC4626 is calculated by `shares.mulDiv(totalAssets() + 1, totalSupply() + 10 ** _decimalsOffset(), rounding)`.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [x] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).
The rateprovider is not upgradable but part of its infrastructure, specifically the aTokens wrapped in the vault:

    - [sonic:0x6d73714c4b10c7585ba40cd5a92125e7db112eed](https://sonicscan.org/address/0x6d73714c4b10c7585ba40cd5a92125e7db112eed#code)
        - upgradeable component: `aToken` ([sonic:0xFB56Cd34244985222068ae1C384ecE4215528D04](https://sonicscan.org/address/0xFB56Cd34244985222068ae1C384ecE4215528D04#code))
        - admin address: [sonic:0x86cdb4ded52fac7b735913d0236ac068570af9f8](https://sonicscan.org/address/0x86cdb4ded52fac7b735913d0236ac068570af9f8)
        - admin of admin address: [sonic:0x64592138883327ab8009e458231a4b731f2fd8f5](https://sonicscan.org/address/0x64592138883327ab8009e458231a4b731f2fd8f5)
        - admin owner: [sonic:0xaCAdD458dF075eF4B6F423A83d5153a98DE4eF4A](https://sonicscan.org/address/0xaCAdD458dF075eF4B6F423A83d5153a98DE4eF4A)
        - admin type: Multisig 2/4
            - multisig timelock? No.

    - [sonic:0x39db3b2fa46e0c219d44aa28e2ed15eb7b386f5a](https://sonicscan.org/address/0x39db3b2fa46e0c219d44aa28e2ed15eb7b386f5a#code)
        - upgradeable component: `aToken` ([sonic:0x9e07EF144325DAe02ff92910aDd1FE91581D4798](https://sonicscan.org/address/0x9e07EF144325DAe02ff92910aDd1FE91581D4798#code))
        - admin address: [sonic:0x86cdb4ded52fac7b735913d0236ac068570af9f8](https://sonicscan.org/address/0x86cdb4ded52fac7b735913d0236ac068570af9f8)
        - admin of admin address: [sonic:0x64592138883327ab8009e458231a4b731f2fd8f5](https://sonicscan.org/address/0x64592138883327ab8009e458231a4b731f2fd8f5)
        - admin owner: [sonic:0xaCAdD458dF075eF4B6F423A83d5153a98DE4eF4A](https://sonicscan.org/address/0xaCAdD458dF075eF4B6F423A83d5153a98DE4eF4A)
        - admin type: Multisig 2/4
            - multisig timelock? No.

    - [sonic:0x1cede7f2f659e27d5f03e9cf8dcf3acca103b042](https://sonicscan.org/address/0x1cede7f2f659e27d5f03e9cf8dcf3acca103b042#code)
        - upgradeable component: `aToken` ([sonic:0xfb2e5Fd5de4E0757062363dfA44dF2e3654A35A5](https://sonicscan.org/address/0xfb2e5Fd5de4E0757062363dfA44dF2e3654A35A5#code))
        - admin address: [sonic:0x0D8D2221AE6a46770639416Aa253a16422cA65Ad](https://sonicscan.org/address/0x0D8D2221AE6a46770639416Aa253a16422cA65Ad)
        - admin of admin address: [sonic:0xd01A2DE5e1Dd7a0826D8B3367A82FE12b4A640b8](https://sonicscan.org/address/0xd01A2DE5e1Dd7a0826D8B3367A82FE12b4A640b8)
        - admin owner: [sonic:0xaCAdD458dF075eF4B6F423A83d5153a98DE4eF4A](https://sonicscan.org/address/0xaCAdD458dF075eF4B6F423A83d5153a98DE4eF4A)
        - admin type: Multisig 2/4
            - multisig timelock? No.

    - [sonic:0xd63cf9c8432f2347b53a450d724963696af80b0d](https://sonicscan.org/address/0xd63cf9c8432f2347b53a450d724963696af80b0d#code)
        - upgradeable component: `aToken` ([sonic:0x11054544BEbab950B3B2F88fBb73B10550d4FF5c](https://sonicscan.org/address/0x11054544BEbab950B3B2F88fBb73B10550d4FF5c#code))
        - admin address: [sonic:0x0D8D2221AE6a46770639416Aa253a16422cA65Ad](https://sonicscan.org/address/0x0D8D2221AE6a46770639416Aa253a16422cA65Ad)
        - admin of admin address: [sonic:0xd01A2DE5e1Dd7a0826D8B3367A82FE12b4A640b8](https://sonicscan.org/address/0xd01A2DE5e1Dd7a0826D8B3367A82FE12b4A640b8)
        - admin owner: [sonic:0xaCAdD458dF075eF4B6F423A83d5153a98DE4eF4A](https://sonicscan.org/address/0xaCAdD458dF075eF4B6F423A83d5153a98DE4eF4A)
        - admin type: Multisig 2/4
            - multisig timelock? No.

    - [sonic:0xc9b913a047285fbb9b7d7a417f68ec0fb45f272a](https://sonicscan.org/address/0xc9b913a047285fbb9b7d7a417f68ec0fb45f272a#code)
        - upgradeable component: `aToken` ([sonic:0x0127C186D905Ddaf323e76c4f6AB41cDD66619e5](https://sonicscan.org/address/0x0127C186D905Ddaf323e76c4f6AB41cDD66619e5#code))
        - admin address: [sonic:0x0D8D2221AE6a46770639416Aa253a16422cA65Ad](https://sonicscan.org/address/0x0D8D2221AE6a46770639416Aa253a16422cA65Ad)
        - admin of admin address: [sonic:0x64592138883327ab8009e458231a4b731f2fd8f5](https://sonicscan.org/address/0x64592138883327ab8009e458231a4b731f2fd8f5)
        - admin owner: [sonic:0xaCAdD458dF075eF4B6F423A83d5153a98DE4eF4A](https://sonicscan.org/address/0xaCAdD458dF075eF4B6F423A83d5153a98DE4eF4A)
        - admin type: Multisig 2/4
            - multisig timelock? No.



### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks.
    - comment: The ERC4626 wrapper calls the vaults balance for totalAssets() which is part of the `totalAssets` used in the `converToAssets` call and therefore in the `getRate` calculation.

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
**Summary judgment: SAFE**

Overall this Rate Provider should work well in pool operations with Balancer pools. 
