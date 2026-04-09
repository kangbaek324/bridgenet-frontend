import { formatEther } from "ethers";

interface TransactionInfo {
    hash: string;
    processedBlock: string;
    status: string;
}

interface BridgeInfo {
    chain: {
        chainId: number;
        chainName: string;
        value: string;
    };
    tx: TransactionInfo[];
}

interface DetailData {
    id: number;
    from: BridgeInfo;
    to: BridgeInfo;
    approveStatus: string;
    bridgeStatus: string;
    createdAt: string;
}

interface LogDetailProps {
    detail: DetailData;
    onClose: () => void;
}

function truncateHash(hash: string) {
    if (!hash) return "-";
    if (hash.length <= 20) return hash;
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

function StatusBadge({ value }: { value: string }) {
    const colorMap: Record<string, string> = {
        APPROVE: 'text-green-400',
        REJECT: 'text-red-400',
        PENDING: 'text-yellow-400',
        COMPLETED: 'text-green-400',
        FAILED: 'text-red-400',
        IN_PROGRESS: 'text-blue-400',
        CONFIRMED: 'text-green-400',
        DROPPED: 'text-red-400',
    };
    return (
        <span className={`text-xs font-medium ${colorMap[value] ?? 'text-gray-400'}`}>
            {value}
        </span>
    );
}

export default function LogDetail({ detail, onClose }: LogDetailProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="w-[600px] max-h-[80vh] overflow-y-auto rounded-2xl bg-gray-900 border border-gray-700 p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl text-white slow-font">Request #{detail.id}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors text-lg leading-none"
                    >
                        ✕
                    </button>
                </div>

                {/* Status */}
                <div className="flex gap-4 mb-5">
                    <div className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700">
                        <p className="text-xs text-gray-400 mb-1">Approve Status</p>
                        <StatusBadge value={detail.approveStatus} />
                    </div>
                    <div className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700">
                        <p className="text-xs text-gray-400 mb-1">Bridge Status</p>
                        <StatusBadge value={detail.bridgeStatus} />
                    </div>
                    <div className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700">
                        <p className="text-xs text-gray-400 mb-1">Created At</p>
                        <span className="text-xs text-gray-300">
                            {new Date(detail.createdAt).toLocaleString('en-US', {
                                month: 'short', day: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                            })}
                        </span>
                    </div>
                </div>

                {/* From / To */}
                {(['from', 'to'] as const).map((side) => {
                    const info = detail[side];
                    const isFrom = side === 'from';
                    return (
                        <div key={side} className="mb-4 p-4 rounded-lg bg-gray-800 border border-gray-700">
                            <div className="flex items-center gap-2 mb-3">
                                <img
                                    src={`/logo/${info.chain.chainId}-logo.png`}
                                    className="w-5 h-5 rounded-full"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                                <span className={`text-sm font-semibold ${isFrom ? 'text-blue-300' : 'text-purple-300'}`}>
                                    {isFrom ? 'From' : 'To'}: {info.chain.chainName}
                                </span>
                                <span className="ml-auto text-sm font-bold text-emerald-400">
                                    {formatEther(info.chain.value.toString())}
                                </span>
                            </div>

                            {info.tx.length === 0 ? (
                                <p className="text-xs text-gray-500">No transactions yet</p>
                            ) : (
                                <div className="space-y-2">
                                    {info.tx.map((tx, i) => (
                                        <div key={i} className="flex items-center gap-3 p-2 rounded bg-gray-900/60">
                                            <span
                                                className="flex-1 font-mono text-[11px] text-gray-300 cursor-help"
                                                title={tx.hash}
                                            >
                                                {truncateHash(tx.hash)}
                                            </span>
                                            <span className="text-[10px] text-gray-500">
                                                Block {tx.processedBlock ?? '-'}
                                            </span>
                                            <StatusBadge value={tx.status} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
