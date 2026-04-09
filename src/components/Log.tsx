import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogItem from "./LogItem";

export default function Log() {
    const navigate = useNavigate();
    const [chain, setChain]         = useState("all");
    const [status, setStatus]       = useState("all");
    const [direction, setDirection] = useState("all");
    const [page, setPage]           = useState(1);
    const [data, setData]           = useState<any[]>([]);
    const [rawData, setRawData]     = useState<any>(null);
    const [loading, setLoading]     = useState(false);

    useEffect(() => { fetchLogs(); }, [chain, status, page, direction]);
    useEffect(() => { if (chain === "all") setDirection("all"); }, [chain]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (chain !== "all")     params.append("chainId", chain);
            if (status !== "all")    params.append("status", status);
            if (direction !== "all") params.append("direction", direction);
            params.append("page", page.toString());
            params.append("size", "10");
            const res    = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bridge/requests?${params}`);
            const result = await res.json();
            setData(result.data.content);
            setRawData(result.data);
        } catch (e) {
            console.error(e);
            setData([]);
            setRawData(null);
        }
        finally { setLoading(false); }
    };

    const sel = "h-8 px-3 text-xs text-gray-300 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 focus:outline-none focus:border-blue-500/60 transition-colors slow-font";

    return (
        <div className="flex flex-col gap-4">

            {/* ── 섹션 헤더 ── */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:justify-between">
                <div>
                    <h2 className="text-lg text-white slow-font">Latest Bridge Transactions</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                        A total of <span className="text-gray-300">{rawData?.totalElements?.toLocaleString() ?? "—"}</span> transactions found
                    </p>
                </div>
                {/* 필터 */}
                <div className="flex flex-wrap items-center gap-2">
                    <select value={chain} onChange={(e) => { setChain(e.target.value); setPage(1); }} className={sel}>
                        <option value="all">All Chains</option>
                        <option value="11155111">Sepolia</option>
                        <option value="80002">Amoy</option>
                    </select>
                    {chain !== "all" && (
                        <select value={direction} onChange={(e) => setDirection(e.target.value)} className={sel}>
                            <option value="all">Any Direction</option>
                            <option value="in">Inflow</option>
                            <option value="out">Outflow</option>
                        </select>
                    )}
                    <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className={sel}>
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approve">Approved</option>
                        <option value="reject">Rejected</option>
                    </select>
                </div>
            </div>

            {/* ── 테이블 카드 ── */}
            <div className="rounded-xl border border-white/8 overflow-hidden">

                {/* 테이블 헤더 바 */}
                <div className="flex items-center justify-between px-4 py-2 bg-white/3 border-b border-white/8">
                    <span className="text-xs text-gray-500 slow-font">
                        Page <span className="text-gray-400">{page}</span> of <span className="text-gray-400">{rawData?.totalPages ?? 1}</span>
                        {loading && <span className="ml-2 animate-pulse text-gray-600">· syncing...</span>}
                    </span>
                    <div className="flex items-center gap-1">
                        <PagBtn onClick={() => setPage(1)} disabled={page === 1}>«</PagBtn>
                        <PagBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹ Prev</PagBtn>
                        <PagBtn onClick={() => setPage(p => p + 1)} disabled={rawData?.last}>Next ›</PagBtn>
                        <PagBtn onClick={() => setPage(rawData?.totalPages ?? 1)} disabled={rawData?.last}>»</PagBtn>
                    </div>
                </div>

                {data.length === 0 && loading ? (
                    <div className="flex items-center justify-center py-16 text-gray-600">
                        <div className="w-5 h-5 border-2 border-gray-700 border-t-gray-400 rounded-full animate-spin mr-3" />
                        <span className="text-sm slow-font">Loading transactions...</span>
                    </div>
                ) : (
                    <LogItem data={data} onRowClick={(id) => navigate(`/explore/log/${id}`)} />
                )}
            </div>
        </div>
    );
}

function PagBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled: boolean }) {
    return (
        <button
            onClick={onClick} disabled={disabled}
            className="px-2.5 py-1 text-xs text-gray-400 hover:text-white border border-white/8 rounded-md hover:border-white/20 bg-white/3 hover:bg-white/8 disabled:opacity-25 disabled:cursor-not-allowed transition-all slow-font"
        >
            {children}
        </button>
    );
}
