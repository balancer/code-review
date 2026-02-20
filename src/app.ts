import { Address, parseEventLogs } from 'viem'
import { CreateAccessListReturnType } from 'viem/_types/actions/public/createAccessList'
import { createPublicClient, encodeFunctionData, http, PublicClient } from 'viem'
import { Chain, Hex, Abi } from 'viem'
import { rateProviderAbi } from './utils/abi/rateProvider'
import { ChainApi, RateProviderDependencies, ApiFor } from './types/types'

import { createApiFor } from 'utils/createApiFor'

class RateProviderDataService {
    public rateProvider: Address
    public upgradeableContracts!: {
        address: Address
        implementation: Address
    }[]
    public client: PublicClient<any, Chain>
    public accessList!: CreateAccessListReturnType
    public sourceCode!: {
        address: Address
        Proxy: string
        ContractName: string
        ABI: string
        Implementation: Address
    }

    //private apiKey!: string
    private readonly apiFor: ApiFor

    public dependencies: RateProviderDependencies

    constructor(
        rateProvider: Address,
        client: PublicClient<any, Chain>,
        dependencies: RateProviderDependencies,
        apiFor: ApiFor,
    ) {
        this.rateProvider = rateProvider
        this.client = client
        this.dependencies = dependencies
        this.apiFor = apiFor
    }

    /**
     * Initializes the service by fetching the access list and source code.
     */
    public async initialize() {
        this.accessList = await this.getAccessList()
        this.sourceCode = await this.getContractSourceCode(this.rateProvider)
    }

    /**
     * Fetches the access list for the rate provider contract.
     * More info see: https://eips.ethereum.org/EIPS/eip-2930
     * @returns The access list.
     */
    public async getAccessList(): Promise<CreateAccessListReturnType> {
        const callData = encodeFunctionData({
            abi: rateProviderAbi,
            functionName: 'getRate',
        })

        return await this.client.createAccessList({
            data: callData,
            to: this.rateProvider,
            gas: 500_000n, // Set a reasonable gas limit for the call
        })
    }

    /**
     * Fetches the deployment transaction hashes and block numbers for the given addresses.
     * @param addresses The addresses to fetch deployment information for.
     * @returns An array of deployment information.
     */
    public async getDeploymentBlocks(addresses: Address[]): Promise<{ address: Address; deploymentTxHash: Hex }[]> {
        const chainApi = this.getApiForFunction('getDeploymentBlocks')

        // The addresses length can be arbitrary but the etherscan API only allows 5 addresses at a time
        // so we need to chunk the addresses and call the API sequentially
        const chunkSize = 5
        const txHashes = []

        for (let i = 0; i < addresses.length; i += chunkSize) {
            const chunk = addresses.slice(i, i + chunkSize)
            const chunkTxHashes = await chainApi.getDeploymentTxHashAndBlock(chunk)
            txHashes.push(...chunkTxHashes)
        }

        return txHashes
    }

    /**
     * Fetches contract information for the given addresses.
     * @param addresses The addresses to fetch proxy information for.
     * @returns An array of contract information.
     */
    public async getContractInfo(
        addresses: Address[],
    ): Promise<{ address: Address; Proxy: string; ContractName: string; ABI: string; Implementation: Address }[]> {
        const chainApi = this.getApiForFunction('getContractInfo')
        return await chainApi.getSourceCode(addresses)
    }

    /**
     * Fetches upgradeable contracts information. Includes the rate provider if upgradeable.
     * @returns An array of upgradeable contracts information.
     */
    public async getUpgradeableContracts(): Promise<
        {
            address: Address
            wasUpgraded: boolean
            implementation: Address
        }[]
    > {
        // Sometimes the accessList includes the rateProvider, sometimes it does not.
        // We need to ensure that the rateProvider is included in the list
        const allContractAddresses = this.accessList.accessList.map((a) => a.address)

        if (!allContractAddresses.includes(this.rateProvider)) {
            allContractAddresses.push(this.rateProvider)
        }

        // get info on all contracts in the access list
        const proxiesWithRateProvider = await this.getContractInfo(allContractAddresses)
        // filter out the contracts that are not proxies
        const filteredProxiesList = proxiesWithRateProvider.filter((p) => p.Proxy === '1')

        const proxiesWithRateProviderDeploymentInfo = await this.getDeploymentBlocks(
            filteredProxiesList.map((p) => p.address),
        )

        const mergedInfo = proxiesWithRateProviderDeploymentInfo.map((d) => {
            const proxyInfo = proxiesWithRateProvider.find((p) => p.address === d.address)
            return { ...d, ...proxyInfo }
        })

        const receipts = await Promise.all(
            mergedInfo.map(async (contract) => {
                const receipt = await this.client.getTransactionReceipt({
                    hash: contract.deploymentTxHash,
                })
                return { ...contract, receipt }
            }),
        )

        const proxiesWithRateProviderCompleteInfo = await Promise.all(
            receipts.map(async (info) => {
                try {
                    if (!info.ABI) {
                        throw new Error(`ABI not provided for contract at address ${info.address}`)
                    }
                    const events = parseEventLogs({
                        logs: info.receipt.logs,
                        abi: JSON.parse(info.ABI),
                        eventName: 'Upgraded',
                    })
                    const wasUpgraded = events.length > 0

                    return { ...info, events, wasUpgraded }
                } catch (error) {
                    console.error(`Error processing contract at address ${info.address}:`, error)
                    return { ...info, events: [], wasUpgraded: false, error }
                }
            }),
        )

        return proxiesWithRateProviderCompleteInfo.map((r) => {
            if (!r.Implementation) {
                throw new Error(`Implementation is undefined for contract at address ${r.address}`)
            }
            return {
                address: r.address,
                wasUpgraded: r.wasUpgraded,
                implementation: r.Implementation,
            }
        })
    }

