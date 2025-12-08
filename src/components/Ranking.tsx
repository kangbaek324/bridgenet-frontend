import { useEffect, useState } from "react";
import RankingItem from "./RankingItem";
import axios from "axios";

export default function Ranking() {
    const [data, setData] = useState([]);
    const [sort, setSort] = useState('in');
    const [loading, setLoading] = useState(false);

    const fetchRanking = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append("sort", sort);
            
            const res = await axios.get(`http://localhost:8081/api/bridge/chain/ranking?${params}`);
            setData(res.data.data);
        } catch (error) {
            console.error("Failed to fetch ranking:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRanking();
    }, [sort])

    return (
        <div className="flex flex-col h-full">
            <header className="mb-5">
                <div className="flex gap-3 mb-3">
                    <h1 className="mb-3 text-3xl text-white slow-font">Ranking</h1>
                    <div className="flex items-center gap-5 ml-auto">
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="h-10 p-2 text-sm text-white transition-colors border border-gray-700 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="in">in</option>
                            <option value="out">out</option>
                        </select>
                    </div>
                </div>
                <div className="text-white slow-font">
                    <p>Total Bridging Value Ranking</p>
                </div>
            </header>
            <main className="flex flex-col gap-2 h-[574px]">
                <div className="overflow-hidden border border-gray-700 rounded-lg h-[500px]">
                    <table className="">
                        <thead>
                            <tr className="text-xs font-semibold text-left text-gray-400 slow-font">
                                <th className="py-3 px-15">Ranking</th>
                                <th className="py-3 px-15">Chain</th>
                                <th className="py-3 px-30">Value</th>
                                <th className="py-3 px-15">Unit</th>
                                <th className="px-20 py-3">Exchange Rate</th>
                            </tr>
                        </thead>
                            <tbody className="text-center text-white">
                                {data.length === 0 && loading ? (
                                    <tr>
                                        <td colSpan={6} className="py-4">Loading...</td>
                                    </tr>
                                ) : (
                                    data.map((item, index) => (
                                        <RankingItem 
                                            key={index}
                                            ranking={index + 1} 
                                            imageUrl={`/logo/${item.chain_id}-logo.png`} 
                                            value={item.value}
                                            unit={item.unit}
                                            chainName={item.chain_name}
                                            exchangeRate={""}
                                        />
                                    ))
                                )}
                            </tbody>
                    </table>
                </div>
                <div className="flex justify-center gap-3 mt-3 text-white">                  
                    <button className="w-[71px] p-1 px-2 text-sm text-white transition-colors border border-gray-700 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500">Previous</button>
                    <button className="w-[35.5px] p-1 px-2 text-sm text-white transition-colors border border-gray-700 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500">1</button>
                    <button className="w-[71px] p-1 px-2 text-sm text-white transition-colors border border-gray-700 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500">Next</button>
                </div>
            </main>
        </div>
    );
}