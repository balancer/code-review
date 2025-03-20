import RateProviderDataService from '../src/app'
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
import path from 'path'
import * as dotenv from 'dotenv'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { Address } from 'viem'
dotenv.config()

import { template } from '../src/utils/template'
const fs = require('fs')

// to use this script use the command below
// for network see the viewm chains
// npm run write-review -- --rateProviderAddress <address> --network <network> --rateProviderAsset <asset>

async function writeReviewAndUpdateRegistry(rateProviderAddress: Address, network: Chain, rateProviderAsset: string) {
    const service = new RateProviderDataService(rateProviderAddress, network)

    await service.initialize()
    const upgradeData = await service.getUpgradeableContracts()

    const rateInfo = await service.isRateScale18()
    const hasInterfaceImplemented = service.hasValidGetRateFunction()

    const tenderlysimUrl = await service.getTenderlySimulation()

    // Write report
    const templateData = {
        rateProvider: `${service.sourceCode.ContractName}.md`,
        hasInterface: `${hasInterfaceImplemented ? 'x' : ' '}`,
        isScale18: `${rateInfo.scale18 ? 'x' : ' '}`,
        isUpgradeable: `${upgradeData.map((c) => c.address).includes(rateProviderAddress) ? 'x' : ' '}`,
        hasUpgradeableElements: `${upgradeData.filter((contract) => contract.address !== rateProviderAddress).length > 0 ? 'x' : ' '}`,
        isUsable: `${hasInterfaceImplemented && rateInfo.scale18 ? 'USABLE' : 'UNUSABLE'}`,
    }

    const filledTemplate = template
        .replace('{{date}}', Date.now().toString())
        .replace('{{rateProvider}}', templateData.rateProvider)
        .replace('{{network}}', service.chain.name)
        .replace('{{rateProviderAddress}}', rateProviderAddress)
        .replace(
            '{{chainExplorer}}',
            `${service.chain.blockExplorers?.default.url}/address/${service.rateProvider}` || '',
        )
        .replace('{{hasInterface}}', templateData.hasInterface)
        .replace('{{isScale18}}', templateData.isScale18)
        .replace('{{isUpgradeable}}', templateData.isUpgradeable)
        .replace('{{hasUpgradeableElements}}', templateData.hasUpgradeableElements)
        .replace('{{isUsable}}', templateData.isUsable)
        .replace('{{tenderlySimUrl}}', tenderlysimUrl)

    fs.writeFileSync(`${service.sourceCode.ContractName}.md`, filledTemplate)

    // Write to registry
    const registryPath = path.join(__dirname, '../rate-providers/registry.json')
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'))

    const newEntry = {
        asset: rateProviderAsset,
        name: service.sourceCode.ContractName,
        summary: templateData.isUsable === 'USABLE' ? 'safe' : 'unsafe',
        review: `./${service.sourceCode.ContractName}.md`,
        warnings: [],
        factory: '',
        upgradeableComponents: upgradeData.map((contract) => ({
            address: contract.address,
            implementation: contract.implementation,
        })),
    }
    // Mapping of chain names to registry keys
    const chainNameToRegistryKey: { [key: string]: string } = {
        'Arbitrum One': 'arbitrum',
        mainnet: 'ethereum',
        'OP Mainnet': 'optimism',
        'Polygon zkEVM': 'zkevm',
        'Mode Mainnet': 'mode',
    }

    const registryKey = chainNameToRegistryKey[service.chain.name] || service.chain.name.toLowerCase()

    if (!registry[registryKey]) {
        registry[registryKey] = {}
    }

    registry[registryKey][rateProviderAddress] = newEntry

    fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2))
}

// Parse command-line arguments using yargs
async function main() {
    const argv = await yargs(hideBin(process.argv))
        .option('rateProviderAddress', {
            alias: 'r',
            type: 'string',
            description: 'The address of the rate provider',
            demandOption: true,
        })
        .option('network', {
            alias: 'n',
            type: 'string',
            description: 'The network the rate provider is deployed on',
            choices: ['base', 'mainnet', 'arbitrum', 'avalanche'],
            demandOption: true,
        })
        .option('rateProviderAsset', {
            alias: 'a',
            type: 'string',
            description: 'The asset the rate provider provides the rate for',
            demandOption: true,
        }).argv

    // Map network name to Chain object
    const networks: { [key: string]: Chain } = {
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
    }

    const network = networks[argv.network]

    if (!network) {
        console.error(`Unsupported network: ${argv.network}`)
        process.exit(1)
    }

    const rateProviderAddress = argv.rateProviderAddress.startsWith('0x')
        ? (argv.rateProviderAddress as Address)
        : (`0x${argv.rateProviderAddress}` as Address)
    await writeReviewAndUpdateRegistry(rateProviderAddress, network, argv.rateProviderAsset)
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})
