import { useEffect, useState } from "react";
import ContractItem from "./ContractItem";
import axios from "axios";

export default function Contract() {
    const [chainInfo, setChainInfo] = useState([]);

    const fetchContractInfo = async () => {
        try {
            const res = await axios.get("http://localhost:8081/api/chains");
            setChainInfo(res.data.data.list);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchContractInfo();
    }, []);

    return (
        <div className="flex flex-col h-full">
            <header className="mb-5">
                <p className="text-[10px] font-mono text-gray-600 tracking-widest uppercase mb-0.5">EXPLORE /</p>
                <h1 className="text-2xl text-white slow-font">Contract</h1>
                <p className="mt-1 text-[11px] font-mono text-gray-600">Smart contracts used in bridge</p>
            </header>
            <main className="grid grid-cols-2 gap-3 content-start overflow-y-auto scrollbar-hide" style={{ maxHeight: 560 }}>
                {chainInfo.map((chain, index) => (
                    <ContractItem key={index} chainInfo={chain} />
                ))}
            </main>
        </div>
    );
}
