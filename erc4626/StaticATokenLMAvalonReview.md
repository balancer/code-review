# ERC4626 Vault: `StaticATokenLM`

## Details
- Reviewed by: @franzns
- Checked by: @danielmkm
- Deployed at:
    - [sonic:0xA28d4dbcC90C849e3249D642f356D85296a12954](https://sonicscan.org/address/0xA28d4dbcC90C849e3249D642f356D85296a12954#code)
    - [sonic:0xD31E89Ffb929b38bA60D1c7dBeB68c7712EAAb0a](https://sonicscan.org/address/0xD31E89Ffb929b38bA60D1c7dBeB68c7712EAAb0a#code)

- Audit report(s):
    - [StatATokenV2 audits](https://github.com/aave-dao/aave-v3-origin/blob/067d29eb75115179501edc4316d125d9773f7928/audits/11-09-2024_Certora_StataTokenV2.pdf)

## Context
A 4626 Vault which wraps aTokens in order to translate the rebasing nature of yield accrual into a non-rebasing value accrual.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the ERC4626. If any of these is unchecked, the the ERC4626 is unfit to use.

- [x] Tests based on the [balancer-v3-monorepo](https://github.com/balancer/balancer-v3-monorepo/tree/main/pkg/vault/test/foundry/fork) pass for the given ERC4626 vaults, which can be found [here](https://github.com/balancer/balancer-v3-erc4626-tests/tree/main/test).
- [x] The required Vault implements the required operational ERC4626 Interface

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in ERC4626 contracts.

If none of these is checked, then this might be a pretty great ERC4626! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a ERC4626 can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the ERC4626.

### Administrative Privileges
- [x] The ERC4626 Vault is upgradeable. 

    #### Wrapped Avalon Sonic solvBTC.bbn - 0xA28d4dbcC90C849e3249D642f356D85296a12954
    - upgradeable component: `StaticATokenLM` ([sonic:0xA28d4dbcC90C849e3249D642f356D85296a12954](https://sonicscan.org/address/0xA28d4dbcC90C849e3249D642f356D85296a12954#code))
    - admin address: [sonic:0x0c7b588864db1d80365c579205e8618807c6ff01](https://sonicscan.org/address/0x0c7b588864db1d80365c579205e8618807c6ff01)
    - admin owner: [sonic:0x8E23A55B0275a57d6C7ac2922664a9BDbdbCb8D8](https://sonicscan.org/address/0x8E23A55B0275a57d6C7ac2922664a9BDbdbCb8D8)
    - admin type: Multisig 3/4
        - multisig timelock? No.

    #### Wrapped Avalon Sonic solvBTC - 0xD31E89Ffb929b38bA60D1c7dBeB68c7712EAAb0a
    - upgradeable component: `StaticATokenLM` ([sonic:0xD31E89Ffb929b38bA60D1c7dBeB68c7712EAAb0a](https://sonicscan.org/address/0xD31E89Ffb929b38bA60D1c7dBeB68c7712EAAb0a#code))
    - admin address: [sonic:0xa47f40961b7ffeb68014c8119dbda827939fec1b](https://sonicscan.org/address/0xa47f40961b7ffeb68014c8119dbda827939fec1b#code)
    - admin owner: [sonic:0x8E23A55B0275a57d6C7ac2922664a9BDbdbCb8D8](https://sonicscan.org/address/0x8E23A55B0275a57d6C7ac2922664a9BDbdbCb8D8#code)
    - admin type: Multisig 3/4
        - multisig timelock? No.

### Common Manipulation Vectors
- [ ] The ERC4626 Vault is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: USABLE**

The outlined ERC4626 Vaults should work well with Balancer pools. Upgradeability is guarded by a multisig and the Vaults implement the required interfaces with fork tests passing as can be seen here:
- [0xD31E89Ffb929b38bA60D1c7dBeB68c7712EAAb0a](https://github.com/balancer/balancer-v3-erc4626-tests/blob/main/test/sonic/ERC4626Avalon.t.sol)