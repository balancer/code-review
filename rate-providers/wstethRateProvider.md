# Rate Provider: `WstETHRateProvider` & `ChainlinkRateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @danielmkm
- Deployed at:
    - [ethereum:0x72D07D7DcA67b8A406aD1Ec34ce969c90bFEE768](https://etherscan.io/address/0x72D07D7DcA67b8A406aD1Ec34ce969c90bFEE768#code)
    - [arbitrum:0xf7c5c26B574063e7b098ed74fAd6779e65E3F836](https://arbiscan.io/address/0xf7c5c26b574063e7b098ed74fad6779e65e3f836#code)

- Audit report(s):
    - [Lido audits](https://github.com/lidofinance/audits)

## Context
The Rate Provider reports the value of wsteth in terms of steth.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

## Conclusion
**Summary judgment: SAFE**

This rateProvider has been operational since Aug-12-2021 (mainnet) & Aug-23-2022 (Arbitrum) and has passed the test of time. It is being added to this repo without a review being included.
