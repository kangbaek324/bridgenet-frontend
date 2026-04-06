import { formatEther } from "ethers";

export default function RankingItem({ ranking, chainName, imageUrl, value, unit }) {
    return (
        <tr className="hover:bg-white/5 transition-colors">
            <td className="px-3 py-3">
                <span className="font-mono text-sm text-gray-600">#{ranking}</span>
            </td>
            <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                    <img
                        src={imageUrl}
                        className="w-4 h-4"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                    <span className="font-mono text-sm text-white">{chainName}</span>
                </div>
            </td>
            <td className="px-3 py-3 text-right">
                <span className="font-mono text-sm text-emerald-400">{formatEther(value.toString())}</span>
            </td>
            <td className="px-3 py-3">
                <span className="font-mono text-xs text-gray-500">{unit}</span>
            </td>
        </tr>
    );
}
