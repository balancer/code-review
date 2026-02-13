import * as dotenv from 'dotenv'
import { createPublicClient, http } from 'viem'
import type { Chain } from 'viem'

dotenv.config()

const RPC_CHECK_TIMEOUT_MS = 10_000

// Network keys from process-issue.ts networks map; env var is {KEY.toUpperCase()}_RPC_URL
const RPC_ENV_KEYS = [
    'base',
    'mainnet',
    'arbitrum',
    'avalanche',
    'gnosis',
    'fraxtal',
    'optimism',
    'sonic',
    'sepolia',
    'polygon',
    'polygonZkEvm',
    'mode',
    'hyperEvm',
    'plasma',
    'xlayer',
    'monad',
] as const

function envName(key: string): string {
    return `${key.toUpperCase()}_RPC_URL`
}

function isValidHttpUrl(s: string): boolean {
    try {
        const u = new URL(s)
        return u.protocol === 'http:' || u.protocol === 'https:'
    } catch {
        return false
    }
}

function minimalChain(rpcUrl: string): Chain {
    return {
        id: 1,
        name: 'Unknown',
        nativeCurrency: { decimals: 18, name: 'Ether', symbol: 'ETH' },
        rpcUrls: { default: { http: [rpcUrl] } },
    }
}

async function checkRpcUrl(rpcUrl: string): Promise<{ ok: true } | { ok: false; reason: string }> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), RPC_CHECK_TIMEOUT_MS)

    const publicClient = createPublicClient({
        chain: minimalChain(rpcUrl),
        transport: http(rpcUrl, {
            fetchOptions: { signal: controller.signal },
        }),
    })

    try {
        await publicClient.createAccessList({
            to: '0x0000000000000000000000000000000000000000',
            data: '0x',
        })
        clearTimeout(timeoutId)
        return { ok: true }
    } catch (err) {
        clearTimeout(timeoutId)
        const reason = err instanceof Error ? err.message : String(err)
        if (controller.signal.aborted) return { ok: false, reason: 'timeout' }
        return { ok: false, reason }
    }
}

async function checkEtherscanApiKey(apiKey: string): Promise<{ ok: true } | { ok: false; reason: string }> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), RPC_CHECK_TIMEOUT_MS)

    // WETH on mainnet - always verified contract
    const address = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
    const url = `https://api.etherscan.io/v2/api?chainid=1&module=contract&action=getsourcecode&address=${address}&apikey=${apiKey}`

    try {
        const response = await fetch(url, { signal: controller.signal })
        clearTimeout(timeoutId)

        if (!response.ok) {
            return { ok: false, reason: `HTTP ${response.status}: ${response.statusText}` }
        }

        const data = await response.json()

        // Check for API errors in the response
        if (data.message) {
            const message = data.message.toLowerCase()
            if (message.includes('invalid api key') || message.includes('invalid api')) {
                return { ok: false, reason: 'invalid API key' }
            }
            if (message.includes('rate limit') || message.includes('max rate limit')) {
                return { ok: false, reason: 'rate limit' }
            }
        }

        // Success criteria: status "1" and valid result
        if (data.status === '1' && Array.isArray(data.result) && data.result.length > 0) {
            // Check that contract is verified (not "Contract source code not verified")
            if (data.result[0].ABI && data.result[0].ABI !== 'Contract source code not verified') {
                return { ok: true }
            }
        }

        // If we get here, something unexpected happened
        return { ok: false, reason: data.message || 'unexpected response format' }
    } catch (err) {
        clearTimeout(timeoutId)
        if (controller.signal.aborted) {
            return { ok: false, reason: 'timeout' }
        }
        const reason = err instanceof Error ? err.message : String(err)
        return { ok: false, reason }
    }
}

async function checkTenderlyCredentials(
    accountSlug: string,
    projectSlug: string,
    apiKey: string,
): Promise<{ ok: true } | { ok: false; reason: string }> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), RPC_CHECK_TIMEOUT_MS)

    const url = `https://api.tenderly.co/api/v1/account/${accountSlug}/project/${projectSlug}/simulations?page_size=1`

    try {
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                Accept: 'application/json',
                'X-Access-Key': apiKey,
            },
        })
        clearTimeout(timeoutId)

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                return { ok: false, reason: 'invalid API key or insufficient permissions' }
            }
            if (response.status === 404) {
                return { ok: false, reason: 'project not found' }
            }
            if (response.status === 400) {
                return { ok: false, reason: 'invalid account or project slug' }
            }
            return { ok: false, reason: `HTTP ${response.status}: ${response.statusText}` }
        }

        // Verify response is valid JSON
        await response.json()

        return { ok: true }
    } catch (err) {
        clearTimeout(timeoutId)
        if (controller.signal.aborted) {
            return { ok: false, reason: 'timeout' }
        }
        const reason = err instanceof Error ? err.message : String(err)
        return { ok: false, reason }
    }
}

async function checkHypernativeCredentials(
    clientId: string,
    clientSecret: string,
): Promise<{ ok: true } | { ok: false; reason: string }> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), RPC_CHECK_TIMEOUT_MS)

    const url = 'https://api.hypernative.xyz/custom-agents'

    try {
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                accept: 'application/json',
                'x-client-id': clientId,
                'x-client-secret': clientSecret,
            },
        })
        clearTimeout(timeoutId)

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                return { ok: false, reason: 'invalid credentials' }
            }
            return { ok: false, reason: `HTTP ${response.status}: ${response.statusText}` }
        }

        // Verify response is valid JSON
        await response.json()

        return { ok: true }
    } catch (err) {
        clearTimeout(timeoutId)
        if (controller.signal.aborted) {
            return { ok: false, reason: 'timeout' }
        }
        const reason = err instanceof Error ? err.message : String(err)
        return { ok: false, reason }
    }
}

