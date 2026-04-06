import axios from "axios";
import { formatEther } from "ethers";
import { useState } from "react";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3 py-2.5 border-b border-gray-700/40 last:border-0">
            <span className="w-32 shrink-0 text-xs text-gray-500 slow-font pt-0.5">{label}</span>
            <div className="flex-1 text-xs text-white slow-font break-all">{children}</div>
        </div>
    );
}

const statusColor: Record<string, string> = {
    ACTIVATE:   "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    DEACTIVATE: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
    PROCESSING: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    ERROR:      "bg-red-500/20 text-red-400 border border-red-500/30",
};

export default function ContractItem({ chainInfo }) {
    const [loading, setLoading] = useState(false);
    const [fetchStatus, setFetchStatus] = useState("");
    const [hash, setHash] = useState("");

    const fetchRequestWhiteList = async (chainId: string) => {
        setFetchStatus(""); setHash(""); setLoading(true);
        if (!localStorage.getItem("accessToken")) { alert("Please Login in My page"); setLoading(false); return; }
        try {
            const res = await axios.post(
                `http://localhost:8081/api/chains/${chainId}/contract/whitelist`, {},
                { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
            );
            setHash(res.data.data.transactionHash);
            setFetchStatus("success");
        } catch (e) { console.error(e); setFetchStatus("fail"); }
        finally { setLoading(false); }
    };

    const fetchContractBalance = async (chainId: string) => {
        setFetchStatus(""); setHash(""); setLoading(true);
        try {
            await axios.get(`http://localhost:8081/api/chains/${chainId}/contract/balance`);
            setFetchStatus("success");
        } catch (e) { console.error(e); setFetchStatus("fail"); }
        finally { setLoading(false); }
    };

    return (
        <div className="rounded-xl border border-gray-700/60 bg-gray-900/40 overflow-hidden">
            {/* 카드 헤더 */}
            <div className="flex items-center gap-2.5 px-4 py-3 bg-gray-800/40 border-b border-gray-700/60">
                <img
                    src={`/logo/${chainInfo.chainId}-logo.png`}
                    className="w-5 h-5 rounded-full"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                <span className="text-sm text-white slow-font flex-1">{chainInfo.chainName}</span>
                <span className={`px-2 py-0.5 rounded text-[11px] slow-font ${statusColor[chainInfo.chainStatus] ?? "text-gray-400"}`}>
                    {chainInfo.chainStatus}
                </span>
            </div>

            {/* 상세 rows */}
            <div className="px-4 py-1">
                <Row label="Contract Address">
                    <span className="font-mono text-gray-300">{chainInfo.smartContractAddress}</span>
                </Row>
                <Row label="Balance">
                    <span className="text-emerald-400">{formatEther(chainInfo.smartContractValue.toString())}</span>
                    <span className="text-gray-500 ml-1.5">{chainInfo.unit}</span>
                </Row>
                {fetchStatus === "success" && (
                    <Row label="Result">
                        <span className="text-emerald-400">{hash ? `Tx: ${hash}` : "Success"}</span>
                    </Row>
                )}
                {fetchStatus === "fail" && (
                    <Row label="Result">
                        <span className="text-red-400">Request failed. Check console.</span>
                    </Row>
                )}
            </div>

            {/* 버튼 */}
            <div className="flex gap-2 px-4 pb-4">
                <button
                    onClick={() => fetchRequestWhiteList(chainInfo.chainId)}
                    disabled={loading}
                    className="flex-1 py-2 text-xs slow-font text-blue-400 bg-blue-500/10 border border-blue-500/30 rounded-lg hover:bg-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? "Processing..." : "Request Whitelist"}
                </button>
                <button
                    onClick={() => fetchContractBalance(chainInfo.chainId)}
                    disabled={loading}
                    className="flex-1 py-2 text-xs slow-font text-gray-400 bg-gray-700/30 border border-gray-700 rounded-lg hover:bg-gray-700/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? "Processing..." : "Refresh Balance"}
                </button>
            </div>
        </div>
    );
}
