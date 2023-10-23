# Rate Provider: `TruMATICRateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @rabmaurt
- Deployed at:
    - [ethereum:0x4b697C8c3220FcBdd02DFFa46db5a896ae7a0843](https://etherscan.io/address/0x4b697C8c3220FcBdd02DFFa46db5a896ae7a0843#readProxyContract)
- Audit report(s):
    - [TruMATIC](https://trufin.io/audits/)

## Context
TruMatic is an ERC4626 compliant vault product. Users can deposit Matic tokens and receive Vault shares in return. The deposited Matic tokens are then staked on the Ethereum blockchain.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [x] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).
    - implementation reviewed: [ethereum:0x6e8135b003F288aA4009D948e9646588861C5575](https://etherscan.io/address/0x6e8135b003f288aa4009d948e9646588861c5575#code)
    - admin address: [ethereum:0x71598A2209b4a9C3E23260Ac373180f4B637136d](https://etherscan.io/address/0x71598A2209b4a9C3E23260Ac373180f4B637136d)
    - admin type: multisig
        - multisig threshold/signers: 5/7
        - multisig timelock? NO
        - trustworthy signers? NO

- [x] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price).
    - upgradeable component: `TruMATIC`
        - entry point: ([ethereum:0xA43A7c62D56dF036C187E1966c03E2799d8987ed](https://etherscan.io/address/0xA43A7c62D56dF036C187E1966c03E2799d8987ed))
        - implementation reviewed: ([ethereum:0x2a9fD373Ed3Ce392bb5ad8Ee146CFAB66c9fAEae](https://etherscan.io/address/0x2a9fd373ed3ce392bb5ad8ee146cfab66c9faeae#code))
        - admin address: [ethereum:0x71598A2209b4a9C3E23260Ac373180f4B637136d](https://etherscan.io/address/0x71598A2209b4a9C3E23260Ac373180f4B637136d)
        - admin type: multisig
            - multisig threshold/signers: 5/7
            - multisig timelock? NO
            - trustworthy signers? NO
    - upgradeable component: `ValidatorShare`
        - entry point: ([ethereum:0xeA077b10A0eD33e4F68Edb2655C18FDA38F84712](https://etherscan.io/address/0xeA077b10A0eD33e4F68Edb2655C18FDA38F84712))
        - implementation reviewed: ([ethereum:0xf98864DA30a5bd657B13e70A57f5718aBf7BAB31](https://etherscan.io/address/0xf98864da30a5bd657b13e70a57f5718abf7bab31#code))
        - admin address: [ethereum:0xFa7D2a996aC6350f4b56C043112Da0366a59b74c](https://etherscan.io/address/0xFa7D2a996aC6350f4b56C043112Da0366a59b74c#code)
        - admin type: multisig
            - multisig threshold/signers: 5/9
            - multisig timelock? YES: 2 days
            - trustworthy signers? NO
    - upgradeable component: `StakeManager`
        - entry point: ([ethereum:0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908](https://etherscan.io/address/0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908))
        - implementation reviewed: ([ethereum:0xbA9Ac3C9983a3e967f0f387c75cCbD38Ad484963](https://etherscan.io/address/0xba9ac3c9983a3e967f0f387c75ccbd38ad484963#code))
        - admin address: [ethereum:0xFa7D2a996aC6350f4b56C043112Da0366a59b74c](https://etherscan.io/address/0xFa7D2a996aC6350f4b56C043112Da0366a59b74c#code)
        - admin type: multisig
            - multisig threshold/signers: 5/9
            - multisig timelock? YES: 2 days
            - trustworthy signers? NO

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks.

TruMaticRateProvider reads the `sharePrice` from the TruMatic Vault. Part of the `sharePrice` calculation logic includes the block
``` solidity
function totalAssets() public view virtual override returns (uint256) {
    return _asset.balanceOf(address(this));
}
```
which makes the TruMatic RateProvider susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

- N/A


## Conclusion
**Summary judgment: SAFE.**

This Rate Provider computes the exchange rate using a ratio of total assets available to the Vault & vault shares. This Rate Provider is susceptible to donation attacks. 
