# Rate Provider: `VaultRateOracle`

## Details
- Reviewed by: @mkflow27
- Checked by: @danielmkm
- Deployed at:
    - [ethereum:0x20EDB9299Ae83D9f22bE16279a4A2B422F34d020](https://etherscan.io/address/0x20EDB9299Ae83D9f22bE16279a4A2B422F34d020#code)
    - [ethereum:0x9D09c1E832102A23215e27E85B37b139aEe95Ff4](https://etherscan.io/address/0x9D09c1E832102A23215e27E85B37b139aEe95Ff4#code)
    - [ethereum:0x6984F8E8ce474B69A2F32bE7dEc4d003d644B4B7](https://etherscan.io/address/0x6984F8E8ce474B69A2F32bE7dEc4d003d644B4B7#code)
    - [ethereum:0x3A2228C7B3Bc3A32AEa9338d0A890A5EbD7bc977](https://etherscan.io/address/0x3A2228C7B3Bc3A32AEa9338d0A890A5EbD7bc977#code)
    - [ethereum:0x34406A8Ee75B5af34F8920D1960AC6a5B33A47b6](https://etherscan.io/address/0x34406A8Ee75B5af34F8920D1960AC6a5B33A47b6#readContract)
    - [ethereum:0x2A2f1b8c02Dafc5359B8E0e8BFc138400CB6d3a1](https://etherscan.io/address/0x2A2f1b8c02Dafc5359B8E0e8BFc138400CB6d3a1#readContract)
    - [ethereum:0x1a9DBa2dC3E82F53d040701F97DC0438d26A4320](https://etherscan.io/address/0x1a9DBa2dC3E82F53d040701F97DC0438d26A4320#readContract)
- Audit report(s):
    - [Mellow LRT audits](https://docs.mellow.finance/mellow-lrt-primitive/audits)

## Context
Mellow is a sandbox for LRTs. It allows to create LRTs for various risk profiles. The VaultRateOracle acts as a rate provider for mellow Vaults. 

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
    #### Steakhouse Restaking Vault (steakLRT)
    - upgradeable component: `Vault` ([ethereum:0xBEEF69Ac7870777598A04B2bd4771c71212E6aBc](https://etherscan.io/address/0xBEEF69Ac7870777598A04B2bd4771c71212E6aBc#readProxyContract))
    - admin address: [ethereum:0x81698f87C6482bF1ce9bFcfC0F103C4A0Adf0Af0](https://etherscan.io/address/0x81698f87C6482bF1ce9bFcfC0F103C4A0Adf0Af0#code)
    - admin type: multisig
        - multisig threshold/signers: 5/8
    - comment: The `ADMIN_ROLE`has the capability to add new Tvl modules, which are target of an external call. An rogue `ADMIN_ROLE`could add malicious modules potentially inflating the the price. This functionality currently resides within: [ethereum:0x9437B2a8cF3b69D782a61f9814baAbc172f72003](https://etherscan.io/address/0x9437B2a8cF3b69D782a61f9814baAbc172f72003#code)
    #### Re7 Labs LRT (Re7LRT)
    - upgradeable component: `Vault` ([ethereum:0x84631c0d0081FDe56DeB72F6DE77abBbF6A9f93a](https://etherscan.io/address/0x84631c0d0081FDe56DeB72F6DE77abBbF6A9f93a))
    - admin address: [ethereum:0x81698f87C6482bF1ce9bFcfC0F103C4A0Adf0Af0](https://etherscan.io/address/0x81698f87C6482bF1ce9bFcfC0F103C4A0Adf0Af0)
    - admin type: multisig
        - multisig threshold/signers: 5/8
    - comment: The `ADMIN_ROLE`has the capability to add new Tvl modules, which are target of an external call. An rogue `ADMIN_ROLE`could add malicious modules potentially inflating the the price. This functionality currently resides within: [ethereum:0x9437B2a8cF3b69D782a61f9814baAbc172f72003](https://etherscan.io/address/0x9437B2a8cF3b69D782a61f9814baAbc172f72003#code)
    #### Restaking Vault ETH (rsETH)
    - upgradeable component: `Vault` ([ethereum:0x7a4EffD87C2f3C55CA251080b1343b605f327E3a](https://etherscan.io/address/0x7a4EffD87C2f3C55CA251080b1343b605f327E3a))
    - admin address: [ethereum:0x81698f87C6482bF1ce9bFcfC0F103C4A0Adf0Af0](https://etherscan.io/address/0x81698f87C6482bF1ce9bFcfC0F103C4A0Adf0Af0)
    - admin type: multisig
        - multisig threshold/signers: 5/8
    - comment: The `ADMIN_ROLE`has the capability to add new Tvl modules, which are target of an external call. An rogue `ADMIN_ROLE`could add malicious modules potentially inflating the the price. This functionality currently resides within: [ethereum:0x9437B2a8cF3b69D782a61f9814baAbc172f72003](https://etherscan.io/address/0x9437B2a8cF3b69D782a61f9814baAbc172f72003#code)
    #### Amphor Restaked ETH (amphrETH)
    - upgradeable component: `Vault` ([ethereum:0x5fD13359Ba15A84B76f7F87568309040176167cd](https://etherscan.io/address/0x5fD13359Ba15A84B76f7F87568309040176167cd#readProxyContract))
    - admin address: [ethereum:0x81698f87C6482bF1ce9bFcfC0F103C4A0Adf0Af0](https://etherscan.io/address/0x81698f87C6482bF1ce9bFcfC0F103C4A0Adf0Af0)
    - admin type: multisig
        - multisig threshold/signers: 5/8
    - comment: The `ADMIN_ROLE`has the capability to add new Tvl modules, which are target of an external call. An rogue `ADMIN_ROLE`could add malicious modules potentially inflating the the price. This functionality currently resides within: [ethereum:0x9437B2a8cF3b69D782a61f9814baAbc172f72003](https://etherscan.io/address/0x9437B2a8cF3b69D782a61f9814baAbc172f72003#code)
    #### Renzo Restaked LST (pzETH)
    - upgradeable component: `Vault` ([ethereum:0x8c9532a60E0E7C6BbD2B2c1303F63aCE1c3E9811](https://etherscan.io/address/0x8c9532a60e0e7c6bbd2b2c1303f63ace1c3e9811#readProxyContract))
    - admin address: [ethereum:0x81698f87C6482bF1ce9bFcfC0F103C4A0Adf0Af0](https://etherscan.io/address/0x81698f87C6482bF1ce9bFcfC0F103C4A0Adf0Af0)
    - admin type: multisig
        - multisig threshold/signers: 5/8
    - comment: The `ADMIN_ROLE`has the capability to add new Tvl modules, which are target of an external call. An rogue `ADMIN_ROLE`could add malicious modules potentially inflating the the price. This functionality currently resides within: [ethereum:0x9437B2a8cF3b69D782a61f9814baAbc172f72003](https://etherscan.io/address/0x9437B2a8cF3b69D782a61f9814baAbc172f72003#code)
    #### InfStones Restaked ETH (ifsETH)
    - upgradeable component: `Vault` ([ethereum:]())
    - admin address: [ethereum:0x81698f87C6482bF1ce9bFcfC0F103C4A0Adf0Af0](https://etherscan.io/address/0x81698f87C6482bF1ce9bFcfC0F103C4A0Adf0Af0)
    - admin type: multisig
        - multisig threshold/signers: 5/8
    - comment: The `ADMIN_ROLE`has the capability to add new Tvl modules, which are target of an external call. An rogue `ADMIN_ROLE`could add malicious modules potentially inflating the the price. This functionality currently resides within: [ethereum:0x9437B2a8cF3b69D782a61f9814baAbc172f72003](https://etherscan.io/address/0x9437B2a8cF3b69D782a61f9814baAbc172f72003)
    #### Decentralized Validator Token (DVstETH)
    - upgradeable component: `Vault`([ethereum:0x5E362eb2c0706Bd1d134689eC75176018385430B](https://etherscan.io/address/0x5E362eb2c0706Bd1d134689eC75176018385430B))
    - admin address: [ethereum:0x81698f87C6482bF1ce9bFcfC0F103C4A0Adf0Af0](https://etherscan.io/address/0x81698f87C6482bF1ce9bFcfC0F103C4A0Adf0Af0)
    - admin type: multisig
        - multisig threshold/signers: 5/8
    - comment: The `ADMIN_ROLE`has the capability to add new Tvl modules, which are target of an external call. An rogue `ADMIN_ROLE`could add malicious modules potentially inflating the the price. This functionality currently resides within: [ethereum:0x9437B2a8cF3b69D782a61f9814baAbc172f72003](https://etherscan.io/address/0x9437B2a8cF3b69D782a61f9814baAbc172f72003)

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source: Chainlink
    - comment: All vaults use this oracle contract as the price source.
    - source address: [ethereum:0x1Dc89c28e59d142688D65Bd7b22C4Fd40C2cC06d](https://etherscan.io/address/0x1Dc89c28e59d142688D65Bd7b22C4Fd40C2cC06d#code)
    - any protections? Yes: ChainLink data is used and checked for staleness.
        ```solidity
            function _validateAndGetPrice(
            AggregatorData memory data
        ) private view returns (uint256 answer, uint8 decimals) {
            if (data.aggregatorV3 == address(0)) revert AddressZero();
            (, int256 signedAnswer, , uint256 lastTimestamp, ) = IAggregatorV3(
                data.aggregatorV3
            ).latestRoundData();
            // The roundId and latestRound are not used in the validation process to ensure compatibility
            // with various custom aggregator implementations that may handle these parameters differently
            if (signedAnswer < 0) revert InvalidOracleData();
            answer = uint256(signedAnswer);
            if (block.timestamp - data.maxAge > lastTimestamp) revert StaleOracle();
            decimals = IAggregatorV3(data.aggregatorV3).decimals();
        }
        ```
    - Additionally the address of the `priceOracle` in this case ChainLink is upgradeable within the (`VaultConfigurator`)[https://etherscan.io/address/0xb1B912Be63a2DC4ECf5a6BFAd46780dD7F81022b#code] contract. In order to change this address the admin ROLE of the `Vault`can call `stagePriceOracle` and start the process of adding a new price oracle.
    ```solidity
    function stagePriceOracle(address oracle) external onlyAdmin nonReentrant {
        if (oracle == address(0)) revert AddressZero();
        _stage(_priceOracle, uint160(oracle));
    }
    ```

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).
### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks.
    - The involved modules `ERC20TvlModule` and `DefaultBondTvlModule` both read the balance of the Vault in the following manner
        ```solidity
        //DefaultBondTvlModule
        function tvl(
            address vault
        ) external view noDelegateCall returns (Data[] memory data) {
            bytes memory data_ = vaultParams[vault];
            if (data_.length == 0) return data;
            address[] memory bonds = abi.decode(data_, (address[]));
            data = new Data[](bonds.length);
            for (uint256 i = 0; i < bonds.length; i++) {
                data[i].token = bonds[i];
                data[i].underlyingToken = IBond(bonds[i]).asset();
                data[i].amount = IERC20(bonds[i]).balanceOf(vault);
                data[i].underlyingAmount = data[i].amount;
            }
        }
        //ERC20TvlModule
        function tvl(
            address vault
        ) external view noDelegateCall returns (Data[] memory data) {
            address[] memory tokens = IVault(vault).underlyingTokens();
            data = new Data[](tokens.length);
            for (uint256 i = 0; i < tokens.length; i++) {
                data[i].token = tokens[i];
                data[i].underlyingToken = tokens[i];
                data[i].amount = IERC20(tokens[i]).balanceOf(vault);
                data[i].underlyingAmount = data[i].amount;
            }
        }

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

This was a timeboxed review of the Mellow Restaking vaults and their ability to provide pricing data for Balancer pools. These rate providers should work well with Balancer pools. 
