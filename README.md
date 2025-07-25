# code-review

A collection of smart contract code reviews performed upon friendly request.

NOTHING IN THIS REPOSITORY CONSTITUTES A FORMAL AUDIT, AND CODE SHOULD NEVER BE DEPLOYED TO PRODUCTION WITHOUT A FORMAL AUDIT. REVIEWERS ARE HUMAN; MISTAKES WILL BE MADE AND BUGS MISSED. REVIEWERS ARE NOT LIABLE FOR ANY INCIDENT THAT OCCURS POST-REVIEW. THIS IS MERELY A FRIENDLY PEER-REVIEW SERVICE AND SHOULD NOT BE TREATED AS A STAMP OF APPROVAL. REVIEWED CODE IS NOT NECESSARILY BUG-FREE. ALWAYS TRIPLE-CHECK BEFORE INTERACTING WITH SMART CONTRACTS, AND DO NOT TRUST REVIEWERS ON THE BASIS OF REPUTATION ALONE.

Rate Provider Factories for reference

| Network    | ChainlinkRateProviderFactory               | ERC4626RateProviderFactory                 |
| ---------- | ------------------------------------------ | ------------------------------------------ |
| Arbitrum   | 0x5DbAd78818D4c8958EfF2d5b95b28385A22113Cd | 0xe548a29631f9E49830bE8edc22d407b2D2915F31 |
| Avalanche  | 0x76578ecf9a141296Ec657847fb45B0585bCDa3a6 | 0xfCe81cafe4b3F7e2263EFc2d907f488EBF2B238E |
| Base       | 0x0A973B6DB16C2ded41dC91691Cc347BEb0e2442B | 0xEfD3aF73d3359014f3B864d37AC672A6d3D7ff1A |
| Fraxtal    | 0x3f170631ed9821Ca51A59D996aB095162438DC10 | N/A                                        |
| Gnosis     | 0xDB8d758BCb971e482B2C45f7F8a7740283A1bd3A | 0x15e86Be6084C6A5a8c17732D398dFbC2Ec574CEC |
| Mainnet    | 0x1311Fbc9F60359639174c1e7cC2032DbDb5Cc4d1 | 0xFC541f8d8c5e907E236C8931F0Df9F58e0C259Ec |
| Mode       | 0x96484f2aBF5e58b15176dbF1A799627B53F13B6d | 0x0767bECE12a327A1eD896c48E843AE53a0c313E9 |
| Optimism   | 0x83E443EF4f9963C77bd860f94500075556668cb8 | 0x02a569eea6f85736E2D63C59E60d27d075E75c33 |
| Polygon    | 0xa3b370092aeb56770B23315252aB5E16DAcBF62B | 0x3e89cc86307aF44A77EB29d0c4163d515D348313 |
| Sepolia    | 0xA8920455934Da4D853faac1f94Fe7bEf72943eF1 | N/A                                        |
| zkEVM      | 0x4132f7AcC9dB7A6cF7BE2Dd3A9DC8b30C7E6E6c8 | N/A                                        |
| HyperEVM   | 0x03362f847b4fabc12e1ce98b6b59f94401e4588e | 0xec2c6184761ab7fe061130b4a7e3da89c72f8395 |

Rate Transformer Factories 
Use these factories when an ERC4626 vault contains a yield bearing token to combine their resepctive rates of growth. This denominates the vault asset in the underlying for correlated pairs. For example Aave-wstETH pairing with Aave-wETH by denominating the assets in wETH.

| Network    | AaveRateTransformerFactory                 | 
| ---------- | -------------------------------------------|
| Arbitrum   | 0xec2c6184761ab7fe061130b4a7e3da89c72f8395 | 
| Base       | 0x4e185b1502fea7a06b63fdda6de38f92c9528566 |
| Ethereum   | 0xec2c6184761ab7fe061130b4a7e3da89c72f8395 | 
| Gnosis     | 0x03362f847b4fabc12e1ce98b6b59f94401e4588e | 
 

Constant Rate Provider Factories
Use this factories for Gyro pools. They report a static rate custom tailored to gyro pools.

