import { Chain } from 'viem'
import { Address, parseEventLogs } from 'viem'
import { CreateAccessListReturnType } from 'viem/_types/actions/public/createAccessList'
import { createPublicClient, encodeFunctionData, http } from 'viem'
import { erc4626Abi } from './utils/abi/erc4626'
import { erc20Abi } from 'viem'

import RateProviderDataService from './app'
// previewRedeem, previewWithdraw (in _unwrapWithBuffer)
// redeem, withdraw (in _unwrapWithBuffer)
// previewDeposit, previewMint (_wrapWithBuffer)
// deposit, mint (_wrapWithBuffer)

export default class ERC4626DataService extends RateProviderDataService {
    public decimals!: number
    constructor(erc4626Vault: Address, chain: Chain) {
        super(erc4626Vault, chain)
    }

    /**
     * Fetches the access list for the ERC4626 contract.
     * @returns The access list for the ERC4626 contract based on the `mint call`.
     */
    public async getAccessList(): Promise<CreateAccessListReturnType> {
        // RPC endpoint must support this call
        const publicClient = createPublicClient({
            chain: this.chain,
            transport: http(this.chain.rpcUrls.default.http[0]),
        })

        // Step 1: Call the `decimals` function on the ERC4626 contract
        const decimals = (await publicClient.readContract({
            abi: erc20Abi,
            functionName: 'decimals',
            address: this.rateProvider,
        })) as number

        this.decimals = decimals

        // Step 2: Calculate 1 share based on the decimals
        const oneShare = BigInt(10 ** decimals)

        // Step 3: Encode the `mint` call with 1 share
        const callData = encodeFunctionData({
            abi: erc4626Abi,
            functionName: 'mint',
            args: [oneShare, this.rateProvider], // Assuming the second argument is the recipient
        })

        // Step 4: Create the access list
        return await publicClient.createAccessList({
            data: callData,
            to: this.rateProvider,
        })
    }

    public async getTenderlySimulation(): Promise<string> {
        const simulationUrl = `https://api.tenderly.co/api/v1/account/${this.tenderlySettings.accountSlug}/${this.tenderlySettings.projectSlug}/project/simulate`

        const oneShare = BigInt(10 ** this.decimals)

        const callData = encodeFunctionData({
            abi: erc4626Abi,
            functionName: 'previewMint',
            args: [oneShare],
        })

        const simulationData = {
            network_id: this.chain.id,
            from: '0x0000000000000000000000000000000000000000',
            to: this.rateProvider,
            input: callData,
            value: '0',
            save: true,
            save_if_fails: true,
            simulation_type: 'full',
        }

        const response = await fetch(simulationUrl, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Access-Key': this.tenderlySettings.apiKey,
            },
            body: JSON.stringify(simulationData),
        })

        const responseData = await response.json()
        const simulationId = responseData.simulation.id

        const shareUrl = `https://api.tenderly.co/api/v1/account/${this.tenderlySettings.accountSlug}/project/${this.tenderlySettings.projectSlug}/simulations/${simulationId}/share`

        await fetch(shareUrl, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Access-Key': this.tenderlySettings.apiKey,
            },
        })

        return `https://www.tdly.co/shared/simulation/${simulationId}`
    }
}
