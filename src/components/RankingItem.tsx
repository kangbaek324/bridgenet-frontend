import { formatEther } from "ethers";

export default function RankingItem({ ranking, chainName, imageUrl, value, unit, exchangeRate}) {
    return (
        <tr className="slow-font">
            <td className="py-3">#{ranking}</td>
            <td className="flex items-center justify-start gap-2 py-3">
                <img 
                    src={imageUrl}
                    className="w-4 h-4 ml-5 rounded-full"
                />
                <p className="leading-10">{chainName}</p>
            </td>
            <td className="py-3 text-center">
                <p>{formatEther(value.toString())}</p>
            </td>
            <td className="py-3">
                <p>{unit}</p>
            </td>
            <td className="text-left">
                <p className="ml-15">{exchangeRate}</p>
            </td>
        </tr>
    );
}