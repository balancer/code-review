# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @danielmkm
- Deployed at:
    - [ethereum:0xda3E8CD08753a05Ed4103aF28c69C47e35d6D8Da](https://etherscan.io/address/0xda3E8CD08753a05Ed4103aF28c69C47e35d6D8Da#code)
    - [polygon:0x7d10050F608c8EFFf118eDd1416D82a0EF2d7531](https://polygonscan.com/address/0x7d10050F608c8EFFf118eDd1416D82a0EF2d7531)
    - [polygon:0x9977a61a6aa950044d4dcD8aA0cAb76F84ea5aCd](https://polygonscan.com/address/0x9977a61a6aa950044d4dcD8aA0cAb76F84ea5aCd)
    - [arbitrum:0x87cD462A781c0ca843EAB131Bf368328848bB6fD](https://arbiscan.io/address/0x87cd462a781c0ca843eab131bf368328848bb6fd)
    - [arbitrum:0x48942B49B5bB6f3E1d43c204a3F40a4c5F696ef6](https://arbiscan.io/address/0x48942B49B5bB6f3E1d43c204a3F40a4c5F696ef6)
    - [optimism:0xdFa8d2b3c146b8a10B5d63CA0306AEa84B602cfb](https://optimistic.etherscan.io/address/0xdFa8d2b3c146b8a10B5d63CA0306AEa84B602cfb#code)
    - [optimism:0x3f921Ebabab0703BC06d1828D09a245e8390c263](https://optimistic.etherscan.io/address/0x3f921Ebabab0703BC06d1828D09a245e8390c263#code)
    - [base:0x4467Ab7BC794bb3929d77e826328BD378bf5392F](https://basescan.org/address/0x4467Ab7BC794bb3929d77e826328BD378bf5392F)
    - [gnosis:0x821aFE819450A359E29a5209C48f2Fa3321C8AD2](https://gnosisscan.io/address/0x821aFE819450A359E29a5209C48f2Fa3321C8AD2#readContract)

- Audit report(s):
    - [Formal Verification Report For StaticAToken](https://github.com/bgd-labs/static-a-token-v3/blob/main/audits/Formal_Verification_Report_staticAToken.pdf)

## Context
The ERC4626 RateProvider fetches the rate of Static Aave Tokens in terms of USDC or USDT. The exchange rate is provided by the Aave V3 `POOL` and fetched via `getReserveNormalizedIncome` from the pool and wrapped as part of the `convertToAsset` call to the `StaticATokenLM`. 

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
    - [ethereum:0xda3E8CD08753a05Ed4103aF28c69C47e35d6D8Da](https://etherscan.io/address/0xda3E8CD08753a05Ed4103aF28c69C47e35d6D8Da#code)
        - upgradeable component: `StaticATokenLM` ([ethereum:0x862c57d48becB45583AEbA3f489696D22466Ca1b](https://etherscan.io/address/0x862c57d48becB45583AEbA3f489696D22466Ca1b#readProxyContract))
        - admin address: [ethereum:0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `Pool` ([ethereum:0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2](https://etherscan.io/address/0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2#readProxyContract))
        - admin address: [ethereum:0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours

    - [polygon:0x7d10050F608c8EFFf118eDd1416D82a0EF2d7531](https://polygonscan.com/address/0x7d10050F608c8EFFf118eDd1416D82a0EF2d7531)
        - upgradeable component: `StaticATokenLM` ([polygon:0x2dCa80061632f3F87c9cA28364d1d0c30cD79a19](https://polygonscan.com/address/0x2dCa80061632f3F87c9cA28364d1d0c30cD79a19#readProxyContract))
        - admin address: [polygon:0xDf7d0e6454DB638881302729F5ba99936EaAB233](https://polygonscan.com/address/0xDf7d0e6454DB638881302729F5ba99936EaAB233#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `Pool` ([polygon:0x794a61358D6845594F94dc1DB02A252b5b4814aD](https://polygonscan.com/address/0x794a61358D6845594F94dc1DB02A252b5b4814aD))
        - admin address: [polygon:0xDf7d0e6454DB638881302729F5ba99936EaAB233](https://polygonscan.com/address/0xDf7d0e6454DB638881302729F5ba99936EaAB233)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours


    - [polygon:0x9977a61a6aa950044d4dcD8aA0cAb76F84ea5aCd](https://polygonscan.com/address/0x9977a61a6aa950044d4dcD8aA0cAb76F84ea5aCd)
        - upgradeable component: `StaticATokenLM` ([polygon:0x87A1fdc4C726c459f597282be639a045062c0E46](https://polygonscan.com/address/0x87A1fdc4C726c459f597282be639a045062c0E46#readProxyContract))
        - admin address: [polygon:0xDf7d0e6454DB638881302729F5ba99936EaAB233](https://polygonscan.com/address/0xDf7d0e6454DB638881302729F5ba99936EaAB233)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `Pool` ([polygon:0x794a61358D6845594F94dc1DB02A252b5b4814aD](https://polygonscan.com/address/0x794a61358D6845594F94dc1DB02A252b5b4814aD#readProxyContract))
        - admin address: [polygon:0xDf7d0e6454DB638881302729F5ba99936EaAB233](https://polygonscan.com/address/0xDf7d0e6454DB638881302729F5ba99936EaAB233#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours


    - [arbitrum:0x87cD462A781c0ca843EAB131Bf368328848bB6fD](https://arbiscan.io/address/0x87cd462a781c0ca843eab131bf368328848bb6fd)
        - upgradeable component: `StaticATokenLM` ([arbitrum:0x7CFaDFD5645B50bE87d546f42699d863648251ad](https://arbiscan.io/address/0x7CFaDFD5645B50bE87d546f42699d863648251ad#readProxyContract))
        - admin address: [arbitrum:0xFF1137243698CaA18EE364Cc966CF0e02A4e6327](https://arbiscan.io/address/0xFF1137243698CaA18EE364Cc966CF0e02A4e6327#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2Pool` ([arbitrum:0x794a61358D6845594F94dc1DB02A252b5b4814aD](https://arbiscan.io/address/0x794a61358D6845594F94dc1DB02A252b5b4814aD))
        - admin address: [arbitrum:0xFF1137243698CaA18EE364Cc966CF0e02A4e6327](https://arbiscan.io/address/0xFF1137243698CaA18EE364Cc966CF0e02A4e6327)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours

    - [arbitrum:0x48942B49B5bB6f3E1d43c204a3F40a4c5F696ef6](https://arbiscan.io/address/0x48942B49B5bB6f3E1d43c204a3F40a4c5F696ef6)
        - upgradeable component: `StaticATokenLM` ([arbitrum:0xb165a74407fE1e519d6bCbDeC1Ed3202B35a4140](https://arbiscan.io/address/0xb165a74407fe1e519d6bcbdec1ed3202b35a4140#code))
        - admin address: [arbitrum:0xFF1137243698CaA18EE364Cc966CF0e02A4e6327](https://arbiscan.io/address/0xFF1137243698CaA18EE364Cc966CF0e02A4e6327)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2Pool` ([arbitrum:0x794a61358D6845594F94dc1DB02A252b5b4814aD](https://arbiscan.io/address/0x794a61358D6845594F94dc1DB02A252b5b4814aD#readProxyContract))
        - admin address: [arbitrum:0xFF1137243698CaA18EE364Cc966CF0e02A4e6327](https://arbiscan.io/address/0xFF1137243698CaA18EE364Cc966CF0e02A4e6327)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours


    - [optimism:0xdFa8d2b3c146b8a10B5d63CA0306AEa84B602cfb](https://optimistic.etherscan.io/address/0xdFa8d2b3c146b8a10B5d63CA0306AEa84B602cfb#code)
        - upgradeable component: `StaticATokenLM` ([optimism:0x4DD03dfD36548C840B563745e3FBeC320F37BA7e](https://optimistic.etherscan.io/address/0x4DD03dfD36548C840B563745e3FBeC320F37BA7e))
        - admin address: [optimism:0x746c675dAB49Bcd5BB9Dc85161f2d7Eb435009bf](https://optimistic.etherscan.io/address/0x746c675dAB49Bcd5BB9Dc85161f2d7Eb435009bf)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2Pool` ([optimism:0x794a61358D6845594F94dc1DB02A252b5b4814aD](https://optimistic.etherscan.io/address/0x794a61358D6845594F94dc1DB02A252b5b4814aD))
        - admin address: [optimism:0x746c675dAB49Bcd5BB9Dc85161f2d7Eb435009bf](https://optimistic.etherscan.io/address/0x746c675dAB49Bcd5BB9Dc85161f2d7Eb435009bf)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours

    - [optimism:0x3f921Ebabab0703BC06d1828D09a245e8390c263](https://optimistic.etherscan.io/address/0x3f921Ebabab0703BC06d1828D09a245e8390c263#code)
        - upgradeable component: `StaticATokenLM` ([optimism:0x035c93db04E5aAea54E6cd0261C492a3e0638b37](https://optimistic.etherscan.io/address/0x035c93db04E5aAea54E6cd0261C492a3e0638b37#code))
        - admin address: [optimism:0x746c675dAB49Bcd5BB9Dc85161f2d7Eb435009bf](https://optimistic.etherscan.io/address/0x746c675dAB49Bcd5BB9Dc85161f2d7Eb435009bf)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2Pool` ([optimism:0x794a61358D6845594F94dc1DB02A252b5b4814aD](https://optimistic.etherscan.io/address/0x794a61358D6845594F94dc1DB02A252b5b4814aD#code))
        - admin address: [optimism:0x746c675dAB49Bcd5BB9Dc85161f2d7Eb435009bf](https://optimistic.etherscan.io/address/0x746c675dAB49Bcd5BB9Dc85161f2d7Eb435009bf)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours

    - [base:0x4467Ab7BC794bb3929d77e826328BD378bf5392F](https://basescan.org/address/0x4467Ab7BC794bb3929d77e826328BD378bf5392F#code)
        - upgradeable component: `StaticATokenLM` ([base:0x4EA71A20e655794051D1eE8b6e4A3269B13ccaCc](https://basescan.org/address/0x4EA71A20e655794051D1eE8b6e4A3269B13ccaCc#readProxyContract))
        - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2Pool` ([base:0xA238Dd80C259a72e81d7e4664a9801593F98d1c5](https://basescan.org/address/0xA238Dd80C259a72e81d7e4664a9801593F98d1c5#readProxyContract))
        - admin address: [base:0x9390B1735def18560c509E2d0bc090E9d6BA257a](https://basescan.org/address/0x9390B1735def18560c509E2d0bc090E9d6BA257a)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours

    - [gnosis:0x270bA1f35D8b87510D24F693fcCc0da02e6E4EeB](https://gnosisscan.io/address/0x270bA1f35D8b87510D24F693fcCc0da02e6E4EeB#readProxyContract)
        - upgradeable component: `StaticATokenLM` ([gnosis:0x270bA1f35D8b87510D24F693fcCc0da02e6E4EeB](https://gnosisscan.io/address/0x270bA1f35D8b87510D24F693fcCc0da02e6E4EeB#readProxyContract))
        - admin address: [gnosis:0x1dF462e2712496373A347f8ad10802a5E95f053D](https://gnosisscan.io/address/0x1dF462e2712496373A347f8ad10802a5E95f053D)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours.
        - upgradeable component: `L2Pool` ([gnosis:0xb50201558B00496A145fE76f7424749556E326D8](https://gnosisscan.io/address/0xb50201558B00496A145fE76f7424749556E326D8#code))
        - admin address: [gnosis:0x1dF462e2712496373A347f8ad10802a5E95f053D](https://gnosisscan.io/address/0x1dF462e2712496373A347f8ad10802a5E95f053D#code)
        - admin type: Aave governance system.
            - multisig timelock? YES: 24 hours
    

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Conclusion
**Summary judgment: SAFE**

The Rate Providers should work well with Balancer pools. The underlying contracts have been audited and been in production for an extended period of time. The upgradeability of the underlying Aave protocol is guarded behind decentralized governance and has a minimum execution delay of 24 hours. 
