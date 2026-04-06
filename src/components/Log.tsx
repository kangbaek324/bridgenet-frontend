import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogItem from "./LogItem";

export default function Log() {
    const navigate = useNavigate();
    const [chain, setChain] = useState("all");
    const [status, setStatus] = useState("all");
    const [direction, setDirection] = useState("all");
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [rawData, setRawData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => { fetchLogs(); }, [chain, status, page, direction]);
    useEffect(() => { if (chain === "all") setDirection("all"); }, [chain]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (chain !== "all") params.append("chainId", chain);
            if (status !== "all") params.append("status", status);
            if (direction !== "all") params.append("direction", direction);
            params.append("page", page.toString());
            params.append("size", "10");
            const res = await fetch(`http://localhost:8081/api/bridge/requests?${params}`);
            const result = await res.json();
            setData(result.data.content);
            setRawData(result.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const selectClass = "h-9 px-3 text-sm text-white bg-gray-800/80 border border-gray-600 rounded-lg hover:border-gray-500 focus:outline-none focus:border-blue-500 transition-colors";

    return (
        <div className="flex flex-col h-full">
            {/* ── 헤더 ── */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl text-white slow-font">Exchange Transactions</h1>
                    <p className="text-sm text-gray-500 slow-font mt-0.5">
                        A total of <span className="text-white">{rawData?.totalElements ?? "—"}</span> transactions found
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <select value={chain} onChange={(e) => { setChain(e.target.value); setPage(1); }} className={selectClass}>
                        <option value="all">All Chains</option>
                        <option value="11155111">Sepolia</option>
                        <option value="80002">Amoy</option>
                    </select>
                    {chain !== "all" && (
                        <select value={direction} onChange={(e) => setDirection(e.target.value)} className={selectClass}>
                            <option value="all">Any Direction</option>
                            <option value="in">Inflow</option>
                            <option value="out">Outflow</option>
                        </select>
                    )}
                    <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className={selectClass}>
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approve">Approved</option>
                        <option value="reject">Rejected</option>
                    </select>
                </div>
            </div>

            {/* ── 테이블 영역 ── */}
            <div className="flex-1 rounded-xl border border-gray-700/60 overflow-hidden">
                {/* 테이블 상단 바 */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-gray-800/40 border-b border-gray-700/60">
                    <span className="text-xs text-gray-500 slow-font">
                        Page <span className="text-gray-300">{page}</span> of <span className="text-gray-300">{rawData?.totalPages ?? 1}</span>
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setPage(1)} disabled={page === 1}
                            className="px-2 py-1 text-xs text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >«</button>
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                            className="px-2 py-1 text-xs text-gray-400 hover:text-white border border-gray-700 rounded hover:border-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >‹ Prev</button>
                        <button
                            onClick={() => setPage(p => p + 1)} disabled={rawData?.last}
                            className="px-2 py-1 text-xs text-gray-400 hover:text-white border border-gray-700 rounded hover:border-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >Next ›</button>
                        <button
                            onClick={() => setPage(rawData?.totalPages ?? 1)} disabled={rawData?.last}
                            className="px-2 py-1 text-xs text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >»</button>
                    </div>
                </div>

                {/* 테이블 */}
                {data.length === 0 && loading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="flex items-center gap-3 text-gray-500">
                            <div className="w-4 h-4 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin" />
                            <span className="text-sm slow-font">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <LogItem data={data} onRowClick={(id) => navigate(`/explore/log/${id}`)} />
                )}
            </div>
        </div>
    );
}
