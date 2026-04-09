import axios from "axios";
import { formatEther } from "ethers";
import { useState, useEffect } from "react";

const statusStyle: Record<string, { dot: string; text: string }> = {
    ACTIVATE:   { dot: "bg-emerald-400", text: "text-emerald-400" },
    DEACTIVATE: { dot: "bg-gray-500",    text: "text-gray-500"    },
    PROCESSING: { dot: "bg-blue-400 animate-pulse", text: "text-blue-400" },
    ERROR:      { dot: "bg-red-400",     text: "text-red-400"     },
};

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0">
            <span className="w-28 shrink-0 text-xs text-gray-500 slow-font pt-px">{label}</span>
            <div className="flex-1 min-w-0 text-xs text-gray-200 slow-font">{children}</div>
        </div>
    );
}

export default function ContractItem({ chainInfo }: { chainInfo: any }) {
    const [loading, setLoading]           = useState(false);
    const [result, setResult]             = useState<{ ok: boolean; msg: string } | null>(null);
    const [isWhitelisted, setIsWhitelisted] = useState<boolean | null>(null);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/chains/${chainInfo.chainId}/contract/whitelist`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        })
            .then(res => setIsWhitelisted(res.data.data.whiteList ?? false))
            .catch(() => setIsWhitelisted(false));
    }, [chainInfo.chainId]);

    const doWhitelist = async () => {
        setResult(null); setLoading(true);
        if (!localStorage.getItem("accessToken")) { alert("Please login first."); setLoading(false); return; }
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/chains/${chainInfo.chainId}/contract/whitelist`, {},
                { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
            );
            setIsWhitelisted(true);
            setResult({ ok: true, msg: res.data.data.transactionHash });
        } catch { setResult({ ok: false, msg: "Request failed. Check console." }); }
        finally { setLoading(false); }
    };

    const doRefresh = async () => {
        setResult(null); setLoading(true);
        try {
            await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/chains/${chainInfo.chainId}/contract/balance`);
            setResult({ ok: true, msg: "Balance refreshed." });
        } catch { setResult({ ok: false, msg: "Request failed." }); }
        finally { setLoading(false); }
    };

    const s = statusStyle[chainInfo.chainStatus] ?? { dot: "bg-gray-500", text: "text-gray-400" };

    return (
        <div className="rounded-xl border border-white/8 overflow-hidden bg-white/2">
            {/* 카드 헤더 */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white/3 border-b border-white/8">
                <img src={`/logo/${chainInfo.chainId}-logo.png`} className="w-5 h-5 rounded-full"
                     onError={(e) => { e.currentTarget.style.display = "none"; }} />
                <span className="text-sm text-white slow-font flex-1">{chainInfo.chainName}</span>
                <span className={`flex items-center gap-1.5 text-xs slow-font ${s.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    {chainInfo.chainStatus}
                </span>
            </div>

            {/* 정보 rows */}
            <div className="px-4 py-1">
                <InfoRow label="Contract Address">
                    <span className="font-mono break-all text-gray-300">{chainInfo.smartContractAddress}</span>
                </InfoRow>
                <InfoRow label="Balance">
                    <span className="font-mono text-emerald-400">{formatEther(chainInfo.smartContractValue.toString())}</span>
                    <span className="text-gray-500 ml-1.5">{chainInfo.unit}</span>
                </InfoRow>
                <InfoRow label="Whitelist">
                    {isWhitelisted === null ? (
                        <span className="text-gray-600 slow-font">Checking...</span>
                    ) : isWhitelisted ? (
                        <span className="flex items-center gap-1.5 text-emerald-400 slow-font">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                            Registered
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5 text-gray-500 slow-font">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-600 inline-block" />
                            Not registered
                        </span>
                    )}
                </InfoRow>
                {result && (
                    <InfoRow label="Result">
                        <span className={`font-mono break-all ${result.ok ? "text-emerald-400" : "text-red-400"}`}>
                            {result.msg}
                        </span>
                    </InfoRow>
                )}
            </div>

            {/* 버튼 */}
            <div className="flex gap-2 px-4 py-3 bg-white/2 border-t border-white/5">
                <button
                    onClick={doWhitelist}
                    disabled={loading || isWhitelisted === true}
                    title={isWhitelisted ? "Already whitelisted" : undefined}
                    className="flex-1 py-2 text-xs slow-font border rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed
                        text-blue-400 border-blue-500/30 hover:bg-blue-500/10
                        disabled:text-gray-500 disabled:border-white/10"
                >
                    {loading ? "Processing..." : isWhitelisted ? "Already Whitelisted" : "Request Whitelist"}
                </button>
                <button onClick={doRefresh} disabled={loading}
                    className="flex-1 py-2 text-xs slow-font text-gray-400 border border-white/10 rounded-lg hover:bg-white/8 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    {loading ? "Processing..." : "Refresh Balance"}
                </button>
            </div>
        </div>
    );
}
