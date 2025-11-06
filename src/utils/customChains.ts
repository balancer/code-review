import { defineChain } from 'viem'

export const hyperEvm = /*#__PURE__*/ defineChain({
    id: 999,
    name: 'HyperEVM',
    nativeCurrency: {
        name: 'Hype',
        symbol: 'HYPE',
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: ['https://rpc.hyperliquid.xyz/evm'],
            webSocket: ['wss://rpc.hyperevm.com/ws'],
        },
    },
    blockExplorers: {
        default: {
            name: 'HyperEVM Explorer',
            url: 'https://hyperevmscan.io',
            apiUrl: 'https://api.etherscan.io/v2/api?chainid=999',
        },
    },
    contracts: {
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 13051,
        },
    },
})

export const plasma = /*#__PURE__*/ defineChain({
    id: 9745,
    name: 'Plasma',
    nativeCurrency: {
        name: 'XPL',
        symbol: 'XPL',
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: ['https://rpc.plasma.to/'],
            webSocket: ['wss://rpc.plasma.to/'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Plasma Explorer',
            url: 'https://plasmascan.to/',
            apiUrl: 'https://api.routescan.io/v2/network/mainnet/evm/9745/etherscan/api?',
        },
    },
    contracts: {
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 1,
        },
    },
})

export const xlayer = /*#__PURE__*/ defineChain({
    id: 196,
    name: 'XLayer',
    nativeCurrency: {
        name: 'XLAYER',
        symbol: 'XLAYER',
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: ['https://rpc.xlayer.tech/'],
            webSocket: ['wss://rpc.xlayer.tech/'],
        },
    },
    blockExplorers: {
        default: {
            name: 'XLayer Explorer',
            url: 'https://xlayer.io/',
            apiUrl: 'https://api.xlayer.io/v1/api?',
        },
    },
    contracts: {
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 1,
        },
    },
})
