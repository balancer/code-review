/**
 * One-off probe: verify Etherscan V2 getcontractcreation works for Base
 * with the addresses from issue #806 / the failing Blockscout batch.
 *
 * Usage (CI): npx tsx scripts/probe-etherscan-base-deployment.ts
 */
import { Address } from 'viem'
import { base } from 'viem/chains'
import EtherscanApi from '../src/services/etherscanApi'

const ADDRESSES = [
    '0xb6862ada846003e66e2bc2de1e1acc4687f2ccb3',
    '0x1be88d8b5696a69378973729523f3a135921854b',
    '0x586d1d28d5f8aed81da8aef7016c4108f7a4ce51', // rate provider from issue #806
    '0xe32ba1c7546cf0793ce88ddcb7883d37fba83789',
    '0x9c2dcdbdb3f0a0f628d1112bbcabd9ae75353df3', // asset from issue #806
] as Address[]

async function probeRaw(apiKey: string) {
    const url =
        `https://api.etherscan.io/v2/api?chainid=${base.id}` +
        `&module=contract&action=getcontractcreation` +
        `&contractaddresses=${ADDRESSES.join(',')}` +
        `&apikey=${apiKey}`

    const response = await fetch(url)
    const data = await response.json()
    console.log(`HTTP ${response.status}`)
    console.log(`status=${data.status} message=${data.message}`)
    console.log(`result_type=${Array.isArray(data.result) ? 'array' : typeof data.result}`)
    if (typeof data.result === 'string') {
        console.log(`result=${data.result}`)
    } else if (Array.isArray(data.result)) {
        console.log(`result_len=${data.result.length}`)
    }
    return data
}

async function main() {
    const apiKey = process.env.ETHERSCAN_API_KEY
    if (!apiKey) {
        throw new Error('ETHERSCAN_API_KEY is not set')
    }

    console.log(`Probing Etherscan V2 getcontractcreation on Base for ${ADDRESSES.length} addresses...`)
    const raw = await probeRaw(apiKey)

    if (raw.status !== '1' || !Array.isArray(raw.result)) {
        throw new Error(
            `Etherscan V2 Base getcontractcreation failed: status=${raw.status} message=${raw.message} result=${typeof raw.result === 'string' ? raw.result : JSON.stringify(raw.result)?.slice(0, 200)}`,
        )
    }

    const api = new EtherscanApi(base, apiKey)
    const results = await api.getDeploymentTxHashAndBlock(ADDRESSES)

    for (const result of results) {
        const ok = Boolean(result.deploymentTxHash)
        console.log(
            `${ok ? 'OK' : 'MISSING'} ${result.address} tx=${result.deploymentTxHash || 'n/a'} block=${result.blockNumber || 'n/a'}`,
        )
        if (!ok) {
            throw new Error(`Missing deployment tx for ${result.address}`)
        }
    }

    console.log(`SUCCESS: Etherscan V2 returned deployment data for all ${results.length} Base addresses`)
}

main().catch((error) => {
    console.error('PROBE FAILED:', error instanceof Error ? error.message : error)
    process.exit(1)
})
