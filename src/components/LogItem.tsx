import { formatEther } from "ethers";

interface LogItemProps {
    data: any[];
    onRowClick: (id: number) => void;
}

const approveColor: Record<string, string> = {
    APPROVE: "text-emerald-400",
    REJECT: "text-red-400",
    PENDING: "text-yellow-400",
};
const bridgeColor: Record<string, string> = {
    COMPLETED: "text-emerald-400",
    FAILED: "text-red-400",
    IN_PROGRESS: "text-blue-400",
    PENDING: "text-yellow-400",
};

export default function LogItem({ data, onRowClick }: LogItemProps) {
    return (
        <div className="overflow-x-auto h-[510px]">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-gray-600">
                        <th className="px-3 py-2 text-[10px] font-mono font-semibold tracking-widest text-gray-500 uppercase">From</th>
                        <th className="px-3 py-2 text-[10px] font-mono font-semibold tracking-widest text-gray-500 uppercase">Amount</th>
                        <th className="px-3 py-2 text-[10px] font-mono font-semibold tracking-widest text-gray-500 uppercase">To</th>
                        <th className="px-3 py-2 text-[10px] font-mono font-semibold tracking-widest text-gray-500 uppercase">Amount</th>
                        <th className="px-3 py-2 text-[10px] font-mono font-semibold tracking-widest text-gray-500 uppercase">Approve</th>
                        <th className="px-3 py-2 text-[10px] font-mono font-semibold tracking-widest text-gray-500 uppercase">Bridge</th>
                        <th className="px-3 py-2 text-[10px] font-mono font-semibold tracking-widest text-gray-500 uppercase">Time</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {data.map((item, index) => (
                        <tr
                            key={index}
                            className="hover:bg-white/5 cursor-pointer transition-colors"
                            onClick={() => onRowClick(item.id)}
                        >
                            <td className="px-3 py-3">
                                <div className="flex items-center gap-1.5">
                                    <img
                                        src={`/logo/${item.from.chainId}-logo.png`}
                                        className="w-3.5 h-3.5"
                                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                                    />
                                    <span className="text-xs text-blue-300 font-mono">{item.from.chainName}</span>
                                </div>
                            </td>
                            <td className="px-3 py-3">
                                <span className="text-xs font-mono text-emerald-400">
                                    {formatEther(item.from.value.toString())} <span className="text-gray-500">{item.from.unit}</span>
                                </span>
                            </td>
                            <td className="px-3 py-3">
                                <div className="flex items-center gap-1.5">
                                    <img
                                        src={`/logo/${item.to.chainId}-logo.png`}
                                        className="w-3.5 h-3.5"
                                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                                    />
                                    <span className="text-xs text-purple-300 font-mono">{item.to.chainName}</span>
                                </div>
                            </td>
                            <td className="px-3 py-3">
                                <span className="text-xs font-mono text-emerald-400">
                                    {formatEther(item.to.value.toString())} <span className="text-gray-500">{item.to.unit}</span>
                                </span>
                            </td>
                            <td className="px-3 py-3">
                                <span className={`text-[10px] font-mono font-medium ${approveColor[item.approveStatus] ?? "text-gray-400"}`}>
                                    {item.approveStatus}
                                </span>
                            </td>
                            <td className="px-3 py-3">
                                <span className={`text-[10px] font-mono font-medium ${bridgeColor[item.bridgeStatus] ?? "text-gray-400"}`}>
                                    {item.bridgeStatus}
                                </span>
                            </td>
                            <td className="px-3 py-3">
                                <span className="text-[10px] font-mono text-gray-500">
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
