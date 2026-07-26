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

type RateProviderWarnings = {
    isMarketRate?: boolean
    // The price source stops publishing on a schedule rather than updating continuously, either because it
    // follows a venue calendar or because it publishes a periodic valuation. Determined from the source's
    // publication record, not from the asset class: a tokenized real-world asset may publish continuously.
    hasPublicationGaps?: boolean
}

// Emitted in place of the freshness notes, which cannot be determined on chain. It is deliberately not a
// checkbox: an unchecked box in this checklist reads as "this red flag does not apply", which would assert
// that freshness was reviewed when nobody had looked at it.
const FRESHNESS_PLACEHOLDER =
    '\\<to be completed: where freshness is enforced (Rate Provider/source contract/nowhere), the maximum age if any, and the expected update cadence\\>'

// Follow-up questions emitted only when the source has scheduled publication gaps. A maximum age cannot
// answer these, because no single bound both survives a routine gap and catches a failure between
// publications. The decisive questions are what the value does while the source is silent, and how far it
// actually moved: a gap only matters when the value behind it can move meaningfully while nobody publishes.
const PUBLICATION_GAPS_DETAIL = `    - publication pattern: \\<to be completed\\>
    - longest routine gap: \\<to be completed: measure it on chain rather than assuming\\>
    - is the published value a live market quote, or a periodic valuation? \\<to be completed\\>
    - while the source is silent, can the value move discontinuously? \\<to be completed: this decides whether the gap is a risk or just how the source works\\>
    - how far did the value actually move across the longest gap? \\<to be completed: record the movement next to the gap; a long gap on a value that barely moves is not the same risk as a short gap on one that does\\>
    - does the source publish a market state or session field? \\<to be completed: name the field and its values, or NO\\>
    - what does \\\`getRate\\\` return during a gap? \\<to be completed: the last published value served as though current, or reverts\\>
`

export async function writeReviewAndUpdateRegistry(
    rateProviderAddress: Address,
    network: Chain,
    rateProviderAsset: Address,
    rpcUrl: string,
    rateProviderDocs?: string,
    linkToAudits?: string,
    warnings?: RateProviderWarnings,
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
        hasPublicationGaps: `${warnings?.hasPublicationGaps ? 'x' : ' '}`,
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
        .replace('{{hasPublicationGaps}}', templateData.hasPublicationGaps)
        .replace('{{publicationGapsDetail}}', warnings?.hasPublicationGaps ? PUBLICATION_GAPS_DETAIL : '')
        .replace('{{freshnessNotes}}', FRESHNESS_PLACEHOLDER)
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
        warnings: [
            ...(warnings?.isMarketRate ? ['market-rate'] : []),
            ...(warnings?.hasPublicationGaps ? ['publication-gaps'] : []),
        ],
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
