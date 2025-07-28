import { Address, Hex, Chain } from 'viem'
import { TransactionData, GetContractSourceCodeResponse } from '../types/types'

/**
 * EtherscanApi class to interact with Etherscan API
 * It uses the Etherscan API 2.0
 * Supported chains can be found at https://docs.etherscan.io/etherscan-v2/supported-chains
 */
class EtherscanApi {
    public chain: Chain
    private apiKey: string

    constructor(chain: Chain, apiKey: string) {
        this.chain = chain
        this.apiKey = apiKey
    }

    private getApiUrl(): string {
        // TODO: Validate chain is supported by EtherscanAPI.
        return `https://api.etherscan.io/v2/api?chainid=${this.chain.id}`
    }

    private async fetchFromApi(url: string): Promise<any> {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Error fetching data from API: ${response.statusText} for ${url}`)
        }
        return response.json()
    }

    public async getDeploymentTxHashAndBlock(
        addresses: Address[],
    ): Promise<{ address: Address; deploymentTxHash: Hex; blockNumber: string }[]> {
        const apiUrl = this.getApiUrl()
        const fetchingUrl = `${apiUrl}&module=contract&action=getcontractcreation&contractaddresses=${addresses.join(',')}&apikey=${this.apiKey}`
        const data: TransactionData = await this.fetchFromApi(fetchingUrl)
        return data.result.map((entry, index) => ({
            address: addresses[index],
            deploymentTxHash: entry.txHash,
            blockNumber: entry.blockNumber,
        }))
    }

    public async getSourceCode(
        addresses: Address[],
    ): Promise<{ address: Address; Proxy: string; ContractName: string; ABI: string; Implementation: Address }[]> {
        const apiUrl = this.getApiUrl()
        const results = []

        for (const address of addresses) {
            try {
                const fetchingUrl = `${apiUrl}&module=contract&action=getsourcecode&address=${address}&apikey=${this.apiKey}`
                const data: GetContractSourceCodeResponse = await this.fetchFromApi(fetchingUrl)

                if (data.status !== '1') {
                    console.error(`Error fetching contract info for address ${address}: ${data.message}`)
                    continue // Skip this address
                }
                if (!data.result[0].ABI) {
                    console.error(`ABI is missing for address ${address}`)
                    continue // Skip this address
                }

                const { Proxy, ContractName, ABI, Implementation } = data.result[0]
                results.push({ address, Proxy, ContractName, ABI, Implementation })
            } catch (error) {
                console.error(`Error processing address ${address}:`, error)
                // Skip this address and continue with the next one
            }

            // Add a delay between API calls
            await this.delay(1000)
        }

        return results
    }

    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
}

export default EtherscanApi
