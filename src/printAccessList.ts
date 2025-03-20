import { createPublicClient, encodeFunctionData, http } from "viem";
import { mainnet } from "viem/chains";
import * as fs from "fs";
import * as path from "path";
import { chainlinkRateProviderABI } from "./utils/abis/chainlinkRateProvider";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const infuraProjectId = process.env.ETHEREUM_RPC_URL;
  if (!infuraProjectId) {
    throw new Error("INFURA_PROJECT_ID is not set in the .env file");
  }

  const callData = encodeFunctionData({
    abi: chainlinkRateProviderABI,
    functionName: "getRate",
  });
  const rateProvider = "0x05E956cb3407b1B22F4ed8568F3C28644Da28B85";

  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(),
  });

  // Create the access list
  const result = await publicClient.createAccessList({
    data: callData,
    to: rateProvider,
  });

  // Extract the accessList from the result
  const accessList = result.accessList;
}

main().catch((error) => {
  console.error("Error:", error);
});