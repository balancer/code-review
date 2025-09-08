import * as dotenv from 'dotenv'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { Address } from 'viem'

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
    Chain,
    optimism,
    polygonZkEvm,
    mode,
} from 'viem/chains'

import { hyperEvm } from '../src/utils/customChains'
import { writeReviewAndUpdateRegistry } from '../src/utils/write-erc4626-review'

dotenv.config()

// to use this script use the command below
// for network see the viem chains
// Important: The custom RPC URL in the .env must support createAccessList (or the viem default rpc url)
// npm run write-erc4626-review -- --erc4626Address <address> --network avalanche --rpcUrl <custom rpc url>

// Parse command-line arguments using yargs
async function main() {
    const argv = await yargs(hideBin(process.argv))
        .option('erc4626Address', {
            alias: 'r',
            type: 'string',
            description: 'The address of the erc4626',
            demandOption: true,
        })
        .option('network', {
            alias: 'n',
            type: 'string',
            description: 'The network the rate provider is deployed on',
            choices: ['base', 'mainnet', 'arbitrum', 'avalanche', 'gnosis', 'fraxtal', 'optimism', 'sonic', 'hyperEvm'],
            demandOption: true,
        })
        .option('rpcUrl', {
            alias: 'u',
            type: 'string',
            description: 'The custom RPC URL to use for the network',
            demandOption: true,
        }).argv

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

    let network = networks[argv.network]

    if (!network) {
        console.error(`Unsupported network: ${argv.network}`)
        process.exit(1)
    }

    // Override the default RPC URL
    // Reason it must be an RPC URL that supports createAccessList
    network = {
        ...network,
        rpcUrls: {
            ...network.rpcUrls,
            default: {
                http: [argv.rpcUrl],
            },
        },
    }

    // some viem chains do not have a block explorer api url set
    if (argv.network === 'sonic') {
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

    const erc4626Address = argv.erc4626Address.startsWith('0x')
        ? (argv.erc4626Address as Address)
        : (() => {
              throw new Error(`Invalid erc4626Address: ${argv.erc4626Address}. It must start with "0x".`)
          })()

    await writeReviewAndUpdateRegistry(erc4626Address, network, argv.rpcUrl)
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})
