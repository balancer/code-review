
# Rate Provider: EVKVault esavUSD-2 rate provider

## Details
This report was autogenerated on 23/04/2025.

- Deployed at:
    - [Avalanche:0x72F92a966f1874f74e1b601BEe7CF57031B53A03](https://snowtrace.io/address/0x72F92a966f1874f74e1b601BEe7CF57031B53A03)
- Audit report(s):
    - [Euler audits](https://docs.euler.finance/security/overview/)

## Context
The Euler Vault Kit (EVK) is a system for constructing credit vaults. Credit vaults are ERC-4626 vaults with added borrowing functionality. Unlike typical ERC-4626 vaults which earn yield by actively investing deposited funds, credit vaults are passive lending pools.
Users can borrow from a credit vault as long as they have sufficient collateral deposited in other credit vaults. The liability vault (the one that was borrowed from) decides which credit vaults are acceptable as collateral. Interest is charged to borrowers by continuously increasing the amount of their outstanding liability and this interest results in yield for the depositors.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Tests based on the [balancer-v3-monorepo](https://github.com/balancer/balancer-v3-monorepo/tree/main/pkg/vault/test/foundry/fork) pass for the given ERC4626 vaults, which can be found [here](https://github.com/balancer/balancer-v3-erc4626-tests/tree/main/test).
- [x] The required Vault implements the required operational ERC4626 Interface

### Administrative Privileges
- [x] The ERC4626 Vault is upgradeable** (e.g., via a proxy architecture).
- [x] Other contracts which are part of the `mint` callchain are upgradeable**. You can find more information
   about the involved contracts in this [tenderly simulation](https://www.tdly.co/shared/simulation/a2fad089-d53c-45eb-affe-d35e725b78cd)

## Conclusion
**Summary judgment: USABLE**
Passing fork tests can be found here: https://github.com/balancer/balancer-v3-erc4626-tests/pull/49/files

** upgradeable in this context means that:
- The contract is a proxy contract with an implementation sourced from Etherscan.
    
