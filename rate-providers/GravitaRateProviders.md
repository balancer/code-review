# Rate Provider: `RPLVault` & `WETHVault`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [ethereum:0x1DB1Afd9552eeB28e2e36597082440598B7F1320](https://etherscan.io/address/0x1DB1Afd9552eeB28e2e36597082440598B7F1320)
    - [ethereum:0xBB22d59B73D7a6F3A8a83A214BECc67Eb3b511fE](https://etherscan.io/address/0xBB22d59B73D7a6F3A8a83A214BECc67Eb3b511fE)
- Audit report(s):
    - [Gravita audits](https://docs.gravitaprotocol.com/gravita-docs/about-gravita-protocol/audits)

## Context
The RPLVault and WETHVault are Vault produces that compound a given asset. The Vaults are also the rate providers and no separate rate providers contracts exist. The valuation approach is based on a totalAssets / totalSupply approach where `totalAssets` is the function doing various external contract calls.

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [x] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [x] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be safe despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [x] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address).

    #### xrRETH
    - admin address: [ethereum:0xA4539A9ecE2A653AfC7C8DD49d27dd079ed19d00](https://etherscan.io/address/0xA4539A9ecE2A653AfC7C8DD49d27dd079ed19d00#code)
    - admin type: multisig
        - multisig threshold/signers: 3/5
        - multisig timelock? 7 days


    #### xRPL
    - admin address: [ethereum:0xA4539A9ecE2A653AfC7C8DD49d27dd079ed19d00](https://etherscan.io/address/0xA4539A9ecE2A653AfC7C8DD49d27dd079ed19d00#code)
    - admin type: multisig
        - multisig threshold/signers: 3/5
        - multisig timelock? 7 days

- [x] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price).
    - upgradeable component: `Directory` ([ethereum:0x4343743dBc46F67D3340b45286D8cdC13c8575DE](https://etherscan.io/address/0x4343743dBc46F67D3340b45286D8cdC13c8575DE))
    - admin address: [ethereum:0xA4539A9ecE2A653AfC7C8DD49d27dd079ed19d00](https://etherscan.io/address/0xA4539A9ecE2A653AfC7C8DD49d27dd079ed19d00#code)
    - admin type: multisig
        - multisig threshold/signers: 3/5
        - multisig timelock? 7 days


    - upgradeable component: `OperatorDistributor` ([ethereum:0x102809fE582ecaa527bB316DCc4E99fc35FBAbb9](https://etherscan.io/address/0x102809fE582ecaa527bB316DCc4E99fc35FBAbb9#readProxyContract))
    - admin address: [ethereum:0xA4539A9ecE2A653AfC7C8DD49d27dd079ed19d00](https://etherscan.io/address/0xA4539A9ecE2A653AfC7C8DD49d27dd079ed19d00#code)
    - admin type: multisig
        - multisig threshold/signers: 3/5
        - multisig timelock? 7 days

    - upgradeable component: `PoAConstellationOracle` ([ethereum:0x81C1001e1621d05bE250814123CC81BBb244Cb07](https://etherscan.io/address/0x81C1001e1621d05bE250814123CC81BBb244Cb07#readProxyContract))
    - admin address: [ethereum:0xA4539A9ecE2A653AfC7C8DD49d27dd079ed19d00](https://etherscan.io/address/0xA4539A9ecE2A653AfC7C8DD49d27dd079ed19d00#code)
    - admin type: multisig
        - multisig threshold/signers: 3/5
        - multisig timelock? 7 days

    - upgradeable component: `MerkleClaimStreamer` ([ethereum:0x312717E67b9a12402fB8d2DB031aC9C84665a04e](https://etherscan.io/address/0x312717E67b9a12402fB8d2DB031aC9C84665a04e#readProxyContract))
    - admin address: [ethereum:0xA4539A9ecE2A653AfC7C8DD49d27dd079ed19d00](https://etherscan.io/address/0xA4539A9ecE2A653AfC7C8DD49d27dd079ed19d00#code)
    - admin type: multisig
        - multisig threshold/signers: 3/5
        - multisig timelock? 7 days



### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes). 
    - source: A custom oracle for xrRETH.
    - source address: [ethereum:0xb5f6eeDE05036A42Af492638Ec0A1704E7cE7894](https://etherscan.io/address/0xb5f6eeDE05036A42Af492638Ec0A1704E7cE7894)
    - any protections? Part of the price rate depends on an `outstandingYield` state variable which is part of the oracle response. and is retrieved via
    ```solidity
    function getTotalYieldAccrued() external view override returns (int256) {
        return _totalYieldAccrued;
    }
    ```
    This state variable can be externally set via signed data by calling `setTotalYieldAccrued` in
    ```solidity
    function setTotalYieldAccrued(bytes calldata _sig, PoAOracleSignatureData calldata sigData) external {
        address recoveredAddress = ECDSA.recover(
            ECDSA.toEthSignedMessageHash(
                keccak256(abi.encodePacked(
                    sigData.newTotalYieldAccrued, 
                    sigData.expectedOracleError, 
                    sigData.timeStamp, 
                    address(this), 
                    block.chainid))
            ),
            _sig
        );
        require(
            _directory.hasRole(Constants.ADMIN_ORACLE_ROLE, recoveredAddress),
            'signer must have permission from admin oracle role'
        );
        require(sigData.timeStamp > _lastUpdatedTotalYieldAccrued, 'cannot update oracle using old data');
        require(sigData.timeStamp <= block.timestamp, 'cannot update oracle using future data');

        OperatorDistributor od = OperatorDistributor(_directory.getOperatorDistributorAddress());

        // Prevent a front-running attack/accident where a valid sig is generated, then a minipool is processed before 
        // this function is called, causing a double-count of rewards. 
        if(sigData.expectedOracleError < od.oracleError()) { 
            if(sigData.newTotalYieldAccrued > 0) {
                _totalYieldAccrued = sigData.newTotalYieldAccrued - int(od.oracleError() - sigData.expectedOracleError);
            }
            else if(sigData.newTotalYieldAccrued < 0) {
                _totalYieldAccrued = sigData.newTotalYieldAccrued + int(od.oracleError() - sigData.expectedOracleError);
            }
            else {
                _totalYieldAccrued = 0;
            }
        } else if(sigData.expectedOracleError == od.oracleError()) {
            _totalYieldAccrued = sigData.newTotalYieldAccrued;
        } else {
            // Note that actual oracle error will only ever increase or be reset to 0,
            // so if expectedOracleError is not <= actual oracleError, there is something wrong with the oracle.
            revert("actual oracleError was less than expectedOracleError");
        }
        
        _lastUpdatedTotalYieldAccrued = block.timestamp;
        emit TotalYieldAccruedUpdated(_totalYieldAccrued);

        od.resetOracleError();
    }
    ```


- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [x] The Rate Provider is susceptible to donation attacks.

    #### xrRETH
    For xrRETH the vaults `asset`'s balance is measured as part of the price rate.
    ```solidity
    function totalAssets() public view override returns (uint256) {
        OperatorDistributor od = OperatorDistributor(getDirectory().getOperatorDistributorAddress());
        (uint256 distributableYield, bool signed) = getDistributableYield();
        uint256 merkleRewards = MerkleClaimStreamer(getDirectory().getMerkleClaimStreamerAddress()).getStreamedTvlEth();
        return (
            uint256(
                int(IERC20(asset()).balanceOf(address(this)) + od.getTvlEth() +  merkleRewards)  +
                    (signed ? -int(distributableYield) : int(distributableYield))
            )
        );
    }
    ```

    #### xRPL
    Similarly this is the case here
    ```solidity
    function totalAssets() public view override returns (uint256) {
        return (IERC20(asset()).balanceOf(address(this)) +
            OperatorDistributor(_directory.getOperatorDistributorAddress()).getTvlRpl()) +
            MerkleClaimStreamer(getDirectory().getMerkleClaimStreamerAddress()).getStreamedTvlRpl();
    }
    ```

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.


## Conclusion
**Summary judgment: USABLE**

The upgradeability of the contracts is guarded behind multisigs and a timelock contract. The involved oracle price data is signed data of an eoa. For more information on the oracle see comments from Gravita
> Response from Gravita: That key is used by the oracle service which reads the validator balances to know how many assets back the token. We can't go into security of this service too much but only one person generated this key (me, the doxxed CTO of the dev team) and no one else has access to it. And of course the admin multisig can change which address has this oracle permission if that oracle signing key is lost for some reason.


