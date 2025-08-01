
# Rate Provider: MEVCapital USR rate provider

## Details
This report was autogenerated on 29/07/2025.

- Deployed at:
    - [HyperEVM:0xD3A9Cb7312B9c29113290758f5ADFe12304cd16A](https://hyperevmscan.io/address/0xD3A9Cb7312B9c29113290758f5ADFe12304cd16A)
- Deployed at:
    - [HyperEVM:0x03bc12a1A56B2ac9aBf448CDBC9bDAC91a3dcF9a](https://hyperevmscan.io/address/0x03bc12a1A56B2ac9aBf448CDBC9bDAC91a3dcF9a)
- Audit report(s):
    - [Hyperbeat audits](https://docs.hyperbeat.org/resources/audits)

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Tests based on the [balancer-v3-monorepo](https://github.com/balancer/balancer-v3-monorepo/tree/main/pkg/vault/test/foundry/fork) pass for the given ERC4626 vaults, which can be found [here](https://github.com/balancer/balancer-v3-erc4626-tests/tree/main/test).
- [x] The required Vault implements the required operational ERC4626 Interface

### Administrative Privileges
- [ ] The ERC4626 Vault is upgradeable** (e.g., via a proxy architecture).
- [ ] Other contracts which are part of the `mint` callchain are upgradeable**.

## Conclusion
**Summary judgment: USABLE**
You can find passing fork tests here: https://github.com/balancer/balancer-v3-erc4626-tests/pull/77

** upgradeable in this context means that:
- The contract is a proxy contract with an implementation sourced from Etherscan.
    
