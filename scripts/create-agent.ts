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

import HypernativeApi from '../src/services/hypernativeApi'

import { CustomAgentInput } from '../src/types/types'

async function main() {
    const hyperNativeApi = new HypernativeApi(
        mainnet,
        process.env.HYPERNATIVE_CLIENT_ID || '',
        process.env.HYPERNATIVE_CLIENT_SECRET || '',
    )

    const agentInput: CustomAgentInput = {
        chain: mainnet,
        ruleString:
            'On Base: when 0x05E956cb3407b1B22F4ed8568F3C28644Da28B85: getRate().uint256 changed by 10% in less than 10 blocks.\nSample every 5 blocks',
        contractAddress: '0x05E956cb3407b1B22F4ed8568F3C28644Da28B85',
        contractAlias: '0x05E956cb3407b1B22F4ed8568F3C28644Da28B85',
        agentName: 'rate provider rate deviation',
    }

    /* await hyperNativeApi.createCustomAgentRateDeviation(
        mainnet,
        'testing',
        '0x05E956cb3407b1B22F4ed8568F3C28644Da28B85',
        'chainlinkRateProvider',
        'testName',
    ) */

    await hyperNativeApi.createCustomAgentUpgrade(agentInput)
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})
