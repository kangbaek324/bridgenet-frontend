import { useEffect, useState } from "react";
import ContractItem from "./ContractItem";
import axios from "axios";

export default function Contract() {
    const [chainInfo, setChainInfo] = useState<any[]>([]);

    const fetchChains = () => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/chains`)
            .then(res => setChainInfo(res.data.data.list))
            .catch(() => setChainInfo([]));
    };

    useEffect(() => { fetchChains(); }, []);

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h2 className="text-lg text-white slow-font">Smart Contracts</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                    Contracts deployed for the bridge service ·{" "}
                    <span className="text-gray-300">{chainInfo.length}</span> chains
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {chainInfo.map((chain, i) => (
                    <ContractItem key={i} chainInfo={chain} onRefresh={fetchChains} />
                ))}
            </div>
        </div>
    );
}
