import axios from "axios";
import { formatEther } from "ethers";
import { useState } from "react";

export default function ContractItem({ chainInfo }) {
    const [loading, setLoading] = useState(false);
    const [fetchStatus, setFetchStatus] = useState("");
    const [hash, setHash] = useState("");

    const fetchRequestWhiteList = async (chainId: string) => {
        try {
            setFetchStatus("");
            setHash("");
            setLoading(true);
            if (!localStorage.getItem("accessToken")) {
                alert("Please Login in My page");
                return;
            }
            const res = await axios.post(
                `http://localhost:8081/api/chains/${chainId}/contract/whitelist`,
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
            );
            setHash(res.data.data.transactionHash);
            setFetchStatus("success");
        } catch (err) {
            console.error(err);
            setFetchStatus("fail");
        } finally {
            setLoading(false);
        }
    };

    const fetchContractBalance = async (chainId: string) => {
        try {
            setFetchStatus("");
            setHash("");
            setLoading(true);
            await axios.get(`http://localhost:8081/api/chains/${chainId}/contract/balance`);
            setFetchStatus("success");
        } catch (err) {
            console.error(err);
            setFetchStatus("fail");
        } finally {
            setLoading(false);
        }
    };

    const btnBase = "flex-1 px-3 py-1.5 text-[11px] font-mono border transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

    return (
        <div className="border border-gray-700 bg-black/20 p-4">
            {/* chain header */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
                <img
                    src={`/logo/${chainInfo.chainId}-logo.png`}
                    className="w-5 h-5"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                <span className="text-sm font-mono text-white">{chainInfo.chainName}</span>
                <span className={`ml-auto text-[10px] font-mono px-1.5 py-0.5 border ${
                    chainInfo.chainStatus === "ACTIVATE"
                        ? "text-emerald-400 border-emerald-800"
                        : "text-gray-500 border-gray-700"
                }`}>
                    {chainInfo.chainStatus}
                </span>
            </div>

            {/* contract address */}
            <div className="mb-3">
                <p className="text-[9px] font-mono text-gray-600 tracking-widest uppercase mb-1">Contract Address</p>
                <p className="font-mono text-[11px] text-gray-400 break-all">{chainInfo.smartContractAddress}</p>
            </div>

            {/* balance */}
            <div className="mb-4">
                <p className="text-[9px] font-mono text-gray-600 tracking-widest uppercase mb-1">Balance</p>
                <p className="font-mono text-lg text-white">
                    {formatEther(chainInfo.smartContractValue.toString())}
                    <span className="text-gray-500 text-xs ml-1">{chainInfo.unit}</span>
                </p>
            </div>

            {/* status */}
            {fetchStatus === "success" && (
                <p className="mb-3 text-[11px] font-mono text-emerald-400 break-all">
                    ✓ {hash ? `tx: ${hash}` : "success"}
                </p>
            )}
            {fetchStatus === "fail" && (
                <p className="mb-3 text-[11px] font-mono text-red-400">✗ request failed</p>
            )}

            {/* buttons */}
            <div className="flex gap-2">
                <button
                    className={`${btnBase} text-blue-400 border-blue-800 hover:bg-blue-900/20`}
                    onClick={() => fetchRequestWhiteList(chainInfo.chainId)}
                    disabled={loading}
                >
                    {loading ? "..." : "Whitelist"}
                </button>
                <button
                    className={`${btnBase} text-gray-400 border-gray-700 hover:border-gray-500 hover:bg-white/5`}
                    onClick={() => fetchContractBalance(chainInfo.chainId)}
                    disabled={loading}
                >
                    {loading ? "..." : "Refresh"}
                </button>
            </div>
        </div>
    );
}
