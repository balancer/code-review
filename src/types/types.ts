import { Address, Hex } from 'viem'

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
