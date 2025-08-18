import { Address, Chain } from 'viem'
import {
    base,
    mainnet,
    arbitrum,
    avalanche,
    gnosis,
    sonic,
    sepolia,
    polygon,
    fraxtal,
    optimism,
    polygonZkEvm,
    mode,
} from 'viem/chains'
import { hyperEvm } from './customChains'

// Mapping of chain names to registry keys
export const chainNameToRegistryKey: { [key: string]: string } = {
    'Arbitrum One': 'arbitrum',
    mainnet: 'ethereum',
    'OP Mainnet': 'optimism',
    'Polygon zkEVM': 'zkevm',
    'Mode Mainnet': 'mode',
}

export function validateAndPrepareNetwork(networkName: string, rpcUrl: string): Chain {
    // Map network name to Chain object
    const networks: { [key: string]: Chain } = {
        base,
        mainnet,
        arbitrum,
        avalanche,
        gnosis,
        fraxtal,
        optimism,
        sonic,
        sepolia,
        polygon,
        polygonZkEvm,
        mode,
        hyperEvm,
    }

    let network = networks[networkName]

    if (!network) {
        throw new Error(`Unsupported network: ${networkName}`)
    }

    // Override the default RPC URL
    // Reason it must be an RPC URL that supports createAccessList
    network = {
        ...network,
        rpcUrls: {
            ...network.rpcUrls,
            default: {
                http: [rpcUrl],
            },
        },
    }

    // some viem chains do not have a block explorer api url set
    if (networkName === 'sonic') {
        network = {
            ...network,
            blockExplorers: {
                ...network.blockExplorers,
                default: {
                    ...network.blockExplorers?.default,
                    apiUrl: 'https://api.sonicscan.org/api',
                    name: 'SonicScan',
                    url: network.blockExplorers?.default?.url || 'https://sonicscan.io',
                },
            },
        }
    }

    return network
}

export function validateAddress(address: string, fieldName: string): Address {
    if (!address || !address.startsWith('0x')) {
        throw new Error(`Invalid ${fieldName}: ${address}. It must start with "0x".`)
    }
    return address as Address
}

export function validateInputData(
    rateProviderAddress: string,
    networkName: string,
    rateProviderAsset: string,
    rpcUrl: string,
): {
    rateProviderAddress: Address
    network: Chain
    rateProviderAsset: Address
    rpcUrl: string
} {
    if (!rateProviderAddress || !networkName || !rateProviderAsset || !rpcUrl) {
        throw new Error('All parameters are required: rateProviderAddress, network, rateProviderAsset, rpcUrl')
    }

    const validatedRateProviderAddress = validateAddress(rateProviderAddress, 'rateProviderAddress')
    const validatedRateProviderAsset = validateAddress(rateProviderAsset, 'rateProviderAsset')
    const validatedNetwork = validateAndPrepareNetwork(networkName, rpcUrl)

    return {
        rateProviderAddress: validatedRateProviderAddress,
        network: validatedNetwork,
        rateProviderAsset: validatedRateProviderAsset,
        rpcUrl,
    }
}
