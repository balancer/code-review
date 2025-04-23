import path from 'path'
import * as dotenv from 'dotenv'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { Address } from 'viem'

import ERC4626DataService from '../src/erc4626App'
import { erc4626Template } from '../src/utils/erc4626Template'
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

import { doOnchainCallGetName, doOnchainCallGetAsset } from '../src'

dotenv.config()
const fs = require('fs')

// to use this script use the command below
// for network see the viem chains
// Important: The custom RPC URL in the .env must support createAccessList (or the viem default rpc url)
// npm run write-erc4626-review -- --erc4626Address <address> --network avalanche --rpcUrl <custom rpc url>

// Mapping of chain names to registry keys
const chainNameToRegistryKey: { [key: string]: string } = {
    'Arbitrum One': 'arbitrum',
    mainnet: 'ethereum',
    'OP Mainnet': 'optimism',
    'Polygon zkEVM': 'zkevm',
    'Mode Mainnet': 'mode',
}

async function writeReviewAndUpdateRegistry(erc4626: Address, network: Chain, rpcUrl: string) {
    const service = new ERC4626DataService(erc4626, network)

    await service.initialize()
    const upgradeData = await service.getUpgradeableContracts()
    const tenderlysimUrl = await service.getTenderlySimulation()

    //const [{ ContractName }] = await service.getContractInfo([rateProviderAsset])
    const contractName = await doOnchainCallGetName(erc4626, network, rpcUrl)
    const asset = await doOnchainCallGetAsset(erc4626, network, rpcUrl)

    // Write report
    const templateData = {
        rateProvider: `${service.sourceCode.ContractName}.md`,
        isUpgradeable: `${upgradeData.map((c) => c.address).includes(erc4626) ? 'x' : ' '}`,
        hasUpgradeableElements: `${upgradeData.filter((contract) => contract.address !== erc4626).length > 0 ? 'x' : ' '}`,
    }

    const filledTemplate = erc4626Template
        .replace('{{date}}', new Date().toLocaleDateString('en-GB'))
        .replace('{{erc4626}}', contractName)
        .replace('{{network}}', service.chain.name)
        .replace('{{erc4626Address}}', erc4626)
        .replace(
            '{{chainExplorer}}',
            `${service.chain.blockExplorers?.default.url}/address/${service.rateProvider}` || '',
        )
        .replace('{{isUpgradeable}}', templateData.isUpgradeable)
        .replace('{{hasUpgradeableElements}}', templateData.hasUpgradeableElements)
        .replace('{{tenderlySimUrl}}', tenderlysimUrl)

    fs.writeFileSync(
        `./erc4626/${(contractName.charAt(0).toUpperCase() + contractName.slice(1)).replace(' ', '')}Erc4626VaultReview.md`,
        filledTemplate,
    )

    // Write to registry
    const registryPath = path.join(__dirname, '../erc4626/registry.json')
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'))

    const newEntry = {
        asset: asset,
        name: `${(contractName.charAt(0).toUpperCase() + contractName.slice(1)).replace(' ', '')}Erc4626Vault.md`,
        summary: '',
        review: `./${(contractName.charAt(0).toUpperCase() + contractName.slice(1)).replace(' ', '')}Erc4626VaultReview.md`,
        warnings: [],
        upgradeableComponents: upgradeData.map((contract) => ({
            entrypoint: contract.address,
            implementationReviewed: contract.implementation,
        })),
        canUseBufferForSwaps: '',
        useUnderlyingForAddRemove: '',
        useWrappedForAddRemove: '',
    }
    const registryKey = chainNameToRegistryKey[service.chain.name] || service.chain.name.toLowerCase()

    if (!registry[registryKey]) {
        registry[registryKey] = {}
    }

    registry[registryKey][erc4626] = newEntry

    fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2))
}

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
            choices: ['base', 'mainnet', 'arbitrum', 'avalanche', 'gnosis', 'fraxtal', 'optimism', 'sonic'],
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
