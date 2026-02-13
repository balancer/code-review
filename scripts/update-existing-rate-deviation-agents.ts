import HypernativeApi from 'services/hypernativeApi'
import { rateProviderRateDeviationRule } from '../src/utils/hypernative/rate-provider-rate-deviation'
import * as dotenv from 'dotenv'
import { sepolia } from 'viem/chains'

dotenv.config()

async function main() {
    const clientId = process.env.HYPERNATIVE_CLIENT_ID
    const clientSecret = process.env.HYPERNATIVE_CLIENT_SECRET

    if (!clientId || !clientSecret) {
        console.error('HYPERNATIVE_CLIENT_ID and HYPERNATIVE_CLIENT_SECRET must be set in the environment.')
        process.exit(1)
    }

    const api = new HypernativeApi(sepolia, clientId, clientSecret)

    const agents = await api.getRateDeviationAgents()

    for (const agent of agents) {
        await updateChannelConfigurationForAgent({
            agentId: agent.id,
            clientId,
            clientSecret,
        })
        console.log(`Updated channels for agent ${agent.id} (${agent.agentName})`)
    }
}

async function updateChannelConfigurationForAgent(params: { agentId: number; clientId: string; clientSecret: string }) {
    const { agentId, clientId, clientSecret } = params
    const url = `https://api.hypernative.xyz/custom-agents/${agentId}`

    const channelsConfigurations = rateProviderRateDeviationRule.channelsConfigurations.map(({ id }) => ({ id }))

    const body = {
        state: 'enabled',
        channelsConfigurations,
    }

    const res = await fetch(url, {
        method: 'PATCH',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'x-client-id': clientId,
            'x-client-secret': clientSecret,
        },
        body: JSON.stringify(body),
    })

    if (!res.ok) {
        const text = await res.text()
        throw new Error(`PATCH ${url} failed (${res.status}): ${text}`)
    }
}

main().catch((e) => {
    console.error(e)
    process.exit(1)
})
