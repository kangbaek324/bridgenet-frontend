import { useEffect, useState } from "react";
import ContractItem from "./ContractItem";
import axios from "axios";

export default function Contract() {
    const [chainInfo, setChainInfo] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8081/api/chains")
            .then(res => setChainInfo(res.data.data.list))
            .catch(console.error);
    }, []);

    return (
        <div className="flex flex-col h-full">
            {/* ── 헤더 ── */}
            <div className="mb-4">
                <h1 className="text-2xl text-white slow-font">Smart Contracts</h1>
                <p className="text-sm text-gray-500 slow-font mt-0.5">
                    Contracts deployed for the bridge service · <span className="text-white">{chainInfo.length}</span> chains
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 overflow-y-auto scrollbar-hide" style={{ maxHeight: 560 }}>
                {chainInfo.map((chain, index) => (
                    <ContractItem key={index} chainInfo={chain} />
                ))}
            </div>
        </div>
    );
}
