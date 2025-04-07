# Hook: `MevCaptureHook`

## Details
- Reviewed by: @mkflow27
- Checked by: @
- Deployed at:
    - [sepolia:0xEC9578e79d412537095501584284B092D2F6b9F7](https://sepolia.etherscan.io/address/0xEC9578e79d412537095501584284B092D2F6b9F7#code)
    - [arbitrum:0x5B42eC6D40f7B7965BE5308c70e2603c0281C1E9](https://arbiscan.io/address/0x5B42eC6D40f7B7965BE5308c70e2603c0281C1E9#code)
    - [base:0x7a2535f5fb47b8e44c02ef5d9990588313fe8f05](https://basescan.org/address/0x7a2535f5fb47b8e44c02ef5d9990588313fe8f05#code)
    - [gnosis:0xa1D0791a41318c775707C56eAe247AF81a05322C](https://gnosisscan.io/address/0xa1D0791a41318c775707C56eAe247AF81a05322C)
    - [mainnet:0x1bcA39b01F451b0a05D7030e6e6981a73B716b1C](https://etherscan.io/address/0x1bcA39b01F451b0a05D7030e6e6981a73B716b1C)

- Audit report(s):
    - [Certora audits](https://github.com/balancer/balancer-v3-monorepo/blob/main/audits/certora/2025-02-07.pdf)

## Context
By implementing a fee that scales with priority fees, the system redistributes MEV profits that otherwise would go to the sequencer. Searchers still extract the same value, but instead of fees flowing solely to the sequencer, a portion is redirected to liquidity providers as tax revenue.

## Review Checklist: Bare Minimum Compatibility

- [x] The returned `HookFlags` match the implemented hook functions

### Administrative Privileges

## Conclusion
**Summary judgment: USABLE**