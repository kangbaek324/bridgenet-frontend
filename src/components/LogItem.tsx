import { formatEther } from "ethers";

interface LogItemProps {
    data: any[];
    onRowClick: (id: number) => void;
}

const approveDot: Record<string, string> = {
    APPROVE: "bg-emerald-400",
    REJECT:  "bg-red-400",
    PENDING: "bg-amber-400",
};
const bridgeDot: Record<string, string> = {
    COMPLETED:   "bg-emerald-400",
    FAILED:      "bg-red-400",
    IN_PROGRESS: "bg-blue-400",
    PENDING:     "bg-amber-400",
};

function StatusDot({ color, label }: { color: string; label: string }) {
    return (
        <span className="flex items-center gap-1.5">
            <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${color}`} />
            <span className="text-xs text-gray-300 slow-font">{label}</span>
        </span>
    );
}

function ChainCell({ chainId, chainName }: { chainId: number; chainName: string }) {
    return (
        <div className="flex items-center gap-1.5">
            <img src={`/logo/${chainId}-logo.png`} className="w-4 h-4 rounded-full"
                 onError={(e) => { e.currentTarget.style.display = "none"; }} />
            <span className="text-xs text-gray-300 slow-font">{chainName}</span>
        </div>
    );
}

export default function LogItem({ data, onRowClick }: LogItemProps) {
    if (data.length === 0) {
        return (
            <div className="px-4 py-12 text-center text-sm text-gray-600 slow-font">
                No transactions found
            </div>
        );
    }

    return (
        <>
            {/* ── 데스크톱 테이블 ── */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left border-b border-white/5 bg-white/2">
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 slow-font w-20">Txn #</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 slow-font">From</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 slow-font">Send</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 slow-font w-8 text-center">→</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 slow-font">To</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 slow-font">Receive</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 slow-font">Approve</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 slow-font">Bridge</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 slow-font text-right">Age</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/4">
                        {data.map((item, i) => (
                            <tr key={i} onClick={() => onRowClick(item.id)}
                                className="hover:bg-white/4 cursor-pointer transition-colors group">
                                <td className="px-4 py-3">
                                    <span className="font-mono text-xs text-blue-400 group-hover:text-blue-300 transition-colors">#{item.id}</span>
                                </td>
                                <td className="px-4 py-3"><ChainCell chainId={item.from.chainId} chainName={item.from.chainName} /></td>
                                <td className="px-4 py-3">
                                    <span className="font-mono text-xs text-white">
                                        {formatEther(item.from.value.toString())}
                                        <span className="text-gray-500 ml-1">{item.from.unit}</span>
                                    </span>
                                </td>
                                <td className="px-2 py-3 text-center">
                                    <span className="text-gray-600 text-xs">→</span>
                                </td>
                                <td className="px-4 py-3"><ChainCell chainId={item.to.chainId} chainName={item.to.chainName} /></td>
                                <td className="px-4 py-3">
                                    <span className="font-mono text-xs text-white">
                                        {formatEther(item.to.value.toString())}
                                        <span className="text-gray-500 ml-1">{item.to.unit}</span>
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <StatusDot color={approveDot[item.approveStatus] ?? "bg-gray-500"} label={item.approveStatus} />
                                </td>
                                <td className="px-4 py-3">
                                    <StatusDot color={bridgeDot[item.bridgeStatus] ?? "bg-gray-500"} label={item.bridgeStatus} />
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <span className="text-xs text-gray-500 slow-font whitespace-nowrap">
                                        {new Date(item.createdAt).toLocaleString("en-US", {
                                            month: "short", day: "numeric",
                                            hour: "2-digit", minute: "2-digit",
                                        })}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── 모바일 카드 뷰 ── */}
            <div className="sm:hidden divide-y divide-white/5">
                {data.map((item, i) => (
                    <div key={i} onClick={() => onRowClick(item.id)}
                        className="px-4 py-3 hover:bg-white/4 cursor-pointer transition-colors">
                        {/* 상단: txn # + 날짜 */}
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-xs text-blue-400">#{item.id}</span>
                            <span className="text-xs text-gray-500 slow-font">
                                {new Date(item.createdAt).toLocaleString("en-US", {
                                    month: "short", day: "numeric",
                                    hour: "2-digit", minute: "2-digit",
                                })}
                            </span>
                        </div>
                        {/* 중단: from → to */}
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex-1">
                                <ChainCell chainId={item.from.chainId} chainName={item.from.chainName} />
                                <span className="font-mono text-xs text-white mt-0.5 block">
                                    {formatEther(item.from.value.toString())}
                                    <span className="text-gray-500 ml-1">{item.from.unit}</span>
                                </span>
                            </div>
                            <span className="text-gray-600 text-sm">→</span>
                            <div className="flex-1 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                    <span className="text-xs text-gray-300 slow-font">{item.to.chainName}</span>
                                    <img src={`/logo/${item.to.chainId}-logo.png`} className="w-4 h-4 rounded-full"
                                         onError={(e) => { e.currentTarget.style.display = "none"; }} />
                                </div>
                                <span className="font-mono text-xs text-white mt-0.5 block">
                                    {formatEther(item.to.value.toString())}
                                    <span className="text-gray-500 ml-1">{item.to.unit}</span>
                                </span>
                            </div>
                        </div>
                        {/* 하단: 상태 */}
                        <div className="flex items-center gap-3">
                            <StatusDot color={approveDot[item.approveStatus] ?? "bg-gray-500"} label={item.approveStatus} />
                            <span className="text-gray-700 text-xs">·</span>
                            <StatusDot color={bridgeDot[item.bridgeStatus] ?? "bg-gray-500"} label={item.bridgeStatus} />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
