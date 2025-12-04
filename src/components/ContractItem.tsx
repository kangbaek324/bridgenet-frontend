export default function ContractItem() {
    return (
        <div className="w-full p-4 border border-gray-700 rounded-lg bg-gray-800/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-1.5 border border-gray-600 rounded-lg bg-gray-900/50">
                    <img 
                        src="./logo/ethereum.png" 
                        alt="Ethereum" 
                        className="w-8 h-8" 
                    />
                </div>
                <div className="flex-1">
                    <h3 className="text-base font-semibold text-white">Ethereum Contract</h3>
                    <p className="text-xs text-gray-400">Smart Contract Details</p>
                </div>
            </div>

            <div className="mb-4 space-y-3">
                <div className="p-3 border rounded-lg bg-gray-900/50 border-gray-700/50">
                    <p className="mb-1.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Contract Address</p>
                    <p className="font-mono text-xs text-white break-all">
                        0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
                    </p>
                </div>

                <div className="p-3 border rounded-lg bg-gray-900/50 border-gray-700/50">
                    <p className="mb-1.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Contract Balance</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-xl font-bold text-white">125.84</p>
                        <p className="text-xs text-gray-400">ETH</p>
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