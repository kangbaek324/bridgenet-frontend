import { useEffect, useState } from "react";
import RankingItem from "./RankingItem";
import axios from "axios";

export default function Ranking() {
    const [data, setData] = useState<any[]>([]);
    const [sort, setSort] = useState("in");
    const [loading, setLoading] = useState(false);

    const fetchRanking = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:8081/api/chains/ranking?sort=${sort}`);
            setData(res.data.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRanking(); }, [sort]);

    return (
        <div className="flex flex-col h-full">
            {/* ── 헤더 ── */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl text-white slow-font">Chain Ranking</h1>
                    <p className="text-sm text-gray-500 slow-font mt-0.5">
                        Ranked by total bridging value · {sort === "in" ? "Inflow" : "Outflow"}
                    </p>
                </div>
                <div className="flex items-center gap-1 bg-gray-800/60 border border-gray-700 rounded-lg p-1">
                    {(["in", "out"] as const).map((v) => (
                        <button
                            key={v}
                            onClick={() => setSort(v)}
                            className={`px-4 py-1.5 text-sm slow-font rounded-md transition-colors ${
                                sort === v
                                    ? "bg-gray-600 text-white"
                                    : "text-gray-500 hover:text-gray-300"
                            }`}
                        >
                            {v === "in" ? "Inflow" : "Outflow"}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── 테이블 ── */}
            <div className="rounded-xl border border-gray-700/60 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-800/30 text-left border-b border-gray-700/60">
                            <th className="px-4 py-3 text-xs font-semibold text-gray-500 slow-font w-16">Rank</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-500 slow-font">Chain</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-500 slow-font text-right">Total Value</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-500 slow-font w-20">Unit</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/40">
                        {data.length === 0 && loading ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-10 text-center text-sm text-gray-600 slow-font">
                                    Loading...
                                </td>
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
        </div>
    );
}
