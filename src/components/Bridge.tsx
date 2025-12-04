import { useState } from "react";
import BridgeItem from "./BridgeItem";
import { bridgeRequest } from "../api/bridgeRequest";

export default function Bridge() {
    const [fromChain, setFromChain] = useState("11155111");
    const [toChain, setToChain] = useState("80002");
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState("");
    const [connectedWallet, setConnectedWallet] = useState<string>("");
    const [buttonValue, setButtonValue] = useState("Connect Wallet");

    async function handleBridgeButton() {
        if (buttonValue === "Connect Wallet") {
            if (!window.ethereum) {
                alert("We Support Only MetaMask Wallet");
                return;
            }

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setConnectedWallet(accounts[0]);
            setButtonValue("Exchange Now")
        }
        else if (buttonValue === "Exchange Now") {
            setLoading(true);
            try {
                await bridgeRequest(fromChain, toChain, value);
            } finally {
                setLoading(false);
            }
        }
    }

    return (
         <div className="h-[500px] p-6 shadow-2xl rounded-2xl bg-linear-to-br from-gray-800 to-black">
            <div className="flex items-end gap-4">
                <h1 className="pl-2 text-4xl text-white slow-font">BridgeNet</h1>
                <img src="/logo/11155111-logo.png" className="w-6 h-6" />
                <img src="/logo/80002-logo.png" className="w-6 h-6" />
                <img src="/logo/binance-smart-chain-bsc.png" className="w-6 h-6" />
            </div>

            <BridgeItem 
                direction="From"
                selectedChain={fromChain}
                onChainChange={setFromChain}
                value={value}
                onValueChange={setValue}
            />
            <BridgeItem
                direction="To"
                selectedChain={toChain}
                onChainChange={setToChain}
                value={value}
                readOnly={true}
            />

            <p className="my-3 text-white slow-font">Connected Wallet: {connectedWallet}</p>

            <button 
                disabled={loading}
                className="w-full p-3 pb-4 text-lg leading-5 text-black transition-colors bg-white rounded-lg slow-font hover:bg-gray-100 disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleBridgeButton}
            >
                {loading ? "Processing..." : buttonValue}
            </button>
        </div>
    );
}