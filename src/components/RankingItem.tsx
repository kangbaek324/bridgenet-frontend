import { formatEther } from "ethers";

const medalColor: Record<number, string> = {
    1: "text-yellow-400",
    2: "text-gray-300",
    3: "text-amber-600",
};

export default function RankingItem({ ranking, chainName, imageUrl, value, unit }) {
    return (
        <tr className="hover:bg-gray-700/20 transition-colors">
            <td className="px-4 py-3">
                <span className={`text-sm font-semibold slow-font ${medalColor[ranking] ?? "text-gray-500"}`}>
                    #{ranking}
                </span>
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <img
                        src={imageUrl}
                        className="w-5 h-5 rounded-full"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                    <span className="text-sm text-white slow-font">{chainName}</span>
                </div>
            </td>
            <td className="px-4 py-3 text-right">
                <span className="text-sm text-emerald-400 slow-font">{formatEther(value.toString())}</span>
            </td>
            <td className="px-4 py-3">
                <span className="text-xs text-gray-500 slow-font">{unit}</span>
            </td>
        </tr>
    );
}
