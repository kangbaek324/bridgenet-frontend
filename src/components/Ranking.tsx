import { useEffect, useState } from "react";
import RankingItem from "./RankingItem";
import axios from "axios";

export default function Ranking() {
    const [data, setData]       = useState<any[]>([]);
    const [sort, setSort]       = useState("in");
    const [loading, setLoading] = useState(false);

    const fetchRanking = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/chains/ranking?sort=${sort}`);
            setData(res.data.data);
        } catch (e) {
            console.error(e);
            setData([]);
        }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchRanking(); }, [sort]);

    return (
        <div className="flex flex-col gap-4">
            {/* 섹션 헤더 */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-lg text-white slow-font">Chain Ranking</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Ranked by total bridging value · {sort === "in" ? "Inflow" : "Outflow"}
                    </p>
                </div>
                {/* 토글 */}
                <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-1 gap-1">
                    {(["in", "out"] as const).map((v) => (
                        <button key={v} onClick={() => setSort(v)}
                            className={`px-4 py-1.5 text-xs slow-font rounded-md transition-colors ${
                                sort === v ? "bg-white/15 text-white" : "text-gray-500 hover:text-gray-300"
                            }`}>
                            {v === "in" ? "Inflow" : "Outflow"}
                        </button>
                    ))}
                </div>
            </div>

            {/* 테이블 */}
            <div className="rounded-xl border border-white/8 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="text-left border-b border-white/5 bg-white/2">
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 slow-font w-20">Rank</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 slow-font">Chain</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 slow-font text-right">Total Value</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 slow-font w-24">Unit</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/4">
                        {data.length === 0 && loading ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-12 text-center text-sm text-gray-600 slow-font">
                                    Loading...
                                </td>
                            </tr>
                        ) : (
                            data.map((item, i) => (
                                <RankingItem key={i} ranking={i + 1}
                                    imageUrl={`/logo/${item.chainId}-logo.png`}
                                    value={item.value} unit={item.unit} chainName={item.chainName} />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
