export const erc4626Abi = [
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
            { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'assets', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'shares', type: 'uint256' },
        ],
        name: 'Deposit',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
            { indexed: true, internalType: 'address', name: 'receiver', type: 'address' },
            { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'assets', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'shares', type: 'uint256' },
        ],
        name: 'Withdraw',
        type: 'event',
    },
    {
        inputs: [],
        name: 'asset',
        outputs: [{ internalType: 'address', name: 'assetTokenAddress', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalAssets',
        outputs: [{ internalType: 'uint256', name: 'totalManagedAssets', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: 'assets', type: 'uint256' }],
        name: 'convertToShares',
        outputs: [{ internalType: 'uint256', name: 'shares', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: 'shares', type: 'uint256' }],
        name: 'convertToAssets',
        outputs: [{ internalType: 'uint256', name: 'assets', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: 'receiver', type: 'address' }],
        name: 'maxDeposit',
        outputs: [{ internalType: 'uint256', name: 'maxAssets', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: 'assets', type: 'uint256' }],
        name: 'previewDeposit',
        outputs: [{ internalType: 'uint256', name: 'shares', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'assets', type: 'uint256' },
            { internalType: 'address', name: 'receiver', type: 'address' },
        ],
        name: 'deposit',
        outputs: [{ internalType: 'uint256', name: 'shares', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: 'receiver', type: 'address' }],
        name: 'maxMint',
        outputs: [{ internalType: 'uint256', name: 'maxShares', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: 'shares', type: 'uint256' }],
        name: 'previewMint',
        outputs: [{ internalType: 'uint256', name: 'assets', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'shares', type: 'uint256' },
            { internalType: 'address', name: 'receiver', type: 'address' },
        ],
        name: 'mint',
        outputs: [{ internalType: 'uint256', name: 'assets', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
        name: 'maxWithdraw',
        outputs: [{ internalType: 'uint256', name: 'maxAssets', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: 'assets', type: 'uint256' }],
        name: 'previewWithdraw',
        outputs: [{ internalType: 'uint256', name: 'shares', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'assets', type: 'uint256' },
            { internalType: 'address', name: 'receiver', type: 'address' },
            { internalType: 'address', name: 'owner', type: 'address' },
        ],
        name: 'withdraw',
        outputs: [{ internalType: 'uint256', name: 'shares', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
        name: 'maxRedeem',
        outputs: [{ internalType: 'uint256', name: 'maxShares', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: 'shares', type: 'uint256' }],
        name: 'previewRedeem',
        outputs: [{ internalType: 'uint256', name: 'assets', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'shares', type: 'uint256' },
            { internalType: 'address', name: 'receiver', type: 'address' },
            { internalType: 'address', name: 'owner', type: 'address' },
        ],
        name: 'redeem',
        outputs: [{ internalType: 'uint256', name: 'assets', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
]
