import { config } from 'dotenv'

import {
    base,
    mainnet,
    arbitrum,
    avalanche,
    gnosis,
    sonic,
    sepolia,
    polygon,
    fraxtal,
    Chain,
    optimism,
    polygonZkEvm,
    mode,
} from 'viem/chains'

import { hyperEvm, plasma, xlayer } from '../../src/utils/customChains'
import { ChainApi } from '../../src/types/types'
import { createChainApi } from '../../src/utils/factories'
// Check that the viem Chain has a multicall3 contract defined
describe('test networks', () => {
    // Test data with different configurations
    const testNetworks = [
        base,
        mainnet,
        arbitrum,
        avalanche,
        gnosis,
        sonic,
        sepolia,
        polygon,
        fraxtal,
        optimism,
        hyperEvm,
        plasma,
        xlayer,
    ]

    config()
    const apiKey = process.env.ETHERSCAN_API_KEY as string

    testNetworks.forEach((chain) => {
        describe(`when using ${chain.name}`, () => {
            jest.setTimeout(50000)
            let chainApi: ChainApi

            beforeEach(() => {
                chainApi = createChainApi(chain)
            })

            it('should get source code', async () => {
                const [{ address, Proxy, ContractName, ABI, Implementation }] = await chainApi.getSourceCode([
                    chainApi.chain.contracts?.multicall3?.address || '0x',
                ])

                expect(address).toEqual(chainApi.chain.contracts?.multicall3?.address || '0x')
                expect(Proxy).toEqual('0')
                expect(ContractName).toBeDefined()
                expect(ABI).toBeTruthy()
                expect(Implementation).toBeFalsy()
            })

            it('should get deployment tx hash and block', async () => {
                const [{ address, deploymentTxHash, blockNumber }] = await chainApi.getDeploymentTxHashAndBlock([
                    chainApi.chain.contracts?.multicall3?.address || '0x',
                ])
                expect(address).toEqual(chainApi.chain.contracts?.multicall3?.address || '0x')
                expect(deploymentTxHash).toBeTruthy()
            })
        })
    })
})
