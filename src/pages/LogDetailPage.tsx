import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatEther } from "ethers";

const approveColor: Record<string, string> = {
    APPROVE: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    REJECT:  "bg-red-500/20 text-red-400 border border-red-500/30",
    PENDING: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
};
const bridgeColor: Record<string, string> = {
    COMPLETED:   "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    FAILED:      "bg-red-500/20 text-red-400 border border-red-500/30",
    IN_PROGRESS: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    PENDING:     "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
};
const txStatusColor: Record<string, string> = {
    CONFIRMED: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    DROPPED:   "bg-red-500/20 text-red-400 border border-red-500/30",
    PENDING:   "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
};

// key-value 한 행
function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start gap-4 py-3 border-b border-gray-700/40 last:border-0">
            <span className="w-40 shrink-0 text-sm text-gray-500 slow-font">{label}</span>
            <div className="flex-1 text-sm text-white slow-font">{children}</div>
        </div>
    );
}

export default function LogDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [detail, setDetail] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:8081/api/bridge/request/${id}`)
            .then((r) => r.json())
            .then((r) => setDetail(r.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-gray-700 to-gray-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 rounded-full border-slate-600 border-t-white animate-spin" />
                    <p className="text-white slow-font">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-gray-700 to-gray-900">
            {/* nav */}
            <div className="flex gap-10 mb-4 w-5xl px-5 text-white slow-font">
                <p
                    className="mr-auto transition-colors cursor-pointer text-slate-600 hover:text-white"
                    onClick={() => navigate("/explore")}
                >
                    BACK TO EXPLORE
                </p>
            </div>

            {/* 카드 — w-5xl h-[700px] 동일 */}
            <div className="h-[700px] w-5xl p-6 shadow-2xl rounded-2xl bg-linear-to-br from-gray-800 to-black overflow-y-auto scrollbar-hide">
                {detail ? (
                    <div className="flex flex-col gap-5">

                        {/* ── 타이틀 ── */}
                        <div className="pb-4 border-b border-gray-700/60">
                            <h1 className="text-3xl text-white slow-font">Bridge Request</h1>
                            <p className="text-gray-500 slow-font text-sm mt-1">Request ID: #{detail.id}</p>
                        </div>

                        {/* ── 섹션 1: 개요 ── */}
                        <div className="rounded-xl bg-gray-900/50 border border-gray-700/50 px-5 py-1">
                            <Row label="Approve Status">
                                <span className={`px-2.5 py-0.5 rounded-md text-xs ${approveColor[detail.approveStatus] ?? "text-gray-400"}`}>
                                    {detail.approveStatus}
                                </span>
                            </Row>
                            <Row label="Bridge Status">
                                <span className={`px-2.5 py-0.5 rounded-md text-xs ${bridgeColor[detail.bridgeStatus] ?? "text-gray-400"}`}>
                                    {detail.bridgeStatus}
                                </span>
                            </Row>
                            <Row label="Created At">
                                {new Date(detail.createdAt).toLocaleString("en-US", {
                                    year: "numeric", month: "short", day: "numeric",
                                    hour: "2-digit", minute: "2-digit", second: "2-digit",
                                })}
                            </Row>
                        </div>

                        {/* ── 섹션 2: From ── */}
                        <div className="rounded-xl bg-gray-900/50 border border-gray-700/50 px-5 py-1">
                            <div className="py-3 border-b border-gray-700/40">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={`/logo/${detail.from.chain.chainId}-logo.png`}
                                        className="w-5 h-5 rounded-full"
                                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                                    />
                                    <span className="text-base text-blue-400 slow-font">From Chain</span>
                                </div>
                            </div>
                            <Row label="Chain Name">{detail.from.chain.chainName}</Row>
                            <Row label="Chain ID">{detail.from.chain.chainId}</Row>
                            <Row label="Send Amount">
                                <span className="text-emerald-400">{formatEther(detail.from.chain.value.toString())}</span>
                                <span className="text-gray-400 ml-2">{detail.from.chain.unit}</span>
                            </Row>
                            <Row label="Transactions">
                                {detail.from.tx.length === 0 ? (
                                    <span className="text-gray-600 italic">No transactions yet</span>
                                ) : (
                                    <div className="flex flex-col gap-2 w-full">
                                        {detail.from.tx.map((tx: any, i: number) => (
                                            <div key={i} className="rounded-lg bg-gray-800/60 border border-gray-700/40 px-4 py-3 flex flex-col gap-1">
                                                <div className="flex items-center justify-between gap-3">
                                                    <span className="text-xs text-gray-500 slow-font shrink-0">Tx Hash</span>
                                                    <span className="font-mono text-xs text-gray-300 truncate" title={tx.hash}>{tx.hash ?? "—"}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-500 slow-font">Block</span>
                                                    <span className="font-mono text-xs text-gray-300">{tx.processedBlock ?? "—"}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-500 slow-font">Status</span>
                                                    <span className={`px-2 py-0.5 rounded text-[11px] ${txStatusColor[tx.status] ?? "text-gray-400"}`}>{tx.status}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Row>
                        </div>

                        {/* ── 화살표 ── */}
                        <div className="flex items-center justify-center gap-3">
                            <div className="h-px flex-1 bg-gray-700/60" />
                            <span className="text-gray-500 slow-font text-sm px-3">↓ Bridge</span>
                            <div className="h-px flex-1 bg-gray-700/60" />
                        </div>

                        {/* ── 섹션 3: To ── */}
                        <div className="rounded-xl bg-gray-900/50 border border-gray-700/50 px-5 py-1">
                            <div className="py-3 border-b border-gray-700/40">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={`/logo/${detail.to.chain.chainId}-logo.png`}
                                        className="w-5 h-5 rounded-full"
                                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                                    />
                                    <span className="text-base text-purple-400 slow-font">To Chain</span>
                                </div>
                            </div>
                            <Row label="Chain Name">{detail.to.chain.chainName}</Row>
                            <Row label="Chain ID">{detail.to.chain.chainId}</Row>
                            <Row label="Receive Amount">
                                <span className="text-emerald-400">{formatEther(detail.to.chain.value.toString())}</span>
                                <span className="text-gray-400 ml-2">{detail.to.chain.unit}</span>
                            </Row>
                            <Row label="Transactions">
                                {detail.to.tx.length === 0 ? (
                                    <span className="text-gray-600 italic">No transactions yet</span>
                                ) : (
                                    <div className="flex flex-col gap-2 w-full">
                                        {detail.to.tx.map((tx: any, i: number) => (
                                            <div key={i} className="rounded-lg bg-gray-800/60 border border-gray-700/40 px-4 py-3 flex flex-col gap-1">
                                                <div className="flex items-center justify-between gap-3">
                                                    <span className="text-xs text-gray-500 slow-font shrink-0">Tx Hash</span>
                                                    <span className="font-mono text-xs text-gray-300 truncate" title={tx.hash}>{tx.hash ?? "—"}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-500 slow-font">Block</span>
                                                    <span className="font-mono text-xs text-gray-300">{tx.processedBlock ?? "—"}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-500 slow-font">Status</span>
                                                    <span className={`px-2 py-0.5 rounded text-[11px] ${txStatusColor[tx.status] ?? "text-gray-400"}`}>{tx.status}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Row>
                        </div>

                    </div>
                ) : (
                    <p className="text-gray-500 slow-font">Request not found.</p>
                )}
            </div>
        </div>
    );
}
