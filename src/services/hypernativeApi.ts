import { Address, Chain } from 'viem'
import { rateProviderRateDeviationRule } from '../utils/hypernative/rate-provider-rate-deviation'
import { rateProviderUpgradeRule } from '../utils/hypernative/rate-provider-upgrade'
import { rateProviderRateRevertRule } from '../utils/hypernative/rate-provider-rate-revert'

import { CustomAgentInput, CustomAgentInputUpgrade, HypernativeAgent } from '../types/types'

class HypernativeApi {
    public chain: Chain
    private clientId: string
    private clientSecret: string

    constructor(chain: Chain, clientId: string, clientSecret: string) {
        this.chain = chain
        this.clientId = clientId
        this.clientSecret = clientSecret
    }

    // Mapping of viem chain names to Hypernative chain strings
    private static chainNameToHypernativeKey: { [key: string]: string } = {
        'Arbitrum One': 'arbitrum',
        Ethereum: 'ethereum',
        'OP Mainnet': 'optimism',
        'Polygon zkEVM': 'zkevm',
        'Mode Mainnet': 'mode',
        Base: 'base',
        Avalanche: 'avalanche',
        Gnosis: 'gnosis',
        Fraxtal: 'fraxtal',
        Sonic: 'sonic',
        Sepolia: 'sepolia',
        Polygon: 'polygon',
        HyperEVM: 'hyperliquid_evm',
    }

    public async createCustomAgentRateDeviation(input: CustomAgentInput): Promise<HypernativeAgent> {
        const customAgentRule = { ...rateProviderRateDeviationRule }

        // Modify the rule based on input
        customAgentRule.rule.chain = this.getValidChainNameFromViemChain(input.chain)
        customAgentRule.rule.ruleString = input.ruleString
        customAgentRule.rule.contractAddress = input.contractAddress
        customAgentRule.rule.contractAddressAlias = input.contractAlias
        customAgentRule.agentName = input.agentName

        // Make the API call
        try {
            const response = await fetch('https://api.hypernative.xyz/custom-agents', {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'x-client-id': this.clientId,
                    'x-client-secret': this.clientSecret,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customAgentRule),
            })

            if (!response.ok) {
                const responseBody = await response.text()
                console.error('Response Status:', response.status)
                console.error('Response Body:', responseBody)
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data: any = await response.json()
            const chainString = this.getValidChainNameFromViemChain(input.chain)

            const agent: HypernativeAgent = {
                id: data.data.id,
                agentName: data.data.agentName,
                agentType: data.data.agentType,
                chain: chainString,
                createdBy: data.data.createdBy,
                createdAt: data.data.createdAt,
            }

            return agent
        } catch (error) {
            console.error('Error during API call:', error)
            throw error // Re-throw the error to propagate it
        }
    }

    public async createCustomAgentUpgrade(input: CustomAgentInputUpgrade): Promise<HypernativeAgent> {
        const customAgentRule = { ...rateProviderUpgradeRule }

        // Modify the rule based on input
        customAgentRule.rule.chain = this.getValidChainNameFromViemChain(input.chain)
        customAgentRule.rule.ruleString = input.ruleString
        customAgentRule.rule.contractAddress = input.rateProvider
        customAgentRule.rule.contractAddressAlias = input.rateProvider
        customAgentRule.agentName = input.agentName
        customAgentRule.rule.transactionParams[0].operands = input.contractAddress

        // Make the API call
        try {
            const response = await fetch('https://api.hypernative.xyz/custom-agents', {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'x-client-id': this.clientId,
                    'x-client-secret': this.clientSecret,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customAgentRule),
            })

            if (!response.ok) {
                const responseBody = await response.text()
                console.error('Response Status:', response.status)
                console.error('Response Body:', responseBody)
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data: any = await response.json()
            const chainString = this.getValidChainNameFromViemChain(input.chain)

            const agent: HypernativeAgent = {
                id: data.id,
                agentName: data.data.agentName,
                agentType: data.data.agentType,
                chain: chainString,
                createdBy: data.data.createdBy,
                createdAt: data.data.createdAt,
            }

            return agent
        } catch (error) {
            console.error('Error during API call:', error)
            throw error // Re-throw the error to propagate it
        }
    }

