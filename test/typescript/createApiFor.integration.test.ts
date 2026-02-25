import type { Chain, PublicClient } from 'viem'
import { avalanche, base, mainnet } from 'viem/chains'
import { config as dotenvConfig } from 'dotenv'

import { createApiFor } from '../../src/utils/createApiFor'
import { xlayer } from '../../src/utils/customChains'
import type { ExplorerConfig } from '../../src/types/types'

import BlockscoutApi from '../../src/services/BlockscoutApi'
import EtherscanApi from '../../src/services/etherscanApi'
import RoutescanApi from '../../src/services/RoutescanApi'
import XLayerApi from '../../src/services/xlayerApi'

dotenvConfig()

function stubClient(chain: Chain): PublicClient<any, Chain> {
    return { chain } as unknown as PublicClient<any, Chain>
}

describe('createApiFor', () => {
    it('returns EtherscanApi for getContractInfo on non-XLayer chains', () => {
        const client = stubClient(mainnet)
        const config: ExplorerConfig = { explorerApiKeyData: 'etherscan-key' }

        const apiFor = createApiFor(client, config)
        const api = apiFor('getContractInfo')

        expect(api).toBeInstanceOf(EtherscanApi)
    })

    it('returns BlockscoutApi for getDeploymentBlocks on Base', () => {
        const client = stubClient(base)
        const config: ExplorerConfig = { explorerApiKeyData: 'explorer-key' }

        const apiFor = createApiFor(client, config)
        const api = apiFor('getDeploymentBlocks')

        expect(api).toBeInstanceOf(BlockscoutApi)
    })

    it('returns RoutescanApi for getDeploymentBlocks on Avalanche', () => {
        const client = stubClient(avalanche)
        const config: ExplorerConfig = { explorerApiKeyData: 'explorer-key' }

        const apiFor = createApiFor(client, config)
        const api = apiFor('getDeploymentBlocks')

        expect(api).toBeInstanceOf(RoutescanApi)
    })

    it('returns EtherscanApi for getDeploymentBlocks on chains that are not Base/Optimism/Avalanche/XLayer', () => {
        const client = stubClient(mainnet)
        const config: ExplorerConfig = { explorerApiKeyData: 'explorer-key' }

        const apiFor = createApiFor(client, config)
        const api = apiFor('getDeploymentBlocks')

        expect(api).toBeInstanceOf(EtherscanApi)
    })

    it('returns XLayerApi for XLayer chain (any role) when provided XLayer credentials', () => {
        const client = stubClient(xlayer)
        const config: ExplorerConfig = {
            explorerApiKeyData: {
                apiKey: 'xlayer-key',
                secretKey: 'xlayer-secret',
                passPhrase: 'xlayer-passphrase',
            },
        }

        const apiFor = createApiFor(client, config)

        expect(apiFor('getContractInfo')).toBeInstanceOf(XLayerApi)
        expect(apiFor('getDeploymentBlocks')).toBeInstanceOf(XLayerApi)
    })

    it('throws on XLayer when provided a string explorerApiKeyData', () => {
        const client = stubClient(xlayer)
        const config: ExplorerConfig = { explorerApiKeyData: 'etherscan-key' }

        const apiFor = createApiFor(client, config)

        expect(() => apiFor('getContractInfo')).toThrow(/XLayer chain requires XLayerChainExplorerConfig/i)
    })

    it('throws on non-XLayer when provided an object explorerApiKeyData', () => {
        const client = stubClient(mainnet)
        const config: ExplorerConfig = {
            explorerApiKeyData: {
                apiKey: 'xlayer-key',
                secretKey: 'xlayer-secret',
                passPhrase: 'xlayer-passphrase',
            },
        }

        const apiFor = createApiFor(client, config)

        expect(() => apiFor('getContractInfo')).toThrow(/Non-XLayer chains require explorerApiKeyData/i)
    })
})

