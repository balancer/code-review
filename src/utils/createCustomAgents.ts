import HypernativeApi from '../../src/services/hypernativeApi'
import { HypernativeAgent } from '../../src/types/types'

import { Address, Chain } from 'viem'

export async function createCustomAgents(
    rateProvider: Address,
    chain: Chain,
    isStablecoin: boolean,
): Promise<HypernativeAgent[]> {
    const hypernativeApi = new HypernativeApi(
        chain,
        process.env.HYPERNATIVE_CLIENT_ID || '',
        process.env.HYPERNATIVE_CLIENT_SECRET || '',
    )

    // Create the two agents sequentially and collect their minimal representations
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

    const rateRevertAgent = await hypernativeApi.createCustomAgentRateRevert({
        chain,
        ruleString: `On ${chain.name}: when ${rateProvider}: getRate() reverts`,
        contractAddress: rateProvider,
        contractAlias: rateProvider,
        agentName: `${rateProvider.slice(-4)}rate-revert`,
        rateProvider: rateProvider,
        operands: [],
    })

    return [rateDeviationAgent, rateRevertAgent]
}
