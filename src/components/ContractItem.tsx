import { formatEther } from "ethers";

export default function ContractItem({ chainInfo }) {
    return (
        <div className="w-full p-4 border border-gray-700 rounded-lg bg-gray-800/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-1.5 border border-gray-600 rounded-lg bg-gray-900/50">
                    <img 
                        src={`/logo/${chainInfo.chain_id}-logo.png`} 
                        alt="Ethereum" 
                        className="w-8 h-8" 
                    />
                </div>
                <div className="flex-1">
                    <h3 className="text-base font-semibold text-white">{chainInfo.chain_name} Contract</h3>
                </div>
            </div>

            <div className="mb-4 space-y-3">
                <div className="p-3 border rounded-lg bg-gray-900/50 border-gray-700/50">
                    <p className="mb-1.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Contract Address</p>
                    <p className="font-mono text-xs text-white break-all">
                        {chainInfo.smart_contract_address}
                    </p>
                </div>

                <div className="p-3 border rounded-lg bg-gray-900/50 border-gray-700/50">
                    <p className="mb-1.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Contract Balance</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-xl font-bold text-white">{formatEther(chainInfo.smart_contract_value.toString())}</p>
                        <p className="text-xs text-gray-400">{chainInfo.unit}</p>
                    </div>
                </div>
            </div>

            <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 text-xs font-medium text-white transition-all border border-blue-500 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Request WhiteList
                </button>
                <button className="flex-1 px-3 py-2 text-xs font-medium text-white transition-all border border-gray-700 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Refresh Balance
                </button>
            </div>
        </div>
    );
}