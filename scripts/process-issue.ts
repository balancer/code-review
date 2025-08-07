import { writeReviewAndUpdateRegistry as writeERC4626ReviewAndUpdateRegistry } from './write-erc4626-review'
import { writeReviewAndUpdateRegistry } from './write-review'

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
import { hyperEvm } from '../src/utils/customChains'

export async function processIssue(issueJson: string) {
    // the issue is parsed via https://github.com/marketplace/actions/issue-template-parser

    console.log('Processing issue:', issueJson)

    //await writeReviewAndUpdateRegistry(rateProviderAddress, network, erc4626Address, rpcUrl)
    //await writeERC4626ReviewAndUpdateRegistry(erc4626Address, network, rpcUrl)
}

// Read from environment variable instead of command line
const issueData = process.env.ISSUE_DATA || process.argv[2] || '{}'
processIssue(issueData)
