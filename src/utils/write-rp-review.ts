import path from 'path'
import * as dotenv from 'dotenv'
import crypto from 'crypto'
import { Address } from 'viem'

import RateProviderDataService from '../app'
import { template } from './template'
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

import { hyperEvm } from './customChains'

import HypernativeApi from '../services/hypernativeApi'
import { doOnchainCallGetName } from '../utils'

const fs = require('fs')

// Mapping of chain names to registry keys
const chainNameToRegistryKey: { [key: string]: string } = {
    'Arbitrum One': 'arbitrum',
    mainnet: 'ethereum',
    'OP Mainnet': 'optimism',
    'Polygon zkEVM': 'zkevm',
    'Mode Mainnet': 'mode',
}

export async function writeReviewAndUpdateRegistry(
    rateProviderAddress: Address,
    network: Chain,
    rateProviderAsset: Address,
    rpcUrl: string,
    rateProviderDocs?: string,
    linkToAudits?: string,
): Promise<{ rateProvider: Address }> {
    const service = new RateProviderDataService(rateProviderAddress, network)

    await service.initialize()
    const upgradeData = await service.getUpgradeableContracts()

    const rateInfo = await service.isRateScale18()
    const hasInterfaceImplemented = await service.hasValidGetRateFunction()

    const tenderlysimUrl = await service.getTenderlySimulation()

    //const [{ ContractName }] = await service.getContractInfo([rateProviderAsset])
    const contractName = await doOnchainCallGetName(rateProviderAsset, network, rpcUrl)

    // Write report
    const templateData = {
        rateProvider: `${service.sourceCode.ContractName}.md`,
        hasInterface: `${hasInterfaceImplemented ? 'x' : ' '}`,
        isScale18: `${rateInfo.scale18 ? 'x' : ' '}`,
        isUpgradeable: `${upgradeData.map((c) => c.address).includes(rateProviderAddress) ? 'x' : ' '}`,
        hasUpgradeableElements: `${upgradeData.filter((contract) => contract.address !== rateProviderAddress).length > 0 ? 'x' : ' '}`,
        isUsable: `${hasInterfaceImplemented && rateInfo.scale18 ? 'USABLE' : 'UNUSABLE'}`,
    }

    const shortUuid = crypto.randomBytes(2).toString('hex')

    const filledTemplate = template
        .replace('{{date}}', new Date().toLocaleDateString('en-GB'))
        .replace('{{rateProvider}}', contractName)
        .replace('{{network}}', service.chain.name)
        .replace('{{rateProviderAddress}}', rateProviderAddress)
        .replace(
            '{{chainExplorer}}',
            `${service.chain.blockExplorers?.default.url}/address/${service.rateProvider}` || '',
        )
        .replace('{{linkToAudits}}', linkToAudits || '')
        .replace('{{rateProviderDocs}}', rateProviderDocs || '')
        .replace('{{hasInterface}}', templateData.hasInterface)
        .replace('{{isScale18}}', templateData.isScale18)
        .replace('{{isUpgradeable}}', templateData.isUpgradeable)
        .replace('{{hasUpgradeableElements}}', templateData.hasUpgradeableElements)
        .replace('{{isUsable}}', templateData.isUsable)
        .replace('{{tenderlySimUrl}}', tenderlysimUrl)

    fs.writeFileSync(
        `./rate-providers/${(contractName.charAt(0).toUpperCase() + contractName.slice(1)).replace(' ', '')}RateProviderReview${shortUuid}.md`,
        filledTemplate,
    )

    // Write to registry
    const registryPath = path.join(__dirname, '../../rate-providers/registry.json')
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'))

    const newEntry = {
        asset: rateProviderAsset,
        name: `${(contractName.charAt(0).toUpperCase() + contractName.slice(1)).replace(' ', '')}RateProvider.md`,
        summary: templateData.isUsable === 'USABLE' ? 'safe' : 'unsafe',
        review: `./${(contractName.charAt(0).toUpperCase() + contractName.slice(1)).replace(' ', '')}RateProviderReview${shortUuid}.md`,
        warnings: [],
        factory: '',
        upgradeableComponents: upgradeData.map((contract) => ({
            entrypoint: contract.address,
            implementationReviewed: contract.implementation,
        })),
    }
    const registryKey = chainNameToRegistryKey[service.chain.name] || service.chain.name.toLowerCase()

    if (!registry[registryKey]) {
        registry[registryKey] = {}
    }

    registry[registryKey][rateProviderAddress] = newEntry

    fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2))
    return { rateProvider: rateProviderAddress }
}