async function main(): Promise<void> {
    const results: { name: string; status: 'pass' | 'fail'; reason?: string }[] = []

    for (const key of RPC_ENV_KEYS) {
        const name = envName(key)
        const value = process.env[name]?.trim()

        if (value === undefined || value === '') {
            results.push({ name, status: 'fail', reason: 'missing' })
            console.log(`${name}: fail — missing`)
            continue
        }

        if (!isValidHttpUrl(value)) {
            results.push({ name, status: 'fail', reason: 'invalid URL' })
            console.log(`${name}: fail — invalid URL`)
            continue
        }

        const check = await checkRpcUrl(value)
        if (check.ok) {
            results.push({ name, status: 'pass' })
            console.log(`${name}: success`)
        } else {
            results.push({ name, status: 'fail', reason: check.reason })
            console.log(`${name}: fail — ${check.reason}`)
        }
    }

    // Check Etherscan API key
    const etherscanApiKey = process.env.ETHERSCAN_API_KEY?.trim()
    if (etherscanApiKey === undefined || etherscanApiKey === '') {
        results.push({ name: 'ETHERSCAN_API_KEY', status: 'fail', reason: 'missing' })
        console.log(`ETHERSCAN_API_KEY: fail — missing`)
    } else {
        const check = await checkEtherscanApiKey(etherscanApiKey)
        if (check.ok) {
            results.push({ name: 'ETHERSCAN_API_KEY', status: 'pass' })
            console.log(`ETHERSCAN_API_KEY: success`)
        } else {
            results.push({ name: 'ETHERSCAN_API_KEY', status: 'fail', reason: check.reason })
            console.log(`ETHERSCAN_API_KEY: fail — ${check.reason}`)
        }
    }

    // Check Tenderly credentials
    const tenderlyAccountSlug = process.env.TENDERLY_ACCOUNT_SLUG?.trim()
    const tenderlyProjectSlug = process.env.TENDERLY_PROJECT_SLUG?.trim()
    const tenderlyApiKey = process.env.TENDERLY_API_ACCESS_KEY?.trim()

    if (tenderlyAccountSlug === undefined || tenderlyAccountSlug === '') {
        results.push({ name: 'TENDERLY_ACCOUNT_SLUG', status: 'fail', reason: 'missing' })
        console.log(`TENDERLY_ACCOUNT_SLUG: fail — missing`)
    }
    if (tenderlyProjectSlug === undefined || tenderlyProjectSlug === '') {
        results.push({ name: 'TENDERLY_PROJECT_SLUG', status: 'fail', reason: 'missing' })
        console.log(`TENDERLY_PROJECT_SLUG: fail — missing`)
    }
    if (tenderlyApiKey === undefined || tenderlyApiKey === '') {
        results.push({ name: 'TENDERLY_API_ACCESS_KEY', status: 'fail', reason: 'missing' })
        console.log(`TENDERLY_API_ACCESS_KEY: fail — missing`)
    }

    // If all three are present, validate with API call
    if (
        tenderlyAccountSlug !== undefined &&
        tenderlyAccountSlug !== '' &&
        tenderlyProjectSlug !== undefined &&
        tenderlyProjectSlug !== '' &&
        tenderlyApiKey !== undefined &&
        tenderlyApiKey !== ''
    ) {
        const check = await checkTenderlyCredentials(tenderlyAccountSlug, tenderlyProjectSlug, tenderlyApiKey)
        if (check.ok) {
            results.push({ name: 'TENDERLY', status: 'pass' })
            console.log(`TENDERLY: success`)
        } else {
            results.push({ name: 'TENDERLY', status: 'fail', reason: check.reason })
            console.log(`TENDERLY: fail — ${check.reason}`)
        }
    }

    // Check Hypernative credentials
    const hypernativeClientId = process.env.HYPERNATIVE_CLIENT_ID?.trim()
    const hypernativeClientSecret = process.env.HYPERNATIVE_CLIENT_SECRET?.trim()

    if (hypernativeClientId === undefined || hypernativeClientId === '') {
        results.push({ name: 'HYPERNATIVE_CLIENT_ID', status: 'fail', reason: 'missing' })
        console.log(`HYPERNATIVE_CLIENT_ID: fail — missing`)
    }
    if (hypernativeClientSecret === undefined || hypernativeClientSecret === '') {
        results.push({ name: 'HYPERNATIVE_CLIENT_SECRET', status: 'fail', reason: 'missing' })
        console.log(`HYPERNATIVE_CLIENT_SECRET: fail — missing`)
    }

    // If both are present, validate with API call
    if (
        hypernativeClientId !== undefined &&
        hypernativeClientId !== '' &&
        hypernativeClientSecret !== undefined &&
        hypernativeClientSecret !== ''
    ) {
        const check = await checkHypernativeCredentials(hypernativeClientId, hypernativeClientSecret)
        if (check.ok) {
            results.push({ name: 'HYPERNATIVE', status: 'pass' })
            console.log(`HYPERNATIVE: success`)
        } else {
            results.push({ name: 'HYPERNATIVE', status: 'fail', reason: check.reason })
            console.log(`HYPERNATIVE: fail — ${check.reason}`)
        }
    }

    const passed = results.filter((r) => r.status === 'pass').length
    const failed = results.filter((r) => r.status === 'fail').length
    console.log('')
    console.log(`Summary: ${passed} passed, ${failed} failed`)
    if (failed > 0) {
        console.log('Failed:')
        results.filter((r) => r.status === 'fail').forEach((r) => console.log(`  ${r.name}`))
    }
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
