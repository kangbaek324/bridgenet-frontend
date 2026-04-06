import { formatEther } from "ethers";

interface LogItemProps {
    data: any[];
    onRowClick: (id: number) => void;
}

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

export default function LogItem({ data, onRowClick }: LogItemProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-gray-800/30 text-left">
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 slow-font whitespace-nowrap">Txn ID</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 slow-font whitespace-nowrap">From Chain</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 slow-font whitespace-nowrap">Send Amount</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 slow-font whitespace-nowrap">To Chain</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 slow-font whitespace-nowrap">Receive Amount</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 slow-font whitespace-nowrap">Approve</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 slow-font whitespace-nowrap">Bridge</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 slow-font whitespace-nowrap">Time</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/40">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-600 slow-font">
                                No transactions found
                            </td>
                        </tr>
                    ) : data.map((item, index) => (
                        <tr
                            key={index}
                            className="hover:bg-gray-700/20 cursor-pointer transition-colors"
                            onClick={() => onRowClick(item.id)}
                        >
                            {/* ID */}
                            <td className="px-4 py-3">
                                <span className="font-mono text-xs text-blue-400 hover:text-blue-300">
                                    #{item.id}
                                </span>
                            </td>

                            {/* From Chain */}
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-1.5">
                                    <img
                                        src={`/logo/${item.from.chainId}-logo.png`}
                                        className="w-4 h-4 rounded-full"
                                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                                    />
                                    <span className="text-xs text-gray-300 slow-font">{item.from.chainName}</span>
                                </div>
                            </td>

                            {/* Send Amount */}
                            <td className="px-4 py-3">
                                <span className="text-xs text-white slow-font">
                                    {formatEther(item.from.value.toString())}
                                    <span className="text-gray-500 ml-1">{item.from.unit}</span>
                                </span>
                            </td>

                            {/* To Chain */}
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-1.5">
                                    <img
                                        src={`/logo/${item.to.chainId}-logo.png`}
                                        className="w-4 h-4 rounded-full"
                                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                                    />
                                    <span className="text-xs text-gray-300 slow-font">{item.to.chainName}</span>
                                </div>
                            </td>

                            {/* Receive Amount */}
                            <td className="px-4 py-3">
                                <span className="text-xs text-white slow-font">
                                    {formatEther(item.to.value.toString())}
                                    <span className="text-gray-500 ml-1">{item.to.unit}</span>
                                </span>
                            </td>

                            {/* Approve */}
                            <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded text-[11px] slow-font ${approveColor[item.approveStatus] ?? "text-gray-400"}`}>
                                    {item.approveStatus}
                                </span>
                            </td>

                            {/* Bridge */}
                            <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded text-[11px] slow-font ${bridgeColor[item.bridgeStatus] ?? "text-gray-400"}`}>
                                    {item.bridgeStatus}
                                </span>
                            </td>

                            {/* Time */}
                            <td className="px-4 py-3">
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
    );
}
