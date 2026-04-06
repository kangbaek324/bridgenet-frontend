import { BrowserProvider } from "ethers";
import { Bridge__factory } from "../typechain-types";
import { parseEther } from "ethers";

// 네트워크 정보 정의
const NETWORK_PARAMS: Record<string, any> = {
  "11155111": {
    chainId: "0xaa36a7", // 11155111을 16진수로
    chainName: "Sepolia",
    nativeCurrency: {
      name: "Sepolia ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.sepolia.org"],
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
  },
  "80002": {
    chainId: "0x13882", // 80002를 16진수로
    chainName: "Polygon Amoy",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-amoy.polygon.technology"],
    blockExplorerUrls: ["https://amoy.polygonscan.com"],
  },
};

// 네트워크 전환 함수
async function switchNetwork(chainId: string) {
  try {
    const hexChainId = NETWORK_PARAMS[chainId].chainId;

    // 네트워크 전환 시도
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: hexChainId }],
    });

    console.log(`네트워크 전환 완료: ${chainId}`);
  } catch (error: any) {
    // 네트워크가 MetaMask에 없는 경우 (error code 4902)1
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [NETWORK_PARAMS[chainId]],
        });
        console.log(`네트워크 추가 완료: ${chainId}`);
      } catch (addError) {
        console.error("네트워크 추가 실패:", addError);
        throw addError;
      }
    } else {
      console.error("네트워크 전환 실패:", error);
      throw error;
    }
  }
}

export async function bridgeRequest(
  fromChainId: string,
  toChainId: string,
  value: string,
  contractAddress: string,
) {
  try {
    // 1. 먼저 올바른 네트워크로 전환
    await switchNetwork(fromChainId);

    // 2. Provider와 Signer 가져오기
    const provider = new BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    console.log("현재 네트워크:", network);

    const signer = await provider.getSigner();

    // 3. 컨트랙트 연결
    const contract = Bridge__factory.connect(
      contractAddress,
      signer,
    );

    let sendValue = parseEther(value);

    // 4. 트랜잭션 실행
    const tx = await contract.request(toChainId, sendValue, {
      value: sendValue,
    });
    console.log("트랜잭션 전송됨:", tx.hash);

    const receipt = await tx.wait();
    console.log("트랜잭션 완료:", receipt);

    return receipt;
  } catch (error: any) {
    console.error("브릿지 요청 실패:", error);

    if (error.code === 4001) {
      alert("사용자가 트랜잭션을 거부했습니다.");
    } else if (error.code === -32002) {
      alert("MetaMask에서 이미 요청 대기 중입니다.");
    } else {
      alert(`트랜잭션 실패: ${error.message}`);
    }

    throw error;
  }
}
