import { erc20Abi, erc4626Abi, PublicClient } from 'viem'
import { Address } from 'viem'

/**
 * Fetches the name of an ERC20 contract by making an on-chain call.
 * @param contractAddress - The address of the ERC20 contract.
 * @param chain - The blockchain network (default is mainnet).
 * @returns The name of the ERC20 contract.
 */
export async function doOnchainCallGetName(contractAddress: Address, client: PublicClient): Promise<string> {
    // Call the "name" function on the ERC20 contract
    const name = (await client.readContract({
        address: contractAddress,
        abi: erc20Abi,
        functionName: 'name',
    })) as string

    return name.replace(' ', '')
}

export async function doOnchainCallGetAsset(contractAddress: Address, client: PublicClient): Promise<string> {
    // Call the "asset" function on the ERC4626 contract
    const name = (await client.readContract({
        address: contractAddress,
        abi: erc4626Abi,
        functionName: 'asset',
    })) as string

    return name.replace(' ', '')
}
