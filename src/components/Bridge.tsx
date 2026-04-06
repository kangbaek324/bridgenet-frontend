import { useState, useEffect } from "react";
import BridgeItem from "./BridgeItem";
import { bridgeRequest } from "../api/bridgeRequest";
import axios from "axios";

interface ChainInfo {
  chainId: number;
  chainName: string;
  smartContractAddress: string;
  unit: string;
}

export default function Bridge() {
  const [chains, setChains] = useState<ChainInfo[]>([]);
  const [chainsLoading, setChainsLoading] = useState(true);
  const [fromChainId, setFromChainId] = useState<string>("");
  const [toChainId, setToChainId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [connectedWallet, setConnectedWallet] = useState<string>("");
  const [buttonValue, setButtonValue] = useState("Connect Wallet");

  useEffect(() => {
    fetchChains();
  }, []);

  const fetchChains = async () => {
    setChainsLoading(true);
    try {
      const res = await axios.get("http://localhost:8081/api/chains");
      const chainList: ChainInfo[] = res.data.data.list;
      setChains(chainList);
      if (chainList.length >= 1)
        setFromChainId(chainList[0].chainId.toString());
      if (chainList.length >= 2) setToChainId(chainList[1].chainId.toString());
    } catch (err) {
      console.error("Failed to fetch chains:", err);
    } finally {
      setChainsLoading(false);
    }
  };

  async function handleBridgeButton() {
    if (buttonValue === "Connect Wallet") {
      if (!window.ethereum) {
        alert("We Support Only MetaMask Wallet");
        return;
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setConnectedWallet(accounts[0]);
      setButtonValue("Exchange Now");
    } else if (buttonValue === "Exchange Now") {
      const fromChain = chains.find(
        (c) => c.chainId.toString() === fromChainId,
      );
      if (!fromChain) {
        alert("Selected chain not found");
        return;
      }
      setLoading(true);
      try {
        await bridgeRequest(
          fromChainId,
          toChainId,
          value,
          fromChain.smartContractAddress,
        );
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="h-[500px] p-6 shadow-2xl rounded-2xl bg-linear-to-br from-gray-800 to-black">
      <div className="flex items-center gap-4">
        <h1 className="pl-2 text-4xl text-white slow-font">BridgeNet</h1>
        <img src="/logo/11155111-logo.png" className="w-6 h-6" />
        <img src="/logo/80002-logo.png" className="w-6 h-6" />
        <img src="/logo/binance-smart-chain-bsc.png" className="w-6 h-6" />
      </div>

      <BridgeItem
        direction="From"
        chains={chains}
        chainsLoading={chainsLoading}
        selectedChain={fromChainId}
        onChainChange={setFromChainId}
        value={value}
        onValueChange={setValue}
      />
      <BridgeItem
        direction="To"
        chains={chains}
        chainsLoading={chainsLoading}
        selectedChain={toChainId}
        onChainChange={setToChainId}
        value={value}
        readOnly={true}
      />

      <p className="my-3 text-white slow-font">
        Connected Wallet: {connectedWallet}
      </p>

      <button
        disabled={loading || chainsLoading}
        className="w-full p-3 pb-4 text-lg leading-5 text-black transition-colors bg-white rounded-lg slow-font hover:bg-gray-100 disabled:bg-gray-400 disabled:cursor-not-allowed"
        onClick={handleBridgeButton}
      >
        {loading ? "Processing..." : buttonValue}
      </button>
    </div>
  );
}
