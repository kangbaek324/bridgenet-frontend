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

    useEffect(() => {
        fetchLogs();
    }, [chain, status, page, direction]);

    useEffect(() => {
        if (chain === "all") setDirection("all");
    }, [chain]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (chain !== "all") params.append("chainId", chain);
            if (status !== "all") params.append("status", status);
            if (direction !== "all") params.append("direction", direction);
            params.append("page", page.toString());
            params.append("size", "10");

            const response = await fetch(`http://localhost:8081/api/bridge/requests?${params}`);
            const result = await response.json();
            setData(result.data.content);
            setRawData(result.data);
        } catch (error) {
            console.error("Failed to fetch logs:", error);
        } finally {
            setLoading(false);
        }
    };

    const selectClass = "h-10 p-2 text-sm text-white transition-colors border border-gray-700 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500";

    return (
        <div className="flex flex-col h-full">
            <header className="mb-5">
                <div className="flex gap-3 mb-3">
                    <h1 className="mb-3 text-3xl text-white slow-font">Exchange Log</h1>
                    <div className="flex items-center gap-5 ml-auto">
                        <select value={chain} onChange={(e) => setChain(e.target.value)} className={selectClass}>
                            <option value="all">All Chain</option>
                            <option value="11155111">Sepolia</option>
                            <option value="80002">Amoy</option>
                        </select>
                        {chain !== "all" && (
                            <select value={direction} onChange={(e) => setDirection(e.target.value)} className={selectClass}>
                                <option value="all">Any Direction (To, From)</option>
                                <option value="in">in</option>
                                <option value="out">out</option>
                            </select>
                        )}
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approve">Approved</option>
                            <option value="reject">Rejected</option>
                        </select>
                    </div>
                </div>
                <div className="text-white slow-font">
                    <p>Show {rawData?.totalElements ?? 0} Log, Page {page} of {rawData?.totalPages ?? 1}</p>
                </div>
            </header>

            <main className="flex flex-col gap-2">
                {data.length === 0 && loading ? (
                    <div className="text-white slow-font">Loading...</div>
                ) : (
                    <LogItem data={data} onRowClick={(id) => navigate(`/explore/log/${id}`)} />
                )}
                <div className="absolute flex justify-center gap-3 text-white bottom-2 left-1/2 -translate-x-1/2">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="w-[71px] p-1 px-2 text-sm text-white transition-colors border border-gray-700 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button className="w-[35.5px] p-1 px-2 text-sm text-white transition-colors border border-gray-700 rounded-lg bg-gray-800/50">
                        {page}
                    </button>
                    <button
                        onClick={() => setPage((p) => p + 1)}
                        disabled={rawData?.last}
                        className="w-[71px] p-1 px-2 text-sm text-white transition-colors border border-gray-700 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </main>
        </div>
    );
}
