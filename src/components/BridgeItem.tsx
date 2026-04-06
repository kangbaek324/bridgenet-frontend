interface ChainInfo {
    chainId: number;
    chainName: string;
}

interface BridgeItemProps {
    direction: string;
    chains: ChainInfo[];
    chainsLoading: boolean;
    selectedChain: string;
    onChainChange: (chain: string) => void;
    value: string;
    onValueChange?: (value: string) => void;
    readOnly?: boolean;
}

export default function BridgeItem({
    direction,
    chains,
    chainsLoading,
    selectedChain,
    onChainChange,
    value,
    onValueChange,
    readOnly = false
}: BridgeItemProps) {

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!readOnly && onValueChange) {
            const newValue = e.target.value;
            if (parseFloat(newValue) < 0) return;
            onValueChange(newValue);
        }
    };

    return (
        <div className="flex py-6 bg-[#333333] p-5 color rounded-lg mt-5">
            <div className="w-[30%]">
                <p className="mb-3 text-sm font-light text-slate-400">{direction}</p>
                <input
                    className="text-4xl text-white bg-transparent border-0 focus:outline-0 mbc-font"
                    placeholder="0.00"
                    type="number"
                    min={0.00001}
                    value={value}
                    onChange={handleValueChange}
                    readOnly={readOnly}
                />
            </div>
            <div className="w-[70%] text-right">
                <select
                    className="pb-1.5 text-white text-base slow-font bg-[#333333] focus:outline-none cursor-pointer disabled:opacity-50"
                    value={selectedChain}
                    onChange={(e) => onChainChange(e.target.value)}
                    disabled={chainsLoading}
                >
                    {chainsLoading ? (
                        <option value="">Loading...</option>
                    ) : chains.length === 0 ? (
                        <option value="">No chains</option>
                    ) : (
                        chains.map(chain => (
                            <option key={chain.chainId} value={chain.chainId.toString()}>
                                {chain.chainName}
                            </option>
                        ))
                    )}
                </select>
            </div>
        </div>
    );
}