    /**
     * Checks if the rate provider is upgradeable.
     * @returns True if the rate provider is upgradeable, false otherwise.
     */
    public async getIsRateProviderUpgradeable(): Promise<boolean> {
        const upgradeableContracts = await this.getUpgradeableContracts()
        return upgradeableContracts.some((c) => c.wasUpgraded)
    }

    /**
     * Fetches the source code for the given address.
     * @param address The address to fetch source code for.
     * @returns The source code information.
     */
    public async getContractSourceCode(
        address: Address,
    ): Promise<{ address: Address; Proxy: string; ContractName: string; ABI: string; Implementation: Address }> {
        const chainApi = this.getApiForFunction('getContractInfo')
        const sourceCodeArray = await chainApi.getSourceCode([address])
        return sourceCodeArray[0]
    }

    /**
     * Analyzes the getRate call for the rate provider.
     * @returns An object containing scale18 and rateScale18 information.
     */
    public async isRateScale18(): Promise<{ scale18: boolean; rateScale18: bigint }> {
        const data = (await this.client.readContract({
            address: this.rateProvider,
            abi: rateProviderAbi,
            functionName: 'getRate',
            args: [],
        })) as bigint

        if (this.sourceCode.ContractName === 'ConstantRateProvider') {
            return {
                scale18: true,
                rateScale18: data,
            }
        }

        // rate must be scale 18
        const isScale18 = data < 9n * 10n ** 18n && data >= 1n * 10n ** 18n ? true : false
        return {
            scale18: isScale18,
            rateScale18: data,
        }
    }

    /**
     * Simulates the getRate call using Tenderly.
     * @returns The URL of the shared simulation.
     */
    public async getTenderlySimulation(): Promise<string> {
        const simulationUrl = `https://api.tenderly.co/api/v1/account/${this.dependencies.tenderly.accountSlug}/${this.dependencies.tenderly.projectSlug}/project/simulate`

        const callData = encodeFunctionData({
            abi: rateProviderAbi,
            functionName: 'getRate',
        })

        const simulationData = {
            network_id: this.client.chain.id,
            from: '0x0000000000000000000000000000000000000000',
            to: this.rateProvider,
            input: callData,
            value: '0',
            save: true,
            save_if_fails: true,
            simulation_type: 'full',
        }

        try {
            const response = await fetch(simulationUrl, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-Access-Key': this.dependencies.tenderly.apiKey,
                },
                body: JSON.stringify(simulationData),
            })

            const responseData = await response.json()
            const simulationId = responseData.simulation.id

            const shareUrl = `https://api.tenderly.co/api/v1/account/${this.dependencies.tenderly.accountSlug}/project/${this.dependencies.tenderly.projectSlug}/simulations/${simulationId}/share`

            await fetch(shareUrl, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-Access-Key': this.dependencies.tenderly.apiKey,
                },
            })

            return `https://www.tdly.co/shared/simulation/${simulationId}`
        } catch {
            return `simulating getRate failed.`
        }
    }

    /**
     * Checks if the ABI has a valid getRate function.
     * @returns True if the ABI has a valid getRate function, false otherwise.
     */
    public async hasValidGetRateFunction(): Promise<boolean> {
        let abi: Abi
        if (this.sourceCode.Proxy === '1') {
            // Fetch the source code for the Implementation contract
            const implementationSourceCode = await this.getContractSourceCode(this.sourceCode.Implementation)
            abi = JSON.parse(implementationSourceCode.ABI)
        } else {
            // Use the current source code's ABI
            abi = JSON.parse(this.sourceCode.ABI)
        }
        return abi.some((item) => {
            return (
                item.type === 'function' &&
                item.name === 'getRate' &&
                (item.stateMutability === 'view' || item.stateMutability === 'pure') &&
                item.outputs?.length === 1 &&
                item.outputs[0].internalType === 'uint256'
            )
        })
    }

    /**
     * Determines which API to use for a given function based on the chain.
     * This allows different functions to use different API providers.
     *
     * @param functionName The name of the function that needs an API
     * @returns The appropriate ChainApi instance
     */
    private getApiForFunction(functionName: 'getDeploymentBlocks' | 'getContractInfo'): ChainApi {
        return this.apiFor(functionName)
    }
}

export default RateProviderDataService
