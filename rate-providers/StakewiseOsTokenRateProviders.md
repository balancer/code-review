# Rate Provider: `PriceFeed`

## Details
- Reviewed by: @mkflow27
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [gnosis:0x9B1b13afA6a57e54C03AD0428a4766C39707D272](https://gnosisscan.io/address/0x9b1b13afa6a57e54c03ad0428a4766c39707d272#readContract)
- Audit report(s):
    - [audits](https://github.com/stakewise/v3-core/tree/main/audits)

## Context
The osGNO rate provider reports the rate of osGNO - GNO. osGNO is a yield bearing token accruing yield from validating the gnosis chain. The rate is calculated by dividing total assets over total shares. osGNO can be minted via several Vault contracts (which are created from a factory contract). osGNO however is not the Vault's share token but a separate token minted by the `OsTokenVaultController`.  

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
    - upgradeable component: `GnoVault` (too many as they are created from a factory)
    - admin address: [gnosis:0x8737f638E9af54e89ed9E1234dbC68B115CD169e](https://gnosisscan.io/address/0x8737f638E9af54e89ed9E1234dbC68B115CD169e#readProxyContract) (This is the address allowed to add new implementations to the registry)
    - admin type: 4/7 Multisig
    - context: Every `GnoVault` (see [Stakewise app](https://app.stakewise.io/vaults)) is an ERC1969 Proxy contract with upgradeability. The account allowed to upgrade the vault is the vault's creator as he called `createVault`. Every vault has the capability to get `osGNO` minted by calling into the `OsTokenVaultController` deployed [here](https://gnosisscan.io/address/0x60B2053d7f2a0bBa70fe6CDd88FB47b579B9179a#code) and the crucial check if a specified amount of `osTokenShares` a vault can mint is done in the vault contract. This is important as the ratio of total assets over total shares is relevant for the return of `getRate`.
        ```solidity
        // calculate and validate LTV
        if (_calcMaxOsTokenShares(convertToAssets(_balances[msg.sender])) < position.shares) {
        revert Errors.LowLtv();
        }
        ```
        Since the upgrade of a vault could remove this check (and `osGNO`) could be minted more easily the Vault's upgradeability system needs to be take care of this scenario (since everyone can create a vault). Upgrading a vault works like
        ```solidity
        function upgradeToAndCall(address newImplementation, bytes memory data) public payable virtual onlyProxy {
            _authorizeUpgrade(newImplementation);
            _upgradeToAndCallUUPS(newImplementation, data);
        }
        ```
        and the authorization checks are done via
        ```solidity
        /// @inheritdoc UUPSUpgradeable
        function _authorizeUpgrade(address newImplementation) internal view override {
        _checkAdmin();
        if (
            newImplementation == address(0) ||
            ERC1967Utils.getImplementation() == newImplementation || // cannot reinit the same implementation
            IVaultVersion(newImplementation).vaultId() != vaultId() || // vault must be of the same type
            IVaultVersion(newImplementation).version() != version() + 1 || // vault cannot skip versions between
            !IVaultsRegistry(_vaultsRegistry).vaultImpls(newImplementation) // new implementation must be registered
            ) {
            revert Errors.UpgradeFailed();
            }
        }
        ```
        The `_vaultsRegistry` deployed [here](https://gnosisscan.io/address/0x7d014B3C6ee446563d4e0cB6fBD8C3D0419867cB) acts as the key guardrail of what implementations the vaults can be upgraded to. The addition of new vault implementations is guarded behind an `onlyOwner` modifier.
        ```solidity
            /// @inheritdoc IVaultsRegistry
        function addVaultImpl(address newImpl) external override onlyOwner {
            if (vaultImpls[newImpl]) revert Errors.AlreadyAdded();
            vaultImpls[newImpl] = true;
            emit VaultImplAdded(newImpl);
        }
        ```

### Oracles
- [x] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes).
    - source: A `Keeper` contract
    - source address: [gnosis:0xcAC0e3E35d3BA271cd2aaBE688ac9DB1898C26aa](https://vscode.blockscan.com/gnosis/0xcAC0e3E35d3BA271cd2aaBE688ac9DB1898C26aa)
    - any protections? Yes: Part of the `getRate` return value is the calculation of unclaimed assets, based on a `avgRewardPerSecond` state variable, which can be set by the mentioned `Keeper`. The calculation of `totalAssets()` uses `_unclaimedAssets()` via:
        ```solidity
            /// @inheritdoc IOsTokenVaultController
        function totalAssets() public view override returns (uint256) {
        uint256 profitAccrued = _unclaimedAssets();
        if (profitAccrued == 0) return _totalAssets;

        uint256 treasuryAssets = Math.mulDiv(profitAccrued, feePercent, _maxFeePercent);
        return _totalAssets + profitAccrued - treasuryAssets;
        }
        /**
        * @dev Internal function for calculating assets accumulated since last update
        */
        function _unclaimedAssets() internal view returns (uint256) {
        // calculate time passed since the last update
        uint256 timeElapsed;
        unchecked {
            // cannot realistically underflow
            timeElapsed = block.timestamp - _lastUpdateTimestamp;
        }
        if (timeElapsed == 0) return 0;
        return Math.mulDiv(avgRewardPerSecond * _totalAssets, timeElapsed, _wad);
        }
        ```
    As part of the keepers `updateRewards` function, the `avgRewardsPerSecond` is updated in the controller contract. The function `updateRewards` called on the [keeper](https://vscode.blockscan.com/gnosis/0xcAC0e3E35d3BA271cd2aaBE688ac9DB1898C26aa) has checks, which include:
    - signature verification
    - check if provided rewards per second are below the max avg reward per second.
    - Updating state to reset `elapsedTime`

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price).

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

## Conclusion
**Summary judgment: SAFE**

This rate provider should work well with Balancer pools. The upgradeability of the vault system is guarded behind only allowing valid implementations managed by the Stakewise team. Additionally the oracle functionality of the keeper has validity checks implemented reducing the risk the oracle poses for the rate calculation.  