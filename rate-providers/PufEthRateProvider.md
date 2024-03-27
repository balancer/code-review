# Rate Provider: `pufETHRateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @danielmkm
- Deployed at:
    - [ethereum:0x71f80e2CfAFA5EC2F0bF12f71FA7Ea57c3D0c7Af](https://etherscan.io/address/0x71f80e2CfAFA5EC2F0bF12f71FA7Ea57c3D0c7Af#readProxyContract)
- Audit report(s):
    - [PufferFinance Audits](https://github.com/PufferFinance/pufETH/tree/main/audits)

## Context
Puffer is a decentralized native liquid restaking protocol built on Eigenlayer. It makes native restaking on Eigenlayer more accessible, allowing anyone to run an Ethereum Proof of Stake (PoS) validator while supercharging their rewards. The RateProvider reports the exchange rate of pufETH in terms of ETH/stETH (1:1 is assumed by Puffer)

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [x] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).
    - admin address: [ethereum:0xC0896ab1A8cae8c2C1d27d011eb955Cca955580d](https://etherscan.io/address/0xC0896ab1A8cae8c2C1d27d011eb955Cca955580d)
    - admin type: multisig
        - multisig threshold/signers: 3/5

- [x] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price).
    - upgradeable component: `PufferVault` ([ethereum:0xD9A442856C234a39a81a089C06451EBAa4306a72](https://etherscan.io/address/0xD9A442856C234a39a81a089C06451EBAa4306a72#readProxyContract))
    - admin address: [ethereum:0x446d4d6b26815f9bA78B5D454E303315D586Cb2a](https://etherscan.io/address/0x446d4d6b26815f9bA78B5D454E303315D586Cb2a)
    - admin type: multisig
        - multisig threshold/signers: 3/6

### Oracles
- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks.

Part of the price calculation (`totalAssets()`) is based on evaluating token balances of stETH & Ether. 
```solidity
function totalAssets() public view virtual override returns (uint256) {
        return _ST_ETH.balanceOf(address(this)) + getELBackingEthAmount() + getPendingLidoETHAmount()
            + address(this).balance;
    }
```

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

This Rate Provider should work well with Balancer pools. The PufEth contract calculates the exchange rate by dividing the total assets by the total supply. The contract's ability to be upgraded leverages both OpenZeppelin's AccessManager and a Timelock, which allows contract upgrades to be made instantly by a community multisig. Please note, the upgradeability of Eigenlayer and Lido Finance was not included in this review.