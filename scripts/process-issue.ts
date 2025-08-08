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
import { Hex } from 'viem'

interface IssueData {
    additional_contract_information: {
        selected: string[]
        unselected: string[]
    }
    network: string
    rate_provider_contract_address: Hex
    asset_contract_address: Hex
    audits: string
    protocol_documentation: string
    erc4626_asset_contract_address: Hex
    erc4626_asset_contract_audits: string
    erc4626_asset_contract_documentation: string
    terms_and_conditions: {
        selected: string[]
        unselected: string[]
    }
}

async function processIssue(issueJson: string) {
    // the issue is parsed via https://github.com/marketplace/actions/issue-template-parser

    const issueData: IssueData = JSON.parse(issueJson)

    console.log('Processing issue data:', issueJson)
    console.log('issue data:', issueData)

    // TODO: Validate data

    // Map network name to Chain object
    const networks: { [key: string]: Chain } = {
        base,
        mainnet,
        arbitrum,
        avalanche,
        gnosis,
        fraxtal,
        optimism,
        sonic,
        sepolia,
        polygon,
        polygonZkEvm,
        mode,
        hyperEvm,
    }
    let network = networks[issueData.network]

    // load the RPC URL from the environment variable
    const rpcUrl = process.env[`${issueData.network.toUpperCase()}_RPC_URL`]

    /* await writeReviewAndUpdateRegistry(
        issueData.rate_provider_contract_address,
        network,
        issueData.erc4626_asset_contract_address,
        rpcUrl as string,
    ) */
    //await writeERC4626ReviewAndUpdateRegistry(erc4626Address, network, rpcUrl)
}

// Read from environment variable instead of command line
const issueData = process.env.ISSUE_DATA || process.argv[2] || '{}'
console.log('Issue data from environment:', issueData)
processIssue(issueData)
