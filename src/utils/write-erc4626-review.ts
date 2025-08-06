import ERC4626DataService from '../erc4626App'
import { doOnchainCallGetAsset, doOnchainCallGetName } from './onchainCallHelpers'
import { erc4626Template } from './erc4626Template'

import { Address, Chain } from 'viem'
import crypto from 'crypto'
const fs = require('fs')
import path from 'path'

// Mapping of chain names to registry keys
const chainNameToRegistryKey: { [key: string]: string } = {
    'Arbitrum One': 'arbitrum',
    mainnet: 'ethereum',
    'OP Mainnet': 'optimism',
    'Polygon zkEVM': 'zkevm',
    'Mode Mainnet': 'mode',
}

export async function writeReviewAndUpdateRegistry(
    erc4626: Address,
    network: Chain,
    rpcUrl: string,
    linkToAudits?: string,
    erc4626Docs?: string,
    passingForkTests?: string,
    linkToForkTests?: string,
    canUseBufferForSwaps?: boolean,
    useUnderlyingForAddRemove?: boolean,
    useWrappedForAddRemove?: boolean,
) {
    const service = new ERC4626DataService(erc4626, network)

    await service.initialize()
    const upgradeData = await service.getUpgradeableContracts()
    const tenderlysimUrl = await service.getTenderlySimulation()

    //const [{ ContractName }] = await service.getContractInfo([rateProviderAsset])
    const contractName = await doOnchainCallGetName(erc4626, network, rpcUrl)
    const asset = await doOnchainCallGetAsset(erc4626, network, rpcUrl)
    const hasInterfaceImplemented = await service.hasValidERC4626Interface()

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
        .replace('{{hasPassingForkTests}}', passingForkTests ? 'x' : ' ')
        .replace('{{hasRequiredFunctionsImplemented}}', hasInterfaceImplemented ? 'x' : ' ')
        .replace(
            '{{chainExplorer}}',
            `${service.chain.blockExplorers?.default.url}/address/${service.rateProvider}` || '',
        )
        .replace('{{linkToAudits}}', linkToAudits || '')
        .replace('{{erc4626Docs}}', erc4626Docs || '')
        .replace('{{isUpgradeable}}', templateData.isUpgradeable)
        .replace('{{hasUpgradeableElements}}', templateData.hasUpgradeableElements)
        .replace('{{tenderlySimUrl}}', tenderlysimUrl)
        .replace('{{usableUnusable}}', hasInterfaceImplemented && passingForkTests ? 'USABLE' : 'UNUSABLE')
        .replace('{{linkToForkTests}}', linkToForkTests || '')

    const shortUuid = crypto.randomBytes(2).toString('hex')

    fs.writeFileSync(
        `./erc4626/${(contractName.charAt(0).toUpperCase() + contractName.slice(1)).replace(' ', '')}Erc4626VaultReview${shortUuid}.md`,
        filledTemplate,
    )

    // Write to registry
    const registryPath = path.join(__dirname, '../../erc4626/registry.json')
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'))

    const newEntry = {
        asset: asset,
        name: `${(contractName.charAt(0).toUpperCase() + contractName.slice(1)).replace(' ', '')}Erc4626Vault.md`,
        summary: linkToForkTests && hasInterfaceImplemented ? 'safe' : '',
        review: `./${(contractName.charAt(0).toUpperCase() + contractName.slice(1)).replace(' ', '')}Erc4626VaultReview${shortUuid}.md`,
        warnings: [],
        upgradeableComponents: upgradeData.map((contract) => ({
            entrypoint: contract.address,
            implementationReviewed: contract.implementation,
        })),
        canUseBufferForSwaps: canUseBufferForSwaps,
        useUnderlyingForAddRemove: useUnderlyingForAddRemove,
        useWrappedForAddRemove: useWrappedForAddRemove,
    }
    const registryKey = chainNameToRegistryKey[service.chain.name] || service.chain.name.toLowerCase()

    if (!registry[registryKey]) {
        registry[registryKey] = {}
    }

    registry[registryKey][erc4626] = newEntry

    fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2))
}
