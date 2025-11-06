import { Chain } from 'viem'
import EtherscanApi from '../services/etherscanApi'
import XLayerApi from '../services/xlayerApi'
import { xlayer } from './customChains'

export const createChainApi = (chain: Chain) => {
    if (chain.id === xlayer.id) {
        return new XLayerApi(
            chain,
            process.env.XLAYER_API_KEY || '',
            process.env.XLAYER_SECRET_KEY || '',
            process.env.XLAYER_PASSPHRASE || '',
        )
    }
    return new EtherscanApi(chain, process.env.ETHERSCAN_API_KEY || '')
}
