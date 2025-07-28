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
            url: 'https://hyperevmscan.com',
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