| Network    | ConstantRateProviderFactory                 | 
| ---------- | -------------------------------------------|
| Arbitrum   | 0xF502791715F287989374c452Fa78b475A3194a90 | 
| Base       | 0xc0555b555857AAf2b5b28601eaAcFba2F8BBFB09 |

Combined Rate Provider Factories
Use this factories to combine rate providers, similar to AaveRateTransformers. These factories take in two different rate providers, multipliy them, and display the result as getRate. Used for nested rates to denominate the base asset. For example Aave - wstETH has a LST rate and a lending vault rate which must be combined to result in the ETH rate. 

| Network    | CombinedRateProviderFactory                 | 
| ---------- | -------------------------------------------|
| Arbitrum   | 0x26dec0e6a4249f28e0f16a1a79808bf9ba308310 | 
| Avalanche  | 0xeC2C6184761ab7fE061130B4A7e3Da89c72F8395 | 
| Base       | 0x40b48e1eb72c62f7201b4c2621df7d822ccb9944 |
| Ethereum   | 0xd2cd8027f8c4b8ddcd1bfcd4e47587f41f2712f2 | 
| Gnosis     | 0xec2c6184761ab7fe061130b4a7e3da89c72f8395 | 
| Optimism   | 0x7d9507014cc564e3b95e4d0972a878d0862af7ae | 
| HyperEVM   | 0x138d9e0d0cc4906c4cd865b38c9340a5cedd9850 |
---

## Setup

1. **Install dependencies:**
    ```sh
    npm install
    ```

2. **Set up environment variables:**
    Create a .env file in the root directory and add the necessary environment variables. You can use the .env.example file as a reference.

    ```sh
    cp .env.example .env
    ```

    ### Essential Environment Variables:
    - **`HYPERNATIVE_CLIENT_ID`**: Your Hypernative API client ID.
    - **`HYPERNATIVE_CLIENT_SECRET`**: Your Hypernative API client secret.
    - **`TENDERLY_ACCOUNT_SLUG`**: Your Tenderly account slug.
    - **`TENDERLY_PROJECT_SLUG`**: Your Tenderly project slug.
    - **`TENDERLY_API_ACCESS_KEY`**: Your Tenderly API access key.
    - **`ETHERSCAN_API_KEY`**: Your Etherscan API key (for Ethereum).
    - **Other API keys**: Depending on the chain, you may need additional API keys (e.g., `GNOSISSCAN_API_KEY`, `BASESCAN_API_KEY`, etc.).

---

## Testing

1. **Run tests:**
    ```sh
    npm test
    ```

---

## Scripts

The following scripts are available in the package.json file:

- **`npm run test`**: Runs the test suite.
- **`npm run lint`**: Lints the registry.
- **`npm run write-review`**: Generates the rate-provider review.

---

## Running Scripts

### `npm run write-review`

This script generates a review for a specified rate provider. It fetches the necessary data, generates a markdown review file, and updates the registry with the new review information. It additionally creates the Hypernative monitoring agents.

#### Usage:
```sh
npm run write-review -- --rateProviderAddress <address> --network <network> --rateProviderAsset <asset> --rpcUrl <rpcUrl>
```

#### Example:
```sh
npm run write-review -- --rateProviderAddress 0xA4c27E4Aa764312fD958345Ed683c6eeC4581A10 --network mainnet --rateProviderAsset 0x7788A3538C5fc7F9c7C8A74EAC4c898fC8d87d92 --rpcUrl <yourRpcUrl>
```

#### Supported Networks:

**WIP**: This is work in progress and will be updated once more reviews for new networks come in.

The supported networks can be seen in the `write-review.ts` file under the network option:
```typescript
.option('network', {
    alias: 'n',
    type: 'string',
    description: 'The network the rate provider is deployed on',
    choices: ['base', 'mainnet', 'arbitrum', 'avalanche', 'gnosis', 'sonic', 'fraxtal', 'optimism'],
    demandOption: true,
})
```


---

## Output

The `write-review` script does the following:
1. Updates the `registry.json` file with rate provider information.
2. Generates a markdown review report.
3. Generates the monitoring agents on the hpyernative platform.

### Post-Script Actions:
Before the review is finalized, the user is expected to:
- Add context about the rate provider in the generated markdown file.
- Include audit reports (if available).
- Optionally rename the review file and update the `name` and `review` fields in the registry.