// Integration tests (real HTTP calls).
// These run on every test invocation.
describe('createApiFor (integration)', () => {
    jest.setTimeout(60_000)

    const apiKey = process.env.ETHERSCAN_API_KEY
    if (!apiKey) {
        throw new Error('ETHERSCAN_API_KEY must be set (e.g. in your local .env) to run integration tests.')
    }

    it('EtherscanApi(getContractInfo) can fetch source code on mainnet', async () => {
        const client = stubClient(mainnet)
        const config: ExplorerConfig = { explorerApiKeyData: apiKey }
        const apiFor = createApiFor(client, config)

        const api = apiFor('getContractInfo')
        expect(api).toBeInstanceOf(EtherscanApi)

        const address = api.chain.contracts?.multicall3?.address
        if (!address) throw new Error('mainnet multicall3 address missing on chain config.')

        const [result] = await api.getSourceCode([address])
        expect(result.address).toEqual(address)
        expect(result.ABI).toBeTruthy()
    })

    it('EtherscanApi(getDeploymentBlocks) can fetch deployment tx on mainnet', async () => {
        const client = stubClient(mainnet)
        const config: ExplorerConfig = { explorerApiKeyData: apiKey }
        const apiFor = createApiFor(client, config)

        const api = apiFor('getDeploymentBlocks')
        expect(api).toBeInstanceOf(EtherscanApi)

        const address = api.chain.contracts?.multicall3?.address
        if (!address) throw new Error('mainnet multicall3 address missing on chain config.')

        const [result] = await api.getDeploymentTxHashAndBlock([address])
        expect(result.address).toEqual(address)
        expect(result.deploymentTxHash).toMatch(/^0x[0-9a-fA-F]{64}$/)
    })

    it('BlockscoutApi(getDeploymentBlocks) can fetch deployment tx on Base (and getSourceCode throws)', async () => {
        const client = stubClient(base)
        const config: ExplorerConfig = { explorerApiKeyData: apiKey }
        const apiFor = createApiFor(client, config)

        const api = apiFor('getDeploymentBlocks')
        expect(api).toBeInstanceOf(BlockscoutApi)

        const address = api.chain.contracts?.multicall3?.address
        if (!address) throw new Error('base multicall3 address missing on chain config.')

        const [result] = await api.getDeploymentTxHashAndBlock([address])
        expect(result.address).toEqual(address)
        expect(result.deploymentTxHash).toMatch(/^0x[0-9a-fA-F]{64}$/)

        await expect(api.getSourceCode([address])).rejects.toThrow(/not yet implemented/i)
    })

    it('RoutescanApi(getDeploymentBlocks) can fetch deployment tx on Avalanche (and getSourceCode throws)', async () => {
        const client = stubClient(avalanche)
        const config: ExplorerConfig = { explorerApiKeyData: apiKey }
        const apiFor = createApiFor(client, config)

        const api = apiFor('getDeploymentBlocks')
        expect(api).toBeInstanceOf(RoutescanApi)

        const address = api.chain.contracts?.multicall3?.address
        if (!address) throw new Error('avalanche multicall3 address missing on chain config.')

        const [result] = await api.getDeploymentTxHashAndBlock([address])
        expect(result.address).toEqual(address)
        expect(result.deploymentTxHash).toMatch(/^0x[0-9a-fA-F]{64}$/)

        await expect(api.getSourceCode([address])).rejects.toThrow(/not yet implemented/i)
    })

    it('XLayerApi (via createApiFor) supports getDeploymentTxHashAndBlock + getSourceCode', async () => {
        const xlayerApiKey = process.env.XLAYER_API_KEY
        const xlayerSecretKey = process.env.XLAYER_SECRET_KEY
        const xlayerPassphrase = process.env.XLAYER_PASSPHRASE

        if (!xlayerApiKey || !xlayerSecretKey || !xlayerPassphrase) {
            throw new Error(
                'XLAYER_API_KEY, XLAYER_SECRET_KEY, XLAYER_PASSPHRASE must be set to run XLayer integration test.',
            )
        }

        const client = stubClient(xlayer)
        const config: ExplorerConfig = {
            explorerApiKeyData: {
                apiKey: xlayerApiKey,
                secretKey: xlayerSecretKey,
                passPhrase: xlayerPassphrase,
            },
        }
        const apiFor = createApiFor(client, config)

        // createApiFor returns XLayerApi for any role on XLayer
        const apiDeployment = apiFor('getDeploymentBlocks')
        expect(apiDeployment).toBeInstanceOf(XLayerApi)

        const address = apiDeployment.chain.contracts?.multicall3?.address
        if (!address) throw new Error('xlayer multicall3 address missing on chain config.')

        const deployment = await apiDeployment.getDeploymentTxHashAndBlock([address])
        expect(Array.isArray(deployment)).toBe(true)
        expect(deployment.length).toBeGreaterThan(0)
        expect(deployment[0].address).toEqual(address)
        expect(deployment[0].deploymentTxHash).toMatch(/^0x[0-9a-fA-F]{64}$/)

        const apiSource = apiFor('getContractInfo')
        expect(apiSource).toBeInstanceOf(XLayerApi)

        const source = await apiSource.getSourceCode([address])
        expect(Array.isArray(source)).toBe(true)
        // XLayer explorer may return empty if contract isn't verified; ensure we at least don't crash.
        if (source.length > 0) {
            expect(source[0].address).toEqual(address)
            expect(source[0].ABI).toBeTruthy()
        }
    })
})
