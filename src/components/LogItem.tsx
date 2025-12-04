import { formatEther } from "ethers";

export default function LogItem({ data }: { data: any[] }) {
    const truncateHash = (hash: string) => {
        if (hash == null) return;
        if (hash.length <= 20) return hash;
        return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
    };

    return (
        <div className="overflow-x-auto h-[510px] ">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-700/50">
                        <th className="px-3 py-1 text-xs font-semibold text-left text-gray-400">From Chain</th>
                        <th className="px-3 py-1 text-xs font-semibold text-left text-gray-400">Transaction Hash</th>
                        <th className="px-3 py-1 text-xs font-semibold text-left text-gray-400">From Value</th>
                        <th className="px-3 py-1 text-xs font-semibold text-left text-gray-400">To Chain</th>
                        <th className="px-3 py-1 text-xs font-semibold text-left text-gray-400">Transaction Hash</th>
                        <th className="px-3 py-1 text-xs font-semibold text-left text-gray-400">To Value</th>
                        <th className="px-3 py-1 text-xs font-semibold text-left text-gray-400">Status</th>
                        <th className="px-3 py-1 text-xs font-semibold text-left text-gray-400">Exchanged At</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr 
                            key={index}
                            className="transition-colors border-gray-700/30 hover:bg-gray-700/30"
                        >
                            <td className="px-3 py-3">
                                <div className="flex items-center gap-1.5">
                                    <img 
                                        src={`/logo/${item.from_chain_id}-logo.png`}
                                        alt={item.from_chain_name}
                                        className="w-4 h-4 rounded-full"
                                        onError={(e) => {
                                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"%3E%3Ccircle cx="8" cy="8" r="8" fill="%234299e1"/%3E%3C/svg%3E';
                                        }}
                                    />
                                    <span className="text-xs font-medium text-blue-300">
                                        {item.from_chain_name}
                                    </span>
                                </div>
                            </td>
                            <td className="px-3 py-3">
                                <span 
                                    className="text-[10px] font-mono text-gray-400 cursor-help"
                                    title={item.from_transaction_hash}
                                >
                                    {truncateHash(item.from_transaction_hash)}
                                </span>
                            </td>
                            <td className="px-3 py-3">
                                <span className="text-xs font-semibold text-emerald-400">
                                    {formatEther(item.from_value.toString())} {item.from_unit}
                                </span>
                            </td>
                            <td className="px-3 py-3">
                                <div className="flex items-center gap-1.5">
                                    <img 
                                        src={`/logo/${item.to_chain_id}-logo.png`}
                                        alt={item.to_chain_name}
                                        className="w-4 h-4 rounded-full"
                                        onError={(e) => {
                                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"%3E%3Ccircle cx="8" cy="8" r="8" fill="%239f7aea"/%3E%3C/svg%3E';
                                        }}
                                    />
                                    <span className="text-xs font-medium text-purple-300">
                                        {item.to_chain_name}
                                    </span>
                                </div>
                            </td>
                            <td className="px-3 py-3">
                                <span 
                                    className="text-[10px] font-mono text-gray-400 cursor-help"
                                    title={item.to_transaction_hash}
                                >
                                    {truncateHash(item.to_transaction_hash)}
                                </span>
                            </td>
                            <td className="px-3 py-2">
                                <span className="text-xs font-semibold text-emerald-400">
                                    {formatEther(item.to_value.toString())} {item.to_unit}
                                </span>
                            </td>
                            <td className="px-3 py-2">
                                <span className="text-[10px] text-gray-400">
                                    {item.status}
                                </span>
                            </td>
                            <td className="px-3 py-2">
                                <span className="text-[10px] text-gray-400">
                                    {new Date(item.exchanged_at).toLocaleString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
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