import { Chain } from 'viem'
import { rateProviderRateDeviationRule } from '../utils/hypernative/rate-provider-rate-deviation'
import { rateProviderUpgradeRule } from '../utils/hypernative/rate-provider-upgrade'
import { rateProviderRateRevertRule } from '../utils/hypernative/rate-provider-rate-revert'

import { CustomAgentInput, CustomAgentInputUpgrade } from '../types/types'

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
    }

    public async createCustomAgentRateDeviation(input: CustomAgentInput): Promise<void> {
        const customAgentRule = { ...rateProviderRateDeviationRule }

        // Modify the rule based on input
        customAgentRule.rule.chain = this.getValidChainNameFromViemChain(input.chain)
        customAgentRule.rule.ruleString = input.ruleString
        customAgentRule.rule.contractAddress = input.contractAddress
        customAgentRule.rule.contractAddressAlias = input.contractAlias
        customAgentRule.agentName = input.agentName

        // Log the request body
        console.log('Request Body:', JSON.stringify(customAgentRule, null, 2))

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
                // throw new Error(`HTTP error! status: ${response.status}`)
            }
        } catch (error) {
            console.error('Error during API call:', error)
            throw error // Re-throw the error to propagate it
        }
    }

    public async createCustomAgentUpgrade(input: CustomAgentInputUpgrade): Promise<void> {
        const customAgentRule = { ...rateProviderUpgradeRule }

        // Modify the rule based on input
        customAgentRule.rule.chain = this.getValidChainNameFromViemChain(input.chain)
        customAgentRule.rule.ruleString = input.ruleString
        customAgentRule.rule.contractAddress = input.rateProvider
        customAgentRule.rule.contractAddressAlias = input.rateProvider
        customAgentRule.agentName = input.agentName
        customAgentRule.rule.transactionParams[0].operands = input.contractAddress

        // Log the request body
        console.log('Request Body:', JSON.stringify(customAgentRule, null, 2))

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
                //throw new Error(`HTTP error! status: ${response.status}`)
            }
        } catch (error) {
            console.error('Error during API call:', error)
            throw error // Re-throw the error to propagate it
        }
    }

    public async createCustomAgentRateRevert(input: CustomAgentInput): Promise<void> {
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

        // Log the request body
        console.log('Request Body:', JSON.stringify(requestBody, null, 2))

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
                // throw new Error(`HTTP error! status: ${response.status}`)
            }
        } catch (error) {
            console.error('Error during API call:', error)
            throw error // Re-throw the error to propagate it
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
