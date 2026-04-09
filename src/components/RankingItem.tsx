import { formatEther } from "ethers";

const medal: Record<number, { icon: string; color: string }> = {
  1: { icon: "", color: "text-yellow-400" },
  2: { icon: "", color: "text-gray-300" },
  3: { icon: "", color: "text-amber-600" },
};

export default function RankingItem({
  ranking,
  chainName,
  imageUrl,
  value,
  unit,
}) {
  const m = medal[ranking];
  return (
    <tr className="transition-colors hover:bg-white/4">
      <td className="px-4 py-3">
        {m ? (
          <span className={`text-sm slow-font ${m.color}`}>
            {m.icon} #{ranking}
          </span>
        ) : (
          <span className="text-sm text-gray-500 slow-font">#{ranking}</span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <img
            src={imageUrl}
            className="w-5 h-5 rounded-full"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <span className="text-sm text-white slow-font">{chainName}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="font-mono text-sm text-emerald-400">
          {formatEther(value.toString())}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs text-gray-500 slow-font">{unit}</span>
      </td>
    </tr>
  );
}
