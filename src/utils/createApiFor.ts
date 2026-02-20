import { PublicClient, Chain } from 'viem'
import { base, optimism, avalanche } from 'viem/chains'
import { ApiFor, ExplorerConfig, XLayerChainExplorerConfig } from 'types'
import { xlayer } from './customChains'

import EtherscanApi from '../services/etherscanApi'
import XLayerApi from '../services/xlayerApi'
import BlockscoutApi from '../services/BlockscoutApi'
import RoutescanApi from '../services/RoutescanApi'

function isXLayerCfg(x: string | XLayerChainExplorerConfig): x is XLayerChainExplorerConfig {
    return typeof x !== 'string'
}

export function createApiFor(client: PublicClient<any, Chain>, config: ExplorerConfig): ApiFor {
    const chain = client.chain

    return (role) => {
        const explorerApiKeyData = config.explorerApiKeyData

        // XLayer: must use XLayerApi + requires special creds
        if (chain.id === xlayer.id) {
            if (!isXLayerCfg(explorerApiKeyData)) {
                throw new Error('XLayer chain requires XLayerChainExplorerConfig (apiKey/secretKey/passPhrase).')
            }
            return new XLayerApi(
                chain,
                explorerApiKeyData.apiKey,
                explorerApiKeyData.secretKey,
                explorerApiKeyData.passPhrase,
            )
        }
        // Non-XLayer chains: must have a string api key
        if (typeof explorerApiKeyData !== 'string' || explorerApiKeyData.length === 0) {
            throw new Error(
                'Non-XLayer chains require explorerApiKeyData to be a non-empty string (e.g. ETHERSCAN_API_KEY).',
            )
        }

        if (role === 'getContractInfo') {
            return new EtherscanApi(chain, explorerApiKeyData)
        }

        // role === 'getDeploymentBlocks'
        if (chain.id === base.id || chain.id === optimism.id) {
            return new BlockscoutApi(chain, explorerApiKeyData)
        }
        if (chain.id === avalanche.id) {
            return new RoutescanApi(chain, explorerApiKeyData)
        }
        return new EtherscanApi(chain, explorerApiKeyData)
    }
}
