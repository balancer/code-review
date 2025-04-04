import { createPublicClient, http } from 'viem'
import { Address, Chain } from 'viem'
import { mainnet } from 'viem/chains'

// Minimal ERC20 ABI with the "name" function
const ERC20_ABI = [
    {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [{ name: '', type: 'string' }],
        type: 'function',
    },
] as const

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
        abi: ERC20_ABI,
        functionName: 'name',
    })) as string

    return name.replace(' ', '')
}
