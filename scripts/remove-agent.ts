import * as dotenv from 'dotenv'
import HypernativeApi from 'services/hypernativeApi'
import { hyperEvm } from 'utils/customChains'
import type { Address } from 'viem'

dotenv.config()

async function main() {
    const clientId = process.env.HYPERNATIVE_CLIENT_ID
    const clientSecret = process.env.HYPERNATIVE_CLIENT_SECRET

    if (!clientId || !clientSecret) {
        console.error('HYPERNATIVE_CLIENT_ID and HYPERNATIVE_CLIENT_SECRET must be set in the environment.')
        process.exit(1)
    }

    // Set the chain and address inline here
    const chain = hyperEvm
    // TODO: fill in the address you want to use
    const address = '0x8Be2e3D4b85d05cac2dBbAC6c42798fb342aef45' as Address

    const hypernativeApi = new HypernativeApi(chain, clientId, clientSecret)

    try {
        const agents = await hypernativeApi.getCustomAgent(address, chain)

        if (agents.length === 0) {
            console.error('No Hypernative agents found for the given address and chain.')
            process.exit(1)
        }

        const sortedIds = agents.map((agent) => agent.id).sort((a, b) => a - b)
        const minId = sortedIds[0]

        const allSequential = sortedIds.every((id, index) => id === minId + index)

        if (!allSequential) {
            console.error(
                'Agent IDs are not sequential increments of 1 starting from the lowest ID. Aborting deletion.',
            )
            console.error('Agent IDs:', sortedIds)
            process.exit(1)
        }

        await hypernativeApi.deleteAgentsByIds(sortedIds)

        console.log(`Successfully deleted ${sortedIds.length} agents:`, sortedIds)
    } catch (error) {
        console.error('Error fetching or writing agent:', error)
        process.exit(1)
    }
}

main().catch((error) => {
    console.error('Unexpected error in remove-agent script:', error)
    process.exit(1)
})
