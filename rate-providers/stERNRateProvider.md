# Rate Provider: `StErnRateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [optimism:0xBCEBb4dcdEc1c12bf7eB31bd26bc9C3b8F55C966](https://optimistic.etherscan.io/address/0xBCEBb4dcdEc1c12bf7eB31bd26bc9C3b8F55C966#code)
- Audit report(s):
    - [ReaperFarm Token & Farm](https://sourcehat.com/audits/ReaperFarm/)
    - [Multistrategy Vault](https://3473490336-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-M_3DKLtyg_0E-mdery8%2Fuploads%2FlKd5309SYDm9KrE6jiBs%2FMULTISTRATEGY_REP-final-20221108T194523Z.pdf?alt=media&token=bcfa792a-f59c-4043-b069-fa297958bf71)

## Context
Ethos Reserve let's users borrow ERN against deposited collateral. ERN aims to be a dollar pegged Stablecoin. users can stake the ERN token in Ethos Reserve's Stability pool and receive the stERN token. stERN is implemented as ReaperVaultERC4626 and captures the yield generated from liquidations and the underlying collateral.

the stERN Rate Provider reads the exchange rate from the ReaperVaultERC4626 

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
    - upgradeable component: `ReaperStrategyStabilityPool` [optimism:0x8F813Bc36261669E8F75e1ebC341B6845B0D7824](https://optimistic.etherscan.io/address/0x766da60cc688e45b5948f05cb947d3b8df7274f5#code)
    - implementation: ([optimism:0xFBD08A6869D3e4EC8A21895c1e269f4b980813f0](https://optimistic.etherscan.io/address/0xfa097bd1e57d720c2f884c3dff0b5fce23a2b09e#code))
    - admin address: [optimism:0x9BC776dBb134Ef9D7014dB1823Cd755Ac5015203](https://optimistic.etherscan.io/address/0xeb9C9b785aA7818B2EBC8f9842926c4B9f707e4B)
    - admin type: multisig
        - multisig threshold/signers: 4/9
        - multisig timelock? YES - 48 hours.

    - upgradeable component: `ReaperVaultV2`
    [optimism:0x1225c53F510877074d0D1Bace26C4f0581c24cF7](https://optimistic.etherscan.io/address/0x1225c53f510877074d0d1bace26c4f0581c24cf7#code)
    - admin address: [optimism:0x9BC776dBb134Ef9D7014dB1823Cd755Ac5015203](https://optimistic.etherscan.io/address/0x9BC776dBb134Ef9D7014dB1823Cd755Ac5015203)
    - admin type: multisig:
        - multisig threshold/signers: 4/9
        - trustworthy signers? NO
    - comment: Upgradeability in this section refers to an admin having the authority to add a new contract that is allowed to report gains & losses to the Vault. Note: Before a strategy can report losses, it needs to have funds allocated to it. A freshly created strategy can not report losses to the Vault if it did not previously get funds allocated to it.

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks.
    - It is possible to manipulate the exchange rate rate via a donation attack. The workflow would be as follows:
        - Send ERN token to the strategy before a `harvest` call. During the execution of `harvest` the balance Of the `want` token (ERN) is being read and used as a parameter for `roi` reporting on the `ReaperVaultV2`. 

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.


## Conclusion
**Summary judgment: SAFE

Overall this Rate Provider should work well in pool operations with Balancer pools. However it depends on the admin being trusted.They key components having an influence over the reported price are the `ReaperVaultV2` and the `ReaperStrategyStabilityPool`.
