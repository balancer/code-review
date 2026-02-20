import { Address, Hex, Chain } from 'viem'

export interface GetContractSourceCodeResult {
    SourceCode: string
    ABI: string
    ContractName: string
    CompilerVersion: string
    OptimizationUsed: string
    Runs: string
    ConstructorArguments: string
    EVMVersion: string
    Library: string
    LicenseType: string
    Proxy: string
    Implementation: Address
    SwarmSource: string
}

type ApiRole = 'getContractInfo' | 'getDeploymentBlocks'
export type ApiFor = (role: ApiRole) => ChainApi

export type TenderlySettings = {
    accountSlug: string
    projectSlug: string
    apiKey: string
}

export type XLayerChainExplorerConfig = {
    apiKey: string
    secretKey: string
    passPhrase: string
}

export type ExplorerConfig = {
    explorerApiKeyData: string | XLayerChainExplorerConfig
}

export type RateProviderDependencies = {
    tenderly: TenderlySettings
    explorerConfig: ExplorerConfig
}

export interface GetContractSourceCodeResponse {
    status: string
    message: string
    result: GetContractSourceCodeResult[]
}

export interface TransactionData {
    result: Array<{
        txHash: Hex
        blockNumber: string
    }>
}

export interface XLayerContractInfo {
    sourceCode: string
    contractName: string
    compilerVersion: string
    optimization: string
    optimizationRuns: string
    contractAbi: string
    evmVersion: string
    licenseType: string
    libraryInfo: Array<{
        libraryName: string
        libraryAddress: string
    }>
    proxy: string
    implementation: string
    swarmSource: string
}

export interface XLayerApiResponse<T> {
    code: string
    msg: string
    data: T[]
}

export interface XLayerAddressInfo {
    address: string
    balance: string
    balanceSymbol: string
    transactionCount: string
    firstTransactionTime: string
    lastTransactionTime: string
    contractAddress: boolean
    createContractAddress: string
    createContractTransactionHash: string
    contractCorrespondingToken: string
    contractCalls: string
    contractCallingAddresses: string
}

export interface CustomAgentInput {
    chain: Chain
    ruleString: string
    contractAddress: string
    contractAlias: string
    rateProvider: string
    agentName: string
    operands?: string
}

export interface CustomAgentInputUpgrade {
    chain: Chain
    ruleString: string
    contractAddress: string[]
    contractAlias: string
    rateProvider: string
    agentName: string
    operands?: string
}

// Minimal Hypernative agent representation used when fetching agents
export interface HypernativeAgent {
    id: number
    agentName: string
    agentType: string
    chain: string
    createdBy: string
    createdAt: string
}

/**
 * Interface for chain explorer APIs that provide contract source code
 * and deployment information.
 */
export interface ChainApi {
    /**
     * The chain this API instance is configured for.
     */
    readonly chain: Chain
    /**
     * Fetches source code information for the given addresses.
     * @param addresses The addresses to fetch source code for.
     * @returns An array of contract information including ABI, proxy status, etc.
     */
    getSourceCode(
        addresses: Address[],
    ): Promise<{ address: Address; Proxy: string; ContractName: string; ABI: string; Implementation: Address }[]>

    /**
     * Fetches deployment transaction hash and block number for the given addresses.
     * @param addresses The addresses to fetch deployment information for.
     * @returns An array of deployment information.
     */
    getDeploymentTxHashAndBlock(
        addresses: Address[],
    ): Promise<{ address: Address; deploymentTxHash: Hex; blockNumber: string }[]>
}
