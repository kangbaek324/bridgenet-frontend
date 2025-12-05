import { useEffect, useState } from "react";
import ContractItem from "./ContractItem";
import axios from "axios";

export default function Contract() {
    const [chainInfo, setChainInfo] = useState([]);

    const fetchContractInfo = async () => {
        try {
            const res = await axios.get("http://localhost:8081/api/bridge/chain")
            setChainInfo(res.data.data.list);
            console.log(chainInfo);
        } catch(err) {

        } finally {

        }
    }

    useEffect(() => {
        fetchContractInfo();
    }, []);

    return (
        <div className="flex flex-col h-full">
            <header className="mb-5">
                <div className="flex gap-3 mb-3">
                    <h1 className="mb-3 text-3xl text-white slow-font">Contract</h1>
                </div>
                <div className="text-white slow-font">
                    <p>Can use Contract On Bridge</p>
                </div>
            </header>
            <main className="grid grid-cols-2 gap-4 h-[574px] content-start overflow-y-auto scrollbar-hide">
                {chainInfo.map((chain, index) => (
                    <ContractItem
                        key={index}
                        chainInfo={chain}
                    />
                ))}
            </main>
        </div>
    );
}