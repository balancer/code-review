Here is the improved content for your README.md file as raw data:

---

# Code Review

A collection of smart contract code reviews performed upon friendly request.

**Disclaimer**:  
NOTHING IN THIS REPOSITORY CONSTITUTES A FORMAL AUDIT, AND CODE SHOULD NEVER BE DEPLOYED TO PRODUCTION WITHOUT A FORMAL AUDIT. REVIEWERS ARE HUMAN; MISTAKES WILL BE MADE AND BUGS MISSED. REVIEWERS ARE NOT LIABLE FOR ANY INCIDENT THAT OCCURS POST-REVIEW. THIS IS MERELY A FRIENDLY PEER-REVIEW SERVICE AND SHOULD NOT BE TREATED AS A STAMP OF APPROVAL. REVIEWED CODE IS NOT NECESSARILY BUG-FREE. ALWAYS TRIPLE-CHECK BEFORE INTERACTING WITH SMART CONTRACTS, AND DO NOT TRUST REVIEWERS ON THE BASIS OF REPUTATION ALONE.

---

## Setup

1. **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/code-review.git
    cd code-review
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Set up environment variables:**
    Create a .env file in the root directory and add the necessary environment variables. You can use the .env.example file as a reference.

    ```sh
    cp .env.example .env
    ```

    ### Essential Environment Variables:
    - **`CUSTOM_RPC_URL`**: A custom RPC URL that supports `eth_createAccessList`. This is required for interacting with the blockchain.
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
npm run write-review -- --rateProviderAddress <address> --network <network> --rateProviderAsset <asset>
```

#### Example:
```sh
npm run write-review -- --rateProviderAddress 0xA4c27E4Aa764312fD958345Ed683c6eeC4581A10 --network mainnet --rateProviderAsset 0x7788A3538C5fc7F9c7C8A74EAC4c898fC8d87d92
```

#### Supported Networks:

**WIP**: This is work in progress and will be updated once more reviews for new networks come in.

The supported networks can be seen in the `write-review.ts` file under the network option:
```typescript
.option('network', {
    alias: 'n',
    type: 'string',
    description: 'The network the rate provider is deployed on',
    choices: ['base', 'mainnet', 'arbitrum', 'avalanche'],
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



Constant Rate Provider Factories
Use this factories gor Gyro pools. They report a static rate custom tailored to gyro pools.

| Network    | AaveRateTransformerFactory                 | 
| ---------- | -------------------------------------------|
| Arbitrum   | 0xF502791715F287989374c452Fa78b475A3194a90 | 
| Base       | 0xc0555b555857AAf2b5b28601eaAcFba2F8BBFB09 |
