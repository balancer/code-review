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
    - [avalanche:0x86705Ee19c0509Ff68F1118C55ee2ebdE383D122](https://snowtrace.io/address/0x86705Ee19c0509Ff68F1118C55ee2ebdE383D122/contract/43114/code)
    - [optimism:0xF39CA6ede9BF7820a952b52f3c94af526bAB9015](https://optimistic.etherscan.io/address/0xF39CA6ede9BF7820a952b52f3c94af526bAB9015#code)
    - [plasma:0x6817149cb753bf529565b4d023d7507ed2ff4bc0](https://plasmascan.to/address/0x6817149cb753BF529565B4D023d7507eD2ff4Bc0/contract/9745/code)
- Audit report(s):
    - [Certora audit](https://github.com/balancer/balancer-v3-monorepo/blob/main/audits/certora/2025-01-30.pdf)

## Context

## Review Checklist: Bare Minimum Compatibility

- [x] The returned `HookFlags` match the implemented hook functions

### Administrative Privileges

Functions updating sensitive pool state information are guarded behind administrative controls such as `setMaxSurgeFeePercentage` and `setSurgeThresholdPercentage`.

## Conclusion
**Summary judgment: USABLE**
