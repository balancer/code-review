# Rate Provider: `ChainLinkRateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [fraxtal:0x3893E8e1584fF73188034D37Fc6B7d41A255E570](https://fraxscan.com/address/0x3893E8e1584fF73188034D37Fc6B7d41A255E570#code)
    - [fraxtal:0x95eedc9d10B6964a579948Fd717D34F45E15C0C6](https://fraxscan.com/address/0x95eedc9d10B6964a579948Fd717D34F45E15C0C6)
    - [fraxtal:0x761efEF0347E23e2e75907A6e2df0Bbc6d3A3F38](https://fraxscan.com/address/0x761efEF0347E23e2e75907A6e2df0Bbc6d3A3F38)
    - [fraxtal:0x99D033888aCe9d8E01F793Cf85AE7d4EA56494F9](https://fraxscan.com/address/0x99D033888aCe9d8E01F793Cf85AE7d4EA56494F9#code)

- Audit report(s):
    - [Frax audits](https://docs.frax.finance/other/audits#id-2024)

## Context
Frax has developed a set of Bridge contracts, which provide Price Data on Fraxtal. The contract setup consists of a `TransportOracle`, `MerleProofPriceSource,
`TimeLock`, `StateRootOracle` and a eoa sending price data updates via a merkle proof. The `TransportOracle` contracts adhere to the
ChainLinkPrice feed Interface and therefor the `ChainlinkRateProviderFactory` can be used to access price data on Fraxtal.


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
    - upgradeable component: 
        - `FraxtalERC4626TransportOracle` ([fraxtal:0x1B680F4385f24420D264D78cab7C58365ED3F1FF](https://fraxscan.com/address/0x1B680F4385f24420D264D78cab7C58365ED3F1FF#code))
        - `FraxtalERC4626TransportOracle` ([fraxtal:0xfdE8C36F32Bf32e73A1bdeb4ef3E17709674a838](https://fraxscan.com/address/0xfdE8C36F32Bf32e73A1bdeb4ef3E17709674a838#code))
        - `FraxtalERC4626TransportOracle` ([fraxtal:0xEE095b7d9191603126Da584a1179BB403a027c3A](https://fraxscan.com/address/0xEE095b7d9191603126Da584a1179BB403a027c3A#code))
        - `FraxtalERC4626TransportOracle` ([fraxtal:0xd295936C8Bb465ADd1eC756a51698127CB4F4910](https://fraxscan.com/address/0xd295936C8Bb465ADd1eC756a51698127CB4F4910#code))
    - admin address: [fraxtal:0xc16068d1ca7E24E20e56bB70af4D00D92AA4f0b2](https://fraxscan.com/address/0xc16068d1ca7E24E20e56bB70af4D00D92AA4f0b2)
    - admin type: EOA/Multisig behind 2 day timelock. Below addresses are the `EXECUTOR_ROLE` of the timelock.

        - Multisig 3/5: [fraxtal:0xC4EB45d80DC1F079045E75D5d55de8eD1c1090E6](https://fraxscan.com/address/0xC4EB45d80DC1F079045E75D5d55de8eD1c1090E6)
        - EOA: [fraxtal:0x31562ae726AFEBe25417df01bEdC72EF489F45b3](https://fraxscan.com/address/0x31562ae726AFEBe25417df01bEdC72EF489F45b3)
        - Multisig 1/1: [fraxtal:0xc188a8f8066e720D892c0cfAE9B9865e3425fCdE](https://fraxscan.com/address/0xc188a8f8066e720D892c0cfAE9B9865e3425fCdE#readProxyContract)

        - timelock? YES: 2 days
        - comment:  The `priceSource` address is allowed to be changed via a timelock, which makes this contract marked upgradeable. The update mechanism is implemented in all `FraxtalERC4626TransportOracle` and implements upgradeability as:
        ```solidity
            /// @notice The ```setPriceSource``` function sets the price source
            /// @dev Requires msg.sender to be the timelock address
            /// @param _newPriceSource The new price source address
            function setPriceSource(address _newPriceSource) external {
                _requireTimelock();
                _setPriceSource({ _newPriceSource: _newPriceSource });
            }   
        ``` 
        

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source: Fraxtal Oracle Service
    - source address: [fraxtal:0x9032Cce69AC1CF277e4587e60d3cD710E0BAbc6F](https://fraxscan.com/address/0x9032cce69ac1cf277e4587e60d3cd710e0babc6f)
    - comment: `addRoundDataSfrax`, `addRoundDataSdai`, `addRoundDataSfrxEth`, `addRoundDataSUSDe` are the updating functions used as part of this review. 
    - any protections? YES:
        - Data cannot be stale
        - Data of the L1 is verified via Merkle proofs
        - The L1 oracle address is being verified per new data push (see `WrongOracleAddress` in the `PriceSource` contracts)


- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

The Frax oracle service should work well with Balancer pools especially since the Pricefeeds implement the well known ChainLink interfaces, & already established smart contracts (`ChainLinkRateProviderFactory`) can be used to provide price data on fraxtal. It is important to note, that the timelock should be monitored for potential calls to `setPriceSource` as the `priceSource` could be changed to a contract which does not work with merkle proofs of the price data.
