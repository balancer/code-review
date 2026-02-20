import { Address, Hex, Chain } from 'viem'
import { ChainApi } from '../types/types'

/**
 * RoutescanApi class to interact with Routescan Explorer API
 * Routescan provides Etherscan-compatible APIs for EVM chains.
 * API documentation: https://docs.routescan.io/
 */
class RoutescanApi implements ChainApi {
    public chain: Chain
    private apiKey?: string

    constructor(chain: Chain, apiKey?: string) {
        this.chain = chain
        this.apiKey = apiKey
    }

    /**
     * Gets the Routescan API URL for the chain.
     * Format: https://api.routescan.io/v2/network/mainnet/evm/{chainId}/etherscan/api
     */
    private getApiUrl(): string {
        return `https://api.routescan.io/v2/network/mainnet/evm/${this.chain.id}/etherscan/api?`
    }

    /**
     * Fetches data from the Routescan API.
     */
    private async fetchFromApi(url: string): Promise<any> {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Error fetching data from Routescan API: ${response.statusText} for ${url}`)
        }
        return response.json()
    }

    /**
     * Fetches deployment transaction hash for the given addresses.
     * Implements ChainApi interface.
     * Uses the getcontractcreation endpoint which is Etherscan-compatible.
     */
    public async getDeploymentTxHashAndBlock(
        addresses: Address[],
    ): Promise<{ address: Address; deploymentTxHash: Hex; blockNumber: string }[]> {
        const apiUrl = this.getApiUrl()
        const contractAddresses = addresses.join(',')

        // Build URL with optional API key
        const apiKeyParam = this.apiKey ? `&apikey=${this.apiKey}` : ''
        const fetchingUrl = `${apiUrl}module=contract&action=getcontractcreation&contractaddresses=${contractAddresses}${apiKeyParam}`

        const data = await this.fetchFromApi(fetchingUrl)

        if (data.status !== '1') {
            throw new Error(`Routescan API error: ${data.message || 'Unknown error'}`)
        }

        if (!data.result || !Array.isArray(data.result)) {
            throw new Error('Invalid response format from Routescan API')
        }

        // Map the response to the expected format
        // Routescan returns data in Etherscan-compatible format
        // Routescan does not return blockNumber
        return data.result.map((entry: { txHash: Hex; blockNumber: string }, index: number) => ({
            address: addresses[index],
            deploymentTxHash: entry.txHash,
            blockNumber: '',
        }))
    }

    /**
     * Fetches source code information for the given addresses.
     * Implements ChainApi interface.
     * Not implemented yet - will throw an error.
     */
    public async getSourceCode(
        _addresses: Address[],
    ): Promise<{ address: Address; Proxy: string; ContractName: string; ABI: string; Implementation: Address }[]> {
        throw new Error('getSourceCode is not yet implemented for RoutescanApi')
    }
}

export default RoutescanApi
