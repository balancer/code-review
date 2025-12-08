import * as dotenv from 'dotenv'
import HypernativeApi from 'services/hypernativeApi'
import { hyperEvm } from 'utils/customChains'
import { Address } from 'viem'

dotenv.config()

/**
 * This script is used to add Hypernative agents for rate providers.
 * It uses the Hypernative API to create custom agents based on the provided input.
 */
const rateProvider = '' as Address
const upgradeableComponents: Address[] = []
const chain = hyperEvm

async function addHypernativeAgents(rateProvider: Address, upgradeableComponents: Address[]) {
    const hypernativeApi = new HypernativeApi(
        chain,
        process.env.HYPERNATIVE_CLIENT_ID || '',
        process.env.HYPERNATIVE_CLIENT_SECRET || '',
    )

    await hypernativeApi.createCustomAgentRateDeviation({
        chain: chain,
        ruleString: `On ${chain.name}: when ${rateProvider}: getRate().uint256 changed by 10% in less than 10 blocks.\nSample every 5 blocks`,
        contractAddress: rateProvider,
        contractAlias: rateProvider,
        agentName: `${rateProvider.slice(-4)}rate-deviation-${chain.name}`,
        rateProvider: rateProvider,
    })

    await hypernativeApi.createCustomAgentUpgrade({
        chain: chain,
        ruleString: `On ${chain.name}: when ${upgradeableComponents.map((component: string) => component).join(' or ')}: Upgraded(indexed address implementation)}`,
        contractAddress: upgradeableComponents,
        contractAlias: upgradeableComponents.map((component: string) => component).join(' or '),
        agentName: `${rateProvider.slice(-4)}-upgrade-${chain.name}`,
        rateProvider: rateProvider,
    })

    await hypernativeApi.createCustomAgentRateRevert({
        chain: chain,
        ruleString: `On ${chain.name}: when ${rateProvider}: getRate() reverts`,
        contractAddress: rateProvider,
        contractAlias: rateProvider,
        agentName: `${rateProvider.slice(-4)}rate-revert-${chain.name}`,
        rateProvider: rateProvider,
    })
}

addHypernativeAgents(rateProvider, upgradeableComponents)
    .then(() => {
        console.log('Hypernative agents added successfully.')
    })
    .catch((error) => {
        console.error('Error adding Hypernative agents:', error)
    })
