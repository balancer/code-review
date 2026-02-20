import * as dotenv from 'dotenv'
import { writeReviewAndUpdateRegistry as writeERC4626ReviewAndUpdateRegistry } from '../src/utils/write-erc4626-review'
import { writeReviewAndUpdateRegistry } from '../src/utils/write-rp-review'
import { createCustomAgents } from '../src/utils'
import { HypernativeAgent, RateProviderDependencies } from '../src/types/types'
import { http, createPublicClient } from 'viem'
import * as fs from 'fs'

dotenv.config()

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
    monad,
} from 'viem/chains'
import { hyperEvm, plasma, xlayer } from '../src/utils/customChains'
import { Hex } from 'viem'

/* 
The additional_contract_information can contain the below strings

"Does this rate provider pertain to an ERC4626 contract?",
"If so, is the intention for this ERC4626 asset to be boosted?",
"If so, shall the underlying asset be used to add/remove liquidity in a pool if possible? (i.e. add USDC for waUSDC)",
"If so, shall the wrapped asset also be used to add/remove liquidity in a pool? (i.e. add waUSDC directly)",
"Is a combined rate provider needed (i.e. wstETH in aave)?"
*/
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
    link_to_passing_fork_tests: string
    terms_and_conditions: {
        selected: string[]
        unselected: string[]
    }
}

async function processIssue(issueJson: string) {
    // the issue is parsed via https://github.com/marketplace/actions/issue-template-parser

    const issueData: IssueData = JSON.parse(issueJson)

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
        plasma,
        xlayer,
        monad,
    }
    let network = networks[issueData.network]

    // load the RPC URL from the environment variable
    const rpcUrl = process.env[`${issueData.network.toUpperCase()}_RPC_URL`] as string

    const explorerApiKeyData =
        issueData.network === 'xlayer'
            ? {
                  apiKey: process.env.XLAYER_API_KEY || '',
                  secretKey: process.env.XLAYER_SECRET_KEY || '',
                  passPhrase: process.env.XLAYER_PASSPHRASE || '',
              }
            : process.env.ETHERSCAN_API_KEY || ''

    // replace the default network url with the passed one
    // Override the default RPC URL
    // Reason it must be an RPC URL that supports createAccessList
    network = {
        ...network,
        rpcUrls: {
            ...network.rpcUrls,
            default: {
                http: [rpcUrl],
            },
        },
    }

    const publicClient = createPublicClient({
        chain: network,
        transport: http(rpcUrl),
    })

    const deps: RateProviderDependencies = {
        tenderly: {
            accountSlug: process.env.TENDERLY_ACCOUNT_SLUG || '',
            projectSlug: process.env.TENDERLY_PROJECT_SLUG || '',
            apiKey: process.env.TENDERLY_API_ACCESS_KEY || '',
        },
        explorerConfig: {
            explorerApiKeyData,
        },
    }

    // rp review
    await writeReviewAndUpdateRegistry(
        issueData.rate_provider_contract_address,
        issueData.asset_contract_address,
        publicClient,
        deps,
        issueData.protocol_documentation,
        issueData.audits,
        issueData.additional_contract_information.selected.includes('Is the rate provider reporting a market rate?')
            ? { isMarketRate: true }
            : undefined,
    )

    // this step requires the registry to be read thus having the registry updated already
    let createdAgents: HypernativeAgent[] = []
    try {
        createdAgents = await createCustomAgents(issueData.rate_provider_contract_address, network)
        console.log('createdAgents:', createdAgents)
    } catch {
        console.log(`Failed to create custom agents for chain ${network.name}`)
    }

    // If we successfully created any Hypernative agents, expose simple variables
    // via the GitHub Actions step outputs (GITHUB_OUTPUT). The workflow can then
    // use these in a markdown template in the PR body.
    if (createdAgents.length > 0 && process.env.GITHUB_OUTPUT) {
        const outputPath = process.env.GITHUB_OUTPUT
        const ids = createdAgents.map((agent) => agent.id).join(', ')
        const names = createdAgents.map((agent) => agent.agentName).join(', ')

        console.log('GITHUB_OUTPUT path:', outputPath)
        console.log('hypernative_agent_ids value:', ids)
        console.log('hypernative_agent_names value:', names)

        fs.appendFileSync(outputPath, `hypernative_agent_ids=${ids}\n`)
        fs.appendFileSync(outputPath, `hypernative_agent_names=${names}\n`)
    }

    // Only continue with erc4626 review if

    //await writeERC4626ReviewAndUpdateRegistry(erc4626Address, network, rpcUrl)
    if (
        issueData.additional_contract_information.selected.includes(
            'If so, is the intention for this ERC4626 asset to be boosted?',
        )
    ) {
        await writeERC4626ReviewAndUpdateRegistry(
            issueData.erc4626_asset_contract_address,
            publicClient,
            deps,
            issueData.erc4626_asset_contract_audits, //link to audits
            issueData.erc4626_asset_contract_documentation, //written docs excerpt
            issueData.link_to_passing_fork_tests, // are fork tests passing?
            issueData.link_to_passing_fork_tests, //link to passing fork tests
            issueData.additional_contract_information.selected.includes('If so, is the Buffer already initialized') &&
                issueData.link_to_passing_fork_tests
                ? true
                : false,
            issueData.additional_contract_information.selected.includes(
                'If so, shall the underlying asset be used to add/remove liquidity in a pool if possible? (i.e. add USDC for waUSDC)',
            ),
            issueData.additional_contract_information.selected.includes(
                'If so, shall the wrapped asset also be used to add/remove liquidity in a pool? (i.e. add waUSDC directly)',
            ),
        )
    }
}

// Read from environment variable instead of command line
const issueData = process.env.ISSUE_DATA || process.argv[2] || '{}'
//console.log('Issue data from environment:', issueData)

processIssue(issueData)
