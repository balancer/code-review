import { Address, Hex, Chain } from 'viem'
import { ChainApi, XLayerContractInfo, XLayerAddressInfo } from '../types/types'
import crypto from 'crypto'

/**
 * XLayerApi class to interact with XLayer Chain Explorer API
 * This API provides contract source code and deployment information for XLayer Chain.
 * API documentation: https://web3.okx.com/xlayer/onchaindata/docs/en/#introduction/
 */
class XLayerApi implements ChainApi {
    public chain: Chain
    private apiKey: string
    private secretKey: string // NEW: Required for HMAC signing
    private passphrase: string // NEW: Required for authentication
    private readonly baseUrl = 'https://www.okx.com/api/v5/xlayer'

    constructor(chain: Chain, apiKey: string, secretKey: string, passphrase: string) {
        this.chain = chain
        this.apiKey = apiKey
        this.secretKey = secretKey
        this.passphrase = passphrase
    }

    /**
     * Fetches data from the XLayer API with proper authentication.
     */
    private async fetchFromApi(url: string, method: string = 'GET', body: string = ''): Promise<any> {
        const timestamp = new Date().toISOString()
        const urlObj = new URL(url)
        const requestPath = urlObj.pathname + urlObj.search
        const message = timestamp + method + requestPath + body
        const signature = crypto.createHmac('sha256', this.secretKey).update(message).digest('base64')

        const response = await fetch(url, {
            method,
            headers: {
                'OK-ACCESS-KEY': this.apiKey,
                'OK-ACCESS-TIMESTAMP': timestamp,
                'OK-ACCESS-PASSPHRASE': this.passphrase,
                'OK-ACCESS-SIGN': signature,
                'Content-Type': 'application/json',
            },
            body: body || undefined,
        })

        if (!response.ok) {
            throw new Error(`Error fetching data from XLayer API: ${response.statusText} for ${url}`)
        }

        const data = await response.json()
        if (data.code !== '0') {
            throw new Error(`XLayer API error: ${data.msg || 'Unknown error'} (code: ${data.code})`)
        }

        return data
    }

    /**
     * Fetches source code information for the given addresses.
     * Implements ChainApi interface.
     */
    public async getSourceCode(
        addresses: Address[],
    ): Promise<{ address: Address; Proxy: string; ContractName: string; ABI: string; Implementation: Address }[]> {
        const results = []

        for (const address of addresses) {
            try {
                const url = `${this.baseUrl}/contract/verify-contract-info?chainShortName=XLAYER&contractAddress=${address}`
                const response = await this.fetchFromApi(url)

                if (!response.data || response.data.length === 0) {
                    console.error(`Error fetching contract info for address ${address}: No data returned`)
                    continue
                }

                const contractData: XLayerContractInfo = response.data[0]
                if (!contractData.contractAbi) {
                    console.error(`ABI is missing for address ${address}`)
                    continue
                }

                const { proxy, contractName, contractAbi, implementation } = contractData
                results.push({
                    address,
                    Proxy: proxy,
                    ContractName: contractName,
                    ABI: contractAbi,
                    Implementation: implementation as Address,
                })
            } catch (error) {
                console.error(`Error processing address ${address}:`, error)
            }

            await this.delay(1000)
        }

        return results
    }

    /**
     * Fetches deployment transaction hash and block number for the given addresses.
     */
    public async getDeploymentTxHashAndBlock(
        addresses: Address[],
    ): Promise<{ address: Address; deploymentTxHash: Hex; blockNumber: string }[]> {
        const results = []

        for (const address of addresses) {
            try {
                const url = `${this.baseUrl}/address/information-evm?chainShortName=XLAYER&address=${address}`
                const response = await this.fetchFromApi(url)

                if (!response.data || response.data.length === 0) {
                    console.error(`No deployment data found for address ${address}`)
                    continue
                }

                const addressData: XLayerAddressInfo = response.data[0]
                const deploymentTxHash = addressData.createContractTransactionHash
                if (!deploymentTxHash) {
                    console.error(`No deployment transaction hash found for address ${address}`)
                    continue
                }

                results.push({
                    address,
                    deploymentTxHash: deploymentTxHash as Hex,
                    blockNumber: '',
                })
            } catch (error) {
                console.error(`Error processing deployment info for address ${address}:`, error)
            }

            await this.delay(1000)
        }

        return results
    }

    /**
     * Adds a delay between API calls to avoid rate limiting.
     */
    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
}

export default XLayerApi
