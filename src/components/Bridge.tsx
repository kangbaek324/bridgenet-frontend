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
            await bridgeRequest(fromChain, toChain, value);
        }
    }

    return (
         <div className="w-full shadow-2xl rounded-2xl p-6 bg-linear-to-br from-gray-800 to-black">
            <div className="flex items-end gap-4">
                <h1 className="pl-2 text-4xl slow-font text-white">BridgeNet</h1>
                <img src="/logo/ethereum.png" className="w-6 h-6" />
                <img src="/logo/polygon.png" className="w-6 h-6" />
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

            <p className="slow-font text-white my-3">Connected Wallet: {connectedWallet}</p>

            <button 
                disabled={loading}
                className="p-3 rounded-lg w-full bg-white text-black slow-font text-lg leading-5 pb-4 hover:bg-gray-100 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleBridgeButton}
            >
                {loading ? "Processing..." : buttonValue}
            </button>
        </div>
    );
}