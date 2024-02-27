# Rate Provider: `GenEthRateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0xC29783738A475112Cafe58433Dd9D19F3a406619](https://etherscan.io/address/0xC29783738A475112Cafe58433Dd9D19F3a406619#readContract)
- Audit report(s):
    - [Genesis Liquid Restaking](https://github.com/genesislrt/contracts/blob/main/projects/liquid-restaking/audits/VAR_GenesisLRT_231221-V1.pdf)

## Context
GenesisLRT is a restaking platform bringing a customizable restaking experience on EigenLayer. 
It is built to boost rewards by restaking assets. The Rate Provider reports the exchange rate of ETH/genETH.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [ ] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).

- [x] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price).
    - upgradeable component: `cToken` ([ethereum:0xf073bAC22DAb7FaF4a3Dd6c6189a70D54110525C](https://etherscan.io/address/0xf073bAC22DAb7FaF4a3Dd6c6189a70D54110525C))
    - admin address: [ethereum:0x03D7aaa453D9e7048101d425e73848e16c534DFD](https://etherscan.io/address/0x03D7aaa453D9e7048101d425e73848e16c534DFD)
    - admin type: multisig 
        - multisig threshold/signers: 3/5
        - multisig timelock? YES: 24 hours

    - upgradeable component: `ProtocolConfig` ([ethereum:0x81b98D3a51d4aC35e0ae132b0CF6b50EA1Da2603](https://etherscan.io/address/0x81b98D3a51d4aC35e0ae132b0CF6b50EA1Da2603))
    - admin address: [ethereum:0x03D7aaa453D9e7048101d425e73848e16c534DFD](https://etherscan.io/address/0x03D7aaa453D9e7048101d425e73848e16c534DFD)
    - admin type: multisig 
        - multisig threshold/signers: 3/5
        - multisig timelock? YES: 24 hours

    - upgradeable component: `RatioFeed` ([ethereum:0x122ee24Cb3Cc1b6B987800D3B54A68FC16910Dbf](https://etherscan.io/address/0x122ee24Cb3Cc1b6B987800D3B54A68FC16910Dbf#readProxyContract))
    - admin address: [ethereum:0x03D7aaa453D9e7048101d425e73848e16c534DFD](https://etherscan.io/address/0x03D7aaa453D9e7048101d425e73848e16c534DFD)
    - admin type: multisig 
        - multisig threshold/signers: 3/5
        - multisig timelock? YES: 24 hours

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source: The price data is supplied by an account named `operator`. Only valid operators can call `updateRatio`.
    ```solidity
    function updateRatio(
        address token,
        uint256 newRatio
    ) public override onlyOperator {};
    ```
    Currently there is one (1) account set as an `operator`. This account is currently an EOA.
    - source address: [ethereum:0x078dc682083132b4E86731062FCF95A729Bac067](https://etherscan.io/address/0x078dc682083132b4E86731062FCF95A729Bac067)
    - any protections? YES: There are three (3) guardrails in place which are: ratio updates can only occur every 12 hours, the ratio can only decrease with updates and the ratio cannot decrease more than currently 0.04%. 
    ```solidity
    function _checkRatioRules(
        uint256 lastUpdated,
        uint256 newRatio,
        uint256 oldRatio
    ) internal view returns (RatioError) {
        if (oldRatio == 0) {
            if (newRatio > INITIAL_RATIO) {
                return RatioError.GreaterThanInitial;
            }
            return RatioError.NoError;
        }

        if (block.timestamp - lastUpdated < 12 hours) {
            return RatioError.TooOften;
        }

        if (newRatio > oldRatio) {
            return RatioError.GreaterThanPrevious;
        }

        uint256 threshold = (oldRatio * ratioThreshold) / MAX_THRESHOLD;
        if (newRatio < oldRatio - threshold) {
            return RatioError.NotInThreshold;
        }

        return RatioError.NoError;
    }
    ```

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

This Rate Provider should work well with Balancer Pools. The oracle supplying price data is an EOA which is a risk due to private key leakage. However, since there are very tight controls around how price values (threshold & time delays) are supplied, this acts as reasonable protection. Additionally a 24 hour timelock in place for contract upgrades further protects LPs. 
