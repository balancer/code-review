import { Address, Hex, Chain } from 'viem'
import { ChainApi } from '../types/types'
import { base, optimism } from 'viem/chains'
/**
 * BlockscoutApi class to interact with Blockscout Explorer API
 * This API provides contract source code and deployment information for chains using Blockscout.
 * API documentation: https://docs.blockscout.com/
 */
class BlockscoutApi implements ChainApi {
    public chain: Chain
    private apiKey?: string

    constructor(chain: Chain, apiKey?: string) {
        this.chain = chain
        this.apiKey = apiKey
    }

    /**
     * Gets the Blockscout API URL for the chain.
     */
    private getApiUrl(): string {
        // https://instance_base_url/api?module=contract
        // URL: https://eth-sepolia.blockscout.com
        // API URL: https://eth-sepolia.blockscout.com/api?module=contract

        if (this.chain.id === base.id) {
            return 'https://base.blockscout.com/api?'
        }
        // Otherwise, construct it from the base URL by appending /api
        else if (this.chain.id === optimism.id) {
            return 'https://explorer.optimism.io/api?'
        }
        throw new Error(`No Blockscout API URL configured for chain ${this.chain.name}`)
    }

    /**
     * Fetches data from the Blockscout API.
     */
    private async fetchFromApi(url: string): Promise<any> {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Error fetching data from Blockscout API: ${response.statusText} for ${url}`)
        }
        return response.json()
    }

    /**
     * Fetches deployment transaction hash and block number for the given addresses.
     * Implements ChainApi interface.
     */
    public async getDeploymentTxHashAndBlock(
        addresses: Address[],
    ): Promise<{ address: Address; deploymentTxHash: Hex; blockNumber: string }[]> {
        const apiUrl = this.getApiUrl()
        const contractAddresses = addresses.join(',')

        const fetchingUrl = `${apiUrl}module=contract&action=getcontractcreation&contractaddresses=${contractAddresses}`
        
        const data = await this.fetchFromApi(fetchingUrl)

        if (data.status !== '1') {
            throw new Error(`Blockscout API error: ${data.message || 'Unknown error'}`)
        }

        if (!data.result || !Array.isArray(data.result)) {
            throw new Error('Invalid response format from Blockscout API')
        }

        // Map the response to the expected format
        // Note: Blockscout doesn't return blockNumber in this endpoint, so we return empty string
        return data.result.map((entry: { contractAddress: string; txHash: string; blockNumber: string }) => ({
            address: entry.contractAddress as Address,
            deploymentTxHash: entry.txHash as Hex,
            blockNumber: entry.blockNumber as string,
        }))
    }

    /**
     * Fetches source code information for the given addresses.
     * Implements ChainApi interface.
     * Not implemented yet - will throw an error.
     */
    public async getSourceCode(
        addresses: Address[],
    ): Promise<{ address: Address; Proxy: string; ContractName: string; ABI: string; Implementation: Address }[]> {
        throw new Error('getSourceCode is not yet implemented for BlockscoutApi')
    }

    /**
     * Adds a delay between API calls to avoid rate limiting.
     */
    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
}

export default BlockscoutApi

