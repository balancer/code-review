# Rate Provider: `krETHRateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0xEE246a8a09a055e60b4EF38DEF201e10bcf82644](https://etherscan.io/address/0xEE246a8a09a055e60b4EF38DEF201e10bcf82644#code)
    - [ethereum:0x094C9b71ad7b6C09fe592F2aE10dFb1dc2B73623](https://etherscan.io/address/0x094C9b71ad7b6C09fe592F2aE10dFb1dc2B73623#readContract)
- Audit report(s):
    - [Kernel Protocol review](https://drive.google.com/file/d/1MqenDKmDDb6OcsG-0YTlQAwlfFndSk7J/view)

## Context
Kernel Protocol will be offering a suite of Karak Native LRTs that allow users to restake assets on Karak and receive LRT tokens that can be deployed in further yield-bearing DeFi activities. The rate providers in this review are essentially wrappers of downstream LST/LRT rate providers.

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
    - upgradeable component: `krETH` ([ethereum:0xf02C96DbbB92DC0325AD52B3f9F2b951f972bf00](https://etherscan.io/address/0xf02C96DbbB92DC0325AD52B3f9F2b951f972bf00#code))
    - admin address: [ethereum:0xe0EB63B4E18FF1e646ab7E37510E6EaF287AdE3D](https://etherscan.io/address/0xe0EB63B4E18FF1e646ab7E37510E6EaF287AdE3D)
    - admin type: multisig
        - multisig threshold/signers: 3/6
    - comment: The owner can add new tokens which are part of the rate calculation.

    - upgradeable component: `ksETH` ([ethereum:0x513D27c94C0D81eeD9DC2a88b4531a69993187cF](https://etherscan.io/address/0x513D27c94C0D81eeD9DC2a88b4531a69993187cF))
    - admin address: [ethereum:0xe0EB63B4E18FF1e646ab7E37510E6EaF287AdE3D](https://etherscan.io/address/0xe0EB63B4E18FF1e646ab7E37510E6EaF287AdE3D)
    - admin type: multisig
        - multisig threshold/signers: 3/6
    - comment: The owner can add new tokens which are part of the rate calculation.

    - upgradeable component: Downstream components of krETH are upgradeable. Since they are many, their upgradeability mechanics & admins are listed here. The reader is expected to investigate them themselves due to the amount of dependencies involved. They are currently:
    #### KrETH downstream dependencies
    The below contracts are part of the krETH downstream dependencies
        - Renzo Restakted ETH [ethereum:0xbf5495Efe5DB9ce00f80364C8B423567e58d2110](https://etherscan.io/address/0xbf5495Efe5DB9ce00f80364C8B423567e58d2110)
        - mstETH [ethereum:0x49446A0874197839D15395B908328a74ccc96Bc0](https://etherscan.io/address/0x49446A0874197839D15395B908328a74ccc96Bc0)
        - mswETH [ethereum:0x32bd822d615A3658A68b6fDD30c2fcb2C996D678](https://etherscan.io/address/0x32bd822d615A3658A68b6fDD30c2fcb2C996D678)
        - pufETH [ethereum:0xD9A442856C234a39a81a089C06451EBAa4306a72](https://etherscan.io/address/0xD9A442856C234a39a81a089C06451EBAa4306a72)
        - rsETH [ethereum:0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7](https://etherscan.io/address/0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7)
        - weeth [ethereum:0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee](https://etherscan.io/address/0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee)
        Further information for some of the involved dependencies can be found within this repository.
    ### kstETH downstream dependencies
    The below contracts are part of the ksETH downstream dependencies
        - Pirex Ether [ethereum:0x9Ba021B0a9b958B5E75cE9f6dff97C7eE52cb3E6](https://etherscan.io/address/0x9Ba021B0a9b958B5E75cE9f6dff97C7eE52cb3E6)
        - Coinbase Ether [ethereum:0xBe9895146f7AF43049ca1c1AE358B0541Ea49704](https://etherscan.io/address/0xBe9895146f7AF43049ca1c1AE358B0541Ea49704)
        - rETH [ethereum:0xae78736Cd615f374D3085123A210448E74Fc6393](https://etherscan.io/address/0xae78736Cd615f374D3085123A210448E74Fc6393)
        - Swell Ether [ethereum:0xf951E335afb289353dc249e82926178EaC7DEd78](https://etherscan.io/address/0xf951E335afb289353dc249e82926178EaC7DEd78)
        - wstETH [ethereum:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0](https://etherscan.io/address/0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0)

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

This rate provider should work well with Balancer pools. The downstream dependencies are industrywide established tokens and the admin functionality of the ksETH and krETH are guarded behind a multisig.