    public async createCustomAgentRateRevert(input: CustomAgentInput): Promise<HypernativeAgent> {
        // This custom agent rule is already complete it only needs modification for rate provider address
        const customAgentRule = { ...rateProviderRateRevertRule }

        // Modify the rule based on input
        customAgentRule.rule.chain = this.getValidChainNameFromViemChain(input.chain)
        customAgentRule.rule.ruleString = input.ruleString
        // TODO: This address has no impact on the rule execution
        customAgentRule.rule.contractAddress = input.contractAddress
        customAgentRule.agentName = input.agentName

        customAgentRule.rule.conditions[1].operands[0].variable_extraction[3].contract_address = input.contractAddress
        customAgentRule.rule.conditions[1].operands[0].eval.custom_description = input.ruleString

        customAgentRule.graphData.nodes[1].data.chain = this.getValidChainNameFromViemChain(input.chain)
        customAgentRule.graphData.nodes[1].data.contractAddress = input.contractAddress
        customAgentRule.graphData.nodes[1].data.contractAddressAlias = input.contractAddress

        customAgentRule.graphData.nodes[4].data.message = input.ruleString

        const requestBody = customAgentRule


        // Make the API call
        try {
            const response = await fetch('https://api.hypernative.xyz/custom-agents', {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'x-client-id': this.clientId,
                    'x-client-secret': this.clientSecret,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            })

            if (!response.ok) {
                const responseBody = await response.text()
                console.error('Response Status:', response.status)
                console.error('Response Body:', responseBody)
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data: any = await response.json()
            const chainString = this.getValidChainNameFromViemChain(input.chain)

            const agent: HypernativeAgent = {
                id: data.data.id,
                agentName: data.data.agentName,
                agentType: data.data.agentType,
                chain: chainString,
                createdBy: data.data.createdBy,
                createdAt: data.data.createdAt,
            }

            return agent
        } catch (error) {
            console.error('Error during API call:', error)
            throw error // Re-throw the error to propagate it
        }
    }

    /**
     * Fetches all custom agents for the current API user.
     * Always returns the full list of agents without pagination.
     */
    public async getCustomAgents(): Promise<HypernativeAgent[]> {
        const url = 'https://api.hypernative.xyz/custom-agents'

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'x-client-id': this.clientId,
                    'x-client-secret': this.clientSecret,
                },
            })

            if (!response.ok) {
                const responseBody = await response.text()
                console.error('Response Status:', response.status)
                console.error('Response Body:', responseBody)
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            // We only care about a minimal subset of each agent; discard the rest.
            const json: any = await response.json()

            if (!json || !json.data || !Array.isArray(json.data.results)) {
                throw new Error('Unexpected response format from Hypernative API')
            }

            const minimalAgents: HypernativeAgent[] = json.data.results.map(
                (agent: any): HypernativeAgent => ({
                    id: agent.id,
                    agentName: agent.agentName,
                    agentType: agent.agentType,
                    chain: agent.chain,
                    createdBy: agent.createdBy,
                    createdAt: agent.createdAt,
                }),
            )

            return minimalAgents
        } catch (error) {
            console.error('Error fetching custom agents:', error)
            throw error
        }
    }

    /**
     * Fetches all Hypernative agents that belong to a given address on a given chain.
     *
     * Matching rules:
     *  1. agentName contains the last 4 characters of the address (case-insensitive)
     *  2. agent.chain matches the Hypernative chain name for the provided viem Chain
     *  3. From those, only keep agents created within a 10-minute window of the first match.
     */
    public async getCustomAgent(address: Address, chain: Chain): Promise<HypernativeAgent[]> {
        // 1. Fetch all minimal agents
        const agents = await this.getCustomAgents()

        // 2. Take the last 4 characters of the address
        const suffix = address.slice(-4).toLowerCase()

        // 3. Translate the provided viem Chain into Hypernative's chain string
        const hypernativeChain = this.getValidChainNameFromViemChain(chain)

        // 4. First filter by suffix and chain
        const baseMatches = agents.filter(
            (agent) =>
                agent.agentName.toLowerCase().includes(suffix)
        )

        if (baseMatches.length === 0) {
            return []
        }

        // 5. Choose a reference agent for the time window.
        //    Requirements:
        //    - Must be on the chain passed into this function
        //    - Prefer an agent whose name is NOT "<suffix>rate-revert" (case-insensitive)
        //      This is due to the rate revert agent on the Hypernative side being tagged
        //      as on "ethereum" while actually monitoring another chain's values.
        const rateRevertName = `${suffix}rate-revert`

        // Prefer non-rate-revert agent on the target chain
        const referenceAgent = baseMatches.find(
            (agent) =>
                agent.chain === hypernativeChain &&
                agent.agentName.toLowerCase() !== rateRevertName,
        )

        if (!referenceAgent) {
            throw new Error(
                `No Hypernative agents found for address ${address} on chain ${hypernativeChain} matching suffix ${suffix}.`,
            )
        }

        const referenceCreatedAt = new Date(referenceAgent.createdAt).getTime()
        const TEN_MINUTES_MS = 10 * 60 * 1000

        // 6. Keep only agents created within ±10 minutes of the reference
        const timeFiltered = baseMatches.filter((agent) => {
            const createdAtTime = new Date(agent.createdAt).getTime()
            if (Number.isNaN(createdAtTime)) {
                return false
            }
            return Math.abs(createdAtTime - referenceCreatedAt) <= TEN_MINUTES_MS
        })

        return timeFiltered
    }

    /**
     * Deletes one or more Hypernative agents by ID, using client ID/secret authentication.
     */
    public async deleteAgentsByIds(ids: number[]): Promise<void> {
        for (const id of ids) {
            const url = `https://api.hypernative.xyz/custom-agents/${id}`

            const headers: Record<string, string> = {
                accept: 'application/json',
                'x-client-id': this.clientId,
                'x-client-secret': this.clientSecret,
            }

            const response = await fetch(url, {
                method: 'DELETE',
                headers,
            })

            if (!response.ok) {
                const body = await response.text()
                console.error(`Failed to delete agent ${id}. Status: ${response.status}`)
                console.error('Response Body:', body)
                throw new Error(`Failed to delete agent with id ${id}`)
            }
        }
    }

    // Method to get the valid Hypernative chain name
    public getValidChainNameFromViemChain(chain: Chain): string {
        const validChainName = HypernativeApi.chainNameToHypernativeKey[chain.name]
        if (!validChainName) {
            throw new Error(`Unsupported chain: ${chain.name}`)
        }
        return validChainName
    }
}

export default HypernativeApi
