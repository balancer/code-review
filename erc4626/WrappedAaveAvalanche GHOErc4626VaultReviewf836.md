
# Rate Provider: WrappedAave Avalanche GHO rate provider

## Details
This report was autogenerated on 27/06/2025.

- Deployed at:
    - [Avalanche:0x79459f4C9AfC902488109D058C3E76ed0B037c41](https://snowtrace.io/address/0x79459f4C9AfC902488109D058C3E76ed0B037c41)
- Audit report(s):
    - [StataToken](https://github.com/bgd-labs/aave-v3-origin/blob/main/audits/2024-12-05_MixBytes_AaveStataToken(watoken)SecurityAuditReport.pdf)

## Context
A 4626 Vault which wraps aTokens in order to translate the rebasing nature of yield accrual into a non-rebasing value accrual.
## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Tests based on the [balancer-v3-monorepo](https://github.com/balancer/balancer-v3-monorepo/tree/main/pkg/vault/test/foundry/fork) pass for the given ERC4626 vaults, which can be found [here](https://github.com/balancer/balancer-v3-erc4626-tests/tree/main/test).
- [x] The required Vault implements the required operational ERC4626 Interface

### Administrative Privileges
- [x] The ERC4626 Vault is upgradeable** (e.g., via a proxy architecture).
- [x] Other contracts which are part of the `mint` callchain are upgradeable**. You can find more information
   about the involved contracts in this [tenderly simulation](https://www.tdly.co/shared/simulation/57ee8b2b-8ccc-44c0-9ed3-902e322be6f9)

## Conclusion
**Summary judgment: USABLE**

The passing fork tests can be found here: https://github.com/balancer/balancer-v3-erc4626-tests/pull/64/files

** upgradeable in this context means that:
- The contract is a proxy contract with an implementation sourced from Etherscan.
    
