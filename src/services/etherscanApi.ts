import { Address, Hex, Chain } from 'viem'
import { TransactionData, GetContractSourceCodeResponse } from '../types/types'

class EtherscanApi {
    public chain: Chain
    private apiKey: string

    constructor(chain: Chain, apiKey: string) {
        this.chain = chain
        this.apiKey = apiKey
    }

    private getApiUrl(): string {
        const blockExplorer = this.chain.blockExplorers?.default
        if (!blockExplorer || !blockExplorer.apiUrl) {
            throw new Error(`API URL not found for chain: ${this.chain.name}`)
        }
        return blockExplorer.apiUrl
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
    ): Promise<{ address: Address; deploymentTxHash: Hex }[]> {
        const apiUrl = this.getApiUrl()
        const fetchingUrl = `${apiUrl}?module=contract&action=getcontractcreation&contractaddresses=${addresses.join(',')}&apikey=${this.apiKey}`
        console.log(`Fetching deployment transaction hashes from: ${fetchingUrl}`)
        const data: TransactionData = await this.fetchFromApi(fetchingUrl)
        await new Promise((f) => setTimeout(f, 5000))
        return data.result.map((entry, index) => ({
            address: addresses[index],
            deploymentTxHash: entry.txHash,
        }))
    }

    public async getSourceCode(
        addresses: Address[],
    ): Promise<{ address: Address; Proxy: string; ContractName: string; ABI: string; Implementation: Address }[]> {
        const apiUrl = this.getApiUrl()
        const results = []

        for (const address of addresses) {
            try {
                const fetchingUrl = `${apiUrl}?module=contract&action=getsourcecode&address=${address}&apikey=${this.apiKey}`
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
