import { useState, useEffect, useCallback } from "react";
import BridgeItem from "./BridgeItem";
import { bridgeRequest } from "../api/bridgeRequest";
import axios from "axios";

interface ChainInfo {
  chainId: number;
  chainName: string;
  smartContractAddress: string;
  unit: string;
}

interface Toast {
  type: "success" | "error";
  message: string;
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
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback((type: Toast["type"], message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  }, []);

  useEffect(() => {
    fetchChains();
  }, []);

  const fetchChains = async () => {
    setChainsLoading(true);
    try {
      const res = await axios.get("http://localhost:8081/api/chains");
      const chainList: ChainInfo[] = res.data.data.list;
      setChains(chainList);
      if (chainList.length >= 1) setFromChainId(chainList[0].chainId.toString());
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
        showToast("error", "MetaMask is not installed. Please install MetaMask to continue.");
        return;
      }
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setConnectedWallet(accounts[0]);
      setButtonValue("Exchange Now");
      return;
    }

    const fromChain = chains.find((c) => c.chainId.toString() === fromChainId);
    if (!fromChain) {
      showToast("error", "Selected chain not found.");
      return;
    }
    if (!toChainId) {
      showToast("error", "Please select a destination chain.");
      return;
    }
    if (!value || isNaN(Number(value)) || Number(value) <= 0) {
      showToast("error", "Please enter a valid amount.");
      return;
    }

    setLoading(true);
    try {
      await bridgeRequest(fromChainId, toChainId, value, fromChain.smartContractAddress);
      showToast("success", "Transaction submitted successfully!");
    } catch (err: any) {
      showToast("error", err.message ?? "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative h-[500px] p-6 shadow-2xl rounded-2xl bg-linear-to-br from-gray-800 to-black">

      {/* Toast */}
      {toast && (
        <div
          className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-start gap-3 w-[90%] max-w-sm px-4 py-3 rounded-xl shadow-xl border text-sm slow-font transition-all
            ${toast.type === "success"
              ? "bg-emerald-950 border-emerald-500/40 text-emerald-300"
              : "bg-red-950 border-red-500/40 text-red-300"
            }`}
        >
          <span className="mt-0.5 shrink-0">
            {toast.type === "success" ? (
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </span>
          <span className="flex-1 leading-snug">{toast.message}</span>
          <button onClick={() => setToast(null)} className="shrink-0 text-current opacity-50 hover:opacity-100 transition-opacity">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

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
