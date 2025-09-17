import { Address, Hex, Chain } from 'viem'
import { TransactionData, GetContractSourceCodeResponse } from '../types/types'
import { avalanche } from 'viem/chains'
import { plasma } from '../utils/customChains'

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
        if (this.chain.id === plasma.id) {
            return plasma.blockExplorers.default.apiUrl
        }
        return `https://api.etherscan.io/v2/api?chainid=${this.chain.id}&`
    }

    private async fetchFromApi(url: string): Promise<any> {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Error fetching data from API: ${response.statusText} for ${url}`)
        }
        return response.json()
    }

    private async tryFallbackExplorer(chain: Chain, address: Address): Promise<any | null> {
        // Check if this is Avalanche chain and try Snowscan as fallback
        if (this.chain.id === avalanche.id) {
            console.log(`Trying Snowscan fallback for address ${address}`)
            // this is a working routescan api example url https://api.routescan.io/v2/network/mainnet/evm/43114/etherscan/api?module=contract&action=getsourcecode&address=0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7
            const snowtraceUrl = `https://api.routescan.io/v2/network/mainnet/evm/${this.chain.id}/etherscan/api?module=contract&action=getsourcecode&address=${address}`
            try {
                const snowtraceResponse = await fetch(snowtraceUrl)
                if (snowtraceResponse.ok) {
                    const fallbackData = await snowtraceResponse.json()
                    if (fallbackData.status === '1' && fallbackData.result[0].ABI !== 'Contract source code not verified') {
                        console.log(`Successfully found contract on Snowscan for address ${address}`)
                        return fallbackData
                    }
                }
            } catch (error) {
                console.log(`Snowscan fallback failed for address ${address}:`, error)
            }
        }
        return null
    }

    public async getDeploymentTxHashAndBlock(
        addresses: Address[],
    ): Promise<{ address: Address; deploymentTxHash: Hex; blockNumber: string }[]> {
        const apiUrl = this.getApiUrl()
        const fetchingUrl = `${apiUrl}module=contract&action=getcontractcreation&contractaddresses=${addresses.join(',')}&apikey=${this.apiKey}`
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
                // https://api.routescan.io/v2/network/mainnet/evm/9745/etherscan/api?module=contract&action=getabi&address=0xcA11bde05977b3631167028862bE2a173976CA11&apikey=YourApiKeyToken
                const fetchingUrl = `${apiUrl}module=contract&action=getsourcecode&address=${address}&apikey=${this.apiKey}`
                const data: GetContractSourceCodeResponse = await this.fetchFromApi(fetchingUrl)

                if (data.status !== '1') {
                    console.error(`Error fetching contract info for address ${address}: ${data.message}`)
                    continue // Skip this address
                }
                if (!data.result[0].ABI) {
                    console.error(`ABI is missing for address ${address}`)
                    continue // Skip this address
                }

                // the contract can be unverified
                if (data.result[0].ABI === 'Contract source code not verified') {
                    console.log(`Contract is unverified for address ${address}, trying fallback block explorer`)
                    
                    // Try fallback explorer (e.g., Snowscan for Avalanche)
                    const fallbackData = await this.tryFallbackExplorer(this.chain, address)
                    if (fallbackData) {
                        const { Proxy, ContractName, ABI, Implementation } = fallbackData.result[0]
                        results.push({ address, Proxy, ContractName, ABI, Implementation })
                        continue
                    }
                    
                    console.log(`Contract is unverified on all explorers for address ${address}`)
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
