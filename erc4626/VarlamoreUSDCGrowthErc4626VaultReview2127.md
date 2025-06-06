
# Rate Provider: VarlamoreUSDC Growth rate provider

## Details
This report was autogenerated on 28/05/2025.

- Deployed at:
    - [Sonic:0xF6F87073cF8929C206A77b0694619DC776F89885](https://sonicscan.org//address/0xF6F87073cF8929C206A77b0694619DC776F89885)
- Audit report(s):
    - [<audit title>](<link to audit>)

## Context
<Write a brief description of the intended functionality here.>

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [ ] Tests based on the [balancer-v3-monorepo](https://github.com/balancer/balancer-v3-monorepo/tree/main/pkg/vault/test/foundry/fork) pass for the given ERC4626 vaults, which can be found [here](https://github.com/balancer/balancer-v3-erc4626-tests/tree/main/test).
- [ ] The required Vault implements the required operational ERC4626 Interface

### Administrative Privileges
- [ ] The ERC4626 Vault is upgradeable** (e.g., via a proxy architecture).
- [ ] Other contracts which are part of the `mint` callchain are upgradeable**. You can find more information
   about the involved contracts in this [tenderly simulation](https://www.tdly.co/shared/simulation/f317b9d0-af02-400e-b792-7dbc72bdde64)

## Conclusion
**Summary judgment: USABLE/UNUSABLE**

** upgradeable in this context means that:
- The contract is a proxy contract with an implementation sourced from Etherscan.
    
