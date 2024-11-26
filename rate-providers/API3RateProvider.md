# Rate Provider: `Api3AggregatorAdaptor`

## Details
- Reviewed by: @mkflow27
- Checked by: @danielmkm
- Deployed at:
    - [mode:0x97e0E416dA48a0592E6ea8ac0dfD26D410Ba5C22](https://modescan.io/address/0x97e0E416dA48a0592E6ea8ac0dfD26D410Ba5C22/contract/34443/code)
    - [mode:0xE91237236Bab7b39CA5CEE86F339a18C6C91F25c](https://explorer.mode.network/address/0xE91237236Bab7b39CA5CEE86F339a18C6C91F25c?tab=contract)
    - [fraxtal:0x08e12d1a6d0F47518f05b009Bb4A24113D82f33d](https://fraxscan.com/address/0x08e12d1a6d0F47518f05b009Bb4A24113D82f33d#readContract)
    - [mode:0x6Ad582604472DAdB4Af7B955388cAc6aDD6D511B](https://explorer.mode.network/address/0x6Ad582604472DAdB4Af7B955388cAc6aDD6D511B?tab=read_contract)
- Audit report(s):
    - [API3 audits](https://dapi-docs.api3.org/reference/dapis/understand/security.html)

## Context
dAPIs are on-chain data feeds sourced from off-chain first-party oracles owned and operated by API providers themselves and are continuously updated using signed data. dApp owners can read the on-chain value of any dAPI in realtime.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [ ] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).

- [ ] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price). 

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source: API3.
    - source address: The data is sourced from multiple "beacon" which are a set of airnodes which provide the data. These individual datapoints are aggregated and form the oracle value. [mode:https://modescan.io/address/0x709944a48cAf83535e43471680fDA4905FB3920a](https://modescan.io/address/0x709944a48cAf83535e43471680fDA4905FB3920a)
    - any protections? The data points being aggregated are medianized across the beacons used to form the value.
    ```solidity
    function aggregateBeacons(
        bytes32[] memory beaconIds
    ) internal view returns (int224 value, uint32 timestamp) {
        uint256 beaconCount = beaconIds.length;
        require(beaconCount > 1, "Specified less than two Beacons");
        int256[] memory values = new int256[](beaconCount);
        int256[] memory timestamps = new int256[](beaconCount);
        for (uint256 ind = 0; ind < beaconCount; ) {
            DataFeed storage dataFeed = _dataFeeds[beaconIds[ind]];
            values[ind] = dataFeed.value;
            timestamps[ind] = int256(uint256(dataFeed.timestamp));
            unchecked {
                ind++;
            }
        }
        value = int224(median(values));
        timestamp = uint32(uint256(median(timestamps)));
    }
    ```
    An individual beacon can only be updated by an airnode. This is checked by recovering the signer from a signature
    ```solidity
    function updateBeaconWithSignedData(
        address airnode,
        bytes32 templateId,
        uint256 timestamp,
        bytes calldata data,
        bytes calldata signature
    ) external override returns (bytes32 beaconId) {
        require(
            (
                keccak256(abi.encodePacked(templateId, timestamp, data))
                    .toEthSignedMessageHash()
            ).recover(signature) == airnode,
            "Signature mismatch"
        );
        beaconId = deriveBeaconId(airnode, templateId);
        int224 updatedValue = processBeaconUpdate(beaconId, timestamp, data);
        emit UpdatedBeaconWithSignedData(
            beaconId,
            updatedValue,
            uint32(timestamp)
        );
    }
    ```

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.


## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

These rate providers should work well with Balancer pools. API3 updates the rate on mode & fraxtal regularly and has various protections in place to ensure appropriate values are forwarded.
