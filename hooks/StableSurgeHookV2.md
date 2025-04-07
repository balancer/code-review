# Hook: `StableSurgeHook`

## Details
- Reviewed by: @mkflow27
- Checked by: 
- Deployed at:
    - [sepolia:0x7dfca838fD5fCd70f876431D41CaA3E3E2ea1520](https://sepolia.etherscan.io/address/0x7dfca838fD5fCd70f876431D41CaA3E3E2ea1520)
    - [arbitrum:0x7c1b7A97BfAcD39975dE53e989A16c7BC4C78275](https://arbiscan.io/address/0x7c1b7A97BfAcD39975dE53e989A16c7BC4C78275#code)
    - [base:0xDB8d758BCb971e482B2C45f7F8a7740283A1bd3A](https://basescan.org/address/0xDB8d758BCb971e482B2C45f7F8a7740283A1bd3A#code)
    - [gnosis:0x90BD26fbb9dB17D75b56E4cA3A4c438FA7C93694](https://gnosisscan.io/address/0x90BD26fbb9dB17D75b56E4cA3A4c438FA7C93694#code)
    - [mainnet:0xBDbADc891BB95DEE80eBC491699228EF0f7D6fF1](https://etherscan.io/address/0xBDbADc891BB95DEE80eBC491699228EF0f7D6fF1#code)
    - [avalanche:0xaD89051bEd8d96f045E8912aE1672c6C0bF8a85E](https://snowtrace.io/address/0xaD89051bEd8d96f045E8912aE1672c6C0bF8a85E/contract/43114/code)
    - [optimism:0xF39CA6ede9BF7820a952b52f3c94af526bAB9015](https://optimistic.etherscan.io/address/0xF39CA6ede9BF7820a952b52f3c94af526bAB9015#code)
- Audit report(s):
    - [Certora audit](https://github.com/balancer/balancer-v3-monorepo/blob/main/audits/certora/2025-01-30.pdf)

## Context

## Review Checklist: Bare Minimum Compatibility

- [x] The returned `HookFlags` match the implemented hook functions

### Administrative Privileges

Functions updating sensitive pool state information are guarded behind administrative controls such as `setMaxSurgeFeePercentage` and `setSurgeThresholdPercentage`.

## Conclusion
**Summary judgment: USABLE**