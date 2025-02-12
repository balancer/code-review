# Hook: `StableSurgeHook`

## Details
- Reviewed by: @mkflow27
- Checked by: @danielmkm
- Deployed at:
    - [sepolia:0x30CE53fA38a1399F0CA158b5c38362c80E423bA9](https://sepolia.etherscan.io/address/0x30CE53fA38a1399F0CA158b5c38362c80E423bA9)
    - [arbitrum:0x0Fa0f9990D7969a7aE6f9961d663E4A201Ed6417](https://arbiscan.io/address/0x0Fa0f9990D7969a7aE6f9961d663E4A201Ed6417#code)
    - [base:0xb2007B8B7E0260042517f635CFd8E6dD2Dd7f007](https://basescan.org/address/0xb2007B8B7E0260042517f635CFd8E6dD2Dd7f007#code)
    - [gnosis:0xe4f1878eC9710846E2B529C1b5037F8bA94583b1](https://gnosisscan.io/address/0xe4f1878eC9710846E2B529C1b5037F8bA94583b1#code)
    - [mainnet:0xb18fA0cb5DE8cecB8899AAE6e38b1B7ed77885dA](https://etherscan.io/address/0xb18fA0cb5DE8cecB8899AAE6e38b1B7ed77885dA#code)
- Audit report(s):
    - will be added soon

## Context

## Review Checklist: Bare Minimum Compatibility

- [x] The returned `HookFlags` match the implemented hook functions

### Administrative Privileges

Functions updating sensitive pool state information are guarded behind administrative controls such as `setMaxSurgeFeePercentage` and `setSurgeThresholdPercentage`.

## Conclusion
**Summary judgment: USABLE**