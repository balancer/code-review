import { config } from 'dotenv'
import EtherscanApi from '../../src/services/etherscanApi'

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

import { hyperEvm } from '../../src/utils/customChains'

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
    ]

    //config()
    const apiKey = process.env.ETHERSCAN_API_KEY as string

    testNetworks.forEach((chain) => {
        describe(`when using ${chain.name}`, () => {
            jest.setTimeout(30000)
            let etherscanApi: EtherscanApi

            beforeEach(() => {
                etherscanApi = new EtherscanApi(chain, apiKey)
            })

            it('should get source code', async () => {
                const [{ address, Proxy, ContractName, ABI, Implementation }] = await etherscanApi.getSourceCode([
                    etherscanApi.chain.contracts?.multicall3?.address || '0x',
                ])

                expect(address).toEqual(etherscanApi.chain.contracts?.multicall3?.address || '0x')
                expect(Proxy).toEqual('0')
                expect(ContractName).toBeDefined()
                expect(ABI).toBeTruthy()
                expect(Implementation).toBeFalsy()
            })

            it('should get deployment tx hash and block', async () => {
                const [{ address, deploymentTxHash, blockNumber }] = await etherscanApi.getDeploymentTxHashAndBlock([
                    etherscanApi.chain.contracts?.multicall3?.address || '0x',
                ])
                expect(address).toEqual(etherscanApi.chain.contracts?.multicall3?.address || '0x')
                expect(deploymentTxHash).toBeTruthy()
                expect(blockNumber).toBeTruthy()
            })
        })
    })
})
