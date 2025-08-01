
# Rate Provider: FelixUSDT0 rate provider

## Details
This report was autogenerated on 29/07/2025.

- Deployed at:
    - [HyperEVM:0xfc5126377f0efc0041c0969ef9ba903ce67d151e](https://hyperevmscan.io/address/0xfc5126377f0efc0041c0969ef9ba903ce67d151e)
- Audit report(s):
    - [Audits](https://docs.kinetiq.xyz/contracts-and-audits)

## Context
Felix is a suite of on‑chain borrowing and lending products running on Hyperliquid L1. Our goal is to let anyone unlock liquidity or earn yield in a secure, risk‑adjusted, and friction‑free way.
## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Tests based on the [balancer-v3-monorepo](https://github.com/balancer/balancer-v3-monorepo/tree/main/pkg/vault/test/foundry/fork) pass for the given ERC4626 vaults, which can be found [here](https://github.com/balancer/balancer-v3-erc4626-tests/tree/main/test).
- [x] The required Vault implements the required operational ERC4626 Interface

### Administrative Privileges
- [ ] The ERC4626 Vault is upgradeable** (e.g., via a proxy architecture).
- [ ] Other contracts which are part of the `mint` callchain are upgradeable**. You can find more information
   about the involved contracts in this [tenderly simulation](simulating failed.)

## Conclusion
**Summary judgment: USABLE**
The passing fork tests can be found at: https://github.com/balancer/balancer-v3-erc4626-tests/pull/75

** upgradeable in this context means that:
- The contract is a proxy contract with an implementation sourced from Etherscan.
    
