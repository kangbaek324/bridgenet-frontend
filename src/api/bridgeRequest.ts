import { BrowserProvider, parseEther, formatEther } from "ethers";
import { Bridge__factory } from "../typechain-types";

const NETWORK_PARAMS: Record<string, any> = {
  "11155111": {
    chainId: "0xaa36a7",
    chainName: "Sepolia",
    nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: [import.meta.env.VITE_SEPOLIA_RPC_URL],
    blockExplorerUrls: [import.meta.env.VITE_SEPOLIA_EXPLORER_URL],
  },
  "80002": {
    chainId: "0x13882",
    chainName: "Polygon Amoy",
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    rpcUrls: [import.meta.env.VITE_AMOY_RPC_URL],
    blockExplorerUrls: [import.meta.env.VITE_AMOY_EXPLORER_URL],
  },
};

async function switchNetwork(chainId: string) {
  try {
    await window.ethereum!.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: NETWORK_PARAMS[chainId].chainId }],
    });
  } catch (error: any) {
    if (error.code === 4902) {
      try {
        await window.ethereum!.request({
          method: "wallet_addEthereumChain",
          params: [NETWORK_PARAMS[chainId]],
        });
      } catch {
        throw new Error("Failed to add network. Please check MetaMask.");
      }
    } else if (error.code === 4001) {
      throw new Error("Network switch was rejected.");
    } else {
      throw new Error("Failed to switch network.");
    }
  }
}

function parseContractError(error: any, contractInterface: any): string {
  try {
    const data = error?.data ?? error?.error?.data ?? error?.revert?.data;
    if (data) {
      const parsed = contractInterface.parseError(data);
      if (parsed) {
        switch (parsed.name) {
          case "WhiteListUnauthorizedAccount":
            return "Your wallet address is not whitelisted. Please request whitelist access first.";
          case "BelowMinimumValue": {
            const min = formatEther(parsed.args[0]);
            const actual = formatEther(parsed.args[1]);
            return `Amount is below the minimum limit. (Min: ${min}, Entered: ${actual})`;
          }
          case "ExceedsMaximumValue": {
            const max = formatEther(parsed.args[0]);
            const actual = formatEther(parsed.args[1]);
            return `Amount exceeds the maximum limit. (Max: ${max}, Entered: ${actual})`;
          }
          case "InsufficientBalance": {
            const requested = formatEther(parsed.args[0]);
            const available = formatEther(parsed.args[1]);
            return `Insufficient contract balance. (Requested: ${requested}, Available: ${available})`;
          }
          case "OwnableUnauthorizedAccount":
            return "You do not have owner permissions.";
          default:
            return `Contract error: ${parsed.name}`;
        }
      }
    }
  } catch {}
  return "";
}

export async function bridgeRequest(
  fromChainId: string,
  toChainId: string,
  value: string,
  contractAddress: string,
) {
  await switchNetwork(fromChainId);

  const provider = new BrowserProvider(window.ethereum!);
  const signer = await provider.getSigner();
  const contract = Bridge__factory.connect(contractAddress, signer);
  const sendValue = parseEther(value);

  try {
    const tx = await contract.request(toChainId, { value: sendValue });
    console.log("Transaction sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);
    return receipt;
  } catch (error: any) {
    console.error("Bridge request failed:", error);

    if (error.code === 4001 || error?.info?.error?.code === 4001) {
      throw new Error("Transaction was rejected.");
    }

    if (error.code === -32002) {
      throw new Error("MetaMask is already processing a request. Please check MetaMask.");
    }

    const contractMsg = parseContractError(error, contract.interface);
    if (contractMsg) {
      throw new Error(contractMsg);
    }

    if (error.code === "INSUFFICIENT_FUNDS" || error?.info?.error?.message?.includes("insufficient funds")) {
      throw new Error("Insufficient wallet balance.");
    }

    throw new Error(error?.shortMessage ?? error?.message ?? "An unknown error occurred.");
  }
}
