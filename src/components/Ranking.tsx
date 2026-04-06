import { useEffect, useState } from "react";
import RankingItem from "./RankingItem";
import axios from "axios";

export default function Ranking() {
    const [data, setData] = useState<any[]>([]);
    const [sort, setSort] = useState('in');
    const [loading, setLoading] = useState(false);

    const fetchRanking = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append("sort", sort);
            const res = await axios.get(`http://localhost:8081/api/chains/ranking?${params}`);
            setData(res.data.data);
        } catch (error) {
            console.error("Failed to fetch ranking:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRanking();
    }, [sort]);

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
                    <table className="w-full">
                        <thead>
                            <tr className="text-xs font-semibold text-left text-gray-400 slow-font border-b border-gray-700">
                                <th className="py-3 px-6">Ranking</th>
                                <th className="py-3 px-6">Chain</th>
                                <th className="py-3 px-6">Value</th>
                                <th className="py-3 px-6">Unit</th>
                            </tr>
                        </thead>
                        <tbody className="text-center text-white">
                            {data.length === 0 && loading ? (
                                <tr>
                                    <td colSpan={4} className="py-4">Loading...</td>
                                </tr>
                            ) : (
                                data.map((item, index) => (
                                    <RankingItem
                                        key={index}
                                        ranking={index + 1}
                                        imageUrl={`/logo/${item.chainId}-logo.png`}
                                        value={item.value}
                                        unit={item.unit}
                                        chainName={item.chainName}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
