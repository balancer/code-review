import { createPublicClient, http, erc20Abi, erc4626Abi } from 'viem'
import { Address, Chain } from 'viem'
import { mainnet } from 'viem/chains'

/**
 * Fetches the name of an ERC20 contract by making an on-chain call.
 * @param contractAddress - The address of the ERC20 contract.
 * @param chain - The blockchain network (default is mainnet).
 * @returns The name of the ERC20 contract.
 */
export async function doOnchainCallGetName(contractAddress: Address, chain: Chain, rpcUrl: string): Promise<string> {
    const publicClient = createPublicClient({
        chain,
        transport: http(rpcUrl),
    })

    // Call the "name" function on the ERC20 contract
    const name = (await publicClient.readContract({
        address: contractAddress,
        abi: erc20Abi,
        functionName: 'name',
    })) as string

    return name.replace(' ', '')
}

export async function doOnchainCallGetAsset(contractAddress: Address, chain: Chain, rpcUrl: string): Promise<string> {
    const publicClient = createPublicClient({
        chain,
        transport: http(rpcUrl),
    })

    // Call the "asset" function on the ERC4626 contract
    const name = (await publicClient.readContract({
        address: contractAddress,
        abi: erc4626Abi,
        functionName: 'asset',
    })) as string

    return name.replace(' ', '')
}
