import path from 'path'
import HypernativeApi from '../../src/services/hypernativeApi'
import { HypernativeAgent } from '../../src/types/types'
const fs = require('fs')

import { Address, Chain } from 'viem'

// Mapping of chain names to registry keys
const chainNameToRegistryKey: { [key: string]: string } = {
    'Arbitrum One': 'arbitrum',
    mainnet: 'ethereum',
    'OP Mainnet': 'optimism',
    'Polygon zkEVM': 'zkevm',
    'Mode Mainnet': 'mode',
}

export async function createCustomAgents(
    rateProvider: Address,
    chain: Chain,
    isStablecoin: boolean,
): Promise<HypernativeAgent[]> {
    // get the relevant information from the registry
    const registryPath = path.join(__dirname, '../../rate-providers/registry.json')
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'))

    const registryKey = chainNameToRegistryKey[chain.name] || chain.name.toLowerCase()
    const rateProviderData = registry[registryKey][rateProvider]

    const upgradeableComponents = rateProviderData.upgradeableComponents.map(
        (component: { entrypoint: any }) => component.entrypoint,
    )

    const hypernativeApi = new HypernativeApi(
        chain,
        process.env.HYPERNATIVE_CLIENT_ID || '',
        process.env.HYPERNATIVE_CLIENT_SECRET || '',
    )

    // Create the three agents sequentially and collect their minimal representations
    // the rate deviation agent changes based on isStableCoin:
    // if is Stablecoin 10% over 10 blocks
    // if volatile coin 25% over 10 blocks

    let rateDeviationAgent: HypernativeAgent

    if (isStablecoin) {
        rateDeviationAgent = await hypernativeApi.createCustomAgentRateDeviation({
            chain,
            ruleString: `On ${chain.name}: when ${rateProvider}: getRate().uint256 changed by 10% in less than 10 blocks.\nSample every 5 blocks`,
            contractAddress: rateProvider,
            contractAlias: rateProvider,
            agentName: `${rateProvider.slice(-4)}rate-deviation`,
            rateProvider: rateProvider,
            operands: ['10'],
        })
    } else {
        // volatile
        rateDeviationAgent = await hypernativeApi.createCustomAgentRateDeviation({
            chain,
            ruleString: `On ${chain.name}: when ${rateProvider}: getRate().uint256 changed by 25% in less than 10 blocks.\nSample every 5 blocks`,
            contractAddress: rateProvider,
            contractAlias: rateProvider,
            agentName: `${rateProvider.slice(-4)}rate-deviation`,
            rateProvider: rateProvider,
            operands: ['25'],
        })
    }

    const upgradeAgent = await hypernativeApi.createCustomAgentUpgrade({
        chain,
        ruleString: `On ${chain.name}: when ${upgradeableComponents
            .map((component: string) => component)
            .join(' or ')}: Upgraded(indexed address implementation)}`,
        contractAddress: upgradeableComponents,
        contractAlias: upgradeableComponents.map((component: string) => component).join(' or '),
        agentName: `${rateProvider.slice(-4)}-upgrade`,
        rateProvider: rateProvider,
    })

    const rateRevertAgent = await hypernativeApi.createCustomAgentRateRevert({
        chain,
        ruleString: `On ${chain.name}: when ${rateProvider}: getRate() reverts`,
        contractAddress: rateProvider,
        contractAlias: rateProvider,
        agentName: `${rateProvider.slice(-4)}rate-revert`,
        rateProvider: rateProvider,
        operands: [],
    })

    return [rateDeviationAgent, upgradeAgent, rateRevertAgent]
}
