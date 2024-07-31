# Rate Provider: `ERC4626RateProvider`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0xc497F11326c3DE5086710EDa43354697b32c1541](https://etherscan.io/address/0xc497F11326c3DE5086710EDa43354697b32c1541)
    - [arbitrum:0xf7ec24690fBCEc489E7C9A7055C04Db5C221c397](https://arbiscan.io/address/0xf7ec24690fBCEc489E7C9A7055C04Db5C221c397)
- Audit report(s):
    - [dForce Lending](https://github.com/dforce-network/documents/tree/master/audit_report/Lending)

## Context
sUSX is based on dForce's usx stablecoin. It is a yield-bearing version which accrues protocol fees from lending operations (Unitus protocol), Minting Fees from usx minting, redemption fees from converting usx back to underlying collateral, defi operations and other strategies. The rate of susx -> usx is reported by an ERC4626 rate provider.

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
    #### sUSX on mainnet
    - upgradeable component: `sUSX` ([ethereum:0xbC404429558292eE2D769E57d57D6E74bbd2792d](https://etherscan.io/address/0xbC404429558292eE2D769E57d57D6E74bbd2792d#code))
    - admin address: [ethereum:0x145c79A1F0e1Ad5ad7fC8d99548a02A07B24F8FD](https://etherscan.io/address/0x145c79A1F0e1Ad5ad7fC8d99548a02A07B24F8FD#code)
    - admin type: multisig
        - multisig threshold/signers: 3/5
    #### sUSX on Arbitrum
    - upgradeable component: `sUSX` ([arbitrum:0xbC404429558292eE2D769E57d57D6E74bbd2792d](https://arbiscan.io/address/0xbC404429558292eE2D769E57d57D6E74bbd2792d#code))
    - admin address: [arbitrum:0x9d82033BB36217B44567edC635bE926f74D1b76f](https://arbiscan.io/address/0x9d82033BB36217B44567edC635bE926f74D1b76f)
    - admin type: multisig
        - multisig threshold/signers: 3/5

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source: Multisig
    - source address: 
        #### Oracle on mainnet (3/5)
        - [ethereum:0x145c79A1F0e1Ad5ad7fC8d99548a02A07B24F8FD](https://etherscan.io/address/0x145c79A1F0e1Ad5ad7fC8d99548a02A07B24F8FD)
        #### Oracle on arbitrum (3/5)
        - [arbitrum:0x9d82033BB36217B44567edC635bE926f74D1b76f](https://arbiscan.io/address/0x9d82033BB36217B44567edC635bE926f74D1b76f)
    - any protections? YES: the new rate is based on a `_newUsr` value being pushed to the `usrConfigs` array, which is being read during the rate computation. The values are pushed as part of the permissioned call to `_addNewUsrConfig`. Various checks are in place to ensure resulting rates are bound to certain increasing/decreasing threshold levels. This includes:
        - New epoch start times needing to be equal to or greater then the current block.timestamp
        - new epoch start time needing to be greater or equal than the last epoch end time
        - and `newUsr >= MIN_USR && _newUsr <= MAX_USR` as a requirement. 
    These checks ensure the rate change is bound to be within acceptable intervals. 

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price). 

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: USABLE**

These rate providers are usable with Balancer pools. The system upgradeability is behind a 3/5 multisig and oracle state updates are permissioned (3/5 multisig) as well as validity checks are done on the data being pushed by the oracle.
